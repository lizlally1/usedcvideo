import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {SafeVideo} from '../components/SafeMedia';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {TitleCard} from '../components/TitleCard';
import {colors} from '../styles/theme';
import {ARMOUR_BUILDING_TEXT, FOOTAGE, SCENES, STILL_IMAGES} from '../data/content';

const DURATION = SCENES.armourBuilding.durationInSeconds * 30; // 1020
const EXTERIOR_END = 155; // full armour-exterior clip, ~5.2s — fade-out
// completes exactly as the source clip ends, so <SafeVideo>'s validity
// window (which OffthreadVideo derives from startFrom/endAt) never has to
// hold past the last real frame of footage.
const CROSSFADE = 24;

/**
 * No construction/renovation-in-progress or craftsmen-at-work footage was
 * provided, so the real exterior clip (brick facade, entrance canopy)
 * carries the "constructed with remarkable craftsmanship" beat, then a warm,
 * brick-toned still of the same building carries the renovation/craftsmen
 * narration for the rest of the scene. See media-inventory.md.
 */
export const Scene2ArmourBuilding: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <ExteriorVideoLayer />
      <BrickStillLayer />
      <TitleCard
        title={ARMOUR_BUILDING_TEXT.title}
        appearAt={520}
        holdFrames={460}
        accent="red"
      />
    </SceneFade>
  );
};

const ExteriorVideoLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [EXTERIOR_END - CROSSFADE, EXTERIOR_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame > EXTERIOR_END) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.armourExterior.src}
        volume={FOOTAGE.armourExterior.volume}
        startFrom={0}
        endAt={155}
        label={FOOTAGE.armourExterior.label}
      />
    </AbsoluteFill>
  );
};

const BrickStillLayer: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < EXTERIOR_END - CROSSFADE) return null;
  return (
    <KenBurnsBackground
      src={STILL_IMAGES.bgArmourExterior}
      durationInFrames={DURATION}
      direction="out"
      overlayColor={colors.red}
      tintOpacity={0.28}
      layerOpacity={0.8}
      filter="blur(3px) saturate(1.15) sepia(0.15)"
    />
  );
};
