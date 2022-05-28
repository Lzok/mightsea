import { useQuery } from 'react-query';
import { FeedNFT } from '../@types/nfts';
import { APIResponse } from '../@types/shared';
import { API_V1_URL } from '../constants/urls';

async function getFeed(page: number) {
	const fetcher = fetch(
		`${API_V1_URL}/nfts?page=${encodeURIComponent(page)}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}
	);

	const response = await fetcher;

	if (!response.ok) {
		throw { message: JSON.parse(await response.text()) };
	}

	const feed = (await response.json()) as APIResponse<FeedNFT>;

	return feed.data;
}

export const useFeedNft = (page = 1) => {
	return useQuery(['feedNft', page], () => getFeed(page), {
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 15,
		cacheTime: 1000 * 15,
		enabled: page > 0,
		onError: (error: Error) => {
			throw new Error(error.message);
		},
	});
};
