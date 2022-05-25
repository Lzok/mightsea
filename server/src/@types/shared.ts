import { z } from 'zod';
import { idSchema } from '@src/schemas/shared';

export type UUID = z.infer<typeof idSchema>;
