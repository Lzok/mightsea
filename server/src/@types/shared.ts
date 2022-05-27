import { z } from 'zod';
import { idSchema, paginationQuerySchema } from '@src/schemas/shared';

export type UUID = z.infer<typeof idSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;