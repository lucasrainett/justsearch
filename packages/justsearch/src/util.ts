export function isObject(value: any): value is object {
	return typeof value === "object" && !Array.isArray(value) && value !== null;
}

export function createArray<T>(size: number): T[] {
	return Array.from(Array(size));
}

export function unique<K, T extends K[]>(value: K, index: number, array: T) {
	return array.indexOf(value) === index;
}

export function loop<T>(total: number, loopFunction: (index: number) => T) {
	return createArray(total).map((_, index) => loopFunction(index));
}

export function mapObject<T extends object, J>(
	object: T,
	mapFunction: (entry: [keyof T, T[keyof T]]) => [keyof T, J]
): { [key in keyof T]: J } {
	const entries = Object.entries(object) as Array<[keyof T, T[keyof T]]>;
	return Object.fromEntries(entries.map(mapFunction)) as {
		[key in keyof T]: J;
	};
}
