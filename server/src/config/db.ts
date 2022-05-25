import { createPool, sql, DatabasePool } from 'slonik';
import { DB } from './vars';

let pool: DatabasePool;

export async function getPool() {
	if (pool) return pool;

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return createPool(DB.URI!);
}

export async function shutdownPool() {
	await pool.end();
}

export { sql };
