import { HTTP_CODES } from '@src/constants/http';
import { ErrorMap } from './common';

export const fileErrors: ErrorMap = {
	INVALID_TYPE: {
		code: 'INVALID_FILE_TYPE',
		message:
			'Invalid file type. Only image/png and image/jpeg formats are allowed.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	FILE_IS_REQUIRED: {
		code: 'FILE_IS_REQUIRED',
		message: 'The nft file is required to mint.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	// Multer errors from here https://github.com/expressjs/multer/blob/master/lib/multer-error.js
	LIMIT_PART_COUNT: {
		code: 'LIMIT_PART_COUNT',
		message: 'Too many parts.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	LIMIT_FILE_COUNT: {
		code: 'LIMIT_FILE_COUNT',
		message: 'Too many files.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	LIMIT_FILE_SIZE: {
		code: 'LIMIT_FILE_SIZE',
		message: 'File too large.',
		statusCode: HTTP_CODES.ENTITY_TOO_LARGE,
	},
	LIMIT_FIELD_KEY: {
		code: 'LIMIT_FIELD_KEY',
		message: 'Field name too long.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	LIMIT_FIELD_VALUE: {
		code: 'LIMIT_FIELD_VALUE',
		message: 'Field value too long.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	LIMIT_FIELD_COUNT: {
		code: 'LIMIT_FIELD_COUNT',
		message: 'Too many fields.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	LIMIT_UNEXPECTED_FILE: {
		code: 'LIMIT_UNEXPECTED_FILE',
		message: 'Unexpected field.',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
};
