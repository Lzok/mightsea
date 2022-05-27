import { NftId } from '@src/@types/nft';
import { UserBasicData, UserId } from '@src/@types/user';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export type NFTBuyData = {
	id: NftId;
	price: number;
	owner_id: UserId;
	owner_balance: number;
	creators: {
		user_id: UserId;
		balance: number;
	}[];
};
type Return = {
	buyerData: UserBasicData | null;
	nftData: NFTBuyData | null;
};
export async function getDataBuyProcess(
	nft_id: NftId,
	buyer: UserId
): Promise<Return> {
	try {
		const pool = await getPool();

		const buyerDataProm = pool.query(sql`
			SELECT id, name, email, balance
			FROM users
			WHERE id=${buyer}
		`);

		const nftDataProm = pool.query(sql`
			SELECT nfts.id, price, owner_id, owner.balance as owner_balance, json_agg(json_build_object('user_id', creators.user_id, 'balance', users.balance)) as creators
			FROM nfts
			INNER JOIN users_nfts as creators
			ON nfts.id = creators.nft_id
			INNER JOIN users
			ON creators.user_id = users.id
			INNER JOIN users as owner
			ON nfts.owner_id = owner.id
			WHERE nfts.id = ${nft_id}
			GROUP BY nfts.id, owner.id
		`);

		const [buyerData, nftData] = await Promise.all([
			buyerDataProm,
			nftDataProm,
		]);

		const buyerObj =
			buyerData.rows.length > 0
				? (buyerData.rows[0] as UserBasicData)
				: null;
		const nftObj =
			nftData.rows.length > 0
				? (nftData.rows[0] as unknown as NFTBuyData)
				: null;

		return {
			buyerData: buyerObj,
			nftData: nftObj,
		};
	} catch (error) {
		logger.error('Error from database from getUserById: ', { error });
		throw error;
	}
}
