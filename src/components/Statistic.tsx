import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../styles/theme';

interface Stat {
  value: string;
  label: string;
}

interface StatisticRowProps {
  stats: readonly Stat[];
  appearAt?: number;
  /** Frames between each stat animating in. */
  stagger?: number;
}

/**
 * Large, confident numeral + label row. Shows at most three at once per the
 * creative brief ("Display only two or three statistics at once").
 */
export const StatisticRow: React.FC<StatisticRowProps> = ({
  stats,
  appearAt = 0,
  stagger = 10,
}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  if (local < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        // Sits above vertical-center so labels never reach into the
        // bottom caption band (see Captions.tsx).
        top: '38%',
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'center',
        gap: 110,
        padding: '0 140px',
      }}
    >
      {stats.map((s, i) => {
        const itemLocal = local - i * stagger;
        const opacity = interpolate(itemLocal, [0, 18], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const y = interpolate(itemLocal, [0, 18], [20, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={s.label}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 96,
                fontWeight: 700,
                color: colors.gold,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 28,
                color: colors.white,
                marginTop: 16,
                letterSpacing: 1,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
