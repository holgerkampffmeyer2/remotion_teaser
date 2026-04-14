import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
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
	audioFile?: string;
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
	bgZoom: 1.1,
	barCount: 36,
	waveFrequency: 8,
	bgBrightness: 0.26,
	bgContrast: 1.05,
	bgSaturate: 1.18,
	enableLightLeaks: DEFAULT_EFFECTS.enableLightLeaks,
	enableStarburst: DEFAULT_EFFECTS.enableStarburst,
	lightLeaksIntensity: DEFAULT_EFFECTS.lightLeaksIntensity,
	starburstIntensity: DEFAULT_EFFECTS.starburstIntensity,
	starburstCenterX: DEFAULT_EFFECTS.starburstCenterX,
	starburstCenterY: DEFAULT_EFFECTS.starburstCenterY,
};

const GlassCard: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({children, style}) => {
	return (
		<div
			style={{
				backdropFilter: 'blur(18px)',
				background: 'linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06))',
				border: '1px solid rgba(255,255,255,0.14)',
				boxShadow: '0 10px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.12)',
				borderRadius: 28,
				...style,
			}}
		>
			{children}
		</div>
	);
};

const FormatFrame: React.FC<{
	label: string;
	ratio: 'wide' | 'vertical';
	frame: number;
	side: 'left' | 'right';
	colorPalette: number;
	barCount: number;
}> = ({label, ratio, frame, side, colorPalette, barCount}) => {
	const xIn = spring({
		frame: frame - (side === 'left' ? 10 : 18),
		fps: 30,
		config: {damping: 16, stiffness: 120, mass: 0.9},
	});

	const translateX = interpolate(xIn, [0, 1], [side === 'left' ? -50 : 50, 0]);
	const opacity = interpolate(xIn, [0, 1], [0, 1]);

	const width = ratio === 'wide' ? 340 : 200;
	const height = ratio === 'wide' ? 192 : 356;

	const colors = COLORS[colorPalette % COLORS.length];

	return (
		<div
			style={{
				width,
				height,
				opacity,
				transform: `translateX(${translateX}px)`,
				borderRadius: 30,
				padding: 12,
				background: 'linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))',
				border: '1px solid rgba(255,255,255,0.14)',
				boxShadow: '0 10px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
				position: 'relative',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 12,
					borderRadius: 22,
					border: '1px solid rgba(120,255,235,0.28)',
					background: 'radial-gradient(circle at 50% 30%, rgba(42,189,255,0.18), rgba(0,0,0,0) 55%)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 16,
						right: 16,
						bottom: 18,
						height: ratio === 'wide' ? 56 : 82,
						display: 'flex',
						alignItems: 'flex-end',
						gap: 4,
					}}
				>
					{new Array(18).fill(true).map((_, i) => {
						const h = 8 + Math.max(4, Math.sin(frame / 7 + i * 0.45) * 16 + 18);
						return (
							<div
								key={i}
								style={{
									flex: 1,
									height: h,
									borderRadius: 999,
									background: `linear-gradient(180deg, ${colors.start} 0%, ${colors.mid} 48%, ${colors.end} 100%)`,
									boxShadow: '0 0 14px rgba(0,180,255,0.22)',
								}}
							/>
						);
					})}
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					top: 18,
					left: 20,
					fontSize: 16,
					letterSpacing: '0.16em',
					textTransform: 'uppercase',
					color: 'rgba(255,255,255,0.66)',
				}}
			>
				{label}
			</div>
		</div>
	);
};

export const TeaserPrismGlass: React.FC<TeaserProps> = (props) => {
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

	const isInstagram = format === 'instagram';
	const effectiveFrame = Math.floor(frame / speedMultiplier);

	const bgScale = interpolate(effectiveFrame, [0, 600], [1, bgZoom], {
		extrapolateRight: 'clamp',
	});

	const bgRotate = interpolate(effectiveFrame, [0, 600], [-1.4, 1.4], {
		extrapolateRight: 'clamp',
	});

	const bgY = interpolate(effectiveFrame, [0, 600], [10, -10], {
		extrapolateRight: 'clamp',
	});

	const coverIn = spring({
		frame,
		fps,
		config: {damping: 18, stiffness: 110, mass: 1},
	});

	const titleIn = spring({
		frame: frame - 12,
		fps,
		config: {damping: 18, stiffness: 120, mass: 0.9},
	});

	const subtitleIn = spring({
		frame: frame - 24,
		fps,
		config: {damping: 20, stiffness: 96, mass: 1},
	});

	const fadeOut = interpolate(frame, [520, 600], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const colors = COLORS[colorPalette % COLORS.length];

	const getTextEffectStyle = () => {
		switch (textEffect) {
			case 'slide':
				return {
					transform: `translateY(${interpolate(titleIn, [0, 1], [22, 0])}px)`,
				};
			case 'scale':
				return {
					transform: `translateY(${interpolate(titleIn, [0, 1], [22, 0])}px) scale(${interpolate(coverIn, [0, 1], [0.88, 1])})`,
				};
			case 'pulse':
				return {
					opacity: titleIn,
				};
			case 'glow':
			default:
				return {
					opacity: titleIn,
					transform: `translateY(${interpolate(titleIn, [0, 1], [22, 0])}px)`,
					textShadow: '0 0 20px rgba(255,255,255,0.08), 0 0 50px rgba(77,174,255,0.14)',
				};
		}
	};

	return (
		<AbsoluteFill
			style={{
				background: 'radial-gradient(circle at 50% 20%, rgba(44,98,255,0.22), rgba(0,0,0,0) 32%), radial-gradient(circle at 20% 80%, rgba(0,255,220,0.12), rgba(0,0,0,0) 28%), linear-gradient(180deg, #070A12 0%, #09060D 100%)',
				fontFamily: 'Inter, Arial, sans-serif',
				color: 'white',
				overflow: 'hidden',
				opacity: fadeOut,
			}}
		>
			{audioFile && <Audio src={staticFile(audioFile)} />}
			<AbsoluteFill
				style={{
					transform: `scale(${bgScale}) rotate(${bgRotate}deg) translateY(${bgY}px)`,
				}}
			>
				<Img
					src={staticFile(imageFile)}
					style={{
						width,
						height,
						objectFit: 'cover',
						opacity: bgBrightness,
						filter: `blur(8px) saturate(${bgSaturate}) contrast(${bgContrast})`,
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
					background: 'linear-gradient(180deg, rgba(5,7,16,0.18) 0%, rgba(5,7,16,0.58) 45%, rgba(5,7,16,0.86) 100%)',
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
						position: 'relative',
						width: 1280,
						height: 760,
					}}
				>
					<div
						style={{
							position: 'absolute',
							left: 40,
							top: 140,
						}}
					>
						<FormatFrame
							label="YouTube 16:9"
							ratio="wide"
							frame={frame}
							side="left"
							colorPalette={colorPalette}
							barCount={barCount}
						/>
					</div>

					<div
						style={{
							position: 'absolute',
							right: 56,
							top: 58,
						}}
					>
						<FormatFrame
							label="Reels 9:16"
							ratio="vertical"
							frame={frame}
							side="right"
							colorPalette={colorPalette}
							barCount={barCount}
						/>
					</div>

					<Sequence from={0}>
						<div
							style={{
								position: 'absolute',
								left: '50%',
								top: 100,
								transform: `translateX(-50%) scale(${interpolate(coverIn, [0, 1], [0.88, 1])})`,
								opacity: coverIn,
							}}
						>
							<GlassCard
								style={{
									width: 430,
									padding: 16,
								}}
							>
								<div
									style={{
										position: 'relative',
										aspectRatio: '1 / 1',
										borderRadius: 24,
										overflow: 'hidden',
										boxShadow: '0 16px 50px rgba(0,0,0,0.34), 0 0 60px rgba(0,180,255,0.10)',
									}}
								>
									<Img
										src={staticFile(imageFile)}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
									<div
										style={{
											position: 'absolute',
											inset: 0,
											background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0))',
										}}
									/>
								</div>
							</GlassCard>
						</div>
					</Sequence>

					<Sequence from={8}>
						<div
							style={{
								position: 'absolute',
								left: '50%',
								top: 555,
								transform: 'translateX(-50%)',
								width: 1020,
							}}
						>
							<GlassCard
								style={{
									padding: '28px 34px 30px 34px',
								}}
							>
								<div
									style={{
										fontSize: 74,
										fontWeight: 850,
										letterSpacing: '-0.055em',
										lineHeight: 0.96,
										...getTextEffectStyle(),
									}}
								>
									{title}
								</div>

								<div
									style={{
										marginTop: 18,
										fontSize: 25,
										fontWeight: 500,
										color: 'rgba(255,255,255,0.8)',
										opacity: subtitleIn,
										transform: `translateY(${interpolate(subtitleIn, [0, 1], [12, 0])}px)`,
									}}
								>
									{subtitle}
								</div>
							</GlassCard>
						</div>
					</Sequence>
				</div>
			</div>
		</AbsoluteFill>
	);
};