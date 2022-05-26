import { NftId } from '@src/@types/nft';
import { UserId } from '@src/@types/user';
import { MIME_EXTENSIONS } from '@src/config/uploads';
import { STORAGE } from '@src/config/vars';
import { APIError } from '@src/errors/apiError';
import { nftErrors } from '@src/errors/nfts';
import { userErrors } from '@src/errors/users';
import s3Lib from '@src/library/s3';
import {
	getDataBuyProcess,
	NFTBuyData,
} from '@src/queries/nfts/getDataBuyProcess';
import { insertOne } from '@src/queries/nfts/insertOne';
import { generateNftName } from '@src/utils/nfts';
import { assertNonNullish } from '@src/utils/types';

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
	const nft_id = await insertOne({
		description,
		price,
		owner_id,
		creators,
		path: nftSaved.path,
	});

	return { nft_id, path: nftSaved.path };
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
 * 1. Check the balances to see if the buyer can pay the amount
 * 2. Calculate the new balances for the buyer, the seller and the royalties for the creators
 * 3. Transfer the ownership
 * 4. Save the new data
 */
export async function buy(nft_id: NftId, buyer: UserId) {
	const { buyerData, nftData } = await getDataBuyProcess(nft_id, buyer);

	assertNonNullish(nftData, nftErrors.NFT_NOT_FOUND);
	assertNonNullish(buyerData, userErrors.USER_NOT_FOUND);

	if (buyerData.balance < nftData[0].price)
		throw new APIError(userErrors.USER_INSUFICIENT_BALANCE);

	const pricingData = calculateRoyalties(nftData[0].price, nftData);
	const newBalances = calculateNewBalances(buyerData, nftData, pricingData);

	return { buyerData, nftData, pricingData, newBalances };
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
export function calculateRoyalties(price: number, creators: NFTBuyData[]) {
	// This should not happen since we are getting the price from the database and not from the user input.
	if (price <= 0) throw new APIError(nftErrors.NFT_BAD_PRICING);

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
	buyerData: { id: string; name: string; email: string; balance: number },
	nftData: NFTBuyData[],
	pricingData: PricingData
) {
	const newBalances = {
		buyer_id: parseFloat((buyerData.balance - nftData[0].price).toFixed(2)),
		old_owner_id: parseFloat(
			(nftData[0].owner_balance + pricingData.toOwner).toFixed(2)
		),
		creators: nftData.map((x) => ({
			id: x.user_id,
			balance: parseFloat(
				(x.balance + pricingData.toCreators).toFixed(2)
			),
		})),
	};

	if (
		isCurrentOwnerCreatorToo(
			nftData[0].owner_id,
			nftData.map((c) => c.user_id)
		)
	) {
		newBalances.old_owner_id = parseFloat(
			(newBalances.old_owner_id + pricingData.toCreators).toFixed(2)
		);
		newBalances.creators = newBalances.creators.filter(
			(x) => x.id === nftData[0].owner_id
		);
	}

	return newBalances;
}

export function isCurrentOwnerCreatorToo(owner_id: UserId, creators: UserId[]) {
	return creators.includes(owner_id);
}
