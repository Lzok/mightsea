import { Client, BucketItem, ItemBucketMetadata } from 'minio';

// If we do not import multer, we cannot use its type from express: Express.Multer.File
import 'multer';
import storage from '@src/config/storage';
import logger from '@src/config/logger';

const region = 'CLOUD-00';

type File = Express.Multer.File;

type StorageStream = string | Buffer;
type Metadata = ItemBucketMetadata & {
	'Content-Type': string;
};

// MINIO API Reference: https://docs.min.io/docs/javascript-client-api-reference.html
class Storage {
	private readonly region: string;
	private readonly storage: Client;

	constructor(region: string) {
		this.storage = storage;
		this.region = region;
	}

	async makeBucket(bucketName: string, region: string) {
		return this.storage.makeBucket(bucketName, region);
	}

	async bucketExists(bucketName: string) {
		return this.storage.bucketExists(bucketName);
	}

	// Uploads an object from a stream/Buffer.
	async putObject(
		bucketName: string,
		fileName: string,
		buffer: StorageStream,
		size: number,
		metadata: Metadata
	) {
		return this.storage.putObject(
			bucketName,
			fileName,
			buffer,
			size,
			metadata
		);
	}

	// Uploads contents from a file to objectName.
	async fPutObject(
		bucketName: string,
		fileName: string,
		filePath: string,
		metadata: Metadata
	) {
		return this.storage.fPutObject(
			bucketName,
			fileName,
			filePath,
			metadata
		);
	}

	async listObjects(bucketName: string, prefix = ''): Promise<BucketItem[]> {
		return new Promise((resolve, reject) => {
			const objects: BucketItem[] = [];

			const stream = this.storage.listObjectsV2(bucketName, prefix, true);

			stream.on('data', (obj) => {
				objects.push(obj);
			});
			stream.on('error', (err) => {
				return reject(err);
			});
			stream.on('end', () => {
				return resolve(objects);
			});
		});
	}

	async uploadImage(
		bucket: string,
		path: string,
		imgFile: File,
		metadata: Metadata
	) {
		const checkBucket = await this.bucketExists(bucket);
		if (!checkBucket) await this.makeBucket(bucket, this.region);

		const buffer = imgFile.buffer;
		const size = imgFile.size;
		const etag = await this.putObject(bucket, path, buffer, size, metadata);

		return { path: `${bucket}/${path}`, etag };
	}

	async objectExists(bucket: string, path: string) {
		try {
			// The statObject method returns an S3Error Not Found if the file does not exist.
			const stats = await this.storage.statObject(bucket, path);
			return stats;
		} catch {
			logger.info(`File ${path} in bucket ${bucket} does not exists.`);
			return false;
		}
	}
}

export default new Storage(region);
