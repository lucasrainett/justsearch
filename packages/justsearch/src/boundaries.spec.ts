import { getBoundaries } from "./boundaries";

describe("boundaries", () => {
	it("should calculate boundaries", () => {
		expect(getBoundaries(5, 3)).toEqual([
			[0, 5],
			[0, 4],
			[1, 5],
			[0, 3],
			[1, 4],
			[2, 5],
		]);
	});
});
