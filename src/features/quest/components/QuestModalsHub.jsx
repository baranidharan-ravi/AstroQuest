import { lazy, memo, Suspense } from 'react';

const HintModal = lazy(() => import('../HintModal'));
const ZoomModal = lazy(() => import('../../../utils/ZoomModal'));
const AskDoubtModal = lazy(() => import('../AskDoubtModal'));
const ExitConfirmationModal = lazy(() => import('../ExitConfirmationModal'));
const SkippedReviewModal = lazy(() => import('../SkippedReviewModal'));
const CrewSwitcherModal = lazy(
	() => import('../../dashboard/CrewSwitcherModal'),
);
const PocketPlanetariumModal = lazy(
	() => import('../../dashboard/PocketPlanetariumModal'),
);
const ConstellationObservatory = lazy(
	() => import('../../dashboard/ConstellationObservatory'),
);
const CosmicHabitatModal = lazy(
	() => import('../../dashboard/CosmicHabitatModal'),
);

/**
 * QuestModalsHub Component
 *
 * Implements SOLID Single Responsibility:
 * Hub orchestrating on-demand mounting and lifecycle of active quest dialogs and telemetry modals.
 */
export const QuestModalsHub = memo(function QuestModalsHub({
	isHintOpen,
	setIsHintOpen,
	currentQuestion,
	soundEnabled,
	handleActivateCosmicRay,
	cosmicRayUsed,
	isSubmitted,
	isTimedOut,
	handleActivateTelemetryScan,
	telemetryScan,
	telemetryScanUsed,
	handleActivateChronoFreeze,
	chronoFreezeUsed,
	eliminatedOptionIds,
	timerConfig,
	isZoomOpen,
	setIsZoomOpen,
	isAskDoubtOpen,
	setIsAskDoubtOpen,
	kidAge,
	kidName,
	isExitModalOpen,
	setIsExitModalOpen,
	handleConfirmExit,
	currentIndex,
	totalQuestions,
	selectedSkill,
	isSkippedReviewPromptOpen,
	handleStartSkippedReview,
	handleSkipReviewAndFinish,
	history,
	isCrewModalOpen,
	setIsCrewModalOpen,
	isPlanetariumOpen,
	setIsPlanetariumOpen,
	isObservatoryOpen,
	setIsObservatoryOpen,
	isHabitatOpen,
	setIsHabitatOpen,
}) {
	return (
		<Suspense fallback={null}>
			{isHintOpen && currentQuestion && (
				<HintModal
					hintText={currentQuestion.hint}
					isOpen={isHintOpen}
					onClose={() => setIsHintOpen(false)}
					soundEnabled={soundEnabled}
					onActivateCosmicRay={handleActivateCosmicRay}
					cosmicRayUsed={cosmicRayUsed}
					canUseCosmicRay={!isSubmitted && !isTimedOut}
					onActivateTelemetryScan={handleActivateTelemetryScan}
					telemetryScan={telemetryScan}
					telemetryScanUsed={telemetryScanUsed}
					canUseTelemetryScan={!isSubmitted && !isTimedOut}
					onActivateChronoFreeze={handleActivateChronoFreeze}
					chronoFreezeUsed={chronoFreezeUsed}
					canUseChronoFreeze={!isSubmitted && !isTimedOut}
					currentQuestion={currentQuestion}
					eliminatedOptionIds={eliminatedOptionIds}
					timerEnabled={timerConfig?.enabled}
				/>
			)}

			{isZoomOpen && currentQuestion && (
				<ZoomModal
					diagramType={currentQuestion.diagramType}
					diagramData={{
						...currentQuestion.diagramData,
						questionText:
							currentQuestion.question || currentQuestion.questionText,
						correctAnswerText:
							currentQuestion.correctAnswerText ||
							currentQuestion.correctAnswer,
					}}
					isOpen={isZoomOpen}
					onClose={() => setIsZoomOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}

			{isAskDoubtOpen && currentQuestion && (
				<AskDoubtModal
					question={currentQuestion}
					isOpen={isAskDoubtOpen}
					onClose={() => setIsAskDoubtOpen(false)}
					soundEnabled={soundEnabled}
					kidAge={kidAge}
					kidName={kidName}
				/>
			)}

			{isExitModalOpen && (
				<ExitConfirmationModal
					isOpen={isExitModalOpen}
					onClose={() => setIsExitModalOpen(false)}
					onConfirmExit={handleConfirmExit}
					currentIndex={currentIndex}
					totalQuestions={totalQuestions}
					selectedSkill={selectedSkill}
					soundEnabled={soundEnabled}
				/>
			)}

			{isSkippedReviewPromptOpen && (
				<SkippedReviewModal
					isOpen={isSkippedReviewPromptOpen}
					onRevisit={handleStartSkippedReview}
					onViewResults={handleSkipReviewAndFinish}
					skippedIndices={history
						.map((h, idx) => (h && h.skipped ? idx : null))
						.filter((idx) => idx !== null)}
					soundEnabled={soundEnabled}
				/>
			)}

			{isCrewModalOpen && (
				<CrewSwitcherModal
					isOpen={isCrewModalOpen}
					onClose={() => setIsCrewModalOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}

			{isPlanetariumOpen && (
				<PocketPlanetariumModal
					isOpen={isPlanetariumOpen}
					onClose={() => setIsPlanetariumOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}

			{isObservatoryOpen && (
				<ConstellationObservatory
					isOpen={isObservatoryOpen}
					onClose={() => setIsObservatoryOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}

			{isHabitatOpen && (
				<CosmicHabitatModal
					isOpen={isHabitatOpen}
					onClose={() => setIsHabitatOpen(false)}
					soundEnabled={soundEnabled}
					kidName={kidName}
				/>
			)}
		</Suspense>
	);
});

export default QuestModalsHub;
