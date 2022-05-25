import jwt from 'jsonwebtoken';

import { JWT } from '@src/config/vars';
import { JWTPayload } from '@src/@types/user';

export function signToken(data: JWTPayload): string {
	return jwt.sign(data, <string>JWT.SECRET, {
		expiresIn: JWT.EXPIRES,
	});
}
