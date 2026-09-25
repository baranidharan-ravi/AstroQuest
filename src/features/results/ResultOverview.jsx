import confetti from 'canvas-confetti';
import { Award, Clock, Download, LayoutGrid, RefreshCw } from 'lucide-react';
import { memo, useEffect, useMemo } from 'react';
import {
	playButtonPop,
	playStarSound,
	playVictoryFanfare,
} from '../../utils/audioSynthesis';
import { KidAvatar } from '../../utils/avatarManager';
import {
	BADGE_DEFINITIONS,
	calculateRank,
	getStoredAchievements,
} from '../../utils/badgeManager';
import {
	calculateQuestCognitiveScores,
	recordQuestCognitiveScores,
} from '../../utils/cognitiveAnalytics';
import { exportGalacticCertificateToPdf } from '../../utils/pdfGenerator';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidName,
} from '../../utils/progressTracker';
import CognitiveRadarChart from './CognitiveRadarChart';

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
	kidAge,
	kidAvatar,
	timerSeconds = 0,
	history = [],
	pureQuestBonus = 0,
}) {
	// Determine star count based on score
	const starCount =
		scorePercent >= 80 ? 3
		: scorePercent >= 50 ? 2
		: 1;

	const achievements = getStoredAchievements();
	const rankInfo = calculateRank(achievements?.xp || 0);
	const unlockedBadges = BADGE_DEFINITIONS.filter((b) =>
		achievements?.badges?.includes(b.id),
	);

	// Evaluate cognitive domain aptitude across the 5 core domains
	const cognitiveScores = useMemo(() => {
		const scores = calculateQuestCognitiveScores([], history);
		recordQuestCognitiveScores(scores);
		return scores;
	}, [history]);

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

	// Format MM:SS
	const formatTime = (secs) => {
		const safeSecs = Math.max(0, Math.floor(secs));
		const m = Math.floor(safeSecs / 60)
			.toString()
			.padStart(2, '0');
		const s = (safeSecs % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	const resolvedKidName =
		(kidName && String(kidName).trim()) || getStoredKidName() || 'Explorer';
	const resolvedKidAge = kidAge || getStoredKidAge() || 5;
	const resolvedKidAvatar =
		kidAvatar || getStoredKidAvatar() || 'boy-astronaut-1';

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

			{/* Main Content Area */}
			<div
				id='panel-overview'
				role='tabpanel'
				aria-labelledby='tab-overview'
				tabIndex={0}
				className='w-full flex flex-col items-center focus:outline-none'>
				{/* Top Celebration Banner: Cadet Info, Time Taken, Stars, Completed Ribbon, Score & Encouragement */}
				<div className='w-full bg-gradient-to-r from-[#181C54]/95 via-[#10133D]/95 to-[#181C54]/95 border-2 border-[#2C3480] rounded-3xl p-4 sm:p-6 shadow-2xl mb-6 backdrop-blur-md flex flex-col gap-4 sm:gap-5'>
					{/* Header Sub-Row: Cadet Profile & Mission Duration Timer */}
					<div className='flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10'>
						{/* Explorer Cadet Profile */}
						<div className='flex items-center gap-2.5 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-400/40 rounded-2xl px-3.5 py-1.5 sm:py-2 shadow-md'>
							<KidAvatar
								avatarId={resolvedKidAvatar}
								size='xs'
								className='ring-2 ring-purple-300/60 shadow-sm'
								alt={`${resolvedKidName} avatar`}
							/>
							<div className='flex flex-col items-start leading-none'>
								<span className='text-[9px] sm:text-[10px] font-bold text-purple-300 uppercase tracking-wider'>
									Explorer Cadet
								</span>
								<span className='text-xs sm:text-sm font-black text-white mt-0.5'>
									{resolvedKidName}{' '}
									<span className='text-[11px] text-purple-200 font-semibold'>
										({resolvedKidAge}y)
									</span>
								</span>
							</div>
						</div>

						{/* Mission Duration Timer Badge */}
						<div className='flex items-center gap-2 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-400/40 rounded-2xl px-3.5 py-1.5 sm:py-2 shadow-md'>
							<Clock className='w-4 h-4 text-cyan-400 flex-shrink-0' />
							<div className='flex flex-col items-start leading-none'>
								<span className='text-[9px] sm:text-[10px] font-bold text-cyan-300 uppercase tracking-wider'>
									Total Mission Time
								</span>
								<span className='text-xs sm:text-sm font-black text-cyan-200 font-mono mt-0.5'>
									{formatTime(timerSeconds)}
								</span>
							</div>
						</div>
					</div>

					{/* Celebration Sub-Row: Stars, COMPLETED Ribbon, Score & Encouraging Message */}
					<div className='flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left'>
						{/* Left: Stars & COMPLETED Ribbon */}
						<div className='flex items-center gap-3 sm:gap-4 flex-wrap justify-center md:justify-start'>
							{/* Animated 3D Stars */}
							<div className='flex items-center gap-2 sm:gap-3'>
								{Array.from({ length: 3 }).map((_, idx) => {
									const isFilled = idx < starCount;
									return (
										<div
											key={idx}
											className={`text-4xl sm:text-5xl transition-all duration-700 transform ${
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
							<div className='ribbon-banner px-5 sm:px-6 py-2 rounded-xl shadow-xl transform hover:scale-105 transition-transform'>
								<h1 className='text-xl sm:text-2xl font-black tracking-widest text-white uppercase drop-shadow-md'>
									COMPLETED
								</h1>
							</div>
						</div>

						{/* Center: Score Percentage */}
						<div className='flex flex-col items-center'>
							<span className='text-gray-300 font-bold text-xs sm:text-sm tracking-wider uppercase'>
								Your Score
							</span>
							<span className='text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent'>
								{scorePercent}%
							</span>
						</div>

						{/* Right: Encouraging Kid-Friendly Message */}
						<div className='flex items-center justify-center md:justify-end'>
							<p className='text-xs sm:text-sm font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 px-4 py-2 rounded-full shadow-inner'>
								{scorePercent >= 80 ?
									'🌟 Outstanding Job, Super Astronaut!'
								: scorePercent >= 50 ?
									'🚀 Great Effort! Keep exploring and learning!'
								:	'🌱 Good try! Practice makes you stronger!'}
							</p>
						</div>
					</div>
				</div>

				{/* Side-by-Side Grid: Performance Breakdown (Left) & Cognitive Aptitude Radar (Right) */}
				<div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6'>
					{/* Left Card: Performance Breakdown */}
					<div className='bg-[#121644] border-2 border-[#2C3480] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between h-full gap-4'>
						<div>
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

							{/* Stat Cards Grid: Correct, Incorrect, Skipped, Time Taken */}
							<div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4'>
								{/* Correct Pill Card */}
								<div className='bg-emerald-950/60 border-2 border-emerald-500/60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-md'>
									<span className='text-lg sm:text-xl mb-0.5'>✅</span>
									<span className='text-base sm:text-xl font-black text-emerald-400'>
										{correctCount}
									</span>
									<span className='text-[10px] font-bold text-emerald-200 uppercase tracking-wider'>
										Correct
									</span>
								</div>

								{/* Incorrect Pill Card */}
								<div className='bg-rose-950/60 border-2 border-rose-500/60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-md'>
									<span className='text-lg sm:text-xl mb-0.5'>❌</span>
									<span className='text-base sm:text-xl font-black text-rose-400'>
										{Math.max(
											0,
											totalCount -
												correctCount -
												(history?.filter((h) => h?.skipped).length || 0),
										)}
									</span>
									<span className='text-[10px] font-bold text-rose-200 uppercase tracking-wider'>
										Wrong
									</span>
								</div>

								{/* Skipped Pill Card */}
								<div className='bg-amber-950/60 border-2 border-amber-500/60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-md'>
									<span className='text-lg sm:text-xl mb-0.5'>⏭️</span>
									<span className='text-base sm:text-xl font-black text-amber-400'>
										{history?.filter((h) => h?.skipped).length || 0}
									</span>
									<span className='text-[10px] font-bold text-amber-200 uppercase tracking-wider'>
										Skipped
									</span>
								</div>

								{/* Duration Pill Card */}
								<div className='bg-cyan-950/60 border-2 border-cyan-500/60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-md'>
									<Clock className='w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mb-0.5' />
									<span className='text-base sm:text-xl font-black text-cyan-300 font-mono'>
										{formatTime(timerSeconds)}
									</span>
									<span className='text-[10px] font-bold text-cyan-200 uppercase tracking-wider'>
										Duration
									</span>
								</div>
							</div>
						</div>

						
						{/* 🌟 Pure Quest Navigator Bonus */}
						{pureQuestBonus > 0 && (
							<div className='bg-gradient-to-r from-yellow-950/80 via-amber-900/60 to-yellow-950/80 border-2 border-yellow-400/60 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-[0_0_20px_rgba(250,204,21,0.25)] animate-in fade-in zoom-in-95 duration-500'>
								<div className='w-14 h-14 flex-shrink-0 rounded-2xl bg-yellow-400/20 border-2 border-yellow-400/50 flex items-center justify-center text-3xl shadow-lg'>🌟</div>
								<div className='flex-1 text-left'>
									<div className='text-xs font-black uppercase tracking-wider text-yellow-400 mb-0.5'>Pure Quest Achievement Unlocked</div>
									<div className='text-base sm:text-lg font-black text-white'>Pure Quest Navigator</div>
									<div className='text-xs sm:text-sm text-yellow-200/80 font-semibold leading-snug mt-0.5'>No lifelines used — pure cosmic mastery!</div>
								</div>
								<div className='flex-shrink-0 text-right'>
									<div className='text-2xl sm:text-3xl font-black text-yellow-300'>+{pureQuestBonus}</div>
									<div className='text-[10px] font-black text-yellow-400 uppercase tracking-widest'>Bonus XP</div>
								</div>
							</div>
						)}
{/* Astronaut Rank & Mission Badges Showcase */}
						<div className='bg-gradient-to-b from-[#181C54] to-[#0F133D] border-2 border-cyan-400/40 rounded-2xl p-4 text-left shadow-lg'>
							<div className='flex items-center justify-between gap-2 mb-2.5'>
								<div className='flex items-center gap-2.5'>
									<span
										className='text-3xl'
										aria-hidden='true'>
										{rankInfo.icon}
									</span>
									<div>
										<div className='flex items-center gap-2'>
											<span className='text-sm sm:text-base font-black text-white tracking-wide uppercase'>
												{rankInfo.title}
											</span>
											<span className='text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
												Level {rankInfo.level}
											</span>
										</div>
										<span className='text-[11px] font-semibold text-slate-300'>
											Total Experience:{' '}
											<span className='text-amber-300 font-bold'>
												{achievements.xp} XP
											</span>
										</span>
									</div>
								</div>

								{/* XP Progress Bar */}
								<div className='flex flex-col items-end'>
									<span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
										{rankInfo.progressPercent}% to {rankInfo.nextRankTitle}
									</span>
									<div className='w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-1'>
										<div
											className='h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500'
											style={{ width: `${rankInfo.progressPercent}%` }}
										/>
									</div>
								</div>
							</div>

							{/* Unlocked Badges Row */}
							<div className='pt-2.5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none'>
								<span className='text-[10px] font-black uppercase tracking-wider text-slate-400 flex-shrink-0'>
									Badges ({unlockedBadges.length}/{BADGE_DEFINITIONS.length}):
								</span>
								{BADGE_DEFINITIONS.map((badge) => {
									const isUnlocked = achievements?.badges?.includes(badge.id);
									return (
										<div
											key={badge.id}
											className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all flex-shrink-0 ${
												isUnlocked ?
													`${badge.color} shadow-sm scale-105`
												:	'border-slate-800 bg-slate-900/50 text-slate-600 opacity-40 grayscale'
											}`}
											title={`${badge.title}: ${badge.description}${isUnlocked ? ' (Unlocked!)' : ' (Locked)'}`}>
											<span>{badge.icon}</span>
											<span className='text-[10px] font-black'>
												{badge.title}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Right Card: Cognitive Aptitude Radar */}
					<div className='h-full'>
						<CognitiveRadarChart
							scores={cognitiveScores}
							title='Cognitive Aptitude Radar'
							subtitle='5-Domain STEM & Logic Analysis'
							className='h-full'
						/>
					</div>
				</div>

				{/* Action Options Below Both Cards */}
				<div className='w-full max-w-4xl flex flex-col gap-3 mt-2'>
					{/* Primary Action: Start Next AstroQuest */}
					<button
						type='button'
						aria-label='Start next AstroQuest with 10 new questions'
						onClick={() => {
							playButtonPop(soundEnabled);
							onStartNextSheet();
						}}
						className='w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-extrabold text-base sm:text-lg shadow-[0_10px_25px_rgba(255,91,132,0.4)] hover:shadow-[0_12px_30px_rgba(255,91,132,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-pink-400'>
						<RefreshCw className='w-5 h-5 animate-spin-slow' />
						<span>Start Next AstroQuest (10 New Questions)</span>
					</button>

					{/* Secondary Actions Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 w-full'>
						{/* Print Galactic Explorer Diploma Button */}
						<button
							type='button'
							aria-label='Print Galactic Explorer Diploma'
							onClick={() => {
								playButtonPop(soundEnabled);
								exportGalacticCertificateToPdf({
									studentName: kidName || 'Explorer',
									studentAge: getStoredKidAge() || 6,
									rankTitle: rankInfo.title,
									rankLevel: rankInfo.level,
									scorePercent,
									skillName: 'AstroQuest STEM Odyssey',
								});
							}}
							className='w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_6px_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-amber-400'>
							<Award className='w-4 h-4 sm:w-5 sm:h-5 text-slate-950' />
							<span>Print Galactic Diploma 🎓</span>
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
								className='w-full py-3.5 rounded-2xl bg-[#0F143D] hover:bg-[#1A205E] border-2 border-cyan-400 text-cyan-300 hover:text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cyan-400'>
								<Download className='w-4 h-4 sm:w-5 sm:h-5' />
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
								className='w-full py-3.5 rounded-2xl bg-[#1C2263] hover:bg-[#252D80] border border-[#3A45A8] text-slate-300 hover:text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-400'>
								<LayoutGrid className='w-4 h-4 sm:w-5 sm:h-5' />
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
