import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {SafeVideo} from '../components/SafeMedia';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {TitleCard} from '../components/TitleCard';
import {Logo} from '../components/Logo';
import {colors, fonts} from '../styles/theme';
import {CONCLUSION_TEXT, FOOTAGE, SCENES, STILL_IMAGES} from '../data/content';

const DURATION = SCENES.conclusion.durationInSeconds * 30; // 570
const MONTAGE_END = 140;
const CROSSFADE = 24;

export const Scene7Conclusion: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION} mode="dip" transitionFrames={30}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />
      <MontageLayer />
      <HeldWideShotLayer />
      <TitleCard
        title={CONCLUSION_TEXT.years}
        appearAt={160}
        holdFrames={110}
        accent="gold"
      />
      <ClosingLines />
      <ClosingLogo />
    </SceneFade>
  );
};

const MontageLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [MONTAGE_END - CROSSFADE, MONTAGE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame > MONTAGE_END) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      {/*
        A different, later sub-range of the same exterior clip used in
        Scene 1 (frames 110-155 here vs. 0-110 there) — an intentional,
        differently-treated reprise near the conclusion, as allowed by the
        creative brief.
      */}
      <SafeVideo
        src={FOOTAGE.armourExterior.src}
        volume={0}
        startFrom={110}
        endAt={110 + MONTAGE_END}
        playbackRate={0.32}
        label={FOOTAGE.armourExterior.label}
      />
    </AbsoluteFill>
  );
};

const HeldWideShotLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - MONTAGE_END;
  const opacity = interpolate(local, [-CROSSFADE, 0], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame < MONTAGE_END - CROSSFADE) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <KenBurnsBackground
        src={STILL_IMAGES.bgArmourExterior}
        durationInFrames={DURATION - MONTAGE_END}
        direction="out"
        tintOpacity={0.35}
        layerOpacity={1}
      />
    </AbsoluteFill>
  );
};

const ClosingLines: React.FC = () => {
  const frame = useCurrentFrame();
  const lineOneOpacity = interpolate(frame, [300, 320, 375, 395], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineTwoOpacity = interpolate(frame, [395, 415, 465, 480], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'absolute',
          fontFamily: fonts.display,
          fontSize: 68,
          fontWeight: 600,
          color: colors.white,
          opacity: lineOneOpacity,
          textAlign: 'center',
        }}
      >
        {CONCLUSION_TEXT.lineOne}
      </div>
      <div
        style={{
          position: 'absolute',
          fontFamily: fonts.display,
          fontSize: 68,
          fontWeight: 600,
          color: colors.gold,
          opacity: lineTwoOpacity,
          textAlign: 'center',
        }}
      >
        {CONCLUSION_TEXT.lineTwo}
      </div>
    </AbsoluteFill>
  );
};

const ClosingLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [485, 510], [0, 1], {
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
      <Logo size={1} />
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 28,
          color: colors.cream,
          marginTop: 28,
          letterSpacing: 2,
        }}
      >
        {CONCLUSION_TEXT.website}
      </div>
    </AbsoluteFill>
  );
};
