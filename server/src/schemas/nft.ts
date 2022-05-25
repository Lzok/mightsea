import { z } from 'zod';
import { idSchema, dateSchema } from './shared';

export const nftEntitySchema = z.object({
	id: idSchema,
	description: z.string().optional().default(''),
	price: z.number().min(0),
	path: z.string().max(2048),
	created_at: dateSchema,
	updated_at: dateSchema,
});

export const nftSchema = nftEntitySchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
});
