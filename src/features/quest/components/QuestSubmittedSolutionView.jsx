import { memo } from 'react';
import OptionsGrid from '../OptionsGrid';
import QuestionCard from '../QuestionCard';
import SolutionPanel from '../SolutionPanel';

/**
 * QuestSubmittedSolutionView Component
 *
 * Implements SOLID Single Responsibility:
 * Displays QuestionCard + OptionsGrid (submitted state) alongside
 * SolutionPanel with step-by-step reasoning, voice tutor launcher, and Next button.
 */
export const QuestSubmittedSolutionView = memo(
	function QuestSubmittedSolutionView({
		resumeTimerIfPaused,
		currentQuestion,
		currentIndex,
		totalQuestions,
		setIsZoomOpen,
		soundEnabled,
		showVisualDiagrams,
		kidName,
		kidAge,
		isReviewMode,
		selectedOptionId,
		handleSelectOption,
		isTimedOut,
		autoAdvanceCountdown,
		setIsAskDoubtOpen,
		handleNext,
		wasSkippedOnRevisit,
		hasNextSkipped,
	}) {
		return (
			<div
				onPointerDownCapture={resumeTimerIfPaused}
				className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch w-full h-full lg:max-h-[calc(100dvh-95px)] min-h-0'>
				{/* Left Column: Question Card & compact Options */}
				<div className='lg:col-span-7 flex flex-col gap-3 lg:max-h-[calc(100dvh-95px)] lg:overflow-y-auto pr-1 min-h-0'>
					<QuestionCard
						question={currentQuestion}
						currentIndex={currentIndex}
						totalQuestions={totalQuestions}
						onZoomClick={() => setIsZoomOpen(true)}
						soundEnabled={soundEnabled}
						isSubmitted={true}
						showVisualDiagrams={showVisualDiagrams}
						kidName={kidName}
						kidAge={kidAge}
						isReviewMode={isReviewMode}
					/>
					<OptionsGrid
						options={currentQuestion?.options || []}
						selectedOptionId={selectedOptionId}
						onSelectOption={handleSelectOption}
						isSubmitted={true}
						correctAnswerId={currentQuestion?.correctAnswerId}
						soundEnabled={soundEnabled}
						showVisualDiagrams={showVisualDiagrams}
						question={currentQuestion}
					/>
				</div>

				{/* Right Column: Solution & Feedback Panel with NEXT BUTTON right below solution! */}
				<div className='lg:col-span-5 flex flex-col min-w-0 h-full lg:max-h-[calc(100dvh-95px)] min-h-0'>
					<SolutionPanel
						isCorrect={selectedOptionId === currentQuestion?.correctAnswerId}
						isTimedOut={isTimedOut}
						autoAdvanceCountdown={autoAdvanceCountdown}
						question={currentQuestion}
						onAskDoubt={() => setIsAskDoubtOpen(true)}
						soundEnabled={soundEnabled}
						onNext={handleNext}
						showVisualDiagrams={showVisualDiagrams}
						isReviewMode={isReviewMode}
						wasSkippedOnRevisit={wasSkippedOnRevisit}
						hasNextSkipped={hasNextSkipped}
					/>
				</div>
			</div>
		);
	},
);

export default QuestSubmittedSolutionView;
