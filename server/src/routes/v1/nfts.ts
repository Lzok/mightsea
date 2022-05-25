// import express, { Request, Response } from 'express';
// // import { authenticate, oAuth } from '@src/middlewares/auth';
// import { mint } from '@src/controllers/nfts';
// import { COOKIES } from '@src/config/vars';
// // import { AuthProvidersEnum } from '@src/services/authProviders';
// import logger from '@src/config/logger';
// import { validate } from '@src/middlewares/validations';
// // import { googleAuth } from '@src/validations/auth';

// const router = express.Router();

// router
// 	.route('/google')
// 	.post(
// 		validate(googleAuth),
// 		oAuth(AuthProvidersEnum.GOOGLE),
// 		async (request: Request, response: Response) => {
// 			try {
// 				const { accessToken } = await generateTokens(request.user?._id);

// 				response.cookie(
// 					'accessToken',
// 					accessToken,
// 					COOKIES.REFRESH_OPTS
// 				);

// 				return response.json(request.user);
// 			} catch (error) {
// 				logger.error('Error route /api/v1/auth/google ', error);
// 				return response.sendStatus(400);
// 			}
// 		}
// 	);

// router
// 	.route('/me')
// 	.get(authenticate(), async (request: Request, response: Response) => {
// 		try {
// 			return response.json(request.user);
// 		} catch (error) {
// 			logger.error(error);
// 			return response.json(error);
// 		}
// 	});

// export default router;
