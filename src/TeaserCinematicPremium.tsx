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

export type VariationProps = {
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

export type TeaserProps = {
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
	bgContrast: 1.08,
	bgSaturate: 1.04,
	enableLightLeaks: DEFAULT_EFFECTS.enableLightLeaks,
	enableStarburst: DEFAULT_EFFECTS.enableStarburst,
	lightLeaksIntensity: DEFAULT_EFFECTS.lightLeaksIntensity,
	starburstIntensity: DEFAULT_EFFECTS.starburstIntensity,
	starburstCenterX: DEFAULT_EFFECTS.starburstCenterX,
	starburstCenterY: DEFAULT_EFFECTS.starburstCenterY,
};

export const TeaserCinematicPremium: React.FC<TeaserProps> = (props) => {
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
	const {fps, width, height} = useVideoConfig();
	const audioData = useAudioData(staticFile(audioFile));

	const isInstagram = format === 'instagram';

	const effectiveFrame = Math.floor(frame / speedMultiplier);
	
	const bgZoomAnim = interpolate(Math.sin(effectiveFrame / 60), [-1, 1], [1.0, bgZoom], {
		extrapolateRight: 'clamp',
	});

	const textDrift = (effectiveFrame / 600) * (isInstagram ? 80 : 150);
	const textZoom = interpolate(Math.sin(effectiveFrame / 60), [-1, 1], [1, 1.04], {
		extrapolateRight: 'clamp',
	});

	const fadeOut = interpolate(frame, [470, 600], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const actualBarCount = isInstagram ? INSTAGRAM_CONFIG.barCount : barCount;
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

	const titleSize = isInstagram ? INSTAGRAM_CONFIG.titleSize : 88;
	const subtitleSize = isInstagram ? INSTAGRAM_CONFIG.subtitleSize : 28;
	const visualizerMultiplier = isInstagram ? INSTAGRAM_CONFIG.visualizerMultiplier : 70;

	const textBottom = isInstagram ? 280 : 108;
	const textPadding = isInstagram ? '0 60px' : '0 90px';
	const textMaxWidth = isInstagram ? 900 : 1320;
	const equalizerBottom = isInstagram ? 280 : 34;
	const equalizerWidth = isInstagram ? '90%' : '82%';
	const equalizerMaxWidth = isInstagram ? 900 : 1180;
	const equalizerHeight = isInstagram ? 100 : 82;
	const equalizerGap = isInstagram ? 3 : 4;

	const getTextEffectStyle = () => {
		switch (textEffect) {
			case 'slide':
				return {
					transform: `translateX(${textDrift}px)`,
				};
			case 'scale':
				return {
					transform: `scale(${textZoom})`,
				};
			case 'pulse':
				return {
					animation: 'pulse 0.5s ease-in-out infinite alternate',
				};
			case 'glow':
			default:
				return {
					textShadow: '0 0 14px rgba(255,255,255,0.08), 0 0 38px rgba(0,180,255,0.16)',
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
					transform: `scale(${bgZoomAnim})`,
				}}
			>
				<Img
					src={staticFile(imageFile)}
					style={{
						width: '100%',
						height: '100%',
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
					background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.68) 78%, rgba(0,0,0,0.92) 100%)',
				}}
			/>

			<AbsoluteFill
				style={{
					background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 36%)',
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
					bottom: textBottom,
					padding: textPadding,
				}}
			>
				<div
					style={{
						maxWidth: textMaxWidth,
						margin: '0 auto',
						color: 'white',
						textAlign: isInstagram ? 'center' : 'left',
						...getTextEffectStyle(),
					}}
				>
					<div
						style={{
							fontSize: titleSize,
							fontWeight: 800,
							letterSpacing: '-0.055em',
							lineHeight: 0.94,
						}}
					>
						{title}
					</div>

					<div
						style={{
							marginTop: 22,
							fontSize: subtitleSize,
							fontWeight: 400,
							letterSpacing: '0.01em',
							color: 'rgba(255,255,255,0.88)',
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
					bottom: equalizerBottom,
					transform: 'translateX(-50%)',
					width: equalizerWidth,
					maxWidth: equalizerMaxWidth,
					height: equalizerHeight,
					display: 'flex',
					alignItems: 'flex-end',
					gap: equalizerGap,
					opacity: 0.92,
					filter: `drop-shadow(0 0 16px rgba(0,190,255,0.26))`,
				}}
			>
				{bars.map((v, i) => {
					const barIndex = i / actualBarCount;
					const bassBoost = barIndex < 0.15 ? 2.2 : barIndex < 0.3 ? 1.6 : 1;
					const midBoost = barIndex > 0.3 && barIndex < 0.6 ? 1.3 : 1;
					const freqBoost = Math.sin(barIndex * Math.PI) * 0.6 + 0.6;
					const baseWave = Math.sin(frame / (waveFrequency * 1.5) + i * 0.4) * 20;
					const heightBar = Math.max(10, v * visualizerMultiplier * bassBoost * midBoost * (0.3 + freqBoost * 0.7) + baseWave + 25);
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