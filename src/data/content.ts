/**
 * Centralized content + timing configuration for the U.S. Energy brand video.
 *
 * Every fact, date, statistic, and on-screen line of copy lives here so the
 * story can be edited without touching any animation/component code. See
 * sources.md for citations behind each fact, and storyboard.md for the
 * scene-by-scene visual plan this file's timings correspond to.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// ---------------------------------------------------------------------------
// Scene timing (seconds). Changing a duration here reflows every scene after
// it automatically — see src/Video.tsx, which derives frame offsets from this
// array rather than hardcoding them.
// ---------------------------------------------------------------------------
export const SCENES = {
  opening: {id: 'opening', durationInSeconds: 12},
  beginning: {id: 'beginning', durationInSeconds: 21},
  growth: {id: 'growth', durationInSeconds: 24},
  success: {id: 'success', durationInSeconds: 22},
  people: {id: 'people', durationInSeconds: 32},
  stockyards: {id: 'stockyards', durationInSeconds: 21},
  conclusion: {id: 'conclusion', durationInSeconds: 19},
} as const;

export type SceneKey = keyof typeof SCENES;

export const SCENE_ORDER: SceneKey[] = [
  'opening',
  'beginning',
  'growth',
  'success',
  'people',
  'stockyards',
  'conclusion',
];

export const TOTAL_DURATION_IN_SECONDS = SCENE_ORDER.reduce(
  (sum, key) => sum + SCENES[key].durationInSeconds,
  0,
);
export const TOTAL_DURATION_IN_FRAMES = Math.round(
  TOTAL_DURATION_IN_SECONDS * FPS,
);

/** Cross-dissolve length used between most scenes, in frames. */
export const TRANSITION_FRAMES = 24;

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------
export const BRAND = {
  name: 'U.S. Energy Development Corporation',
  shortName: 'U.S. Energy',
  website: 'usedc.com',
  colors: {
    navy: '#00012A',
    navyLight: '#0B1240',
    red: '#82171A',
    gold: '#C7A35A',
    white: '#F7F5F1',
    cream: '#EDE7DC',
    gray: '#9AA0B4',
  },
  fonts: {
    display: 'Oswald', // condensed display font — titles, dates, big numbers
    body: 'Inter', // clean sans-serif — supporting text, captions
  },
} as const;

// ---------------------------------------------------------------------------
// Footage manifest — filenames match public/footage/*.mp4 (see
// media-inventory.md for full detail on each clip).
//
// All original camera audio has been physically stripped from these files
// (re-muxed with `ffmpeg -an`, video-only streams — see render-notes.md).
// `volume` is kept at 0 for every clip as a defensive no-op / documentation
// of intent, not because it's doing any actual muting.
// ---------------------------------------------------------------------------
export const FOOTAGE = {
  armourExterior: {
    src: 'footage/armour-exterior.mp4',
    label: 'Armour Building exterior + employee walk-up',
    volume: 0,
  },
  hqReceptionReveal: {
    src: 'footage/hq-reception-reveal.mp4',
    label: 'Walk-in reveal of branded HQ reception nook',
    volume: 0,
  },
  elevatorArchivalMural: {
    src: 'footage/elevator-archival-mural.mp4',
    label: 'Elevator doors open on Armour & Company archival mural',
    volume: 0,
  },
  coreValuesWall: {
    src: 'footage/core-values-wall.mp4',
    label: 'Slow push across the physical Core Values wall',
    volume: 0,
  },
  officeCultureHoops: {
    src: 'footage/office-culture-hoops.mp4',
    label: 'Employees playing + laughing in the open office',
    volume: 0,
  },
} as const;

export const STILL_IMAGES = {
  bgOffice: 'images/bg-office.jpg',
  bgArmourExterior: 'images/bg-armour-exterior.jpg',
  bgHqReception: 'images/bg-hq-reception.jpg',
  bgArchivalMural: 'images/bg-archival-mural.jpg',
} as const;

// ---------------------------------------------------------------------------
// Scene 1 — Opening
// ---------------------------------------------------------------------------
export const OPENING_TEXT = {
  title: "Built on Experience. Driven by What's Next.",
  subtitle: 'U.S. Energy Development Corporation',
};

// ---------------------------------------------------------------------------
// Scene 2 — The Beginning
// ---------------------------------------------------------------------------
export const BEGINNING_TEXT = {
  year: '1980',
  headline: 'A Family Vision Takes Shape',
};

// ---------------------------------------------------------------------------
// Scene 3 — Growth Through the Decades
// ---------------------------------------------------------------------------
export const TIMELINE_MILESTONES = [
  {year: '1985', label: 'Appalachian Development'},
  {year: '1990s', label: 'Multi-State Expansion'},
  {year: '2014', label: 'Second-Generation Leadership'},
  {year: '2015', label: 'Growth in Texas'},
] as const;

// ---------------------------------------------------------------------------
// Scene 4 — Success and Experience
// ---------------------------------------------------------------------------
export const STATISTICS = [
  {value: '~4,000', label: 'Wells'},
  {value: '13 States', label: '+ Canada'},
  {value: 'Billions', label: 'Deployed for Partners'},
] as const;

export const TRANSFORMATIONAL_YEAR_TEXT = {
  year: '2025',
  headline: 'A Transformational Year',
  subhead: 'Largest Acquisition in Company History',
};

// ---------------------------------------------------------------------------
// Scene 5 — The People and Core Values
// ---------------------------------------------------------------------------
export const CORE_VALUES = [
  {
    name: 'Collaborative',
    support: 'Strong partnerships begin with strong teams.',
  },
  {
    name: 'Trustworthy & Sincere',
    support: 'A reputation built one relationship at a time.',
  },
  {
    name: 'Innovative',
    support: 'Smarter ways to develop every project.',
  },
  {
    name: 'Passionate & Driven',
    support: 'The work is personal, not just professional.',
  },
] as const;

// ---------------------------------------------------------------------------
// Scene 6 — The Fort Worth Stockyards
// ---------------------------------------------------------------------------
export const STOCKYARDS_TEXT = {
  location: 'Fort Worth, Texas',
  headline: 'A New Headquarters. The Next Chapter.',
};

// ---------------------------------------------------------------------------
// Scene 7 — Conclusion
// ---------------------------------------------------------------------------
export const CONCLUSION_TEXT = {
  years: '45+ Years of Energy and Impact',
  lineOne: 'Experience Behind Us.',
  lineTwo: 'Opportunity Ahead.',
  website: BRAND.website,
};

// ---------------------------------------------------------------------------
// Captions — optional closed-captions track, toggled via CAPTIONS_ENABLED.
//
// Timing is imported from src/data/narration-timing.json rather than
// hand-authored here. That file is generated by whichever script most
// recently produced public/audio/voiceover.mp3 (scripts/generate-voiceover.mjs
// for a real TTS provider, or scripts/generate-fallback-voiceover.mjs for the
// offline placeholder) from the ACTUAL measured duration of each synthesized
// line — never from guessed timestamps. This guarantees captions always
// match the real audio and that consecutive lines can never overlap.
//
// Regenerate the audio (npm run voiceover / voiceover:fallback) any time the
// text in src/data/narration-lines.json changes; both scripts rewrite this
// JSON and voiceover-timestamps.txt together.
// ---------------------------------------------------------------------------
import narrationTiming from './narration-timing.json';

export const CAPTIONS_ENABLED = true;

export const CAPTIONS: {start: number; end: number; text: string}[] = narrationTiming;

// ---------------------------------------------------------------------------
// Music mix — see public/audio/README.md for how to swap the placeholder.
// ---------------------------------------------------------------------------
export const AUDIO = {
  voiceoverSrc: 'audio/voiceover.mp3',
  musicSrc: 'audio/music.mp3',
  musicVolumeDb: -15, // ~12-18dB under narration per brief
  musicDuckedVolumeDb: -22,
};
