import { HTTP_CODES } from '@src/constants/http';
import { ErrorMap } from './common';

export const nftErrors: ErrorMap = {
	NFT_NOT_FOUND: {
		code: 'NFT_NOT_FOUND',
		message: 'The requested nft was not found.',
		statusCode: HTTP_CODES.NOT_FOUND,
	},
	NFT_BAD_PRICING: {
		code: 'NFT_BAD_PRICING',
		message: 'The requested nft has a bad price. Maybe its price is zero.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
};
