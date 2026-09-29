import { Play, Rocket, Sparkles } from 'lucide-react';
import { memo } from 'react';

/**
 * QuestLoadingNextView Component
 *
 * Implements SOLID Single Responsibility:
 * Displays inter-question transition screen with cosmic trivia facts
 * and immediate resume loading action.
 */
export const QuestLoadingNextView = memo(function QuestLoadingNextView({
	activeCosmicFact,
	handleImmediateResumeAndLoadNext,
}) {
	return (
		<div className='w-full max-w-lg mx-auto my-auto flex flex-col items-center justify-center p-8 sm:p-10 bg-gradient-to-b from-[#1C1F5E]/95 via-[#141846]/95 to-[#0D1030] border-2 sm:border-4 border-cyan-400/60 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.25)] text-center animate-in fade-in zoom-in-95 duration-200'>
			<div className='relative mb-5'>
				<div className='w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-xl animate-bounce-short'>
					<Rocket className='w-9 h-9 sm:w-10 sm:h-10 text-cyan-300 -rotate-45' />
				</div>
				<Sparkles className='w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-pulse' />
			</div>
			<h2 className='text-xl sm:text-2xl font-black text-white tracking-wide mb-1'>
				Loading Next Challenge... 🚀
			</h2>
			<p className='text-xs sm:text-sm font-semibold text-slate-300 max-w-sm mb-4 leading-relaxed'>
				Timer is paused while the next question loads.
			</p>

			{/* Cosmic Space Factoid Display */}
			{activeCosmicFact && (
				<div className='w-full bg-[#090C28]/85 border border-cyan-400/30 rounded-2xl p-3.5 sm:p-4 mb-5 text-left shadow-inner flex items-start gap-3'>
					<span
						className='text-2xl flex-shrink-0'
						aria-hidden='true'>
						{activeCosmicFact.emoji}
					</span>
					<div className='flex flex-col min-w-0'>
						<div className='flex items-center gap-2 mb-1'>
							<span className='text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
								Cosmic Fact 🛸 • {activeCosmicFact.topic}
							</span>
						</div>
						<p className='text-xs sm:text-sm font-medium text-slate-200 leading-relaxed'>
							{activeCosmicFact.fact}
						</p>
					</div>
				</div>
			)}

			<button
				type='button'
				onClick={handleImmediateResumeAndLoadNext}
				className='px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer'>
				<Play className='w-4 h-4 fill-current' />
				<span>Resume & Load Now ➔</span>
			</button>
		</div>
	);
});

export default QuestLoadingNextView;
