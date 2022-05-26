import express, { Request, Response } from 'express';
import { authenticate } from '@src/middlewares/auth';
import { buy, mint } from '@src/controllers/nfts';
import logger from '@src/config/logger';
import { sendResponse } from '@src/errors/format';
import { uploadSingleFile } from '@src/middlewares/uploads';
import { validate } from '@src/middlewares/validations';
import {
	mint as mintValidation,
	buy as buyValidation,
} from '@src/validations/nfts';
import { UserId } from '@src/@types/user';

const router = express.Router();

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
				logger.error('Error route /api/v1/nfts/mint ', error);
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
				logger.error('Error route /api/v1/nfts/mint ', error);
				return sendResponse(response, error);
			}
		}
	);

export default router;
