import React from 'react';
import {Composition} from 'remotion';
import {ArmourBuildingFilm} from './Video';
import {FPS, HEIGHT, TOTAL_DURATION_IN_FRAMES, WIDTH} from './data/content';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ArmourBuildingFilm"
      component={ArmourBuildingFilm}
      durationInFrames={TOTAL_DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
