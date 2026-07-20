# Render Notes

## Environment

- Node 22, Remotion 4.0.290, ffmpeg 6.1.1, espeak-ng 1.51.
- Rendering runs headless Chrome (Remotion's bundled Chrome Headless
  Shell). This project's fonts (Oswald, Inter) are downloaded once (via
  `curl`, which trusts the proxy's CA bundle) into `public/fonts/*.woff2`,
  then inlined as base64 data URIs directly in
  `src/styles/fonts-inline.css` (imported by `src/Video.tsx`). Two earlier
  approaches were tried and rejected:
  1. `@remotion/google-fonts` (fetches from `fonts.gstatic.com` at render
     time) — fails outright: this environment's headless Chrome cannot
     complete a TLS handshake with that host through the local egress
     proxy (`ERR_CERT_AUTHORITY_INVALID`).
  2. A local `.woff2` file loaded via the `FontFace` API + `delayRender()`
     (network-free, but still asynchronous) — worked in isolated `remotion
     still` tests, but intermittently timed out under full multi-frame
     concurrent rendering (a slow/contended tab occasionally failed to
     resolve the font-load promise within the timeout, twice failing a
     full render partway through, at frames 105 and 866).
  The base64-inline approach removes the async step entirely — the
  `@font-face` rule is just parsed synchronously as part of normal
  stylesheet loading — and had zero failures afterward. Regenerate
  `fonts-inline.css` if the `.woff2` files ever change:
  ```bash
  python3 -c "
  import base64
  o = base64.b64encode(open('public/fonts/oswald-variable-latin.woff2','rb').read()).decode()
  i = base64.b64encode(open('public/fonts/inter-variable-latin.woff2','rb').read()).decode()
  print(f'@font-face {{ font-family: \"Oswald\"; font-weight: 200 700; src: url(data:font/woff2;base64,{o}) format(\"woff2\"); }}')
  print(f'@font-face {{ font-family: \"Inter\"; font-weight: 100 900; src: url(data:font/woff2;base64,{i}) format(\"woff2\"); }}')
  " > src/styles/fonts-inline.css
  ```

## Footage processing (FFmpeg)

Original uploads are untouched. Processed copies were generated with:

```bash
ffmpeg -y -i <source>.mov \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  public/footage/<name>.mp4
```

This re-encodes the phone camera's HEVC/H.265 source into browser- and
Remotion-friendly H.264, keeps the original 1920×1080 resolution and aspect
ratio (no cropping/stretching at the file level — framing/crops happen only
in React/CSS inside the composition), and moves the `moov` atom to the
front of the file for fast start / reliable seeking during rendering.

Four still frames were extracted from the footage for the Ken Burns
backdrops used behind the graphics-forward scenes:

```bash
ffmpeg -y -ss <timestamp> -i public/footage/<clip>.mp4 -frames:v 1 -q:v 2 public/images/<name>.jpg
```

## Audio pipeline

- `npm run music:placeholder` → `scripts/generate-placeholder-music.sh`
  synthesizes a soft ambient placeholder bed with `ffmpeg`'s `sine`
  source filters (no drums, no lead, low-passed) — explicitly a
  placeholder, not licensed music.
- `npm run voiceover:fallback` → `scripts/generate-fallback-voiceover.mjs`
  synthesizes each narration line with `espeak-ng`, then uses `ffmpeg`'s
  `adelay`/`amix` filters to place each line at its exact intended
  timestamp (matching `src/data/content.ts`'s `CAPTIONS` array) inside a
  single 151-second track.
- `npm run voiceover` → `scripts/generate-voiceover.mjs` calls a real TTS
  provider (ElevenLabs / OpenAI TTS / Amazon Polly) when credentials are
  present in `.env`. Not used for this delivered render (no API key was
  available in this environment) — see README's "Known limitations"
  section.

## A bug fixed during rendering: `playbackRate` + `endAt`

Three scenes intentionally stretch a short video clip across a longer
on-screen window using Remotion's `playbackRate` prop (slow motion) so a
handful of seconds of footage can cover the time the storyboard allots it.
Initial implementation set `endAt` to the **source clip's own frame
count** (e.g. `309` for a 10.3s@30fps clip). That is wrong: Remotion
resolves `startFrom`/`endAt` against the **on-screen composition
timeline**, not the source media's frame count, when `playbackRate != 1`.
The visible symptom was the clip fading in correctly and then vanishing
partway through its scene (once the composition frame count passed the
source's raw frame count). Fix: `endAt` is set to `startFrom + <desired
on-screen duration in composition frames>` instead — see
`src/scenes/Scene5People.tsx`, `Scene6Stockyards.tsx`, and
`Scene7Conclusion.tsx` for the corrected math.

## A bug fixed during rendering: caption / lower-third collision

The optional closed-captions track (bottom-center) and the per-scene
`LowerThird` component (bottom-left, used for core values and location
tags) both anchored near the very bottom of the frame and would overlap
during scenes that show both at once, partially obscuring text under the
caption's semi-transparent background. Fixed by raising the captions
track's vertical position (`bottom: 360`) to clear the 340px-tall
lower-third scrim band in every scene — see `src/components/Captions.tsx`.

## A bug fixed during rendering: font-load timeout under concurrent render

The first two full-render attempts failed (at frames 105 and 866
respectively) with a `delayRender()` timeout on the custom font loading,
evidently an intermittent resource-contention hiccup under
`Config.setConcurrency(2)` rather than a genuinely broken font file (the
exact same font-loading code succeeded across a dozen-plus `remotion
still` invocations while iterating on the composition, and got
substantially further into the full render on the second attempt).
Raising the timeout and racing it against a fallback both failed to fully
resolve it, so the async font-loading step was removed entirely — see the
"Environment" section above for the base64-inline fix that replaced it.

## Render commands

```bash
# Draft (half-resolution, faster, lower quality) — useful for a quick
# end-to-end sanity check of timing/audio/captions before a full render.
npx remotion render src/index.ts USEDCBrandVideo out/usedc-brand-video-draft.mp4 \
  --scale=0.5 --jpeg-quality=70 --concurrency=2

# Final, full-quality render — this is the exact command used for this
# project's delivered MP4.
npx remotion render src/index.ts USEDCBrandVideo out/usedc-brand-video.mp4
```

`remotion.config.ts` sets the codec (H.264), pixel format (yuv420p, for
broad compatibility), CRF (18, visually lossless), and output overwrite
behavior, so the two commands above are all that's needed — no extra
flags required for a standard delivery-quality MP4.

## Verifying final duration

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 out/usedc-brand-video.mp4
```

Expected: `duration=151.0...` (2 minutes 31 seconds), inside the requested
2–3 minute range.
