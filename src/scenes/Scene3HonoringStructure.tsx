import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {LowerThird} from '../components/LowerThird';
import {TitleCard} from '../components/TitleCard';
import {colors} from '../styles/theme';
import {HONORING_STRUCTURE_TEXT, SCENES, STILL_IMAGES} from '../data/content';

const DURATION = SCENES.honoringStructure.durationInSeconds * 30; // 990

/**
 * No footage of the original structural beams, the fitness center, the
 * personal trainer, or Fort Worth Police Department members using the
 * facility was provided with this project's uploads, so this scene is
 * intentionally graphics-forward — a warm, tinted still of the HQ interior
 * carries the visual texture while the two feature callouts below narrate
 * what the brief describes. See media-inventory.md and README.md.
 */
export const Scene3HonoringStructure: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <KenBurnsBackground
        src={STILL_IMAGES.bgHqReception}
        durationInFrames={DURATION}
        direction="in"
        overlayColor={colors.gold}
        tintOpacity={0.32}
        layerOpacity={0.75}
      />
      <BeamsHeadline />
      <FitnessCallout />
    </SceneFade>
  );
};

const BeamsHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [40, 60, 500, 530], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <TitleCard
        title={HONORING_STRUCTURE_TEXT.headline}
        subtitle={HONORING_STRUCTURE_TEXT.beamsSubtitle}
        appearAt={40}
      />
    </AbsoluteFill>
  );
};

const FitnessCallout: React.FC = () => {
  return (
    <LowerThird
      title={HONORING_STRUCTURE_TEXT.fitnessTitle}
      support={HONORING_STRUCTURE_TEXT.fitnessSupport}
      appearAt={560}
      holdFrames={380}
    />
  );
};
