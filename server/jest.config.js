/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	modulePaths: ['<rootDir>'],
	roots: ['<rootDir>/src'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: tsjPreset.transform,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	modulePathIgnorePatterns: ['/tests/fixtures/*', '/tests/factories/*'],
	testPathIgnorePatterns: ['./node_modules/', './dist'],
	verbose: true,
	testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	setupFiles: ['dotenv/config'],
};
