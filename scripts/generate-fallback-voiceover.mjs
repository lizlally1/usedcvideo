#!/usr/bin/env node
/**
 * Offline placeholder narration generator using espeak-ng + ffmpeg.
 *
 * This is NOT the final voice. It exists so the project has *some* spoken
 * narration to preview/render with when no ElevenLabs / OpenAI / Polly API
 * key is available (see scripts/generate-voiceover.mjs for the real path).
 * The brief explicitly calls for a "standard, realistic AI narration" —
 * espeak-ng does not meet that bar on its own. Replace
 * public/audio/voiceover.mp3 with a real provider's output (or a manually
 * recorded/produced file) before this is used as a final deliverable.
 *
 * Requires `espeak-ng` and `ffmpeg` on PATH.
 *
 * Lines + timestamps mirror src/data/content.ts CAPTIONS exactly — if you
 * change the narration timing there, update LINES below to match (and vice
 * versa), so captions and this fallback stay in sync.
 */

import {execSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'public', 'audio', 'voiceover.mp3');
const TOTAL_DURATION_SECONDS = 151;

const LINES = [
  {start: 3.0, text: 'Some companies are built overnight. Others are built over decades. One well, one partnership, one decision at a time.'},
  {start: 9.5, text: 'This is one of those stories.'},
  {start: 13.0, text: 'In nineteen eighty, U S Energy Development Corporation started as a family vision. A small operator working the Appalachian basin out of Buffalo, New York.'},
  {start: 22.0, text: 'Built on hard work. And a simple belief. Treat people right, manage risk wisely, and a good idea can grow into something lasting.'},
  {start: 33.0, text: 'That belief carried the company forward. Through the eighties and nineties, U S Energy expanded into Texas, Louisiana, Kansas, and beyond.'},
  {start: 43.5, text: 'In twenty fourteen, a second generation of leadership stepped in. By twenty fifteen, growth had carried the company to Texas, right as one of the most transformative eras in American energy was taking shape.'},
  {start: 57.5, text: 'Today, that experience speaks for itself.'},
  {start: 61.0, text: 'U S Energy has invested in, operated, or drilled nearly four thousand wells across thirteen states and Canada. Deploying billions on behalf of the company and its partners.'},
  {start: 74.0, text: 'And in twenty twenty five, the company completed the largest acquisition in its history.'},
  {start: 79.0, text: "But growth was never the whole story. Ask anyone here, and they'll tell you. It's the people."},
  {start: 86.0, text: "It's a team that shows up for each other. Collaborative. Sincere. Driven to do the work right."},
  {start: 95.0, text: 'Investors come first. Partners are treated like family. And every deal, every well, every decision reflects the same values that have guided this company since day one.'},
  {start: 111.0, text: 'In twenty twenty five, that history found a new home. U S Energy moved its headquarters into the historic Armour Building, in the Fort Worth Stockyards.'},
  {start: 121.5, text: 'A building with its own story of resilience. For a company that has never forgotten where it came from.'},
  {start: 132.0, text: "Forty five years in, U S Energy is still doing what it's always done. Backing good people, taking calculated risks, and building for what's next."},
  {start: 143.0, text: 'The experience is behind them.'},
  {start: 147.5, text: 'The opportunity is just getting started.'},
];

function sh(cmd) {
  execSync(cmd, {stdio: ['ignore', 'pipe', 'inherit']});
}

function main() {
  for (const bin of ['espeak-ng', 'ffmpeg']) {
    try {
      execSync(`which ${bin}`, {stdio: 'ignore'});
    } catch {
      console.error(`Required tool "${bin}" not found on PATH.`);
      process.exit(1);
    }
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'usedc-vo-'));
  const wavFiles = [];

  LINES.forEach((line, i) => {
    const wavPath = path.join(tmpDir, `line-${i}.wav`);
    // -s 152: words/min, calm-ish pace. -p 45: slightly lower pitch.
    sh(
      `espeak-ng -v en-us -s 152 -p 45 -g 8 -w "${wavPath}" "${line.text.replace(/"/g, '\\"')}"`,
    );
    wavFiles.push(wavPath);
  });

  // Build one ffmpeg filter graph: delay each line to its start time (ms),
  // then mix all delayed lines together into a single track of the full
  // composition length.
  const inputs = wavFiles.map((f) => `-i "${f}"`).join(' ');
  const delayFilters = LINES.map(
    (line, i) => `[${i}:a]adelay=${Math.round(line.start * 1000)}|${Math.round(line.start * 1000)},volume=1.6[a${i}]`,
  ).join(';');
  const mixInputs = LINES.map((_, i) => `[a${i}]`).join('');
  const filterComplex = `${delayFilters};${mixInputs}amix=inputs=${LINES.length}:normalize=0,apad=whole_dur=${TOTAL_DURATION_SECONDS}[out]`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), {recursive: true});
  sh(
    `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[out]" -t ${TOTAL_DURATION_SECONDS} -ar 44100 -b:a 160k "${OUTPUT_PATH}"`,
  );

  fs.rmSync(tmpDir, {recursive: true, force: true});
  console.log(`Wrote placeholder narration to ${OUTPUT_PATH}`);
  console.log('Reminder: this is an offline espeak-ng placeholder voice, not the final narration.');
}

main();
