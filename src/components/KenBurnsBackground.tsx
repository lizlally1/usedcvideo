import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SafeImage} from './SafeMedia';
import {colors} from '../styles/theme';

interface KenBurnsBackgroundProps {
  src: string;
  durationInFrames: number;
  /** "in" zooms slowly in, "out" zooms slowly out. */
  direction?: 'in' | 'out';
  /** Tint the still navy so graphics on top stay legible; 0 disables it. */
  tintOpacity?: number;
  /** Overall opacity of the whole background layer (for subtlety/texture). */
  layerOpacity?: number;
}

/**
 * Slow zoom/pan on a still image, used as textured background behind the
 * graphics-forward scenes (timeline, statistics) so they don't read as a
 * flat slideshow — per the creative brief's explicit allowance for
 * "slow zooms or pans on still assets."
 */
export const KenBurnsBackground: React.FC<KenBurnsBackgroundProps> = ({
  src,
  durationInFrames,
  direction = 'in',
  tintOpacity = 0.55,
  layerOpacity = 0.35,
}) => {
  const frame = useCurrentFrame();
  const progress = frame / Math.max(durationInFrames, 1);

  const scale =
    direction === 'in'
      ? interpolate(progress, [0, 1], [1.0, 1.12])
      : interpolate(progress, [0, 1], [1.12, 1.0]);

  const translateX = interpolate(progress, [0, 1], [0, -20]);

  return (
    <AbsoluteFill style={{opacity: layerOpacity, overflow: 'hidden'}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translateX(${translateX}px)`,
          filter: 'blur(6px) saturate(0.7)',
        }}
      >
        <SafeImage src={src} />
      </div>
      <AbsoluteFill style={{backgroundColor: colors.navy, opacity: tintOpacity}} />
    </AbsoluteFill>
  );
};
