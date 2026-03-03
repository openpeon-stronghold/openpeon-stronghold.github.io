# OpenPeon-Stronghold

Source for **[openpeon-stronghold.github.io](https://openpeon-stronghold.github.io)** — a pack browser for all 16 Stronghold Crusader [PeonPing](https://github.com/PeonPing/peon-ping) voice packs. Browse, preview, and copy the install command for each lord.

## Stack

- **[poops](https://github.com/nicholasgasior/poops)** — SCSS → CSS, ES modules → IIFE bundle, Nunjucks templates, static copy
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
    _layouts/default.html   # base HTML layout (OG/Twitter tags)
    index.html              # page content (Nunjucks)
  scripts/
    audio.js                # sound playback
    clipboard.js            # copy-to-clipboard helper
    favicon.js              # animated jester favicon
    grid.js                 # carousel card click handlers
    lords.js                # CESP category labels
    main.js                 # entry point
    modal.js                # lord detail modal + briefing animation
  styles/
    main.scss               # imports all partials
    _*.scss                 # component partials
  static/
    assets/
      cursor/               # .cur and .gif cursor files
      hud/
        tavern-btn.webp, tavern-btn-hover.webp
        button/             # HUD button sprites
        lord-frame-bg/      # portrait-bg-<lord>.webp (9 unique backgrounds)
        lord-framers/       # portrait-frame.webp + variants
      images/
        hero-bg.webp        # hero section background
        open-graph.webp     # OG / Twitter social preview (1200×630)
        modal-bg.webp       # modal panel background
        modal-frame-00…12.webp   # briefing animation (13 frames, 5 fps)
        fresco-1.webp, fresco-2.webp
      packs/<lord>/         # openpeon.json + sounds/*.mp3 per lord
poops.json                  # build config — site.title / .description / .url / lords array live here
```

## Adding a lord

1. Add an entry to the `lords` array in `poops.json` → `markup.options.site`
2. Set `frameBg` to the matching `assets/hud/lord-frame-bg/portrait-bg-*.webp`
3. Copy the lord's `openpeon.json` and `sounds/` into `src/static/assets/packs/<slug>/`
4. Run `npm run build`

## Assets

All images are WebP. HUD sprites encoded at quality 90; photo backgrounds and modal frames at quality 75. The briefing animation is 13 frames at 5 fps. Each lord pack ships MP3 audio mapped to CESP event categories via `openpeon.json`.
