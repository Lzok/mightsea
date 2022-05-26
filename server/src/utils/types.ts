import { APIError } from '@src/errors/apiError';
import { ApiError } from '@src/errors/common';

export function assertNonNullish<TValue>(
	value: TValue,
	error: ApiError
): asserts value is NonNullable<TValue> {
	if (value === null || value === undefined) {
		throw new APIError(error);
	}
}
