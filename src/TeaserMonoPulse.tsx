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
import {LightLeaks, Starburst, DEFAULT_EFFECTS} from './Effects';

type VariationProps = {
	colorPalette: number;
	speedMultiplier: number;
	equalizerStyle: 'bars' | 'wave' | 'mirrored' | 'circle';
	textEffect: 'glow' | 'slide' | 'scale' | 'pulse';
	vignette: number;
	bgZoom: number;
	barCount: number;
	waveFrequency: number;
	bgBrightness: number;
	bgContrast: number;
	bgSaturate: number;
	enableLightLeaks?: boolean;
	enableStarburst?: boolean;
	lightLeaksIntensity?: number;
	starburstIntensity?: number;
	starburstCenterX?: number;
	starburstCenterY?: number;
};

type TeaserProps = {
	audioFile: string;
	imageFile: string;
	title: string;
	subtitle: string;
	format: 'youtube' | 'instagram';
} & Partial<VariationProps>;

const COLORS = [
	{start: 'rgba(124,255,235,0.9)', mid: 'rgba(25,181,255,0.95)', end: 'rgba(122,44,255,0.95)'},
	{start: 'rgba(255,167,71,0.9)', mid: 'rgba(255,105,180,0.95)', end: 'rgba(180,100,255,0.95)'},
	{start: 'rgba(72,219,251,0.9)', mid: 'rgba(34,197,94,0.95)', end: 'rgba(59,130,246,0.95)'},
	{start: 'rgba(255,20,147,0.9)', mid: 'rgba(255,0,255,0.95)', end: 'rgba(138,43,226,0.95)'},
	{start: 'rgba(100,149,237,0.9)', mid: 'rgba(70,130,180,0.95)', end: 'rgba(30,144,255,0.95)'},
];

const DEFAULT_VARS: VariationProps = {
	colorPalette: 0,
	speedMultiplier: 1,
	equalizerStyle: 'bars',
	textEffect: 'glow',
	vignette: 0.7,
	bgZoom: 1.08,
	barCount: 128,
	waveFrequency: 8,
	bgBrightness: 0.3,
	bgContrast: 1.1,
	bgSaturate: 1.3,
	enableLightLeaks: DEFAULT_EFFECTS.enableLightLeaks,
	enableStarburst: DEFAULT_EFFECTS.enableStarburst,
	lightLeaksIntensity: DEFAULT_EFFECTS.lightLeaksIntensity,
	starburstIntensity: DEFAULT_EFFECTS.starburstIntensity,
	starburstCenterX: DEFAULT_EFFECTS.starburstCenterX,
	starburstCenterY: DEFAULT_EFFECTS.starburstCenterY,
};

export const TeaserMonoPulse: React.FC<TeaserProps> = (props) => {
	const {
		audioFile,
		imageFile,
		title,
		subtitle,
		format,
		colorPalette = DEFAULT_VARS.colorPalette,
		speedMultiplier = DEFAULT_VARS.speedMultiplier,
		bgZoom = DEFAULT_VARS.bgZoom,
		barCount = DEFAULT_VARS.barCount,
		waveFrequency = DEFAULT_VARS.waveFrequency,
		bgBrightness = DEFAULT_VARS.bgBrightness,
		bgContrast = DEFAULT_VARS.bgContrast,
		bgSaturate = DEFAULT_VARS.bgSaturate,
		enableLightLeaks = DEFAULT_VARS.enableLightLeaks,
		enableStarburst = DEFAULT_VARS.enableStarburst,
		lightLeaksIntensity = DEFAULT_VARS.lightLeaksIntensity,
		starburstIntensity = DEFAULT_VARS.starburstIntensity,
		starburstCenterX = DEFAULT_VARS.starburstCenterX,
		starburstCenterY = DEFAULT_VARS.starburstCenterY,
	} = props;

	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const audioData = useAudioData(staticFile(audioFile));

	const isInstagram = format === 'instagram';
	const effectiveFrame = Math.floor(frame / speedMultiplier);

	const titleIn = spring({
		frame,
		fps,
		config: {damping: 16, stiffness: 120, mass: 0.8},
	});

	const subtitleIn = spring({
		frame: frame - 20,
		fps,
		config: {damping: 18, stiffness: 100, mass: 0.9},
	});

	const bgScale = interpolate(effectiveFrame, [0, 600], [1, bgZoom], {
		extrapolateRight: 'clamp',
	});

	const bgPulse = 1 + Math.sin(effectiveFrame / 6) * 0.02;
	const glowPulse = 0.4 + Math.sin(effectiveFrame / 8) * 0.3;

	const fadeOut = interpolate(frame, [520, 600], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const actualBarCount = isInstagram ? 64 : barCount;
	let bars: number[] = Array.from({length: actualBarCount}, () => 0.08);

	const beatPhase = frame % 48;
	const beatMult = beatPhase < 12 ? beatPhase / 12 : 1;

	if (audioData) {
		const rawBars = visualizeAudio({
			fps,
			frame,
			audioData,
			numberOfSamples: actualBarCount,
		});
		bars = rawBars.map(v => v * beatMult);
	}

	const colors = COLORS[colorPalette % COLORS.length];
	const visualizerMultiplier = isInstagram ? 220 : 320;

	const titleSize = isInstagram ? 72 : 94;
	const subtitleSize = isInstagram ? 24 : 30;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#030306',
				fontFamily: 'Inter, Arial, sans-serif',
				overflow: 'hidden',
				opacity: fadeOut,
			}}
		>
			<Audio src={staticFile(audioFile)} />

			<AbsoluteFill
				style={{
					transform: `scale(${bgScale})`,
				}}
			>
				<Img
					src={staticFile(imageFile)}
					style={{
						width,
						height,
						objectFit: 'cover',
						filter: `brightness(${bgBrightness}) contrast(${bgContrast}) saturate(${bgSaturate})`,
					}}
				/>

				{enableLightLeaks && (
					<LightLeaks frame={frame} width={width} height={height} intensity={lightLeaksIntensity} />
				)}

				{enableStarburst && (
					<Starburst frame={frame} width={width} height={height} intensity={starburstIntensity} centerX={starburstCenterX ?? 0.5} centerY={starburstCenterY ?? 0.3} />
				)}
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.78) 82%, rgba(0,0,0,0.94) 100%)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						width: '100%',
						maxWidth: isInstagram ? 800 : 1400,
						textAlign: 'center',
						color: 'white',
					}}
				>
					<div
						style={{
							fontSize: titleSize,
							fontWeight: 800,
							letterSpacing: isInstagram ? '-0.04em' : '-0.055em',
							lineHeight: 1,
							opacity: titleIn,
							textShadow: `0 0 ${40 * glowPulse + 40}px rgba(255,255,255,${glowPulse + 0.3}), 0 0 ${80 * glowPulse + 40}px rgba(0,255,255,${glowPulse + 0.4}), 0 0 ${120 * glowPulse + 40}px rgba(0,255,255,${glowPulse + 0.2})`,
						}}
					>
						{title}
					</div>

					<div
						style={{
							marginTop: 28,
							fontSize: subtitleSize,
							fontWeight: 500,
							letterSpacing: '0.02em',
							color: 'rgba(255,255,255,0.82)',
							opacity: subtitleIn,
						}}
					>
						{subtitle}
					</div>
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: '50%',
					bottom: isInstagram ? 200 : 80,
					transform: 'translateX(-50%)',
					width: isInstagram ? '88%' : '82%',
					maxWidth: isInstagram ? 700 : 1200,
					height: isInstagram ? 140 : 180,
					display: 'flex',
					alignItems: 'flex-end',
					gap: isInstagram ? 3 : 4,
					opacity: 0.88,
				}}
			>
				{bars.map((v, i) => {
					const barPos = i / bars.length;
					const freqMultiplier = barPos < 0.1 ? 1.0 : barPos < 0.25 ? 1.2 : barPos < 0.5 ? 1.5 : 1.8;
					const phaseOffset = i * 0.22;
					const waveOsc = 1 + Math.sin(effectiveFrame / 8 + phaseOffset) * 0.3;
					const volumeBoost = 0.5 + v * 12;
					const baseH = volumeBoost * freqMultiplier * visualizerMultiplier * 0.4;
					const finalH = Math.max(12, baseH * waveOsc);

					return (
						<div
							key={i}
							style={{
								flex: 1,
								height: finalH,
								borderRadius: 999,
								background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 48%, ${colors.end} 100%)`,
								boxShadow: `0 0 ${14 + v * 24}px rgba(0,200,255,${0.28 + v * 0.35})`,
							}}
						/>
					);
				})}
			</div>

			<div
				style={{
					position: 'absolute',
					left: isInstagram ? 40 : 60,
					top: isInstagram ? 50 : 60,
					fontSize: 13,
					letterSpacing: '0.28em',
					textTransform: 'uppercase',
					color: 'rgba(255,255,255,0.55)',
				}}
			>
				Teaser
			</div>
		</AbsoluteFill>
	);
};