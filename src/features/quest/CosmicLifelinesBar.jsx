import { Clock, Radio, Sparkles, Zap } from 'lucide-react';
import { memo } from 'react';
import { CHRONO_FREEZE_SECONDS } from '../../constants';
import { playButtonPop } from '../../utils/audioSynthesis';

/**
 * CosmicLifelinesBar
 *
 * Dedicated quick-access lifelines console displayed directly on the quest screen
 * (outside the QuestionCard and OptionsGrid), enabling 1-click activation without opening modals.
 *
 * All 4 lifelines (Cosmic Clue, 50/50 Ray, Telemetry Radar, Chrono Freeze) are strictly
 * ONE-TIME usage per quest. Once used, the corresponding lifeline is permanently disabled
 * until a new quest is launched.
 */
const CosmicLifelinesBar = memo(function CosmicLifelinesBar({
	cosmicClueUsed = false,
	onUseClue,
	revealedClueIndex = null,
	currentIndex = 0,
	currentHint = '',
	cosmicRayUsed = false,
	onUseCosmicRay,
	canUseCosmicRay = true,
	telemetryScanUsed = false,
	onUseTelemetryScan,
	canUseTelemetryScan = true,
	chronoFreezeUsed = false,
	onUseChronoFreeze,
	canUseChronoFreeze = true,
	timerEnabled = true,
	isPaused = false,
	soundEnabled = true,
}) {
	const isClueRevealedForCurrent =
		revealedClueIndex === currentIndex && Boolean(currentHint);

	const lifelines = [
		{ id: 'clue', used: cosmicClueUsed },
		{ id: 'ray', used: cosmicRayUsed },
		{ id: 'scan', used: telemetryScanUsed },
		{ id: 'freeze', used: chronoFreezeUsed },
	];
	const usedCount = lifelines.filter((l) => l.used).length;
	const isPureQuest = usedCount === 0;

	return (
		<div className='w-full flex flex-col gap-2 select-none'>
			{/* Inline Revealed Clue Card (Appears directly when Cosmic Clue 1x Lifeline is used on this question) */}
			{isClueRevealedForCurrent && (
				<div
					role='region'
					aria-label='Cosmic Clue guidance'
					className='w-full bg-gradient-to-r from-pink-950/95 via-[#231545]/95 to-purple-950/95 border-2 border-pink-400/80 rounded-2xl p-3 sm:p-4 text-white shadow-[0_0_25px_rgba(244,114,182,0.35)] animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-start gap-3'>
					<div
						aria-hidden='true'
						className='w-9 h-9 rounded-xl bg-pink-500/30 border border-pink-400/60 flex items-center justify-center text-pink-300 flex-shrink-0 text-lg shadow-inner animate-pulse'>
						💡
					</div>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center justify-between gap-2 mb-1'>
							<span className='text-[10px] sm:text-xs font-black uppercase tracking-wider text-pink-300'>
								✨ Mission Control Clue (1x Quest Lifeline Activated)
							</span>
							<span className='text-[10px] font-bold text-pink-400/80 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-400/30'>
								Used for Question {currentIndex + 1}
							</span>
						</div>
						<p className='text-xs sm:text-sm font-extrabold text-pink-50 leading-relaxed'>
							{currentHint ||
								"Look closely at the shapes, numbers, and relationships. Eliminate options that don't fit!"}
						</p>
					</div>
				</div>
			)}

			{/* Main Cosmic Lifelines Bar */}
			<div
				role='region'
				aria-label='Cosmic lifelines quick-access console'
				className='w-full bg-[#0D1137]/90 border-2 border-indigo-500/30 rounded-2xl p-2 sm:p-2.5 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2'>
				{/* Left: Bar Title & Pure Quest Status */}
				<div className='flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto px-1'>
					<div className='flex items-center gap-1.5'>
						<Sparkles className='w-4 h-4 text-amber-400 fill-amber-400 animate-spin-slow' />
						<span className='text-[11px] sm:text-xs font-black uppercase tracking-wider text-indigo-200'>
							Lifelines
						</span>
						<span className='text-[10px] font-bold text-slate-400 hidden md:inline'>
							(1 use each per quest)
						</span>
					</div>

					{/* Pure Quest Badge */}
					{isPureQuest ?
						<div
							title='Pure Quest active! Complete all questions without using any lifeline to earn a +50 XP bonus and the Pure Quest Navigator badge!'
							className='flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-yellow-400/50 text-[10px] font-black text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.2)] animate-pulse'>
							<span>🌟</span>
							<span>Pure Quest: +50 XP</span>
						</div>
					:	<span className='text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-white/10'>
							{usedCount}/4 Used
						</span>
					}
				</div>

				{/* Right: 4 Direct-Access Lifeline Buttons */}
				<div className='grid grid-cols-4 gap-1.5 sm:gap-2 w-full sm:w-auto'>
					{/* Lifeline 1: Cosmic Clue (1x usage per quest) */}
					<button
						type='button'
						disabled={cosmicClueUsed || isPaused}
						onClick={() => {
							playButtonPop(soundEnabled);
							if (onUseClue) onUseClue();
						}}
						title={
							cosmicClueUsed ?
								'Cosmic Clue already used for this quest (1 use per quest)'
							: isPaused ?
								'Resume challenge to use lifelines'
							:	'Reveal Mission Control clue for this question (1-time use per quest)'

						}
						aria-label={
							cosmicClueUsed ?
								'Cosmic Clue: Used for this quest'
							:	'Use Cosmic Clue lifeline (1-time use per quest)'
						}
						className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 border ${
							cosmicClueUsed ?
								'bg-slate-900/80 border-slate-700/60 text-slate-500 opacity-40 cursor-not-allowed select-none'
							: isPaused ?
								'bg-slate-800/60 border-slate-700/40 text-slate-500 opacity-50 cursor-not-allowed'
							:	'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white border-pink-400/40 shadow-md hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-pink-400/40'
						}`}>
						<span className='text-xs sm:text-sm'>💡</span>
						<span className='truncate'>{cosmicClueUsed ? 'Used' : 'Clue'}</span>
					</button>

					{/* Lifeline 2: 50/50 Cosmic Ray (1x usage per quest) */}
					<button
						type='button'
						disabled={cosmicRayUsed || !canUseCosmicRay || isPaused}
						onClick={() => {
							playButtonPop(soundEnabled);
							if (onUseCosmicRay) onUseCosmicRay();
						}}
						title={
							cosmicRayUsed ?
								'50/50 Cosmic Ray already used for this quest (1 use per quest)'
							: isPaused ?
								'Resume challenge to use lifelines'
							:	'Disintegrate 2 wrong options with a cosmic beam (1-time use per quest)'

						}
						aria-label={
							cosmicRayUsed ?
								'50/50 Cosmic Ray: Used for this quest'
							:	'Fire 50/50 Cosmic Ray to eliminate two wrong answers'
						}
						className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 border ${
							cosmicRayUsed ?
								'bg-slate-900/80 border-slate-700/60 text-slate-500 opacity-40 cursor-not-allowed select-none'
							: !canUseCosmicRay || isPaused ?
								'bg-slate-800/60 border-slate-700/40 text-slate-500 opacity-50 cursor-not-allowed'
							:	'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-amber-400/40 shadow-md hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-amber-400/40'
						}`}>
						<Zap className='w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current' />
						<span className='truncate'>{cosmicRayUsed ? 'Used' : '50/50'}</span>
					</button>

					{/* Lifeline 3: Starfleet Telemetry Radar (1x usage per quest) */}
					<button
						type='button'
						disabled={telemetryScanUsed || !canUseTelemetryScan || isPaused}
						onClick={() => {
							playButtonPop(soundEnabled);
							if (onUseTelemetryScan) onUseTelemetryScan();
						}}
						title={
							telemetryScanUsed ?
								'Telemetry Radar already used for this quest (1 use per quest)'
							: isPaused ?
								'Resume challenge to use lifelines'
							:	'Deploy satellite radar sweep to detect option probabilities (1-time use per quest)'

						}
						aria-label={
							telemetryScanUsed ?
								'Starfleet Telemetry Radar: Used for this quest'
							:	'Deploy Starfleet Telemetry Radar scan'
						}
						className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 border ${
							telemetryScanUsed ?
								'bg-slate-900/80 border-slate-700/60 text-slate-500 opacity-40 cursor-not-allowed select-none'
							: !canUseTelemetryScan || isPaused ?
								'bg-slate-800/60 border-slate-700/40 text-slate-500 opacity-50 cursor-not-allowed'
							:	'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-cyan-400/40 shadow-md hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-cyan-400/40'
						}`}>
						<Radio className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
						<span className='truncate'>
							{telemetryScanUsed ? 'Used' : 'Radar'}
						</span>
					</button>

					{/* Lifeline 4: Chrono Freeze (+30s) (1x usage per quest) */}
					<button
						type='button'
						disabled={chronoFreezeUsed || !canUseChronoFreeze || isPaused}
						onClick={() => {
							playButtonPop(soundEnabled);
							if (onUseChronoFreeze) onUseChronoFreeze();
						}}
						title={
							chronoFreezeUsed ?
								'Chrono Freeze already used for this quest (1 use per quest)'
							: isPaused ?
								'Resume challenge to use lifelines'
							: timerEnabled ?
								`Add +${CHRONO_FREEZE_SECONDS}s time warp boost to the timer (1-time use per quest)`
							:	'Activate Cosmic Focus Shield for +20 bonus XP (1-time use per quest)'

						}
						aria-label={
							chronoFreezeUsed ?
								'Chrono Freeze: Used for this quest'
							:	`Activate Chrono Freeze (+${CHRONO_FREEZE_SECONDS}s)`
						}
						className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 border ${
							chronoFreezeUsed ?
								'bg-slate-900/80 border-slate-700/60 text-slate-500 opacity-40 cursor-not-allowed select-none'
							: !canUseChronoFreeze || isPaused ?
								'bg-slate-800/60 border-slate-700/40 text-slate-500 opacity-50 cursor-not-allowed'
							:	'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-emerald-400/40 shadow-md hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-emerald-400/40'
						}`}>
						<Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
						<span className='truncate'>
							{chronoFreezeUsed ? 'Used' : `+${CHRONO_FREEZE_SECONDS}s`}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
});

export default CosmicLifelinesBar;
