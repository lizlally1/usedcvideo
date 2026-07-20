import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../styles/theme';

interface Milestone {
  year: string;
  label: string;
}

interface TimelineProps {
  milestones: readonly Milestone[];
  /** Frames each milestone gets before the next one appears. */
  frameStep: number;
  appearAt?: number;
}

/**
 * Horizontal timeline: a gold baseline draws in, then each milestone's year
 * + short label animate on in sequence, one at a time, never crowding the
 * frame with more than a title + label at once.
 */
export const Timeline: React.FC<TimelineProps> = ({
  milestones,
  frameStep,
  appearAt = 0,
}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  const lineProgress = interpolate(local, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const activeIndex = Math.min(
    Math.max(Math.floor((local - 15) / frameStep), 0),
    milestones.length - 1,
  );

  if (local < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <div
        style={{
          height: 3,
          background: `linear-gradient(to right, ${colors.gold} ${
            lineProgress * 100
          }%, rgba(199,163,90,0.15) ${lineProgress * 100}%)`,
          marginBottom: 56,
        }}
      />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {milestones.map((m, i) => {
          const localStart = 15 + i * frameStep;
          const itemLocal = local - localStart;
          const isActive = i === activeIndex;
          const opacity = interpolate(itemLocal, [0, 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const scale = interpolate(itemLocal, [0, 14], [0.9, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={m.year}
              style={{
                opacity: isActive || itemLocal > 0 ? opacity : 0,
                transform: `scale(${scale})`,
                textAlign: 'center',
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: colors.gold,
                  margin: '0 auto 22px',
                }}
              />
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 54,
                  fontWeight: 600,
                  color: colors.white,
                }}
              >
                {m.year}
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: 22,
                  color: colors.cream,
                  marginTop: 8,
                  opacity: 0.85,
                  padding: '0 12px',
                }}
              >
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
