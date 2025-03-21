import { UserBasicData } from './user';

export type NFT = {
	id: string;
	created_at: number;
	description: string;
	price: number;
	path: string;
	owner_id: UserBasicData['id'];
	owner_name: UserBasicData['name'];
	creators: {
		user_id: UserBasicData['id'];
		name: string;
	}[];
};

export type FeedNFT = {
	current_page: number;
	total_pages: number;
	rows: NFT[];
};

export type MintedNFT = Pick<
	NFT,
	'description' | 'price' | 'path' | 'owner_id'
> & { nft_id: string };