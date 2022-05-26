import { HTTP_CODES } from '@src/constants/http';
import { ErrorMap } from './common';

export const userErrors: ErrorMap = {
	USER_NOT_FOUND: {
		code: 'USER_NOT_FOUND',
		message: 'The requested user was not found.',
		statusCode: HTTP_CODES.NOT_FOUND,
	},
	USER_ALREADY_OWNER: {
		code: 'USER_ALREADY_OWNER',
		message: 'The user is already the owner of the nft.',
		statusCode: HTTP_CODES.NOT_FOUND,
	},
	USER_INSUFICIENT_BALANCE: {
		code: 'USER_INSUFICIENT_BALANCE',
		message:
			'The user does not have at least the required amount to buy the nft.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
};
