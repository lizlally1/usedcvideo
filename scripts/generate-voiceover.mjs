#!/usr/bin/env node
/**
 * Generates public/audio/voiceover.mp3 from voiceover-script.txt using
 * whichever real TTS provider is configured via environment variables
 * (see .env.example). No API key is ever hard-coded here.
 *
 * Supported providers (set VOICEOVER_PROVIDER):
 *   - "elevenlabs" : ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
 *   - "openai"     : OPENAI_API_KEY, OPENAI_TTS_VOICE
 *   - "polly"      : AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, POLLY_VOICE_ID
 *   - "none"       : prints instructions and exits without producing audio
 *
 * Usage:
 *   cp .env.example .env   # then fill in one provider's keys
 *   npm run voiceover
 *
 * If you have no API key available, either:
 *   1) run `npm run voiceover:fallback` for an offline placeholder voice, or
 *   2) manually drop a finished narration file at public/audio/voiceover.mp3
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCRIPT_PATH = path.join(ROOT, 'voiceover-script.txt');
const OUTPUT_PATH = path.join(ROOT, 'public', 'audio', 'voiceover.mp3');

// Minimal .env loader (no dependency on dotenv package).
function loadEnvFile() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function extractNarrationOnly(rawScript) {
  // Strip section headers/comment lines, keep only the spoken lines.
  return rawScript
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (t.startsWith('---')) return false;
      if (t.startsWith('U.S. ENERGY')) return false;
      if (t.startsWith('VOICEOVER SCRIPT')) return false;
      if (t.startsWith('Target runtime')) return false;
      if (t.startsWith('Voice direction')) return false;
      if (t.startsWith('No announcer')) return false;
      if (/^SCENE \d/.test(t)) return false;
      if (t === '[END]') return false;
      return true;
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  loadEnvFile();
  const provider = (process.env.VOICEOVER_PROVIDER || 'none').toLowerCase();

  if (!fs.existsSync(SCRIPT_PATH)) {
    console.error(`Cannot find ${SCRIPT_PATH}`);
    process.exit(1);
  }
  const narration = extractNarrationOnly(fs.readFileSync(SCRIPT_PATH, 'utf-8'));

  if (provider === 'none') {
    console.log(`
No VOICEOVER_PROVIDER configured (.env has VOICEOVER_PROVIDER=none or is missing).

This project supports ElevenLabs, OpenAI TTS, and Amazon Polly. To generate the
final narration:
  1. cp .env.example .env
  2. Set VOICEOVER_PROVIDER to "elevenlabs", "openai", or "polly"
  3. Fill in that provider's credentials in .env
  4. Re-run: npm run voiceover

In the meantime, you can:
  - Run "npm run voiceover:fallback" for an offline placeholder voice
    (espeak-ng), or
  - Manually place a finished narration file at public/audio/voiceover.mp3
`);
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), {recursive: true});

  if (provider === 'elevenlabs') {
    await generateElevenLabs(narration);
  } else if (provider === 'openai') {
    await generateOpenAI(narration);
  } else if (provider === 'polly') {
    await generatePolly(narration);
  } else {
    console.error(`Unknown VOICEOVER_PROVIDER "${provider}". Use elevenlabs | openai | polly | none.`);
    process.exit(1);
  }
}

async function generateElevenLabs(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env');
    process.exit(1);
  }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {stability: 0.45, similarity_boost: 0.75},
    }),
  });
  if (!res.ok) {
    console.error(`ElevenLabs error: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Wrote ${OUTPUT_PATH} via ElevenLabs.`);
}

async function generateOpenAI(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  const voice = process.env.OPENAI_TTS_VOICE || 'onyx';
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY in .env');
    process.exit(1);
  }
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      format: 'mp3',
    }),
  });
  if (!res.ok) {
    console.error(`OpenAI TTS error: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Wrote ${OUTPUT_PATH} via OpenAI TTS.`);
}

async function generatePolly(text) {
  // Uses the AWS SDK v3 client for Polly if installed. Kept as an optional
  // peer dependency so the base project doesn't require the AWS SDK unless
  // Polly is actually used.
  let PollyClient, SynthesizeSpeechCommand;
  try {
    ({PollyClient, SynthesizeSpeechCommand} = await import('@aws-sdk/client-polly'));
  } catch (e) {
    console.error(
      'Amazon Polly requires the AWS SDK. Install it first:\n  npm install @aws-sdk/client-polly',
    );
    process.exit(1);
  }
  const client = new PollyClient({region: process.env.AWS_REGION || 'us-east-1'});
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: process.env.POLLY_VOICE_ID || 'Matthew',
    Engine: 'neural',
  });
  const response = await client.send(command);
  const chunks = [];
  for await (const chunk of response.AudioStream) chunks.push(chunk);
  fs.writeFileSync(OUTPUT_PATH, Buffer.concat(chunks));
  console.log(`Wrote ${OUTPUT_PATH} via Amazon Polly.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
