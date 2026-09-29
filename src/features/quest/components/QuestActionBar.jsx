import { Clock, Pause, Play, SkipForward } from 'lucide-react';
import { memo } from 'react';

/**
 * QuestActionBar Component
 *
 * Implements SOLID Single Responsibility:
 * Controls quest-level actions: Skip question, Pause/Resume timer,
 * and Submit selected option.
 */
export const QuestActionBar = memo(function QuestActionBar({
	isTimerPaused,
	handleSkip,
	timerConfig,
	handleToggleTimerPause,
	chronoFreezeActive,
	questionTimeRemaining,
	timerSeconds,
	selectedOptionId,
	handleSubmit,
}) {
	return (
		<div
			id='bottom-action-bar'
			data-no-auto-resume='true'
			className='flex-shrink-0 sticky bottom-0 sm:bottom-1 z-30 w-full flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3 px-3.5 sm:px-6 select-none border-t border-white/15 bg-[#0C1033]/95 backdrop-blur-md rounded-2xl shadow-[0_-8px_25px_rgba(0,0,0,0.5)]'>
			{/* Left: Skip Button */}
			<div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
				<button
					disabled={isTimerPaused}
					onClick={handleSkip}
					className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 border-2 ${
						isTimerPaused ?
							'bg-slate-800/70 border-slate-700/60 text-slate-500 cursor-not-allowed opacity-50 shadow-none'
						:	'bg-[#1A1D54] hover:bg-[#252A74] text-slate-300 hover:text-white border-indigo-400/40 hover:border-indigo-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:outline-none'
					}`}
					title={
						isTimerPaused ?
							'Resume challenge to skip question'
						:	'Skip this question'
					}
					aria-label={
						isTimerPaused ?
							'Skip is disabled while challenge is paused. Resume challenge to skip.'
						:	'Skip this question'
					}
					aria-disabled={isTimerPaused}>
					<SkipForward
						className={`w-4 h-4 ${isTimerPaused ? 'text-slate-500' : 'text-amber-400'}`}
					/>
					<span>Skip</span>
				</button>
			</div>

			{/* Center: Running Timer for both Timer Limit (countdown) & Infinite Timer (stopwatch) */}
			<div className='flex items-center justify-center flex-1 mx-2 sm:mx-4'>
				{timerConfig?.enabled ?
					<button
						type='button'
						onClick={handleToggleTimerPause}
						role='timer'
						aria-live='off'
						className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl border font-mono font-black text-sm sm:text-base md:text-lg tracking-wider shadow-inner transition-all cursor-pointer select-none group ${
							isTimerPaused ?
								'bg-amber-950/90 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 animate-pulse'
							: chronoFreezeActive ?
								'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
							: questionTimeRemaining <= 5 ?
								'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-400/40 animate-bounce'
							: questionTimeRemaining <= 15 ?
								'bg-amber-950/70 border-amber-400 text-amber-300 ring-2 ring-amber-400/30 animate-pulse'
							:	'bg-[#121644]/90 border-cyan-400/50 hover:border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
						}`}
						title={
							isTimerPaused ?
								'Timer paused. Click to resume or interact with the question.'
							:	'Click to pause question timer'
						}
						aria-label={
							isTimerPaused ?
								`Countdown paused at ${Math.floor(questionTimeRemaining / 60)}:${(questionTimeRemaining % 60).toString().padStart(2, '0')}. Click to resume.`
							:	`Question countdown: ${questionTimeRemaining} seconds remaining. Click to pause.`
						}>
						{isTimerPaused ?
							<Play className='w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current' />
						: questionTimeRemaining <= 15 ?
							<Clock className='w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin' />
						:	<Pause className='w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform' />
						}
						<span>
							{Math.floor(questionTimeRemaining / 60)
								.toString()
								.padStart(2, '0')}
							:
							{(questionTimeRemaining % 60)
								.toString()
								.padStart(2, '0')}
						</span>
						{isTimerPaused ?
							<span className='text-[10px] sm:text-xs uppercase font-black tracking-wider bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30'>
								Paused
							</span>
						: chronoFreezeActive ?
							<span className='text-[10px] sm:text-xs uppercase font-black tracking-wider bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/40 animate-pulse ml-0.5'>
								⏱️ +30s
							</span>
						:	<span className='text-[10px] sm:text-xs uppercase font-extrabold tracking-widest opacity-80 ml-0.5 hidden xs:inline'>
								Left
							</span>
						}
					</button>
				:	<button
						type='button'
						onClick={handleToggleTimerPause}
						role='timer'
						aria-live='off'
						className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl border font-mono font-black text-sm sm:text-base md:text-lg tracking-wider shadow-inner transition-all cursor-pointer select-none group ${
							isTimerPaused ?
								'bg-amber-950/90 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 animate-pulse'
							:	'bg-[#121644]/90 border-pink-400/40 hover:border-pink-400/80 text-pink-300 hover:text-white shadow-[0_0_15px_rgba(244,114,182,0.15)]'
						}`}
						title={
							isTimerPaused ?
								'Timer paused. Click to resume or interact with the question.'
							:	'Click to pause session timer'
						}
						aria-label={
							isTimerPaused ?
								`Timer paused at ${Math.floor(timerSeconds / 60)}:${(timerSeconds % 60).toString().padStart(2, '0')}. Click to resume.`
							:	`Elapsed time: ${Math.floor(timerSeconds / 60)}:${(timerSeconds % 60).toString().padStart(2, '0')}. Click to pause.`
						}>
						{isTimerPaused ?
							<Play className='w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current' />
						:	<Pause className='w-4 h-4 sm:w-5 sm:h-5 text-pink-300 group-hover:scale-110 transition-transform' />
						}
						<span>
							{Math.floor(timerSeconds / 60)
								.toString()
								.padStart(2, '0')}
							:{(timerSeconds % 60).toString().padStart(2, '0')}
						</span>
						{isTimerPaused ?
							<span className='text-[10px] sm:text-xs uppercase font-black tracking-wider bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30'>
								Paused
							</span>
						:	<span className='text-[10px] sm:text-xs uppercase font-extrabold tracking-widest opacity-80 ml-0.5 hidden xs:inline'>
								Elapsed
							</span>
						}
					</button>
				}
			</div>

			{/* Right: Submit Button */}
			<button
				disabled={!selectedOptionId}
				onClick={handleSubmit}
				aria-label={
					selectedOptionId ? 'Submit your answer' : (
						'Select an answer option to submit'
					)
				}
				aria-disabled={!selectedOptionId}
				className={`px-7 sm:px-12 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base md:text-lg tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2.5 flex-shrink-0 focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:outline-none ${
					selectedOptionId ?
						'bg-[#FF5B84] hover:bg-[#FF435A] text-white hover:scale-[1.02] active:scale-95 shadow-[0_8px_20px_rgba(255,91,132,0.4)] cursor-pointer'
					:	'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
				}`}>
				<span>Submit</span>
			</button>
		</div>
	);
});

export default QuestActionBar;
