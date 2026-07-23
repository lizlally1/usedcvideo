# The Armour Building — U.S. Energy Development Corporation History Film

A complete Remotion project that renders a cinematic history film about the
Armour Building in the Fort Worth Stockyards and its transformation into the
headquarters of U.S. Energy Development Corporation, built from the
company's own uploaded office/HQ footage.

- **Format:** 1920×1080, 16:9, 30fps, **silent (no audio track), no
  captions** — narration/music/captions were removed from the composition
  by request; see "Audio and captions were removed" below for how to bring
  them back.
- **Runtime:** 145 seconds (2:25) — see storyboard.md for why this landed a
  little past the brief's nominal "approximately 2:00" (the full four-scene
  script the brief provided takes about 2:18 to narrate at a natural,
  unhurried pace; scene durations here still follow that original timing
  even with the narration itself removed from the final video)
- **Output:** `out/armour-building-film.mp4`

See also: `media-inventory.md`, `storyboard.md`, `voiceover-script.txt`,
`voiceover-timestamps.txt`, `sources.md`, `render-notes.md`.

## Quick start

```bash
npm install

npm start            # opens the Remotion Studio preview at localhost
npm run build        # renders the final MP4 to out/armour-building-film.mp4
```

## Project structure

```
src/
  index.ts              Remotion entry point (registerRoot)
  Root.tsx              <Composition> definition (id, fps, size, duration)
  Video.tsx              Assembles the 4 scenes only — no audio, no captions
  data/
    content.ts           <-- Single source of truth for every on-screen
                              line, color, and scene duration. Edit
                              copy/timing here without touching any
                              component.
    narration-lines.json  The narration script, one entry per spoken line —
                            not currently used by the composition (see
                            "Audio and captions were removed" below), kept
                            for reference / in case audio is added back.
    narration-timing.json The measured start/end of each narration line in
                            public/audio/voiceover.mp3 — likewise unused by
                            the current (silent) composition.
  styles/
    theme.ts              Brand colors, font stacks, safe margins, gradients
    fonts-inline.css       Oswald/Inter, base64-inlined (see render-notes.md
                            for why — no network fetch at render time)
  components/
    Transition.tsx         Reusable cross-dissolve / dip-to-navy wrapper
    LowerThird.tsx          Bottom-third value/label callout
    KenBurnsBackground.tsx  Slow zoom/pan still-image backdrop, with
                              optional overlayColor/filter overrides used
                              for this film's warm/sepia "historic photo"
                              treatments (Scenes 1-2)
    Logo.tsx                 Typographic U.S. Energy wordmark lockup
    TitleCard.tsx             Large section title + subtitle card
    SafeMedia.tsx             <SafeVideo>/<SafeImage> — missing-asset-safe
                                wrappers around OffthreadVideo/<img>
  scenes/
    Scene1Stockyards.tsx          The Rise of the Fort Worth Stockyards
    Scene2ArmourBuilding.tsx      The Armour Building
    Scene3HonoringStructure.tsx   Honoring the Original Structure
    Scene4NewHome.tsx             A New Home for U.S. Energy
public/
  footage/       Processed (H.264) copies of the 5 uploaded clips
  images/        Still frames pulled from the footage for Ken Burns backdrops
  fonts/         Locally-bundled Oswald + Inter variable font files
  audio/         voiceover.mp3 + music.mp3 (see public/audio/README.md)
scripts/
  generate-voiceover.mjs            Real TTS generation (ElevenLabs/OpenAI/Polly)
  generate-fallback-voiceover.mjs   Offline RHVoice placeholder narration
  generate-placeholder-music.sh     Synthesized placeholder instrumental bed
```

## Editing the story

Every on-screen line of copy, color, and scene duration lives in
**`src/data/content.ts`**. Change wording there; the animated components
(TitleCard, LowerThird, KenBurnsBackground, etc.) just render whatever that
file gives them.

Scene *durations* also live in `content.ts` (`SCENES` object, in seconds).
`src/Video.tsx` derives every scene's absolute frame offset from that table
automatically, so lengthening or shortening one scene reflows everything
after it — no frame-math edits needed elsewhere. Inside `Scene4NewHome.tsx`,
each footage segment is a separate nested `<Sequence>` (see the comment at
the top of that file for why: `<SafeVideo>`'s `startFrom`/`endAt` props
resolve against whatever frame is "current" when the component mounts, so a
segment that starts partway through a scene needs its own Sequence boundary
— computing the numbers against the raw scene frame count instead produces
a validity window in the wrong place and the video silently renders blank
for most of its intended on-screen time. Ask for `render-notes.md`'s
"blank video" section for the full story of how this was found and fixed.)

## Audio and captions were removed

The composition (`src/Video.tsx`) renders only the 4 visual scenes — no
`<Audio>` layers and no `<Captions>` overlay. `npx remotion render` still
muxes a silent AAC audio track into the MP4 by default even with no
`<Audio>` component in the composition; the delivered
`out/armour-building-film.mp4` has that stripped too
(`ffmpeg -c:v copy -an`), so the file has no audio stream at all, not just
silence on one.

Nothing was deleted from the underlying narration/music pipeline — it's
just disconnected from the video:

- `src/data/narration-lines.json` / `narration-timing.json` — the
  narration script and its measured per-line timing
- `voiceover-script.txt` / `voiceover-timestamps.txt` — the same, in
  read-friendly form
- `public/audio/voiceover.mp3` / `music.mp3` — the generated placeholder
  audio files, along with `scripts/generate-voiceover.mjs`,
  `scripts/generate-fallback-voiceover.mjs`, and
  `scripts/generate-placeholder-music.sh` that produce them (see
  `public/audio/README.md`)

To bring audio and/or captions back: re-add a `<Sequence>`-wrapped
`<Audio src={staticFile('audio/voiceover.mp3')}>` (and `music.mp3`) and a
`<Captions>`-style overlay component to `src/Video.tsx`, plus the
`CAPTIONS`/`AUDIO` exports back to `src/data/content.ts` (removed along
with `src/components/Captions.tsx` when audio/captions were taken out —
check git history on this branch for the previous implementation to copy
from).

## Missing-asset handling

`<SafeVideo>` / `<SafeImage>` (in `src/components/SafeMedia.tsx`) check that
a referenced file in `public/` actually exists before mounting it. In the
Remotion Studio preview (development), a missing asset renders a clearly
labeled red warning card naming the missing file instead of crashing the
composition. In a production render (`remotion render`/`remotion still`),
the same missing asset renders nothing (blank) rather than ever leaking a
warning into the final MP4.

## Rendering

```bash
# Full-quality final render
npx remotion render src/index.ts ArmourBuildingFilm out/armour-building-film.mp4

# Fast lower-res draft (half scale, lower JPEG quality)
npm run render:draft

# Single still frame, for a thumbnail or visual QA
npx remotion still src/index.ts ArmourBuildingFilm out/thumbnail.png --frame=30
```

See `render-notes.md` for the exact command used for this project's
delivered render, plus FFmpeg commands used for footage processing.

## Media processing

All original uploaded `.mov` files are untouched. Processed, web-friendly
H.264 copies (muxed for `moov` atom at the front via `-movflags +faststart`)
live in `public/footage/`, generated with FFmpeg — see `media-inventory.md`
for the exact mapping and `render-notes.md` for the FFmpeg commands used.

## Known limitations / what to swap before "final"

- **Missing B-roll.** The creative brief calls for sunrise drone footage,
  historic black-and-white photography, railroad footage, longhorn cattle,
  period maps, construction/renovation footage, craftsmen at work, gym and
  personal-trainer footage, Fort Worth Police Department members using the
  fitness center, and an aerial pull-away. None of this was part of this
  project's uploads — only the same 5 phone-camera clips used in the
  sibling brand-video project. Every scene that calls for one of these
  shots uses either the closest genuinely-filmed asset on hand or a
  graphics-forward stand-in (a tinted Ken Burns zoom + on-screen text) —
  see `media-inventory.md` for exactly which, scene by scene. Swap in real
  footage for these beats before treating a render as final.
- **The film is silent with no captions**, by request — see "Audio and
  captions were removed" above for what's still in the repo if that
  changes.
- **All original footage audio has been physically stripped** — every
  file in `public/footage/` is video-only (re-muxed with `ffmpeg -an`),
  independent of the current no-audio composition.
- **Runtime landed at 2:25, not exactly 2:00.** See storyboard.md — the
  brief's own scene breakdown summed to a nominal 2:00, but the full
  four-scene script it also provided takes about 2:18 to narrate at a
  natural pace. Scene durations here follow the actual measured narration
  rather than either cutting the approved script or rushing the narrator.
