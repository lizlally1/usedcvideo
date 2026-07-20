import {BRAND} from '../data/content';

export const colors = BRAND.colors;

export const fonts = {
  display: `"${BRAND.fonts.display}", sans-serif`,
  body: `"${BRAND.fonts.body}", sans-serif`,
};

/** Title-safe margin, in px, at 1920x1080. Keeps text off broadcast edges. */
export const SAFE_MARGIN = 96;

export const gradients = {
  /** Bottom-up navy scrim used behind lower-thirds/captions for legibility. */
  navyScrimBottom:
    'linear-gradient(to top, rgba(0,1,42,0.92) 0%, rgba(0,1,42,0.55) 45%, rgba(0,1,42,0) 100%)',
  navyScrimFull:
    'linear-gradient(to bottom, rgba(0,1,42,0.35) 0%, rgba(0,1,42,0.15) 50%, rgba(0,1,42,0.55) 100%)',
  navySolidDip: 'linear-gradient(180deg, #00012A 0%, #050A35 100%)',
};
