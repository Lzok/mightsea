import { useMutation, useQueryClient } from 'react-query';
import { API_V1_URL } from '../constants/urls';
import { useRouter } from 'next/router';
import { UserBasicData } from '../@types/user';
import { APIResponse } from '../@types/shared';

async function fakeAuth(user_id: string) {
	const body = { user_id };
	const fetcher = fetch(`${API_V1_URL}/auth/fake`, {
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		method: 'POST',
		body: JSON.stringify(body),
	});

	const response = await fetcher;

	if (!response.ok) {
		throw { message: JSON.parse(await response.text()).error.message };
	}

	const json =
		(await response.json()) as unknown as APIResponse<UserBasicData>;

	return json.data;
}

export const useLogin = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(fakeAuth, {
		retry: false,
		onError: (error: Error) => {
			console.error(error);
			throw new Error(error.message);
		},
		onSuccess: (result) => {
			queryClient.setQueryData('currentUser', result);

			router.reload();
		},
	});
};
