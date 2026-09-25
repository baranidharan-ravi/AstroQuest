import {
	Clock,
	LogOut,
	Maximize,
	Mic,
	MicOff,
	Minimize,
	Pause,
	Play,
	SlidersHorizontal,
	Users,
	Volume2,
	VolumeX,
} from 'lucide-react';
import React from 'react';
import { AstroQuestLogo } from './AstroQuestLogo';
import { playButtonPop } from './audioSynthesis';
import { KidAvatar } from './avatarManager';
import { calculateRank, getStoredAchievements } from './badgeManager';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidName,
} from './progressTracker';

const Header = React.memo(function Header({
	questionIndex,
	totalQuestions,
	history,
	timerSeconds,
	timerConfig = { enabled: false, secondsPerQuestion: 60 },
	questionTimeRemaining = 60,
	isTimerPaused = false,
	onToggleTimerPause,
	soundEnabled,
	onToggleSound,
	speechEnabled,
	onToggleSpeech,
	onExitClick,
	kidName,
	kidAge,
	kidAvatar,
	onOpenCrewModal,
	isCompleted = false,
}) {
	const [isFullscreen, setIsFullscreen] = React.useState(false);
	const [showControlsTooltip, setShowControlsTooltip] = React.useState(false);
	const controlsRef = React.useRef(null);

	const resolvedKidName =
		(kidName && String(kidName).trim()) || getStoredKidName() || 'Explorer';
	const resolvedKidAge = kidAge || getStoredKidAge() || 5;

	// Calculate Astronaut Rank & Level
	const rankInfo = React.useMemo(() => {
		const ach = getStoredAchievements();
		return calculateRank(ach?.xp || 0);
	}, [questionIndex]);

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

	// Synchronize fullscreen state with browser events
	React.useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
			document.removeEventListener(
				'webkitfullscreenchange',
				handleFullscreenChange,
			);
		};
	}, []);

	// Dismiss controls tooltip on outside click or Escape
	React.useEffect(() => {
		if (!showControlsTooltip) return;

		const handleClickOutside = (e) => {
			if (controlsRef.current && !controlsRef.current.contains(e.target)) {
				setShowControlsTooltip(false);
			}
		};

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setShowControlsTooltip(false);
			}
		};

		document.addEventListener('pointerdown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('pointerdown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [showControlsTooltip]);

	return (
		<header className='w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 select-none'>
			{/* Left Area: AstroQuest Badge & Explorer Profile */}
			<div className='flex items-center gap-1.5 sm:gap-2.5'>
				{/* AstroQuest Badge with App Icon (Hidden on Result Screen) */}
				{!isCompleted && (
					<div className='flex items-center gap-2 bg-[#151747] border border-[#2B3075] rounded-xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-lg flex-shrink-0'>
						<AstroQuestLogo className='w-6 h-6 sm:w-7 sm:h-7 rounded-lg shadow-sm flex-shrink-0' />
						<div className='flex flex-col items-start leading-none'>
							<span className='text-white font-extrabold text-xs sm:text-sm tracking-wider bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
								ASTRO
							</span>
							<span className='text-[9px] sm:text-[10px] font-bold text-gray-300 tracking-wide uppercase mt-0.5'>
								QUEST
							</span>
						</div>
					</div>
				)}

				{/* Combined Explorer Cadet & Flight Crew Capsule */}
				<div className='hidden md:flex items-center bg-[#151747] border border-[#2B3075] hover:border-cyan-500/50 rounded-xl p-1 sm:p-1.5 shadow-lg select-none transition-all'>
					{/* Explorer Profile Details */}
					<div
						className='flex items-center gap-2 px-1.5 py-0.5'
						title={`Explorer: ${resolvedKidName} (Age ${resolvedKidAge})`}>
						<KidAvatar
							avatarId={kidAvatar || getStoredKidAvatar()}
							size='xs'
							className='ring-1 ring-purple-400/40 shadow-sm'
							alt={`${resolvedKidName} avatar`}
						/>
						<div className='flex flex-col items-start leading-none'>
							<span className='text-white font-extrabold text-xs tracking-wide truncate max-w-[90px] lg:max-w-[130px]'>
								{resolvedKidName}
							</span>
							<span className='text-[10px] text-gray-400 font-bold'>
								AGE {resolvedKidAge}
							</span>
						</div>
					</div>

					{/* Subtle Divider & Crew Switcher Action */}
					{onOpenCrewModal && (
						<>
							<div className='w-px h-5 bg-[#2B3075] mx-1 sm:mx-1.5 flex-shrink-0' />
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									onOpenCrewModal();
								}}
								aria-label='Switch flight crew astronaut'
								className='flex items-center gap-1.5 bg-[#121644] hover:bg-[#1A2060] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer'
								title='Switch astronaut flight crew'>
								<Users className='w-3.5 h-3.5 text-cyan-400' />
								<span className='hidden xl:inline'>Crew</span>
							</button>
						</>
					)}
				</div>

				{/* Astronaut Rank Badge */}
				{rankInfo && (
					<div
						className='hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-[#171B50] to-[#121644] border border-cyan-400/50 rounded-xl px-2.5 py-1 shadow-md select-none'
						title={`Astronaut Rank: ${rankInfo.title} (Level ${rankInfo.level}) • ${rankInfo.progressPercent}% towards next rank`}>
						<span
							className='text-sm'
							aria-hidden='true'>
							{rankInfo.icon}
						</span>
						<div className='flex flex-col items-start leading-none'>
							<span className='text-cyan-300 font-black text-[10px] tracking-wide uppercase'>
								{rankInfo.title}
							</span>
							<span className='text-[9px] text-slate-400 font-bold'>
								Lv.{rankInfo.level}
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Center Area: Question Progress Track Segments (Hidden on Result Screen) */}
			{!isCompleted ?
				<div
					className='flex items-center gap-1 sm:gap-1.5 max-w-[200px] sm:max-w-xs md:max-w-md w-full bg-[#151747]/90 p-1 sm:p-1.5 rounded-full border border-[#2B3075] shadow-inner'
					role='progressbar'
					aria-label='Quiz Progress'
					aria-valuenow={questionIndex + 1}
					aria-valuemin={1}
					aria-valuemax={totalQuestions}>
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
							if (idx === questionIndex) {
								borderClass =
									'border-2 border-white ring-2 ring-white/60 animate-pulse';
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
			:	<div className='flex-1' />}

			{/* Right Controls Area: Timer, Audio, Speech, Fullscreen, Exit */}
			<div className='flex items-center gap-1 sm:gap-2.5'>
				{/* Timer Display (Countdown when enabled, Pausable Stopwatch when disabled - Hidden on Result Screen) */}
				{!isCompleted &&
					(isTimerMode ?
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								if (onToggleTimerPause) onToggleTimerPause();
							}}
							role='timer'
							aria-live='off'
							title={
								isTimerPaused ?
									'Timer is paused. Click to resume or interact with the question.'
								:	'Click to pause question timer'
							}
							aria-label={
								isTimerPaused ?
									`Countdown paused at ${formatTime(questionTimeRemaining)}. Click to resume.`
								:	`Question countdown: ${formatTime(questionTimeRemaining)} remaining. Click to pause.`
							}
							className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all border cursor-pointer select-none group ${
								isTimerPaused ?
									'bg-amber-950/90 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 animate-pulse'
								: isCritical ?
									'bg-rose-950/90 border-rose-500 text-rose-300 animate-bounce'
								: isUrgent ?
									'bg-amber-950/80 border-amber-400 text-amber-300 animate-pulse'
								:	'bg-[#121644] border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white'
							}`}>
							{isTimerPaused ?
								<Play className='w-3.5 h-3.5 text-amber-400 fill-current' />
							: isUrgent ?
								<Clock className='w-3.5 h-3.5 text-amber-400 animate-spin' />
							:	<Pause className='w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform' />
							}
							<span className='font-mono font-black'>
								{formatTime(questionTimeRemaining)}
							</span>
							{isTimerPaused && (
								<span className='text-[9px] uppercase font-black tracking-wider bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/30'>
									Paused
								</span>
							)}
						</button>
					:	<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								if (onToggleTimerPause) onToggleTimerPause();
							}}
							role='timer'
							aria-live='off'
							title={
								isTimerPaused ?
									'Timer is paused. Click to resume or interact with the question.'
								:	'Click to pause session timer'
							}
							aria-label={
								isTimerPaused ?
									`Timer paused at ${formatTime(timerSeconds)}. Click to resume.`
								:	`Elapsed session time: ${formatTime(timerSeconds)}. Click to pause.`
							}
							className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all border cursor-pointer select-none group ${
								isTimerPaused ?
									'bg-amber-950/90 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 animate-pulse'
								:	'bg-[#121644] border-[#29307A] hover:border-pink-400/60 text-pink-300 hover:text-white'
							}`}>
							{isTimerPaused ?
								<Play className='w-3.5 h-3.5 text-amber-400 fill-current' />
							:	<Pause className='w-3 h-3 text-pink-300 group-hover:scale-110 transition-transform' />
							}
							<span className='font-mono font-black'>
								{formatTime(timerSeconds)}
							</span>
							{isTimerPaused && (
								<span className='text-[9px] uppercase font-black tracking-wider bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/30'>
									Paused
								</span>
							)}
						</button>)}

				{/* Combined Quick Controls Option (Voice, Sound, Fullscreen) */}
				<div
					className='relative'
					ref={controlsRef}>
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setShowControlsTooltip((prev) => !prev);
						}}
						aria-label={
							showControlsTooltip ?
								'Close controls menu'
							:	'Open controls menu: Voice narration, sound effects, and fullscreen'
						}
						aria-expanded={showControlsTooltip}
						aria-haspopup='dialog'
						className={`relative p-2 rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none flex items-center justify-center ${
							showControlsTooltip ?
								'bg-[#1e2363] border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/10'
							: speechEnabled || soundEnabled ?
								'bg-[#121644] border-[#29307A] text-cyan-300 hover:text-white hover:bg-[#1E2568]'
							:	'bg-[#121644] border-[#29307A] text-gray-400 hover:text-white hover:bg-[#1E2568]'
						}`}
						title='Quick Controls (Voice, Sound, Fullscreen)'>
						<SlidersHorizontal className='w-4 h-4' />
						{(speechEnabled || soundEnabled) && (
							<span className='absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400' />
						)}
					</button>

					{/* Tooltip displaying the 3 combined options */}
					{showControlsTooltip && (
						<div
							role='dialog'
							aria-label='Quick Controls Options'
							className='absolute right-0 top-full mt-2 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col items-end select-none'>
							{/* Tooltip Arrow pointing up to trigger button */}
							<div className='w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-[#29307A] mr-3' />

							<div className='bg-[#0e1136]/95 backdrop-blur-md border border-[#29307A] rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2 min-w-[210px]'>
								<div className='flex items-center justify-between px-1 pb-1.5 border-b border-[#202766]'>
									<span className='text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
										Quick Controls
									</span>
									<span className='text-[9px] text-gray-400 font-semibold'>
										Audio & Screen
									</span>
								</div>

								{/* Row with the 3 options */}
								<div className='flex items-center justify-center gap-2'>
									{/* Option 1: Read-Aloud Voice Narrator */}
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
										className={`flex-1 p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
											speechEnabled ?
												'bg-purple-600/30 border-purple-400 text-purple-200 ring-1 ring-purple-400/40 shadow-sm shadow-purple-500/20'
											:	'bg-[#121644] border-[#29307A] text-gray-400 hover:text-white hover:bg-[#1E2568]'
										}`}
										title={
											speechEnabled ? 'Voice Narrator: On' : (
												'Voice Narrator: Off'
											)
										}>
										{speechEnabled ?
											<Mic className='w-4 h-4 text-purple-300' />
										:	<MicOff className='w-4 h-4 text-gray-400' />}
										<span className='text-[10px] font-bold'>Voice</span>
									</button>

									{/* Option 2: Sound Effects Toggle */}
									<button
										type='button'
										onClick={() => {
											playButtonPop(!soundEnabled);
											onToggleSound();
										}}
										aria-label={
											soundEnabled ?
												'Sound Effects On - Click to mute'
											:	'Sound Effects Muted - Click to unmute'
										}
										aria-pressed={soundEnabled}
										className={`flex-1 p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
											soundEnabled ?
												'bg-cyan-600/30 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/40 shadow-sm shadow-cyan-500/20'
											:	'bg-rose-950/40 border-rose-800 text-rose-300 hover:border-rose-600'
										}`}
										title={
											soundEnabled ? 'Sound Effects: On' : (
												'Sound Effects: Muted'
											)
										}>
										{soundEnabled ?
											<Volume2 className='w-4 h-4 text-cyan-300' />
										:	<VolumeX className='w-4 h-4 text-rose-300' />}
										<span className='text-[10px] font-bold'>Sound</span>
									</button>

									{/* Option 3: Fullscreen Toggle */}
									<button
										type='button'
										onClick={toggleFullscreen}
										aria-label={
											isFullscreen ?
												'Exit fullscreen mode'
											:	'Enter fullscreen mode'
										}
										aria-pressed={isFullscreen}
										className={`flex-1 p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
											isFullscreen ?
												'bg-blue-600/30 border-blue-400 text-blue-200 ring-1 ring-blue-400/40 shadow-sm shadow-blue-500/20'
											:	'bg-[#121644] border-[#29307A] text-gray-300 hover:text-white hover:bg-[#1E2568]'
										}`}
										title={
											isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'
										}>
										{isFullscreen ?
											<Minimize className='w-4 h-4 text-blue-300' />
										:	<Maximize className='w-4 h-4 text-gray-300' />}
										<span className='text-[10px] font-bold'>Screen</span>
									</button>
								</div>

								{/* Mobile/Compact Crew Switcher Row */}
								{onOpenCrewModal && (
									<button
										type='button'
										onClick={() => {
											playButtonPop(soundEnabled);
											setShowControlsTooltip(false);
											onOpenCrewModal();
										}}
										className='w-full p-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 hover:text-white text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer'>
										<Users className='w-4 h-4 text-cyan-300' />
										<span>Switch Flight Crew Profile</span>
									</button>
								)}
							</div>
						</div>
					)}
				</div>

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
