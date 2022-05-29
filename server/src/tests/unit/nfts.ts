import logger from '@src/config/logger';
import * as nftController from '@src/controllers/nfts';
import { APIError } from '@src/errors/apiError';
import { NFTBuyData } from '@src/queries/nfts/getDataBuyProcess';

const creators: NFTBuyData['creators'] = [
	{
		user_id: 'userid1',
		balance: 100,
	},
	{
		user_id: 'userid2',
		balance: 100,
	},
];
const owner_id_included = 'userid1';
const owner_id_not_included = 'useridzz71';

// With a price of 100 we get this result divided between 2 creators
const pricingData = {
	royaltyToShare: 20,
	toOwner: 80,
	toCreators: 10,
};

const newBalancesOwnerCreator = {
	buyer_id: 0,
	old_owner_id: 90,
	creators: [
		{
			id: '7dd619dd-b997-4351-9541-4d8989c58667',
			balance: 115.5,
		},
	],
};

const newBalancesOwnerNotCreator = {
	buyer_id: 0,
	old_owner_id: 80,
	creators: [
		{
			id: '1134e9e0-02ae-4567-9adf-220ead36a6ef',
			balance: 123.5,
		},
		{
			id: '7dd619dd-b997-4351-9541-4d8989c58667',
			balance: 115.5,
		},
	],
};

const buyerData = {
	id: '78f8ce6f-1940-404e-be23-60b8f77926f5',
	name: 'Abraham',
	email: 'achid@silnmy.com',
	balance: 100,
};

const nftDataOwnerCreator = {
	id: '5081e31e-084a-450d-b16d-23a7eedefd11',
	price: 100,
	owner_id: '23e3412f-e10d-4ff8-9953-3f805b532782',
	owner_balance: 0,
	creators: [
		{
			user_id: '23e3412f-e10d-4ff8-9953-3f805b532782',
			balance: 0,
		},
		{
			user_id: '7dd619dd-b997-4351-9541-4d8989c58667',
			balance: 105.5,
		},
	],
};

const nftDataOwnerNotCreator = {
	id: '5081e31e-084a-450d-b16d-23a7eedefd11',
	price: 100,
	owner_id: '23e3412f-e10d-4ff8-9953-3f805b532782',
	owner_balance: 0,
	creators: [
		{
			user_id: '1134e9e0-02ae-4567-9adf-220ead36a6ef',
			balance: 113.5,
		},
		{
			user_id: '7dd619dd-b997-4351-9541-4d8989c58667',
			balance: 105.5,
		},
	],
};

/**
 * This is for the case where the buyer is also one of the creators
 */
const nftDataBuyerAlsoCreator = {
	id: '5081e31e-084a-450d-b16d-23a7eedefd11',
	price: 100,
	owner_id: '23e3412f-e10d-4ff8-9953-3f805b532782',
	owner_balance: 100,
	creators: [
		{
			user_id: '78f8ce6f-1940-404e-be23-60b8f77926f5',
			balance: 100,
		},
		{
			user_id: '7dd619dd-b997-4351-9541-4d8989c58667',
			balance: 100,
		},
	],
};

const newBalancesBuyerAlsoCreator = {
	buyer_id: 10,
	old_owner_id: 180,
	creators: [
		{
			id: '7dd619dd-b997-4351-9541-4d8989c58667',
			balance: 110,
		},
	],
};

/**
 * This is for the case where the buyer is also one of the creators AND
 * the current owner is also a creator.
 * The scenario is one co_cocreator buying the NFT to the creator that also is the current owner.
 */
const nftDataBuyerAndOwnerAlsoCreator = {
	id: '5081e31e-084a-450d-b16d-23a7eedefd11',
	price: 100,
	owner_id: '23e3412f-e10d-4ff8-9953-3f805b532782',
	owner_balance: 100,
	creators: [
		{
			user_id: '78f8ce6f-1940-404e-be23-60b8f77926f5',
			balance: 100,
		},
		{
			user_id: '23e3412f-e10d-4ff8-9953-3f805b532782',
			balance: 100,
		},
	],
};
const newBalancesBuyerAndOwnerAlsoCreator = {
	buyer_id: 10,
	old_owner_id: 190,
	creators: [],
};

describe('NFTs controller', () => {
	describe('Fn calculateRoyalties', () => {
		test('It should calculate the amounts ok when there is more than one creator', () => {
			const price = 42;

			const result = nftController.calculateRoyalties(price, creators);

			expect(result.royaltyToShare).toBe(8.4);
			expect(result.toOwner).toBe(33.6);
			expect(result.toCreators).toBe(4.2);
		});

		test('It should throw if we pass zero as the price', () => {
			const fn = nftController.calculateRoyalties;
			const price = 0;

			expect(() => {
				fn(price, creators);
			}).toThrow(APIError);
		});
	});

	describe('Fn separateUserFromCreatorsIfExist', () => {
		it('Should return the owner as a separate item because it exists in the creators', () => {
			const [ownerAsCreator, co_creators] =
				nftController.separateUserFromCreatorsIfExist(
					owner_id_included,
					creators
				);

			expect(ownerAsCreator).toBeTruthy;
			if (!ownerAsCreator)
				throw new Error('ownerAsCreator should not be null here');

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			expect(ownerAsCreator[0].user_id).toBe(owner_id_included);
			expect(co_creators.length).toBe(1);
		});

		it('Should return null as the owner because it does not exist exists in the creators', () => {
			const [ownerAsCreator, co_creators] =
				nftController.separateUserFromCreatorsIfExist(
					owner_id_not_included,
					creators
				);

			expect(ownerAsCreator).toBe(null);
			expect(co_creators.length).toBe(2);
		});
	});

	describe('Fn calculateNewBalances', () => {
		it('Should calculate the balance when the owner is also creator of the nft', () => {
			const result = nftController.calculateNewBalances(
				buyerData,
				nftDataOwnerCreator,
				pricingData
			);

			expect(result).toStrictEqual(newBalancesOwnerCreator);
		});

		it('Should calculate the balance when the owner is also creator of the nft', () => {
			const result = nftController.calculateNewBalances(
				buyerData,
				nftDataOwnerNotCreator,
				pricingData
			);

			expect(result).toStrictEqual(newBalancesOwnerNotCreator);
		});

		it('Should calculate the balance when the buyer is also creator of the nft', () => {
			const result = nftController.calculateNewBalances(
				buyerData,
				nftDataBuyerAlsoCreator,
				pricingData
			);

			expect(result).toStrictEqual(newBalancesBuyerAlsoCreator);
		});

		it('Should calculate the balance when the buyer and the current owner are also creators of the nft', () => {
			const result = nftController.calculateNewBalances(
				buyerData,
				nftDataBuyerAndOwnerAlsoCreator,
				pricingData
			);

			expect(result).toStrictEqual(newBalancesBuyerAndOwnerAlsoCreator);
		});
	});
});
