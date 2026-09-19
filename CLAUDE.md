# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

## What this project is

Alberta Groundwater Flow Simulator: a single-page, client-only dashboard for
exploring how the depth to the water table at an Alberta site is expected to
move over a chosen time window, and whether that movement crosses a threshold
associated with saturation risk (waterlogging, slope failure, or excavation
seepage depending on site type).

## Requirements

### Runtime constraints
- No build step, no bundler, no package manager, no external CDN or network
  dependency. `index.html` must open directly in a browser and work fully
  offline.
- Everything (markup, CSS, and simulation/chart logic) lives inline in
  `index.html`. Do not split it into separate CSS/JS files unless the user
  explicitly asks for that restructuring.
- Only asset on disk that `index.html` actually references is
  `assets/img/logo.png` (used as both the favicon and header logo).

### Functional requirements
1. Three selectable site presets: irrigated farmland, river floodplain, urban
   excavation site. Each has its own default model parameters, a summary of
   its flow assumptions, and a risk note explaining what crossing the
   threshold means physically at that site.
2. A simulation window selector: 60, 120, or 365 days.
3. Six adjustable model parameters (h0, hEq, tau, amp, sy, threshold), each
   with its own slider, that override the selected site's defaults. "Reset to
   site defaults" restores them.
4. The simulation model:
   `depth(t) = hEq + (h0 - hEq) * exp(-t / effective_tau) + amp * sin(2*pi*t/365 + phase) + noise(t)`
   with `effective_tau = tau * (sy / site_default_sy)`, depth bounded below at
   0.05 m, and a seeded PRNG so a given site/window/parameter combination
   always reproduces the same curve.
5. A hand-rolled SVG line chart (no charting library) showing the simulated
   depth curve, a shaded risk band, a dashed threshold line, hover crosshair
   and tooltip, and a disclosure-toggle table view of the same data.
6. Stat tiles: depth at end of window, shallowest depth reached, days at or
   beyond threshold, overall risk status (Clear / Elevated / Breached).
7. Run history persisted to `localStorage` (key `gwSimHistory`, capped at 50
   entries): save, load, delete individual runs, export as JSON or CSV,
   clear all. Nothing is ever sent over the network.
8. Three light color themes (default, earth, slate) that only change the
   accent color; surface, text, and fixed status colors (good, warning,
   serious, critical) never change with the theme so risk meaning is
   consistent. The theme switcher is an intentionally low-opacity,
   near-invisible button fixed to the bottom-right corner; this is a
   deliberate design choice documented in the README, not a bug, don't make
   it more prominent without being asked.

### Accessibility requirements
- Site cards are real `<button>` elements with `aria-pressed`.
- Sliders expose `aria-valuetext` with human-readable units.
- The SVG chart has `role="img"` and a text `<desc>`; the same data is always
  also available as an HTML table.
- Risk/status is never conveyed by color alone; it is always paired with
  text (badges, labels, table status column).
- Keep a skip-to-content link, a `<main>` landmark, and logical heading order
  (`h1` page title, `h2` section titles, `h3` card/panel titles) intact when
  editing markup.

### SEO requirements
- Keep `<title>`, meta description, robots, canonical, Open Graph, Twitter
  Card tags, and the `WebApplication` JSON-LD block in `<head>` up to date
  with any real functional change (e.g. if a site preset or feature is
  added or removed, update the JSON-LD `featureList`).
- `og:url` / canonical currently point at the local file since the project
  is not deployed yet. Once there is a live URL, update `<link rel="canonical">`
  and add `og:url`, and add a `sitemap.xml` referencing it.
- `robots.txt` at the repo root allows all crawlers; keep it that way unless
  told otherwise.

## Writing style

- **Never use em dashes (`—` or `--` as a substitute).** Use a comma, a
  colon, a period, or parentheses instead. This applies to all prose written
  for this project: README, code comments, commit messages, and anything
  else authored here.

## Known repo oddity

`assets/css/style.css` and every file under `assets/js/` (charts.js,
compare.js, dashboard.js, main.js, soil-data.js, theme.js) are **not
referenced anywhere in `index.html`** and are not part of this project. Their
content (soil composition, cohesion, friction angle, plasticity index) is
from an unrelated "Alberta Soil Behaviour Modelling" tool, apparently left
over from a different project sharing this repo at some point. Don't assume
they're wired up or extend them as if they belong to the groundwater
simulator; confirm with the user before deleting or repurposing them.

## File structure

```text
index.html          the entire dashboard: markup, styles, and simulation/chart logic
assets/img/logo.png  logo mark, used as the header logo and the favicon
robots.txt           allows all crawlers
README.md            user-facing documentation of the model and features
CLAUDE.md            this file
assets/css, assets/js  orphaned files unrelated to this project, see above
```
