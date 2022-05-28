import express, { Request, Response } from 'express';
import { authenticate } from '@src/middlewares/auth';
import { login } from '@src/controllers/auth';
import { COOKIES } from '@src/config/vars';
import logger from '@src/config/logger';
import { validate } from '@src/middlewares/validations';
import { auth } from '@src/validations/auth';
import { sendResponse } from '@src/errors/format';

const router = express.Router();

router
	.route('/fake')
	.post(validate(auth), async (request: Request, response: Response) => {
		try {
			const { accessToken, user } = await login(request.body.user_id);

			response.cookie('accessToken', accessToken, COOKIES.REFRESH_OPTS);

			return sendResponse(response, user);
		} catch (error) {
			logger.error('Error route /api/v1/auth/fake ', error);
			return response.sendStatus(400);
		}
	});

router
	.route('/me')
	.get(authenticate(), async (request: Request, response: Response) => {
		try {
			return sendResponse(response, request.user);
		} catch (error) {
			logger.error(error);
			return response.json(error);
		}
	});

router
	.route('/logout')
	.post(authenticate(), async (_: Request, response: Response) => {
		try {
			response.clearCookie('accessToken');

			return response.sendStatus(200);
		} catch (error) {
			logger.error(error);
			return response.json(error);
		}
	});

export default router;
