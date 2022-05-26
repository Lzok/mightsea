/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { UserEntity } from '@src/@types/user';

declare global {
	namespace Express {
		interface User {
			id: string;
			name: string;
			email: string;
			balance: number;
			created_at: Date;
			updated_at: Date;
		}

		export interface Request {
			user?: UserEntity;
		}
	}
}
