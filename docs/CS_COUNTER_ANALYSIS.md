# Clash Squad Counter Analysis — OB54 Review

Updated: 2026-06-29

Source basis:
- `character.json` in this package
- Official OB54 Patch Notes: https://ff.garena.com/en/article/1673/

## What changed

- `character.json` was reviewed and enriched with CS-focused analysis metadata.
- OB54 character balance changes were applied for Nero, Chrono, Maro, Oscar, Nikita, and Olivia.
- OB54 Skill Boost metadata was added for Alok, Koda, Homer, Chrono, Kassie, Skyler, Wukong, and Oscar.
- `counter.json` was rebuilt for Clash Squad scenarios and expanded from 23 active-skill-focused entries to 64 full character entries.

## Character pool summary

- Total characters reviewed: 64
- Active skills: 24
- Passive skills: 40
- Characters already tagged as CS meta in the source file: 26
- Characters tagged as overall meta in the source file: 26

## CS archetype breakdown

- Anti-Gloo / cover breaker: 9
- Damage / weapon pressure: 8
- Information / tracking: 12
- Mobility / entry timing: 11
- Shield / mitigation: 9
- Situational CS utility: 1
- Sustain / heal value: 14

## Counter logic used

The new counter data focuses on Clash Squad situations, not generic BR theory. Each entry was reviewed around these CS scenarios:

1. **Opening contact / rush control** — answers to dash, shotgun, SMG and close-range pressure.
2. **Gloo Wall reset fights** — answers to teams that turtle, revive, heal, or chain walls.
3. **Information fights** — answers to scan, mark, stealth and late-round clutch tracking.
4. **Sustain fights** — answers to Alok/Kassie/Dimitri/Olivia/Kapella-style recovery.
5. **Mitigation fights** — answers to Chrono/Kenta/Steffie/Shani/Antonio-style damage denial.
6. **OB54 growth phase** — answers that still matter after CS Perk Points unlock Skill Boost or Awakened Weapon paths.

## Important interpretation notes

- A counter does not always mean a hard shutdown. In CS, many counters are timing-based: bait the cooldown, force the wrong angle, then punish.
- Joseph became a high-value counter tag because the updated character file lists immunity against disruptive effects like slowdown, marking, and skill-silencing.
- Nikita remains a key anti-sustain counter even after the OB54 reload-speed nerf because the anti-heal effect remains intact.
- Chrono became more important again after the OB54 cooldown buff to 45s.
- Nero is still relevant as anti-Gloo/area denial, but the plushie is now much easier to remove, so counter notes emphasize shooting it early.

## Files updated

- `character.json`
- `counter.json`
- `docs/CS_COUNTER_ANALYSIS.md`

## Active vs Passive counter split

The counter data now separates Clash Squad recommendations into:

- `active_counters` for counters that require an Active skill timing window, cooldown read, or direct activation.
- `passive_counters` for always-on/passive traits that counter the matchup through movement, sustain, anti-heal, reload economy, damage modifiers, or information value.

The original `counters` array is still retained as a combined fallback for older pages and scripts.
