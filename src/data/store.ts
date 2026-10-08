import { use, useEffect, useState } from 'react'
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Query,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { COLLECTIONS, LAST_LIST_STORAGE_KEY } from '../../shared/constants'
import { db, uid } from '../firebase'
import { readStored, writeStored } from '../storage'
import { historyKey, normalize, type HistoryEntry, type Item, type List } from './items'

const items = (listId: string) => collection(db, COLLECTIONS.lists, listId, COLLECTIONS.items)
const history = (listId: string) => collection(db, COLLECTIONS.lists, listId, COLLECTIONS.history)

const fail = (e: unknown) => console.error(e)

function useLive<T>(key: string | undefined, build: (key: string) => Query, map: (d: QueryDocumentSnapshot<DocumentData>) => T) {
  const [state, setState] = useState<{ key?: string; docs: T[] }>({ docs: [] })
  useEffect(() => {
    if (!key) return
    return onSnapshot(build(key), (s) => setState({ key, docs: s.docs.map(map) }), fail)
  }, [key])
  return { docs: state.key === key ? state.docs : [], loading: state.key !== key }
}

export const useUid = () => use(uid)

export const useLists = () =>
  useLive(
    useUid(),
    (id) => query(collection(db, COLLECTIONS.lists), where('members', 'array-contains', id)),
    (d): List => ({ id: d.id, name: d.data().name }),
  )

export const useItems = (listId?: string) =>
  useLive(listId, items, (d): Item => {
    const data = d.data({ serverTimestamps: 'estimate' })
    return { id: d.id, name: data.name, checked: data.checked, createdAt: data.createdAt?.toMillis() ?? 0 }
  })

export const useHistory = (listId?: string) =>
  useLive(listId, history, (d): HistoryEntry => ({ name: d.data().name, count: d.data().count }))

export function createList(owner: string, name: string) {
  const ref = doc(collection(db, COLLECTIONS.lists))
  setDoc(ref, { name, members: [owner], createdAt: serverTimestamp() }).catch(fail)
  return ref.id
}

export const joinList = (listId: string, member: string) =>
  updateDoc(doc(db, COLLECTIONS.lists, listId), { members: arrayUnion(member) }).catch(fail)

export const setChecked = (listId: string, itemId: string, checked: boolean) =>
  updateDoc(doc(items(listId), itemId), { checked }).catch(fail)

export function addItem(listId: string, name: string, existing: Item[]) {
  const match = existing.find((i) => normalize(i.name) === normalize(name))
  if (!match) addDoc(items(listId), { name, checked: false, createdAt: serverTimestamp() }).catch(fail)
  else if (match.checked) setChecked(listId, match.id, false)
  setDoc(doc(history(listId), historyKey(name)), { name, count: increment(1) }, { merge: true }).catch(fail)
}

export function clearChecked(listId: string, all: Item[]) {
  const batch = writeBatch(db)
  all.filter((i) => i.checked).forEach((i) => batch.delete(doc(items(listId), i.id)))
  batch.commit().catch(fail)
}

export const rememberList = (listId: string) => writeStored(LAST_LIST_STORAGE_KEY, listId)
export const lastListId = () => readStored<string | undefined>(LAST_LIST_STORAGE_KEY, undefined)
