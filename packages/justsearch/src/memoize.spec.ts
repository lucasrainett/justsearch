import { memoize } from "./memoize";

describe("memoize", () => {
	it("should only call once", () => {
		const jestFunction = jest
			.fn()
			.mockImplementation((v1: number, v2: number) => v1 + v2);

		const func = (v1: number, v2: number) => jestFunction(v1, v2);

		const add = memoize(func);

		expect(jestFunction).not.toHaveBeenCalled();

		const result = add(10, 20);

		expect(result).toEqual(30);
		expect(jestFunction).toHaveBeenCalledWith(10, 20);
		expect(jestFunction).toHaveBeenCalledTimes(1);

		const result2 = add(10, 20);

		expect(result2).toEqual(30);
		expect(jestFunction).toHaveBeenCalledTimes(1);

		const result3 = add(10, 40);

		expect(result3).toEqual(50);
		expect(jestFunction).toHaveBeenCalledTimes(2);
	});

	it("should memoize for one arguments", () => {
		const jestFunction = jest
			.fn()
			.mockImplementation((v1: number) => v1 + "-text");

		const func = (v1: number) => jestFunction(v1);

		expect(jestFunction).not.toHaveBeenCalled();

		const returnVText = memoize(func);

		expect(jestFunction).not.toHaveBeenCalled();

		expect(returnVText(2)).toEqual("2-text");

		expect(jestFunction).toHaveBeenCalledWith(2);
		expect(jestFunction).toHaveBeenCalledTimes(1);

		expect(returnVText(2)).toEqual("2-text");

		expect(jestFunction).toHaveBeenCalledTimes(1);
	});

	it("should memoize for no arguments", () => {
		const jestFunction = jest.fn().mockImplementation(() => "text");
		const func = () => jestFunction();

		expect(jestFunction).not.toHaveBeenCalled();

		const returnText = memoize(func);

		expect(jestFunction).not.toHaveBeenCalled();

		expect(returnText()).toEqual("text");

		expect(jestFunction).toHaveBeenCalledWith();
		expect(jestFunction).toHaveBeenCalledTimes(1);

		expect(returnText()).toEqual("text");

		expect(jestFunction).toHaveBeenCalledTimes(1);
	});
});
