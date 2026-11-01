# Kiro usage (honest account)

## Contest context

HauntScript is entered in **Kiroween 2026**, category **Resurrection**.

Official expectations include a working app, a public MIT-licensed GitHub repo, and a committed `/.kiro/` directory (specs, hooks, steering) that is **not** gitignored.

## What happened with credits

- The builder requested the Kiroween **4000 promotional credits** via the official form (Devpost registration + credits request).
- **Didit identity verification** email had **not** arrived at build time, so the promo code was not yet redeemable.
- The Kiro Free tier showed **0 / 50** credits remaining; Kiro Web agent runs required billing the team chose not to enable for this trial.

Therefore: **we did not fabricate chat logs** claiming Kiro generated the entire application under the promo grant.

## What *is* in this repo for Kiro

| Path | Purpose |
|------|---------|
| `.kiro/steering/` | Product principles, tone, tech constraints for any future Kiro session |
| `.kiro/specs/` | Feature specs: parser, world model, win condition, UI |
| `.kiro/hooks/` | Agent/automation hook definitions (e.g. pre-commit sanity checks) |

These files are real, actionable instructions a Kiro agent should follow when credits unlock — not decorative placeholders.

## Intended next Kiro workflow (once credits unlock)

1. Open this repo in Kiro with steering + specs loaded.
2. Ask Kiro to extend room prose / add 2–3 endings using `AI_NARRATOR.md` as the design brief.
3. Ask Kiro to add automated parser tests (node or browser) guided by `.kiro/specs/parser.md`.
4. Keep `.kiro/` committed on every PR.

## Scaffolding attribution

- **Game loop, parser, rooms, UI, Pages deploy, and `.kiro` artifacts** were produced during the Submission Period (project created **2026-11-01**) to satisfy eligibility and ship a playable demo.
- When Kiro credits are active, further commits should prefer agent-assisted edits so the trail of Kiro use is genuine going forward.

## Contact / account

- GitHub: `kongmayi179-lab`
- Devpost: registered for Kiroween as `kongmayi179`
