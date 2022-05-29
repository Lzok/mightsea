import { useMutation, useQueryClient } from 'react-query';
import { API_V1_URL } from '../constants/urls';
import { useRouter } from 'next/router';

async function logout() {
	const fetcher = fetch(`${API_V1_URL}/auth/logout`, {
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		method: 'POST',
	});

	const response = await fetcher;

	if (!response.ok) {
		throw { message: JSON.parse(await response.text()) };
	}

	return response.status;
}

export const useLogout = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(logout, {
		retry: false,
		onError: (error: Error) => {
			console.error(error);
			throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.setQueryData('currentUser', null);

			router.reload();
		},
	});
};
