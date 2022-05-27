import {
	DEFAULT_PAGINATION_OFFSET,
	DEFAULT_PAGINATION_SIZE,
} from '@src/constants/pagination';

export function getPaginationValues(page: number, size: number) {
	const limit = size ?? DEFAULT_PAGINATION_SIZE;
	const offset = page ? (page - 1) * limit : DEFAULT_PAGINATION_OFFSET;

	return { limit, offset };
}
