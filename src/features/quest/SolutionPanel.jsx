import {
	ArrowRight,
	CheckCircle2,
	Clock,
	HelpCircle,
	Lightbulb,
	Sparkles,
	Volume2,
	XCircle,
} from 'lucide-react';
import { memo } from 'react';
import { playButtonPop, speakText } from '../../utils/audioSynthesis';
import VisualDiagram, {
	isDiagramAppropriateForQuestion,
} from '../../utils/VisualDiagrams';

const SolutionPanel = memo(function SolutionPanel({
	isCorrect,
	isTimedOut = false,
	autoAdvanceCountdown = null,
	question,
	onAskDoubt,
	soundEnabled,
	onNext,
	showVisualDiagrams = false,
	isReviewMode = false,
	wasSkippedOnRevisit = false,
	hasNextSkipped = false,
}) {
	const handleListenSolution = () => {
		playButtonPop(soundEnabled);
		speakText(question.solutionText);
	};

	const solutionDiagType = question.solutionDiagramType || question.diagramType;
	const solutionDiagData = question.solutionDiagramData || question.diagramData;
	const hasAppropriateSolutionDiagram = Boolean(
		showVisualDiagrams &&
		solutionDiagType &&
		isDiagramAppropriateForQuestion(
			solutionDiagType,
			solutionDiagData,
			question.question || question.questionText,
		),
	);

	const hasCountdown =
		autoAdvanceCountdown !== null && autoAdvanceCountdown >= 0;

	return (
		<div className='flex flex-col gap-2.5 sm:gap-3 h-full lg:max-h-[calc(100dvh-95px)] min-h-0 animate-in fade-in slide-in-from-right-4 duration-300'>
			{/* Feedback Banner with Celebratory Animation on Correct or Wrong/Timeout/Skipped Styling */}
			{wasSkippedOnRevisit ?
				<div
					role='alert'
					aria-live='polite'
					className='flex-shrink-0 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5 shadow-xl border-2 transition-all relative overflow-hidden bg-[#FFFBEB] border-[#F59E0B] text-[#92400E] ring-4 ring-amber-400/20'>
					<div className='flex-shrink-0'>
						<div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-200/80 flex items-center justify-center text-base sm:text-lg shadow-sm'>
							⏭️
						</div>
					</div>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-2 flex-wrap'>
							<h3 className='text-sm sm:text-base font-black leading-tight'>
								Question Skipped — Solution Revealed ⏭️
							</h3>
							{hasCountdown && (
								<span className='px-2.5 py-0.5 rounded-full text-white text-xs font-black shadow-sm animate-pulse bg-amber-600'>
									Next in {autoAdvanceCountdown}s 🚀
								</span>
							)}
						</div>
						<p className='text-xs sm:text-sm font-semibold opacity-90 mt-0.5 leading-snug'>
							Here is the complete step-by-step solution to help you learn!
							{hasCountdown ?
								` Moving to next in ${autoAdvanceCountdown}s...`
							:	''}
						</p>
					</div>
				</div>
			:	<div
					role='alert'
					aria-live='polite'
					className={`flex-shrink-0 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5 shadow-xl border-2 transition-all relative overflow-hidden ${
						isCorrect ?
							'bg-[#E8F8F0] border-[#00D166] text-[#0A5D37] ring-4 ring-emerald-400/40 shadow-[0_0_20px_rgba(0,209,102,0.3)] animate-bounce-short'
						:	'bg-[#FFF0F2] border-[#FF435A] text-[#9E1B2D] ring-4 ring-rose-400/20'
					}`}>
					<div className='flex-shrink-0'>
						{isCorrect ?
							<div className='relative'>
								<CheckCircle2 className='w-7 h-7 sm:w-9 sm:h-9 text-[#00D166] fill-[#00D166]/20 animate-pulse' />
								<Sparkles className='w-4 h-4 text-amber-500 fill-amber-400 absolute -top-1 -right-1 animate-spin-slow' />
							</div>
						: isTimedOut ?
							<div className='relative'>
								<XCircle className='w-7 h-7 sm:w-9 sm:h-9 text-[#FF435A] fill-[#FF435A]/20' />
								<Clock className='w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-spin-slow' />
							</div>
						:	<XCircle className='w-7 h-7 sm:w-9 sm:h-9 text-[#FF435A] fill-[#FF435A]/20' />
						}
					</div>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-2 flex-wrap'>
							<h3 className='text-sm sm:text-base font-black leading-tight'>
								{isCorrect ?
									'Correct! 🎉'
								: isTimedOut ?
									"Time's Up! (No Answer Selected) ⏰"
								:	'Incorrect!'}
							</h3>
							{isCorrect && (
								<span className='px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-black shadow-sm animate-pulse'>
									+5 XP ✨
								</span>
							)}
							{hasCountdown && (
								<span
									className={`px-2.5 py-0.5 rounded-full text-white text-xs font-black shadow-sm animate-pulse ${
										isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
									}`}>
									Next in {autoAdvanceCountdown}s 🚀
								</span>
							)}
						</div>
						<p className='text-xs sm:text-sm font-semibold opacity-90 mt-0.5 leading-snug'>
							{isCorrect ?
								`Great thinking! You got it right.${hasCountdown ? ` Moving to next in ${autoAdvanceCountdown}s...` : ''}`
							: isTimedOut ?
								`No answer was selected. See the correct solution below!${hasCountdown ? ` Moving to next in ${autoAdvanceCountdown}s...` : ''}`
							:	`Don't worry, see the solution to know why!${hasCountdown ? ` Moving to next in ${autoAdvanceCountdown}s...` : ''}`
							}
						</p>
					</div>
				</div>
			}

			{/* Solution Card with Scrollable Body */}
			<div className='bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-slate-800 shadow-xl border-4 border-white/90 flex flex-col flex-1 min-h-0 overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 flex-shrink-0'>
					<div className='flex items-center gap-2 text-purple-700 font-extrabold text-sm sm:text-base'>
						<Lightbulb className='w-5 h-5 text-amber-500 fill-amber-400' />
						<span>Solution</span>
					</div>
					<button
						type='button'
						onClick={handleListenSolution}
						aria-label='Listen to solution explanation'
						className='p-1.5 rounded-full text-purple-600 hover:bg-purple-50 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none'
						title='Listen to solution'>
						<Volume2 className='w-4 h-4' />
					</button>
				</div>

				{/* Scrollable Solution Body: Explanation Text & Visual Diagram */}
				<div className='flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2'>
					{/* Solution Explanation Text */}
					<p className='text-xs sm:text-sm md:text-base font-bold text-slate-700 leading-relaxed mb-2.5'>
						{question.solutionText}
					</p>

					{/* Solution Visual Diagram (only if visual representation is valid & appropriate) */}
					{hasAppropriateSolutionDiagram && (
						<VisualDiagram
							type={solutionDiagType}
							data={{
								...solutionDiagData,
								questionText: question.question || question.questionText,
								correctAnswerText:
									question.correctAnswerText || question.correctAnswer,
							}}
							isSolution={true}
						/>
					)}
				</div>

				{/* Bottom Helper */}
				<div className='mt-2 pt-2 border-t border-slate-100 flex items-center justify-center flex-shrink-0'>
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onAskDoubt();
						}}
						aria-label='Open AI doubt helper dialog'
						className='flex items-center gap-1.5 text-xs sm:text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none p-1 rounded-lg'>
						<HelpCircle className='w-4 h-4' />
						<span>? Ask Doubt</span>
					</button>
				</div>
			</div>

			{/* NEXT BUTTON: Permanently Visible & Sticky at the bottom of the screen */}
			{onNext && (
				<div className='sticky bottom-0 sm:bottom-1 z-30 flex-shrink-0 flex justify-end pt-2 pb-1 px-1 sm:px-2 bg-[#0C1033]/95 backdrop-blur-md rounded-2xl border-t border-white/15 shadow-[0_-8px_25px_rgba(0,0,0,0.5)]'>
					<button
						type='button'
						onClick={onNext}
						aria-label={
							hasCountdown ?
								`Go to next question immediately (auto-advancing in ${autoAdvanceCountdown} seconds)`
							: isReviewMode ?
								hasNextSkipped ?
									'Go to next skipped question'
								:	'View quest results'
							:	'Go to next question'
						}
						className={`w-full px-8 sm:px-10 py-3 sm:py-3.5 rounded-full text-white font-black text-sm sm:text-base md:text-lg tracking-wider uppercase hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-white/20 focus-visible:ring-4 focus-visible:outline-none ${
							isReviewMode ?
								'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 shadow-[0_8px_25px_rgba(245,158,11,0.5)] focus-visible:ring-amber-300'
							:	'bg-[#FF5B84] hover:bg-[#FF435A] shadow-[0_8px_25px_rgba(255,91,132,0.6)] focus-visible:ring-pink-300'
						}`}>
						<span>
							{hasCountdown ?
								`Next (${autoAdvanceCountdown}s)`
							: isReviewMode ?
								hasNextSkipped ?
									'Next Skipped Question ➔'
								:	'View Final Results 🏆'
							:	'Next Question'}
						</span>
						<ArrowRight className='w-5 h-5 sm:w-6 sm:h-6' />
					</button>
				</div>
			)}
		</div>
	);
});

export default SolutionPanel;
