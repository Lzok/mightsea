import { HTTP_CODES } from '@src/constants/http';
import { ApiError } from '@src/errors/common';

export class APIError extends Error {
	name: string;
	code: string;
	errors?: Record<string, unknown>;
	meta?: object;
	statusCode: HTTP_CODES;

	constructor(opts: ApiError, overrides: Partial<ApiError> = {}) {
		super();

		const options = {
			...opts,
			...overrides,
		};

		if (!options.message) {
			throw new Error('[APIError.ts] Malformed: error message required.');
		}

		if (!options.code) {
			throw new Error('[APIError.ts] Malformed: error code required.');
		}

		this.name = 'APIError';
		this.code = options.code;
		this.message = options.message;
		this.errors = options.errors;
		this.meta = options.meta || {};
		this.statusCode = options.statusCode;
	}
}
