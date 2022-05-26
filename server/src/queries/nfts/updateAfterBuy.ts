import { NftId } from '@src/@types/nft';
import { UserId } from '@src/@types/user';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export type NewBalances = {
	old_owner_id: number;
	creators: {
		id: string;
		balance: number;
	}[];
	buyer_id: number;
};

export async function updateAfterBuy(
	nft_id: NftId,
	new_owner_id: UserId,
	old_owner_id: UserId,
	newBalances: NewBalances
) {
	try {
		const pool = await getPool();

		const result = await pool.transaction(async (tsxConn) => {
			// Change NFT ownership
			const newOwnershipProm = tsxConn.query(sql`
                UPDATE nfts
                SET owner_id = ${new_owner_id}
                WHERE nfts.id = ${nft_id}
                RETURNING *
            `);

			const oldOwnerBalanceProm = tsxConn.query(sql`
                UPDATE users
                SET balance = ${newBalances.old_owner_id}
                WHERE users.id = ${old_owner_id}
                RETURNING *
            `);

			const newOwnerBalanceProm = tsxConn.query(sql`
                UPDATE users
                SET balance = ${newBalances.buyer_id}
                WHERE users.id = ${new_owner_id}
                RETURNING *
            `);

			const creatorsBalanceProm = newBalances.creators.map((c) => {
				tsxConn.query(sql`
                    UPDATE users
                    SET balance = ${c.balance}
                    WHERE users.id = ${c.id}
                    RETURNING *
                `);
			});

			const [
				newOwnership,
				oldOwnerBalance,
				newOwnerBalance,
				creatorsBalance,
			] = await Promise.all([
				newOwnershipProm,
				oldOwnerBalanceProm,
				newOwnerBalanceProm,
				creatorsBalanceProm,
			]);

			logger.info('New Ownership: ', { newOwnership });
			logger.info('Old Ownership balance: ', { oldOwnerBalance });
			logger.info('New Ownership balance: ', { newOwnerBalance });
			logger.info('Creators Balance: ', { creatorsBalance });

			return {
				newOwnership,
				oldOwnerBalance,
				newOwnerBalance,
				creatorsBalance,
			};
		});

		return result;
	} catch (error) {
		logger.error('Error from database from getUserById: ', { error });
		throw error;
	}
}
