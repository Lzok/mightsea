import { HTTP_CODES } from '@src/constants/http';
import supertest from 'supertest';
import app from '../../server';
import { usersMock } from '../fixtures/users';
import { fileErrors } from '../../errors/uploads';

const request = supertest(app);
const agent = supertest.agent(app);

const API_AUTH_URL = '/api/v1/auth/fake';
const API_BASE_URL = '/api/v1/nfts';
const NFT_FILES_PATH = './src/tests/fixtures/nfts';

const { george } = usersMock;

describe('NFTs Routes', () => {
	describe(`Mint Endpoint. ${API_BASE_URL}/mint`, () => {
		it('Should return 401 UNAUTHORAIZED if there is no user in session', async () => {
			return request
				.post(`${API_BASE_URL}/mint`)
				.expect(HTTP_CODES.UNAUTHORIZED);
		});

		it('Should return 413 PAYLOAD_TOO_LARGE if the nft size is greater than 5mb', async () => {
			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: george.id })
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
				.send({ user_id: george.id })
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
				.send({ user_id: george.id })
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

		it('Should return 201 CREATED if the mint was ok (without co-creators)', async () => {
			const description = 'NFT Mint test description';
			const price = 13;

			await agent
				.post(`${API_AUTH_URL}`)
				.send({ user_id: george.id })
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
					expect(res.body.data.owner_id).toBe(george.id);
					expect(res.body.data.description).toBe(description);
					expect(res.body.data.price).toBe(price);
				});
		});
	});
});
