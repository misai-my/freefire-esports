# Free Fire Caster Command Center

A static web package for Free Fire esports broadcast preparation and live desk support. It includes dashboard pages, BR/CS data tools, character/pet/weapon/loadout galleries, presets, map planning, upload tools, report tools, and team assets.

## Start here

- `index.html` — login page
- `home.html` — main dashboard
- `ewc-center.html` — team command center
- `br-team.html` — BR teams and players
- `clash-draft-team.html` — Clash Squad draft tool
- `clash-data.html` — Clash Squad data summary
- `split-view.html` — split-screen reference view

## Local preview

Run either command from the project folder:

```bash
python -m http.server 5173
```

or:

```bash
npm run start
```

Then open `http://localhost:5173`.

## Supabase configuration

Supabase settings are centralized in:

```text
assets/js/app-config.js
```

When moving to a new Supabase project, update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in that file. The pages still include safe fallbacks so the package remains compatible with the original build.

## GitHub Pages deployment

1. Upload all files to the repository root.
2. Keep `.nojekyll` in the root.
3. In GitHub, open **Settings → Pages**.
4. Deploy from the branch/root folder where these files are stored.
5. Open the Pages URL and test `index.html`, `home.html`, and `ewc-center.html`.

## Package improvements in this version

- Added a shared config file for Supabase.
- Added missing alias pages: `dashboard.html` and `ewc-team-overview.html`.
- Added GitHub Pages support through `.nojekyll`.
- Added project documentation and file map.
- Added a local audit script for broken local page/asset references.
- Preserved all existing HTML pages and assets for compatibility.

## Important note

This is still a static front-end package. Database security should be controlled in Supabase with Row Level Security policies. Do not add service-role keys to any browser file.


## OB54 Patch Notes

The package now includes an OB54 summary on `ff-update.html`, structured data in `ob54-update.json`, and global search shortcuts for OB54 Battle Royale, Clash Squad, Skill Boost, Weapon Awakening, character balance, weapon balance, map/system updates, and broadcast notes. Official reference: https://ff.garena.com/en/article/1673/


## Latest CS Store Tables

`store.html` now includes the updated Bermuda, Kalahari, Solara, and Nexterra Clash Squad store tables, plus a per-map changelog note below the table.

## CS Store changelog fix

This package fixes the CS Store changelog render issue in `store.html`. The issue was caused by the changelog renderer calling `escapeHTML()` before that helper existed on the page. The changelog now renders under the CS Store table with a loading fallback and a display guard.

## Sidebar Consistency Update

This package includes a shared sidebar layer for every page that uses the left sidebar. The shared file is:

- `assets/js/shared-sidebar.js`

It injects the same brand block, menu order, section labels, icons, active-page state, mobile close behavior, and collapsed-sidebar persistence across all sidebar pages. To change sidebar content later, edit `NAV_GROUPS` in `assets/js/shared-sidebar.js` instead of manually editing each HTML file.


## Draft V2 Page

- `clash-draft-team-v2.html` — live Clash Squad Draft V2 player-column board. It uses the same `public.draft` state and `draft_records` save/load flow as the original page, but displays each player with separate Active, Passive, Pet, and Loadout image cards. Original `clash-draft-team.html` is unchanged.

- CS Store changelog now lists only item names under Taken Out / Added, without slot references.

## CS Store changelog note

The CS Store changelog now compares by item name and intentionally ignores slot, tier movement, and price-only changes. Items that still exist in the store are not shown as both Taken Out and Added.

### Store page loading fix

- Fixed `store.html` so the embedded CS Store data uses valid escaped JSON.
- The changelog now compares by item name only and no longer breaks the page when items contain line breaks such as team-limit notes.

## OB54 Clash Squad Counter Analysis

This package includes an OB54 review of `character.json` and a rebuilt Clash Squad-focused `counter.json`.
See `docs/CS_COUNTER_ANALYSIS.md` for the reasoning model and update summary.



### CS Store Changelog Update

`store.html` now separates changes into **Taken Out**, **Added**, and **Adjustment**. Adjustments cover price changes and label changes such as `AWM-Y → AWM`, while slot/tier movement is ignored.

### Latest counter/sidebar update

- `counter.json` now separates recommendations into `active_counters` and `passive_counters` while keeping the legacy `counters` array for compatibility.
- `character.html` and the dashboard counter panel now render Active and Passive counter sections separately.
- The shared sidebar was simplified by removing Team Center, Team Database, Match Report, CS Draft V2, CS Report, CS Converter, BR Upload, Match Upload, CS Upload, and Team Settings.

### Sidebar cleanup — 20260629-sidebar-clean-v2

The shared sidebar now hides the legacy close `X` button and removes these hidden/admin/navigation entries from every sidebar: Team Center, Team Database, Match Report, CS Draft V2, CS Report, CS Converter, BR Upload, Match Upload, CS Upload, and Team Settings. Those pages remain accessible by direct URL if needed.

## Restoration note — Clash Draft Team

This build restores and preserves the original `clash-draft-team.html` page with its live draft behavior, draft history, match details, pick/ban counts, and Supabase `public.draft` / `draft_records` integration. The separate `clash-draft-team-v2.html` page remains available by direct URL and was not used to replace the original page.

## Clash Draft JSON Importer

`clash-draft-team.html` now includes the pasted match JSON importer from the uploaded page. It can parse `team_stats[].player_stats[]` and auto-fill active skills, passive skills, pets, loadouts, and player names for the left/right draft sides. The page now loads `character.json`, `pet.json`, and `loadout.json` from the local package first, with the live GitHub copy as fallback.

## Character Balance Indicators

`character.html` now shows OB54 buff/nerf indicators for changed characters, based on a comparison between the previous `character.json` and the updated `character.json`. Details are also stored in `character-balance-changes.json` and documented in `docs/CHARACTER_BALANCE_CHANGES.md`.


## Latest home picker fix
- Updated `home.html` so the Quick View Choose buttons open the picker without auto-showing the item list.
- The Character/Pet/Weapon/Loadout picker list now appears only after the user clicks or focuses the picker search box.
- The home picker search is ignored by the global site search layer to prevent the wrong dropdown from appearing.
