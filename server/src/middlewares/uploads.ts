import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { FILE_VALIDATIONS as FV } from '@src/config/uploads';
import { APIError } from '@src/errors/apiError';
import { fileErrors } from '@src/errors/uploads';
import logger from '@src/config/logger';

const memStorage = multer.memoryStorage();

export const inMemoryUpload = multer({
	storage: memStorage,
	limits: {
		fileSize: FV.MAX_SIZE,
		// Max number of file fields in multipart-form.
		files: FV.MAX_FILES,
	},
	fileFilter: (_, file, cb) => {
		logger.info('mime', file.mimetype);
		if (FV.VALID_MIMETYPES.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new APIError(fileErrors.INVALID_TYPE));
		}
	},
});

const uploadSingle = inMemoryUpload.single('file');

export const uploadSingleFile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	return uploadSingle(
		req,
		res,
		(err: multer.MulterError | NextFunction | string) => {
			if (err instanceof multer.MulterError) {
				logger.error('Multer error uploading single file');
				const e = handleMulterError(err);

				return next(new APIError(e));
			} else if (err) {
				return next(err);
			}

			return next();
		}
	);
};

function handleMulterError(err: multer.MulterError) {
	// LIMIT_UNEXPECTED_FILE as default return
	return fileErrors[err.code] ?? fileErrors['LIMIT_UNEXPECTED_FILE'];
}
