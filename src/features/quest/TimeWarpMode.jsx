import { Clock, Flame, RotateCcw, Trophy, X, Zap } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { HIGH_SCORE_KEY, RAPID_FALLBACK_QUESTIONS } from '../../constants';
import { getFreshThinksheetSession } from '../../services/questionService';
import {
	playButtonPop,
	playCorrectSound,
	playIncorrectSound,
} from '../../utils/audioSynthesis';
import { awardBadge, awardXP } from '../../utils/badgeManager';
import { getStoredKidAge, getStoredKidName } from '../../utils/progressTracker';

function getStoredHighScore() {
	try {
		return parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10) || 0;
	} catch {
		return 0;
	}
}

function saveStoredHighScore(score) {
	try {
		localStorage.setItem(HIGH_SCORE_KEY, String(score));
	} catch {}
}

const TimeWarpMode = memo(function TimeWarpMode({
	onExit,
	soundEnabled = true,
}) {
	const kidName = getStoredKidName() || 'Cadet';
	const kidAge = getStoredKidAge() || 6;

	// Game States
	const [timeLeft, setTimeLeft] = useState(60);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(getStoredHighScore);
	const [streak, setStreak] = useState(0);
	const [maxStreak, setMaxStreak] = useState(0);
	const [questionsAnswered, setQuestionsAnswered] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);
	const [isStarted, setIsStarted] = useState(true);
	const [floatingDelta, setFloatingDelta] = useState(null); // '+5s' or '-3s'

	// Question Stream
	const [questionList, setQuestionList] = useState(() =>
		[...RAPID_FALLBACK_QUESTIONS].sort(() => Math.random() - 0.5),
	);
	const [qIndex, setQIndex] = useState(0);

	const timerRef = useRef(null);
	const currentQ = questionList[qIndex % questionList.length];

	// Try pre-fetching fresh AI questions in the background for continuous variety
	useEffect(() => {
		getFreshThinksheetSession('Analytical Thinking', 1, kidAge)
			.then((aiQuestions) => {
				if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
					setQuestionList((prev) => [
						...prev,
						...aiQuestions.map((q) => ({
							id: q.id,
							question: q.question || q.questionText,
							options: q.options,
							correctAnswerId: q.correctAnswerId,
						})),
					]);
				}
			})
			.catch(() => {});
	}, [kidAge]);

	// Main countdown loop
	useEffect(() => {
		if (!isStarted || isGameOver) return;

		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timerRef.current);
					handleTimeUp();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timerRef.current);
	}, [isStarted, isGameOver]);

	// End of run triggers
	const handleTimeUp = useCallback(async () => {
		setIsGameOver(true);
		playIncorrectSound(soundEnabled);

		// Check and save High Score
		setHighScore((prevHigh) => {
			if (score > prevHigh) {
				saveStoredHighScore(score);
				// Trigger confetti
				import('canvas-confetti')
					.then((m) => {
						const confetti = m.default || m;
						confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
					})
					.catch(() => {});
				return score;
			}
			return prevHigh;
		});

		// Award achievements & XP
		if (score >= 50) {
			awardBadge('time_warp_champion');
		}
		if (score > 0) {
			awardXP(Math.round(score * 1.5));
		}
	}, [score, soundEnabled]);

	const handleAnswer = (optionId) => {
		if (isGameOver) return;

		const isCorrect = optionId === currentQ.correctAnswerId;
		setQuestionsAnswered((prev) => prev + 1);

		if (isCorrect) {
			playCorrectSound(soundEnabled);
			const newStreak = streak + 1;
			setStreak(newStreak);
			setMaxStreak((prev) => Math.max(prev, newStreak));
			setCorrectAnswers((prev) => prev + 1);

			// Multiplier for streaks
			const multiplier =
				newStreak >= 5 ? 2
				: newStreak >= 3 ? 1.5
				: 1;
			const pointsEarned = Math.round(10 * multiplier);
			setScore((prev) => prev + pointsEarned);

			// Add +5 seconds bonus
			setTimeLeft((prev) => Math.min(99, prev + 5));
			setFloatingDelta('+5s ⚡');
		} else {
			playIncorrectSound(soundEnabled);
			setStreak(0);
			// Apply -3s penalty
			setTimeLeft((prev) => Math.max(0, prev - 3));
			setFloatingDelta('-3s ⏳');
		}

		setTimeout(() => setFloatingDelta(null), 800);
		setQIndex((prev) => prev + 1);
	};

	const handleRestart = () => {
		playButtonPop(soundEnabled);
		setTimeLeft(60);
		setScore(0);
		setStreak(0);
		setMaxStreak(0);
		setQuestionsAnswered(0);
		setCorrectAnswers(0);
		setIsGameOver(false);
		setQIndex((prev) => prev + 1);
	};

	// Timer color styling based on urgency
	const timerColor =
		timeLeft > 30 ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40'
		: timeLeft > 15 ? 'text-amber-400 border-amber-500/50 bg-amber-950/40'
		: 'text-rose-400 border-rose-500/50 bg-rose-950/40 animate-pulse';

	return (
		<div className='min-h-screen bg-radial from-[#1E1B4B] via-[#0D102D] to-[#050714] text-white flex flex-col justify-between p-3 sm:p-6 select-none relative overflow-hidden'>
			{/* Cosmic Lightning Background Glow */}
			<div className='absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none' />
			<div className='absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none' />

			{/* Top HUD: Exit, Title, Timer, Streak, Score */}
			<header className='w-full max-w-4xl mx-auto flex items-center justify-between gap-2 border-b border-white/10 pb-3 flex-shrink-0 relative z-10'>
				<button
					type='button'
					onClick={onExit}
					className='px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer'
					title='Exit Time Warp'>
					<X className='w-4 h-4' />
					<span className='hidden sm:inline'>Abort Warp</span>
				</button>

				{/* Warp Title & Mode Pill */}
				<div className='flex items-center gap-2'>
					<div className='w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black shadow-inner'>
						⚡
					</div>
					<div>
						<h1 className='text-sm sm:text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300'>
							TIME WARP LIGHTNING
						</h1>
						<p className='text-[10px] text-slate-400 font-semibold hidden xs:block'>
							+5s Correct • -3s Penalty • Continuous Survival
						</p>
					</div>
				</div>

				{/* Master Countdown HUD */}
				<div
					className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border font-black text-sm sm:text-base shadow-lg transition-all relative ${timerColor}`}>
					<Clock className='w-4 h-4' />
					<span>{timeLeft}s</span>
					{floatingDelta && (
						<span
							className={`absolute -bottom-6 right-2 text-xs font-black px-1.5 py-0.5 rounded-md shadow-md animate-bounce ${
								floatingDelta.startsWith('+') ?
									'bg-emerald-500 text-slate-950'
								:	'bg-rose-500 text-white'
							}`}>
							{floatingDelta}
						</span>
					)}
				</div>
			</header>

			{/* Stats Bar: Score, Streak Multiplier, High Score */}
			<div className='w-full max-w-4xl mx-auto flex items-center justify-between gap-3 py-2 text-xs flex-shrink-0 relative z-10'>
				<div className='flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl'>
					<Trophy className='w-3.5 h-3.5 text-amber-300' />
					<span className='text-slate-300'>High:</span>
					<span className='font-black text-amber-300'>{highScore}</span>
				</div>

				{streak >= 3 && (
					<div className='flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-bounce'>
						<Flame className='w-3.5 h-3.5' />
						<span>{streak >= 5 ? 'WARP SPEED 2X!' : 'STREAK 1.5X!'}</span>
					</div>
				)}

				<div className='flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-400/40 px-3 py-1.5 rounded-xl'>
					<Zap className='w-3.5 h-3.5 text-cyan-300' />
					<span className='text-slate-300'>Score:</span>
					<span className='font-black text-cyan-300 text-sm'>{score}</span>
				</div>
			</div>

			{/* Question Play Area */}
			<main className='w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center my-auto py-4 relative z-10'>
				<div className='bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-indigo-400/80 flex flex-col justify-between relative overflow-hidden'>
					{/* Progress Pill */}
					<div className='flex items-center justify-between text-xs font-black text-slate-400 mb-3 border-b border-slate-100 pb-2'>
						<span>ROUND #{questionsAnswered + 1}</span>
						<span className='text-indigo-600 font-extrabold'>
							Current Streak: {streak} 🔥
						</span>
					</div>

					{/* Question Prompt */}
					<h2 className='text-lg sm:text-2xl font-black text-slate-800 leading-snug my-2'>
						{currentQ?.question}
					</h2>

					{/* 4 Rapid Answer Options Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4'>
						{currentQ?.options?.map((opt) => (
							<button
								key={opt.id}
								type='button'
								onClick={() => handleAnswer(opt.id)}
								className='p-3 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-950 font-black text-sm sm:text-base text-left transition-all hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer'>
								{opt.text}
							</button>
						))}
					</div>
				</div>
			</main>

			{/* Game Over Result Modal */}
			{isGameOver && (
				<div
					role='dialog'
					aria-modal='true'
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in'>
					<div className='w-full max-w-md bg-gradient-to-b from-[#1E1B4B] to-[#0A0C27] border-2 border-amber-400/60 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center text-white flex flex-col items-center gap-4'>
						<div className='w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner'>
							⚡
						</div>

						<div>
							<h3 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200'>
								TIME WARP COMPLETED!
							</h3>
							<p className='text-xs text-slate-300 font-semibold mt-1'>
								Outstanding cosmic reflexes, Explorer {kidName}!
							</p>
						</div>

						{/* Score & Stats Matrix */}
						<div className='w-full grid grid-cols-3 gap-2 bg-black/40 border border-white/10 rounded-2xl p-3 text-xs'>
							<div>
								<div className='text-[10px] text-slate-400 font-bold uppercase'>
									Final Score
								</div>
								<div className='text-lg font-black text-amber-300'>{score}</div>
							</div>
							<div>
								<div className='text-[10px] text-slate-400 font-bold uppercase'>
									Solved
								</div>
								<div className='text-lg font-black text-cyan-300'>
									{correctAnswers}/{questionsAnswered}
								</div>
							</div>
							<div>
								<div className='text-[10px] text-slate-400 font-bold uppercase'>
									Best Streak
								</div>
								<div className='text-lg font-black text-rose-400'>
									{maxStreak} 🔥
								</div>
							</div>
						</div>

						{/* Actions: Play Again or Exit */}
						<div className='w-full flex items-center gap-3 mt-2'>
							<button
								type='button'
								onClick={handleRestart}
								className='flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer'>
								<RotateCcw className='w-4 h-4' />
								<span>Play Again</span>
							</button>

							<button
								type='button'
								onClick={onExit}
								className='px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer'>
								Return to Base
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});

export default TimeWarpMode;
