import { NFTExtension } from '@src/@types/nft';
import { randomBytes } from 'crypto';

export function generateRandomStr(bytes = 5): string {
	return randomBytes(bytes).toString('hex');
}

export function generateNftName(ext: NFTExtension): string {
	return `${generateRandomStr()}.${ext}`;
}
