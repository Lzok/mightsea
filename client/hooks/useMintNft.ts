import { useMutation, useQueryClient } from 'react-query';
import { API_V1_URL } from '../constants/urls';
import { useRouter } from 'next/router';
import { APIResponse } from '../@types/shared';
import { MintedNFT } from '../@types/nfts';

type MintPayload = {
	/**
	 * File here is an URL containing the blob of the image.
	 * We need to fetch that url before sending the actual file to the backend.
	 */
	file: string;
	description: string;
	price: number;
	creators: string;
};

async function mint(data: MintPayload) {
	const formData = new FormData();
	const fetchedBlob = await fetch(data.file);
	const blob = await fetchedBlob.blob();

	formData.append('file', blob);
	formData.append('description', data.description);
	formData.append('price', Number(data.price).toFixed(2));

	const creators = data.creators.split(',');

	if (creators.length && creators[0] !== '') {
		creators.map(async (creator, index) => {
			formData.append(`creators[${index}]`, creator);
		});
	}

	const fetcher = fetch(`${API_V1_URL}/nfts/mint`, {
		credentials: 'include',
		method: 'POST',
		body: formData,
	});

	const response = await fetcher;

	if (!response.ok) {
		throw { message: JSON.parse(await response.text()) };
	}

	const json = (await response.json()) as unknown as APIResponse<MintedNFT>;

	return json.data;
}

export const useMint = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(mint, {
		retry: false,
		onError: (error: Error) => {
			console.error(error);
			throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.refetchQueries('feedNft');

			router.reload();
		},
	});
};
