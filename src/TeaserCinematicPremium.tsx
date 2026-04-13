import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';

const randomInRange = (min: number, max: number): number =>
	min + Math.random() * (max - min);

const barCountOptions = [16, 32, 64, 128];
const CONFIG = {
	bgZoomEnd: 1.1,
	driftRange: 0,
	vignetteMin: 0.6,
	vignetteMax: 0.8,
	titleSize: 88,
	subtitleSize: 28,
	visualizerMultiplier: 70,
	waveFrequency: 8,
	barCount: 64,
	colorVariant: 0,
};

const COLORS = [
	{
		start: 'rgba(124,255,235,0.9)',
		mid: 'rgba(25,181,255,0.95)',
		end: 'rgba(122,44,255,0.95)',
	},
	{
		start: 'rgba(255,167,71,0.9)',
		mid: 'rgba(255,105,180,0.95)',
		end: 'rgba(180,100,255,0.95)',
	},
	{
		start: 'rgba(72,219,251,0.9)',
		mid: 'rgba(34,197,94,0.95)',
		end: 'rgba(59,130,246,0.95)',
	},
];

export const TeaserCinematicPremium: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const audioData = useAudioData(staticFile('teaser_audio.mp3'));

	const bgZoom = interpolate(Math.sin(frame / 60), [-1, 1], [1.0, 1.08], {
		extrapolateRight: 'clamp',
	});

	const textDrift = (frame / 600) * 150;

	const textZoom = interpolate(Math.sin(frame / 60), [-1, 1], [1, 1.04], {
		extrapolateRight: 'clamp',
	});

	const vignette = 0.7;

	const fadeOut = interpolate(frame, [470, 600], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const barCount = CONFIG.barCount;
	let bars: number[] = Array.from({length: barCount}, () => 0.06);
	
	const beatPhase = frame % 60;
	const beatMultiplier = beatPhase < 15 ? beatPhase / 15 : 1;
	
	if (audioData) {
		const rawBars = visualizeAudio({
			fps,
			frame,
			audioData,
			numberOfSamples: barCount,
		});
		bars = rawBars.map(v => v * beatMultiplier);
	}

	const colors = COLORS[CONFIG.colorVariant];

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#050508',
				fontFamily: 'Inter, Arial, sans-serif',
				overflow: 'hidden',
				opacity: fadeOut,
			}}
		>
			<Audio src={staticFile('teaser_audio.mp3')} />
			<AbsoluteFill
				style={{
					transform: `scale(${bgZoom})`,
				}}
			>
				<Img
					src={staticFile('Mixcloud Post Mix178.png')}
					style={{
						width,
						height,
						objectFit: 'cover',
						filter: 'brightness(0.72) contrast(1.08) saturate(1.04)',
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.68) 78%, rgba(0,0,0,0.92) 100%)',
				}}
			/>

			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 36%)',
				}}
			/>

			<AbsoluteFill
				style={{
					boxShadow: `inset 0 0 180px rgba(0,0,0,${vignette})`,
				}}
			/>

			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 108,
					padding: '0 90px',
				}}
			>
				<div
					style={{
						maxWidth: 1320,
						margin: '0 auto',
						color: 'white',
						transform: `translateX(${textDrift}px) scale(${textZoom})`,
					}}
				>
					<div
						style={{
							fontSize: CONFIG.titleSize,
							fontWeight: 800,
							letterSpacing: '-0.055em',
							lineHeight: 0.94,
							textShadow:
								'0 0 14px rgba(255,255,255,0.08), 0 0 38px rgba(0,180,255,0.16)',
						}}
					>
						DJ Hulk Sunday House Mix
					</div>

					<div
						style={{
							marginTop: 22,
							fontSize: CONFIG.subtitleSize,
							fontWeight: 400,
							letterSpacing: '0.01em',
							color: 'rgba(255,255,255,0.88)',
						}}
					>
						Checkout the full hour mix on Mixcloud
					</div>
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: '50%',
					bottom: 34,
					transform: 'translateX(-50%)',
					width: '82%',
					maxWidth: 1180,
					height: 82,
					display: 'flex',
					alignItems: 'flex-end',
					gap: 4,
					opacity: 0.92,
					filter: 'drop-shadow(0 0 16px rgba(0,190,255,0.26))',
				}}
			>
				{bars.map((v, i) => {
					const barIndex = i / barCount;
					const freqBoost = Math.sin(barIndex * Math.PI) * 0.5 + 0.5;
					const baseWave = Math.sin(frame / (CONFIG.waveFrequency * 2) + i * 0.5) * 15;
					const heightBar = Math.max(6, v * CONFIG.visualizerMultiplier * (0.3 + freqBoost * 0.7) + baseWave + 20);
					return (
						<div
							key={i}
							style={{
								flex: 1,
								height: heightBar,
								borderRadius: 999,
								background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 48%, ${colors.end} 100%)`,
								boxShadow: '0 0 12px rgba(0,185,255,0.32)',
							}}
						/>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};