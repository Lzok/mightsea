import { config } from 'dotenv';
config();

function getCookieMaxAge(jwtExpires: string): number {
	const numberOfDays = parseInt(jwtExpires.split('d')[0], 10);

	// We take just the number of days an return it in seconds to be used in the cookie.
	return numberOfDays * 24 * 60 * 60 * 1000;
}

export const ENV = process.env.NODE_ENV;
export const DEBUG = String(process.env.DEBUG).toLowerCase() == 'true' ?? false;

export const SYSTEM: {
	urlBase: string;
	domainHost: string;
	fullUrl: string;
} = {
	urlBase: process.env.URL_BASE ?? '',
	domainHost: process.env.DOMAIN_HOST ?? '',
	fullUrl: `${process.env.PROTOCOL}://${process.env.DOMAIN_HOST}`,
};

export const SERVICE_CONFIG = {
	port: Number(process.env.PORT),
};

export const JWT = {
	SECRET: process.env.JWT_SECRET,
	EXPIRES: process.env.JWT_EXPIRES ?? '14d',
};

type SameSite = boolean | 'strict' | 'lax' | 'none' | undefined;
export const COOKIES = {
	REFRESH_OPTS: {
		path: '/',
		httpOnly: true,
		sameSite: <SameSite>'lax',
		// For API testing purposes, this is ok. If we want to do e2e, we need to improve this.
		secure: ENV === 'production',
		maxAge: getCookieMaxAge(JWT.EXPIRES),
	},
};

export const DB = {
	URI: process.env.DB_URI,
};

export const STORAGE = {
	endpoint: process.env.STORAGE_ENDPOINT ?? '',
	port: Number(process.env.STORAGE_PORT) ?? 9000,
	useSSL:
		String(process.env.STORAGE_USE_SSL).toLowerCase() == 'true' ?? false,
	accessKey: process.env.STORAGE_ACCESS_KEY ?? '',
	secretKey: process.env.STORAGE_SECRET_KEY ?? '',
	staticBucket: process.env.STORAGE_STATIC_BUCKET ?? '',
};

export function isProduction() {
	return ENV === 'production';
}

export function isDevelopment() {
	return ENV === 'development';
}

export function isTest() {
	return ENV === 'test';
}
