import { UserId } from '@src/@types/user';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

const selectDefault = ['id', 'email', 'name', 'balance'];

export async function getUserById(id: UserId, select = selectDefault) {
	try {
		const pool = await getPool();
		const finalSelect = select.map((field) => sql.identifier([field]));

		const result = await pool.maybeOne(
			sql`SELECT ${sql.join(
				finalSelect,
				sql`, `
			)} FROM users WHERE id=${id}`
		);

		if (!result) return null;

		return result;
	} catch (error) {
		logger.error('Error from database from getUserById: ', { error });
		throw error;
	}
}
