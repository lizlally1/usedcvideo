import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts, gradients, SAFE_MARGIN} from '../styles/theme';

interface LowerThirdProps {
  title: string;
  support?: string;
  /** Frame (relative to this component's own Sequence) it should appear on. */
  appearAt?: number;
  /** How long (frames) the card stays fully visible before fading out. */
  holdFrames?: number;
}

/**
 * Bottom-placed value/label callout with a soft transparent navy gradient
 * scrim behind it for legibility, generous title-safe padding, and a small
 * gold accent rule. Used for the "one value per clip" core-values beats and
 * for the Fort Worth location tag.
 */
export const LowerThird: React.FC<LowerThirdProps> = ({
  title,
  support,
  appearAt = 0,
  holdFrames = 200,
}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  const opacity = interpolate(
    local,
    [0, 15, holdFrames, holdFrames + 20],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const slideY = interpolate(local, [0, 15], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 340,
        background: gradients.navyScrimBottom,
        display: 'flex',
        alignItems: 'flex-end',
        opacity,
      }}
    >
      <div
        style={{
          transform: `translateY(${slideY}px)`,
          paddingLeft: SAFE_MARGIN,
          paddingBottom: 88,
          maxWidth: 1100,
        }}
      >
        <div
          style={{
            width: 56,
            height: 4,
            backgroundColor: colors.gold,
            marginBottom: 18,
          }}
        />
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 56,
            fontWeight: 600,
            color: colors.white,
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        {support ? (
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 26,
              fontWeight: 400,
              color: colors.cream,
              marginTop: 12,
              opacity: 0.9,
            }}
          >
            {support}
          </div>
        ) : null}
      </div>
    </div>
  );
};
