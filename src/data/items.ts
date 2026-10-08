import { LOCALE, MAX_OFTEN, MAX_SUGGESTIONS } from '../../shared/constants'

export type Item = { id: string; name: string; checked: boolean; createdAt: number }
export type HistoryEntry = { name: string; count: number }
export type List = { id: string; name: string }

export const normalize = (name: string) => name.trim().toLocaleLowerCase(LOCALE)

export const historyKey = (name: string) => encodeURIComponent(normalize(name))

export const sortItems = (items: Item[]) =>
  items.toSorted((a, b) => Number(a.checked) - Number(b.checked) || a.createdAt - b.createdAt)

export function suggest(history: HistoryEntry[], input: string, items: Item[]) {
  const query = normalize(input)
  if (!query) return []
  const onList = onListNames(items)
  return history
    .filter((h) => normalize(h.name).startsWith(query) && !onList.has(normalize(h.name)))
    .toSorted((a, b) => b.count - a.count)
    .slice(0, MAX_SUGGESTIONS)
}

export const onListNames = (items: Item[]) => new Set(items.filter((i) => !i.checked).map((i) => normalize(i.name)))

export const oftenBought = (history: HistoryEntry[]) => history.toSorted((a, b) => b.count - a.count).slice(0, MAX_OFTEN)
