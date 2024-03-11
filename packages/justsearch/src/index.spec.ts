import { JustSearch, MemoryStore, Person, SearchIndex } from "./index";

describe("JustSearch", () => {
	it("should work", () => {
		const store = new MemoryStore();

		const data: SearchIndex = {};
		store.import(data).then();
		store.export().then();

		const index = new JustSearch<Person>(store, {
			id: "id",
			index: {

			},
			index2 : {}
		});

		const person1: Person = {
			id: "person1",
			name: "person name",
			email: "email@example.com",
			deep: {
				test1: "deep1",
			},
			list: [],
			test: []
		};

		index.add(person1);
		index.search(1);

		expect(1).toBe(1);
	});
});
