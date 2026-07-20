import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TRANSITION_FRAMES} from '../data/content';
import {colors} from '../styles/theme';

interface SceneFadeProps {
  /** Duration of the containing scene's Sequence, in frames. */
  durationInFrames: number;
  /** How many frames the fade in/out takes. Defaults to the global constant. */
  transitionFrames?: number;
  /**
   * "cross" fades scene content directly in/out (used when the adjacent
   * scene's content can bleed through). "dip" fades through a solid navy
   * frame first — the gentle "dip-to-navy" transition called for in the
   * creative brief, used at the more deliberate scene breaks.
   */
  mode?: 'cross' | 'dip';
  children: React.ReactNode;
}

/**
 * Reusable enter/exit transition wrapper. Every scene component renders its
 * content through this so cuts between scenes are consistently soft
 * cross-dissolves or dip-to-navy — never a hard cut, spin, or glitch.
 */
export const SceneFade: React.FC<SceneFadeProps> = ({
  durationInFrames,
  transitionFrames = TRANSITION_FRAMES,
  mode = 'cross',
  children,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, transitionFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - transitionFrames, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const navyDipIn = interpolate(frame, [0, transitionFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const navyDipOut = interpolate(
    frame,
    [durationInFrames - transitionFrames, durationInFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const navyOverlayOpacity = Math.max(navyDipIn, navyDipOut);

  return (
    <AbsoluteFill style={{opacity: mode === 'dip' ? 1 : opacity}}>
      {children}
      {mode === 'dip' ? (
        <AbsoluteFill
          style={{backgroundColor: colors.navy, opacity: navyOverlayOpacity}}
        />
      ) : null}
    </AbsoluteFill>
  );
};
