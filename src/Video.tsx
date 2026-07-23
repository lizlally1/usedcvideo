import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import './styles/fonts-inline.css';

import {
  AUDIO,
  FPS,
  SCENE_ORDER,
  SCENES,
  TOTAL_DURATION_IN_FRAMES,
} from './data/content';
import {colors} from './styles/theme';
import {Captions} from './components/Captions';

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

      <Sequence from={0} durationInFrames={TOTAL_DURATION_IN_FRAMES} name="captions">
        <Captions />
      </Sequence>

      <AudioLayers />
    </AbsoluteFill>
  );
};

/**
 * Voiceover narration + background music, mixed per the creative brief:
 * narration dominant, music sitting well underneath, fading in at the very
 * start and out at the very end. Both files are optional at the asset
 * level — see public/audio/README.md and scripts/generate-voiceover.mjs.
 */
const AudioLayers: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={TOTAL_DURATION_IN_FRAMES} name="voiceover">
        <Audio src={staticFile(AUDIO.voiceoverSrc)} volume={1} />
      </Sequence>
      <Sequence from={0} durationInFrames={TOTAL_DURATION_IN_FRAMES} name="music">
        <Audio
          src={staticFile(AUDIO.musicSrc)}
          volume={(f) => {
            const fadeInFrames = 45;
            const fadeOutFrames = 60;
            const base = dbToLinear(AUDIO.musicVolumeDb);
            if (f < fadeInFrames) return base * (f / fadeInFrames);
            if (f > TOTAL_DURATION_IN_FRAMES - fadeOutFrames) {
              const remaining = TOTAL_DURATION_IN_FRAMES - f;
              return Math.max(base * (remaining / fadeOutFrames), 0);
            }
            return base;
          }}
        />
      </Sequence>
    </>
  );
};

function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}
