export function range(start: number, end: number): number[] {
	if (start > end)
		throw new Error('Start cannot be greater than the end value.');

	return Array(end - start + 1)
		.fill(0)
		.map((_, idx) => start + idx);
}
