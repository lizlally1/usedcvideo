import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {SafeVideo, SafeImage} from '../components/SafeMedia';
import {TitleCard} from '../components/TitleCard';
import {Logo} from '../components/Logo';
import {gradients} from '../styles/theme';
import {FOOTAGE, OPENING_TEXT, SCENES, STILL_IMAGES} from '../data/content';

const DURATION = SCENES.opening.durationInSeconds * 30;
const CUT_TO_SIGN = 100; // frame where exterior shot dissolves to the sign

export const Scene1Opening: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION} mode="dip" transitionFrames={20}>
      <ExteriorLayer />
      <SignLayer />
      <AbsoluteFill style={{background: gradients.navyScrimFull}} />
      <TitleCard
        title={OPENING_TEXT.title}
        subtitle={OPENING_TEXT.subtitle}
        appearAt={90}
      />
      <LogoBeat />
    </SceneFade>
  );
};

const ExteriorLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [CUT_TO_SIGN - 20, CUT_TO_SIGN], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, CUT_TO_SIGN], [1, 1.08], {
    extrapolateRight: 'clamp',
  });
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{width: '100%', height: '100%', transform: `scale(${scale})`}}>
        <SafeVideo
          src={FOOTAGE.armourExterior.src}
          volume={FOOTAGE.armourExterior.volume}
          startFrom={0}
          endAt={110}
          label={FOOTAGE.armourExterior.label}
        />
      </div>
    </AbsoluteFill>
  );
};

const SignLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [CUT_TO_SIGN - 20, CUT_TO_SIGN + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [CUT_TO_SIGN, DURATION], [1.4, 1.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      {/*
        A tight, slow-zooming still crop on the branded reception sign —
        deliberately a different treatment (static image, tight crop) than
        the full walk-in video reveal used later in Scene 6, per the media
        inventory's reuse plan.
      */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translate(2%, -6%)`,
        }}
      >
        <SafeImage
          src={STILL_IMAGES.bgHqReception}
          label="HQ reception sign crop"
        />
      </div>
    </AbsoluteFill>
  );
};

const LogoBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [200, 224, DURATION - 40, DURATION - 16],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <Logo size={0.65} />
    </div>
  );
};
