import React from 'react';
import {colors, fonts} from '../styles/theme';

interface LogoProps {
  size?: number;
  color?: string;
  align?: 'center' | 'left';
}

/**
 * Tasteful typographic lockup of the U.S. Energy wordmark, styled after the
 * company's own branded signage seen on-camera (stacked condensed caps with
 * letter-spacing). This is a typographic treatment, not a reproduction of a
 * separately-supplied logo file — no logo image asset was provided with the
 * footage, so text is used deliberately rather than fabricating a mark.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 1,
  color = colors.gold,
  align = 'center',
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      fontFamily: fonts.display,
      color,
      lineHeight: 1.05,
      letterSpacing: 4 * size,
    }}
  >
    <span style={{fontSize: 58 * size, fontWeight: 600}}>U.S. ENERGY</span>
    <span
      style={{
        fontSize: 22 * size,
        fontWeight: 400,
        letterSpacing: 6 * size,
        marginTop: 6 * size,
        opacity: 0.85,
      }}
    >
      DEVELOPMENT CORPORATION
    </span>
  </div>
);
