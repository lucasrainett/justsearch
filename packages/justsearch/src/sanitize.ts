import { remove } from "diacritics";

export function sanitize(text: string): string {
	return remove(text).toLowerCase();
}
