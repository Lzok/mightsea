import { Request, Response } from 'express';
import { APIError } from '@src/errors/apiError';
import { commonErrors } from '@src/errors/common';
import { formatError, sendResponse } from '@src/errors/format';
import { createError } from '@src/errors/errorFactory';

export function errorHandler(err: Request, res: Response) {
	if (err instanceof APIError) {
		const code = err.statusCode || 500;
		return res.status(code).json(formatError(err));
	}

	if (err instanceof Error) {
		const newError = createError(err);
		const code = newError.statusCode || 500;
		return res.status(code).json(formatError(newError));
	}

	const unknownError = new APIError(commonErrors.UNKNOWN_ERROR, {});

	return sendResponse(res, unknownError, unknownError.statusCode);
}
