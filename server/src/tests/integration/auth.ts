import { HTTP_CODES } from '@src/constants/http';
import { extractCookies } from '@src/utils/cookies';
import supertest from 'supertest';
import app from '../../server';
import { usersMock } from '../fixtures/users';

const request = supertest(app);
const agent = supertest.agent(app);

const API_BASE_URL = '/api/v1/auth';

const { george, dandelion } = usersMock;

describe('Authentication Routes', () => {
	describe(`Fake Auth Endpoint. ${API_BASE_URL}/fake`, () => {
		it('Should login the user if the id exists in the database', async () => {
			return agent
				.post(`${API_BASE_URL}/fake`)
				.send({ user_id: george.id })
				.expect(HTTP_CODES.OK)
				.then((res) => {
					expect(res.header['set-cookie']).toBeTruthy;
					expect(
						res.header['set-cookie'][0].includes('accessToken')
					).toBe(true);
				});
		});
	});

	describe(`Me endpoint. ${API_BASE_URL}/me`, () => {
		it('Should return the current user session ok', async () => {
			const login = await agent
				.post(`${API_BASE_URL}/fake`)
				.send({ user_id: dandelion.id })
				.expect(HTTP_CODES.OK);

			expect(login.header['set-cookie'][0].includes('accessToken')).toBe(
				true
			);

			return agent
				.get(`${API_BASE_URL}/me`)
				.expect(HTTP_CODES.OK)
				.then((res) => {
					expect(res.body.email).toBe(dandelion.email);
				});
		});

		it('Should return 401 because there are no user in session', async () => {
			// Use Request here because we do not need the auth cookies for this test
			return request
				.get(`${API_BASE_URL}/me`)
				.expect(HTTP_CODES.UNAUTHORIZED);
		});
	});

	describe(`Logout endpoint. ${API_BASE_URL}/logout`, () => {
		it('Should logout the current user session ok', async () => {
			const login = await agent
				.post(`${API_BASE_URL}/fake`)
				.send({ user_id: george.id })
				.expect(HTTP_CODES.OK);

			expect(login.header['set-cookie'][0].includes('accessToken')).toBe(
				true
			);

			const logout = await agent
				.post(`${API_BASE_URL}/logout`)
				.expect(HTTP_CODES.OK);
			const cookies = extractCookies(logout.header);

			expect(cookies.accessToken).toBeDefined();
			expect(cookies.accessToken.value).toBe('');
		});
	});
});
