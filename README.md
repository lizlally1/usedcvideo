# U.S. Energy Development Corporation — Brand Video

A complete Remotion project that renders a 2:31 cinematic brand video for
U.S. Energy Development Corporation, built from the company's own uploaded
office/HQ footage plus researched, sourced company facts.

- **Format:** 1920×1080, 16:9, 30fps
- **Runtime:** 151 seconds (2:31) — within the requested 2–3 minute range
- **Output:** `out/usedc-brand-video.mp4`

See also: `media-inventory.md`, `storyboard.md`, `voiceover-script.txt`,
`voiceover-timestamps.txt`, `sources.md`, `render-notes.md`.

## Quick start

```bash
npm install

# Optional: generate real narration + music before rendering (see below).
# Placeholder audio is already committed under public/audio/ so the project
# renders out of the box without any of this.

npm start            # opens the Remotion Studio preview at localhost
npm run build        # renders the final MP4 to out/usedc-brand-video.mp4
```

## Project structure

```
src/
  index.ts              Remotion entry point (registerRoot)
  Root.tsx              <Composition> definition (id, fps, size, duration)
  Video.tsx             Assembles all 7 scenes + captions + audio layers
  data/
    content.ts           <-- Single source of truth for every fact, date,
                              statistic, on-screen line, and scene duration.
                              Edit copy/timing here without touching any
                              component.
  styles/
    theme.ts              Brand colors, font stacks, safe margins, gradients
    loadFonts.ts           Loads the locally-bundled Oswald/Inter font files
  components/
    Transition.tsx         Reusable cross-dissolve / dip-to-navy wrapper
    LowerThird.tsx          Bottom-third value/label callout
    Timeline.tsx            Horizontal animated milestone timeline
    Statistic.tsx           Large-numeral statistic row
    Captions.tsx            Optional closed-captions track (toggle in content.ts)
    Logo.tsx                 Typographic U.S. Energy wordmark lockup
    TitleCard.tsx             Large section title + subtitle card
    KenBurnsBackground.tsx    Slow zoom/pan still-image backdrop
    SafeMedia.tsx             <SafeVideo>/<SafeImage> — missing-asset-safe
                                wrappers around OffthreadVideo/<img>
  scenes/
    Scene1Opening.tsx .. Scene7Conclusion.tsx   One component per storyboard scene
public/
  footage/       Processed (H.264) copies of the 5 uploaded clips
  images/        Still frames pulled from the footage for Ken Burns backdrops
  fonts/         Locally-bundled Oswald + Inter variable font files
  audio/         voiceover.mp3 + music.mp3 (see public/audio/README.md)
scripts/
  generate-voiceover.mjs            Real TTS generation (ElevenLabs/OpenAI/Polly)
  generate-fallback-voiceover.mjs   Offline espeak-ng placeholder narration
  generate-placeholder-music.sh     Synthesized placeholder instrumental bed
```

## Editing the story

Everything content-related — company facts, timeline milestones, core
values, statistics, on-screen titles, scene durations, caption text/timing —
lives in **`src/data/content.ts`**. Change wording or dates there; the
animated components (Timeline, Statistic, LowerThird, TitleCard, etc.) just
render whatever that file gives them.

Scene *durations* also live in `content.ts` (`SCENES` object, in seconds).
`src/Video.tsx` derives every scene's absolute frame offset from that table
automatically, so lengthening or shortening one scene reflows everything
after it — no frame-math edits needed elsewhere.

## Voiceover

Three supported paths, in order of preference:

1. **Real TTS provider** — copy `.env.example` to `.env`, set
   `VOICEOVER_PROVIDER` to `elevenlabs`, `openai`, or `polly`, fill in that
   provider's API key, then run `npm run voiceover`. No API key is ever
   hard-coded in this repo.
2. **Offline placeholder** — `npm run voiceover:fallback` uses the
   locally-installed `espeak-ng` to synthesize a timing-accurate but
   clearly non-final placeholder voice (this is what ships in this repo's
   `public/audio/voiceover.mp3` today).
3. **Manual file** — record/produce narration yourself and drop it at
   `public/audio/voiceover.mp3` (151 seconds, matching
   `voiceover-timestamps.txt`).

The full narration script is in `voiceover-script.txt`; a timestamped
version (for syncing recordings or captions) is in
`voiceover-timestamps.txt`.

## Music

`npm run music:placeholder` regenerates a synthesized ambient placeholder
bed at `public/audio/music.mp3` using nothing but ffmpeg signal generators
— it is explicitly **not** a licensed acoustic-guitar/country track, just a
soft pad so the mix has something under the narration while previewing.
Replace it with a real licensed or royalty-free soft instrumental-country
track before treating a render as final. See `public/audio/README.md`.

## Captions

Optional closed captions are on by default. Toggle them with
`CAPTIONS_ENABLED` in `src/data/content.ts`; timing/text lives in the
`CAPTIONS` array in that same file, authored from
`voiceover-timestamps.txt`.

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
npx remotion render src/index.ts USEDCBrandVideo out/usedc-brand-video.mp4

# Fast lower-res draft (half scale, lower JPEG quality)
npm run render:draft

# Single still frame, for a thumbnail or visual QA
npx remotion still src/index.ts USEDCBrandVideo out/thumbnail.png --frame=30
```

See `render-notes.md` for the exact command used for this project's
delivered render, plus FFmpeg commands used for footage processing.

## Media processing

All original uploaded `.mov` files are untouched. Processed, web-friendly
H.264 copies (muxed for `moov` atom at the front via `-movflags +faststart`)
live in `public/footage/`, generated with FFmpeg — see `media-inventory.md`
for the exact mapping and `render-notes.md` for the FFmpeg commands used.

## Known limitations / what to swap before "final"

- **Voiceover** ships as an offline `espeak-ng` placeholder — not the
  "standard, realistic AI narration" the brief calls for. Swap in a real
  ElevenLabs/OpenAI/Polly render before treating this as a finished
  deliverable (see Voiceover section above).
- **Music** ships as a synthesized placeholder ambient pad, not a licensed
  soft-instrumental-country track. Swap `public/audio/music.mp3` for a real
  licensed/royalty-free track before final delivery.
- **Footage volume:** only ~36.5 seconds of raw footage was provided across
  5 clips for a 151-second video. Scenes 2–4 (history timeline / growth /
  statistics) are therefore intentionally graphics-forward, using blurred
  still-image Ken Burns backdrops for texture rather than more live footage,
  per the creative brief's own allowance for this approach.
