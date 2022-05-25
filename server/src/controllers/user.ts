import { UserId } from '@src/@types/user';
import { APIError } from '@src/errors/apiError';
import { userErrors } from '@src/errors/users';
import { getUserById as qGetUserById } from '@src/queries/users/getById';

export async function getUserById(id: UserId) {
	const user = await qGetUserById(id);

	if (!user) throw new APIError(userErrors.USER_NOT_FOUND);

	return user;
}
