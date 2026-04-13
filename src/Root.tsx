import React from 'react';
import {Composition} from 'remotion';
import {TeaserCinematicPremium} from './TeaserCinematicPremium';

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
			/>
		</>
	);
};