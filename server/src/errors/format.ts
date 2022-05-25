import { Response } from 'express';
import { HTTP_CODES } from '@src/constants/http';
import { APIError } from './apiError';
import { ApiError } from './common';
import { createError } from './errorFactory';
import { omit } from '@src/utils/objects';
import { isDevelopment } from '@src/config/vars';
import logger from '@src/config/logger';

export function formatError(
	error: APIError,
	overrides: ApiError | Record<string, never> = {}
) {
	const stackTrace = JSON.stringify(error, ['stack'], 4) || {};

	// No need to send to client
	const newError = omit(error, [
		'statusCode, meta',
	] as unknown as keyof APIError);

	const errorWithStackTrace = {
		error: {
			...newError,
			stack: stackTrace,
		},
		success: false,
		...overrides,
	};

	const errorWithOutStackTrace = {
		error: {
			...newError,
		},
		success: false,
		...overrides,
	};

	logger.error('Formatted error', errorWithStackTrace);

	return isDevelopment() ? errorWithStackTrace : errorWithOutStackTrace;
}

export function formatResponse(result: object, override = {}) {
	return {
		data: result,
		success: true,
		...override,
	};
}

export function sendResponse(
	res: Response,
	payload: unknown,
	statusCode: HTTP_CODES = 200
) {
	if (payload instanceof APIError) {
		const code = payload.statusCode || 500;
		return res.status(code).json(formatError(payload));
	}

	if (payload instanceof Error) {
		const newError = createError(payload);
		const code = newError.statusCode || 500;
		return res.status(code).json(formatError(newError));
	}

	return res.status(statusCode).json(formatResponse(payload as object));
}
