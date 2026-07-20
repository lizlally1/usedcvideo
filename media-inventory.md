# Media Inventory — U.S. Energy Brand Video

All five clips were shot on a phone camera, 1920×1080, landscape (16:9),
H.265/HEVC, ~30fps. Total raw footage: **~36.5 seconds** across 5 clips.
Because the available footage is short relative to the 2:30 target runtime,
the edit leans on the graphics-forward sections the brief already calls for
(timeline, statistics) for a large share of the runtime, and reserves the
live-action clips for the moments where authentic, human footage matters
most: the opening reveal, the culture/values section, and the Fort Worth
headquarters section.

Processed, web-friendly (H.264) copies used by the Remotion project live in
`public/footage/`. Originals are untouched.

| # | Original file | Processed as | Duration | Orientation | Content | Quality | Strongest section | Placement |
|---|---|---|---|---|---|---|---|---|
| 1 | `d4d7a6e7-IMG_5646.mov` | `armour-exterior.mp4` | 5.17s | Landscape 1920×1080 | Exterior establishing shot of "THE ARMOUR" building — brick facade, glass entrance canopy, signage. An employee walks/laughs toward camera from the entrance. | Good — slightly overcast daylight, stable handheld shot. | 0.0–3.0s: full building + canopy in frame, walker approaching, natural smile/laugh audible. | **Scene 1 (Opening)** — first 3s as the cold open. **Scene 7 (Conclusion)** — final ~2s (different sub-range, walker closer to camera) as the closing wide shot, per brief's allowance to intentionally reprise footage near the conclusion. |
| 2 | `ac13d107-IMG_5671.mov` | `hq-reception-reveal.mp4` | 7.37s | Landscape 1920×1080 | Walking through open double doors into a reception nook: a branded leather "U.S. ENERGY DEVELOPMENT CORPORATION" wall sign above a dark wood credenza, flanked by cowhide-leather armchairs; cowboy hat/tack visible on a stand. | Very good — well lit, on-brand, western-inspired without being costume-y. | 1.5–6.5s: doors fully open, sign and seating area centered and steady. | **Scene 6 (Fort Worth Stockyards)** — primary placement, full walk-in reveal. A 1.5s static crop of just the sign (different treatment, not a straight replay) is used as a small insert in **Scene 1** under the opening title. |
| 3 | `73b6db28-IMG_5657.mov` | `elevator-archival-mural.mp4` | 7.53s | Landscape 1920×1080 | Elevator doors opening onto a stairwell atrium with a large black-and-white archival photo mural reading "ARMOUR & COMPANY" over the old stockyards/meatpacking complex; floor signage "L2"; a longhorn decor piece visible through glass. | Good — a few seconds of soft focus while doors open, sharp once open. | 3.0–7.5s: mural fully revealed, sharp focus, historic signage legible. | **Scene 6 (Fort Worth Stockyards)** — used once, as the visual link between U.S. Energy's history and the Armour Building's own history. The door-opening motion doubles as a natural scene transition. |
| 4 | `53f8a416-IMG_5650.mov` | `core-values-wall.mp4` | 10.30s | Landscape 1920×1080 | Slow push-in on the company's physical "CORE VALUES" wall display — six branded plaques reading Investor First, Trustworthy & Sincere, Collaborative, Responsible to All Stakeholders, Innovative, and Passionate & Driven. | Very good — sharp, well lit, on-brand typography matches the brand plate seen in clip 2. | Full clip is usable; the continuous push naturally brings different plaques into frame over time. | **Scene 5 (People & Core Values)** — split into three sequential sub-ranges (0–3.5s / 3.5–7s / 7–10.3s), each timed under a different value's on-screen callout as the camera reveals that plaque. Not a repeated replay — one continuous camera move used once, in order. |
| 5 | `31d77b44-IMG_5676.mov` | `office-culture-hoops.mp4` | 6.17s | Landscape 1920×1080 | Casual open office with green turf flooring, glass-walled focus pods with employee nameplates, exposed industrial ceiling. Employees playing an office basketball hoop game, laughing, walking through. | Good — natural handheld motion, authentic candid moment, genuine laughter audible. | Full clip — continuous authentic action throughout. | **Scene 5 (People & Core Values)** — primary "workplace culture" beat, paired with the Collaborative / Passionate & Driven value callouts. Natural laughter kept low in the mix (not fully muted) since it meaningfully sells the authenticity of the moment. |

## Derived still images (Ken Burns backgrounds)

Because Scenes 2–4 (history timeline and growth statistics) are
intentionally graphics-forward per the creative brief, four still frames
were pulled from the footage to use as softly blurred, navy-tinted,
slow-zoom backdrops behind the timeline/stat graphics — so those sections
read as textured and cinematic rather than a flat slideshow, without
reusing the same video sections that already appear as full motion
elsewhere:

- `public/images/bg-armour-exterior.jpg` — from clip 1
- `public/images/bg-hq-reception.jpg` — from clip 2
- `public/images/bg-office.jpg` — from clip 5
- `public/images/bg-archival-mural.jpg` — from clip 3

## Audio notes

All original camera audio has been physically removed from every clip.
The processed copies in `public/footage/*.mp4` are video-only streams
(re-muxed with `ffmpeg -c:v copy -an`); the untouched originals in the
upload source are never modified. `src/data/content.ts` keeps each
footage entry's `volume` at `0` as a defensive no-op / statement of
intent, since there is no audio track left to adjust. The only audio in
the final composition is the narration and music layers.
