import * as nftController from '@src/controllers/nfts';
import { APIError } from '@src/errors/apiError';

describe.only('NFTs controller', () => {
	describe('Fn calculateRoyalties', () => {
		test('It should calculate the amounts ok when there is more than one creator', () => {
			const price = 42;
			const creators = [
				{
					id: 'asdasd',
					price: 42,
					owner_id: 'owner1',
					user_id: 'userid1',
					balance: 100,
				},
				{
					id: 'asdasd',
					price: 42,
					owner_id: 'owner2',
					user_id: 'userid2',
					balance: 100,
				},
			];

			const result = nftController.calculateRoyalties(price, creators);

			expect(result.royaltyToShare).toBe(8.4);
			expect(result.toOwner).toBe(33.6);
			expect(result.toCreators).toBe(4.2);
		});

		test('It should throw if we pass zero as the price', () => {
			const fn = nftController.calculateRoyalties;
			const price = 0;
			const creators = [
				{
					id: 'asdasd',
					price: 42,
					owner_id: 'owner1',
					user_id: 'userid1',
					balance: 100,
				},
				{
					id: 'asdasd',
					price: 42,
					owner_id: 'owner2',
					user_id: 'userid2',
					balance: 100,
				},
			];

			expect(() => {
				fn(price, creators);
			}).toThrow(APIError);
		});
	});
});
