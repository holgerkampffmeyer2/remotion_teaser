import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const TeaserCinematicPoster: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();

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

	const zoom = interpolate(frame, [0, 600], [1, 1.08], {
		extrapolateRight: 'clamp',
	});

	const driftX = interpolate(frame, [0, 600], [-10, 10], {
		extrapolateRight: 'clamp',
	});

	const driftY = interpolate(frame, [0, 600], [6, -6], {
		extrapolateRight: 'clamp',
	});

	const titleGlow = interpolate(frame, [0, 40], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#050508',
				fontFamily: 'Inter, Arial, sans-serif',
				overflow: 'hidden',
				opacity: fadeOut,
			}}
		>
			<AbsoluteFill
				style={{
					transform: `scale(${zoom}) translate(${driftX}px, ${driftY}px)`,
				}}
			>
				<Img
					src={staticFile('cover.jpg')}
					style={{
						width,
						height,
						objectFit: 'cover',
						filter: 'brightness(0.72) contrast(1.06) saturate(1.05)',
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0.9) 100%)',
				}}
			/>

			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.00) 40%)',
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
						transform: `translateY(${interpolate(titleIn, [0, 1], [28, 0])}px)`,
						opacity: titleIn,
					}}
				>
					<div
						style={{
							fontSize: 86,
							fontWeight: 800,
							letterSpacing: '-0.05em',
							lineHeight: 0.96,
							textShadow: titleGlow
								? '0 0 18px rgba(255,255,255,0.10), 0 0 42px rgba(0,180,255,0.14)'
								: 'none',
						}}
					>
						DJ Hulk Sunday House Mix
					</div>

					<div
						style={{
							marginTop: 24,
							fontSize: 28,
							fontWeight: 400,
							letterSpacing: '0.01em',
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