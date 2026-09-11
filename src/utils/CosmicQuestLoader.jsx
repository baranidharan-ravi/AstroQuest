import { Brain, Eye, Orbit } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import {
	getStoredKidAge,
	getStoredKidName,
	getStoredSelectedSkill,
} from './progressTracker';
import { getSkillDefinition } from './skillManager';

const CosmicQuestLoader = memo(function CosmicQuestLoader({
	selectedSkill,
	kidName,
	kidAge,
}) {
	// Dynamically resolve child's name and age directly from settings storage if not passed or empty
	const effectiveName =
		(kidName && String(kidName).trim()) || getStoredKidName() || 'Explorer';
	const effectiveAge = Number(kidAge) || Number(getStoredKidAge()) || 5;

	// Dynamically extract and resolve selected skillset name and metadata
	const rawSkill =
		(selectedSkill && String(selectedSkill).trim()) ||
		getStoredSelectedSkill() ||
		'Visual';

	const skillDef = getSkillDefinition(rawSkill);
	const skillName = skillDef.name || rawSkill;
	const skillIcon = skillDef.icon || '🚀';
	const isAnalytical = skillDef.id === 'analytical_thinking';

	const missionSteps = useMemo(
		() => [
			{
				icon: '🚀',
				title: `Plotting Flight Coordinates for ${effectiveName}...`,
			},
			{
				icon: skillIcon,
				title: `Scanning Deep Space for ${skillName} Challenges...`,
			},
			{
				icon: '✨',
				title: `AI Neural Core Synthesizing Age ${effectiveAge} Puzzles...`,
			},
			{
				icon: skillIcon,
				title: `Calibrating ${skillName} Challenges & Creative Logic...`,
			},
			{
				icon: '🛰️',
				title: `Mission Locked for Astronaut ${effectiveName}! Launching...`,
			},
		],
		[effectiveName, effectiveAge, skillName, skillIcon],
	);

	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setStepIndex((prev) => (prev + 1) % missionSteps.length);
		}, 1800);
		return () => clearInterval(interval);
	}, [missionSteps.length]);

	const currentStep = missionSteps[stepIndex] || missionSteps[0];

	return (
		<div className='flex flex-col items-center justify-center p-6 sm:p-10 text-center animate-in fade-in duration-500 max-w-lg mx-auto w-full'>
			<style>{`
				@keyframes astroOrbit {
					0% {
						transform: rotate(0deg) translateX(78px) rotate(-90deg);
					}
					100% {
						transform: rotate(360deg) translateX(78px) rotate(270deg);
					}
				}
				@keyframes astroOrbitDust1 {
					0% {
						transform: rotate(-15deg) translateX(78px) scale(0.9);
						opacity: 0.8;
					}
					100% {
						transform: rotate(345deg) translateX(78px) scale(0.9);
						opacity: 0.8;
					}
				}
				@keyframes astroOrbitDust2 {
					0% {
						transform: rotate(-30deg) translateX(78px) scale(0.7);
						opacity: 0.5;
					}
					100% {
						transform: rotate(330deg) translateX(78px) scale(0.7);
						opacity: 0.5;
					}
				}
				@keyframes astroOrbitDust3 {
					0% {
						transform: rotate(-45deg) translateX(78px) scale(0.5);
						opacity: 0.3;
					}
					100% {
						transform: rotate(315deg) translateX(78px) scale(0.5);
						opacity: 0.3;
					}
				}
				@keyframes radarPulse {
					0% {
						transform: scale(0.65);
						opacity: 0.7;
					}
					50% {
						opacity: 0.35;
					}
					100% {
						transform: scale(1.35);
						opacity: 0;
					}
				}
				@keyframes thrusterFlame {
					0%, 100% {
						transform: scaleY(1) translateY(0);
						opacity: 0.9;
					}
					50% {
						transform: scaleY(1.4) translateY(2px);
						opacity: 1;
					}
				}
				@keyframes planetGlow {
					0%, 100% {
						filter: drop-shadow(0 0 18px rgba(6, 182, 212, 0.55)) drop-shadow(0 0 35px rgba(139, 92, 246, 0.45));
					}
					50% {
						filter: drop-shadow(0 0 28px rgba(6, 182, 212, 0.85)) drop-shadow(0 0 50px rgba(139, 92, 246, 0.65));
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
				@keyframes cosmicFloat {
					0%, 100% {
						transform: translateY(0px) rotate(0deg);
					}
					50% {
						transform: translateY(-6px) rotate(4deg);
					}
				}
			`}</style>

			{/* Center Orbital Cosmic Theater */}
			<div className='relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center mb-5 select-none'>
				{/* Radar Wave Pulses */}
				<div
					className='absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-cyan-400/30 pointer-events-none'
					style={{ animation: 'radarPulse 3s ease-out infinite' }}
				/>
				<div
					className='absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-indigo-400/25 pointer-events-none'
					style={{
						animation: 'radarPulse 3s ease-out infinite',
						animationDelay: '1.5s',
					}}
				/>

				{/* Elliptical Orbital Ring Track */}
				<div className='absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-cyan-400/35 pointer-events-none' />

				{/* Central Celestial AI Hub / Planet */}
				<div
					className='relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-2xl transition-all'
					style={{ animation: 'planetGlow 3s ease-in-out infinite' }}>
					{/* Planet Sphere with rich cosmic radial gradient */}
					<div
						className={`absolute inset-0 rounded-full ${
							isAnalytical ?
								'bg-gradient-to-br from-[#A855F7] via-[#6366F1] to-[#1E1B4B]'
							:	'bg-gradient-to-br from-[#00E5FF] via-[#0284C7] to-[#0F172A]'
						} shadow-inner overflow-hidden`}>
						{/* Planetary surface features / atmosphere clouds */}
						<div
							className={`absolute -top-3 -left-3 w-16 h-16 rounded-full ${
								isAnalytical ? 'bg-purple-300/30' : 'bg-cyan-300/30'
							} blur-md pointer-events-none`}
						/>
						<div className='absolute -bottom-4 right-1 w-20 h-10 rounded-full bg-purple-950/60 blur-xs pointer-events-none' />
						<div className='absolute top-7 -left-1 w-14 h-4 rounded-full bg-white/20 blur-[2px] transform -rotate-12 pointer-events-none' />
					</div>

					{/* Planetary Saturn-like Ring */}
					<div
						className={`absolute w-36 sm:w-44 h-10 sm:h-12 border-2 ${
							isAnalytical ? 'border-purple-300/60' : 'border-cyan-300/60'
						} rounded-[100%] pointer-events-none shadow-sm`}
						style={{
							transform: 'rotate(-25deg)',
							background:
								isAnalytical ?
									'linear-gradient(90deg, rgba(168,85,247,0.15) 0%, rgba(244,114,182,0.2) 50%, rgba(99,102,241,0.15) 100%)'
								:	'linear-gradient(90deg, rgba(6,182,212,0.15) 0%, rgba(244,114,182,0.2) 50%, rgba(6,182,212,0.15) 100%)',
						}}
					/>

					{/* Skill Core at the center of the Planet */}
					<div className='relative z-20 flex flex-col items-center justify-center text-white'>
						{skillDef.id === 'analytical_thinking' ?
							<Brain className='w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] animate-pulse' />
						: skillDef.id === 'visual' ?
							<Eye className='w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] animate-pulse' />
						:	<span className='text-3xl sm:text-4xl drop-shadow animate-pulse select-none'>
								{skillIcon}
							</span>
						}
					</div>
				</div>

				{/* Stardust Trail Behind Rocket */}
				<div
					className='absolute w-3 h-3 rounded-full bg-cyan-300 pointer-events-none blur-[1px]'
					style={{ animation: 'astroOrbitDust1 4s linear infinite' }}
				/>
				<div
					className='absolute w-2 h-2 rounded-full bg-pink-400 pointer-events-none blur-[1px]'
					style={{ animation: 'astroOrbitDust2 4s linear infinite' }}
				/>
				<div
					className='absolute w-1.5 h-1.5 rounded-full bg-amber-300 pointer-events-none blur-[0.5px]'
					style={{ animation: 'astroOrbitDust3 4s linear infinite' }}
				/>

				{/* Orbiting Astro Rocket */}
				<div
					className='absolute flex items-center justify-center pointer-events-none z-20'
					style={{
						animation: 'astroOrbit 4s linear infinite',
						transformOrigin: 'center center',
					}}>
					{/* Futuristic Vector Rocket */}
					<div className='relative flex flex-col items-center filter drop-shadow-[0_4px_12px_rgba(0,229,255,0.7)]'>
						{/* Rocket Body SVG */}
						<svg
							width='36'
							height='36'
							viewBox='0 0 36 36'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							className='transform rotate-45'>
							{/* Left Wing */}
							<path
								d='M8 20L4 27C4 27 9 26 12 23L8 20Z'
								fill='#FF435A'
								stroke='#0F172A'
								strokeWidth='1.2'
							/>
							{/* Right Wing */}
							<path
								d='M20 8L27 4C27 4 26 9 23 12L20 8Z'
								fill='#FF435A'
								stroke='#0F172A'
								strokeWidth='1.2'
							/>
							{/* Main Fuselage */}
							<path
								d='M14 22L12 17C12 17 18 11 27 5C27 5 31 9 25 18L20 20L14 22Z'
								fill='#FFFFFF'
								stroke='#0F172A'
								strokeWidth='1.5'
								strokeLinejoin='round'
							/>
							{/* Rocket Nose Cone */}
							<path
								d='M27 5C29.5 3 32 4 32 4C32 4 33 6.5 31 9C29.5 7.5 28.5 6.5 27 5Z'
								fill='#FF435A'
								stroke='#0F172A'
								strokeWidth='1.2'
							/>
							{/* Cockpit Window */}
							<circle
								cx='21'
								cy='11'
								r='2.8'
								fill='#00E5FF'
								stroke='#0F172A'
								strokeWidth='1.2'
							/>
							<circle
								cx='20.2'
								cy='10.2'
								r='0.9'
								fill='#FFFFFF'
							/>
							{/* Rear Engine Nozzle */}
							<path
								d='M12 21L11 23C11 23 13 25 15 25L15 23L12 21Z'
								fill='#475569'
								stroke='#0F172A'
								strokeWidth='1'
							/>
						</svg>

						{/* Animated Plasma Thruster Flame */}
						<div
							className='absolute -bottom-2 -left-2 flex items-center justify-center transform rotate-[225deg]'
							style={{
								animation: 'thrusterFlame 0.3s ease-in-out infinite alternate',
							}}>
							<div className='w-4 h-6 bg-gradient-to-b from-amber-300 via-orange-500 to-red-600 rounded-full blur-[0.5px] shadow-[0_0_10px_#FF9500]' />
							<div className='absolute w-2 h-3.5 bg-yellow-200 rounded-full' />
						</div>
					</div>
				</div>

				{/* Floating Sparkles & Skill Emojis in Orbit */}
				<div
					className='absolute top-3 right-5 text-amber-300 text-lg sm:text-xl pointer-events-none'
					style={{ animation: 'cosmicFloat 3s ease-in-out infinite' }}>
					✨
				</div>
				<div
					className={`absolute bottom-4 left-6 ${
						isAnalytical ? 'text-purple-300' : 'text-cyan-300'
					} text-base sm:text-lg pointer-events-none`}
					style={{
						animation: 'cosmicFloat 2.5s ease-in-out infinite reverse',
					}}>
					{skillIcon}
				</div>
			</div>

			{/* Mission Title Header */}
			<div
				className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
					isAnalytical ?
						'bg-purple-950/60 border-purple-400/40 text-purple-300'
					:	'bg-cyan-950/60 border-cyan-400/40 text-cyan-300'
				} border text-xs font-black uppercase tracking-wider mb-2.5 shadow-sm`}>
				<Orbit
					className={`w-3.5 h-3.5 ${
						isAnalytical ? 'text-purple-400' : 'text-cyan-400'
					} animate-spin-slow`}
				/>
				<span>
					AstroQuest AI Mission • {effectiveName} (Age {effectiveAge})
				</span>
			</div>

			<h2 className='text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 leading-tight tracking-tight'>
				Generating {skillName} Challenges... {skillIcon}
			</h2>

			{/* Rotating Mission Telemetry Step */}
			<div className='min-h-[36px] flex items-center justify-center px-4 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 mb-4 transition-all duration-300'>
				<p
					className={`text-xs sm:text-sm font-extrabold flex items-center gap-2 ${
						isAnalytical ? 'text-purple-300' : 'text-cyan-300'
					}`}>
					<span className='text-base'>{currentStep.icon}</span>
					<span>{currentStep.title}</span>
				</p>
			</div>

			{/* Subtitle / User Context */}
			<p className='text-xs sm:text-sm font-bold text-slate-300 mb-5'>
				Synthesizing 10 brand-new{' '}
				<span
					className={
						isAnalytical ?
							'text-purple-300 font-extrabold'
						:	'text-cyan-300 font-extrabold'
					}>
					{skillName}
				</span>{' '}
				puzzles for{' '}
				<span className='text-amber-300 font-extrabold'>{effectiveName}</span>{' '}
				<span className='text-cyan-300 font-extrabold'>
					(Age {effectiveAge})...
				</span>
			</p>

			{/* Sci-Fi Warp Gauge Energy Bar */}
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
				<span
					className={
						isAnalytical ?
							'text-purple-300 font-black tracking-wider'
						:	'text-cyan-300 font-black tracking-wider'
					}>
					SKILL: {skillName.toUpperCase()}
				</span>
				<span className='flex items-center gap-1 text-emerald-400'>
					<span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping' />
					{effectiveName.toUpperCase()}'S LINK ONLINE
				</span>
			</div>
		</div>
	);
});

export default CosmicQuestLoader;
