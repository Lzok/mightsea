import { NftId } from '@src/@types/nft';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export async function updateNftPrice(nft_id: NftId, price: number) {
	try {
		const pool = await getPool();

		const result = await pool.transaction(async (tsxConn) => {
			const savedNft = await tsxConn.query(sql`
                UPDATE nfts
                SET price = ${price}
                WHERE id = ${nft_id}
                RETURNING *
            `);

			if (savedNft.rows.length > 1) {
				logger.warn(
					'Something is wrong here. More than one nft row have been updated the price. ',
					{ ...savedNft.rows }
				);
			}

			return savedNft.rows.length > 0 ? savedNft.rows[0] : null;
		});

		return result;
	} catch (error) {
		logger.error('Error from database from getUserById: ', { error });
		throw error;
	}
}
