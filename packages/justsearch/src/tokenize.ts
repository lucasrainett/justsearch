import { PositiveInteger } from "./types";
import { getBoundaries } from "./boundaries";
import { unique } from "./util";

export function tokenize<T extends number>(
	term: string,
	minLength: PositiveInteger<T>,
): string[] {
	if (term.length <= 0) {
		return [];
	}
	if (term.length <= minLength) {
		return [term];
	}
	return getBoundaries(term.length as PositiveInteger<T>, minLength)
		.map(([start, end]) => term.substring(start, end))
		.filter(unique);
}
