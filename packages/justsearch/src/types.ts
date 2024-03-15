export type Paths<T extends object> = {
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

export type KeysOfType<T extends object, J> = {
	[K in keyof T]: T[K] extends J ? K : never;
}[keyof T];

export type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never;
export type PositiveNumber<T extends number> = `${T}` extends `-${string}`
	? never
	: T extends 0
		? never
		: T;
export type NegativeNumber<T extends number> =
	T extends PositiveNumber<T> ? never : T extends 0 ? never : T;
export type PositiveInteger<T extends number> = T extends Integer<T> &
	PositiveNumber<T>
	? T
	: never;
