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
	type QueryDocumentSnapshot
} from 'firebase/firestore';
import { COLLECTIONS } from './constants';
import { currentUid, db } from './firebase';
import { historyKey, normalize, type HistoryEntry, type Item } from './items';

export type List = { id: string; name: string };

const snapshotOptions = { serverTimestamps: 'estimate' } as const;

const items = (listId: string) => collection(db, COLLECTIONS.lists, listId, COLLECTIONS.items);
const history = (listId: string) => collection(db, COLLECTIONS.lists, listId, COLLECTIONS.history);

const live = <T>(
	q: () => Query | undefined,
	map: (d: QueryDocumentSnapshot<DocumentData>) => T
) => {
	const state = $state<{ docs: T[]; loading: boolean }>({ docs: [], loading: true });
	$effect(() => {
		const current = q();
		if (!current) return;
		return onSnapshot(current, (s) => {
			state.docs = s.docs.map(map);
			state.loading = false;
		});
	});
	return state;
};

const fail = (e: unknown) => console.error(e);

export const session = $state<{ uid?: string }>({});
currentUid().then((uid) => (session.uid = uid), fail);

export const liveLists = () =>
	live(
		() =>
			session.uid
				? query(collection(db, COLLECTIONS.lists), where('members', 'array-contains', session.uid))
				: undefined,
		(d): List => ({ id: d.id, name: d.data().name })
	);

const ifReady =
	<T>(listId: () => string | undefined, ref: (id: string) => T) =>
	() => {
		const id = listId();
		return id ? ref(id) : undefined;
	};

export const liveItems = (listId: () => string | undefined) =>
	live(ifReady(listId, items), (d): Item => {
		const data = d.data(snapshotOptions);
		return {
			id: d.id,
			name: data.name,
			checked: data.checked,
			createdAt: data.createdAt?.toMillis() ?? 0
		};
	});

export const liveHistory = (listId: () => string | undefined) =>
	live(ifReady(listId, history), (d): HistoryEntry => ({
		name: d.data().name,
		count: d.data().count
	}));

export const createList = (uid: string, name: string) => {
	const ref = doc(collection(db, COLLECTIONS.lists));
	setDoc(ref, { name, members: [uid], createdAt: serverTimestamp() }).catch(fail);
	return ref.id;
};

export const joinList = (listId: string, uid: string) =>
	updateDoc(doc(db, COLLECTIONS.lists, listId), { members: arrayUnion(uid) }).catch(fail);

export const addItem = (listId: string, name: string, existing: Item[]) => {
	const match = existing.find((i) => normalize(i.name) === normalize(name));
	if (match) {
		if (match.checked) setChecked(listId, match.id, false);
	} else {
		addDoc(items(listId), { name, checked: false, createdAt: serverTimestamp() }).catch(fail);
	}
	setDoc(
		doc(history(listId), historyKey(name)),
		{ name, count: increment(1) },
		{ merge: true }
	).catch(fail);
};

export const setChecked = (listId: string, itemId: string, checked: boolean) =>
	updateDoc(doc(items(listId), itemId), { checked }).catch(fail);

export const clearChecked = (listId: string, all: Item[]) => {
	const batch = writeBatch(db);
	all.filter((i) => i.checked).forEach((i) => batch.delete(doc(items(listId), i.id)));
	batch.commit().catch(fail);
};
