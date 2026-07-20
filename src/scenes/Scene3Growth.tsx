import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneFade} from '../components/Transition';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {Timeline} from '../components/Timeline';
import {colors} from '../styles/theme';
import {SCENES, STILL_IMAGES, TIMELINE_MILESTONES} from '../data/content';

const DURATION = SCENES.growth.durationInSeconds * 30;
// 4 milestones spread evenly with room to breathe before the scene ends.
const FRAME_STEP = Math.floor((DURATION - 60) / TIMELINE_MILESTONES.length);

export const Scene3Growth: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <KenBurnsBackground
        src={STILL_IMAGES.bgArmourExterior}
        durationInFrames={DURATION}
        direction="out"
      />
      <Timeline milestones={TIMELINE_MILESTONES} frameStep={FRAME_STEP} appearAt={0} />
    </SceneFade>
  );
};
