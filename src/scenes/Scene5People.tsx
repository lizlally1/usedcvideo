import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {SafeVideo} from '../components/SafeMedia';
import {LowerThird} from '../components/LowerThird';
import {colors} from '../styles/theme';
import {CORE_VALUES, FOOTAGE, SCENES} from '../data/content';

const DURATION = SCENES.people.durationInSeconds * 30; // 960

const OFFICE_END = 185;
const CROSSFADE = 24;
const WALL_START = 209;
const WALL_END = DURATION; // 960
const WALL_SPAN = WALL_END - WALL_START; // 751
const WALL_SOURCE_FRAMES = 309; // ~10.3s clip at 30fps
const WALL_PLAYBACK_RATE = WALL_SOURCE_FRAMES / WALL_SPAN;

// Three roughly-equal on-screen windows as the single continuous camera
// push across the values wall brings each plaque into frame.
const WALL_WINDOW = Math.floor(WALL_SPAN / 3);

export const Scene5People: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <OfficeLayer />
      <ValuesWallLayer />
    </SceneFade>
  );
};

const OfficeLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [OFFICE_END - CROSSFADE, OFFICE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame > OFFICE_END) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.officeCultureHoops.src}
        volume={FOOTAGE.officeCultureHoops.volume}
        startFrom={0}
        endAt={185}
        label={FOOTAGE.officeCultureHoops.label}
      />
      <LowerThird
        title={CORE_VALUES[0].name}
        support={CORE_VALUES[0].support}
        appearAt={30}
        holdFrames={130}
      />
    </AbsoluteFill>
  );
};

const ValuesWallLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - WALL_START;
  const opacity = interpolate(local, [-CROSSFADE, 0], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame < WALL_START - CROSSFADE) return null;

  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.coreValuesWall.src}
        volume={FOOTAGE.coreValuesWall.volume}
        startFrom={0}
        endAt={WALL_SPAN}
        playbackRate={WALL_PLAYBACK_RATE}
        label={FOOTAGE.coreValuesWall.label}
      />
      {[1, 2, 3].map((valueIdx, i) => (
        <LowerThird
          key={CORE_VALUES[valueIdx].name}
          title={CORE_VALUES[valueIdx].name}
          support={CORE_VALUES[valueIdx].support}
          appearAt={WALL_START + i * WALL_WINDOW}
          holdFrames={WALL_WINDOW - 30}
        />
      ))}
    </AbsoluteFill>
  );
};
