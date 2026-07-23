# Render Notes

## Audio and captions removed

By request, `src/Video.tsx` no longer renders `<Audio>` or `<Captions>`
layers, and the corresponding `AUDIO`/`CAPTIONS`/`CAPTIONS_ENABLED` exports
and `src/components/Captions.tsx` were removed from `src/data/content.ts`
and `src/components/` respectively (they're unused dead code once nothing
in `Video.tsx` references them). The underlying narration/music assets and
generator scripts were left in place — see README's "Audio and captions
were removed" section.

One thing worth knowing if this gets re-enabled or re-rendered: `npx
remotion render` mux a silent AAC audio track into its output MP4 by
default even when the composition has zero `<Audio>` components. The
delivered `out/armour-building-film.mp4` has that silent track stripped
with a lossless remux (`ffmpeg -c:v copy -an`) so the file has no audio
stream at all, rather than shipping an inaudible-but-present one.

## Environment

- Node 22, Remotion 4.0.290, ffmpeg 6.1.1, RHVoice 1.8.0 (+ rhvoice-english),
  all installed fresh for this project (`apt-get install ffmpeg rhvoice
  rhvoice-english`).
- Rendering runs headless Chrome (Remotion's bundled Chrome Headless
  Shell). Fonts (Oswald, Inter) are inlined as base64 data URIs in
  `src/styles/fonts-inline.css` — see the sibling U.S. Energy brand-video
  project's render-notes for why (font-loading race conditions under
  concurrent rendering with any async-fetch approach). Unchanged here.

## Footage processing (FFmpeg)

The 5 uploaded clips and their H.264 conversions are shared with the
sibling brand-video project (same HQ shoot); see that project's
render-notes for the exact `ffmpeg` commands used to produce
`public/footage/*.mp4` and the 4 derived stills in `public/images/`.

## Audio pipeline

- `npm run music:placeholder` → `scripts/generate-placeholder-music.sh`
  synthesizes a soft ambient placeholder bed with `ffmpeg`'s `sine` source
  filters, now targeting this project's 145s runtime (`DURATION=145` in
  the script, was 155 in the sibling project's 151s film).
- `npm run voiceover:fallback` → `scripts/generate-fallback-voiceover.mjs`
  synthesizes each of the 16 narration lines with `RHVoice-test` ("bdl"),
  places them sequentially with a measured, collision-free gap, and pads
  the result to a target total length. Two constants were tuned for this
  film versus the sibling project's defaults: `RATE` raised from 95 to 105
  (a brisker, more confident narrator pace — see storyboard.md for why:
  the brief's own script runs long for a 2:00 target at a slower pace) and
  `GAP_SECONDS`/`LEAD_IN_SECONDS` trimmed slightly (0.65→0.5, 3.0→2.0).
  Both are also overridable via `VO_RATE`/`VO_TOTAL_SECONDS` env vars
  without editing the script.
- The measurement process used to arrive at this film's final scene
  durations: (1) ran the fallback generator once with a generous
  `VO_TOTAL_SECONDS` ceiling to get the real per-line timing without the
  script's own safety-margin check failing; (2) read the resulting
  `src/data/narration-timing.json` to find where each of the 4 scenes'
  narration actually ends; (3) set `SCENES` durations in `content.ts` to a
  beat past each of those points; (4) re-ran the generator with
  `VO_TOTAL_SECONDS` set to the now-final total (145) so the audio file's
  silence-padding matches exactly.

## Bug found and fixed: two Scene 4 video layers rendered blank for most of their on-screen time

**Symptom:** spot-checking the first full-quality draft at several
timestamps (via `ffmpeg -ss <t> -frames:v 1`) showed Scene 4's
"Investors. Partners. Clients." and "Elegant Conference Rooms & Event
Spaces" beats displaying nothing but a blank navy background behind their
text — the office-culture and core-values-wall footage wasn't visible at
all for most of the time it should have been on screen.

**Root cause:** `<SafeVideo>` (wrapping Remotion's `<OffthreadVideo>`)
takes `startFrom`/`endAt` props. Internally, `<OffthreadVideo>` uses these
to wrap itself in `<Sequence from={-startFrom} durationInFrames={endAt}>`
(see `node_modules/remotion/dist/cjs/video/OffthreadVideo.js`) — meaning
the video is only valid/rendered while the *enclosing* frame count (i.e.
whatever `useCurrentFrame()` returns at the point `<SafeVideo>` is
rendered) falls inside `[-startFrom, -startFrom + endAt)`. Every video
layer in Scenes 1-2 of this film (and every video layer in the sibling
brand-video project) starts at its scene's own frame 0, so `startFrom=0`
and `endAt=<window length>` happen to describe the right window by
coincidence. Scene 4 in this film has *four* sequential footage segments
inside one scene, and the 2nd and 3rd (office culture, core values wall)
start well after their scene's frame 0 — but were still written with
`startFrom={0}` and `endAt={<the segment's own span>}`, computed as if the
segment started at frame 0. That put the actual valid window at the
*start* of the scene instead of the middle, so the video had already gone
invalid (rendering nothing) by the time the segment's opacity reached 1.

**Fix:** wrapped each footage segment in `Scene4NewHome.tsx` in its own
top-level `<Sequence from={segmentStart} durationInFrames={segmentSpan}>`.
This resets `useCurrentFrame()` to 0 at the segment's own start, so
`startFrom={0}` / `endAt={segmentSpan}` inside it are correct without any
further arithmetic — `<SafeVideo>` no longer needs to know where in the
overall scene it sits. Adjacent segments' Sequences overlap by 24 frames
(`CROSSFADE`) so one can fade out while the next fades in; a small
`useCrossfade()` hook computes each segment's own fade-in/fade-out from
its local frame. See the comment above `Scene4NewHome`'s segment constants
for the fuller explanation.

**Narrower version fixed in Scenes 1-2:** those scenes' single video layer
does start at frame 0, so the Sequence-wrapping math is directionally
correct, but `endAt` had been set to the desired *visible* window length
(226+24=250 for Scene 1's mural clip, 155+25=180 for Scene 2's exterior
clip) rather than the *source clip's own* length (226 and 155 frames
respectively) — meaning the video's validity window ended a beat before
its own crossfade-out had finished, leaving a ~24-frame gap of blank video
under an already-fading-out opacity layer (much less visually obvious than
Scene 4's bug, since the crossfade partner layer is already appearing
underneath by then, but still not technically correct). Fixed by setting
`endAt` to the source clip's own frame count and having the crossfade-out
complete exactly as the clip ends, rather than reading past end-of-file or
leaving a validity gap.

**Verified** by re-rendering the draft and spot-checking `ffmpeg -ss
<t> -frames:v 1` frames across every scene and every crossfade boundary,
confirming continuous footage (no blank frames) end to end before the
final full-quality render.

## Render commands

```bash
# Draft (half-resolution, faster, lower quality) — useful for a quick
# end-to-end sanity check of timing/audio/captions before a full render.
npx remotion render src/index.ts ArmourBuildingFilm out/armour-building-film-draft.mp4 \
  --scale=0.5 --jpeg-quality=70 --concurrency=2

# Final, full-quality render — this is the exact command used for this
# project's delivered MP4.
npx remotion render src/index.ts ArmourBuildingFilm out/armour-building-film.mp4
```

`remotion.config.ts` sets the codec (H.264), pixel format (yuv420p, for
broad compatibility), CRF (18, visually lossless), and output overwrite
behavior, so the two commands above are all that's needed — no extra
flags required for a standard delivery-quality MP4.

## Verifying final duration

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 out/armour-building-film.mp4
```

Expected: `duration=145.0...` (2 minutes 25 seconds). See storyboard.md
for why this is a little past the brief's nominal "approximately 2:00."
