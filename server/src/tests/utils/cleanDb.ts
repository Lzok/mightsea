import logger from '@src/config/logger';
import { getPool, sql } from '../../config/db';

export async function cleanDb() {
	try {
		const pool = await getPool();

		await pool.query(sql`
            TRUNCATE TABLE users_nfts CASCADE
        `);
	} catch (error) {
		logger.error('Error cleaning db in tests', { error });
		throw error;
	}
}
