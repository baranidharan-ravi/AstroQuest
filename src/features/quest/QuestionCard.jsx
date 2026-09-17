import { Brain, Eye, Mic, MicOff, Volume2, ZoomIn } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import {
	playButtonPop,
	speakText,
	stopSpeaking,
} from '../../utils/audioSynthesis';
import { getStoredKidAge, getStoredKidName } from '../../utils/progressTracker';
import VisualDiagram, {
	isDiagramAppropriateForQuestion,
} from '../../utils/VisualDiagrams';
import InteractiveManipulative from './InteractiveManipulative';

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
	onSelectOption,
}) {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [activeCharIndex, setActiveCharIndex] = useState(-1);

	// Hands-free Speech-to-Text Answer Input
	const {
		isSupported: isSpeechSupported,
		isListening,
		transcript,
		toggleListening,
	} = useSpeechRecognition({
		options: question?.options,
		onSelectOption,
		soundEnabled,
	});

	const resolvedKidName =
		(kidName && String(kidName).trim()) || getStoredKidName() || 'Explorer';
	const resolvedKidAge = kidAge || getStoredKidAge() || 5;

	// Reset speech on question transition
	useEffect(() => {
		setIsSpeaking(false);
		setActiveCharIndex(-1);
		return () => {
			stopSpeaking();
		};
	}, [question]);

	const promptText = question.question || question.questionText || '';

	// Memoize word tokens with character boundaries for high-performance karaoke highlighting
	const wordsWithOffsets = useMemo(() => {
		if (!promptText) return [];
		const tokens = [];
		const regex = /\S+/g;
		let match;
		while ((match = regex.exec(promptText)) !== null) {
			tokens.push({
				word: match[0],
				startIndex: match.index,
				endIndex: match.index + match[0].length,
			});
		}
		return tokens;
	}, [promptText]);

	const hasAppropriateDiagram = Boolean(
		showVisualDiagrams &&
		question.diagramType &&
		isDiagramAppropriateForQuestion(
			question.diagramType,
			question.diagramData,
			promptText,
		),
	);

	const handleListenQuestion = () => {
		playButtonPop(soundEnabled);
		if (isSpeaking) {
			stopSpeaking();
			setIsSpeaking(false);
			setActiveCharIndex(-1);
			return;
		}

		const textToRead = question.promptAudio || promptText;
		if (!textToRead) return;

		setIsSpeaking(true);
		setActiveCharIndex(0);
		speakText(
			textToRead,
			() => {
				setIsSpeaking(true);
				setActiveCharIndex(0);
			},
			() => {
				setIsSpeaking(false);
				setActiveCharIndex(-1);
			},
			(boundary) => {
				if (boundary && typeof boundary.charIndex === 'number') {
					setActiveCharIndex(boundary.charIndex);
				}
			},
		);
	};

	const isVisual = question.category === 'Visual';
	const isBossQuestion =
		currentIndex === totalQuestions - 1 && totalQuestions >= 5;

	return (
		<section
			aria-labelledby='question-prompt-heading'
			className={`bg-white text-[#1E293B] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 flex-1 h-full w-full min-h-0 ${
				isBossQuestion ?
					'border-4 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.35)] ring-2 ring-amber-400/60'
				:	'border-4 border-white/90 shadow-2xl'
			} ${
				isSubmitted ?
					'min-h-[180px] sm:min-h-[220px]'
				:	'min-h-[240px] sm:min-h-[280px]'
			}`}>
			{/* Mission Control Super Challenge (Boss Question) Alert Banner */}
			{isBossQuestion && !isReviewMode && (
				<div
					role='status'
					className='bg-gradient-to-r from-red-600 via-amber-600 to-red-700 text-white text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl mb-2 flex items-center justify-between shadow-lg animate-pulse border-2 border-amber-300 flex-shrink-0'>
					<div className='flex items-center gap-1.5'>
						<span className='text-sm'>⚠️</span>
						<span>MISSION CONTROL SUPER CHALLENGE: FINAL BOSS ENCOUNTER!</span>
					</div>
					<span className='bg-black/40 text-amber-300 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-inner border border-amber-400/50 flex-shrink-0'>
						🔥 2X XP REWARD
					</span>
				</div>
			)}

			{/* Hands-Free Voice Listening Status Banner */}
			{isListening && (
				<div
					role='status'
					aria-live='polite'
					className='bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl mb-2 flex items-center justify-between shadow-lg animate-in fade-in duration-200 border border-pink-300/40 flex-shrink-0'>
					<div className='flex items-center gap-2'>
						<span className='relative flex h-3 w-3'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
							<span className='relative inline-flex rounded-full h-3 w-3 bg-pink-200'></span>
						</span>
						<span>
							{transcript ?
								`🎙️ Heard: "${transcript}"`
							:	'🎙️ Listening... Say "Option B" or your answer!'}
						</span>
					</div>
					<button
						type='button'
						onClick={toggleListening}
						className='bg-white/20 hover:bg-white/30 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer'>
						Stop
					</button>
				</div>
			)}

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
						{wordsWithOffsets.length > 0 ?
							wordsWithOffsets.map((token, idx) => {
								const isSpoken =
									isSpeaking &&
									activeCharIndex >= token.startIndex &&
									activeCharIndex <= token.endIndex + 1;
								return (
									<span
										key={idx}
										className={`transition-all duration-150 inline-block mr-1.5 ${
											isSpoken ?
												'bg-cyan-100 text-cyan-950 font-black px-1 rounded-md shadow-xs ring-2 ring-cyan-400 scale-105'
											:	''
										}`}>
										{token.word}
									</span>
								);
							})
						:	question.question || question.questionText}
					</h2>

					{/* Action Buttons: Voice Input & Speaker */}
					<div className='flex items-center gap-1.5 flex-shrink-0 mt-0.5'>
						{/* Speech-to-Text Microphone Button (for voice answers) */}
						{!isSubmitted && isSpeechSupported && (
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									toggleListening();
								}}
								aria-label={
									isListening ?
										'Stop listening for voice answer'
									:	'Speak your answer aloud'
								}
								aria-pressed={isListening}
								className={`p-1.5 rounded-full transition-all shadow-sm flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none ${
									isListening ?
										'bg-rose-500 text-white ring-4 ring-rose-300 animate-pulse scale-110'
									:	'bg-pink-100 text-pink-700 hover:bg-pink-200 hover:scale-110 active:scale-95'
								}`}
								title='Speak your answer (e.g. "Option A" or answer text)'>
								{isListening ?
									<Mic className='w-4 h-4 sm:w-5 sm:h-5 text-white animate-bounce' />
								:	<MicOff className='w-4 h-4 sm:w-5 sm:h-5' />}
							</button>
						)}

						{/* Read-Aloud Speaker Button */}
						<button
							type='button'
							onClick={handleListenQuestion}
							aria-label={
								isSpeaking ?
									'Stop reading question aloud'
								:	'Read question aloud'
							}
							aria-pressed={isSpeaking}
							className={`p-1.5 rounded-full transition-all shadow-sm flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
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
				</div>

				{/* Interactive Manipulative (balance scale, clock hands, rotatable blocks) OR Visual Diagram */}
				{(
					['balance-scale', 'analog-clock', 'block-tower'].includes(
						question.diagramType,
					)
				) ?
					<InteractiveManipulative
						type={question.diagramType}
						data={question.diagramData}
						soundEnabled={soundEnabled}
					/>
				: hasAppropriateDiagram ?
					<VisualDiagram
						type={question.diagramType}
						data={{
							...question.diagramData,
							questionText: question.question || question.questionText,
							correctAnswerText:
								question.correctAnswerText || question.correctAnswer,
						}}
					/>
				:	null}
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
