# Potenzial WebApp MVP

iPhone-first savings tracker web app built with vanilla TypeScript + Vite.

## Run locally

```bash
cd potenzial-webapp
npm install
npm run dev
```

Open: `http://localhost:5173`

Dev port behavior:
- `npm run dev` prefers `127.0.0.1:5173`.
- If `5173` is occupied, Vite automatically falls back to the next free port.
- Use the URL printed in the terminal to open the active dev server.

## What is included

- Stitch references copied unchanged to `design/stitch/`:
  - `home.html`
  - `entries.html`
  - `insights.html`
  - `add-sheet.html`
  - corresponding `*-screen.png` files
- PWA essentials:
  - `public/manifest.webmanifest`
  - `public/icons/icon-192.png`
  - `public/icons/icon-512.png`
  - `public/icons/apple-touch-icon-180.png`
  - iOS meta tags in `index.html`
- Functional screens:
  - Home
  - Entries (Activity History)
  - Insights
  - Global Add/Edit bottom sheet modal
- Local persistence via structured LocalStorage with versioning/migration in `src/storage/`
- CRUD operations for entries (create, view, edit, delete)

## Data model

- Goal: `title`, `targetAmount`, `deadline`
- Entry: `id`, `date`, `type` (`avoid|cheaper|income`), `paidPrice`, `referencePrice`, `potential`, `note`, timestamps

Computation rules:

- `avoid`: `paidPrice = 0`, `referencePrice = amountSaved`, `potential = referencePrice`
- `cheaper`: requires `paidPrice` and `referencePrice`, `potential = referencePrice - paidPrice` (must be `> 0`)
- `income`: `potential = amount`, `paidPrice = 0`, `referencePrice = 0`

## Project structure

- `src/storage/*` local persistence + migrations/versioning
- `src/models/*` entry/goal/insight logic and helpers
- `src/ui/*` components and screen renderers mirroring Stitch sections
- `src/app.ts` routing, state, event wiring, render loop

## Manual verification

### Local checks

1. Run `npm install` and `npm run dev`.
2. Create one entry of each type (Avoided, Cheaper, Income).
3. Verify Home totals, progress ring, and recent activity update immediately.
4. Open Entries and verify list + summary card update.
5. Edit one entry and confirm all derived numbers update.
6. Delete one entry and confirm it disappears from Home/Entries/Insights.
7. Refresh page and confirm entries persist.

### iOS Add to Home Screen

1. Open the app in Safari (`http://localhost:5173` on your local network host).
2. Tap Share -> **Add to Home Screen**.
3. Launch from home screen and confirm standalone display.
4. Add an entry, close app, relaunch, and confirm data persists.

### PWA checks

- Confirm `/manifest.webmanifest` loads.
- Confirm manifest has `name`, `icons`, `start_url`, `display`.
- Confirm iOS tags in `index.html`:
  - `apple-mobile-web-app-capable`
  - `apple-mobile-web-app-status-bar-style`
  - `apple-mobile-web-app-title`
  - `apple-touch-icon`
