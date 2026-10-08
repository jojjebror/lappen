# Lappen

A shared shopping list, built as an installable PWA. Add an item on one phone and it shows up on the other. Tap an item to cross it off. Items you have added before are suggested as you type.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5 runes), built as a static single-page app
- [Tailwind CSS v4](https://tailwindcss.com)
- [Firebase](https://firebase.google.com): Firestore for sync and offline cache, anonymous Auth, Hosting
- SvelteKit's built-in service worker for the offline app shell

## How it works

- Each device signs in anonymously, so nobody has to create an account.
- A list's `members` holds the user IDs that can see it. Opening a list's link (from **Share**) adds you to its members.
- Writes go to Firestore's local cache first, so the UI updates immediately and syncs in the background, offline included.
- Every added item is counted in the list's `history` collection. Suggestions are the most frequently added matches.

## Data model

```
lists/{listId}                 { name, members: [uid], createdAt }
lists/{listId}/items/{itemId}  { name, checked, createdAt }
lists/{listId}/history/{key}   { name, count }
```

Access rules live in `firestore.rules`.

## Setup

1. Create a Firebase project. Enable **Authentication → Anonymous** and **Firestore**.
2. Register a web app, then copy `.env.example` to `.env` and fill in the values.
3. `pnpm install`, then `pnpm dev`.

## Deploy

```sh
pnpm build
firebase use --add
firebase deploy
```

## Scripts

| Command      | Purpose                        |
| ------------ | ------------------------------ |
| `pnpm dev`   | Dev server                     |
| `pnpm build` | Production build into `build/` |
| `pnpm check` | Type-check                     |
| `pnpm lint`  | Prettier and ESLint            |
| `pnpm test`  | Unit tests                     |
