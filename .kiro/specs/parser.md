# Spec: Verb–noun parser

## Goal
Accept classic IF commands and map them to game actions.

## Supported verbs (v1)
`look`, `go`, `take`, `drop`, `inventory`, `light`, `unlock`, `open`, `read`, `use`, `help`, `restart`, `quit`

## Aliases
- Movement: `n/s/e/w/u/d`, bare direction words
- `l` → look; `x` / `examine` → look at object
- `i` / `inv` → inventory
- `get` / `grab` → take
- `pick up X` → take; `turn on lantern` → light

## Normalization
1. Trim, lowercase, strip trailing punctuation.
2. Drop filler words: `the`, `a`, `an`, `at`, `to`, `with` (except when needed for future verb phrases).
3. Unknown verb → soft error + hint to `help`.

## Acceptance
- `go north` and `n` from Foyer both reach Library or Dining as mapped.
- `take brass lantern` and `take lantern` both work when present.
- Empty input does nothing (no error spam).
