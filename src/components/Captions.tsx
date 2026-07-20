import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CAPTIONS, CAPTIONS_ENABLED, FPS} from '../data/content';
import {colors, fonts} from '../styles/theme';

/**
 * Optional closed-captions track synced to the narration. Toggle globally
 * via CAPTIONS_ENABLED in src/data/content.ts. Rendered once at the top of
 * the whole composition (src/Video.tsx) since caption timings are authored
 * against absolute video time, not per-scene time.
 *
 * Style: white text, semi-transparent navy background, bottom-center,
 * max two lines, no karaoke/word-by-word effect — the full line simply
 * appears and disappears in sync with its spoken window.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  if (!CAPTIONS_ENABLED) return null;

  const active = CAPTIONS.find((c) => t >= c.start && t <= c.end);
  if (!active) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        // Sits above the 340px-tall lower-third scrim band (see
        // LowerThird.tsx) so captions never collide with a value/location
        // callout that happens to be on screen at the same time.
        bottom: 360,
        transform: 'translateX(-50%)',
        maxWidth: 1200,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0,1,42,0.72)',
          borderRadius: 8,
          padding: '14px 28px',
          fontFamily: fonts.body,
          fontSize: 30,
          lineHeight: 1.35,
          color: colors.white,
          display: 'inline-block',
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
