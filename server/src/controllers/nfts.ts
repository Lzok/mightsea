import { UserId } from '@src/@types/user';
import { MIME_EXTENSIONS } from '@src/config/uploads';
import { STORAGE } from '@src/config/vars';
import s3Lib from '@src/library/s3';
import { insertOne } from '@src/queries/nfts/insertOne';
import { generateNftName } from '@src/utils/nfts';

type MintArgs = {
	owner_id: UserId;
	price: number;
	description: string;
	creators: UserId[];
	nft: Express.Multer.File;
};
export async function mint(dataToMint: MintArgs) {
	const nftSaved = await saveNftToS3(dataToMint.nft);

	const { description, price, owner_id, creators } = dataToMint;
	const nft_id = await insertOne({
		description,
		price,
		owner_id,
		creators,
		path: nftSaved.path,
	});

	return { nft_id, path: nftSaved.path };
}

export async function saveNftToS3(nft: Express.Multer.File) {
	const extension =
		MIME_EXTENSIONS[<'image/png' | 'default'>nft.mimetype] ??
		MIME_EXTENSIONS.default;
	const fileName = generateNftName(extension);

	const metadata = {
		'Content-Type': nft.mimetype,
	};

	return s3Lib.uploadImage(STORAGE.staticBucket, fileName, nft, metadata);
}

// export async function buy(nft_id: ) {}
