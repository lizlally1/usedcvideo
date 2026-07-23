# Storyboard — The Armour Building

Total runtime: **145 seconds (2:25)** at 30fps = 4350 frames. 1920×1080, 16:9.
All frame numbers below are absolute composition frames (`0` = first frame).

The brief's own scene breakdown (0:00–0:20 / 0:20–0:50 / 0:50–1:15 / 1:15–2:00,
a nominal 2:00 total) was the starting point, but the full four-scene
narration script actually takes about 2:18 to speak at a natural, unhurried
"premium corporate narrator" pace — see `voiceover-timestamps.txt` for the
measured per-line timing. Rather than cut the approved script or rush the
narrator to hit 2:00 exactly, each scene's cut point was set a beat after
that scene's narration finishes, landing the finished film at 2:25 — still
"approximately two minutes," just not to the second.

| Scene | Time | Frames | Duration |
|---|---|---|---|
| 1 — The Rise of the Fort Worth Stockyards | 0:00–0:27 | 0–810 | 27s / 810f |
| 2 — The Armour Building | 0:27–1:01 | 810–1830 | 34s / 1020f |
| 3 — Honoring the Original Structure | 1:01–1:34 | 1830–2820 | 33s / 990f |
| 4 — A New Home for U.S. Energy | 1:34–2:25 | 2820–4350 | 51s / 1530f |

---

## Scene 1 — The Rise of the Fort Worth Stockyards (0:00–0:27 / 0–810f)

- **Visuals:** Opens on `elevator-archival-mural.mp4` (full ~7.5s clip) — the
  real black-and-white "ARMOUR & COMPANY" photo mural over the old
  stockyards/meatpacking complex, filmed at the actual HQ. Cross-dissolves
  into a slow Ken Burns zoom on the same mural image (`bg-archival-mural.jpg`)
  with a warm sepia grade for the rest of the scene, standing in for the
  drone/railroad/longhorn/period-map footage the brief suggests but that
  wasn't part of this project's uploads (see `media-inventory.md`).
- **On-screen text:** "The Historic Fort Worth Stockyards" (title card,
  frames 60–330).
- **Audio:** Narration covers the Stockyards' rise as a livestock trading
  center and "Cowtown" origin story (ends 25.18s).
- **Transition out:** dip-to-navy into Scene 2.

## Scene 2 — The Armour Building (0:27–1:01 / 810–1830f)

- **Visuals:** `armour-exterior.mp4` (full ~5.2s clip — brick facade, glass
  entrance canopy) opens the scene, cross-dissolving into a slow Ken Burns
  zoom-out on the same exterior (`bg-armour-exterior.jpg`), warm brick-red
  tint, for the craftsmen/renovation narration (no construction-in-progress
  or craftsmen-at-work footage was provided).
- **On-screen text:** "Preserving History. Building the Future." (title
  card, frames 1330–1810, red accent rule).
- **Audio:** Narration covers the building's construction for Armour &
  Company and the craftsmen descendants who returned for its renovation
  (ends 59.31s).
- **Transition out:** cross-dissolve into Scene 3.

## Scene 3 — Honoring the Original Structure (1:01–1:34 / 1830–2820f)

- **Visuals:** Intentionally graphics-forward — no footage of the original
  beams, the fitness center, the personal trainer, or Fort Worth Police
  Department members was part of this project's uploads. A warm gold-tinted
  Ken Burns zoom on the HQ interior still (`bg-hq-reception.jpg`) carries the
  visual texture behind two sequential text callouts.
- **On-screen text:**
  - "History Preserved" / "The Original White Structural Beams" (title
    card, frames 1870–2360)
  - "A Place to Grow" — lower-third callout for the fitness center, personal
    trainer, and Fort Worth Police Department partnership (frames 2390–2775)
- **Audio:** Narration covers the preserved original white structural beams,
  then the fitness center (ends 92.30s).
- **Transition out:** cross-dissolve into Scene 4.

## Scene 4 — A New Home for U.S. Energy (1:34–2:25 / 2820–4350f)

- **Visuals:** Four sequential layers over one continuous scene:
  1. `hq-reception-reveal.mp4` (full walk-in reveal) — "Fort Worth Stockyards
     Headquarters" tag.
  2. `office-culture-hoops.mp4` (full clip) — "Investors. Partners. Clients."
  3. `core-values-wall.mp4` (mildly slow-motion push) standing in for the
     brief's conference-room/event-space visuals — "Elegant Conference Rooms
     & Event Spaces" lower-third.
  4. A slow Ken Burns zoom-out on the building exterior still
     (`bg-armour-exterior.jpg`) as a cinematic stand-in for the brief's
     closing aerial pull-away (no drone footage was provided) — brand title,
     then the closing lines and logo.
- **On-screen text:** "U.S. Energy Development Corporation" → "Honoring Our
  Past." / "Building Our Future." → logo mark + usedc.com.
- **Audio:** Narration concludes on the headquarters' role as an investor
  and client destination and the company's commitment to its heritage (ends
  137.97s). Music swells gently then fades out over the final ~7 seconds of
  silence after narration ends.

---

## Design language recap

- Navy (`#00012A`) dominant background; dark red (`#82171A`) and gold used
  for accents, dividers, and key words — the same palette as U.S. Energy's
  other brand video, since this is the same company's headquarters story.
- A warm sepia/brick treatment (see `KenBurnsBackground`'s `overlayColor`/
  `filter` overrides) is used specifically for the "historic" Stockyards and
  Armour Building scenes, distinct from the cooler navy tint used elsewhere,
  per the brief's "warm Texas tones, rich brick reds, gold sunset lighting"
  color-grade direction.
- Condensed display font for titles; clean sans-serif for supporting copy
  and captions.
- Lower-thirds: white text over a soft transparent navy gradient, generous
  padding, title-safe margins respected on all sides.
- Transitions: cross-dissolves and dip-to-navy only. No spin, glitch, or
  whip-zoom transitions anywhere in the edit.
