import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {SafeVideo} from '../components/SafeMedia';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {TitleCard} from '../components/TitleCard';
import {colors} from '../styles/theme';
import {FOOTAGE, SCENES, STILL_IMAGES, STOCKYARDS_TEXT} from '../data/content';

const DURATION = SCENES.stockyards.durationInSeconds * 30; // 810
const MURAL_END = 226; // full archival-mural clip, ~7.5s — fade-out completes
// exactly as the source clip ends, so <SafeVideo>'s validity window (which
// OffthreadVideo derives from startFrom/endAt) never has to hold past the
// last real frame of footage.
const CROSSFADE = 24;

/**
 * No drone, railroad, longhorn, or period-map footage was provided for this
 * scene per the creative brief's suggested B-roll — the only genuinely
 * archival-feeling asset on hand is the elevator-mural clip filmed at the
 * actual HQ (a black-and-white "ARMOUR & COMPANY" photo mural over the old
 * stockyards/meatpacking complex), so it opens the film, then a stills-based
 * sepia treatment of the same image carries the historic mood for the rest
 * of the scene. See media-inventory.md.
 */
export const Scene1Stockyards: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION} mode="dip" transitionFrames={20}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <MuralVideoLayer />
      <SepiaStillLayer />
      <TitleCard title={STOCKYARDS_TEXT.title} appearAt={60} holdFrames={230} />
    </SceneFade>
  );
};

const MuralVideoLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [MURAL_END - CROSSFADE, MURAL_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame > MURAL_END) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.elevatorArchivalMural.src}
        volume={FOOTAGE.elevatorArchivalMural.volume}
        startFrom={0}
        endAt={226}
        label={FOOTAGE.elevatorArchivalMural.label}
      />
    </AbsoluteFill>
  );
};

const SepiaStillLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - (MURAL_END - CROSSFADE);
  if (local < 0) return null;
  return (
    <KenBurnsBackground
      src={STILL_IMAGES.bgArchivalMural}
      durationInFrames={DURATION - (MURAL_END - CROSSFADE)}
      direction="in"
      overlayColor={colors.sepia}
      tintOpacity={0.4}
      layerOpacity={0.85}
      filter="blur(3px) sepia(0.65) saturate(1.15) contrast(1.05)"
    />
  );
};
