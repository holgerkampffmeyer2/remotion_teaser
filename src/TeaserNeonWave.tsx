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
	barCount: 48,
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
	bgZoom: 1.12,
	barCount: 32,
	waveFrequency: 8,
	bgBrightness: 0.55,
	bgContrast: 1.08,
	bgSaturate: 1.15,
	enableLightLeaks: DEFAULT_EFFECTS.enableLightLeaks,
	enableStarburst: DEFAULT_EFFECTS.enableStarburst,
	lightLeaksIntensity: DEFAULT_EFFECTS.lightLeaksIntensity,
	starburstIntensity: DEFAULT_EFFECTS.starburstIntensity,
	starburstCenterX: DEFAULT_EFFECTS.starburstCenterX,
	starburstCenterY: DEFAULT_EFFECTS.starburstCenterY,
};

export const TeaserNeonWave: React.FC<TeaserProps> = (props) => {
	const {
		audioFile,
		imageFile,
		title,
		subtitle,
		format,
		colorPalette = DEFAULT_VARS.colorPalette,
		speedMultiplier = DEFAULT_VARS.speedMultiplier,
		textEffect = DEFAULT_VARS.textEffect,
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
		frame: frame - 25,
		fps,
		config: {damping: 18, stiffness: 100, mass: 0.9},
	});

	const bgZoomAnim = interpolate(effectiveFrame, [0, 480], [1, bgZoom], {
		extrapolateRight: 'clamp',
	});

	const bgPanX = interpolate(effectiveFrame, [0, 480], [-12, 12], {
		extrapolateRight: 'clamp',
	});

	const bgPanY = interpolate(effectiveFrame, [0, 480], [10, -10], {
		extrapolateRight: 'clamp',
	});

	const titleGlow = interpolate(frame, [0, 600], [0.15, 0.35], {
		extrapolateRight: 'clamp',
	});

	const actualBarCount = isInstagram ? 32 : barCount;
	let bars: number[] = Array.from({length: actualBarCount}, () => 0.08);

	if (audioData) {
		const rawBars = visualizeAudio({
			fps,
			frame,
			audioData,
			numberOfSamples: actualBarCount,
		});
		bars = rawBars;
	}

	const colors = COLORS[colorPalette % COLORS.length];

	const titleSize = isInstagram ? INSTAGRAM_CONFIG.titleSize : 86;
	const subtitleSize = isInstagram ? INSTAGRAM_CONFIG.subtitleSize : 28;
	const visualizerMultiplier = isInstagram ? 55 : 80;

	const getBarColor = (idx: number) => {
		const colors = COLORS[colorPalette % COLORS.length];
		if (idx % 2 === 0) return colors.start;
		return colors.end;
	};

	const getTextEffectStyle = () => {
		switch (textEffect) {
			case 'slide':
				return {
					transform: `translateY(${interpolate(frame, [0, 35], [20, 0])}px)`,
				};
			case 'scale':
				return {
					transform: `scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
				};
			case 'pulse':
				return {
					textShadow: `0 0 35px rgba(0,255,255,0.8), 0 0 70px rgba(0,255,255,0.6), 0 0 110px rgba(0,255,255,0.4)`,
				};
			case 'glow':
			default:
				return {
					textShadow: `0 0 35px rgba(0,255,255,0.8), 0 0 70px rgba(0,255,255,0.6), 0 0 110px rgba(0,255,255,0.4)`,
				};
		}
	};

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#05050a',
				fontFamily: 'Inter, Arial, sans-serif',
				overflow: 'hidden',
			}}
		>
			<Audio src={staticFile(audioFile)} />
			
			<AbsoluteFill
				style={{
					transform: `scale(${bgZoomAnim}) translate(${bgPanX}px, ${bgPanY}px)`,
				}}
			>
				<Img
					src={staticFile(imageFile)}
					style={{
						width,
						height,
						objectFit: 'cover',
						filter: `brightness(${bgBrightness}) saturate(${bgSaturate}) contrast(${bgContrast})`,
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
					background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.8) 100%)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 80px',
				}}
			>
				<div
					style={{
						width: '100%',
						maxWidth: 1200,
						textAlign: 'center',
						color: 'white',
						...getTextEffectStyle(),
					}}
				>
					<div
						style={{
							fontSize: titleSize,
							fontWeight: 800,
							letterSpacing: '-0.04em',
							lineHeight: 1.02,
							opacity: titleIn,
						}}
					>
						{title}
					</div>

					<div
						style={{
							marginTop: 26,
							fontSize: subtitleSize,
							fontWeight: 500,
							letterSpacing: '0.02em',
							color: 'rgba(255,255,255,0.88)',
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
					bottom: 120,
					transform: 'translateX(-50%)',
					width: '78%',
					maxWidth: 1100,
					height: 360,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 3,
					opacity: 0.9,
				}}
			>
				{bars.map((v, i) => {
					const phaseOffset = i * 0.35;
					const waveY = Math.sin(frame / 12 + phaseOffset) * 40;
					const barHeight = Math.max(8, v * visualizerMultiplier * 1.8);
					const mirrorOffset = Math.sin(frame / 8 + i * 0.12) * 25;

					return (
						<div
							key={i}
							style={{
								position: 'relative',
								flex: 1,
								height: 360,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div
								style={{
									width: '100%',
									height: barHeight,
									transform: `translateY(${-mirrorOffset}px)`,
									borderRadius: 999,
									background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 40%, ${colors.end} 100%)`,
									boxShadow: `0 0 ${8 + v * 15}px ${colors.mid}`,
								}}
							/>
							<div
								style={{
									width: '100%',
									height: barHeight,
									transform: `translateY(${mirrorOffset + 8}px)`,
									borderRadius: 999,
									background: `linear-gradient(180deg, ${colors.end} 0%, ${colors.mid} 40%, ${colors.start} 100%)`,
									boxShadow: `0 0 ${8 + v * 15}px ${colors.start}`,
									opacity: 0.7,
								}}
							/>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};