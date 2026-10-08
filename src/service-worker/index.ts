import { self } from '$app/service-worker';
import { assets, immutable } from '$app/manifest';
import { version } from '$app/env';
import { SPA_FALLBACK } from '#lib/constants.ts';

const cacheName = `lappen-${version}`;
const shell = `/${SPA_FALLBACK}`;
const files = [shell, ...immutable.map((f) => f.path), ...assets.map((f) => f.path)];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(files)));
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== cacheName).map((k) => caches.delete(k))))
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
	const key = event.request.mode === 'navigate' ? shell : event.request;
	event.respondWith(caches.match(key).then((hit) => hit ?? fetch(event.request)));
});
