import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { HTTP_CODES } from '@src/constants/http';
import app from '../../server';
import { fileErrors } from '../../errors/uploads';
import { getDefaultUser } from '../factories/users';
import { insertMultiple } from '@src/queries/users/insertMultiple';
import { insertOne } from '@src/queries/nfts/insertOne';
import { userErrors } from '@src/errors/users';
import { nftErrors } from '@src/errors/nfts';
import {
	DEFAULT_PAGINATION_PAGE,
	DEFAULT_PAGINATION_SIZE,
} from '@src/constants/pagination';
import * as feedModule from '@src/queries/nfts/getFeed';

const request = supertest(app);
const agent = supertest.agent(app);

const API_AUTH_URL = '/api/v1/auth/fake';
const API_BASE_URL = '/api/v1/nfts';
const NFT_FILES_PATH = './src/tests/fixtures/nfts';

/**
 * The following variable names will reflect the "Balances" chart on the challenge's PDF
 */
const creator = getDefaultUser('creator');
const co_creator_1 = getDefaultUser('co_creator_1');
const co_creator_2 = getDefaultUser('co_creator_2');
const co_creator_3 = getDefaultUser('co_creator_3');
const buyer_1 = getDefaultUser('buyer_1');
const buyer_2 = getDefaultUser('buyer_2');

const userWithoutBalance = getDefaultUser();
userWithoutBalance.balance = 2;
const userAlreadyOwner = getDefaultUser();

const allTestUsers = [
	creator,
	co_creator_1,
	co_creator_2,
	co_creator_3,
	buyer_1,
	buyer_2,
	userWithoutBalance,
	userAlreadyOwner,
];

const fakeMintData = {
	description: 'Fake description for insert a minting row in the database',
	price: 10,
	owner_id: creator.id,
	creators: [creator.id, co_creator_1.id, co_creator_2.id, co_creator_3.id],
	path: 'static/something.jpg',
};

const fakeMintData2 = {
	description: 'Another NFT fake',
	price: 10,
	owner_id: userAlreadyOwner.id,
	creators: [userAlreadyOwner.id],
	path: 'static/something2.jpg',
};

const fakeMintData3 = {
	description: 'Another NFT fake v3.0',
	price: 70,
	owner_id: co_creator_1.id,
	creators: [co_creator_1.id],
	path: 'static/something3.jpg',
};

let nft_id: string;
let nft_2_id: string;
let nft_3_id: string;

describe('NFTs Routes', () => {
	beforeAll(async () => {
		await insertMultiple(allTestUsers);
		const [nft, nft2, nft3] = await Promise.all([
			insertOne(fakeMintData),
			insertOne(fakeMintData2),
			insertOne(fakeMintData3),
		]);
		nft_id = nft.id as string;
		nft_2_id = nft2.id as string;
		nft_3_id = nft3.id as string;
	});

	////////////////////////////////////////////////////////////////////////////
	/////////////////           BUY ENDPOINT                    ////////////////
	////////////////////////////////////////////////////////////////////////////
	describe(`Buy Endpoint. ${API_BASE_URL}/buy`, () => {
		it('Should return 200 OK buying an NFT and the user balances should be updated ok', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: buyer_1.id })
				.expect(HTTP_CODES.OK);

			const buy1 = await agent
				.post(`${API_BASE_URL}/buy`)
				.send({
					nft_id,
				})
				.expect(HTTP_CODES.OK);

			expect(buy1.body.success).toBe(true);
			expect(buy1.body.data.newBalances.old_owner_id).toBe(108.5);
			expect(buy1.body.data.newBalances.buyer_id).toBe(90);
			buy1.body.data.newBalances.creators.map((c: { balance: number }) =>
				expect(c.balance).toBe(100.5)
			);

			/**
			 * Here we update the price to be 100, like the balances chart on the pdf
			 */
			await agent
				.patch(`${API_BASE_URL}/price`)
				.send({ nft_id, price: 100 })
				.expect(HTTP_CODES.OK)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data.id).toBe(nft_id);
					expect(res.body.data.price).toBe(100);
				});

			const agent2 = supertest.agent(app);
			/**
			 * Now the NFT will be selled again for 100 coins
			 */
			await agent2
				.post(`${API_AUTH_URL}`)
				.send({ user_id: buyer_2.id })
				.expect(HTTP_CODES.OK);

			const buy2 = await agent2
				.post(`${API_BASE_URL}/buy`)
				.send({
					nft_id,
				})
				.expect(HTTP_CODES.OK);

			expect(buy2.body.success).toBe(true);
			expect(buy2.body.data.newBalances.old_owner_id).toBe(170);
			expect(buy2.body.data.newBalances.buyer_id).toBe(0);
			const originalCreator = buy2.body.data.newBalances.creators.find(
				(c: { id: string }) => c.id === creator.id
			);
			expect(originalCreator.balance).toBe(113.5);
			buy2.body.data.newBalances.creators
				.filter((c: { id: string }) => c.id !== originalCreator.id)
				.map((c: { balance: number }) => expect(c.balance).toBe(105.5));
		});

		it('Should return 400 BAD_REQUEST if the nft_id is not a valid uuid', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: buyer_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/buy`)
				.send({
					nft_id: '5081e31e-084a-450d-b16d-23a7eedefd1z', // The final 'z' char is invalid
				})
				.expect(HTTP_CODES.BAD_REQUEST)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe('BAD_REQUEST');
					expect(res.body.error.errors['nft_id'].type).toBe(
						'invalid_string'
					);
				});
		});

		it('Should return 404 NOT_FOUND if the nft_id does not exist', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: buyer_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/buy`)
				.send({
					nft_id: randomUUID(),
				})
				.expect(HTTP_CODES.NOT_FOUND)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe(
						nftErrors.NFT_NOT_FOUND.code
					);
				});
		});

		it('Should return 404 NOT_FOUND if the nft_id does not exist', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: buyer_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/buy`)
				.send({
					nft_id: randomUUID(),
				})
				.expect(HTTP_CODES.NOT_FOUND)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe(
						nftErrors.NFT_NOT_FOUND.code
					);
				});
		});

		it('Should return 400 BAD_REQUEST if the user who wants to buy an nft already is its owner', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/buy`)
				.send({
					nft_id: nft_2_id,
				})
				.expect(HTTP_CODES.BAD_REQUEST)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe(
						userErrors.USER_ALREADY_OWNER.code
					);
				});
		});

		it('Should return 400 BAD_REQUEST if the user who wants to buy an nft does not have the sufficient balance', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userWithoutBalance.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/buy`)
				.send({
					nft_id: nft_2_id,
				})
				.expect(HTTP_CODES.BAD_REQUEST)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe(
						userErrors.USER_INSUFICIENT_BALANCE.code
					);
				});
		});
	});

	////////////////////////////////////////////////////////////////////////////
	/////////////////           MINT ENDPOINT                     //////////////
	////////////////////////////////////////////////////////////////////////////
	describe(`Mint Endpoint. ${API_BASE_URL}/mint`, () => {
		it('Should return 401 UNAUTHORAIZED if there is no user in session', async () => {
			return request
				.post(`${API_BASE_URL}/mint`)
				.expect(HTTP_CODES.UNAUTHORIZED);
		});

		it('Should return 413 PAYLOAD_TOO_LARGE if the nft size is greater than 5mb', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: co_creator_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/mint`)
				.withCredentials()
				.attach('file', `${NFT_FILES_PATH}/6mb.jpg`)
				.expect(HTTP_CODES.ENTITY_TOO_LARGE)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe(
						fileErrors.LIMIT_FILE_SIZE.code
					);
				});
		});

		it('Should return 400 FILE_IS_REQUIRED if we do not send a file', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: co_creator_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/mint`)
				.expect(HTTP_CODES.BAD_REQUEST)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe(
						fileErrors.FILE_IS_REQUIRED.code
					);
				});
		});

		it('Should return 400 BAD_REQUEST if we send a non-number price', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: co_creator_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/mint`)
				.attach('file', `${NFT_FILES_PATH}/ducks.jpg`)
				.field('price', 'not-a-price')
				.expect(HTTP_CODES.BAD_REQUEST)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe('BAD_REQUEST');
					expect(res.body.error.errors.price.type).toBe(
						'invalid_type'
					);
				});
		});

		it('Should return 400 BAD_REQUEST if we send a bad uuid in the creators field', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: co_creator_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/mint`)
				.attach('file', `${NFT_FILES_PATH}/ducks.jpg`)
				.field('price', 6)
				.field('description', 'some description')
				.field('creators[0]', 'z8f8ce6f-1940-404e-be23-60b8f77926f5') // bad uuid because the initial 'z' char
				.expect(HTTP_CODES.BAD_REQUEST)
				.then((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.error.code).toBe('BAD_REQUEST');
					expect(res.body.error.errors['creators[0]'].type).toBe(
						'invalid_string'
					);
				});
		});

		it('Should return 201 CREATED if the mint was ok (without co-creators)', async () => {
			const description = 'NFT Mint test description';
			const price = 13;

			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: co_creator_1.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/mint`)
				.attach('file', `${NFT_FILES_PATH}/ducks.jpg`)
				.field('price', price)
				.field('description', description)
				.expect(HTTP_CODES.CREATED)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data.nft_id).toBeTruthy;
					expect(res.body.data.path).toBeTruthy;
					expect(res.body.data.owner_id).toBe(co_creator_1.id);
					expect(res.body.data.description).toBe(description);
					expect(res.body.data.price).toBe(price);
				});
		});

		it('Should return 201 CREATED if the mint was ok (with co-creators)', async () => {
			const description = 'NFT Mint with co-creators';
			const price = 20;

			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: co_creator_2.id })
				.expect(HTTP_CODES.OK);

			return agent
				.post(`${API_BASE_URL}/mint`)
				.attach('file', `${NFT_FILES_PATH}/deer_bambi.jpg`)
				.field('price', price)
				.field('description', description)
				.field('creators[]', [co_creator_3.id])
				.expect(HTTP_CODES.CREATED)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data.nft_id).toBeTruthy;
					expect(res.body.data.path).toBeTruthy;
					expect(res.body.data.owner_id).toBe(co_creator_2.id);
					expect(res.body.data.description).toBe(description);
					expect(res.body.data.price).toBe(price);
				});
		});
	});

	////////////////////////////////////////////////////////////////////////////
	////////////////           PRICE ENDPOINT                     //////////////
	////////////////////////////////////////////////////////////////////////////
	describe(`Price Endpoint. ${API_BASE_URL}/price`, () => {
		it('Should return 401 UNAUTHORAIZED if there is no user in session', async () => {
			return request
				.patch(`${API_BASE_URL}/price`)
				.expect(HTTP_CODES.UNAUTHORIZED);
		});

		it('Should return 400 BAD_REQUEST if the nft_id is not a valid uuid', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.patch(`${API_BASE_URL}/price`)
				.send({
					nft_id: 'not-a-valid-uuid',
					price: 40,
				})
				.expect(HTTP_CODES.BAD_REQUEST);
		});

		it('Should return 400 BAD_REQUEST if the price is not a positive number', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.patch(`${API_BASE_URL}/price`)
				.send({
					nft_id: nft_2_id,
					price: -1,
				})
				.expect(HTTP_CODES.BAD_REQUEST);
		});

		it('Should return 404 NOT_FOUND if the nft does not exist', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.patch(`${API_BASE_URL}/price`)
				.send({
					nft_id: randomUUID(),
					price: 28,
				})
				.expect(HTTP_CODES.NOT_FOUND);
		});

		it('Should return 403 FORBIDDEN if the user is not the owner of the nft', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.patch(`${API_BASE_URL}/price`)
				.send({
					nft_id: nft_id,
					price: 28,
				})
				.expect(HTTP_CODES.FORBIDDEN);
		});

		it('Should return 200 OK if price is updated ok', async () => {
			const price = 57;

			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.patch(`${API_BASE_URL}/price`)
				.send({
					nft_id: nft_2_id,
					price,
				})
				.expect(HTTP_CODES.OK)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data.id).toBe(nft_2_id);
					expect(res.body.data.price).toBe(price);
				});
		});
	});

	////////////////////////////////////////////////////////////////////////////
	////////////////            FEED ENDPOINT                     //////////////
	////////////////////////////////////////////////////////////////////////////
	describe(`Feed Endpoint. ${API_BASE_URL}`, () => {
		const spyFeed = jest.spyOn(feedModule, 'getFeed');

		afterAll(() => spyFeed.mockClear());

		it('Should return 400 BAD_REQUEST if we send a non-number as the page query param', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.get(`${API_BASE_URL}`)
				.query({ page: 'z' })
				.expect(HTTP_CODES.BAD_REQUEST);
		});

		it('Should return 400 BAD_REQUEST if we send a non-number as the limit query param', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.get(`${API_BASE_URL}`)
				.query({ limit: 'z' })
				.expect(HTTP_CODES.BAD_REQUEST);
		});

		it('Should return 200 OK if we do not send a page param. The default value should be used', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.get(`${API_BASE_URL}`)
				.query({ limit: 2 })
				.expect(HTTP_CODES.OK)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data.current_page).toBe(
						DEFAULT_PAGINATION_PAGE
					);
				});
		});

		it('Should return 200 OK if we do not send a limit param. The default value should be used', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: userAlreadyOwner.id })
				.expect(HTTP_CODES.OK);

			return agent
				.get(`${API_BASE_URL}`)
				.query({ page: 2 })
				.expect(HTTP_CODES.OK)
				.then((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data.current_page).toBe(2);
					expect(spyFeed).toHaveBeenCalledWith(
						2,
						DEFAULT_PAGINATION_SIZE
					);
				});
		});
	});
});
