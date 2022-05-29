import { Client, ItemBucketMetadata } from 'minio';
import storage from '@src/config/storage';

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
}

export default new Storage(region);
