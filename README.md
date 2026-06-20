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


## Global full-site search

This package includes a shared global search layer on every HTML page:

```text
assets/js/global-search-index.js
assets/js/global-site-search.js
```

What it searches:

- All root HTML pages and major page sections
- Character, pet, weapon, loadout, and counter JSON data
- Team logo tags and common team aliases
- Dashboard, upload, report, BR, and Clash Squad tool pages

How it behaves:

- Typing in any existing search box now shows global results without removing the page's original local filtering.
- Selecting a page or section result redirects/scrolls to that page or section.
- Selecting a character, pet, weapon, or loadout redirects to the matching database page and attempts to open the matching card/modal automatically.
- Selecting a team opens the team dashboard with the team filter/deep link when supported.
- `Ctrl/Cmd + K` or `/` opens the global search palette from anywhere.

To rebuild the index after adding new pages or JSON data, regenerate `assets/js/global-search-index.js` from the project files.

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
