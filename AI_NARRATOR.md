# AI narrator (optional future enhancement)

Design note for a later Kiro / MCP pass — **not required to run HauntScript today**.

## Idea

When the player enters a room or examines an item, an optional narrator could rewrite the static `desc` string into a slightly varied atmospheric paragraph (still PG-13 spooky, no gore porn).

## Constraints

- Must degrade gracefully: if no API key / MCP, use the baked-in strings in `js/game.js`.
- Never block the parser on a network call; timeout ≤ 2s then fall back.
- Cache by `(roomId, turnBucket)` so repeats stay coherent.
- Tone: gothic, dry humor, Infocom-adjacent — see `.kiro/steering/tone.md`.

## Suggested prompt sketch

```
You are the narrator of HauntScript, a Halloween parser IF.
Rewrite the room description below in 2–4 sentences.
Keep exits and item facts unchanged. No modern slang.
Room: {{name}}
Base: {{desc}}
Flags: lanternLit={{lanternLit}}
```

## Out of scope for v1

Calling OpenAI/Anthropic from the static Pages site (would need a backend or browser key — both rejected for this entry).
