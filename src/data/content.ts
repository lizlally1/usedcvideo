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
// Timecodes are in seconds from the start of the whole composition and are
// authored from voiceover-timestamps.txt. Update both files together if the
// narration timing changes after a real recording is dropped in.
// ---------------------------------------------------------------------------
export const CAPTIONS_ENABLED = true;

export const CAPTIONS: {start: number; end: number; text: string}[] = [
  {start: 3.0, end: 9.4, text: 'Some companies are built overnight. Others are built over decades — one well, one partnership, one decision at a time.'},
  {start: 9.5, end: 12.5, text: 'This is one of those stories.'},
  {start: 13.0, end: 21.8, text: 'In 1980, U.S. Energy Development Corporation started as a family vision — a small operator working the Appalachian basin out of Buffalo, New York.'},
  {start: 22.0, end: 32.5, text: 'Built on hard work. And a simple belief: treat people right, manage risk wisely, and a good idea can grow into something lasting.'},
  {start: 33.0, end: 43.2, text: 'That belief carried the company forward. Through the eighties and nineties, U.S. Energy expanded into Texas, Louisiana, Kansas, and beyond.'},
  {start: 43.5, end: 56.5, text: "In 2014, a second generation of leadership stepped in. By 2015, growth had carried the company to Texas — right as one of the most transformative eras in American energy was taking shape."},
  {start: 57.5, end: 60.8, text: 'Today, that experience speaks for itself.'},
  {start: 61.0, end: 73.5, text: "U.S. Energy has invested in, operated, or drilled nearly four thousand wells across thirteen states and Canada — deploying billions on behalf of the company and its partners."},
  {start: 74.0, end: 78.5, text: 'And in 2025, the company completed the largest acquisition in its history.'},
  {start: 79.0, end: 85.8, text: "But growth was never the whole story. Ask anyone here, and they'll tell you — it's the people."},
  {start: 86.0, end: 94.5, text: "It's a team that shows up for each other. Collaborative. Sincere. Driven to do the work right."},
  {start: 95.0, end: 109.5, text: 'Investors come first. Partners are treated like family. And every deal, every well, every decision reflects the same values that have guided this company since day one.'},
  {start: 111.0, end: 121.0, text: "In 2025, that history found a new home. U.S. Energy moved its headquarters into the historic Armour Building, in the Fort Worth Stockyards."},
  {start: 121.5, end: 131.0, text: 'A building with its own story of resilience — for a company that has never forgotten where it came from.'},
  {start: 132.0, end: 142.5, text: "Forty-five years in, U.S. Energy is still doing what it's always done: backing good people, taking calculated risks, and building for what's next."},
  {start: 143.0, end: 147.0, text: 'The experience is behind them.'},
  {start: 147.5, end: 151.0, text: 'The opportunity is just getting started.'},
];

// ---------------------------------------------------------------------------
// Music mix — see public/audio/README.md for how to swap the placeholder.
// ---------------------------------------------------------------------------
export const AUDIO = {
  voiceoverSrc: 'audio/voiceover.mp3',
  musicSrc: 'audio/music.mp3',
  musicVolumeDb: -15, // ~12-18dB under narration per brief
  musicDuckedVolumeDb: -22,
};
