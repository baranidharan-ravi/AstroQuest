import { Pause, Play } from 'lucide-react';
import React, { memo } from 'react';
import { playButtonPop } from '../../../utils/audioSynthesis';

/**
 * QuestPauseShield Component
 *
 * Implements SOLID Single Responsibility:
 * Displays anti-cheat / screenshot blur shield overlay when challenge timer is paused.
 */
export const QuestPauseShield = memo(function QuestPauseShield({
	isTimerPaused,
	resumeTimerIfPaused,
	soundEnabled = true,
}) {
	if (!isTimerPaused) return null;

	return (
		<div
			onClick={resumeTimerIfPaused}
			className='absolute inset-x-0 top-0 bottom-16 sm:bottom-20 z-20 flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-slate-950/40 backdrop-blur-[2px] rounded-3xl animate-in fade-in duration-200 select-none'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='p-6 sm:p-8 rounded-3xl bg-[#0e1238]/95 border-2 border-amber-400/80 shadow-[0_0_50px_rgba(251,191,36,0.3)] flex flex-col items-center max-w-sm sm:max-w-md mx-auto'>
				<div className='w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 mb-3 animate-pulse shadow-lg'>
					<Pause className='w-8 h-8 fill-current' />
				</div>
				<h3 className='text-xl sm:text-2xl font-black text-white tracking-wide mb-1'>
					Challenge Paused ⏸️
				</h3>
				<p className='text-xs sm:text-sm font-semibold text-slate-300 mb-5 leading-relaxed'>
					Question and choices are hidden while paused to keep the
					challenge fair. Tap resume when ready to continue!
				</p>
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						resumeTimerIfPaused();
					}}
					className='px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer'>
					<Play className='w-4 h-4 fill-current' />
					<span>Resume Challenge</span>
				</button>
			</div>
		</div>
	);
});

export default QuestPauseShield;
