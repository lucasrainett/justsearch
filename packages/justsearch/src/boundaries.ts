import { PositiveInteger } from "./types";
import { loop } from "./util";
import { memoize } from "./memoize";

export const getBoundaries = memoize(
	<T extends number, J extends number>(
		termLength: PositiveInteger<T>,
		minTokenLength: PositiveInteger<J>,
	) => {
		const totalTokenSizes = termLength - minTokenLength + 1;
		const tokenSizes = loop(totalTokenSizes, (index) => termLength - index);

		return tokenSizes
			.map((tokenSize) => {
				const totalTokens = termLength - tokenSize + 1;
				return loop(
					totalTokens,
					(index) => [index, index + tokenSize] as [number, number],
				);
			})
			.flat();
	},
);
