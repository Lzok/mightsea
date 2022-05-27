import express, { Request, Response } from 'express';
import { authenticate } from '@src/middlewares/auth';
import { buy, feed, mint, updatePrice } from '@src/controllers/nfts';
import logger from '@src/config/logger';
import { sendResponse } from '@src/errors/format';
import { uploadSingleFile } from '@src/middlewares/uploads';
import { validate } from '@src/middlewares/validations';
import {
	mint as mintValidation,
	buy as buyValidation,
	updatePrice as updatePriceValidation,
	paginationValidation,
} from '@src/validations/nfts';
import { UserId } from '@src/@types/user';
import { PaginationQuery } from '@src/@types/shared';

const router = express.Router();

router
	.route('/')
	.get(
		authenticate(),
		validate(paginationValidation),
		async (request: Request, response: Response) => {
			try {
				const { page, limit } =
					request.query as unknown as PaginationQuery;

				logger.info('page', { page });
				logger.info('limit', { limit });
				const result = await feed(page ?? 1, limit ?? 1);

				return sendResponse(response, result);
			} catch (error) {
				logger.error('Error route [GET] /api/v1/nfts ', error);
				return sendResponse(response, error);
			}
		}
	);

router
	.route('/mint')
	.post(
		authenticate(),
		uploadSingleFile,
		validate(mintValidation),
		async (request: Request, response: Response) => {
			const user_id = request.user?.id as UserId;
			const { creators, price, description } = request.body;
			const nft = request.file as Express.Multer.File;

			try {
				const payload = {
					owner_id: user_id,
					creators: [user_id, ...creators],
					price,
					description,
					nft,
				};

				const result = await mint(payload);

				return sendResponse(response, result);
			} catch (error) {
				logger.error('Error route [POST] /api/v1/nfts/mint ', error);
				return sendResponse(response, error);
			}
		}
	);

router
	.route('/buy')
	.post(
		authenticate(),
		validate(buyValidation),
		async (request: Request, response: Response) => {
			const { nft_id, buyer_id } = request.body;

			try {
				const result = await buy(nft_id, buyer_id);

				return sendResponse(response, result);
			} catch (error) {
				logger.error('Error route [POST] /api/v1/nfts/buy ', error);
				return sendResponse(response, error);
			}
		}
	);

router
	.route('/price')
	.patch(
		authenticate(),
		validate(updatePriceValidation),
		async (request: Request, response: Response) => {
			const user_id = request.user?.id as UserId;
			const { nft_id, price } = request.body;

			try {
				const result = await updatePrice(nft_id, user_id, price);

				return sendResponse(response, result);
			} catch (error) {
				logger.error('Error route [PATCH] /api/v1/nfts/price ', error);
				return sendResponse(response, error);
			}
		}
	);

export default router;
