# Groundwater Flow Simulator

A single-page dashboard for exploring how the depth to the water table at an
Alberta site is expected to move over a chosen time window, and whether that
movement crosses a threshold associated with saturation risk.

Open `index.html` directly in a browser. There is no build step and no
external dependency.

## What it does

1. Pick a site type: irrigated farmland, river floodplain, or urban excavation
   site. Each card states the flow assumptions behind that site and its
   default saturation risk threshold.
2. Pick a simulation window with the slider: 60, 120, or 365 days.
3. Adjust any of the six model parameters in the "Model parameters" panel to
   move away from the site's default scenario, or use "Reset to site
   defaults" to snap back.
4. The chart redraws with the simulated depth to water table for the current
   site, window, and parameters, along with a dashed threshold line and a
   shaded risk band.
5. Stat tiles summarize the depth at the end of the window, the shallowest
   depth reached, how many days sat at or beyond the threshold, and an overall
   risk status.
6. A table view of the underlying daily values is available behind the
   "View underlying data as a table" toggle beneath the chart.
7. "Save this run" records the current site, parameters, and results to a run
   history kept in the browser's local storage, viewable and exportable in
   the "Run history" section.

## Simulation model

Depth to water table is modelled as an exponential approach toward a new
equilibrium, with a seasonal component and small day-to-day noise:

```text
effective_tau = tau * (sy / sy_site_default)
depth(t) = h_eq + (h0 - h_eq) * exp(-t / effective_tau) + amp * sin(2*pi*t/365 + phase) + noise(t)
```

- `h0`: starting depth to water table, in metres below ground surface
- `h_eq`: the equilibrium depth the site is trending toward, driven by the
  dominant recharge or discharge process at that site
- `tau`: the site's baseline response time constant, in days, standing in for
  aquifer storativity and transmissivity at its reference specific yield
- `sy`: specific yield, the fraction of aquifer volume that actually fills or
  drains per unit drop in head. A lower specific yield means less pore volume
  has to fill or drain for the same head change, so the aquifer reaches
  equilibrium faster; this is expressed as a multiplier on `tau` relative to
  the site's own reference value, giving `effective_tau`
- `amp`, `phase`: a sinusoidal seasonal or event-driven component
- `noise(t)`: bounded random jitter, drawn from a seeded generator so a given
  site, window, and parameter set always reproduce the same curve
- `threshold`: the depth at which the site is considered to have crossed into
  saturation risk

Depth is bounded below at 0.05 m so the curve never crosses the ground
surface. This is a simplified analytical stand-in for a real transient flow
solution (for example a linearized Boussinesq response or a numerical model
such as MODFLOW), chosen so the dashboard can run entirely client-side with
no server or solver dependency. It is meant to illustrate the shape and
timing of a water table response, not to replace a site-specific
hydrogeological assessment.

### Site default parameters

Selecting a site type loads these values into the "Model parameters" panel as
a starting point; every one of them can then be adjusted with its own slider,
and "Reset to site defaults" restores this table's values.

| Site                   | h0 (m) | h_eq (m) | tau (days) | Sy   | Threshold (m) | Driving process |
| ---------------------- | ------ | -------- | ---------- | ---- | ------------- | --------------- |
| Irrigated farmland     | 3.5    | 2.0      | 90         | 0.15 | 1.2           | Irrigation return flow and canal seepage raising the water table |
| River floodplain       | 2.2    | 1.0      | 20         | 0.25 | 0.8           | Fast river-aquifer connection, spring freshet recharge pulse |
| Urban excavation site  | 4.0    | 6.0      | 15         | 0.10 | 5.0           | Active dewatering pumping drawing the water table down below excavation base |

The threshold is the depth at which the site is considered to have crossed
into risk. For farmland and the floodplain, that means the water table has
risen close enough to the surface to build pore pressure and saturate soils,
which is the standard trigger referenced for waterlogging and slope failure
risk. For the excavation site, the threshold is the excavation base
elevation: if the water table rebounds above it, seepage into the pit can
destabilize shoring.

## Chart implementation

The chart is a hand-rolled SVG line chart built and updated directly with the
DOM API, with no charting library. This was chosen over an off-the-shelf
option such as Chart.js or D3 for three reasons specific to this dashboard:

- The whole tool is a single HTML file intended to run offline with no CDN
  or npm install step; adding a charting library would mean either a network
  dependency or vendoring a multi-hundred-kilobyte bundle for one line chart.
- The chart only ever needs one line, a threshold reference line, a shaded
  risk band, and a crosshair tooltip, all of which are straightforward to
  express directly in SVG without a general-purpose charting API.
- Full control over markup keeps the chart's colors driven by CSS custom
  properties, so it repaints correctly when the color theme is switched.

The chart follows a small set of fixed conventions: a 2px line with a
circular end marker carrying a direct value label, hairline solid gridlines,
a dashed threshold line in the fixed critical status color (never themed),
and a light wash under the line rather than a solid fill. Hovering the chart
shows a crosshair and tooltip with the exact day and depth. A table view of
the same data sits behind a disclosure toggle for anyone who prefers exact
values or needs a non-visual view.

## Run history (local storage database)

There is no server in this project, so "recorded internally" means recorded
in the browser's own `localStorage`, under the key `gwSimHistory`. Nothing
leaves the machine and nothing is sent over the network.

- **Save this run** snapshots the current site, all six parameter values, the
  simulation window, and the computed results (final depth, shallowest depth,
  days at risk, risk status) into one record, appended to the stored array.
  History is capped at the 50 most recent runs; older runs are dropped first.
- The **Run history** table lists every saved run, most recent first, each
  with **Load** (restores that exact site, window, and parameter set so the
  scenario can be reproduced or tweaked further) and **Delete**.
- **Export JSON** and **Export CSV** download the full history as a file
  through a `Blob` and a temporary download link, for use outside the browser.
- **Clear history** empties the stored array.
- Because it is `localStorage`, history is scoped to one browser on one
  device and persists across reloads, but is not shared between devices or
  browsers and can be cleared by the user's own browser data settings.

## Color themes

The dashboard ships three light color themes (default blue, an earth
green/aqua variant, and a slate violet variant). There is no dark theme.
Switching themes only changes the accent color used for the line, markers,
and active-state highlights; surface, text, and the fixed status colors
(good, warning, serious, critical) stay constant so risk meaning never
shifts with the theme.

The switcher is a small, low-opacity circular button fixed to the bottom
right corner of the page. It is reachable by keyboard (tab to it, Enter or
Space to activate) and has an `aria-label`, but is visually understated by
design rather than presented as a primary control.

## File structure

```text
index.html   the entire dashboard: markup, styles, and simulation/chart logic
README.md    this file
```

## Accessibility notes

- Site cards are real buttons with `aria-pressed` state, reachable and
  operable by keyboard.
- The slider exposes `aria-valuetext` with the selected number of days.
- The SVG chart carries a `role="img"` with a text `<desc>` summarizing what
  is plotted, and the same data is available as an HTML table.
- Status colors are never the only carrier of meaning: risk state also
  appears as text (badges on the site cards, labels on stat tiles, the
  "Normal" / "At risk" column in the data table).
