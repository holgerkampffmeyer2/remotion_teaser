import React from 'react';
import {Composition} from 'remotion';
import {TeaserCinematicPremium} from './TeaserCinematicPremium';

const DEFAULT_PROPS = {
  audioFile: 'teaser_audio.mp3',
  imageFile: 'Mixcloud Post Mix176.png',
  title: 'DJ Hulk Sunday House Mix',
  subtitle: 'Checkout the full hour mix on Mixcloud'
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TeaserCinematicPremium"
        component={TeaserCinematicPremium}
        durationInFrames={20 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_PROPS}
      />
    </>
  );
};
