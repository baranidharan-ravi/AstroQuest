import {
	ArrowLeft,
	Clock,
	Key,
	RefreshCw,
	SkipForward,
	Sparkles,
	Zap,
} from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import PetAssistant from './features/companion/PetAssistant';
import SkillSelectionDashboard from './features/dashboard/SkillSelectionDashboard';
import OptionsGrid from './features/quest/OptionsGrid';
import QuestionCard from './features/quest/QuestionCard';
import SolutionPanel from './features/quest/SolutionPanel';
import { getStoredApiKey } from './services/aiGenerator';
import { getFreshThinksheetSession } from './services/questionService';
import {
	playButtonPop,
	playCorrectSound,
	playIncorrectSound,
	speakText,
} from './utils/audioSynthesis';
import Header from './utils/Header';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidGender,
	getStoredKidName,
	getStoredPetAssistanceEnabled,
	getStoredSelectedSkill,
	getStoredShowVisualDiagrams,
	getStoredTimerConfig,
	loadProfileStats,
	recordCompletedSheet,
	saveStoredKidProfile,
	saveStoredSelectedSkill,
} from './utils/progressTracker';
import { clearSessionState, saveSessionState } from './utils/storage';

// Code-split screens, loaders, and modals loaded on demand
const SettingsScreen = lazy(() => import('./features/settings/SettingsScreen'));
const ResultOverview = lazy(() => import('./features/results/ResultOverview'));
const QuestionSummary = lazy(
	() => import('./features/results/QuestionSummary'),
);
const CosmicQuestLoader = lazy(() => import('./utils/CosmicQuestLoader'));
const AskDoubtModal = lazy(() => import('./features/quest/AskDoubtModal'));
const ExitConfirmationModal = lazy(
	() => import('./features/quest/ExitConfirmationModal'),
);
const HintModal = lazy(() => import('./features/quest/HintModal'));
const ZoomModal = lazy(() => import('./utils/ZoomModal'));
const SkippedReviewModal = lazy(
	() => import('./features/quest/SkippedReviewModal'),
);

function ScreenLoadingFallback() {
	return (
		<div className='min-h-screen bg-[#0A0C27] flex flex-col items-center justify-center p-4 text-white select-none'>
			<div className='w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mb-4 shadow-[0_0_20px_rgba(34,211,238,0.5)]' />
			<p className='text-sm font-bold text-cyan-200 tracking-wider uppercase animate-pulse'>
				Loading AstroQuest...
			</p>
		</div>
	);
}

// On-demand celebration confetti loader (zero initial bundle cost)
const triggerConfetti = async () => {
	try {
		const confettiModule = await import('canvas-confetti');
		const confetti = confettiModule.default || confettiModule;
		confetti({
			particleCount: 90,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#00D166', '#FFD166', '#00E5FF', '#FF5B84', '#B845ED'],
			shapes: ['star', 'circle'],
			scalar: 1.2,
		});
	} catch (err) {
		console.warn('Confetti error', err);
	}
};

export default function App() {
	// Kid Profile & Name State
	const [kidName, setKidName] = useState(getStoredKidName);
	const [kidAge, setKidAge] = useState(getStoredKidAge);
	const [kidGender, setKidGender] = useState(getStoredKidGender);
	const [kidAvatar, setKidAvatar] = useState(getStoredKidAvatar);
	const [showVisualDiagrams, setShowVisualDiagrams] = useState(
		getStoredShowVisualDiagrams,
	);
	const [petAssistanceEnabled, setPetAssistanceEnabled] = useState(
		getStoredPetAssistanceEnabled,
	);

	// Navigation State
	const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard' | 'settings' | 'thinksheet'
	const [selectedSkill, setSelectedSkill] = useState(
		() => getStoredSelectedSkill() || 'Visual',
	); // 'Visual' | 'Analytical Thinking'
	const [profileStats, setProfileStats] = useState(loadProfileStats);

	// Timer Settings & Per-Question Limit State
	const [timerConfig, setTimerConfig] = useState(getStoredTimerConfig);
	const [questionTimeRemaining, setQuestionTimeRemaining] = useState(
		() => getStoredTimerConfig().secondsPerQuestion || 90,
	);
	const [isTimedOut, setIsTimedOut] = useState(false);
	const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(null);

	// Thinksheet Session State
	const [sheetNumber, setSheetNumber] = useState(1);
	const [questions, setQuestions] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedOptionId, setSelectedOptionId] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [history, setHistory] = useState([]);
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);
	const [resultTab, setResultTab] = useState('overview'); // 'overview' | 'summary'
	const [isLoadingSheet, setIsLoadingSheet] = useState(false);
	const [aiError, setAiError] = useState(null); // null | 'MISSING_KEY' | 'API_ERROR' | 'GENERIC_ERROR'

	// Skipped Question Revisit & Review Engine State
	const [isReviewMode, setIsReviewMode] = useState(false);
	const [skippedReviewQueue, setSkippedReviewQueue] = useState([]);
	const [isSkippedReviewPromptOpen, setIsSkippedReviewPromptOpen] =
		useState(false);
	const [wasSkippedOnRevisit, setWasSkippedOnRevisit] = useState(false);

	// Settings & Audio Controls
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [speechEnabled, setSpeechEnabled] = useState(true);

	// Modals
	const [isHintOpen, setIsHintOpen] = useState(false);
	const [isZoomOpen, setIsZoomOpen] = useState(false);
	const [isExitModalOpen, setIsExitModalOpen] = useState(false);
	const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);

	// WCAG AA Live Announcement for Screen Readers
	const [liveAnnouncement, setLiveAnnouncement] = useState('');

	// Pending Skill target to auto-launch after setup
	const [pendingSkill, setPendingSkill] = useState(null);

	// Dashboard announcement toast (e.g. after backup import)
	const [dashboardToast, setDashboardToast] = useState(null);

	// Always start on dashboard on load & scroll to top by default
	useEffect(() => {
		setCurrentScreen('dashboard');
		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}, []);

	// Scroll to top by default whenever dashboard is displayed
	useEffect(() => {
		if (currentScreen === 'dashboard') {
			window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}
	}, [currentScreen]);

	// Save session state to localStorage
	useEffect(() => {
		if (
			questions.length > 0 &&
			!isLoadingSheet &&
			currentScreen === 'thinksheet' &&
			!aiError
		) {
			saveSessionState({
				currentScreen,
				selectedSkill,
				sheetNumber,
				questions,
				currentIndex,
				selectedOptionId,
				isSubmitted,
				history,
				timerSeconds,
				isCompleted,
			});
		}
	}, [
		currentScreen,
		selectedSkill,
		sheetNumber,
		questions,
		currentIndex,
		selectedOptionId,
		isSubmitted,
		history,
		timerSeconds,
		isCompleted,
		isLoadingSheet,
		aiError,
	]);

	// 1. Unlimited Session Stopwatch (when per-question timer is disabled)
	useEffect(() => {
		if (
			timerConfig.enabled ||
			isCompleted ||
			isLoadingSheet ||
			currentScreen !== 'thinksheet' ||
			aiError
		) {
			return;
		}

		const stopwatchInterval = setInterval(() => {
			setTimerSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(stopwatchInterval);
	}, [
		timerConfig.enabled,
		isCompleted,
		isLoadingSheet,
		currentScreen,
		aiError,
	]);

	// 2. Per-Question Countdown Timer (when enabled)
	useEffect(() => {
		if (
			!timerConfig.enabled ||
			isSubmitted ||
			isTimedOut ||
			isCompleted ||
			isLoadingSheet ||
			currentScreen !== 'thinksheet' ||
			aiError
		) {
			return;
		}

		const countdownInterval = setInterval(() => {
			setQuestionTimeRemaining((prev) => Math.max(0, prev - 1));
		}, 1000);

		return () => clearInterval(countdownInterval);
	}, [
		timerConfig.enabled,
		isSubmitted,
		isTimedOut,
		isCompleted,
		isLoadingSheet,
		currentScreen,
		aiError,
		currentIndex,
	]);

	// 3. Trigger Question Timeout when countdown reaches 0
	useEffect(() => {
		if (
			timerConfig.enabled &&
			questionTimeRemaining === 0 &&
			!isSubmitted &&
			!isTimedOut &&
			!isLoadingSheet &&
			!isCompleted &&
			currentScreen === 'thinksheet' &&
			questions.length > 0
		) {
			handleQuestionTimeout();
		}
	}, [
		questionTimeRemaining,
		timerConfig.enabled,
		isSubmitted,
		isTimedOut,
		isLoadingSheet,
		isCompleted,
		currentScreen,
		questions.length,
	]);

	// 4. Auto-Advance Delay Countdown Loop (after submission or timeout)
	useEffect(() => {
		if (
			!isSubmitted ||
			autoAdvanceCountdown === null ||
			autoAdvanceCountdown <= 0 ||
			isCompleted ||
			currentScreen !== 'thinksheet'
		) {
			return;
		}

		const advanceInterval = setInterval(() => {
			setAutoAdvanceCountdown((prev) =>
				prev !== null ? Math.max(0, prev - 1) : null,
			);
		}, 1000);

		return () => clearInterval(advanceInterval);
	}, [
		isSubmitted,
		autoAdvanceCountdown,
		isCompleted,
		currentScreen,
		currentIndex,
	]);

	// 5. Trigger handleNext when Auto-Advance delay reaches 0
	useEffect(() => {
		if (
			isSubmitted &&
			autoAdvanceCountdown === 0 &&
			!isCompleted &&
			currentScreen === 'thinksheet'
		) {
			handleNext();
		}
	}, [autoAdvanceCountdown, isSubmitted, isCompleted, currentScreen]);

	// Current Question Object
	const currentQuestion = questions[currentIndex] || {};

	// Start Thinksheet Session for a given skill
	const startSkillSession = async (skill, age = kidAge) => {
		setSelectedSkill(skill);
		saveStoredSelectedSkill(skill);
		setIsLoadingSheet(true);
		setAiError(null);
		setCurrentScreen('thinksheet');
		setCurrentIndex(0);
		setSelectedOptionId(null);
		setIsSubmitted(false);
		setIsTimedOut(false);
		setAutoAdvanceCountdown(null);
		setQuestionTimeRemaining(timerConfig.secondsPerQuestion || 90);
		setHistory([]);
		setTimerSeconds(0);
		setIsCompleted(false);
		setIsReviewMode(false);
		setSkippedReviewQueue([]);
		setIsSkippedReviewPromptOpen(false);
		setWasSkippedOnRevisit(false);

		try {
			const freshQuestions = await getFreshThinksheetSession(skill, 1, age);
			setQuestions(freshQuestions);
		} catch (err) {
			console.error('AI Question Generation Failed:', err);
			if (err.message === 'MISSING_API_KEY') {
				setAiError('MISSING_KEY');
			} else {
				setAiError(err.message || 'API_ERROR');
			}
		} finally {
			setIsLoadingSheet(false);
		}
	};

	// Handle saving kid's profile & settings
	const handleSaveKidProfile = ({
		name,
		age,
		gender: newGender,
		avatar: newAvatar,
		timerConfig: newTimerConfig,
		showVisualDiagrams: newShowVisualDiagrams,
		petAssistanceEnabled: newPetAssistanceEnabled,
		toastNotice,
	}) => {
		saveStoredKidProfile(name, age, newGender, newAvatar);
		setKidName(name);
		setKidAge(age);
		if (newGender) setKidGender(newGender);
		if (newAvatar) setKidAvatar(newAvatar);
		if (newTimerConfig) {
			setTimerConfig(newTimerConfig);
			setQuestionTimeRemaining(newTimerConfig.secondsPerQuestion || 90);
		}
		if (newShowVisualDiagrams !== undefined) {
			setShowVisualDiagrams(newShowVisualDiagrams);
		}
		if (newPetAssistanceEnabled !== undefined) {
			setPetAssistanceEnabled(newPetAssistanceEnabled);
		}
		if (toastNotice) {
			setDashboardToast(toastNotice);
		}

		// If user clicked a skill card before entering their key, auto-launch that skill immediately!
		if (pendingSkill) {
			const skillToLaunch = pendingSkill;
			setPendingSkill(null);
			startSkillSession(skillToLaunch, age);
		} else {
			setCurrentScreen('dashboard');
			window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}
	};

	// Refresh settings in App state from localStorage (e.g. after direct dashboard import)
	const handleRefreshSettingsFromStorage = () => {
		setKidName(getStoredKidName());
		setKidAge(getStoredKidAge());
		setKidGender(getStoredKidGender());
		setKidAvatar(getStoredKidAvatar());
		setTimerConfig(getStoredTimerConfig());
		setShowVisualDiagrams(getStoredShowVisualDiagrams());
		setPetAssistanceEnabled(getStoredPetAssistanceEnabled());
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	};

	// Handle Question Timeout (when timer runs out)
	const handleQuestionTimeout = () => {
		setIsSubmitted(true);
		setIsTimedOut(true);
		setWasSkippedOnRevisit(false);
		setSelectedOptionId(null);
		playIncorrectSound(soundEnabled);
		setLiveAnnouncement(
			"Time's up! No answer was selected. Look at the correct solution.",
		);

		if (speechEnabled) {
			speakText(
				"Time's up! No answer was selected. Look at the correct solution.",
			);
		}

		// If auto-advance is enabled, start the configured countdown
		if (timerConfig.autoAdvanceEnabled) {
			setAutoAdvanceCountdown(timerConfig.autoAdvanceSeconds || 7);
		} else {
			setAutoAdvanceCountdown(null);
		}

		// Record in history as timed out / un-answered
		const newHistory = [...history];
		newHistory[currentIndex] = {
			questionId: currentQuestion.id,
			selectedOptionId: null,
			isCorrect: false,
			timedOut: true,
			timestamp: Date.now(),
		};
		setHistory(newHistory);
	};

	// Start Sheet for a selected skill (100% Real-Time AI Generation)
	const handleSelectSkill = async (skill) => {
		saveStoredSelectedSkill(skill);
		if (!getStoredApiKey() || !getStoredKidName()) {
			setPendingSkill(skill);
			setCurrentScreen('settings');
			return;
		}

		startSkillSession(skill, kidAge);
	};

	// Stable Toggle Callbacks
	const handleToggleSound = useCallback(
		() => setSoundEnabled((prev) => !prev),
		[],
	);
	const handleToggleSpeech = useCallback(
		() => setSpeechEnabled((prev) => !prev),
		[],
	);
	const handleOpenExitModal = useCallback(() => setIsExitModalOpen(true), []);

	// Handle Option Select
	const handleSelectOption = useCallback(
		(optionId) => {
			if (isSubmitted || isTimedOut) return;
			setSelectedOptionId(optionId);
		},
		[isSubmitted, isTimedOut],
	);

	// Handle Submit
	const handleSubmit = () => {
		if (!selectedOptionId || isSubmitted || isTimedOut) return;

		const isCorrect = selectedOptionId === currentQuestion.correctAnswerId;
		setIsSubmitted(true);
		setWasSkippedOnRevisit(false);
		setLiveAnnouncement(
			isCorrect ?
				'Answer submitted: Correct! Well done.'
			:	'Answer submitted: Incorrect. Check the solution explanation below.',
		);

		if (isCorrect) {
			playCorrectSound(soundEnabled);
			triggerConfetti();
		} else {
			playIncorrectSound(soundEnabled);
		}

		// If auto-advance is enabled, start the configured countdown
		if (timerConfig.autoAdvanceEnabled) {
			setAutoAdvanceCountdown(timerConfig.autoAdvanceSeconds || 7);
		} else {
			setAutoAdvanceCountdown(null);
		}

		// Save to history (mark skipped as false since question was answered)
		const newHistory = [...history];
		newHistory[currentIndex] = {
			questionId: currentQuestion.id,
			selectedOptionId,
			isCorrect,
			skipped: false,
			timedOut: false,
			timestamp: Date.now(),
		};
		setHistory(newHistory);
	};

	// Finalize Quest & Show Results
	const finalizeQuest = (finalHistory = history) => {
		const correctCount = finalHistory.filter((h) => h && h.isCorrect).length;
		const score = Math.round((correctCount / questions.length) * 100);

		// Update and record profile stats
		const updatedProfile = recordCompletedSheet(selectedSkill, score);
		setProfileStats(updatedProfile);

		setIsCompleted(true);
		setResultTab('overview');
		setLiveAnnouncement(
			`Quest completed! Your score is ${score} percent with ${correctCount} correct answers out of ${questions.length}.`,
		);
	};

	// Handle Skip Question
	const handleSkip = () => {
		if (isSubmitted || isTimedOut) return;

		if (isReviewMode) {
			// User is revisiting a previously skipped question and clicked "Skip" AGAIN (2nd skip)
			// Requirement: show the correct answer and pedagogical solution before loading the next skipped question or results
			playButtonPop(soundEnabled);
			setWasSkippedOnRevisit(true);
			setIsSubmitted(true);
			setSelectedOptionId(null);
			setIsTimedOut(false);
			setLiveAnnouncement('Question skipped. Correct solution revealed.');

			if (speechEnabled) {
				speakText('Question skipped. Here is the correct solution.');
			}

			if (timerConfig.autoAdvanceEnabled) {
				setAutoAdvanceCountdown(timerConfig.autoAdvanceSeconds || 7);
			} else {
				setAutoAdvanceCountdown(null);
			}

			// Retain in history as skipped
			const newHistory = [...history];
			newHistory[currentIndex] = {
				questionId: currentQuestion.id,
				selectedOptionId: null,
				isCorrect: false,
				skipped: true,
				timedOut: false,
				timestamp: Date.now(),
			};
			setHistory(newHistory);
			return;
		}

		// Normal Mode: First skip
		// Requirement: next question loaded immediately without revealing correct answer
		playButtonPop(soundEnabled);
		setLiveAnnouncement('Question skipped. Moving to next question.');

		if (speechEnabled) {
			speakText('Question skipped.');
		}

		setIsTimedOut(false);
		setAutoAdvanceCountdown(null);
		setQuestionTimeRemaining(timerConfig.secondsPerQuestion || 90);

		// Record in history as skipped
		const newHistory = [...history];
		newHistory[currentIndex] = {
			questionId: currentQuestion.id,
			selectedOptionId: null,
			isCorrect: false,
			skipped: true,
			timedOut: false,
			timestamp: Date.now(),
		};
		setHistory(newHistory);

		// Move directly to next question if available in sequence
		if (currentIndex + 1 < questions.length) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedOptionId(null);
			setIsSubmitted(false);
		} else {
			// Reached the end of the initial 10-question sequence
			// Check if any questions were skipped during this run
			const skippedIndices = newHistory
				.map((h, idx) => (h && h.skipped ? idx : null))
				.filter((idx) => idx !== null);

			if (skippedIndices.length > 0) {
				// Show dialog to revisit skipped questions before showing results
				setIsSkippedReviewPromptOpen(true);
			} else {
				finalizeQuest(newHistory);
			}
		}
	};

	// Handle Next Question
	const handleNext = () => {
		playButtonPop(soundEnabled);
		setIsTimedOut(false);
		setAutoAdvanceCountdown(null);
		setQuestionTimeRemaining(timerConfig.secondsPerQuestion || 90);

		if (isReviewMode) {
			// In Review Mode: dequeue the current question from the review queue
			const remainingQueue = skippedReviewQueue.filter(
				(idx) => idx !== currentIndex,
			);
			setSkippedReviewQueue(remainingQueue);

			if (remainingQueue.length > 0) {
				// Load the next skipped question immediately
				const nextIdx = remainingQueue[0];
				setCurrentIndex(nextIdx);
				setSelectedOptionId(null);
				setIsSubmitted(false);
				setWasSkippedOnRevisit(false);
			} else {
				// No more skipped questions available — load the Result Summary page!
				setIsReviewMode(false);
				setWasSkippedOnRevisit(false);
				finalizeQuest(history);
			}
			return;
		}

		// Normal Mode
		if (currentIndex + 1 < questions.length) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedOptionId(null);
			setIsSubmitted(false);
		} else {
			// Reached end of initial questions!
			const skippedIndices = history
				.map((h, idx) => (h && h.skipped ? idx : null))
				.filter((idx) => idx !== null);

			if (skippedIndices.length > 0) {
				setIsSkippedReviewPromptOpen(true);
			} else {
				finalizeQuest(history);
			}
		}
	};

	// Start Revisiting Skipped Questions
	const handleStartSkippedReview = () => {
		const skippedIndices = history
			.map((h, idx) => (h && h.skipped ? idx : null))
			.filter((idx) => idx !== null);

		if (skippedIndices.length === 0) {
			setIsSkippedReviewPromptOpen(false);
			finalizeQuest(history);
			return;
		}

		setIsSkippedReviewPromptOpen(false);
		setIsReviewMode(true);
		setSkippedReviewQueue(skippedIndices);
		setWasSkippedOnRevisit(false);
		setCurrentIndex(skippedIndices[0]);
		setSelectedOptionId(null);
		setIsSubmitted(false);
		setIsTimedOut(false);
		setAutoAdvanceCountdown(null);
		setQuestionTimeRemaining(timerConfig.secondsPerQuestion || 90);
		setLiveAnnouncement(
			`Revisiting question ${skippedIndices[0] + 1} of skipped questions.`,
		);
	};

	// Skip Review and Proceed to Results Summary
	const handleSkipReviewAndFinish = () => {
		setIsSkippedReviewPromptOpen(false);
		finalizeQuest(history);
	};

	// WCAG AA: Announce Question Changes to Screen Readers
	useEffect(() => {
		if (
			currentQuestion &&
			currentScreen === 'thinksheet' &&
			!isLoadingSheet &&
			!isCompleted
		) {
			const prompt =
				currentQuestion.question || currentQuestion.questionText || '';
			setLiveAnnouncement(
				`Question ${currentIndex + 1} of ${questions.length || 10}: ${prompt}`,
			);
		}
	}, [
		currentIndex,
		currentQuestion,
		currentScreen,
		isLoadingSheet,
		isCompleted,
		questions.length,
	]);

	// WCAG AA: Announce Selected Option to Screen Readers
	useEffect(() => {
		if (selectedOptionId && currentQuestion && !isSubmitted) {
			const opt = currentQuestion.options?.find(
				(o) => o.id === selectedOptionId,
			);
			if (opt) {
				setLiveAnnouncement(`Selected option ${opt.id}: ${opt.text || ''}`);
			}
		}
	}, [selectedOptionId, currentQuestion, isSubmitted]);

	// WCAG AA: Global Keyboard Navigation Shortcuts (1-4, A-D, Enter)
	useEffect(() => {
		if (currentScreen !== 'thinksheet' || isLoadingSheet || isCompleted) return;
		const anyModalOpen =
			isHintOpen ||
			isZoomOpen ||
			isExitModalOpen ||
			isAskDoubtOpen ||
			isSkippedReviewPromptOpen;
		if (anyModalOpen) return;

		const handleKeyDown = (e) => {
			if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;

			const key = e.key;
			if (!isSubmitted) {
				if (['1', '2', '3', '4'].includes(key)) {
					const idx = parseInt(key, 10) - 1;
					if (currentQuestion?.options?.[idx]) {
						e.preventDefault();
						handleSelectOption(currentQuestion.options[idx].id);
					}
				} else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(key)) {
					const upper = key.toUpperCase();
					if (currentQuestion?.options?.some((o) => o.id === upper)) {
						e.preventDefault();
						handleSelectOption(upper);
					}
				} else if (key === 'Enter' && selectedOptionId) {
					e.preventDefault();
					handleSubmit();
				}
			} else {
				if (key === 'Enter') {
					e.preventDefault();
					handleNext();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [
		currentScreen,
		isLoadingSheet,
		isCompleted,
		isSubmitted,
		selectedOptionId,
		currentQuestion,
		isHintOpen,
		isZoomOpen,
		isExitModalOpen,
		isAskDoubtOpen,
		isSkippedReviewPromptOpen,
		handleSelectOption,
	]);

	// Start Next Sheet in same skill
	const handleStartNextSheet = async () => {
		playButtonPop(soundEnabled);
		setIsLoadingSheet(true);
		setAiError(null);
		setIsTimedOut(false);
		setAutoAdvanceCountdown(null);
		setQuestionTimeRemaining(timerConfig.secondsPerQuestion || 90);

		const nextSheetNum = sheetNumber + 1;
		try {
			const newQuestions = await getFreshThinksheetSession(
				selectedSkill,
				nextSheetNum,
				kidAge,
			);
			setSheetNumber(nextSheetNum);
			setQuestions(newQuestions);
			setCurrentIndex(0);
			setSelectedOptionId(null);
			setIsSubmitted(false);
			setHistory([]);
			setIsCompleted(false);
			setIsReviewMode(false);
			setSkippedReviewQueue([]);
			setIsSkippedReviewPromptOpen(false);
			setWasSkippedOnRevisit(false);
			setResultTab('overview');
		} catch (err) {
			console.error('AI Next Sheet Failed:', err);
			if (err.message === 'MISSING_API_KEY') {
				setAiError('MISSING_KEY');
			} else {
				setAiError('API_ERROR');
			}
		} finally {
			setIsLoadingSheet(false);
		}
	};

	// Calculate score
	const correctCount = history.filter((h) => h && h.isCorrect).length;
	const scorePercent =
		questions.length > 0 ?
			Math.round((correctCount / questions.length) * 100)
		:	0;

	// Download Sheet Progress as PDF
	const handleDownloadSheet = useCallback(async () => {
		playButtonPop(soundEnabled);
		const now = new Date();
		const day = String(now.getDate()).padStart(2, '0');
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		const month = monthNames[now.getMonth()];
		const year = now.getFullYear();
		let hours = now.getHours();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		const formattedHours = String(hours).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const timeStampStr = `${day}${month}${year}_${formattedHours}-${minutes}${ampm}`;

		const safeKidName =
			(kidName || 'Explorer').trim().replace(/[^\w-]/g, '_') || 'Explorer';
		const fullDateTime = now.toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});

		const { exportSessionToPdf } = await import('./utils/pdfGenerator');
		exportSessionToPdf(
			{
				studentName: kidName || 'Explorer',
				studentAge: kidAge || 5,
				selectedSkill,
				sheetNumber,
				date: fullDateTime,
				scorePercent,
				correctCount,
				totalQuestions: questions.length,
				timerSeconds,
				questions,
				history,
			},
			`AstroQuest_${safeKidName}_Age${kidAge}_${selectedSkill}_Sheet${sheetNumber}_${timeStampStr}.pdf`,
		);
	}, [
		soundEnabled,
		kidName,
		kidAge,
		selectedSkill,
		sheetNumber,
		scorePercent,
		correctCount,
		questions,
		timerSeconds,
		history,
	]);

	// Confirm Exit from active quest
	const handleConfirmExit = () => {
		clearSessionState();
		setIsExitModalOpen(false);
		setIsReviewMode(false);
		setSkippedReviewQueue([]);
		setIsSkippedReviewPromptOpen(false);
		setWasSkippedOnRevisit(false);
		setCurrentScreen('dashboard');
	};

	// Render Dedicated Settings Screen
	if (currentScreen === 'settings') {
		return (
			<Suspense fallback={<ScreenLoadingFallback />}>
				<SettingsScreen
					onSaveAndReturn={handleSaveKidProfile}
					onBack={() => {
						setPendingSkill(null);
						setCurrentScreen('dashboard');
					}}
					soundEnabled={soundEnabled}
					pendingSkill={pendingSkill}
				/>
			</Suspense>
		);
	}

	// Render Skill Selection Dashboard
	if (currentScreen === 'dashboard') {
		return (
			<SkillSelectionDashboard
				profileStats={profileStats}
				onSelectSkill={handleSelectSkill}
				soundEnabled={soundEnabled}
				kidName={kidName}
				kidAge={kidAge}
				kidGender={kidGender}
				kidAvatar={kidAvatar}
				onOpenSettings={() => setCurrentScreen('settings')}
				onAnimationComplete={() => {
					if (!getStoredKidName() || !getStoredApiKey()) {
						setCurrentScreen('settings');
					}
				}}
				timerConfig={timerConfig}
				showVisualDiagrams={showVisualDiagrams}
				dashboardToast={dashboardToast}
				onClearDashboardToast={() => setDashboardToast(null)}
				onUpdateSettings={handleRefreshSettingsFromStorage}
			/>
		);
	}

	// Render Active Thinksheet Session
	return (
		<div
			className={`min-h-screen space-background flex flex-col text-white font-sans overflow-x-clip relative ${
				!isCompleted ?
					'lg:h-screen lg:overflow-hidden justify-between'
				:	'overflow-y-auto'
			}`}>
			{/* Skip to Main Content for Keyboard Accessibility (WCAG SC 2.4.1) */}
			<a
				href='#main-content'
				className='sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:font-black focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-indigo-300 focus:outline-none'>
				Skip to main content
			</a>

			{/* Screen Reader Live Announcement Region (WCAG SC 4.1.3) */}
			<div
				role='status'
				aria-live='polite'
				aria-atomic='true'
				className='sr-only'>
				{liveAnnouncement}
			</div>

			{/* Top Header */}
			<Header
				questionIndex={currentIndex}
				totalQuestions={questions.length || 10}
				history={history}
				timerSeconds={timerSeconds}
				timerConfig={timerConfig}
				questionTimeRemaining={questionTimeRemaining}
				soundEnabled={soundEnabled}
				onToggleSound={handleToggleSound}
				speechEnabled={speechEnabled}
				onToggleSpeech={handleToggleSpeech}
				onExitClick={handleOpenExitModal}
				kidName={kidName}
				kidAge={kidAge}
				kidGender={kidGender}
				kidAvatar={kidAvatar}
			/>

			{/* Main Screen Body */}
			<main
				id='main-content'
				role='main'
				tabIndex={-1}
				className={`flex-1 flex flex-col items-center px-3 sm:px-6 w-full max-w-7xl mx-auto focus:outline-none ${
					!isCompleted ?
						'justify-center py-2 sm:py-3 min-h-0 overflow-hidden'
					:	'justify-start py-6 sm:py-8 overflow-y-visible'
				}`}>
				{isLoadingSheet ?
					/* AstroQuest Cosmic Loader */
					<Suspense fallback={<ScreenLoadingFallback />}>
						<CosmicQuestLoader
							selectedSkill={selectedSkill}
							kidName={kidName}
							kidAge={kidAge}
							kidAvatar={kidAvatar}
						/>
					</Suspense>
				: aiError ?
					/* AI Error / API Key Setup Prompt Screen */
					<div className='w-full max-w-xl mx-auto p-6 sm:p-8 bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-amber-400/80 rounded-3xl shadow-2xl text-center animate-in fade-in'>
						<div className='w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-300'>
							<Key className='w-8 h-8' />
						</div>

						<h2 className='text-xl sm:text-2xl font-black text-white mb-2'>
							{aiError === 'MISSING_KEY' ?
								'Google Gemini API Key Required'
							:	'AI Generation Connection Error'}
						</h2>

						<p className='text-sm text-slate-300 font-semibold mb-6 leading-relaxed'>
							{aiError === 'MISSING_KEY' ?
								'All AstroQuest challenges are generated live by Google Gemini AI. Please configure your API key to start generating customized questions.'
							: typeof aiError === 'string' && aiError !== 'API_ERROR' ?
								aiError
							:	'Unable to connect to the Gemini AI API. Please check your internet connection or verify your API key in Settings.'
							}
						</p>

						<div className='flex flex-col sm:flex-row gap-3 justify-center'>
							<button
								onClick={() => {
									playButtonPop(soundEnabled);
									setCurrentScreen('settings');
								}}
								className='px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all cursor-pointer'>
								<Sparkles className='w-4 h-4' />
								<span>Open Settings & Key ⚙️</span>
							</button>

							<button
								onClick={() => handleSelectSkill(selectedSkill)}
								className='px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer'>
								<RefreshCw className='w-4 h-4' />
								<span>Try Again</span>
							</button>

							<button
								onClick={() => {
									playButtonPop(soundEnabled);
									setCurrentScreen('dashboard');
								}}
								className='px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer'>
								<ArrowLeft className='w-4 h-4' />
								<span>Skills Hub</span>
							</button>
						</div>
					</div>
				: !isCompleted ?
					/* Question Playing View */
					<div className='w-full flex flex-col justify-center flex-1 my-auto min-h-0 h-full'>
						{/* Layout when NOT submitted: Full-width layout with Question and Options side-by-side and full-width bottom Action Bar */}
						{!isSubmitted ?
							<div className='flex flex-col justify-between gap-3 sm:gap-3.5 w-full h-full lg:max-h-[calc(100dvh-95px)] min-h-0'>
								{/* Top Split Grid: Question Card on Left, Options Grid on Right */}
								<div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch w-full flex-1 min-h-0'>
									{/* Left: Question Card (Matches full height of right side) */}
									<div className='lg:col-span-6 flex flex-col h-full min-h-0'>
										<QuestionCard
											question={currentQuestion}
											currentIndex={currentIndex}
											totalQuestions={questions.length}
											onZoomClick={() => setIsZoomOpen(true)}
											soundEnabled={soundEnabled}
											showVisualDiagrams={showVisualDiagrams}
											kidName={kidName}
											kidAge={kidAge}
											isReviewMode={isReviewMode}
										/>
									</div>

									{/* Right: Options Grid (Matches full height with internal scroll if tall) */}
									<div className='lg:col-span-6 flex flex-col h-full min-h-0 overflow-y-auto pr-1'>
										<OptionsGrid
											options={currentQuestion.options || []}
											selectedOptionId={selectedOptionId}
											onSelectOption={handleSelectOption}
											isSubmitted={false}
											correctAnswerId={currentQuestion.correctAnswerId}
											soundEnabled={soundEnabled}
											showVisualDiagrams={showVisualDiagrams}
											question={currentQuestion}
										/>
									</div>
								</div>

								{/* Full-Width Bottom Action Bar (Hint, Skip, Center Timer, and Submit) spanning the entire width */}
								<div className='flex-shrink-0 sticky bottom-0 sm:bottom-1 z-30 w-full flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3 px-3.5 sm:px-6 select-none border-t border-white/15 bg-[#0C1033]/95 backdrop-blur-md rounded-2xl shadow-[0_-8px_25px_rgba(0,0,0,0.5)]'>
									{/* Left: Hint & Skip Buttons */}
									<div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
										{/* Power-up Hint Button */}
										<button
											onClick={() => {
												playButtonPop(soundEnabled);
												setIsHintOpen(true);
											}}
											className='w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 hover:scale-110 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all border-2 border-white/40 flex-shrink-0 cursor-pointer focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:outline-none'
											title='Hint Clue'
											aria-label='Get a hint clue'>
											<Zap className='w-5 h-5 fill-white' />
										</button>

										{/* Skip Question Button */}
										<button
											onClick={handleSkip}
											className='px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 bg-[#1A1D54] hover:bg-[#252A74] text-slate-300 hover:text-white border-2 border-indigo-400/40 hover:border-indigo-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:outline-none'
											title='Skip this question'
											aria-label='Skip this question'>
											<SkipForward className='w-4 h-4 text-amber-400' />
											<span>Skip</span>
										</button>
									</div>

									{/* Center: Running Timer for both Timer Limit (countdown) & Infinite Timer (stopwatch) */}
									<div className='flex items-center justify-center flex-1 mx-2 sm:mx-4'>
										<div
											role='timer'
											aria-live='off'
											className={`flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl border font-mono font-black text-sm sm:text-base md:text-lg tracking-wider shadow-inner transition-all ${
												timerConfig?.enabled ?
													questionTimeRemaining <= 5 ?
														'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-400/40 animate-bounce'
													: questionTimeRemaining <= 15 ?
														'bg-amber-950/70 border-amber-400 text-amber-300 ring-2 ring-amber-400/30 animate-pulse'
													:	'bg-[#121644]/90 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
												:	'bg-[#121644]/90 border-pink-400/40 text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.15)]'
											}`}
											title={
												timerConfig?.enabled ?
													`Time remaining: ${questionTimeRemaining}s (Question limit)`
												:	`Elapsed session time: ${timerSeconds}s (Infinite timer)`
											}
											aria-label={
												timerConfig?.enabled ?
													`Question countdown: ${questionTimeRemaining} seconds remaining`
												:	`Elapsed session time: ${timerSeconds} seconds`
											}>
											<Clock
												className={`w-4 h-4 sm:w-5 sm:h-5 ${
													timerConfig?.enabled ?
														questionTimeRemaining <= 15 ?
															'text-amber-400 animate-spin'
														:	'text-cyan-400'
													:	'text-pink-400 animate-spin-slow'
												}`}
											/>
											<span>
												{Math.floor(
													(timerConfig?.enabled ?
														questionTimeRemaining
													:	timerSeconds) / 60,
												)
													.toString()
													.padStart(2, '0')}
												:
												{(
													(timerConfig?.enabled ?
														questionTimeRemaining
													:	timerSeconds) % 60
												)
													.toString()
													.padStart(2, '0')}
											</span>
											<span className='text-[10px] sm:text-xs uppercase font-extrabold tracking-widest opacity-80 ml-0.5 hidden xs:inline'>
												{timerConfig?.enabled ? 'Left' : 'Elapsed'}
											</span>
										</div>
									</div>

									{/* Right: Submit Button */}
									<button
										disabled={!selectedOptionId}
										onClick={handleSubmit}
										aria-label={
											selectedOptionId ? 'Submit your answer' : (
												'Select an answer option to submit'
											)
										}
										aria-disabled={!selectedOptionId}
										className={`px-7 sm:px-12 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base md:text-lg tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2.5 flex-shrink-0 focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:outline-none ${
											selectedOptionId ?
												'bg-[#FF5B84] hover:bg-[#FF435A] text-white hover:scale-[1.02] active:scale-95 shadow-[0_8px_20px_rgba(255,91,132,0.4)] cursor-pointer'
											:	'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
										}`}>
										<span>Submit</span>
									</button>
								</div>
							</div>
						:	/* Layout when SUBMITTED / TIMED OUT: Question Card on Left, Solution Panel with NEXT button on Right */
							<div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch w-full h-full lg:max-h-[calc(100dvh-95px)] min-h-0'>
								{/* Left Column: Question Card & compact Options */}
								<div className='lg:col-span-7 flex flex-col gap-3 lg:max-h-[calc(100dvh-95px)] lg:overflow-y-auto pr-1 min-h-0'>
									<QuestionCard
										question={currentQuestion}
										currentIndex={currentIndex}
										totalQuestions={questions.length}
										onZoomClick={() => setIsZoomOpen(true)}
										soundEnabled={soundEnabled}
										isSubmitted={true}
										showVisualDiagrams={showVisualDiagrams}
										kidName={kidName}
										kidAge={kidAge}
										isReviewMode={isReviewMode}
									/>
									<OptionsGrid
										options={currentQuestion.options || []}
										selectedOptionId={selectedOptionId}
										onSelectOption={handleSelectOption}
										isSubmitted={true}
										correctAnswerId={currentQuestion.correctAnswerId}
										soundEnabled={soundEnabled}
										showVisualDiagrams={showVisualDiagrams}
										question={currentQuestion}
									/>
								</div>

								{/* Right Column: Solution & Feedback Panel with NEXT BUTTON right below solution! */}
								<div className='lg:col-span-5 flex flex-col min-w-0 h-full lg:max-h-[calc(100dvh-95px)] min-h-0'>
									<SolutionPanel
										isCorrect={
											selectedOptionId === currentQuestion.correctAnswerId
										}
										isTimedOut={isTimedOut}
										autoAdvanceCountdown={autoAdvanceCountdown}
										question={currentQuestion}
										onAskDoubt={() => setIsAskDoubtOpen(true)}
										soundEnabled={soundEnabled}
										onNext={handleNext}
										showVisualDiagrams={showVisualDiagrams}
										isReviewMode={isReviewMode}
										wasSkippedOnRevisit={wasSkippedOnRevisit}
										hasNextSkipped={
											isReviewMode &&
											skippedReviewQueue.filter((idx) => idx !== currentIndex)
												.length > 0
										}
									/>
								</div>
							</div>
						}
					</div>
				:	/* Completion & Summary View */
					<div className='w-full max-w-5xl mx-auto pb-16'>
						<Suspense fallback={<ScreenLoadingFallback />}>
							{resultTab === 'overview' ?
								<ResultOverview
									scorePercent={scorePercent}
									correctCount={correctCount}
									totalCount={questions.length}
									history={history}
									onStartNextSheet={handleStartNextSheet}
									onViewSummary={() => setResultTab('summary')}
									onDownloadPdf={handleDownloadSheet}
									activeTab={resultTab}
									setActiveTab={setResultTab}
									soundEnabled={soundEnabled}
									onBackToDashboard={() => setCurrentScreen('dashboard')}
									kidName={kidName}
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
				}
			</main>

			{/* Interactive Modals (Lazy Loaded on Demand) */}
			<Suspense fallback={null}>
				{isHintOpen && (
					<HintModal
						hintText={currentQuestion.hint}
						isOpen={isHintOpen}
						onClose={() => setIsHintOpen(false)}
						soundEnabled={soundEnabled}
					/>
				)}

				{isZoomOpen && (
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

				{isAskDoubtOpen && (
					<AskDoubtModal
						question={currentQuestion}
						isOpen={isAskDoubtOpen}
						onClose={() => setIsAskDoubtOpen(false)}
						soundEnabled={soundEnabled}
					/>
				)}

				{isExitModalOpen && (
					<ExitConfirmationModal
						isOpen={isExitModalOpen}
						onClose={() => setIsExitModalOpen(false)}
						onConfirmExit={handleConfirmExit}
						currentIndex={currentIndex}
						totalQuestions={questions.length}
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
			</Suspense>

			{/* Interactive Cosmic Pet Assistant (Configurable via Settings) */}
			{petAssistanceEnabled && (
				<PetAssistant
					currentScreen={currentScreen}
					currentQuestion={currentQuestion}
					isSubmitted={isSubmitted}
					isCorrect={selectedOptionId === currentQuestion?.correctAnswerId}
					isReviewMode={isReviewMode}
					wasSkippedOnRevisit={wasSkippedOnRevisit}
					kidName={kidName}
					soundEnabled={soundEnabled}
					speechEnabled={speechEnabled}
					onTriggerHint={() => setIsHintOpen(true)}
				/>
			)}
		</div>
	);
}
