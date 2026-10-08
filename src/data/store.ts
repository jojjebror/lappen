import { use, useEffect, useState } from 'react'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type DocumentReference,
  type Query,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { COLLECTIONS, LAST_LIST_STORAGE_KEY } from '../../shared/constants'
import { db, uid } from '../firebase'
import { readStored, writeStored } from '../storage'
import { historyKey, normalize, type HistoryEntry, type Household, type Item, type List } from './items'

const households = collection(db, COLLECTIONS.households)
const lists = collection(db, COLLECTIONS.lists)
const household = (householdId: string) => doc(households, householdId)
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

function useLiveDoc<T>(key: string | undefined, build: (key: string) => DocumentReference, map: (d: DocumentData) => T) {
  const [state, setState] = useState<{ key?: string; value?: T }>({})
  useEffect(() => {
    if (!key) return
    return onSnapshot(build(key), (s) => setState({ key, value: s.exists() ? map(s.data()) : undefined }), fail)
  }, [key])
  return { value: state.key === key ? state.value : undefined, loading: state.key !== key }
}

const toHousehold = (id: string, data: DocumentData): Household => ({ id, members: data.members, names: data.names ?? {} })

export const useUid = () => use(uid)

export const useHouseholds = () =>
  useLive(useUid(), (id) => query(households, where('members', 'array-contains', id)), (d) => toHousehold(d.id, d.data()))

export const useHouseholdById = (householdId?: string) => useLiveDoc(householdId, household, (data) => data as Pick<Household, 'members' | 'names'>)

export const useLists = (householdId?: string) =>
  useLive(householdId, (id) => query(lists, where('householdId', '==', id)), (d): List => ({ id: d.id, name: d.data().name }))

export const useItems = (listId?: string) =>
  useLive(listId, items, (d): Item => {
    const data = d.data({ serverTimestamps: 'estimate' })
    return { id: d.id, name: data.name, checked: data.checked, createdAt: data.createdAt?.toMillis() ?? 0 }
  })

export const useHistory = (listId?: string) =>
  useLive(listId, history, (d): HistoryEntry => ({ name: d.data().name, count: d.data().count }))

export function createHousehold(member: string) {
  const ref = doc(households)
  setDoc(ref, { members: [member], names: {}, createdAt: serverTimestamp() }).catch(fail)
  return ref.id
}

export async function adoptLegacyLists(member: string, householdId: string) {
  const legacy = await getDocs(query(lists, where('members', 'array-contains', member)))
  const batch = writeBatch(db)
  legacy.docs.filter((d) => !d.data().householdId).forEach((d) => batch.update(d.ref, { householdId }))
  return batch.commit()
}

export function joinHousehold(member: string, target: string, current: Household | undefined, own: List[]) {
  const batch = writeBatch(db)
  batch.update(household(target), { members: arrayUnion(member) })
  own.forEach((list) => batch.update(doc(lists, list.id), { householdId: target }))
  if (current && current.id !== target) batch.update(household(current.id), { members: arrayRemove(member) })
  batch.commit().catch(fail)
}

export const setName = (householdId: string, member: string, name: string) =>
  updateDoc(household(householdId), { [`names.${member}`]: name }).catch(fail)

export function createList(householdId: string, name: string) {
  const ref = doc(lists)
  setDoc(ref, { name, householdId, createdAt: serverTimestamp() }).catch(fail)
  return ref.id
}

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
