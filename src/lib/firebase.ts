import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager
} from 'firebase/firestore';

const app = initializeApp({
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
});

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
	localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export const currentUid = () =>
	new Promise<string>((resolve, reject) => {
		const stop = onAuthStateChanged(auth, (user) => {
			stop();
			if (user) resolve(user.uid);
			else signInAnonymously(auth).then((c) => resolve(c.user.uid), reject);
		});
	});
