import { z } from 'zod';
import { userEntitySchema } from '@src/schemas/user';

export type UserEntity = z.infer<typeof userEntitySchema>;
export type UserId = UserEntity['id'];
export type JWTPayload = { id: string };
