import { z } from 'zod';
import { idSchema, dateSchema } from './shared';

// TODO
// export const providers = z.enum(['google']);

// export const authProviders = z.object({
// 	provider: providers,
// 	picture: z.string().optional(),
// 	email: z.string().email(),
// 	firstName: z.string().min(1),
// 	lastName: z.string().min(1),
// });

// export const userSession = z.object({
// 	id,
// 	email: z.string().email(),
// });

// export const user = userSession.extend({
// 	username: z.string().min(4),
// 	firstName: z.string().min(1),
// 	lastName: z.string().min(1),
// 	picture: z.string().optional(),
// 	modifiedUsername: z.boolean().default(false),
// });

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
