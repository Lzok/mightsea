import 'worker_threads';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './server';
import logger from './config/logger';
import { SERVICE_CONFIG } from './config/vars';
import { shutdownPool } from './config/db';

// Start the server
const server = app.listen(SERVICE_CONFIG.port, () => {
	logger.info(`Server started and listening port ${SERVICE_CONFIG.port}`);
});

type END_SIGNALS = 'SIGTERM' | 'SIGINT';

const startGracefulShutdown = async (signal: END_SIGNALS) => {
	logger.info(
		`Starting shutdown of express Mightsea because of ${signal} signal...`
	);
	await shutdownPool();
	server.close(() => {
		logger.info('Server terminated.');
		process.exit(1);
	});
};

process.on('SIGTERM', () => startGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => startGracefulShutdown('SIGINT'));

export default server;
