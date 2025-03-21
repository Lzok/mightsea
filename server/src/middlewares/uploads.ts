import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { FILE_VALIDATIONS as FV } from '@src/config/uploads';
import { APIError } from '@src/errors/apiError';
import { fileErrors } from '@src/errors/uploads';
import logger from '@src/config/logger';
import { sendResponse } from '@src/errors/format';

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

				// Return response to the client here.
				return sendResponse(res, e);
			} else if (err) {
				return sendResponse(res, err);
			}

			if (!req.file)
				return sendResponse(
					res,
					new APIError(fileErrors.FILE_IS_REQUIRED)
				);

			return next();
		}
	);
};

function handleMulterError(err: multer.MulterError) {
	// LIMIT_UNEXPECTED_FILE as default return
	return (
		new APIError(fileErrors[err.code]) ??
		new APIError(fileErrors['LIMIT_UNEXPECTED_FILE'])
	);
}
