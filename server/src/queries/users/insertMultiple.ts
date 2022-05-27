import { UserBasicData } from '@src/@types/user';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export async function insertMultiple(data: UserBasicData[]) {
	try {
		const pool = await getPool();

		const result = await pool.transaction(async (tsxConn) => {
			const values = data.map((c) => [c.id, c.name, c.email, c.balance]);

			const users = await tsxConn.query(sql`
			    INSERT INTO users (id, name, email, balance)
			    SELECT * FROM
                ${sql.unnest(values, [`uuid`, `varchar`, `varchar`, `int4`])}
                RETURNING *
            `);

			return users.rows;
		});

		return result;
	} catch (error) {
		logger.error('Error from database from insertMultiple: ', { error });
		throw error;
	}
}
