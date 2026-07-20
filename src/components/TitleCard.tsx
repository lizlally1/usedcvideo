import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts, SAFE_MARGIN} from '../styles/theme';

interface TitleCardProps {
  title: string;
  subtitle?: string;
  appearAt?: number;
  align?: 'center' | 'left';
  accent?: 'gold' | 'red';
}

/**
 * Large section title + supporting subtitle, fading and sliding a short
 * distance into place. Used for the opening title reveal and the
 * conclusion's closing lines.
 */
export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  appearAt = 0,
  align = 'center',
  accent = 'gold',
}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  const opacity = interpolate(local, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideY = interpolate(local, [0, 20], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (local < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_MARGIN,
        right: SAFE_MARGIN,
        top: '40%',
        transform: `translateY(calc(-50% + ${slideY}px))`,
        opacity,
        textAlign: align,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <div
        style={{
          width: 64,
          height: 4,
          backgroundColor: accent === 'gold' ? colors.gold : colors.red,
          marginBottom: 26,
        }}
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 72,
          fontWeight: 600,
          color: colors.white,
          lineHeight: 1.1,
          maxWidth: 1300,
          textShadow: '0 4px 24px rgba(0,0,0,0.45)',
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 30,
            fontWeight: 400,
            color: colors.cream,
            marginTop: 20,
            opacity: 0.9,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};
