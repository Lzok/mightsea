import { buyNft, nftMintSchema, priceUpdateSchema } from '@src/schemas/nft';
import { paginationQuerySchema } from '@src/schemas/shared';

export const mint = {
	body: nftMintSchema,
};

export const buy = {
	body: buyNft,
};

export const updatePrice = {
	body: priceUpdateSchema,
};

export const paginationValidation = {
	query: paginationQuerySchema,
};
