import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export async function getFeed(page = 1, limit = 3) {
	try {
		const pool = await getPool();
		const offset = page * limit;

		const result = await pool.transaction(async (tsxConn) => {
			const countProm = tsxConn.query(sql`
                SELECT COUNT (id)
                FROM nfts
            `);

			const nftsProm = tsxConn.query(sql`
                SELECT nfts.id, nfts.created_at, description, price, path, owner_id, owner.name as owner_name
                FROM nfts
                INNER JOIN users as owner
                ON nfts.owner_id = owner.id
                LIMIT ${limit}
                OFFSET ${offset}
            `);
			// WHERE nfts.created_at > ${last}

			const [totalRaw, nftsRaw] = await Promise.all([
				countProm,
				nftsProm,
			]);

			const total = totalRaw.rows[0].count as number;
			const total_pages = Math.ceil(total / limit);
			const nfts = nftsRaw.rows;

			return { current_page: page, total_pages, nfts };
		});

		if (!result) return null;

		return result;
	} catch (error) {
		logger.error('Error from database from getNftById: ', { error });
		throw error;
	}
}
