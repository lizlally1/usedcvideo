import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import './styles/fonts-inline.css';

import {FPS, SCENE_ORDER, SCENES} from './data/content';
import {colors} from './styles/theme';

import {Scene1Stockyards} from './scenes/Scene1Stockyards';
import {Scene2ArmourBuilding} from './scenes/Scene2ArmourBuilding';
import {Scene3HonoringStructure} from './scenes/Scene3HonoringStructure';
import {Scene4NewHome} from './scenes/Scene4NewHome';

const SCENE_COMPONENTS: Record<string, React.FC> = {
  stockyards: Scene1Stockyards,
  armourBuilding: Scene2ArmourBuilding,
  honoringStructure: Scene3HonoringStructure,
  newHome: Scene4NewHome,
};

/** Derives each scene's absolute frame offset from SCENES durations. */
const getSceneOffsets = () => {
  const offsets: {key: string; from: number; durationInFrames: number}[] = [];
  let cursor = 0;
  for (const key of SCENE_ORDER) {
    const durationInFrames = Math.round(SCENES[key].durationInSeconds * FPS);
    offsets.push({key, from: cursor, durationInFrames});
    cursor += durationInFrames;
  }
  return offsets;
};

export const ArmourBuildingFilm: React.FC = () => {
  const offsets = getSceneOffsets();

  return (
    <AbsoluteFill style={{backgroundColor: colors.navy}}>
      {offsets.map(({key, from, durationInFrames}) => {
        const SceneComponent = SCENE_COMPONENTS[key];
        return (
          <Sequence
            key={key}
            from={from}
            durationInFrames={durationInFrames}
            name={key}
          >
            <SceneComponent />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
