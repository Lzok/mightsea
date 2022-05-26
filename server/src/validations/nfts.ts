import { buyNft, nftMintSchema, priceUpdateSchema } from '@src/schemas/nft';

export const mint = {
	body: nftMintSchema,
};

export const buy = {
	body: buyNft,
};

export const updatePrice = {
	body: priceUpdateSchema,
};
