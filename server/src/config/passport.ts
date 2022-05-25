import { Request } from 'express';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { JWT } from '@src/config/vars';
import { UserId, UserEntity } from '@src/@types/user';
import { getUserById } from '@src/queries/users/getById';

const cookieExtractor = (req: Request) => req?.cookies?.accessToken || null;

const jwtOptions = {
	secretOrKey: JWT.SECRET,
	jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
};

type JWTPayload = {
	id: UserId;
	iat: number;
	exp: number;
};

type Done1stParam = Error | unknown | null;
type Done2ndParam = UserEntity | null;
type DoneFn = (arg0: Done1stParam, arg1: Done2ndParam) => void;

const jwt = async (payload: JWTPayload, done: DoneFn) => {
	try {
		const user = await getUserById(payload.id);

		if (user) return done(null, user as unknown as UserEntity);

		return done(null, null);
	} catch (error) {
		return done(error, null);
	}
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwt);
