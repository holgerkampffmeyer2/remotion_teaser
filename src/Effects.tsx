import React, {useMemo} from 'react';
import {random} from 'remotion';

type LightLeaksProps = {
	frame: number;
	width: number;
	height: number;
	intensity?: number;
};

export const LightLeaks: React.FC<LightLeaksProps> = ({frame, width, height, intensity = 1}) => {
	const leaks = useMemo(() => {
		return [
			{ x: width * 0.05, y: height * 0.08, radius: 500, color: '255,240,180' },
			{ x: width * 0.95, y: height * 0.12, radius: 550, color: '255,220,140' },
			{ x: width * 0.15, y: height * 0.92, radius: 480, color: '255,230,160' },
			{ x: width * 0.85, y: height * 0.88, radius: 420, color: '255,200,120' },
			{ x: width * 0.5, y: height * 0.5, radius: 350, color: '255,250,200' },
		];
	}, [width, height]);

	return (
		<>
			{leaks.map((leak, i) => {
				const driftX = Math.sin(frame * 0.02 + i * 1.5) * 80;
				const driftY = Math.cos(frame * 0.015 + i * 2) * 60;
				const pulse = 0.6 + Math.sin(frame * 0.08 + i * 1.2) * 0.4;
				const scale = 0.8 + Math.sin(frame * 0.06 + i) * 0.2;
				const currentOpacity = pulse * intensity * scale;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: leak.x + driftX - leak.radius,
							top: leak.y + driftY - leak.radius,
							width: leak.radius * 2,
							height: leak.radius * 2,
							borderRadius: '50%',
							background: `radial-gradient(circle, rgba(${leak.color},${currentOpacity * 0.9}) 0%, rgba(${leak.color},${currentOpacity * 0.6}) 25%, rgba(${leak.color},${currentOpacity * 0.3}) 50%, rgba(${leak.color},${currentOpacity * 0.1}) 75%, transparent 100%)`,
							filter: 'blur(35px)',
							pointerEvents: 'none',
						}}
					/>
				);
			})}
		</>
	);
};

type StarburstProps = {
	frame: number;
	width: number;
	height: number;
	intensity?: number;
	centerX?: number;
	centerY?: number;
};

export const Starburst: React.FC<StarburstProps> = ({frame, width, height, intensity = 1, centerX = 0.5, centerY = 0.3}) => {
	const centerXPos = width * centerX;
	const centerYPos = height * centerY;

	const rays = useMemo(() => {
		return new Array(20).fill(true).map((_, i) => ({
			angle: (i / 20) * 360,
			length: 250 + random(`srlen${i}`) * 180,
			width: 4 + random(`srw${i}`) * 6,
		}));
	}, []);

	return (
		<div
			style={{
				position: 'absolute',
				left: centerXPos,
				top: centerYPos,
				transform: 'translate(-50%, -50%)',
				width: 1,
				height: 1,
			}}
		>
			{rays.map((ray, i) => {
				const rotate = ray.angle + frame * 0.5;
				const pulse = 0.6 + Math.sin(frame * 0.06 + i * 0.6) * 0.4;
				const alpha = (0.15 + random(`sra${i}`) * 0.1) * pulse * intensity;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: ray.width,
							height: ray.length,
							transformOrigin: 'center bottom',
							transform: `translate(-50%, -100%) rotate(${rotate}deg)`,
							background: `linear-gradient(180deg, rgba(255,255,255,${alpha}) 0%, rgba(255,245,220,${alpha * 0.6}) 40%, transparent 100%)`,
							pointerEvents: 'none',
						}}
					/>
				);
			})}
		</div>
	);
};

export type EffectsConfig = {
	enableLightLeaks: boolean;
	enableStarburst: boolean;
	lightLeaksIntensity: number;
	starburstIntensity: number;
	starburstCenterX: number;
	starburstCenterY: number;
};

export const DEFAULT_EFFECTS: EffectsConfig = {
	enableLightLeaks: false,
	enableStarburst: false,
	lightLeaksIntensity: 0.7,
	starburstIntensity: 0.6,
	starburstCenterX: 0.5,
	starburstCenterY: 0.28,
};