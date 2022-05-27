import { sendResponse } from '@src/errors/format';
import { RequestHandler } from 'express';
import { z } from 'zod';

type SchemaDefinition<TBody, TQuery, TParams> = Partial<{
	body: z.Schema<TBody>;
	query: z.Schema<TQuery>;
	params: z.Schema<TParams>;
}>;

export function validate<TBody = unknown, TQuery = unknown, TParams = unknown>(
	schema: SchemaDefinition<TBody, TQuery, TParams>
): RequestHandler {
	return async (req, res, next) => {
		if (schema.body) {
			const result = await schema.body.safeParseAsync(req.body);
			if (!result.success) return sendResponse(res, result.error);

			req.body = result.data;
		}

		if (schema.query) {
			const result = await schema.query.safeParseAsync(req.query);
			if (!result.success) return sendResponse(res, result.error);

			req.query = { ...req.query, ...result.data };
		}

		if (schema.params) {
			const result = await schema.params.safeParseAsync(req.params);
			if (!result.success) return sendResponse(res, result.error);

			req.params = { ...req.params, ...result.data };
		}

		return next();
	};
}
