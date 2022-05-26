import { NftId } from '@src/@types/nft';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export async function getNftById(id: NftId) {
	try {
		const pool = await getPool();

		const result = await pool.maybeOne(sql`
            SELECT id, description, price, path, owner_id
            FROM nfts
            WHERE id = ${id}
        `);

		if (!result) return null;

		return result;
	} catch (error) {
		logger.error('Error from database from getNftById: ', { error });
		throw error;
	}
}
