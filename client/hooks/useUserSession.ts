import { useQuery } from 'react-query';
import { API_V1_URL } from '../constants/urls';
import type { UserBasicData } from '../@types/user';
import { APIResponse } from '../@types/shared';

export async function getUserSession(): Promise<UserBasicData | undefined> {
	const fetcher = fetch(`${API_V1_URL}/auth/me`, {
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	});

	const response = await fetcher;

	if (response.status === 401) return undefined;

	if (!response.ok) {
		throw {
			message: JSON.parse(await response.text()),
			status: response.status,
		};
	}

	const json =
		(await response.json()) as unknown as APIResponse<UserBasicData>;

	return json.data;
}

export const useUserSession = ({ enabled = true }) =>
	useQuery('userSession', getUserSession, {
		retry: false,
		staleTime: 1000 * 60 * 5, // 5 min
		cacheTime: 1000 * 60 * 5,
		enabled,
		refetchOnWindowFocus: false,
		onError: () => console.error('Error fetching the user.'),
	});
