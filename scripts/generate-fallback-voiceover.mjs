#!/usr/bin/env node
/**
 * Offline placeholder narration generator using RHVoice + ffmpeg.
 *
 * IMPORTANT: RHVoice (like espeak-ng) is a synthetic-sounding voice. It is
 * NOT a substitute for a real neural TTS provider (ElevenLabs, OpenAI TTS,
 * Amazon Polly) when the goal is a genuinely human-sounding narration —
 * see scripts/generate-voiceover.mjs and README.md for that path once an
 * API key is available. This script exists purely so the project has
 * *some* correctly-timed spoken narration to preview/render with when no
 * such key is configured.
 *
 * Each line in src/data/narration-lines.json is synthesized separately,
 * its ACTUAL rendered duration is measured with ffprobe, and lines are
 * placed sequentially (previous line's end + a fixed pause) rather than
 * at hand-authored guessed timestamps. This is a hard requirement, not a
 * style choice: an earlier version of this script used fixed timestamps
 * that didn't match this voice's real speaking duration, and three lines
 * ended up overlapping the next line's start — i.e. two lines of
 * narration audibly playing over each other. Computing timing from the
 * real synthesized audio makes that class of bug impossible.
 *
 * The computed timing is written to src/data/narration-timing.json, which
 * src/data/content.ts imports directly for the CAPTIONS track — so
 * captions are always in sync with whatever audio this script most
 * recently produced. voiceover-timestamps.txt is regenerated too.
 *
 * Requires `RHVoice-test` and `ffmpeg` on PATH
 * (apt install rhvoice rhvoice-english).
 */

import {execSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LINES_PATH = path.join(ROOT, 'src', 'data', 'narration-lines.json');
const TIMING_OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'narration-timing.json');
const AUDIO_OUTPUT_PATH = path.join(ROOT, 'public', 'audio', 'voiceover.mp3');
const TIMESTAMPS_TXT_PATH = path.join(ROOT, 'voiceover-timestamps.txt');

const TOTAL_DURATION_SECONDS = Number(process.env.VO_TOTAL_SECONDS || 240);
const VOICE = 'bdl'; // US English male
const SAMPLE_RATE = 24000;
const LEAD_IN_SECONDS = 2.0; // silence before the first line starts
const GAP_SECONDS = 0.5; // breathing room between consecutive lines
const RATE = Number(process.env.VO_RATE || 105); // RHVoice speaking rate, 100 = normal

function sh(cmd) {
  return execSync(cmd, {stdio: ['ignore', 'pipe', 'inherit']}).toString();
}

function ffprobeDuration(file) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`,
  ).toString();
  return parseFloat(out);
}

function main() {
  for (const bin of ['RHVoice-test', 'ffmpeg', 'ffprobe']) {
    try {
      execSync(`which ${bin}`, {stdio: 'ignore'});
    } catch {
      console.error(`Required tool "${bin}" not found on PATH.`);
      console.error('Install with: apt-get install -y rhvoice rhvoice-english ffmpeg');
      process.exit(1);
    }
  }

  const lines = JSON.parse(fs.readFileSync(LINES_PATH, 'utf-8'));
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'usedc-vo-'));

  let cursor = LEAD_IN_SECONDS;
  const timing = [];
  const wavFiles = [];

  lines.forEach((line, i) => {
    const txtPath = path.join(tmpDir, `line-${i}.txt`);
    const wavPath = path.join(tmpDir, `line-${i}.wav`);
    fs.writeFileSync(txtPath, line.text, 'utf-8');
    sh(`RHVoice-test -p ${VOICE} -R ${SAMPLE_RATE} -r ${RATE} -i "${txtPath}" -o "${wavPath}"`);

    const duration = ffprobeDuration(wavPath);
    const start = cursor;
    const end = start + duration;
    timing.push({start: round2(start), end: round2(end), text: line.text});
    wavFiles.push(wavPath);
    cursor = end + GAP_SECONDS;
  });

  const finalEnd = timing[timing.length - 1].end;
  if (finalEnd > TOTAL_DURATION_SECONDS - 1) {
    console.error(
      `Narration (ends at ${finalEnd.toFixed(1)}s) doesn't fit inside the ${TOTAL_DURATION_SECONDS}s video with a 1s safety margin. Shorten the script or lengthen the video.`,
    );
    process.exit(1);
  }

  // Each line gets adelay'd to its own computed (non-overlapping-by-construction) start time.
  const inputs = wavFiles.map((f) => `-i "${f}"`).join(' ');
  const delayFilters = timing
    .map((t, i) => `[${i}:a]adelay=${Math.round(t.start * 1000)}|${Math.round(t.start * 1000)}[a${i}]`)
    .join(';');
  const mixInputs = timing.map((_, i) => `[a${i}]`).join('');
  const filterComplex = `${delayFilters};${mixInputs}amix=inputs=${timing.length}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,apad=whole_dur=${TOTAL_DURATION_SECONDS}[out]`;

  fs.mkdirSync(path.dirname(AUDIO_OUTPUT_PATH), {recursive: true});
  sh(
    `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[out]" -t ${TOTAL_DURATION_SECONDS} -ar 44100 -b:a 160k "${AUDIO_OUTPUT_PATH}"`,
  );

  fs.writeFileSync(TIMING_OUTPUT_PATH, JSON.stringify(timing, null, 2) + '\n');
  fs.writeFileSync(TIMESTAMPS_TXT_PATH, renderTimestampsTxt(timing));
  fs.rmSync(tmpDir, {recursive: true, force: true});

  console.log(`Wrote placeholder narration to ${AUDIO_OUTPUT_PATH} (ends at ${finalEnd.toFixed(1)}s, no overlaps).`);
  console.log(`Wrote caption timing to ${TIMING_OUTPUT_PATH} (src/data/content.ts imports this for CAPTIONS).`);
  console.log(`Wrote ${TIMESTAMPS_TXT_PATH}.`);
  console.log('Reminder: RHVoice is an offline placeholder voice, not a human-sounding neural narration.');
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(2).padStart(5, '0');
  return `${String(m).padStart(2, '0')}:${s}`;
}

function renderTimestampsTxt(timing) {
  const header = `U.S. ENERGY DEVELOPMENT CORPORATION — VOICEOVER TIMESTAMPS
Auto-generated by scripts/generate-fallback-voiceover.mjs from the ACTUAL
synthesized audio (RHVoice "bdl") — every line's start/end below is the
real timing baked into public/audio/voiceover.mp3, not an estimate. If you
swap in a different narration file, re-run whichever generator script
produced it so this file and src/data/narration-timing.json (which drives
the on-screen CAPTIONS track) stay in sync with the actual audio.

`;
  const body = timing
    .map((t) => `[${fmtTime(t.start)} - ${fmtTime(t.end)}]  ${t.text}`)
    .join('\n\n');
  return header + body + '\n';
}

main();
