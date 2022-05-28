import { UserBasicData } from './user';

export type NFT = {
	id: string;
	created_at: number;
	description: string;
	price: number;
	path: string;
	owner_id: UserBasicData['id'];
	owner_name: UserBasicData['name'];
};

export type FeedNFT = {
	current_page: number;
	total_pages: number;
	rows: NFT[];
};
