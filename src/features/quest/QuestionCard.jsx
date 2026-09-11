import { Brain, Eye, Volume2, ZoomIn } from 'lucide-react';
import { memo, useState } from 'react';
import {
	playButtonPop,
	speakText,
	stopSpeaking,
} from '../../utils/audioSynthesis';
import { getStoredKidAge, getStoredKidName } from '../../utils/progressTracker';
import VisualDiagram, {
	isDiagramAppropriateForQuestion,
} from '../../utils/VisualDiagrams';

const QuestionCard = memo(function QuestionCard({
	question,
	currentIndex,
	totalQuestions,
	onZoomClick,
	soundEnabled,
	isSubmitted = false,
	showVisualDiagrams = false,
	kidName,
	kidAge,
	isReviewMode = false,
}) {
	const [isSpeaking, setIsSpeaking] = useState(false);

	const resolvedKidName =
		(kidName && String(kidName).trim()) || getStoredKidName() || 'Explorer';
	const resolvedKidAge = kidAge || getStoredKidAge() || 5;

	const hasAppropriateDiagram = Boolean(
		showVisualDiagrams &&
		question.diagramType &&
		isDiagramAppropriateForQuestion(
			question.diagramType,
			question.diagramData,
			question.question || question.questionText,
		),
	);

	const handleListenQuestion = () => {
		playButtonPop(soundEnabled);
		if (isSpeaking) {
			stopSpeaking();
			setIsSpeaking(false);
			return;
		}

		const textToRead =
			question.promptAudio || question.question || question.questionText || '';
		if (!textToRead) return;

		setIsSpeaking(true);
		speakText(
			textToRead,
			() => setIsSpeaking(true),
			() => setIsSpeaking(false),
		);
	};

	const isVisual = question.category === 'Visual';

	return (
		<section
			aria-labelledby='question-prompt-heading'
			className={`bg-white text-[#1E293B] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-col justify-between border-4 border-white/90 relative overflow-hidden transition-all duration-300 flex-1 h-full w-full min-h-0 ${
				isSubmitted ?
					'min-h-[180px] sm:min-h-[220px]'
				:	'min-h-[240px] sm:min-h-[280px]'
			}`}>
			{/* Top Bar: Question Index, Explorer Profile, Category Badge, Zoom Button */}
			<div className='flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2 flex-shrink-0'>
				{/* Left: Step Indicator & Explorer Badge */}
				<div className='flex items-center gap-1.5 sm:gap-2 min-w-0'>
					{/* Step Indicator */}
					<div className='bg-[#302B63] text-white text-xs sm:text-sm font-black px-2.5 sm:px-3 py-1 rounded-lg shadow-sm flex-shrink-0'>
						{currentIndex + 1}/{totalQuestions}
					</div>

					{/* Explorer Badge (Child Name & Age) */}
					<div
						className='flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200/80 rounded-lg px-2 sm:px-2.5 py-1 shadow-xs min-w-0'
						title={`Explorer: ${resolvedKidName} (Age ${resolvedKidAge})`}>
						<span className='text-xs sm:text-sm leading-none flex-shrink-0'>
							🧑‍🚀
						</span>
						<span className='font-black text-slate-800 text-xs truncate max-w-[85px] xs:max-w-[130px] sm:max-w-[170px]'>
							{resolvedKidName}
						</span>
						<span className='bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs flex-shrink-0'>
							Age {resolvedKidAge}
						</span>
					</div>
				</div>

				{/* Right: Category Badge & Zoom Button */}
				<div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
					{/* Category Badge */}
					<div className='flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border bg-slate-50 text-slate-700 border-slate-200'>
						{isVisual ?
							<>
								<Eye className='w-3.5 h-3.5 text-sky-600' />
								<span className='text-sky-700 font-extrabold'>Visual</span>
							</>
						:	<>
								<Brain className='w-3.5 h-3.5 text-purple-600' />
								<span className='text-purple-700 font-extrabold'>
									Analytical Thinking
								</span>
							</>
						}
					</div>

					{/* Zoom Button */}
					{hasAppropriateDiagram ?
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								onZoomClick();
							}}
							aria-label='Open close-up diagram view'
							className='flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none'
							title='Zoom image'>
							<ZoomIn className='w-3.5 h-3.5' />
							<span className='hidden xs:inline'>ZOOM</span>
						</button>
					:	null}
				</div>
			</div>

			{/* Revisit Review Mode Banner */}
			{isReviewMode && (
				<div
					role='status'
					className='bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl mb-2 flex items-center justify-between shadow-md animate-pulse border border-amber-300/60 flex-shrink-0'>
					<div className='flex items-center gap-1.5'>
						<span>🔄</span>
						<span>REVISITING SKIPPED QUESTION</span>
					</div>
					<span className='bg-black/25 text-amber-100 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-inner'>
						Question {currentIndex + 1}
					</span>
				</div>
			)}

			{/* Skill Objective Subtitle */}
			<div className='text-[11px] sm:text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 mb-2 text-center flex-shrink-0'>
				{isVisual ?
					'🎯 Goal: Spot & analyze visual details to solve the puzzle'
				:	'🎯 Goal: Plan & break down relationships to solve the problem'}
			</div>

			{/* Center Section: Question Prompt & Diagram */}
			<div className='flex-1 min-h-0 overflow-y-auto pr-1.5 flex flex-col justify-start py-1 sm:py-2'>
				{/* Question Prompt */}
				<div className='flex items-start gap-3 my-1.5 flex-shrink-0'>
					<h2
						id='question-prompt-heading'
						className='text-base sm:text-lg md:text-xl font-extrabold text-slate-800 leading-snug'>
						{question.question || question.questionText}
					</h2>

					{/* Read-Aloud Speaker Button */}
					<button
						type='button'
						onClick={handleListenQuestion}
						aria-label={
							isSpeaking ? 'Stop reading question aloud' : 'Read question aloud'
						}
						aria-pressed={isSpeaking}
						className={`p-1.5 rounded-full transition-all shadow-sm flex-shrink-0 mt-0.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
							isSpeaking ?
								'bg-purple-300 text-purple-900 ring-2 ring-purple-500 scale-110 animate-pulse'
							:	'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-110 active:scale-95'
						}`}
						title='Listen to question'>
						<Volume2
							className={`w-4 h-4 sm:w-5 sm:h-5 ${isSpeaking ? 'animate-bounce text-purple-950' : ''}`}
						/>
					</button>
				</div>

				{/* Visual Diagram (only if question has a valid, appropriate diagram) */}
				{hasAppropriateDiagram && (
					<VisualDiagram
						type={question.diagramType}
						data={{
							...question.diagramData,
							questionText: question.question || question.questionText,
							correctAnswerText:
								question.correctAnswerText || question.correctAnswer,
						}}
					/>
				)}
			</div>

			{/* Footer cue */}
			<div
				aria-hidden='true'
				className='mt-auto pt-2 text-center text-xs font-semibold text-slate-400 border-t border-slate-50 flex-shrink-0'>
				✨ Tap an answer choice on the right
			</div>
		</section>
	);
});

export default QuestionCard;
