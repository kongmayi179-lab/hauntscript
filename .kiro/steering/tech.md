# Tech constraints

- Stack: static `index.html`, `css/style.css`, `js/game.js` unless a clear need appears.
- No mandatory bundler. Vite is optional only if the team accepts a Pages build workflow.
- Browser targets: last two Chrome/Firefox/Safari; mobile usable.
- State lives in a single JS module IIFE (or ES module if build added later).
- Do not introduce analytics SDKs or trackers.
- Tests: prefer a tiny Node script that imports pure parser helpers if/when parser is split out.
