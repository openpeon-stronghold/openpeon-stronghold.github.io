# openpeon-stronghold.github.io

Landing page for the [OpenPeon Stronghold](https://github.com/openpeon-stronghold) voice packs — 16 Stronghold Crusader lords, each narrating every terminal event for [PeonPing](https://github.com/PeonPing/peon-ping).

Live site: **[openpeon-stronghold.github.io](https://openpeon-stronghold.github.io)**

## Lords

| Slug | Install |
|------|---------|
| abbot | `peon packs install abbot` |
| caliph | `peon packs install caliph` |
| emir | `peon packs install emir` |
| frederick | `peon packs install frederick` |
| marshal | `peon packs install marshal` |
| nizar | `peon packs install nizar` |
| philip | `peon packs install philip` |
| pig | `peon packs install pig` |
| rat | `peon packs install rat` |
| richard | `peon packs install richard` |
| saladin | `peon packs install saladin` |
| sheriff | `peon packs install sheriff` |
| snake | `peon packs install snake` |
| sultan | `peon packs install sultan` |
| wazir | `peon packs install wazir` |
| wolf | `peon packs install wolf` |

## Stack

- **[poops v1.1.0](https://github.com/nicholasgasior/poops)** — SCSS → CSS, ES modules → IIFE bundle, Nunjucks templates, static copy
- **SCSS** partials under `src/styles/`
- **ES modules** under `src/scripts/`
- **Nunjucks** templates under `src/markup/`
- **GitHub Actions** deploys `dist/` to GitHub Pages on push to `main`

## Development

```bash
npm install
npm run dev     # serves at localhost:4040 with livereload
npm run build   # outputs to dist/
```

## Project structure

```
src/
  markup/
    _layouts/default.html   # base HTML layout
    index.html              # page content (Nunjucks)
  scripts/
    main.js                 # entry point
    audio.js                # sound playback
    favicon.js              # animated jester favicon
    grid.js                 # card click handlers
    lords.js                # CESP category labels
    modal.js                # lord detail modal
  styles/
    main.scss               # imports all partials
    _*.scss                 # component partials
  static/
    assets/                 # images, HUD sprites, cursors
    assets/packs/<lord>/    # local audio + openpeon.json per lord
```

## Adding a lord

1. Add an entry to the `lords` array in `poops.json` under `markup.options.site`
2. Copy the lord's `openpeon.json` and `sounds/` into `src/static/assets/packs/<slug>/`
3. Run `npm run build`
