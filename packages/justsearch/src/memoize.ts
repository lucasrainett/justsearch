export function memoize<F extends (...args: any[]) => any>(func: F): F {
	const cache = new Map();
	return ((...args: Parameters<F>): ReturnType<F> => {
		const argsCopy = args.slice();

		const last = argsCopy.pop();
		const itemCache = argsCopy.reduce((final, item) => {
			const value = final.get(item) || new Map();
			final.set(item, value);
			return value;
		}, cache);

		const result = itemCache.get(last) || func(...args);
		itemCache.set(last, result);
		return result;
	}) as F;
}
