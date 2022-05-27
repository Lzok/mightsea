import { NewNftArgs } from '@src/@types/nft';
import { getPool, sql } from '@src/config/db';
import logger from '@src/config/logger';

export async function insertOne(data: NewNftArgs) {
	try {
		const { description, price, path, creators, owner_id } = data;
		const pool = await getPool();

		const result = await pool.transaction(async (tsxConn) => {
			const savedNft = await tsxConn.query(
				sql`INSERT INTO nfts (description, price, path, owner_id)
                VALUES (${description}, ${price}, ${path}, ${owner_id})
                RETURNING id, description, price, path, owner_id`
			);

			const nft = savedNft.rows[0];
			const values = creators.map((c) => [nft.id, c]);

			await tsxConn.query(sql`
			    INSERT INTO users_nfts (nft_id, user_id)
			    SELECT * FROM
                ${sql.unnest(values, [`uuid`, `uuid`])}`);

			return nft;
		});

		return result;
	} catch (error) {
		logger.error('Error from database from getUserById: ', { error });
		throw error;
	}
}
