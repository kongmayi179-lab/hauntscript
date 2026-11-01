# Spec: UI

## Layout
- Title + tagline
- Scrollable monospaced transcript (`#output`)
- Command form with `>` prompt
- Status strip: location, moves, score

## Visual
- Dark background, warm accent (pumpkin/ember), CRT-lite scanlines optional via CSS only
- No external webfonts required (system Courier / Georgia stack)
- Accessible: `aria-live` on transcript; label for input

## Responsive
Single column; status stacks on narrow screens.
