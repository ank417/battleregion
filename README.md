# Battle Region

A kids' battle game (ages 6-10): your red army defends South America against
a blue alien invasion. Tap a front-row soldier, pick a weapon, and fight —
win rounds to earn money and upgrade your army through the toolbox.

## Run it in your browser

```bash
cd app
npm install
npm run dev
```

Then open the URL it prints (usually [http://localhost:5173](http://localhost:5173)) in your browser.

Other useful commands (run from inside `app/`):

```bash
npm run build    # production build to app/dist
npm run preview  # serve the production build locally
npm run lint      # run ESLint
```

## How to play

1. Tap a front-row red soldier to select them.
2. Pick a weapon from the popup (free karate, or pay for javelin/bow/rifle).
3. The soldier fights the next alien in line — win and you earn money and
   the alien is marked defeated; lose and that soldier falls.
4. Beat every alien to win the round and advance — aliens come back tougher
   (stronger weapons, a type that counters your army). Lose, and you can
   spend money in the 🛠 Toolbox to recruit soldiers or evolve your army's
   types before retrying the same round.

## Project layout

- `app/` — the React + Vite implementation of the game.
- `project/`, `chats/` — original Claude Design handoff files this was built from.
