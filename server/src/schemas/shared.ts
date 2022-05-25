import { z } from 'zod';

export const idSchema = z.string().uuid({ message: 'Invalid UUID' });

export const idOptSchema = idSchema.optional();

export const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());
