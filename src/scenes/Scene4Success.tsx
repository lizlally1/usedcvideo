import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {StatisticRow} from '../components/Statistic';
import {colors, fonts} from '../styles/theme';
import {SCENES, STATISTICS, STILL_IMAGES, TRANSFORMATIONAL_YEAR_TEXT} from '../data/content';

const DURATION = SCENES.success.durationInSeconds * 30;
const STATS_END = 420; // frames 0-420 show the statistic row
const YEAR_START = 400;

export const Scene4Success: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <KenBurnsBackground
        src={STILL_IMAGES.bgHqReception}
        durationInFrames={DURATION}
        direction="in"
        tintOpacity={0.65}
      />
      <StatsLayer />
      <TransformationalYearLayer />
    </SceneFade>
  );
};

const StatsLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [STATS_END - 20, STATS_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame > STATS_END) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <StatisticRow stats={STATISTICS} appearAt={20} stagger={12} />
    </AbsoluteFill>
  );
};

const TransformationalYearLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - YEAR_START;
  if (local < -20) return null;

  const opacity = interpolate(local, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const yearScale = interpolate(local, [0, 20], [0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subOpacity = interpolate(local, [26, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 160,
          fontWeight: 700,
          color: colors.red,
          transform: `scale(${yearScale})`,
          lineHeight: 1,
        }}
      >
        {TRANSFORMATIONAL_YEAR_TEXT.year}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 48,
          color: colors.white,
          marginTop: 20,
        }}
      >
        {TRANSFORMATIONAL_YEAR_TEXT.headline}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 26,
          color: colors.gold,
          marginTop: 14,
          opacity: subOpacity,
          letterSpacing: 1,
        }}
      >
        {TRANSFORMATIONAL_YEAR_TEXT.subhead}
      </div>
    </AbsoluteFill>
  );
};
