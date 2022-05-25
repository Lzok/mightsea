export function omit<T extends object, K extends Extract<keyof T, string>>(
	obj: T,
	...keys: K[]
): Omit<T, K> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ret: any = {};
	const excludeSet: Set<string> = new Set(keys);

	for (const key in obj) {
		if (!excludeSet.has(key)) {
			ret[key] = obj[key];
		}
	}
	return ret;
}
