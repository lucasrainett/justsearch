import { JustSearch, MemoryStore } from "./index";

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
	it("should work", async () => {
		const store = new MemoryStore();

		const stringIndex = new JustSearch.TextIndex(store, {});

		await stringIndex.add("1", "test1");
		await stringIndex.add({ id: "2", value: "test2" });
		await stringIndex.add([
			{ id: "3", value: "test3" },
			{ id: "4", value: "test4" },
		]);
		await stringIndex.add({
			"5": "test5",
			"6": "test6",
			"7": "test7",
		});

		await stringIndex.search("test");

		// const data: SearchIndex = {};
		// store.import(data).then();
		// store.export().then();
		//
		// const index = new JustSearch<Person>(store, {
		// 	id: "id",
		// 	rules: {
		// 		email: { index: true },
		// 		name: { store: true },
		// 	},
		// });
		//
		// const person1: Person = {
		// 	id: "person1",
		// 	name: "person name",
		// 	email: "email@example.com",
		// 	deep: {
		// 		test1: "deep1",
		// 		list: [],
		// 	},
		// 	list: [],
		// 	test: [],
		// };
		//
		// index.add(person1);
		// index.search(1);
		//
		// expect(1).toBe(1);
	});
});
