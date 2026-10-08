# Architecture

Lappen is a shared shopping list for a household, used as an installable web app on phones.
Three constraints shaped how it is built:

- Two people edit the same list from different phones, often in a shop with poor signal.
- Every tap has to feel instant, so the app never waits for the network before updating the screen.
- There are no accounts yet, but the data model must allow adding them later.

## Overview

```
phone: React app + service worker
   │  Firestore SDK with a persistent local cache
   ▼
Firestore (europe-north1)    real-time listeners, access checked by firestore.rules
Firebase Auth                one anonymous user per device
Firebase Hosting             serves dist/
```

There is no server code. The browser talks to Firestore directly, and `firestore.rules` decides what each user may read and write.

## Folders

| Folder | Holds |
|---|---|
| `src/` | The React app: routes, data hooks, styles |
| `src/data/` | `items.ts` holds pure list logic (sorting, suggestions). `store.ts` holds the Firestore hooks and writes |
| `shared/constants/` | App name, theme colours, collection names, paths and UI text, imported by the app and the Vite config |

## Data model

```
lists/{listId}                 { name, members: [uid], createdAt }
lists/{listId}/items/{itemId}  { name, checked, createdAt }
lists/{listId}/history/{key}   { name, count }
```

## Decisions

1. **Anonymous auth instead of accounts.** Each device signs in anonymously on first launch, and the session is kept. Firebase can later link an anonymous user to an email or Google account without losing data.
2. **Sharing by link.** A list's `members` array holds the user IDs that can see it. Opening a list link adds the current user to it. The rules allow that one change only: a user may add themself, and nothing else.
3. **Writes are never awaited.** Firestore applies a write to its local cache and fires listeners at once, then syncs in the background. The UI only reads from listeners, so it updates immediately, offline included.
4. **Item listeners wait for membership.** A listener that is refused by the rules stops for good. The list page therefore only listens to items once the list shows up among the user's lists, and joins first if it does not.
5. **Suggestions are per list.** Every added item increments a counter in the list's `history`, keyed by its normalised name. Suggestions are prefix matches ordered by that count, leaving out items already on the list.
