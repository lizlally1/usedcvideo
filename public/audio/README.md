# public/audio

This folder holds the two audio layers the composition expects:

- `voiceover.mp3` — the narration track (see voiceover-script.txt at the
  project root). Generate it with `npm run voiceover` (real TTS provider,
  configured via `.env`) or `npm run voiceover:fallback` (offline RHVoice
  placeholder), or drop in a manually produced/recorded file.
- `music.mp3` — the background instrumental bed. Generate a synthesized
  placeholder with `npm run music:placeholder`, or replace with a real
  licensed/royalty-free soft orchestral/cinematic track with the gradual
  build the creative brief calls for.

Both files are git-ignored by default under `public/audio/*.tmp.*`; the
committed files in this repo are the generated placeholders described
above (clearly not final, production-quality assets) so the project
renders end-to-end out of the box. Swap them for final assets before
treating a render as a finished deliverable.
