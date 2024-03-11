import type {Schema, PartialDeep} from "type-fest";
import type { NonRecursiveType, StaticPartOfArray, ToString, VariablePartOfArray } from "type-fest/source/internal";
import type { IsAny } from "type-fest/source/is-any";
import type { UnknownArray } from "type-fest/source/unknown-array";
import type { EmptyObject } from "type-fest/source/empty-object";
import type { IsNever } from "type-fest/source/is-never";

type Paths<T> =
	T extends NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
		? never
		: IsAny<T> extends true
			? never
			: T extends UnknownArray
				? number extends T['length']
					// We need to handle the fixed and non-fixed index part of the array separately.
					? InternalPaths<StaticPartOfArray<T>>
					| InternalPaths<Array<VariablePartOfArray<T>[number]>>
					: InternalPaths<T>
				: T extends object
					? InternalPaths<T>
					: never;

type InternalPaths<_T, T = Required<_T>> =
	T extends EmptyObject | readonly []
		? never
		: {
			[Key in keyof T]:
			Key extends string | number // Limit `Key` to string or number.
				// If `Key` is a number, return `Key | `${Key}``, because both `array[0]` and `array['0']` work.
				?
				| Key
				| ToString<Key>
				| (
				IsNever<Paths<T[Key]>> extends false
					? `${Key}${T[Key] extends UnknownArray ? "[]." : "."}${T[Key] extends UnknownArray ? Paths<T[Key][number]> : Paths<T[Key]>}`
					: never
				)
				: never
		}[keyof T & (T extends UnknownArray ? number : unknown)];

export interface Person {
	id: string;
	name: string;
	email: string;
	deep: {
		test1: string;
	};
	test: Array<string>;
	list: Array<Address>;
}

export interface Address {
	street: string;
	number: string;
}

export interface FieldConfiguration {
	index: boolean;
	store: boolean;
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
	id: keyof T;
	index: PartialDeep<Schema<T, FieldConfiguration>>;
	index2: Partial<Record<Paths<T>, string>>,
}

export class JustSearch<T extends {}> {
	constructor(
		private _store: Store = new MemoryStore(),
		private _options: Options<T>,
	) {}

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
