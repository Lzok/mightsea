import { HTTP_CODES } from '@src/constants/http';

export type ApiError = {
	code: string;
	message: string;
	statusCode: HTTP_CODES;
	meta?: object;
	stack?: object;
	errors?: Record<string, unknown>;
};

export type ErrorMap = {
	[key: string]: ApiError;
};

export const commonErrors: ErrorMap = {
	// Application custom errors
	UNKNOWN_ERROR: {
		code: 'UNKNOWN_ERROR',
		message: 'Unknown error',
		statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
	},

	// Predefined 4xx http errors
	BAD_REQUEST: {
		code: 'BAD_REQUEST',
		message: 'Bad request',
		statusCode: HTTP_CODES.BAD_REQUEST,
	},
	UNAUTHORIZED: {
		code: 'UNAUTHORIZED',
		message: 'Unauthorized',
		statusCode: HTTP_CODES.UNAUTHORIZED,
	},
	FORBIDDEN: {
		code: 'FORBIDDEN',
		message: 'Forbidden',
		statusCode: HTTP_CODES.FORBIDDEN,
	},
	RESOURCE_NOT_FOUND: {
		code: 'RESOURCE_NOT_FOUND',
		message: 'Resource not found',
		statusCode: HTTP_CODES.NOT_FOUND,
	},
	GONE: {
		code: 'GONE',
		message: 'Resource gone or expired.',
		statusCode: HTTP_CODES.GONE,
	},
	ENTITY_TOO_LARGE: {
		code: 'ENTITY_TOO_LARGE',
		message: 'Entity too large.',
		statusCode: HTTP_CODES.ENTITY_TOO_LARGE,
	},

	// Predefined 5xx http errors
	INTERNAL_SERVER_ERROR: {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Something went wrong, Please try again later.',
		statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
		meta: {
			shouldRedirect: true,
		},
	},
	BAD_GATEWAY: {
		code: 'BAD_GATEWAY',
		message: 'Bad gateway',
		statusCode: HTTP_CODES.BAD_GATEWAY,
	},
};
