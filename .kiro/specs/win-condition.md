# Spec: Win condition & scoring

## Win
Player wins when they carry the **obsidian amulet** and are in **foyer** or **porch** (or use/check win with cross + amulet per game logic). UI shows `*** YOU HAVE BROKEN THE CURSE ***` and score locks to 100.

## Score bumps (illustrative)
- Find lantern, key, journal
- Light lantern
- Unlock crypt / enter crypt
- Take amulet
- Cap at 100 on win

## Soft fail
No permanent death required in v1. Darkness may scare the player but must remain recoverable.

## Restart
`restart` resets flags, inventory, item placements, score, and output buffer.
