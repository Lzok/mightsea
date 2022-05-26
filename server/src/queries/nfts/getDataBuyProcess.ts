import { NftId } from '@src/@types/nft';
import { UserBasicData, UserId } from '@src/@types/user';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export type NFTBuyData = {
	id: NftId;
	price: number;
	owner_id: UserId;
	user_id: UserId;
	balance: number;
	owner_balance: number;
};
type Return = {
	buyerData: UserBasicData | null;
	nftData: NFTBuyData[] | null;
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
			SELECT nfts.id, price, owner_id, owner.balance as owner_balance, creators.user_id, users.balance
			FROM nfts
			INNER JOIN users_nfts as creators
			ON nfts.id = creators.nft_id
			INNER JOIN users
			ON creators.user_id = users.id
			INNER JOIN users as owner
			ON nfts.owner_id = owner.id
			WHERE nfts.id = ${nft_id}
		`);

		const [buyerData, nftData] = await Promise.all([
			buyerDataProm,
			nftDataProm,
		]);

		logger.info('Buyer Data: ', { buyerData });
		logger.info('Nft Data: ', { nftData });

		const buyerObj =
			buyerData.rows.length > 0
				? (buyerData.rows[0] as UserBasicData)
				: null;
		const nftObj =
			nftData.rows.length > 0 ? (nftData.rows as NFTBuyData[]) : null;

		return {
			buyerData: buyerObj,
			nftData: nftObj,
		};
	} catch (error) {
		logger.error('Error from database from getUserById: ', { error });
		throw error;
	}
}
