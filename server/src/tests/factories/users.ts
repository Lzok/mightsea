import { randomUUID } from 'crypto';
import { generateMock } from '@anatine/zod-mock';
import { klona } from 'klona/lite';
import { userBasicData } from '@src/schemas/user';
import { UserBasicData } from '@src/@types/user';

export function getDefaultUser(
	nameParam: string | undefined = undefined
): UserBasicData {
	const baseUser = {
		...generateMock(userBasicData),
		id: randomUUID(),
	};
	const email = baseUser.email.toLowerCase();

	const name = nameParam ?? baseUser.name;

	return klona({
		...baseUser,
		email,
		balance: 100,
		name,
	});
}
