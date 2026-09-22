import { Brain, Eye, Navigation } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { PLANET_COLOR_CONFIGS } from '../constants';
import { KidAvatar } from './avatarManager';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidName,
	getStoredSelectedSkill,
} from './progressTracker';
import { getSkillDefinition } from './skillManager';

const CosmicQuestLoader = memo(function CosmicQuestLoader({
	selectedSkill,
	kidName,
	kidAge,
	kidAvatar,
}) {
	// Dynamically resolve child's profile from storage if not passed
	const effectiveName =
		(kidName && String(kidName).trim()) || getStoredKidName() || 'Explorer';
	const effectiveAge = Number(kidAge) || Number(getStoredKidAge()) || 5;
	const effectiveAvatar =
		kidAvatar || getStoredKidAvatar() || 'boy-astronaut-1';

	// Dynamically resolve skillset definition and color theme
	const rawSkill =
		(selectedSkill && String(selectedSkill).trim()) ||
		getStoredSelectedSkill() ||
		'Visual';

	const skillDef = getSkillDefinition(rawSkill);
	const skillName = skillDef.name || rawSkill;
	const skillIcon = skillDef.icon || '🚀';
	const isAnalytical = skillDef.id === 'analytical_thinking';

	const planetTheme =
		PLANET_COLOR_CONFIGS[skillDef.color] ||
		(isAnalytical ? PLANET_COLOR_CONFIGS.purple : PLANET_COLOR_CONFIGS.cyan);

	const missionSteps = useMemo(
		() => [
			{
				icon: '🚀',
				title: `Engaging Sub-Light Thrusters towards Planet ${skillName}...`,
			},
			{
				icon: '📡',
				title: `Locking Navigational Beacon on ${skillName} Orbital Coordinates...`,
			},
			{
				icon: '✨',
				title: `AI Core Synthesizing Age ${effectiveAge} Challenges for ${effectiveName}...`,
			},
			{
				icon: skillIcon,
				title: `Calibrating ${skillName} Puzzles & Creative Spatial Logic...`,
			},
			{
				icon: '🪐',
				title: `Approaching Orbital Insertion at Planet ${skillName}! Preparing Descent...`,
			},
		],
		[effectiveName, effectiveAge, skillName, skillIcon],
	);

	const [stepIndex, setStepIndex] = useState(0);
	const [simulatedDistance, setSimulatedDistance] = useState(14800);

	useEffect(() => {
		const interval = setInterval(() => {
			setStepIndex((prev) => (prev + 1) % missionSteps.length);
		}, 1800);
		return () => clearInterval(interval);
	}, [missionSteps.length]);

	// Simulate distance countdown as the spaceship approaches the planet
	useEffect(() => {
		const distTimer = setInterval(() => {
			setSimulatedDistance((prev) => {
				if (prev <= 1200) return 14800;
				return Math.max(1200, prev - 450);
			});
		}, 300);
		return () => clearInterval(distTimer);
	}, []);

	const currentStep = missionSteps[stepIndex] || missionSteps[0];

	return (
		<div className='flex flex-col items-center justify-center p-4 sm:p-8 text-center animate-in fade-in duration-500 max-w-xl mx-auto w-full select-none'>
			<style>{`
				/* ─── 3D VORTEX & SPACE TRAVEL ANIMATIONS ─── */

				/* Spaceship 3D flight: traveling from foreground directly into the center of the planet */
				@keyframes shipTravelToCenter {
					0% {
						transform: translate3d(0px, 0px, 60px) rotate(52deg) scale(1.22);
						filter: drop-shadow(0 0 16px rgba(0, 229, 255, 0.85));
						opacity: 1;
					}
					28% {
						transform: translate3d(45px, -34px, 35px) rotate(52deg) scale(0.98);
						filter: drop-shadow(0 0 14px rgba(0, 229, 255, 0.8));
						opacity: 1;
					}
					58% {
						transform: translate3d(95px, -72px, 0px) rotate(52deg) scale(0.68);
						filter: drop-shadow(0 0 12px rgba(0, 229, 255, 0.75));
						opacity: 1;
					}
					82% {
						transform: translate3d(140px, -107px, -45px) rotate(52deg) scale(0.38);
						filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.95));
						opacity: 1;
					}
					90% {
						transform: translate3d(156px, -119px, -70px) rotate(52deg) scale(0.2);
						filter: drop-shadow(0 0 24px rgba(255, 255, 255, 1));
						opacity: 0.85;
					}
					95% {
						transform: translate3d(162px, -124px, -85px) rotate(52deg) scale(0.12);
						opacity: 0;
					}
					97% {
						transform: translate3d(-10px, 8px, 65px) rotate(52deg) scale(1.25);
						opacity: 0;
					}
					100% {
						transform: translate3d(0px, 0px, 60px) rotate(52deg) scale(1.22);
						opacity: 1;
					}
				}

				/* Swirling 3D Vortex Core Spiral */
				@keyframes vortexCenterSpin {
					0% {
						transform: translate(-50%, -50%) rotate(0deg);
					}
					100% {
						transform: translate(-50%, -50%) rotate(360deg);
					}
				}

				/* Concentric Chromatic Wormhole Rings expanding outward from the planet */
				@keyframes chromaticVortexExpand {
					0% {
						width: 24px;
						height: 24px;
						transform: translate(-50%, -50%) rotate(0deg) scale(0.2);
						opacity: 0;
					}
					20% {
						opacity: 0.9;
					}
					70% {
						opacity: 0.45;
					}
					100% {
						width: 440px;
						height: 440px;
						transform: translate(-50%, -50%) rotate(180deg) scale(1.5);
						opacity: 0;
					}
				}

				/* 360-degree radial warp streaks rushing outwards */
				@keyframes warpStreakRadial {
					0% {
						transform: translate(-50%, -50%) rotate(var(--rot)) translateY(20px) scaleY(0.2);
						opacity: 0;
					}
					30% {
						opacity: 0.9;
					}
					75% {
						opacity: 0.8;
					}
					100% {
						transform: translate(-50%, -50%) rotate(var(--rot)) translateY(170px) scaleY(1.7);
						opacity: 0;
					}
				}

				/* Thruster flame pulse within the SVG */
				@keyframes thrusterPlasmaPulse {
					0%, 100% {
						transform: scaleY(1);
						opacity: 0.92;
					}
					50% {
						transform: scaleY(1.35);
						opacity: 1;
					}
				}

				/* Exhaust stardust particles flying backwards */
				@keyframes exhaustDrift1 {
					0% {
						transform: translate(0, 0) scale(1);
						opacity: 0.95;
					}
					100% {
						transform: translate(-35px, 45px) scale(0.2);
						opacity: 0;
					}
				}
				@keyframes exhaustDrift2 {
					0% {
						transform: translate(0, 0) scale(0.85);
						opacity: 0.8;
					}
					100% {
						transform: translate(-45px, 58px) scale(0.1);
						opacity: 0;
					}
				}
				@keyframes exhaustDrift3 {
					0% {
						transform: translate(0, 0) scale(0.7);
						opacity: 0.7;
					}
					100% {
						transform: translate(-55px, 70px) scale(0.05);
						opacity: 0;
					}
				}

				/* Planet atmospheric breathing glow */
				@keyframes planetAtmosphereGlow {
					0%, 100% {
						transform: scale(1);
						filter: drop-shadow(0 0 20px ${planetTheme.glowColor}) drop-shadow(0 0 45px rgba(99, 102, 241, 0.5));
					}
					50% {
						transform: scale(1.05);
						filter: drop-shadow(0 0 32px ${planetTheme.glowColor}) drop-shadow(0 0 60px rgba(99, 102, 241, 0.75));
					}
				}

				/* Gravitational attraction waves radiating from planet */
				@keyframes gravityPullWave {
					0% {
						transform: translate(-50%, -50%) scale(0.6);
						opacity: 0.85;
					}
					50% {
						opacity: 0.4;
					}
					100% {
						transform: translate(-50%, -50%) scale(2.2);
						opacity: 0;
					}
				}

				/* Flight trajectory beam dash animation */
				@keyframes flightPathBeamDash {
					0% {
						stroke-dashoffset: 40;
					}
					100% {
						stroke-dashoffset: 0;
					}
				}

				@keyframes warpBeam {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(300%);
					}
				}
			`}</style>

			{/* Center Cosmic Voyage Theater: Spaceship Traveling To Center of Planet in 3D Vortex */}
			<div
				className='relative w-full max-w-md sm:max-w-xl h-64 sm:h-76 rounded-3xl overflow-hidden mb-5 bg-gradient-to-br from-[#020412] via-[#060824] to-[#100B2B] border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-4 flex items-center justify-center select-none'
				style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
				{/* Deep Space Starfield Background */}
				<div className='absolute inset-0 pointer-events-none'>
					{/* Distant Twinkling Stars */}
					<div className='absolute top-6 left-12 w-1 h-1 bg-white/70 rounded-full animate-pulse' />
					<div className='absolute top-20 left-28 w-1.5 h-1.5 bg-cyan-200/80 rounded-full animate-ping' />
					<div className='absolute top-36 left-8 w-1 h-1 bg-purple-200/60 rounded-full' />
					<div className='absolute top-12 right-20 w-1 h-1 bg-amber-200/70 rounded-full animate-pulse' />
					<div className='absolute bottom-16 left-32 w-1.5 h-1.5 bg-pink-200/60 rounded-full' />
					<div className='absolute bottom-8 right-24 w-1 h-1 bg-cyan-100/70 rounded-full animate-ping' />
					<div className='absolute top-4 left-1/3 w-1 h-1 bg-white/60 rounded-full' />
				</div>

				{/* ─── 3D VORTEX PORTAL (Centered in the Canvas) ─── */}
				<div
					className='absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none z-10'
					style={{ transformStyle: 'preserve-3d' }}>
					{/* Swirling Spiral Nebula Disk Behind the Planet */}
					<div
						className='absolute top-1/2 left-1/2 w-full h-full rounded-full opacity-35 blur-xl pointer-events-none'
						style={{
							background: `conic-gradient(from 0deg, transparent 0deg, ${planetTheme.pathColor} 70deg, transparent 150deg, rgba(168,85,247,0.5) 250deg, transparent 360deg)`,
							animation: 'vortexCenterSpin 7s linear infinite',
						}}
					/>

					{/* 4 Concentric Chromatic Wormhole Rings (Rainbow Spectrum like Interstellar reference image) */}
					{[
						{ color: '#A855F7', delay: '0s' },
						{ color: '#06B6D4', delay: '0.7s' },
						{ color: '#F59E0B', delay: '1.4s' },
						{ color: '#EC4899', delay: '2.1s' },
					].map((ring, idx) => (
						<div
							key={idx}
							className='absolute top-1/2 left-1/2 rounded-full pointer-events-none border-2 border-dashed'
							style={{
								borderColor: ring.color,
								animation:
									'chromaticVortexExpand 2.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite',
								animationDelay: ring.delay,
								boxShadow: `0 0 18px ${ring.color}`,
							}}
						/>
					))}

					{/* 360-Degree Radial Hyperspace Warp Rays (24 colored streaks radiating from the center) */}
					{[
						'#22D3EE',
						'#FBBF24',
						'#FB7185',
						'#C084FC',
						'#34D399',
						'#60A5FA',
						'#FFFFFF',
						'#F43F5E',
						'#A78BFA',
						'#38BDF8',
						'#FACC15',
						'#4ADE80',
						'#22D3EE',
						'#FBBF24',
						'#FB7185',
						'#C084FC',
						'#34D399',
						'#60A5FA',
						'#FFFFFF',
						'#F43F5E',
						'#A78BFA',
						'#38BDF8',
						'#FACC15',
						'#4ADE80',
					].map((color, i) => (
						<div
							key={i}
							className='absolute top-1/2 left-1/2 w-0.5 sm:w-[2px] h-28 sm:h-36 origin-top pointer-events-none'
							style={{
								'--rot': `${i * 15}deg`,
								animation: 'warpStreakRadial 1.6s ease-out infinite',
								animationDelay: `${(i * 0.07).toFixed(2)}s`,
								background: `linear-gradient(to bottom, transparent, ${color}, white, transparent)`,
							}}
						/>
					))}
				</div>

				{/* Holographic Flight Vector Line (Leading from Lower-Left to Planet Center) */}
				<svg
					className='absolute inset-0 w-full h-full pointer-events-none z-10'
					viewBox='0 0 400 240'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'>
					{/* Glowing Flight Path Guide Line */}
					<path
						d='M95 195 L200 105'
						stroke={planetTheme.pathColor}
						strokeWidth='2'
						strokeDasharray='6 6'
						strokeOpacity='0.5'
						style={{ animation: 'flightPathBeamDash 1.2s linear infinite' }}
					/>
					{/* Forward Navigation Chevrons Pointed at Planet Center */}
					<path
						d='M130 168 L138 162 L132 154'
						stroke={planetTheme.pathColor}
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						opacity='0.85'
					/>
					<path
						d='M165 138 L173 132 L167 124'
						stroke={planetTheme.pathColor}
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						opacity='0.85'
					/>
				</svg>

				{/* ─── DESTINATION: THE SKILLSET PLANET (Centered at the Vortex Core) ─── */}
				<div
					className='absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20'
					style={{ transformStyle: 'preserve-3d' }}>
					{/* Gravitational Attraction Ripples */}
					<div
						className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-cyan-400/30 pointer-events-none'
						style={{ animation: 'gravityPullWave 3s ease-out infinite' }}
					/>
					<div
						className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-purple-400/25 pointer-events-none'
						style={{
							animation: 'gravityPullWave 3s ease-out infinite',
							animationDelay: '1.5s',
						}}
					/>

					{/* Target Lock HUD Reticle */}
					<div className='absolute -top-3 -left-3 -right-3 -bottom-3 border border-dashed border-cyan-400/40 rounded-full pointer-events-none animate-spin-slow' />

					{/* Planet Sphere */}
					<div
						className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all cursor-default ${planetTheme.atmosphereGlow}`}
						style={{
							animation: 'planetAtmosphereGlow 3s ease-in-out infinite',
						}}>
						{/* Planet Sphere Background with Radial Shading */}
						<div
							className={`absolute inset-0 rounded-full bg-gradient-to-br ${planetTheme.planetGradient} shadow-inner overflow-hidden border border-white/20`}>
							{/* Surface Atmosphere / Cloud Swirls */}
							<div
								className={`absolute -top-2 -left-2 w-14 h-14 rounded-full ${planetTheme.surfaceLight} blur-sm pointer-events-none`}
							/>
							<div className='absolute -bottom-3 right-0 w-16 h-8 rounded-full bg-black/50 blur-[2px] pointer-events-none' />
							<div className='absolute top-5 -left-1 w-12 h-3 rounded-full bg-white/25 blur-[1px] transform -rotate-12 pointer-events-none' />
						</div>

						{/* Planetary Saturn-like Ring */}
						<div
							className={`absolute w-32 sm:w-36 h-8 sm:h-9 border-2 ${planetTheme.ringBorder} rounded-[100%] pointer-events-none`}
							style={{
								transform: 'rotate(-25deg)',
								background: planetTheme.ringGradient,
							}}
						/>

						{/* Skill Core / Emblem at Planet Center */}
						<div className='relative z-20 flex flex-col items-center justify-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'>
							{skillDef.id === 'analytical_thinking' ?
								<Brain className='w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow animate-pulse' />
							: skillDef.id === 'visual' ?
								<Eye className='w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow animate-pulse' />
							:	<span className='text-2xl sm:text-3xl drop-shadow animate-pulse select-none'>
									{skillIcon}
								</span>
							}
						</div>
					</div>
				</div>

				{/* ─── TRAVELER: THE ASTROQUEST SPACESHIP (Traveling Directly into Planet Center) ─── */}
				<div
					className='absolute left-[16%] sm:left-[20%] bottom-[12%] sm:bottom-[15%] z-20 pointer-events-none'
					style={{
						transformStyle: 'preserve-3d',
						animation: 'shipTravelToCenter 3.8s ease-in-out infinite',
					}}>
					<div className='relative flex items-center justify-center'>
						{/* Traveling Starship SVG with Integrated Dual Plasma Thruster Flames */}
						<svg
							width='56'
							height='76'
							viewBox='0 0 56 76'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							className='filter drop-shadow-[0_0_14px_rgba(0,229,255,0.85)]'>
							<defs>
								{/* Outer Thruster Flame Gradient */}
								<linearGradient
									id='flameGradOuter'
									x1='0'
									y1='0'
									x2='0'
									y2='1'>
									<stop
										offset='0%'
										stopColor='#FDE047'
									/>
									<stop
										offset='35%'
										stopColor='#F97316'
									/>
									<stop
										offset='80%'
										stopColor='#EF4444'
									/>
									<stop
										offset='100%'
										stopColor='#7F1D1D'
										stopOpacity='0'
									/>
								</linearGradient>
								{/* Inner Core Plasma Jet Gradient */}
								<linearGradient
									id='flameGradInner'
									x1='0'
									y1='0'
									x2='0'
									y2='1'>
									<stop
										offset='0%'
										stopColor='#FFFFFF'
									/>
									<stop
										offset='40%'
										stopColor='#38BDF8'
									/>
									<stop
										offset='85%'
										stopColor='#0284C7'
									/>
									<stop
										offset='100%'
										stopColor='#0369A1'
										stopOpacity='0'
									/>
								</linearGradient>
							</defs>

							{/* Integrated Dual Thruster Plasma Flames (Emitting directly from nozzle base y=48) */}
							<g
								style={{
									animation:
										'thrusterPlasmaPulse 0.25s ease-in-out infinite alternate',
									transformOrigin: '28px 48px',
								}}>
								{/* Left Thruster Flame */}
								<path
									d='M17 48 Q17 68 20.5 74 Q24 68 24 48 Z'
									fill='url(#flameGradOuter)'
								/>
								<path
									d='M18.5 48 Q18.5 63 20.5 67 Q22.5 63 22.5 48 Z'
									fill='url(#flameGradInner)'
								/>

								{/* Right Thruster Flame */}
								<path
									d='M32 48 Q32 68 35.5 74 Q39 68 39 48 Z'
									fill='url(#flameGradOuter)'
								/>
								<path
									d='M33.5 48 Q33.5 63 35.5 67 Q37.5 63 37.5 48 Z'
									fill='url(#flameGradInner)'
								/>
							</g>

							{/* Left Wing with Navigation Light */}
							<path
								d='M20 34 L4 47 L8 50 L20 44 Z'
								fill='#EF4444'
								stroke='#0F172A'
								strokeWidth='1.5'
								strokeLinejoin='round'
							/>
							<circle
								cx='5'
								cy='47'
								r='1.3'
								fill='#34D399'
							/>

							{/* Right Wing with Navigation Light */}
							<path
								d='M36 34 L52 47 L48 50 L36 44 Z'
								fill='#EF4444'
								stroke='#0F172A'
								strokeWidth='1.5'
								strokeLinejoin='round'
							/>
							<circle
								cx='51'
								cy='47'
								r='1.3'
								fill='#F43F5E'
							/>

							{/* Main Fuselage Body */}
							<path
								d='M28 6 C34 16 38 32 36 48 L20 48 C18 32 22 16 28 6 Z'
								fill='#F8FAFC'
								stroke='#0F172A'
								strokeWidth='1.8'
								strokeLinejoin='round'
							/>

							{/* Nose Cone */}
							<path
								d='M28 6 C31 12 33 18 33 21 L23 21 C23 18 25 12 28 6 Z'
								fill='#FF435A'
								stroke='#0F172A'
								strokeWidth='1.4'
							/>

							{/* Cockpit Canopy (Top Facing Viewer) */}
							<ellipse
								cx='28'
								cy='26'
								rx='4.2'
								ry='6.5'
								fill='#00E5FF'
								stroke='#0F172A'
								strokeWidth='1.4'
							/>
							{/* Canopy Glass Glare */}
							<ellipse
								cx='26.5'
								cy='24'
								rx='1.4'
								ry='3'
								fill='#FFFFFF'
								opacity='0.85'
							/>

							{/* Center Hull Tech Accent */}
							<rect
								x='26'
								y='36'
								width='4'
								height='7'
								rx='1'
								fill='#0284C7'
							/>

							{/* Dual Engine Nozzle Housings */}
							<rect
								x='16'
								y='46'
								width='9'
								height='4'
								rx='1'
								fill='#334155'
								stroke='#0F172A'
								strokeWidth='1.2'
							/>
							<rect
								x='31'
								y='46'
								width='9'
								height='4'
								rx='1'
								fill='#334155'
								stroke='#0F172A'
								strokeWidth='1.2'
							/>
						</svg>

						{/* Trailing Exhaust Stardust Particles (Backwards Along Angle) */}
						<div
							className='absolute bottom-0 left-4 w-2.5 h-2.5 rounded-full bg-cyan-300 pointer-events-none blur-[0.5px]'
							style={{
								animation: 'exhaustDrift1 1.2s ease-out infinite',
							}}
						/>
						<div
							className='absolute bottom-1 left-2 w-2 h-2 rounded-full bg-amber-400 pointer-events-none blur-[0.5px]'
							style={{
								animation: 'exhaustDrift2 1.4s ease-out infinite',
								animationDelay: '0.3s',
							}}
						/>
						<div
							className='absolute bottom-2 left-0 w-1.5 h-1.5 rounded-full bg-pink-400 pointer-events-none blur-[0.5px]'
							style={{
								animation: 'exhaustDrift3 1.6s ease-out infinite',
								animationDelay: '0.6s',
							}}
						/>
					</div>
				</div>

				{/* Real-Time Approach Distance HUD Readout (Bottom-Right) */}
				<div className='absolute bottom-3 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-sm border border-cyan-400/30 text-[10px] sm:text-[11px] font-mono font-bold text-cyan-300 shadow-md'>
					<Navigation className='w-3 h-3 text-cyan-400 animate-spin-slow' />
					<span>RANGE: {simulatedDistance.toLocaleString()} KM</span>
					<span className='text-amber-400 ml-1'>WARP 3.8</span>
				</div>
			</div>

			{/* Mission Title Header */}
			<div
				className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${planetTheme.badgeBg} border text-xs font-black uppercase tracking-wider mb-2.5 shadow-sm`}>
				<KidAvatar
					avatarId={effectiveAvatar}
					size='xs'
				/>
				<span>
					AstroQuest Cosmic Mission • {effectiveName} (Age {effectiveAge})
				</span>
			</div>

			<h2 className='text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 leading-tight tracking-tight'>
				Traveling to Planet {skillName}... {skillIcon}
			</h2>

			{/* Dynamic Mission Telemetry Step */}
			<div className='min-h-[40px] flex items-center justify-center px-4 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 mb-4 transition-all duration-300 w-full max-w-md'>
				<p
					className={`text-xs sm:text-sm font-extrabold flex items-center gap-2 ${planetTheme.accentText}`}>
					<span className='text-base'>{currentStep.icon}</span>
					<span>{currentStep.title}</span>
				</p>
			</div>

			{/* Subtitle / User Context */}
			<p className='text-xs sm:text-sm font-bold text-slate-300 mb-5'>
				Synthesizing 10 brand-new{' '}
				<span className={`${planetTheme.accentText} font-extrabold`}>
					{skillName}
				</span>{' '}
				challenges for{' '}
				<span className='text-amber-300 font-extrabold'>{effectiveName}</span>{' '}
				<span className='text-cyan-300 font-extrabold'>
					(Age {effectiveAge})...
				</span>
			</p>

			{/* Sci-Fi Warp Energy Gauge */}
			<div className='w-full max-w-xs bg-slate-950/80 rounded-full h-2.5 p-0.5 border border-cyan-500/40 shadow-inner relative overflow-hidden'>
				<div className='w-full h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 rounded-full relative overflow-hidden'>
					<div
						className='absolute inset-0 w-1/3 bg-white/70 rounded-full blur-[2px]'
						style={{ animation: 'warpBeam 1.6s ease-in-out infinite' }}
					/>
				</div>
			</div>

			{/* Telemetry Status Cue */}
			<div className='flex items-center justify-between w-full max-w-xs mt-2 text-[10px] sm:text-xs font-bold text-slate-400 px-1'>
				<span className='text-cyan-400'>LEVEL: AGE {effectiveAge}</span>
				<span className={`${planetTheme.accentText} font-black tracking-wider`}>
					DESTINATION: {skillName.toUpperCase()}
				</span>
				<span className='flex items-center gap-1 text-emerald-400'>
					<span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping' />
					PROPULSION ONLINE
				</span>
			</div>
		</div>
	);
});

export default CosmicQuestLoader;
