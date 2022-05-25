const path = require('path');
const tsConfigPaths = require('tsconfig-paths');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'dist/server/.env') });

/**
 * The default values for the following two const only work on local development.
 * In the production environment managed with pm2 we need to set the absolute path
 * to these folders.
 */
const baseUrl = process.env.TSCONFIG_PATHS_BASE ?? './dist/server';
const outDir = process.env.TSCONFIG_PATHS_OUT ?? './dist';
const env = process.env.ENV ?? 'development';

const baseUrlPath =
	env === 'production' ? path.resolve(outDir, baseUrl) : baseUrl;

const explicitParams = {
	baseUrl: baseUrlPath,
	paths: {
		'@src/*': ['src/*'],
	},
};
tsConfigPaths.register(explicitParams);
