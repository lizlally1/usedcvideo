# Media Inventory — The Armour Building

All five clips were shot on a phone camera, 1920×1080, landscape (16:9),
H.265/HEVC, ~30fps. Total raw footage: **~36.5 seconds** across 5 clips —
the same five clips used in U.S. Energy's other brand video project, since
both films were shot during the same HQ visit. This film reuses them for a
different story (the Armour Building's own history, rather than the
company's), so several clips are assigned to different moments here than in
that other project.

The creative brief for this film suggests a much larger B-roll list —
sunrise drone footage, historic black-and-white photography, railroad
footage, longhorn cattle, period maps, construction/renovation footage,
craftsmen at work, gym and personal-trainer footage, Fort Worth Police
Department members using the fitness center, and an aerial pull-away —
**none of which was part of this project's uploads.** Rather than fabricate
stock-footage-style B-roll, every scene that calls for one of those shots
uses the closest genuinely-filmed asset on hand, or falls back to a
graphics-forward treatment (a tinted, slow Ken Burns zoom on a real still
frame from the footage, plus on-screen text) — see storyboard.md for exactly
which. This is called out explicitly rather than left implicit so nobody
mistakes the stand-ins for the requested drone/archival footage.

Processed, web-friendly (H.264) copies used by the Remotion project live in
`public/footage/`. Originals are untouched.

| # | Original file | Processed as | Duration | Content | Used in this film for |
|---|---|---|---|---|---|
| 1 | `d4d7a6e7-IMG_5646.mov` | `armour-exterior.mp4` | 5.17s | Exterior establishing shot of "THE ARMOUR" building — brick facade, glass entrance canopy, signage; an employee walks/laughs toward camera. | **Scene 2 (The Armour Building)** — opens the scene as the real "constructed... enduring symbol" exterior/brick/craftsmanship shot. A still frame from it also becomes the tinted Ken Burns backdrop for the rest of Scene 2, and again (zoomed out) as the closing "aerial pull-away" stand-in at the end of Scene 4. |
| 2 | `ac13d107-IMG_5671.mov` | `hq-reception-reveal.mp4` | 7.37s | Walking through open double doors into a reception nook: a branded "U.S. ENERGY DEVELOPMENT CORPORATION" wall sign, dark wood credenza, cowhide-leather armchairs. | **Scene 4 (A New Home for U.S. Energy)** — opens the scene as the "proud home of U.S. Energy" reveal; a still frame from it is also the tinted backdrop behind Scene 3's beams/fitness-center text (the only interior still on hand). |
| 3 | `73b6db28-IMG_5657.mov` | `elevator-archival-mural.mp4` | 7.53s | Elevator doors opening onto a large black-and-white archival photo mural reading "ARMOUR & COMPANY" over the old stockyards/meatpacking complex. | **Scene 1 (The Rise of the Fort Worth Stockyards)** — this is the only genuinely archival-feeling asset from the shoot, so it opens the film; a still frame from it, sepia-graded, carries the rest of the scene. |
| 4 | `53f8a416-IMG_5650.mov` | `core-values-wall.mp4` | 10.30s | Slow push-in on the company's physical "CORE VALUES" wall display. | **Scene 4 (A New Home for U.S. Energy)** — used at a mild slow-motion rate as a premium-interior stand-in for the brief's requested conference-room/event-space B-roll (no literal conference-room footage was provided). |
| 5 | `31d77b44-IMG_5676.mov` | `office-culture-hoops.mp4` | 6.17s | Casual open office; employees playing an office basketball hoop game, laughing. | **Scene 4 (A New Home for U.S. Energy)** — the "employees collaborating" beat, paired with the "Investors. Partners. Clients." callout. |

## Derived still images (Ken Burns backdrops)

- `public/images/bg-archival-mural.jpg` — from clip 3, sepia-graded in
  Scene 1 as the "historic photograph" stand-in for the missing
  drone/railroad/longhorn/map footage.
- `public/images/bg-armour-exterior.jpg` — from clip 1, warm brick-toned in
  Scene 2 (craftsmen/renovation narration) and reused, cooler and zoomed
  out, as Scene 4's closing "aerial pull-away" stand-in.
- `public/images/bg-hq-reception.jpg` — from clip 2, gold-toned as the
  Scene 3 backdrop (no beam, gym, personal-trainer, or Fort Worth Police
  Department footage was provided, so this scene is intentionally
  graphics-forward — see storyboard.md).
- `public/images/bg-office.jpg` — from clip 5. Not used in this film (kept
  in the repo since it's still a valid derived asset, available if a future
  edit wants it).

## Audio notes

All original camera audio has been physically removed from every clip.
The processed copies in `public/footage/*.mp4` are video-only streams
(re-muxed with `ffmpeg -c:v copy -an`); the untouched originals in the
upload source are never modified. `src/data/content.ts` keeps each
footage entry's `volume` at `0` as a defensive no-op / statement of
intent, since there is no audio track left to adjust. The only audio in
the final composition is the narration and music layers.
