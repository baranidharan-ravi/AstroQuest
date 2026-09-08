import confetti from 'canvas-confetti';
import { Download, LayoutGrid, RefreshCw } from 'lucide-react';
import { memo, useEffect } from 'react';
import {
	playButtonPop,
	playStarSound,
	playVictoryFanfare,
} from '../../utils/audioSynthesis';

const ResultOverview = memo(function ResultOverview({
	scorePercent,
	correctCount,
	totalCount,
	onStartNextSheet,
	onViewSummary,
	onDownloadPdf,
	activeTab,
	setActiveTab,
	soundEnabled,
	onBackToDashboard,
	kidName = '',
	history = [],
}) {
	// Determine star count based on score
	const starCount =
		scorePercent >= 80 ? 3
		: scorePercent >= 50 ? 2
		: 1;

	useEffect(() => {
		// Trigger joyful celebration confetti
		try {
			confetti({
				particleCount: 120,
				spread: 70,
				origin: { y: 0.6 },
			});
		} catch {
			// Confetti fallback
		}

		// Play victory fanfare sound
		playVictoryFanfare(soundEnabled);

		// Staggered star sounds
		for (let i = 0; i < starCount; i++) {
			setTimeout(
				() => {
					playStarSound(i, soundEnabled);
				},
				(i + 1) * 350,
			);
		}
	}, []);

	return (
		<div className='w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500'>
			{/* Top Tabs: RESULT OVERVIEW vs QUESTION SUMMARY */}
			<div
				role='tablist'
				aria-label='Quest results views'
				className='flex items-center gap-3 mb-8'>
				<button
					type='button'
					role='tab'
					id='tab-overview'
					aria-selected={activeTab === 'overview'}
					aria-controls='panel-overview'
					tabIndex={activeTab === 'overview' ? 0 : -1}
					onClick={() => {
						playButtonPop(soundEnabled);
						setActiveTab('overview');
					}}
					className={`px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg focus-visible:ring-4 focus-visible:ring-pink-400 cursor-pointer ${
						activeTab === 'overview' ?
							'bg-[#FF5B84] text-white ring-4 ring-pink-500/30'
						:	'bg-[#15184C] text-gray-300 hover:text-white border border-[#2B3280]'
					}`}>
					Result Overview
				</button>

				<button
					type='button'
					role='tab'
					id='tab-summary'
					aria-selected={activeTab === 'summary'}
					aria-controls='panel-summary'
					tabIndex={activeTab === 'summary' ? 0 : -1}
					onClick={() => {
						playButtonPop(soundEnabled);
						setActiveTab('summary');
					}}
					className={`px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg focus-visible:ring-4 focus-visible:ring-pink-400 cursor-pointer ${
						activeTab === 'summary' ?
							'bg-[#FF5B84] text-white ring-4 ring-pink-500/30'
						:	'bg-[#15184C] text-gray-300 hover:text-white border border-[#2B3280]'
					}`}>
					Question Summary
				</button>
			</div>

			{/* Main Content Grid: Left Score/Stars, Right Leaderboard */}
			<div
				id='panel-overview'
				role='tabpanel'
				aria-labelledby='tab-overview'
				tabIndex={0}
				className='w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center focus:outline-none'>
				{/* Left Side: Glowing Stars & Ribbon */}
				<div className='lg:col-span-6 flex flex-col items-center justify-center text-center p-6 sm:p-10 relative'>
					{/* Animated 3D Stars */}
					<div className='flex items-center justify-center gap-4 mb-6'>
						{Array.from({ length: 3 }).map((_, idx) => {
							const isFilled = idx < starCount;
							return (
								<div
									key={idx}
									className={`text-5xl sm:text-7xl transition-all duration-700 transform ${
										isFilled ?
											'scale-110 drop-shadow-[0_0_20px_#FBBF24] animate-bounce-short'
										:	'opacity-30 scale-90 grayscale'
									}`}
									style={{ animationDelay: `${idx * 200}ms` }}>
									⭐
								</div>
							);
						})}
					</div>

					{/* COMPLETED Ribbon Banner */}
					<div className='ribbon-banner px-8 py-3.5 rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform'>
						<h1 className='text-2xl sm:text-4xl font-black tracking-widest text-white uppercase drop-shadow-md'>
							COMPLETED
						</h1>
					</div>

					{/* Score Percentage */}
					<div className='flex flex-col items-center'>
						<span className='text-gray-300 font-bold text-lg sm:text-xl tracking-wide mb-1'>
							Your Score
						</span>
						<span className='text-5xl sm:text-7xl font-black text-white tracking-tight drop-shadow-lg bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent'>
							{scorePercent}%
						</span>
					</div>

					{/* Encouraging Kid-Friendly Message */}
					<p className='mt-4 text-sm sm:text-base font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-4 py-2 rounded-full'>
						{scorePercent >= 80 ?
							'🌟 Outstanding Job, Super Astronaut!'
						: scorePercent >= 50 ?
							'🚀 Great Effort! Keep exploring and learning!'
						:	'🌱 Good try! Practice makes you stronger!'}
					</p>
				</div>

				{/* Right Side: Performance Breakdown & Action Buttons */}
				<div className='lg:col-span-6 flex flex-col gap-4'>
					{/* Performance Summary Card */}
					<div className='bg-[#121644] border-2 border-[#2C3480] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4'>
						<div className='flex items-center gap-3 pb-3 border-b border-[#252C7A]'>
							<span className='text-2xl sm:text-3xl'>📊</span>
							<div>
								<h3 className='font-extrabold text-white text-base sm:text-lg leading-tight'>
									Performance Breakdown
								</h3>
								<p className='text-xs font-semibold text-slate-300'>
									Summary of your completed session
								</p>
							</div>
						</div>

						{/* Stat Cards Grid: Correct, Incorrect, Skipped */}
						<div className='grid grid-cols-3 gap-2.5 sm:gap-3'>
							{/* Correct Pill Card */}
							<div className='bg-emerald-950/60 border-2 border-emerald-500/60 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-md'>
								<span className='text-xl sm:text-2xl mb-1'>✅</span>
								<span className='text-lg sm:text-2xl font-black text-emerald-400'>
									{correctCount}
								</span>
								<span className='text-[10px] sm:text-xs font-bold text-emerald-200 mt-0.5 uppercase tracking-wider'>
									Correct
								</span>
							</div>

							{/* Incorrect Pill Card */}
							<div className='bg-rose-950/60 border-2 border-rose-500/60 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-md'>
								<span className='text-xl sm:text-2xl mb-1'>❌</span>
								<span className='text-lg sm:text-2xl font-black text-rose-400'>
									{Math.max(
										0,
										totalCount -
											correctCount -
											(history?.filter((h) => h?.skipped).length || 0),
									)}
								</span>
								<span className='text-[10px] sm:text-xs font-bold text-rose-200 mt-0.5 uppercase tracking-wider'>
									Wrong
								</span>
							</div>

							{/* Skipped Pill Card */}
							<div className='bg-amber-950/60 border-2 border-amber-500/60 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-md'>
								<span className='text-xl sm:text-2xl mb-1'>⏭️</span>
								<span className='text-lg sm:text-2xl font-black text-amber-400'>
									{history?.filter((h) => h?.skipped).length || 0}
								</span>
								<span className='text-[10px] sm:text-xs font-bold text-amber-200 mt-0.5 uppercase tracking-wider'>
									Skipped
								</span>
							</div>
						</div>

						{/* Next Sheet / Action Button */}
						<button
							type='button'
							aria-label='Start next AstroQuest with 10 new questions'
							onClick={() => {
								playButtonPop(soundEnabled);
								onStartNextSheet();
							}}
							className='mt-3 w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-extrabold text-base sm:text-lg shadow-[0_10px_25px_rgba(255,91,132,0.4)] hover:shadow-[0_12px_30px_rgba(255,91,132,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-pink-400'>
							<RefreshCw className='w-5 h-5 animate-spin-slow' />
							<span>Start Next AstroQuest (10 New Questions)</span>
						</button>

						{/* Download PDF Report Button */}
						{onDownloadPdf && (
							<button
								type='button'
								aria-label='Download session PDF report'
								onClick={() => {
									playButtonPop(soundEnabled);
									onDownloadPdf();
								}}
								className='w-full py-3.5 rounded-2xl bg-[#0F143D] hover:bg-[#1A205E] border-2 border-cyan-400 text-cyan-300 hover:text-white font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cyan-400'>
								<Download className='w-5 h-5' />
								<span>Download PDF Report 📄</span>
							</button>
						)}

						{/* Back to Skills Hub Button */}
						{onBackToDashboard && (
							<button
								type='button'
								aria-label='Back to Skills Hub'
								onClick={() => {
									playButtonPop(soundEnabled);
									onBackToDashboard();
								}}
								className='w-full py-3 rounded-2xl bg-[#1C2263] hover:bg-[#252D80] border border-[#3A45A8] text-slate-300 hover:text-white font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-400'>
								<LayoutGrid className='w-4 h-4' />
								<span>Back to Skills Hub</span>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

export default ResultOverview;
