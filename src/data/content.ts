/**
 * Centralized content + timing configuration for the Armour Building brand
 * film. Every fact, date, on-screen line of copy, and scene duration lives
 * here so the story can be edited without touching any animation/component
 * code. See sources.md for citations behind each fact, and storyboard.md
 * for the scene-by-scene visual plan this file's timings correspond to.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// ---------------------------------------------------------------------------
// Scene timing (seconds). Changing a duration here reflows every scene after
// it automatically — see src/Video.tsx, which derives frame offsets from this
// array rather than hardcoding them.
//
// These durations were set AFTER generating the real narration audio (see
// npm run voiceover:fallback) and reading its measured per-line timing in
// src/data/narration-timing.json, then choosing each scene's cut point a
// beat after that scene's narration finishes — not guessed up front. The
// creative brief's own scene breakdown (0:00–0:20 / 0:20–0:50 / 0:50–1:15 /
// 1:15–2:00, a nominal 2:00 total) undershoots how long the full four-scene
// script actually takes to narrate at a natural, unhurried "premium
// corporate narrator" pace (~2:18 of speech alone). Rather than either
// cutting approved narration copy or rushing the voice to an unnatural
// speaking rate to hit 2:00 exactly, scene durations here follow the real
// audio, landing the finished film at 2:25 — still "approximately two
// minutes" per the brief, just not to the second. See storyboard.md.
// ---------------------------------------------------------------------------
export const SCENES = {
  stockyards: {id: 'stockyards', durationInSeconds: 27},
  armourBuilding: {id: 'armourBuilding', durationInSeconds: 34},
  honoringStructure: {id: 'honoringStructure', durationInSeconds: 33},
  newHome: {id: 'newHome', durationInSeconds: 51},
} as const;

export type SceneKey = keyof typeof SCENES;

export const SCENE_ORDER: SceneKey[] = [
  'stockyards',
  'armourBuilding',
  'honoringStructure',
  'newHome',
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
    sepia: '#3A2A15',
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
// Scene 1 — The Rise of the Fort Worth Stockyards
// ---------------------------------------------------------------------------
export const STOCKYARDS_TEXT = {
  title: 'The Historic Fort Worth Stockyards',
};

// ---------------------------------------------------------------------------
// Scene 2 — The Armour Building
// ---------------------------------------------------------------------------
export const ARMOUR_BUILDING_TEXT = {
  title: 'Preserving History. Building the Future.',
};

// ---------------------------------------------------------------------------
// Scene 3 — Honoring the Original Structure
// ---------------------------------------------------------------------------
export const HONORING_STRUCTURE_TEXT = {
  headline: 'History Preserved',
  beamsSubtitle: 'The Original White Structural Beams',
  fitnessTitle: 'A Place to Grow',
  fitnessSupport:
    'A state-of-the-art fitness center and personal trainer, welcoming Armour Building and U.S. Energy employees alongside the Fort Worth Police Department.',
};

// ---------------------------------------------------------------------------
// Scene 4 — A New Home for U.S. Energy
// ---------------------------------------------------------------------------
export const NEW_HOME_TEXT = {
  locationTag: 'Fort Worth Stockyards Headquarters',
  brandLine: BRAND.name,
  conferenceTitle: 'Elegant Conference Rooms & Event Spaces',
  conferenceSupport: 'Where relationships are built and opportunities take shape.',
  collaborationTitle: 'Investors. Partners. Clients.',
  closingLineOne: 'Honoring Our Past.',
  closingLineTwo: 'Building Our Future.',
  website: BRAND.website,
};

// ---------------------------------------------------------------------------
// This film ships silent, with no on-screen captions — the composition in
// src/Video.tsx renders only the four visual scenes, no <Audio> or
// <Captions> layers. The narration script, its RHVoice synthesis, and the
// measured line timing still live in src/data/narration-lines.json,
// src/data/narration-timing.json, and public/audio/*.mp3 (see
// voiceover-script.txt and README.md) in case audio is added back later,
// but nothing in src/ currently reads them.
// ---------------------------------------------------------------------------
