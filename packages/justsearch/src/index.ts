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
	public async import(data: SearchIndex) {}
	public async export(): Promise<SearchIndex> {
		return {};
	}
}

export interface Options<T extends {}> {
	id: {
		[Key in keyof T]: T[Key] extends string | number ? Key : never;
	}[keyof T];
	rules: Partial<Record<Paths<T>, FieldConfiguration>>;
}

export class JustSearch<T extends {}> {
	constructor(
		private readonly _store: Store = new MemoryStore(),
		private readonly _options: Options<T>,
	) {

	}

	get store() {
		return this._store;
	}

	get options() {
		return this._options;
	}

	public async add(item: T): Promise<void> {

	}

	public async search(query: any): Promise<string> {
		return "asdf";
	}
}
