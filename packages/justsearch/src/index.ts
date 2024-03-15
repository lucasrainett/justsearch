import { KeysOfType, Paths, PositiveInteger } from "./types";
import { isObject, mapObject } from "./util";
import { sanitize } from "./sanitize";
import { tokenize } from "./tokenize";

export interface FieldConfiguration {
	index?: boolean;
	store?: boolean;
}

export interface SearchIndex {
	allTokens: string[],
	idIndex: Record<string, number[]>;
	tokenIndex: Record<string, string[]>;
}

export interface Store {
	add(tokenIndex: Record<string, string[]>): Promise<void>;
	get(query: string): Promise<string[]>;
	import(data: SearchIndex): Promise<void>;
	export(): Promise<SearchIndex>;
}

export class MemoryStore implements Store {
	data: SearchIndex = {
		allTokens: [],
		idIndex: {},
		tokenIndex: {}
	};

	constructor() {}

	public async add(tokenIndex: Record<string, string[]>): Promise<void>{

		Object.entries(tokenIndex).forEach(([id, tokens]) => {
			const tokenMap = Object.fromEntries(tokens.map((token) => {
				if(!this.data.allTokens.includes(token)){
					this.data.allTokens.push(token);
				}
				return [token, this.data.allTokens.indexOf(token)];
			}));
			this.data.idIndex[id] = tokens.map((token) => tokenMap[token]);
			tokens.forEach((token) => {
				this.data.tokenIndex[tokenMap[token]] = this.data.tokenIndex[tokenMap[token]] || [];
				this.data.tokenIndex[tokenMap[token]].push(id);
			});
		});
	}

	public async get(query: string): Promise<string[]> {
		const tokenPosition = this.data.allTokens.indexOf(query);
		return this.data.tokenIndex[tokenPosition] || [];
	}

	public async import(_data: SearchIndex) {
		this.data = _data;
	}

	public async export(): Promise<SearchIndex> {
		return this.data;
	}
}

export interface Options<T extends {}> {
	id: KeysOfType<T, string | number>;
	rules: Partial<Record<Paths<T>, FieldConfiguration>>;
}

export interface StringIndexOptions<T extends number> {
	minTokenLength: PositiveInteger<T>;
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

export class TextIndex<T extends number> {
	data: Record<string, string[]> = {};

	constructor(
		private readonly _store: Store = new MemoryStore(),
		private readonly _options: StringIndexOptions<T>,
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

		const tokenIndex = mapObject(allRecords, ([id, text]) => {
			const terms = sanitize(text).split(" ");
			const tokens = terms
				.map((term) => tokenize(term, this._options.minTokenLength))
				.flat();
			return [id, tokens];
		});

		return this._store.add(tokenIndex);
	}

	public async remove(id: string): Promise<void> {}

	public async search(
		query: string,
		options: { limit: number } = { limit: 100 },
	): Promise<string[]> {
		return this._store.get(query);
	}
}

export class JustSearch<T extends {}> {
	public static TextIndex = TextIndex;

	constructor(
		private readonly _store: Store = new MemoryStore(),
		private readonly _options: Options<T>,
	) {
		new TextIndex(_store, { minTokenLength: 1 });
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
