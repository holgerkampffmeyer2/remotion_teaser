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

export const TeaserNeonWave: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const audioData = useAudioData(staticFile('mix.mp3'));

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

	const bgZoom = interpolate(frame, [0, 480], [1, 1.12], {
		extrapolateRight: 'clamp',
	});

	const bgPanX = interpolate(frame, [0, 480], [-12, 12], {
		extrapolateRight: 'clamp',
	});

	const bgPanY = interpolate(frame, [0, 480], [10, -10], {
		extrapolateRight: 'clamp',
	});

	const titleGlow = interpolate(frame, [0, 600], [0.15, 0.35], {
		extrapolateRight: 'clamp',
	});

	let bars: number[] = Array.from({length: 32}, () => 0.08);

	if (audioData) {
		bars = visualizeAudio({
			fps,
			frame,
			audioData,
			numberOfSamples: 32,
		});
	}

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#05050a',
				fontFamily: 'Inter, Arial, sans-serif',
				overflow: 'hidden',
			}}
		>
			<Audio src={staticFile('mix.mp3')} />
			
			<AbsoluteFill
				style={{
					transform: `scale(${bgZoom}) translate(${bgPanX}px, ${bgPanY}px)`,
				}}
			>
				<Img
					src={staticFile('cover.jpg')}
					style={{
						width,
						height,
						objectFit: 'cover',
						filter: 'brightness(0.55) saturate(1.15) contrast(1.08)',
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.8) 100%)',
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
					transform: `translateY(${interpolate(frame, [0, 35], [20, 0], {
						extrapolateRight: 'clamp',
					})}px)`,
				}}
			>
				<div
					style={{
						width: '100%',
						maxWidth: 1200,
						textAlign: 'center',
						color: 'white',
						textShadow: `0 0 18px rgba(0,255,255,${titleGlow})`,
					}}
				>
					<div
						style={{
							fontSize: 86,
							fontWeight: 800,
							letterSpacing: '-0.04em',
							lineHeight: 1.02,
							opacity: titleIn,
							transform: `scale(${interpolate(titleIn, [0, 1], [0.94, 1])})`,
						}}
					>
						DJ Hulk Sunday House Mix
					</div>

					<div
						style={{
							marginTop: 26,
							fontSize: 28,
							fontWeight: 500,
							letterSpacing: '0.02em',
							color: 'rgba(255,255,255,0.88)',
							opacity: subtitleIn,
							transform: `translateY(${interpolate(subtitleIn, [0, 1], [16, 0])}px)`,
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
					bottom: 120,
					transform: 'translateX(-50%)',
					width: '78%',
					maxWidth: 1100,
					height: 180,
					display: 'flex',
					alignItems: 'flex-end',
					gap: 5,
					padding: '0 14px',
					opacity: 0.9,
					filter: 'drop-shadow(0 0 12px rgba(0,200,255,0.35))',
				}}
			>
				{bars.map((v, i) => {
					const phaseOffset = i * 0.22;
					const pulse = 1 + Math.sin(frame / 6 + phaseOffset) * 0.04;
					const wave = 1 + Math.sin(frame / 12 + phaseOffset * 1.5) * 0.02;
					const h = Math.max(10, v * 160 * pulse * wave);

					const hueShift = interpolate(i, [0, 32], [0, 30], {
						extrapolateRight: 'clamp',
					});

					return (
						<div
							key={i}
							style={{
								flex: 1,
								height: h,
								borderRadius: 999,
								background:
									'hsl(175, 85%, 62%)',
								backgroundImage: `linear-gradient(180deg, hsl(${175 - hueShift}, 85%, 75%) 0%, hsl(${195 - hueShift}, 90%, 55%) 45%, hsl(${265 - hueShift}, 80%, 60%) 100%)`,
								boxShadow: `0 0 ${12 + v * 20}px rgba(0,180,255,${0.35 + v * 0.2})`,
							}}
						/>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};