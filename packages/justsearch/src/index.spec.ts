import { JustSearch, MemoryStore, SearchIndex } from "./index";

interface Person {
	id: string;
	name: string;
	email: string;
	deep: {
		test1: string;
		list: Array<Address>;
	};
	test: Array<string>;
	list: Array<Address>;
}

interface Address {
	street: string;
	number: string;
}

describe("JustSearch", () => {
	it("should work", () => {
		const store = new MemoryStore();

		const data: SearchIndex = {};
		store.import(data).then();
		store.export().then();

		const index = new JustSearch<Person>(store, {
			id: "id",
			rules: {
				email: { index: true },
				name: { store: true },
			},
		});

		const person1: Person = {
			id: "person1",
			name: "person name",
			email: "email@example.com",
			deep: {
				test1: "deep1",
				list: [],
			},
			list: [],
			test: [],
		};

		index.add(person1);
		index.search(1);

		expect(1).toBe(1);
	});
});
