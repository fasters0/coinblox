# CoinBlox

A working Next.js app: dark-neon Stake/BloxFlip-styled dashboard with
Crash and Mines as fully playable, points-based games (no real
currency — see note below).

Verified: `npm run build` and `npm run start` both succeed and
serve real content on this exact file tree.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy it as a live website (easiest: Vercel)

1. Push this folder to a GitHub repo
2. Go to vercel.com, sign in, click "Add New Project"
3. Import the repo — Vercel auto-detects Next.js, no config needed
4. Click Deploy

You'll get a live URL (e.g. `coinblox.vercel.app`) in about a minute.
Every push to the repo auto-redeploys.

Alternative hosts that work the same way: Netlify, Render, Railway —
all auto-detect Next.js from `package.json`.

## Important: points, not currency

`lib/points-engine.js` is an in-memory points balance. There's no
deposit, withdrawal, or real-value cash-out anywhere in the code —
"Top up" just grants free points. Keep it that way; wiring in real
payments/crypto turns this into a real-money gambling product, which
brings licensing/regulatory requirements this code doesn't address.

## What's built vs. stubbed

- **Crash** (`/games/crash`) — fully working: state machine
  (waiting -> countdown -> running -> crashed), SVG multiplier chart,
  wager + auto-cashout controls.
- **Mines** (`/games/mines`) — fully working: configurable grid/mine
  count, tile reveal, live multiplier, cash-out.
- **Towers** and **CoinFlip** — placeholder "coming soon" pages, not
  implemented. The lobby cards link to them without 404ing.

## Next steps for a real deployment

- Move round/mine generation server-side — client-trusted RNG isn't
  safe once anything (even points) is at stake
- Add Socket.io for real multiplayer Crash rounds and live chat
- Persist points balance per-user in a database instead of
  in-memory React state (currently resets on page refresh)
