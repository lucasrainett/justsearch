import { tokenize } from "./tokenize";

describe("tokenize", () => {
	it("should tokenize", () => {
		const verify = (
			term: string,
			minLength: number,
			expected: string[],
		) => {
			const result = tokenize(term, minLength as any);
			expect(result).toEqual(expect.arrayContaining(expected));
			expect(result.length).toEqual(expected.length);
		};

		verify("", 1, []);
		verify("", 10, []);
		verify("tokenize", 50, ["tokenize"]);
		verify("tokenize", 8, ["tokenize"]);
		verify("tokenize", 7, ["tokeniz", "okenize", "tokenize"]);
		verify("abc", 1, ["a", "b", "c", "ab", "bc", "abc"]);
		verify("a", 1, ["a"]);
		verify("a", 2, ["a"]);
		verify("ab", 1, ["a", "b", "ab"]);
		verify("aaaaa", 1, ["a", "aa", "aaa", "aaaa", "aaaaa"]);
		verify("tokenize", 3, [
			"tok",
			"oke",
			"ken",
			"eni",
			"niz",
			"ize",
			"toke",
			"oken",
			"keni",
			"eniz",
			"nize",
			"token",
			"okeni",
			"keniz",
			"enize",
			"tokeni",
			"okeniz",
			"kenize",
			"tokeniz",
			"okenize",
			"tokenize",
		]);
	});
});
