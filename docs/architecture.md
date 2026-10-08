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
Vercel                       builds and serves dist/, previews per pull request
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
households/{householdId}       { members: [uid], names: { uid: name }, createdAt }
lists/{listId}                 { name, householdId, createdAt }
lists/{listId}/items/{itemId}  { name, checked, createdAt }
lists/{listId}/history/{key}   { name, count }
```

Lists created before households existed have `members: [uid]` instead of `householdId`. The app moves them into the owner's household on start.

## Decisions

1. **Anonymous auth instead of accounts.** Each device signs in anonymously on first launch, and the session is kept. Firebase can later link an anonymous user to an email or Google account without losing data.
2. **Households instead of shared lists.** Everyone in a household sees all its lists. A household is created on first start. The invite link carries the household ID, which is the secret, and joining moves the joiner's own lists into the new household and takes them out of their old one, all in one batch. The rules let a non-member change a household in one way only: add themself to `members`. Members may also remove themself and set names.
3. **Writes are never awaited.** Firestore applies a write to its local cache and fires listeners at once, then syncs in the background. The UI only reads from listeners, so it updates immediately, offline included.
4. **Item listeners wait for membership.** A listener that is refused by the rules stops for good. The list page therefore only listens to items once the list shows up among the household's lists.
5. **Suggestions are per list.** Every added item increments a counter in the list's `history`, keyed by its normalised name. Suggestions are prefix matches ordered by that count, leaving out items already on the list.
6. **Motion follows Crosscheck.** Pages slide in from the side they are reached from, rows glide to their new place with a FLIP animation when an item is ticked, removed rows and the undo bar fade out before they unmount, and a theme change crossfades with a view transition. All of it is skipped when the phone asks for reduced motion.
