import { curry } from "./curry";

describe("curry", () => {
	it("should skip call function", () => {
		const jestFunction = jest
			.fn()
			.mockImplementation((...args: any[]) => args.join("-"));

		const callback = (param1: number, param2: string) =>
			jestFunction(param1, param2);

		const curryFunction = curry(callback);

		expect(jestFunction).not.toHaveBeenCalled();

		const curryFunction10 = curryFunction(10);

		expect(jestFunction).not.toHaveBeenCalled();

		const result = curryFunction10("text");

		expect(jestFunction).toHaveBeenCalledWith(10, "text");
		expect(result).toEqual("10-text");

		const result2 = curryFunction10("text2");
		expect(jestFunction).toHaveBeenCalledWith(10, "text2");
		expect(result2).toEqual("10-text2");
	});
});
