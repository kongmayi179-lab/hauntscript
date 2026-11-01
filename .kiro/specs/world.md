# Spec: World model

## Rooms (12)
porch, foyer, library, dining, kitchen, cellar, crypt_door, crypt, study, hall, bedroom, attic

## Graph (summary)
- porch ↔ foyer
- foyer ↔ library, dining, hall(up)
- library ↔ study
- dining ↔ kitchen
- kitchen ↔ cellar(down)
- cellar ↔ crypt_door
- crypt_door → crypt (locked until key)
- hall ↔ bedroom, attic(up)

## Items
| id | start | notes |
|----|-------|-------|
| journal | library | readable hint |
| candle | dining | red herring / weak light |
| matches | kitchen | required to light lantern |
| lantern | cellar | primary light source |
| key | study | unlocks crypt |
| cross | bedroom | flavor / ending assist |
| amulet | crypt | win object |

## Darkness
`cellar`, `crypt_door`, `crypt` set `dark: true`. Without `lanternLit`, descriptions are suppressed and movement is risky.
