import { z } from 'zod';
import { idSchema, dateSchema } from './shared';

const priceSchema = z.number().positive();

export const nftEntitySchema = z.object({
	id: idSchema,
	description: z.string().optional().default(''),
	price: priceSchema,
	path: z.string().max(2048),
	created_at: dateSchema,
	updated_at: dateSchema,
});

export const nftSchema = nftEntitySchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
});

export const nftMintSchema = z.object({
	description: z.string().optional().default(''),
	creators: z.array(idSchema).optional().default([]),
	price: z.preprocess(
		(a) => Number(z.string().parse(a)),
		z.number().positive()
	),
});

export const nftInsertSchema = nftMintSchema.extend({
	path: z.string().max(2048),
	owner_id: idSchema,
});

export const buyNft = z.object({
	nft_id: idSchema,
});

export const priceUpdateSchema = z.object({
	nft_id: idSchema,
	price: priceSchema,
});