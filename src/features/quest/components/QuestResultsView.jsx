import { lazy, memo, Suspense } from 'react';
import { PURE_QUEST_XP_BONUS } from '../../../constants';

const ResultOverview = lazy(() => import('../../results/ResultOverview'));
const QuestionSummary = lazy(() => import('../../results/QuestionSummary'));

function ResultsLoadingFallback() {
	return (
		<div className='min-h-[400px] flex flex-col items-center justify-center p-8 text-white select-none'>
			<div className='w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4 shadow-[0_0_20px_rgba(251,191,36,0.5)]' />
			<p className='text-sm font-bold text-amber-200 tracking-wider uppercase animate-pulse'>
				Compiling Mission Telemetry...
			</p>
		</div>
	);
}

/**
 * QuestResultsView Component
 *
 * Implements SOLID Single Responsibility:
 * Displays mission completion overview or detailed question summary,
 * computes Pure Quest Navigator bonus, and exposes PDF export.
 */
export const QuestResultsView = memo(function QuestResultsView({
	resultTab,
	setResultTab,
	scorePercent,
	correctCount,
	totalCount,
	questions,
	history,
	handleStartNextSheet,
	handleDownloadSheet,
	soundEnabled,
	setCurrentScreen,
	kidName,
	kidAge,
	kidAvatar,
	timerSeconds,
	cosmicClueUsed,
	cosmicRayUsed,
	telemetryScanUsed,
	chronoFreezeUsed,
	showVisualDiagrams,
}) {
	const pureQuestBonus =
		!cosmicClueUsed &&
		!cosmicRayUsed &&
		!telemetryScanUsed &&
		!chronoFreezeUsed ?
			PURE_QUEST_XP_BONUS
		:	0;

	return (
		<div className='w-full max-w-5xl mx-auto pb-16'>
			<Suspense fallback={<ResultsLoadingFallback />}>
				{resultTab === 'overview' ?
					<ResultOverview
						scorePercent={scorePercent}
						correctCount={correctCount}
						totalCount={totalCount}
						history={history}
						onStartNextSheet={handleStartNextSheet}
						onViewSummary={() => setResultTab('summary')}
						onDownloadPdf={handleDownloadSheet}
						activeTab={resultTab}
						setActiveTab={setResultTab}
						soundEnabled={soundEnabled}
						onBackToDashboard={() => setCurrentScreen('dashboard')}
						kidName={kidName}
						kidAge={kidAge}
						kidAvatar={kidAvatar}
						timerSeconds={timerSeconds}
						pureQuestBonus={pureQuestBonus}
					/>
				:	<QuestionSummary
						questions={questions}
						history={history}
						onStartNextSheet={handleStartNextSheet}
						onDownloadPdf={handleDownloadSheet}
						activeTab={resultTab}
						setActiveTab={setResultTab}
						soundEnabled={soundEnabled}
						onBackToDashboard={() => setCurrentScreen('dashboard')}
						showVisualDiagrams={showVisualDiagrams}
					/>
				}
			</Suspense>
		</div>
	);
});

export default QuestResultsView;
