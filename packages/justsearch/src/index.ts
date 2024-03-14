type Paths<T extends object> = {
	[K in keyof T]-?: K extends string | number
		? T[K] extends any[]
			? T[K][number] extends object
				? `${K}[].${Paths<T[K][number]>}`
				: `${K}[]`
			: T[K] extends object
				? `${K}.${Paths<T[K]>}`
				: K
		: never;
}[keyof T];

export interface FieldConfiguration {
	index?: boolean;
	store?: boolean;
}

export interface SearchIndex {}

export interface Store {
	import(data: SearchIndex): Promise<void>;
	export(): Promise<SearchIndex>;
}

export class MemoryStore implements Store {
	constructor() {}
	public async import(data: SearchIndex) {}
	public async export(): Promise<SearchIndex> {
		return {};
	}
}

type KeysOfType<T extends object, J> = {
	[K in keyof T]: T[K] extends J ? K : never;
}[keyof T];

export interface Options<T extends {}> {
	id: KeysOfType<T, string | number>;
	rules: Partial<Record<Paths<T>, FieldConfiguration>>;
}

export interface StringIndexOptions {}

function isObject(value: any): value is object {
	return typeof value === "object" && !Array.isArray(value) && value !== null;
}

function isTextIndexEntry(value: any): value is TextIndexEntry {
	if (isObject(value)) {
		const keys = Object.keys(value);
		const [key1, key2] = keys.sort();
		return keys.length === 2 && key1 === "id" && key2 === "value";
	}
	return false;
}

interface TextIndexEntry {
	id: string;
	value: string;
}

export class TextIndex {
	constructor(
		private readonly _store: Store = new MemoryStore(),
		private readonly _options: StringIndexOptions,
	) {}

	get store() {
		return this._store;
	}

	get options() {
		return this._options;
	}

	public async add(value: TextIndexEntry): Promise<void>;
	public async add(values: TextIndexEntry[]): Promise<void>;
	public async add(id: string, value: string): Promise<void>;
	public async add(values: Record<string, string>): Promise<void>;
	public async add(
		idOrValues:
			| string
			| TextIndexEntry
			| TextIndexEntry[]
			| Record<string, string>,
		value?: string,
	): Promise<void> {
		const allRecords: Record<string, string> =
			typeof idOrValues === "string"
				? { [idOrValues]: value as string }
				: isTextIndexEntry(idOrValues)
					? { [idOrValues.id]: idOrValues.value }
					: Array.isArray(idOrValues)
						? Object.fromEntries(
								idOrValues.map(({ id, value }) => [id, value]),
							)
						: idOrValues;

		console.log(allRecords);
	}

	public async remove(id: string): Promise<void> {}

	public async search(
		query: string,
		options: { limit: number } = { limit: 100 },
	): Promise<string[]> {
		return ["asdf"];
	}
}

export class JustSearch<T extends {}> {
	public static TextIndex = TextIndex;

	constructor(
		private readonly _store: Store = new MemoryStore(),
		private readonly _options: Options<T>,
	) {
		new TextIndex(_store, {});
	}

	get store() {
		return this._store;
	}

	get options() {
		return this._options;
	}

	public async add(item: T): Promise<void> {}

	public async search(query: any): Promise<string> {
		return "asdf";
	}
}
