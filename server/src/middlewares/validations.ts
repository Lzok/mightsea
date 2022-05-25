import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';

export type ValidatedMiddleware<TBody, TQuery, TParams> = (
	req: Request<TParams, unknown, TBody, TQuery>,
	res: Response,
	next: NextFunction
) => unknown;

type SchemaDefinition<TBody, TQuery, TParams> = Partial<{
	body: z.Schema<TBody>;
	query: z.Schema<TQuery>;
	params: z.Schema<TParams>;
}>;

export function validate<TBody = unknown, TQuery = unknown, TParams = unknown>(
	schema: SchemaDefinition<TBody, TQuery, TParams>
): RequestHandler {
	return async (req, _, next) => {
		if (schema.body) {
			const result = await schema.body.safeParseAsync(req.body);
			if (!result.success) return next(result.error);

			req.body = result.data;
		}

		if (schema.query) {
			const result = await schema.query.safeParseAsync(req.query);
			if (!result.success) return next(result.error);
		}

		if (schema.params) {
			const result = await schema.params.safeParseAsync(req.params);
			if (!result.success) return next(result.error);
		}

		return next();
	};
}

export function validateBody<TBody>(body: z.Schema<TBody>) {
	return validate({ body });
}

export function validateQuery<TQuery>(query: z.Schema<TQuery>) {
	return validate({ query });
}

export function validateParams<TParams>(params: z.Schema<TParams>) {
	return validate({ params });
}
