# Product principles — HauntScript

## Category
Kiroween 2026 **Resurrection**: revive classic Infocom-style parser interactive fiction as a modern static web app.

## Non-negotiables
1. Remains a **working game** playable from the repo root / GitHub Pages with zero backend.
2. Keep `/.kiro/` committed; never add it to `.gitignore`.
3. MIT license stays in the repository root.
4. No secrets, API keys, or paid asset packs in the repo.
5. Prefer small, reviewable diffs over rewrites.

## Player fantasy
All Hallows' Eve at Blackthorn Manor. The player is an explorer who must recover a cursed amulet and leave the house. Parser commands should feel familiar to anyone who played Zork.

## Success metrics (soft)
- New player can finish in under 20 minutes with `help` + journal hint.
- Score reaches 100 on a clean win path.
- Lighthouse / bare static hosting friendly (no build required).
