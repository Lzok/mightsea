import { signToken } from '@src/utils/auth';
import { UserId, UserEntity } from '@src/@types/user';
import { getUserById } from '@src/controllers/user';

export async function login(userId: UserId) {
	const user = (await getUserById(userId)) as unknown as UserEntity;

	const accessToken = await generateTokens(user.id);

	return { accessToken, user };
}

export async function generateTokens(userId: UserId) {
	return signToken({ id: userId });
}
