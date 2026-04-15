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

const INSTAGRAM_CONFIG = {
	titleSize: 72,
	subtitleSize: 24,
	visualizerMultiplier: 55,
	barCount: 64,
};

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
	barCount: 64,
	waveFrequency: 8,
	bgBrightness: 0.72,
	bgContrast: 1.06,
	bgSaturate: 1.05,
	enableLightLeaks: DEFAULT_EFFECTS.enableLightLeaks,
	enableStarburst: DEFAULT_EFFECTS.enableStarburst,
	lightLeaksIntensity: DEFAULT_EFFECTS.lightLeaksIntensity,
	starburstIntensity: DEFAULT_EFFECTS.starburstIntensity,
	starburstCenterX: DEFAULT_EFFECTS.starburstCenterX,
	starburstCenterY: DEFAULT_EFFECTS.starburstCenterY,
};

export const TeaserCinematicPoster: React.FC<TeaserProps> = (props) => {
	const {
		audioFile,
		imageFile,
		title,
		subtitle,
		format,
		colorPalette = DEFAULT_VARS.colorPalette,
		speedMultiplier = DEFAULT_VARS.speedMultiplier,
		equalizerStyle = DEFAULT_VARS.equalizerStyle,
		textEffect = DEFAULT_VARS.textEffect,
		vignette = DEFAULT_VARS.vignette,
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
	const {width, height, fps} = useVideoConfig();
	const audioData = useAudioData(staticFile(audioFile));

	const isInstagram = format === 'instagram';

	const effectiveFrame = Math.floor(frame / speedMultiplier);
	
	const titleIn = spring({
		frame,
		fps,
		config: {damping: 18, stiffness: 110, mass: 0.9},
	});

	const subtitleIn = spring({
		frame: frame - 18,
		fps,
		config: {damping: 20, stiffness: 90, mass: 1},
	});

	const fadeOut = interpolate(frame, [470, 600], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const zoom = interpolate(effectiveFrame, [0, 600], [1, bgZoom], {
		extrapolateRight: 'clamp',
	});

	const driftX = interpolate(effectiveFrame, [0, 600], [-10, 10], {
		extrapolateRight: 'clamp',
	});

	const driftY = interpolate(effectiveFrame, [0, 600], [6, -6], {
		extrapolateRight: 'clamp',
	});

	const actualBarCount = isInstagram ? 64 : barCount;
	let bars: number[] = Array.from({length: actualBarCount}, () => 0.06);
	
	const beatPhase = frame % 60;
	const beatMultiplier = beatPhase < 15 ? beatPhase / 15 : 1;
	
	if (audioData) {
		const rawBars = visualizeAudio({
			fps,
			frame,
			audioData,
			numberOfSamples: actualBarCount,
		});
		bars = rawBars.map(v => v * beatMultiplier);
	}

	const colors = COLORS[colorPalette % COLORS.length];

	const titleSize = isInstagram ? INSTAGRAM_CONFIG.titleSize : 86;
	const subtitleSize = isInstagram ? INSTAGRAM_CONFIG.subtitleSize : 28;
	const visualizerMultiplier = isInstagram ? INSTAGRAM_CONFIG.visualizerMultiplier : 70;

	const getTextEffectStyle = () => {
		switch (textEffect) {
			case 'slide':
				return {
					transform: `translateY(${interpolate(titleIn, [0, 1], [28, 0])}px)`,
				};
			case 'scale':
				return {
					transform: `scale(${interpolate(titleIn, [0, 1], [0.9, 1])})`,
				};
			case 'pulse':
				return {
					opacity: titleIn,
				};
			case 'glow':
			default:
				return {
					opacity: titleIn,
					textShadow: '0 0 35px rgba(255,255,255,0.5), 0 0 70px rgba(0,180,255,0.6), 0 0 110px rgba(0,180,255,0.4)',
				};
		}
	};

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#050508',
				fontFamily: 'Inter, Arial, sans-serif',
				overflow: 'hidden',
				opacity: fadeOut,
			}}
		>
			<Audio src={staticFile(audioFile)} />
			
			<AbsoluteFill
				style={{
					transform: `scale(${zoom}) translate(${driftX}px, ${driftY}px)`,
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
			</AbsoluteFill>

			{enableLightLeaks && (
				<LightLeaks frame={frame} width={width} height={height} intensity={lightLeaksIntensity} />
			)}

			{enableStarburst && (
				<Starburst frame={frame} width={width} height={height} intensity={starburstIntensity} centerX={starburstCenterX ?? 0.5} centerY={starburstCenterY ?? 0.3} />
			)}

			<AbsoluteFill
				style={{
					background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0.9) 100%)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 110,
					padding: '0 90px',
					color: 'white',
				}}
			>
				<div
					style={{
						maxWidth: 1300,
						margin: '0 auto',
						...getTextEffectStyle(),
					}}
				>
					<div
						style={{
							fontSize: titleSize,
							fontWeight: 800,
							letterSpacing: '-0.05em',
							lineHeight: 0.96,
						}}
					>
						{title}
					</div>

					<div
						style={{
							marginTop: 24,
							fontSize: subtitleSize,
							fontWeight: 400,
							letterSpacing: '0.01em',
							color: 'rgba(255,255,255,0.88)',
							opacity: subtitleIn,
							transform: `translateY(${interpolate(subtitleIn, [0, 1], [16, 0])}px)`,
						}}
					>
						{subtitle}
					</div>
				</div>
			</div>

			{(
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
						opacity: 0.85,
						filter: 'drop-shadow(0 0 12px rgba(0,180,255,0.25))',
					}}
				>
					{bars.map((v, i) => {
						const barIndex = i / actualBarCount;
						const bassBoost = barIndex < 0.15 ? 2.2 : barIndex < 0.3 ? 1.6 : 1;
						const midBoost = barIndex > 0.3 && barIndex < 0.6 ? 1.3 : 1;
						const freqBoost = Math.sin(barIndex * Math.PI) * 0.6 + 0.6;
						const baseWave = Math.sin(frame / (waveFrequency * 1.5) + i * 0.4) * 18;
						const heightBar = Math.max(10, v * visualizerMultiplier * bassBoost * midBoost * (0.3 + freqBoost * 0.7) + baseWave + 20);
						return (
							<div
								key={i}
								style={{
									flex: 1,
									height: heightBar,
									borderRadius: 999,
									background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 48%, ${colors.end} 100%)`,
									boxShadow: '0 0 10px rgba(0,185,255,0.28)',
								}}
							/>
						);
					})}
				</div>
			)}

			<div
				style={{
					position: 'absolute',
					left: 90,
					top: 70,
					color: 'rgba(255,255,255,0.7)',
					fontSize: 14,
					letterSpacing: '0.35em',
					textTransform: 'uppercase',
				}}
			>
				Teaser
			</div>
		</AbsoluteFill>
	);
};