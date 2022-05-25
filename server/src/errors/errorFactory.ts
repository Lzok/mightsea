/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from 'zod';
import { APIError } from './apiError';
import { ApiError } from './common';
import logger from '@src/config/logger';

export function isZodError(err: any): err is ZodError {
	return err instanceof ZodError || err.constructor?.name === ZodError.name;
}

const appendErrors = (
	name: string,
	validateAllFieldCriteria: boolean,
	errors: { [x: string]: { types?: object; message: string } },
	type: string,
	message: string | boolean
) => {
	if (!validateAllFieldCriteria) return {};

	return {
		...errors[name],
		types: {
			...(errors[name] && errors[name]?.types ? errors[name]?.types : {}),
			[type]: message || true,
		},
	};
};

const convertArrayToPathName = (paths: (string | number)[]): string =>
	paths
		.reduce(
			(previous, path: string | number, index): string =>
				`${previous}${
					typeof path === 'string'
						? `${index > 0 ? '.' : ''}${path}`
						: `[${path}]`
				}`,
			''
		)
		.toString();

const getTypesForError = (
	validateAllFieldCriteria: boolean,
	type: string,
	message: string
) => {
	if (!validateAllFieldCriteria) return {};

	return {
		types: { [type]: message || true },
	};
};

const parseErrorSchema = (
	zodError: ZodError,
	validateAllFieldCriteria: boolean
) => {
	if (zodError.isEmpty) {
		return {};
	}

	return zodError.errors.reduce<Record<string, any>>(
		(previous, { path, message, code: type }) => {
			const currentPath = convertArrayToPathName(path);
			let current;

			if (!path) current = {};
			else if (previous[currentPath] && validateAllFieldCriteria) {
				current = {
					[currentPath]: appendErrors(
						currentPath,
						validateAllFieldCriteria,
						previous,
						type,
						message
					),
				};
			} else {
				const types = getTypesForError(
					validateAllFieldCriteria,
					type,
					message
				);
				current = {
					[currentPath]: previous[currentPath] || {
						message,
						type,
						...types,
					},
				};
			}

			return {
				...previous,
				...current,
			};
		},
		{}
	);
};

export function createError(
	error: APIError | ZodError | Error,
	overrides?: ApiError
) {
	if (isZodError(error)) {
		const errors = parseErrorSchema(error, true);
		logger.error('Zod validation errors', errors);
		return new APIError(
			{
				errors,
				statusCode: 400,
				code: 'BAD_REQUEST',
				message: 'Request Validation Error.',
			},
			overrides
		);
	}

	return new APIError(error as ApiError, overrides);
}
