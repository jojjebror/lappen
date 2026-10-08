# Lappen

A shared shopping list, built as an installable web app for phones. Add an item on one phone and it shows up on the other. Tap an item to cross it off. Items you have added before are suggested as you type.

## Stack

- React 19, Vite and TypeScript, with React Router
- [Firebase](https://firebase.google.com): Firestore for sync and the offline cache, anonymous Auth, Hosting
- `vite-plugin-pwa` for the service worker, manifest and app icons
- Vitest and Testing Library

How it fits together is described in [docs/architecture.md](docs/architecture.md).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the web app config from the Firebase console (Project settings → Your apps).
3. `npm run dev`

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Type-check and build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Unit tests |
| `npm run deploy` | Build, then deploy hosting and Firestore rules |

The Firebase CLI runs through `npx --engine-strict=false firebase-tools`. Its `superstatic` dependency declares support only up to Node 24.
