type PNG = 'png';
type JPG = 'jpg';

export const FILE_VALIDATIONS = {
	VALID_MIMETYPES: ['image/png', 'image/jpeg'],
	MAX_SIZE: 5 * 1024 * 1024, // 5 MB
	MAX_FILES: 5,
};

export const MIME_EXTENSIONS: {
	'image/png': PNG;
	'image/jpeg': JPG;
	default: PNG;
} = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	default: 'png',
};
