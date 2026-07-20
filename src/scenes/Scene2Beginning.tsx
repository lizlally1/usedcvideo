import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {colors, fonts} from '../styles/theme';
import {BEGINNING_TEXT, SCENES, STILL_IMAGES} from '../data/content';

const DURATION = SCENES.beginning.durationInSeconds * 30;

export const Scene2Beginning: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <KenBurnsBackground
        src={STILL_IMAGES.bgOffice}
        durationInFrames={DURATION}
        direction="in"
      />
      <YearReveal />
    </SceneFade>
  );
};

const YearReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const yearOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const yearScale = interpolate(frame, [10, 30], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineWidth = interpolate(frame, [30, 55], [0, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineOpacity = interpolate(frame, [55, 78], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineY = interpolate(frame, [55, 78], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        // Biased above vertical-center (rather than true center) so the
        // headline never reaches into the bottom caption band.
        justifyContent: 'center',
        paddingBottom: 260,
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 220,
          fontWeight: 700,
          color: colors.gold,
          opacity: yearOpacity,
          transform: `scale(${yearScale})`,
          lineHeight: 1,
        }}
      >
        {BEGINNING_TEXT.year}
      </div>
      <div
        style={{
          width: lineWidth,
          height: 3,
          backgroundColor: colors.red,
          margin: '28px 0 28px',
        }}
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 52,
          fontWeight: 500,
          color: colors.white,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          letterSpacing: 1,
        }}
      >
        {BEGINNING_TEXT.headline}
      </div>
    </AbsoluteFill>
  );
};
