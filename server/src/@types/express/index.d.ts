/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { UserSession } from '@src/@types/user';

declare global {
	namespace Express {
		interface User {
			_id: string;
			email: string;
		}

		export interface Request {
			user?: UserSession;
		}
	}
}
