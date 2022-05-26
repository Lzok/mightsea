import { z } from 'zod';
import { userEntitySchema, userBasicData } from '@src/schemas/user';

export type UserEntity = z.infer<typeof userEntitySchema>;
export type UserBasicData = z.infer<typeof userBasicData>;
export type UserId = UserEntity['id'];
export type JWTPayload = { id: string };
