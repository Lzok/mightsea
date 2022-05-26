import { Client } from 'minio';
import { STORAGE } from './vars';

export default new Client({
	endPoint: STORAGE.endpoint,
	port: STORAGE.port,
	useSSL: STORAGE.useSSL,
	accessKey: STORAGE.accessKey,
	secretKey: STORAGE.secretKey,
});
