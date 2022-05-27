import { z } from 'zod';

export const idSchema = z.string().uuid({ message: 'Invalid UUID' });

export const idOptSchema = idSchema.optional();

export const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

export const paginationParamsSchema = z
	.preprocess(
		(a) => Number(z.string().parse(a)),
		z.number().positive().default(1)
	)
	.optional();

export const paginationQuerySchema = z.object({
	page: paginationParamsSchema,
	limit: paginationParamsSchema,
});
