import { useMutation, useQueryClient } from 'react-query';
import { API_V1_URL } from '../constants/urls';
import { useRouter } from 'next/router';
import { UserBasicData } from '../@types/user';
import { APIResponse } from '../@types/shared';
import { NFT } from '../@types/nfts';

async function buyNft(nft_id: NFT['id']) {
	const body = { nft_id };
	const fetcher = fetch(`${API_V1_URL}/nfts/buy`, {
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		method: 'POST',
		body: JSON.stringify(body),
	});

	const response = await fetcher;

	if (!response.ok) {
		throw { message: JSON.parse(await response.text()) };
	}

	const json =
		(await response.json()) as unknown as APIResponse<UserBasicData>;

	return json.data;
}

export const useBuyNft = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(buyNft, {
		retry: false,
		onError: (error: Error) => {
			throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.refetchQueries('feedNft');

			router.reload();
		},
	});
};
