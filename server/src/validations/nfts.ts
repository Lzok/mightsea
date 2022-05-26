import { buyNft, nftMintSchema } from '@src/schemas/nft';

export const mint = {
	body: nftMintSchema,
};

export const buy = {
	body: buyNft,
};
