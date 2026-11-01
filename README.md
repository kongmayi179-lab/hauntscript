# HauntScript

**Kiroween 2026 · Resurrection**

A browser-based, Infocom-style text adventure. Explore Blackthorn Manor on Halloween night, parse classic verb–noun commands, and break a curse sealed in the crypt.

**Play now:** [https://kongmayi179-lab.github.io/hauntscript/](https://kongmayi179-lab.github.io/hauntscript/)

## Why Resurrection?

Classic parser interactive fiction (Zork-era verb–noun adventure) is revived as a single-page web app: no installers, no backends, just HTML/CSS/JS — a spooky modern shell around a timeless game loop.

## Run locally

No build step required.

```bash
# Option A: open the file
open index.html   # or double-click

# Option B: tiny static server
python3 -m http.server 8080
# then visit http://localhost:8080
```

## How to play

Type commands at the prompt, for example:

| Command | Effect |
|--------|--------|
| `look` / `l` | Describe the current room |
| `go north` / `n` | Move (also `s` `e` `w` `up` `down`) |
| `take lantern` | Pick up an item |
| `inventory` / `i` | List carried items |
| `light lantern` | Illuminate dark rooms (needs matches) |
| `read journal` | Read readable items |
| `unlock door` | Use the brass key |
| `help` | Command summary |
| `restart` | New game |

### How to win

1. Explore the manor (library, kitchen, study, bedroom…).
2. **Read the old journal** for the lore hint.
3. Get **matches** (kitchen) and the **brass lantern** (cellar); **light** the lantern.
4. Find the **brass key** in the study; **unlock** the iron door east of the cellar.
5. Take the **obsidian amulet** from the Hidden Crypt.
6. Carry it back toward the **foyer** or **porch** (the silver cross helps the ending feel complete). Score reaches **100**.

**Rooms (12):** Front Porch, Foyer, Library, Dining Room, Kitchen, Wine Cellar, Sealed Archway, Hidden Crypt, Study, Upstairs Hall, Master Bedroom, Attic.

## Tech

- Pure static **HTML / CSS / JS** (no framework, no API keys).
- Deployed on **GitHub Pages**.
- Open source under **MIT** (see `LICENSE`).

## Kiro / `.kiro`

This repo includes a full `.kiro/` tree (**steering**, **specs**, **hooks**) so a Kiro agent can continue the project once credits are available.

Honest status: Kiro Free credits were exhausted / promotional credits pending Didit verification at build time, so the playable app and `.kiro` artifacts were authored to match Kiroween requirements rather than claimed as a full paid-Kiro transcript. See **[KIRO_USAGE.md](./KIRO_USAGE.md)**.

## License

MIT © 2026 Mayi Kong (`kongmayi179-lab`)
