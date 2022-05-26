import { z } from 'zod';
import { idSchema, dateSchema } from './shared';

export const userEntitySchema = z.object({
	id: idSchema,
	name: z.string().max(128),
	email: z.string().email({ message: 'Invalid email address' }),
	balance: z.number(),
	created_at: dateSchema,
	updated_at: dateSchema,
});

export const userSchema = userEntitySchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
});

export const userBasicData = userEntitySchema.omit({
	created_at: true,
	updated_at: true,
});
