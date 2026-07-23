import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {SceneFade} from '../components/Transition';
import {SafeVideo} from '../components/SafeMedia';
import {KenBurnsBackground} from '../components/KenBurnsBackground';
import {LowerThird} from '../components/LowerThird';
import {TitleCard} from '../components/TitleCard';
import {Logo} from '../components/Logo';
import {colors, fonts} from '../styles/theme';
import {FOOTAGE, NEW_HOME_TEXT, SCENES, STILL_IMAGES} from '../data/content';

const DURATION = SCENES.newHome.durationInSeconds * 30; // 1530
const CROSSFADE = 24;

// Each footage segment below gets its own nested <Sequence>, which resets
// useCurrentFrame() to 0 at that segment's start. This matters specifically
// for <SafeVideo> (OffthreadVideo): its startFrom/endAt props resolve
// against whatever frame is "current" when the component mounts, so a video
// segment that starts partway through a scene (rather than at frame 0, like
// every video layer in Scenes 1-2) needs a real Sequence boundary — passing
// startFrom/endAt numbers hand-computed against the *scene's* frame count
// instead silently produces a validity window in the wrong place, and the
// video renders blank for most of its intended on-screen time. Adjacent
// segments overlap by CROSSFADE frames so one can fade out while the next
// fades in.
const RECEPTION_SPAN = 221; // full hq-reception-reveal clip, ~7.4s
const OFFICE_START = RECEPTION_SPAN - CROSSFADE; // 197
const OFFICE_SPAN = 185; // full office-culture-hoops clip, ~6.2s
const WALL_START = OFFICE_START + OFFICE_SPAN - CROSSFADE; // 358
const WALL_SPAN = 400;
const WALL_SOURCE_FRAMES = 309; // ~10.3s clip at 30fps
const WALL_PLAYBACK_RATE = WALL_SOURCE_FRAMES / WALL_SPAN;
const PULLAWAY_START = WALL_START + WALL_SPAN - CROSSFADE; // 734
const PULLAWAY_SPAN = DURATION - PULLAWAY_START;

/**
 * No footage of executive meetings, clients arriving, an evening exterior,
 * or an actual aerial pull-away shot was provided, so the scene closes on a
 * slow Ken Burns zoom-out over a still of the building exterior as a
 * cinematic stand-in for the brief's requested closing aerial shot — see
 * media-inventory.md.
 */
export const Scene4NewHome: React.FC = () => {
  return (
    <SceneFade durationInFrames={DURATION} mode="dip" transitionFrames={30}>
      <AbsoluteFill style={{backgroundColor: colors.navy}} />

      <Sequence from={0} durationInFrames={RECEPTION_SPAN} name="reception">
        <ReceptionLayer />
      </Sequence>

      <Sequence from={OFFICE_START} durationInFrames={OFFICE_SPAN} name="office">
        <OfficeLayer />
      </Sequence>

      <Sequence from={WALL_START} durationInFrames={WALL_SPAN} name="values-wall">
        <ValuesWallLayer />
      </Sequence>

      <Sequence from={PULLAWAY_START} durationInFrames={PULLAWAY_SPAN} name="pull-away">
        <PullAwayLayer />
      </Sequence>

      <ClosingLines />
      <ClosingLogo />
    </SceneFade>
  );
};

/** Fades a layer in over its first `fade` frames and out over its last
 * `fade` frames of a Sequence whose local duration is `span`. */
const useCrossfade = (span: number, fade: number = CROSSFADE) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [span - fade, span], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(fadeIn, fadeOut);
};

const ReceptionLayer: React.FC = () => {
  const opacity = useCrossfade(RECEPTION_SPAN);
  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.hqReceptionReveal.src}
        volume={FOOTAGE.hqReceptionReveal.volume}
        startFrom={0}
        endAt={RECEPTION_SPAN}
        label={FOOTAGE.hqReceptionReveal.label}
      />
      <LowerThird title={NEW_HOME_TEXT.locationTag} appearAt={20} holdFrames={140} />
    </AbsoluteFill>
  );
};

const OfficeLayer: React.FC = () => {
  const opacity = useCrossfade(OFFICE_SPAN);
  return (
    <AbsoluteFill style={{opacity}}>
      <SafeVideo
        src={FOOTAGE.officeCultureHoops.src}
        volume={FOOTAGE.officeCultureHoops.volume}
        startFrom={0}
        endAt={OFFICE_SPAN}
        label={FOOTAGE.officeCultureHoops.label}
      />
      <LowerThird title={NEW_HOME_TEXT.collaborationTitle} appearAt={30} holdFrames={110} />
    </AbsoluteFill>
  );
};

const ValuesWallLayer: React.FC = () => {
  const opacity = useCrossfade(WALL_SPAN);
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
      <LowerThird
        title={NEW_HOME_TEXT.conferenceTitle}
        support={NEW_HOME_TEXT.conferenceSupport}
        appearAt={40}
        holdFrames={300}
      />
    </AbsoluteFill>
  );
};

const PullAwayLayer: React.FC = () => {
  const opacity = useCrossfade(PULLAWAY_SPAN);
  return (
    <AbsoluteFill style={{opacity}}>
      <KenBurnsBackground
        src={STILL_IMAGES.bgArmourExterior}
        durationInFrames={PULLAWAY_SPAN}
        direction="out"
        tintOpacity={0.3}
        layerOpacity={1}
      />
      <TitleCard title={NEW_HOME_TEXT.brandLine} appearAt={40} holdFrames={190} />
    </AbsoluteFill>
  );
};

// Closing lines/logo are pure text over the still-running pull-away
// background, timed against the whole scene's absolute frame count (no
// video involved, so no Sequence-boundary considerations apply).
const ClosingLines: React.FC = () => {
  const frame = useCurrentFrame();
  const lineOneOpacity = interpolate(frame, [1140, 1160, 1220, 1240], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineTwoOpacity = interpolate(frame, [1240, 1260, 1320, 1340], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'absolute',
          fontFamily: fonts.display,
          fontSize: 64,
          fontWeight: 600,
          color: colors.white,
          opacity: lineOneOpacity,
          textAlign: 'center',
        }}
      >
        {NEW_HOME_TEXT.closingLineOne}
      </div>
      <div
        style={{
          position: 'absolute',
          fontFamily: fonts.display,
          fontSize: 64,
          fontWeight: 600,
          color: colors.gold,
          opacity: lineTwoOpacity,
          textAlign: 'center',
        }}
      >
        {NEW_HOME_TEXT.closingLineTwo}
      </div>
    </AbsoluteFill>
  );
};

const ClosingLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [1350, 1380], [0, 1], {
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
        {NEW_HOME_TEXT.website}
      </div>
    </AbsoluteFill>
  );
};
