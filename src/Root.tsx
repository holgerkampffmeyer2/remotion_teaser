import React from 'react';
import {Composition} from 'remotion';
import {TeaserCinematicPremium} from './TeaserCinematicPremium';
import {TeaserNeonWave} from './TeaserNeonWave';
import {TeaserPrismGlass} from './TeaserPrismGlass';
import {TeaserCinematicPoster} from './TeaserCinematicPoster';
import {TeaserMonoPulse} from './TeaserMonoPulse';

const DEFAULT_PROPS = {
	audioFile: 'teaser_audio.mp3',
	imageFile: 'Mixcloud Post Mix176.png',
	title: 'DJ Hulk Sunday House Mix',
	subtitle: 'Checkout the full hour mix on Mixcloud',
	format: 'youtube' as const,
	colorPalette: 0,
	speedMultiplier: 1,
	equalizerStyle: 'bars' as const,
	textEffect: 'glow' as const,
	vignette: 0.7,
	bgZoom: 1.08,
	barCount: 64,
	waveFrequency: 8,
	bgBrightness: 0.72,
	bgContrast: 1.08,
	bgSaturate: 1.04,
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
				defaultProps={{...DEFAULT_PROPS, format: 'youtube'}}
			/>
			<Composition
				id="TeaserCinematicPremiumInstagram"
				component={TeaserCinematicPremium}
				durationInFrames={20 * 30}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{...DEFAULT_PROPS, format: 'instagram'}}
			/>
			<Composition
				id="TeaserNeonWave"
				component={TeaserNeonWave}
				durationInFrames={20 * 30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{...DEFAULT_PROPS, format: 'youtube'}}
			/>
			<Composition
				id="TeaserNeonWaveInstagram"
				component={TeaserNeonWave}
				durationInFrames={20 * 30}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{...DEFAULT_PROPS, format: 'instagram'}}
			/>
			<Composition
				id="TeaserPrismGlass"
				component={TeaserPrismGlass}
				durationInFrames={20 * 30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{...DEFAULT_PROPS, format: 'youtube'}}
			/>
			<Composition
				id="TeaserPrismGlassInstagram"
				component={TeaserPrismGlass}
				durationInFrames={20 * 30}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{...DEFAULT_PROPS, format: 'instagram'}}
			/>
			<Composition
				id="TeaserCinematicPoster"
				component={TeaserCinematicPoster}
				durationInFrames={20 * 30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{...DEFAULT_PROPS, format: 'youtube'}}
			/>
			<Composition
				id="TeaserCinematicPosterInstagram"
				component={TeaserCinematicPoster}
				durationInFrames={20 * 30}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{...DEFAULT_PROPS, format: 'instagram'}}
			/>
			<Composition
				id="TeaserMonoPulse"
				component={TeaserMonoPulse}
				durationInFrames={20 * 30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{...DEFAULT_PROPS, format: 'youtube'}}
			/>
			<Composition
				id="TeaserMonoPulseInstagram"
				component={TeaserMonoPulse}
				durationInFrames={20 * 30}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{...DEFAULT_PROPS, format: 'instagram'}}
			/>
		</>
	);
};