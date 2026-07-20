import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {SafeVideo} from '../components/SafeMedia';
import {LowerThird} from '../components/LowerThird';
import {TitleCard} from '../components/TitleCard';
import {colors} from '../styles/theme';
import {FOOTAGE, SCENES, STOCKYARDS_TEXT} from '../data/content';

const DURATION = SCENES.stockyards.durationInSeconds * 30; // 630
const RECEPTION_END = 230;
const CROSSFADE = 24;
const MURAL_START = 206;
const MURAL_SPAN = DURATION - MURAL_START; // 424
const MURAL_SOURCE_FRAMES = 226; // ~7.53s clip at 30fps
const MURAL_PLAYBACK_RATE = MURAL_SOURCE_FRAMES / MURAL_SPAN;

export const Scene6Stockyards: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <ReceptionLayer />
      <MuralLayer />
    </SceneFade>
  );
};

const ReceptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [RECEPTION_END - CROSSFADE, RECEPTION_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame > RECEPTION_END) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.hqReceptionReveal.src}
        volume={FOOTAGE.hqReceptionReveal.volume}
        startFrom={0}
        endAt={221}
        label={FOOTAGE.hqReceptionReveal.label}
      />
      <TitleCard title={STOCKYARDS_TEXT.location} appearAt={24} align="left" accent="gold" />
    </AbsoluteFill>
  );
};

const MuralLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - MURAL_START;
  const opacity = interpolate(local, [-CROSSFADE, 0], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame < MURAL_START - CROSSFADE) return null;

  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.elevatorArchivalMural.src}
        volume={FOOTAGE.elevatorArchivalMural.volume}
        startFrom={0}
        endAt={MURAL_SPAN}
        playbackRate={MURAL_PLAYBACK_RATE}
        label={FOOTAGE.elevatorArchivalMural.label}
      />
      <LowerThird
        title={STOCKYARDS_TEXT.headline}
        appearAt={MURAL_START + 60}
        holdFrames={DURATION - MURAL_START - 60 - 30}
      />
    </AbsoluteFill>
  );
};
