import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';
import {
	DEFAULT_PAGINATION_PAGE,
	DEFAULT_PAGINATION_SIZE,
} from '@src/constants/pagination';
import { getPaginationValues } from '@src/utils/pagination';

export async function getFeed(
	page: number = DEFAULT_PAGINATION_SIZE,
	size: number = DEFAULT_PAGINATION_PAGE
) {
	try {
		const { limit, offset } = getPaginationValues(page, size);

		const pool = await getPool();

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
				ORDER BY created_at DESC
                LIMIT ${limit}
                OFFSET ${offset}
            `);

			const [totalRaw, nftsRaw] = await Promise.all([
				countProm,
				nftsProm,
			]);

			const total = totalRaw.rows[0].count as number;
			const total_pages = Math.ceil(total / limit);
			const rows = nftsRaw.rows;

			return { current_page: page, total_pages, rows };
		});

		if (!result) return null;

		return result;
	} catch (error) {
		logger.error('Error from database from getNftById: ', { error });
		throw error;
	}
}
