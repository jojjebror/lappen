import { MAX_SUGGESTIONS } from './constants';

export type Item = { id: string; name: string; checked: boolean; createdAt: number };
export type HistoryEntry = { name: string; count: number };

export const normalize = (name: string) => name.trim().toLocaleLowerCase();

export const historyKey = (name: string) => encodeURIComponent(normalize(name));

export const sortItems = (items: Item[]) =>
	items.toSorted((a, b) => Number(a.checked) - Number(b.checked) || a.createdAt - b.createdAt);

export const suggest = (history: HistoryEntry[], input: string, items: Item[]) => {
	const query = normalize(input);
	const onList = new Set(items.filter((i) => !i.checked).map((i) => normalize(i.name)));
	return query
		? history
				.filter((h) => normalize(h.name).startsWith(query) && !onList.has(normalize(h.name)))
				.toSorted((a, b) => b.count - a.count)
				.slice(0, MAX_SUGGESTIONS)
		: [];
};
