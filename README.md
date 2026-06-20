# Battle Region

A kids' battle game (ages 6-10): your red army defends South America against
a blue alien invasion. Tap a front-row soldier, pick a weapon, and fight —
win rounds to earn money and upgrade your army through the toolbox.

## Get it on your computer (no experience needed)

These steps assume you've never used GitHub, a terminal, or set up a coding
project before. Do them in order.

### 1. Install Node.js

This game needs a free program called Node.js to run.

- Go to [nodejs.org](https://nodejs.org)
- Click the big green button to download the **LTS** version
- Open the downloaded file and click through the installer (default options
  are fine)

### 2. Download this project

You don't need to know git for this part — just download a zip file:

- At the top of this page on GitHub, click the green **Code** button
- Click **Download ZIP**
- Find the downloaded file (usually in your "Downloads" folder) and
  unzip/extract it — on Windows, right-click it and choose "Extract All";
  on Mac, just double-click it

You should now have a folder called `battleregion-main` (or similar)
somewhere on your computer.

### 3. Open a terminal in that folder

The terminal is a text-based way to run commands on your computer.

- **Windows:** open the `battleregion-main` folder in File Explorer, click
  in the address bar at the top, type `cmd`, and press Enter
- **Mac:** open the `battleregion-main` folder in Finder, then go to
  Finder → Services → "New Terminal at Folder" (or open the Terminal app
  and type `cd ` followed by dragging the folder into the window, then
  press Enter)

### 4. Run the game

In the terminal window you just opened, type each of these lines one at a
time, pressing Enter after each:

```bash
cd app
npm install
npm run dev
```

The first time, `npm install` may take a minute or two — that's normal.
When it's done, `npm run dev` will print a web address, usually
`http://localhost:5173`. Copy that address into your web browser (Chrome,
Safari, Edge, etc.) and the game will load.

To stop the game later, go back to the terminal window and press
`Ctrl + C` (or `Cmd + C` on Mac).

## Run it in your browser (quick version, for developers)

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
