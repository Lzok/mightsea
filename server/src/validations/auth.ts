import { z } from 'zod';
import { idSchema } from '@src/schemas/shared';

export const auth = {
	body: z.object({
		user_id: idSchema,
	}),
};
