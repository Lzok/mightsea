import { klona } from 'klona/lite';
import { NftId } from '@src/@types/nft';
import { UserBasicData, UserId } from '@src/@types/user';
import logger from '@src/config/logger';
import { MIME_EXTENSIONS } from '@src/config/uploads';
import { STORAGE } from '@src/config/vars';
import { APIError } from '@src/errors/apiError';
import { nftErrors } from '@src/errors/nfts';
import { userErrors } from '@src/errors/users';
import { commonErrors } from '@src/errors/common';
import s3Lib from '@src/library/s3';
import {
	getDataBuyProcess,
	NFTBuyData,
} from '@src/queries/nfts/getDataBuyProcess';
import { insertOne } from '@src/queries/nfts/insertOne';
import { generateNftName } from '@src/utils/nfts';
import { assertNonNullish } from '@src/utils/types';
import { NewBalances, updateAfterBuy } from '@src/queries/nfts/updateAfterBuy';
import { getNftById } from '@src/queries/nfts/getById';
import { updateNftPrice } from '@src/queries/nfts/updateNftPrice';
import { getFeed } from '@src/queries/nfts/getFeed';

export async function feed(page: number, limit: number) {
	return getFeed(page, limit);
}

type MintArgs = {
	owner_id: UserId;
	price: number;
	description: string;
	creators: UserId[];
	nft: Express.Multer.File;
};
export async function mint(dataToMint: MintArgs) {
	const nftSaved = await saveNftToS3(dataToMint.nft);

	const { description, price, owner_id, creators } = dataToMint;
	const nft = await insertOne({
		description,
		price,
		owner_id,
		creators,
		path: nftSaved.path,
	});

	return {
		nft_id: nft.id,
		description: nft.description,
		price: nft.price,
		path: nft.path,
		owner_id: nft.owner_id,
	};
}

export async function saveNftToS3(nft: Express.Multer.File) {
	const extension =
		MIME_EXTENSIONS[<'image/png' | 'default'>nft.mimetype] ??
		MIME_EXTENSIONS.default;
	const fileName = generateNftName(extension);

	const metadata = {
		'Content-Type': nft.mimetype,
	};

	return s3Lib.uploadImage(STORAGE.staticBucket, fileName, nft, metadata);
}

/**
 * Steps for the buy process:
 * 1. Check for the existence of the data
 * 2. Check if the user who wants to buy the nft is not already the owner
 * 3. Check the balances to see if the buyer can pay the amount
 * 4. Calculate the new balances for the buyer, the seller and the royalties for the creators
 * 5. Transfer the ownership
 * 6. Save the new data
 */
export async function buy(nft_id: NftId, buyer: UserId) {
	const { buyerData, nftData } = await getDataBuyProcess(nft_id, buyer);

	assertNonNullish(nftData, nftErrors.NFT_NOT_FOUND);
	assertNonNullish(buyerData, userErrors.USER_NOT_FOUND);

	if (nftData.owner_id === buyer)
		throw new APIError(userErrors.USER_ALREADY_OWNER);
	if (buyerData.balance < nftData.price)
		throw new APIError(userErrors.USER_INSUFICIENT_BALANCE);

	const pricingData = calculateRoyalties(nftData.price, nftData.creators);
	const newBalances = calculateNewBalances(buyerData, nftData, pricingData);

	const savedBuy = await updateAfterBuy(
		nft_id,
		buyer,
		nftData.owner_id,
		newBalances
	);

	return { buyerData, nftData, pricingData, newBalances, savedBuy };
}

type PricingData = {
	royaltyToShare: number;
	toOwner: number;
	toCreators: number;
};
/**
 * This fn calculates what amount will go to to the owner,
 * and what amount will go to each of the creators.
 */
export function calculateRoyalties(
	price: number,
	creators: NFTBuyData['creators']
) {
	// This should not happen since we are getting the price from the database and not from the user input.
	if (price <= 0) throw new APIError(nftErrors.NFT_BAD_PRICING);
	logger.info('CREATORS', { creators });
	// 20% of the selling price will go to the creators as royalties
	const royaltyToShare = parseFloat(((price / 100) * 20).toFixed(2));
	const howMuchToOwner = parseFloat((price - royaltyToShare).toFixed(2));
	const qCreators = creators.length;
	const howMuchForEachCreator = royaltyToShare / qCreators;

	return {
		royaltyToShare,
		toOwner: howMuchToOwner,
		toCreators: howMuchForEachCreator,
	};
}

export function calculateNewBalances(
	buyerData: UserBasicData,
	nftData: NFTBuyData,
	pricingData: PricingData
) {
	const someNewBalances = {
		buyer_id: parseFloat((buyerData.balance - nftData.price).toFixed(2)),
		old_owner_id: 0,
	};
	const creatorsCopy = klona(nftData.creators);

	/**
	 * If the current owner is also one of the creators of the "current selling nft"
	 * We have to sum two things to his balance:
	 * 1. The 80% of the selling price goes to him for being the owner
	 * 2. The royalty that correspond to him, based on how many creators the nft have
	 *
	 * In this case, if the current owner is also a creator, we remove him from the
	 * creators array and sum the royalty + selling price under the old_owner_id key.
	 */
	const [ownerAsCreator, creators] = separateOwnerFromCreatorsIfExist(
		nftData.owner_id,
		creatorsCopy
	);

	if (ownerAsCreator) {
		someNewBalances.old_owner_id = parseFloat(
			someNewBalances.old_owner_id + pricingData.toCreators.toFixed(2)
		);
	}

	const newBalances: NewBalances = {
		...someNewBalances,
		old_owner_id: parseFloat(
			(
				someNewBalances.old_owner_id +
				nftData.owner_balance +
				pricingData.toOwner
			).toFixed(2)
		),
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		creators: creators!.map((c) => ({
			id: c.user_id,
			balance: parseFloat(
				(c.balance + pricingData.toCreators).toFixed(2)
			),
		})),
	};

	return newBalances;
}

export function separateOwnerFromCreatorsIfExist(
	owner_id: UserId,
	creators: NFTBuyData['creators']
) {
	const arr = klona(creators);
	const index = creators.findIndex((c) => c.user_id === owner_id);
	let owner = null;

	if (index > -1) {
		owner = arr.splice(index, 1);
	}
	return [owner, arr];
}

export async function updatePrice(
	nft_id: NftId,
	user_id: UserId,
	price: number
) {
	try {
		const nft = await getNftById(nft_id);

		if (!nft) throw new APIError(nftErrors.NFT_NOT_FOUND);
		if (nft.owner_id !== user_id)
			throw new APIError({
				...commonErrors.FORBIDDEN,
				message:
					'The user cannot update the price because is not the owner',
			});

		const updatedNft = await updateNftPrice(nft_id, price);

		return updatedNft;
	} catch (error) {
		logger.error('Error updating the nft price.');
		throw error;
	}
}

