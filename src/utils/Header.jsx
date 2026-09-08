import {
	Clock,
	LogOut,
	Maximize,
	Mic,
	MicOff,
	Minimize,
	Volume2,
	VolumeX,
} from 'lucide-react';
import React from 'react';
import { playButtonPop } from './audioSynthesis';
import { getStoredKidAge, getStoredKidName } from './progressTracker';

const Header = React.memo(function Header({
	questionIndex,
	totalQuestions,
	history,
	timerSeconds,
	timerConfig = { enabled: false, secondsPerQuestion: 90 },
	questionTimeRemaining = 90,
	soundEnabled,
	onToggleSound,
	speechEnabled,
	onToggleSpeech,
	onExitClick,
	kidName,
	kidAge,
}) {
	const [isFullscreen, setIsFullscreen] = React.useState(false);

	const resolvedKidName =
		(kidName && String(kidName).trim()) || getStoredKidName() || 'Explorer';
	const resolvedKidAge = kidAge || getStoredKidAge() || 5;

	// Format MM:SS
	const formatTime = (secs) => {
		const safeSecs = Math.max(0, Math.floor(secs));
		const m = Math.floor(safeSecs / 60)
			.toString()
			.padStart(2, '0');
		const s = (safeSecs % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	const isTimerMode = timerConfig?.enabled;
	const isUrgent = isTimerMode && questionTimeRemaining <= 15;
	const isCritical = isTimerMode && questionTimeRemaining <= 5;

	const toggleFullscreen = () => {
		playButtonPop(soundEnabled);
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {});
			setIsFullscreen(true);
		} else {
			document.exitFullscreen().catch(() => {});
			setIsFullscreen(false);
		}
	};

	return (
		<header className='w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 select-none'>
			{/* Left Area: AstroQuest Badge & Explorer Profile */}
			<div className='flex items-center gap-1.5 sm:gap-2.5'>
				{/* AstroQuest Badge with App Icon */}
				<div className='flex items-center gap-2 bg-[#151747] border border-[#2B3075] rounded-xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-lg flex-shrink-0'>
					<img
						src='/astroquest-icon.svg'
						alt='AstroQuest'
						className='w-6 h-6 sm:w-7 sm:h-7 rounded-lg shadow-sm flex-shrink-0'
					/>
					<div className='flex flex-col items-start leading-none'>
						<span className='text-white font-extrabold text-xs sm:text-sm tracking-wider bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
							ASTRO
						</span>
						<span className='text-[9px] sm:text-[10px] font-bold text-gray-300 tracking-wide uppercase mt-0.5'>
							QUEST
						</span>
					</div>
				</div>

				{/* Explorer Profile Badge (Name & Age) */}
				<div
					className='hidden md:flex items-center gap-2 bg-[#151747] border border-[#2B3075] rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-lg select-none'
					title={`Explorer: ${resolvedKidName} (Age ${resolvedKidAge})`}>
					<span className='text-base leading-none'>🧑‍🚀</span>
					<div className='flex flex-col items-start leading-none'>
						<span className='text-white font-extrabold text-xs tracking-wide truncate max-w-[90px] lg:max-w-[130px]'>
							{resolvedKidName}
						</span>
						<span className='text-[9px] font-black text-cyan-300 uppercase tracking-wider mt-0.5'>
							Age {resolvedKidAge}
						</span>
					</div>
				</div>
			</div>

			{/* 10-Segment Segmented Progress Bar */}
			<div
				role='progressbar'
				aria-label='Quest progress'
				aria-valuenow={questionIndex + 1}
				aria-valuemin={1}
				aria-valuemax={totalQuestions}
				aria-valuetext={`Question ${questionIndex + 1} of ${totalQuestions}`}
				className='flex-1 max-w-xl mx-1.5 sm:mx-4 bg-[#141846] p-1.5 rounded-full border border-[#252C7A] flex gap-1 sm:gap-1.5 shadow-inner'>
				{Array.from({ length: totalQuestions }).map((_, idx) => {
					const item = history[idx];
					let bgClass = 'bg-[#31387A]/50'; // Default unvisited
					let borderClass = 'border-transparent';

					if (item) {
						if (item.isCorrect) {
							bgClass =
								'bg-gradient-to-r from-[#00D166] to-[#10B981] shadow-[0_0_8px_#00D166]';
						} else if (item.skipped) {
							bgClass =
								'bg-gradient-to-r from-[#F59E0B] to-[#D97706] shadow-[0_0_8px_#F59E0B]';
						} else {
							bgClass =
								'bg-gradient-to-r from-[#FF435A] to-[#F43F5E] shadow-[0_0_8px_#FF435A]';
						}
					} else if (idx === questionIndex) {
						bgClass = 'bg-[#4B56B2] animate-pulse';
						borderClass = 'border border-white/60';
					}

					return (
						<div
							key={idx}
							className={`h-2.5 sm:h-3 flex-1 rounded-full transition-all duration-300 ${bgClass} ${borderClass}`}
							title={`Question ${idx + 1}`}
						/>
					);
				})}
			</div>

			{/* Right Controls Area: Timer, Audio, Speech, Fullscreen, Exit */}
			<div className='flex items-center gap-1 sm:gap-2.5'>
				{/* Timer Display (Countdown when enabled, Stopwatch when disabled) */}
				<div
					role='timer'
					aria-live='off'
					className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all border ${
						isCritical ?
							'bg-rose-950/90 border-rose-500 text-rose-300 animate-bounce'
						: isUrgent ?
							'bg-amber-950/80 border-amber-400 text-amber-300 animate-pulse'
						: isTimerMode ? 'bg-[#121644] border-cyan-500/50 text-cyan-300'
						: 'bg-[#121644] border-[#29307A] text-pink-300'
					}`}
					title={
						isTimerMode ?
							`Question countdown timer: ${questionTimeRemaining}s remaining`
						:	'Elapsed session time'
					}
					aria-label={
						isTimerMode ?
							`Question countdown timer: ${questionTimeRemaining} seconds remaining`
						:	`Elapsed session time: ${timerSeconds} seconds`
					}>
					<Clock
						className={`w-3.5 h-3.5 ${
							isUrgent ? 'text-amber-400 animate-spin'
							: isTimerMode ? 'text-cyan-400'
							: 'text-pink-400 animate-spin-slow'
						}`}
					/>
					<span className='font-mono font-black'>
						{formatTime(isTimerMode ? questionTimeRemaining : timerSeconds)}
					</span>
				</div>

				{/* Read-Aloud Voice Narrator */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onToggleSpeech();
					}}
					aria-label={
						speechEnabled ?
							'Voice Narrator On - Click to mute voice'
						:	'Voice Narrator Off - Click to enable voice'
					}
					aria-pressed={speechEnabled}
					className={`p-2 rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
						speechEnabled ?
							'bg-purple-600/40 border-purple-400 text-purple-200'
						:	'bg-[#121644] border-[#29307A] text-gray-400 hover:text-white'
					}`}
					title={speechEnabled ? 'Voice Narrator On' : 'Voice Narrator Off'}>
					{speechEnabled ?
						<Mic className='w-4 h-4' />
					:	<MicOff className='w-4 h-4' />}
				</button>

				{/* Sound Effects Toggle */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onToggleSound();
					}}
					aria-label={
						soundEnabled ?
							'Sound Effects On - Click to mute'
						:	'Sound Effects Muted - Click to unmute'
					}
					aria-pressed={soundEnabled}
					className={`p-2 rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
						soundEnabled ?
							'bg-[#121644] border-[#29307A] text-gray-200 hover:text-white'
						:	'bg-rose-950/40 border-rose-800 text-rose-300'
					}`}
					title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}>
					{soundEnabled ?
						<Volume2 className='w-4 h-4' />
					:	<VolumeX className='w-4 h-4' />}
				</button>

				{/* Fullscreen Toggle */}
				<button
					type='button'
					onClick={toggleFullscreen}
					aria-label={
						isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'
					}
					aria-pressed={isFullscreen}
					className='hidden md:block p-2 rounded-xl bg-[#121644] border border-[#29307A] text-gray-300 hover:text-white hover:bg-[#1E2568] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none'
					title='Toggle Fullscreen'>
					{isFullscreen ?
						<Minimize className='w-4 h-4' />
					:	<Maximize className='w-4 h-4' />}
				</button>

				{/* Exit Button */}
				{onExitClick && (
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onExitClick();
						}}
						aria-label='Exit AstroQuest quest'
						className='px-3 sm:px-3.5 py-2 rounded-xl bg-[#121644] hover:bg-rose-950/60 border border-[#29307A] hover:border-rose-500 text-rose-300 hover:text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none'
						title='Exit AstroQuest'>
						<LogOut className='w-4 h-4 text-rose-400' />
						<span className='text-xs font-bold'>Exit</span>
					</button>
				)}
			</div>
		</header>
	);
});

export default Header;
