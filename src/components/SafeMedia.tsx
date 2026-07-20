import React from 'react';
import {continueRender, delayRender, OffthreadVideo, staticFile} from 'remotion';
import {colors, fonts} from '../styles/theme';

interface SafeVideoProps {
  src: string;
  volume?: number;
  startFrom?: number;
  endAt?: number;
  playbackRate?: number;
  style?: React.CSSProperties;
  label?: string;
}

/**
 * Wraps <OffthreadVideo> so a missing footage file never crashes the
 * Remotion preview or render. In development it renders a clearly-labeled
 * placeholder card naming the missing asset; in a production render
 * (NODE_ENV === 'production', which `remotion render` sets) it renders
 * nothing instead of a warning card, so a missing asset never leaks into
 * the final MP4.
 */
export const SafeVideo: React.FC<SafeVideoProps> = ({
  src,
  volume,
  startFrom,
  endAt,
  playbackRate,
  style,
  label,
}) => {
  const [missing, setMissing] = React.useState(false);
  const [handle] = React.useState(() => delayRender(`Checking asset: ${src}`));

  React.useEffect(() => {
    let cancelled = false;
    fetch(staticFile(src), {method: 'HEAD'})
      .then((res) => {
        if (!cancelled && !res.ok) setMissing(true);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) continueRender(handle);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (missing) {
    if (process.env.NODE_ENV === 'production') return null;
    return <MissingAssetCard kind="video" src={src} label={label} style={style} />;
  }

  return (
    <OffthreadVideo
      src={staticFile(src)}
      volume={volume}
      startFrom={startFrom}
      endAt={endAt}
      playbackRate={playbackRate}
      style={{width: '100%', height: '100%', objectFit: 'cover', ...style}}
      onError={() => setMissing(true)}
    />
  );
};

interface SafeImageProps {
  src: string;
  style?: React.CSSProperties;
  label?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({src, style, label}) => {
  const [missing, setMissing] = React.useState(false);
  return missing ? (
    process.env.NODE_ENV === 'production' ? null : (
      <MissingAssetCard kind="image" src={src} label={label} style={style} />
    )
  ) : (
    <img
      src={staticFile(src)}
      alt={label ?? src}
      style={{width: '100%', height: '100%', objectFit: 'cover', ...style}}
      onError={() => setMissing(true)}
    />
  );
};

const MissingAssetCard: React.FC<{
  kind: 'video' | 'image';
  src: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({kind, src, label, style}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3a0d0d',
      border: '4px dashed #ff6b6b',
      color: '#ffdede',
      fontFamily: fonts.body,
      textAlign: 'center',
      padding: 40,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <div style={{fontSize: 28, fontWeight: 700, marginBottom: 12}}>
      ⚠ Missing {kind} asset (development preview only)
    </div>
    <div style={{fontSize: 20, opacity: 0.85}}>public/{src}</div>
    {label ? (
      <div style={{fontSize: 18, marginTop: 8, opacity: 0.7}}>{label}</div>
    ) : null}
    <div style={{fontSize: 16, marginTop: 16, color: colors.gold}}>
      This warning never appears in a production render.
    </div>
  </div>
);
