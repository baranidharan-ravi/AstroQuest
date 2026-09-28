import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	CHRONO_FREEZE_SECONDS,
	DEFAULT_QUESTION_TIMER_SECONDS,
	isTimerMandatoryForAge,
	PURE_QUEST_BADGE_ID,
	PURE_QUEST_XP_BONUS,
} from './constants';
import { getRandomCosmicFact } from './data/cosmicFacts';
import { DashboardModalsHub } from './features/dashboard/components';
import SkillSelectionDashboard from './features/dashboard/SkillSelectionDashboard';
import CosmicLifelinesBar from './features/quest/CosmicLifelinesBar';
import {
	QuestActionBar,
	QuestAiErrorCard,
	QuestLoadingNextView,
	QuestModalsHub,
	QuestPauseShield,
	QuestResultsView,
	QuestSubmittedSolutionView,
} from './features/quest/components';
import OptionsGrid from './features/quest/OptionsGrid';
import QuestionCard from './features/quest/QuestionCard';
import { getStoredApiKey } from './services/aiGenerator';
import { getFreshThinksheetSession } from './services/questionService';
import {
	getStoredAmbientEnabled,
	startAmbientSound,
} from './utils/ambientAudio';
import { recordAnomaly, recordAnomalyMastery } from './utils/anomaliesManager';
import {
	playButtonPop,
	playChronoFreezeSound,
	playCorrectSound,
	playIncorrectSound,
	playTelemetryScanSound,
	speakText,
} from './utils/audioSynthesis';
import {
	awardBadge,
	awardXP,
	getStoredAchievements,
} from './utils/badgeManager';
import { triggerConfetti } from './utils/confettiHelper';
import Header from './utils/Header';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidGender,
	getStoredKidName,
	getStoredSelectedSkill,
	getStoredShowVisualDiagrams,
	getStoredTimerConfig,
	loadProfileStats,
	recordCompletedSheet,
	saveStoredKidProfile,
	saveStoredSelectedSkill,
	saveStoredShowVisualDiagrams,
} from './utils/progressTracker';
import { exportQuestSessionPdf } from './utils/sessionExportHelper';
import { clearSessionState, saveSessionState } from './utils/storage';

// Code-split screens and loaders loaded on demand
const SettingsScreen = lazy(() => import('./features/settings/SettingsScreen'));
const CosmicQuestLoader = lazy(() => import('./utils/CosmicQuestLoader'));
const TimeWarpMode = lazy(() => import('./features/quest/TimeWarpMode'));

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

export default function App() {
	// Kid Profile & Name State
	const [kidName, setKidName] = useState(getStoredKidName);
	const [kidAge, setKidAge] = useState(getStoredKidAge);
	const [kidGender, setKidGender] = useState(getStoredKidGender);
	const [kidAvatar, setKidAvatar] = useState(getStoredKidAvatar);
	const [showVisualDiagrams, setShowVisualDiagrams] = useState(
		getStoredShowVisualDiagrams,
	);
	const [isTimerPaused, setIsTimerPaused] = useState(false);
	const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
	const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
	const [isPlanetariumOpen, setIsPlanetariumOpen] = useState(false);
	const [isObservatoryOpen, setIsObservatoryOpen] = useState(false);
	const [isOdysseyOpen, setIsOdysseyOpen] = useState(false);
	const [isHabitatOpen, setIsHabitatOpen] = useState(false);
	const [isEducatorPortalOpen, setIsEducatorPortalOpen] = useState(false);
	const nextQuestionTimeoutRef = useRef(null);
	const pendingNextActionRef = useRef(null);

	// Immediately resume timer and load the next question if user triggers resume during loading
	const handleImmediateResumeAndLoadNext = useCallback(() => {
		if (nextQuestionTimeoutRef.current) {
			clearTimeout(nextQuestionTimeoutRef.current);
			nextQuestionTimeoutRef.current = null;
		}
		if (pendingNextActionRef.current) {
			const action = pendingNextActionRef.current;
			pendingNextActionRef.current = null;
			action();
		} else {
			setIsLoadingNextQuestion(false);
			setIsTimerPaused(false);
		}
	}, []);

	// Toggle Timer Pause handler (honors immediate resume if loading next question)
	const handleToggleTimerPause = useCallback(
		(e) => {
			if (e && typeof e.stopPropagation === 'function') {
				e.stopPropagation();
			}
			if (isLoadingNextQuestion) {
				handleImmediateResumeAndLoadNext();
				return;
			}
			setIsTimerPaused((prev) => !prev);
		},
		[isLoadingNextQuestion, handleImmediateResumeAndLoadNext],
	);

	// Automatically resume timer when paused upon question interaction
	const resumeTimerIfPaused = useCallback(
		(e) => {
			// Never auto-resume if interaction was triggered on timer buttons or bottom action bar
			if (
				e?.target &&
				typeof e.target.closest === 'function' &&
				(e.target.closest('button[role="timer"]') ||
					e.target.closest('#bottom-action-bar') ||
					e.target.closest('[data-no-auto-resume="true"]'))
			) {
				return;
			}
			if (isLoadingNextQuestion) {
				handleImmediateResumeAndLoadNext();
				return;
			}
			setIsTimerPaused((prev) => {
				if (prev) return false;
				return prev;
			});
		},
		[isLoadingNextQuestion, handleImmediateResumeAndLoadNext],
	);

	// Navigation State
	const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard' | 'settings' | 'thinksheet'
	const [selectedSkill, setSelectedSkill] = useState(
		() => getStoredSelectedSkill() || 'Visual',
	); // 'Visual' | 'Analytical Thinking'
	const [profileStats, setProfileStats] = useState(loadProfileStats);

	// Timer Settings & Per-Question Limit State
	const [timerConfig, setTimerConfig] = useState(() =>
		getStoredTimerConfig(getStoredKidAge()),
	);
	const [questionTimeRemaining, setQuestionTimeRemaining] = useState(
		() =>
			getStoredTimerConfig(getStoredKidAge()).secondsPerQuestion ||
			DEFAULT_QUESTION_TIMER_SECONDS,
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

	// Modals & Panels
	const [isHintOpen, setIsHintOpen] = useState(false);
	const [isZoomOpen, setIsZoomOpen] = useState(false);
	const [isExitModalOpen, setIsExitModalOpen] = useState(false);
	const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);

	// Cosmic Factoids Library State
	const [activeCosmicFact, setActiveCosmicFact] = useState(() =>
		getRandomCosmicFact(),
	);

	// Multi-Tier Hints & Strategic Lifelines State (Quest-Level — persist across questions)
	const [cosmicClueUsed, setCosmicClueUsed] = useState(false);
	const [revealedClueIndex, setRevealedClueIndex] = useState(null);
	const [eliminatedOptionIds, setEliminatedOptionIds] = useState([]);
	const [cosmicRayUsed, setCosmicRayUsed] = useState(false);
	const [telemetryScan, setTelemetryScan] = useState(null);
	const [telemetryScanUsed, setTelemetryScanUsed] = useState(false);
	const [chronoFreezeUsed, setChronoFreezeUsed] = useState(false);
	const [chronoFreezeActive, setChronoFreezeActive] = useState(false);

	// Astronaut Achievements & XP State
	const [achievements, setAchievements] = useState(getStoredAchievements);

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

	// Cleanup next question transition timer on unmount
	useEffect(() => {
		return () => {
			if (nextQuestionTimeoutRef.current) {
				clearTimeout(nextQuestionTimeoutRef.current);
			}
		};
	}, []);

	// Auto-activate ambient deep-space focus soundscape on first user gesture if enabled
	useEffect(() => {
		if (getStoredAmbientEnabled()) {
			const handleFirstInteraction = () => {
				if (getStoredAmbientEnabled()) {
					startAmbientSound();
				}
				window.removeEventListener('pointerdown', handleFirstInteraction);
				window.removeEventListener('keydown', handleFirstInteraction);
			};
			window.addEventListener('pointerdown', handleFirstInteraction, {
				once: true,
			});
			window.addEventListener('keydown', handleFirstInteraction, {
				once: true,
			});
			return () => {
				window.removeEventListener('pointerdown', handleFirstInteraction);
				window.removeEventListener('keydown', handleFirstInteraction);
			};
		}
	}, []);

	// Re-hydrate application state when switching astronaut flight crew profiles
	useEffect(() => {
		const handleCrewSwitched = (e) => {
			const member = e?.detail?.member;
			if (member) {
				setKidName(member.name);
				setKidAge(member.age);
				setKidGender(member.gender);
				setKidAvatar(member.avatar);
				if (member.timerConfig) {
					const isMandatory = isTimerMandatoryForAge(member.age);
					setTimerConfig(
						isMandatory ?
							{ ...member.timerConfig, enabled: true }
						:	member.timerConfig,
					);
				}
				if (typeof member.showVisualDiagrams === 'boolean') {
					setShowVisualDiagrams(member.showVisualDiagrams);
				}
				// Return safely to dashboard if currently on a quest so new explorer starts fresh
				if (currentScreen === 'thinksheet') {
					setCurrentScreen('dashboard');
					setQuestions([]);
				}
			}
		};
		window.addEventListener('astroquest:crew_switched', handleCrewSwitched);
		return () => {
			window.removeEventListener(
				'astroquest:crew_switched',
				handleCrewSwitched,
			);
		};
	}, [currentScreen]);

	// Enforce mandatory timer challenge for Ages 8–14 (Upper Elementary & Middle School)
	useEffect(() => {
		if (isTimerMandatoryForAge(kidAge)) {
			setTimerConfig((prev) => {
				if (!prev?.enabled) {
					const updated = {
						...prev,
						enabled: true,
						secondsPerQuestion:
							prev?.secondsPerQuestion || DEFAULT_QUESTION_TIMER_SECONDS,
					};
					saveStoredTimerConfig(updated, kidAge);
					return updated;
				}
				return prev;
			});
		}
	}, [kidAge]);

	// 1. Session Stopwatch (tracks total quest duration across all modes)
	useEffect(() => {
		if (
			isCompleted ||
			isLoadingSheet ||
			isLoadingNextQuestion ||
			currentScreen !== 'thinksheet' ||
			aiError ||
			isTimerPaused
		) {
			return;
		}

		const stopwatchInterval = setInterval(() => {
			setTimerSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(stopwatchInterval);
	}, [
		isCompleted,
		isLoadingSheet,
		isLoadingNextQuestion,
		currentScreen,
		aiError,
		isTimerPaused,
	]);

	// 2. Per-Question Countdown Timer (when enabled)
	useEffect(() => {
		if (
			!timerConfig.enabled ||
			isSubmitted ||
			isTimedOut ||
			isCompleted ||
			isLoadingSheet ||
			isLoadingNextQuestion ||
			currentScreen !== 'thinksheet' ||
			aiError ||
			isTimerPaused
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
		isLoadingNextQuestion,
		currentScreen,
		aiError,
		currentIndex,
		isTimerPaused,
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
		setIsLoadingNextQuestion(false);
		if (nextQuestionTimeoutRef.current) {
			clearTimeout(nextQuestionTimeoutRef.current);
			nextQuestionTimeoutRef.current = null;
		}
		pendingNextActionRef.current = null;
		setAiError(null);
		setCurrentScreen('thinksheet');
		setCurrentIndex(0);
		setSelectedOptionId(null);
		setIsSubmitted(false);
		setIsTimedOut(false);
		setAutoAdvanceCountdown(null);
		setEliminatedOptionIds([]);
		setCosmicClueUsed(false);
		setRevealedClueIndex(null);
		setCosmicRayUsed(false);
		setTelemetryScan(null);
		setTelemetryScanUsed(false);
		setChronoFreezeUsed(false);
		setChronoFreezeActive(false);
		setQuestionTimeRemaining(
			timerConfig.secondsPerQuestion || DEFAULT_QUESTION_TIMER_SECONDS,
		);
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
		toastNotice,
		stayOnSettings = false,
	}) => {
		saveStoredKidProfile(name, age, newGender, newAvatar);
		setKidName(name);
		setKidAge(age);
		if (newGender) setKidGender(newGender);
		if (newAvatar) setKidAvatar(newAvatar);
		if (newTimerConfig) {
			const isMandatory = isTimerMandatoryForAge(age);
			const effectiveConfig =
				isMandatory ? { ...newTimerConfig, enabled: true } : newTimerConfig;
			setTimerConfig(effectiveConfig);
			setQuestionTimeRemaining(
				effectiveConfig.secondsPerQuestion || DEFAULT_QUESTION_TIMER_SECONDS,
			);
		}
		if (newShowVisualDiagrams !== undefined) {
			setShowVisualDiagrams(newShowVisualDiagrams);
		}
		if (toastNotice) {
			setDashboardToast(toastNotice);
		}

		// If user clicked a skill card before entering their key, auto-launch that skill immediately!
		if (pendingSkill) {
			const skillToLaunch = pendingSkill;
			setPendingSkill(null);
			startSkillSession(skillToLaunch, age);
		} else if (!stayOnSettings) {
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
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	};

	// 1-Click Toggle for Visual Diagrams directly from Dashboard
	const handleToggleVisualDiagrams = useCallback(() => {
		setShowVisualDiagrams((prev) => {
			const next = !prev;
			saveStoredShowVisualDiagrams(next);
			return next;
		});
		playButtonPop(soundEnabled);
	}, [soundEnabled]);

	// Handle Question Timeout (when timer runs out)
	const handleQuestionTimeout = () => {
		setIsSubmitted(true);
		setIsTimedOut(true);
		setWasSkippedOnRevisit(false);
		setSelectedOptionId(null);
		playIncorrectSound(soundEnabled);
		recordAnomaly(currentQuestion, 'timed_out');
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

	// Automatically reset timer pause when question index or screen changes
	useEffect(() => {
		setIsTimerPaused(false);
	}, [currentIndex, currentScreen]);

	// Handle Option Select
	const handleSelectOption = useCallback(
		(optionId) => {
			if (isSubmitted || isTimedOut) return;
			resumeTimerIfPaused();
			setSelectedOptionId(optionId);
		},
		[isSubmitted, isTimedOut, resumeTimerIfPaused],
	);

	// Cosmic Clue 1x Lifeline Handler (strictly 1 use per quest)
	const handleUseCosmicClue = useCallback(() => {
		if (cosmicClueUsed || isSubmitted || isTimedOut) return;
		playCorrectSound(soundEnabled);
		setCosmicClueUsed(true);
		setRevealedClueIndex(currentIndex);
		setLiveAnnouncement(
			`Cosmic Clue activated: ${currentQuestion?.hint || 'Check relationships and eliminate options that do not fit.'}`,
		);
		awardXP(10);
		setAchievements(getStoredAchievements());
	}, [
		cosmicClueUsed,
		isSubmitted,
		isTimedOut,
		soundEnabled,
		currentIndex,
		currentQuestion,
	]);

	// 50/50 Cosmic Ray Power-Up Handler
	const handleActivateCosmicRay = useCallback(() => {
		if (cosmicRayUsed || isSubmitted || isTimedOut) return;
		playCorrectSound(soundEnabled);
		const options = currentQuestion?.options || [];
		const wrongOptions = options.filter(
			(o) => o.id !== currentQuestion?.correctAnswerId,
		);
		if (wrongOptions.length < 2) return;

		// Randomly select 2 wrong options to eliminate
		const shuffled = [...wrongOptions].sort(() => Math.random() - 0.5);
		const toEliminate = shuffled.slice(0, 2).map((o) => o.id);

		setEliminatedOptionIds(toEliminate);
		setCosmicRayUsed(true);
		setLiveAnnouncement(
			'50/50 Cosmic Ray fired! Two incorrect options were blasted away.',
		);

		// Award Cosmic Ray Master badge
		awardBadge('cosmic_ray');
		awardXP(10);
		setAchievements(getStoredAchievements());

		// Deselect if user had chosen an eliminated option
		if (selectedOptionId && toEliminate.includes(selectedOptionId)) {
			setSelectedOptionId(null);
		}
	}, [
		cosmicRayUsed,
		isSubmitted,
		isTimedOut,
		currentQuestion,
		soundEnabled,
		selectedOptionId,
	]);

	// Starfleet Telemetry Scan Handler
	const handleActivateTelemetryScan = useCallback(() => {
		if (telemetryScanUsed || isSubmitted || isTimedOut || !currentQuestion)
			return;
		playTelemetryScanSound(soundEnabled);

		const options = currentQuestion?.options || [];
		const correctId = currentQuestion?.correctAnswerId;
		const activeWrong = options.filter(
			(o) => o.id !== correctId && !eliminatedOptionIds.includes(o.id),
		);

		// Mission Control confidence: 70% to 82% on correct
		const correctPct = Math.floor(Math.random() * 13) + 70;
		const remainingPct = 100 - correctPct;

		const scan = {};
		scan[correctId] = correctPct;

		// Distribute remaining among active wrong options
		if (activeWrong.length === 1) {
			scan[activeWrong[0].id] = remainingPct;
		} else if (activeWrong.length > 1) {
			const firstShare = Math.floor(remainingPct * 0.65);
			const secondShare = remainingPct - firstShare;
			scan[activeWrong[0].id] = firstShare;
			scan[activeWrong[1].id] = secondShare;
			for (let i = 2; i < activeWrong.length; i++) {
				scan[activeWrong[i].id] = 0;
			}
		}

		// 0% for blasted options
		eliminatedOptionIds.forEach((id) => {
			scan[id] = 0;
		});

		setTelemetryScan(scan);
		setTelemetryScanUsed(true);
		setLiveAnnouncement(
			`Starfleet Telemetry Scan complete! Deep-space radar calculated ${correctPct}% probability for the top signature.`,
		);

		// Award Telemetry Specialist badge
		awardBadge('telemetry_master');
		awardXP(10);
		setAchievements(getStoredAchievements());
	}, [
		telemetryScanUsed,
		isSubmitted,
		isTimedOut,
		currentQuestion,
		soundEnabled,
		eliminatedOptionIds,
	]);

	// Chrono Freeze (+30s Boost) Handler
	const handleActivateChronoFreeze = useCallback(() => {
		if (chronoFreezeUsed || isSubmitted || isTimedOut) return;
		playChronoFreezeSound(soundEnabled);

		setChronoFreezeUsed(true);
		setChronoFreezeActive(true);

		if (timerConfig?.enabled) {
			setQuestionTimeRemaining((prev) => prev + CHRONO_FREEZE_SECONDS);
			setLiveAnnouncement(
				`Chrono Freeze engaged! Added +${CHRONO_FREEZE_SECONDS} bonus seconds to your clock.`,
			);
		} else {
			awardXP(20);
			setLiveAnnouncement(
				'Chrono Shield activated! Cosmic Focus Shield granted +20 bonus XP.',
			);
		}

		// Award Chrono Guardian badge
		awardBadge('chrono_master');
		awardXP(10);
		setAchievements(getStoredAchievements());
	}, [
		chronoFreezeUsed,
		isSubmitted,
		isTimedOut,
		timerConfig?.enabled,
		soundEnabled,
	]);

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

			// Award XP & Check Mission Badges (Double XP for Final Boss Question)
			const isBossQuestion =
				currentIndex === questions.length - 1 && questions.length >= 5;
			const xpToAward = isBossQuestion ? 30 : 15;
			awardXP(xpToAward);
			if (isBossQuestion) {
				awardBadge('boss_slayer');
			}
			if (
				timerConfig?.enabled &&
				timerConfig?.secondsPerQuestion &&
				timerConfig.secondsPerQuestion - questionTimeRemaining <= 15
			) {
				awardBadge('speed_of_light');
			}
			if (isReviewMode) {
				awardBadge('nebula_scholar');
			}
			recordAnomalyMastery(currentQuestion.id);
			setAchievements(getStoredAchievements());
		} else {
			playIncorrectSound(soundEnabled);
			recordAnomaly(currentQuestion, 'incorrect');
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

		// Award Astronaut Ranks & Badges
		awardBadge('first_launch');
		if (score === 100 && questions.length >= 5) {
			awardBadge('supernova_perfect');
		}
		if (correctCount >= 3) {
			awardBadge('stellar_streak');
		}
		awardXP(score);

		// Pure Quest Navigator: bonus for completing without any lifeline
		const usedNoLifelines =
			!cosmicClueUsed &&
			!cosmicRayUsed &&
			!telemetryScanUsed &&
			!chronoFreezeUsed;
		if (usedNoLifelines) {
			awardBadge(PURE_QUEST_BADGE_ID);
			awardXP(PURE_QUEST_XP_BONUS);
		}

		setAchievements(getStoredAchievements());

		setIsCompleted(true);
		setResultTab('overview');
		setLiveAnnouncement(
			`Quest completed! Your score is ${score} percent with ${correctCount} correct answers out of ${questions.length}.`,
		);
	};

	// Handle Skip Question
	const handleSkip = () => {
		if (isSubmitted || isTimedOut || isTimerPaused) return;

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
		setQuestionTimeRemaining(
			timerConfig.secondsPerQuestion || DEFAULT_QUESTION_TIMER_SECONDS,
		);

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

		// Move to next question if available in sequence
		if (currentIndex + 1 < questions.length) {
			const nextIdx = currentIndex + 1;
			setActiveCosmicFact(getRandomCosmicFact());
			setIsTimerPaused(true);
			setIsLoadingNextQuestion(true);

			pendingNextActionRef.current = () => {
				executeTransitionToNextQuestion(nextIdx, undefined, false);
			};

			nextQuestionTimeoutRef.current = setTimeout(() => {
				if (pendingNextActionRef.current) {
					pendingNextActionRef.current();
					pendingNextActionRef.current = null;
				}
			}, 650);
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

	// Core transition executor to complete mounting next question and resume timer
	const executeTransitionToNextQuestion = useCallback(
		(targetIndex, nextReviewQueue, isReviewFinish = false) => {
			if (isReviewFinish) {
				setIsReviewMode(false);
				setWasSkippedOnRevisit(false);
				setIsLoadingNextQuestion(false);
				setIsTimerPaused(false);
				finalizeQuest(history);
				return;
			}

			if (nextReviewQueue !== undefined) {
				setSkippedReviewQueue(nextReviewQueue);
			}
			setCurrentIndex(targetIndex);
			setSelectedOptionId(null);
			setIsSubmitted(false);
			setWasSkippedOnRevisit(false);
			setIsTimedOut(false);
			setAutoAdvanceCountdown(null);
			// Reset question-specific UI data only — lifeline used-states persist for the full quest
			setEliminatedOptionIds([]);
			setTelemetryScan(null);
			setQuestionTimeRemaining(
				timerConfig.secondsPerQuestion || DEFAULT_QUESTION_TIMER_SECONDS,
			);
			setIsLoadingNextQuestion(false);
			setIsTimerPaused(false); // Resumed when next question is loaded!
		},
		[history, timerConfig.secondsPerQuestion],
	);

	// Handle Next Question
	const handleNext = () => {
		playButtonPop(soundEnabled);
		setIsTimedOut(false);
		setAutoAdvanceCountdown(null);

		// Clear any existing pending transition timer
		if (nextQuestionTimeoutRef.current) {
			clearTimeout(nextQuestionTimeoutRef.current);
			nextQuestionTimeoutRef.current = null;
		}

		if (isReviewMode) {
			// In Review Mode: dequeue the current question from the review queue
			const remainingQueue = skippedReviewQueue.filter(
				(idx) => idx !== currentIndex,
			);

			if (remainingQueue.length > 0) {
				const nextIdx = remainingQueue[0];
				// Pause timer and enter next question loading state
				setActiveCosmicFact(getRandomCosmicFact());
				setIsTimerPaused(true);
				setIsLoadingNextQuestion(true);

				pendingNextActionRef.current = () => {
					executeTransitionToNextQuestion(nextIdx, remainingQueue, false);
				};

				nextQuestionTimeoutRef.current = setTimeout(() => {
					if (pendingNextActionRef.current) {
						pendingNextActionRef.current();
						pendingNextActionRef.current = null;
					}
				}, 650);
			} else {
				executeTransitionToNextQuestion(0, [], true);
			}
			return;
		}

		// Normal Mode
		if (currentIndex + 1 < questions.length) {
			const nextIdx = currentIndex + 1;
			// Pause timer and enter next question loading state
			setActiveCosmicFact(getRandomCosmicFact());
			setIsTimerPaused(true);
			setIsLoadingNextQuestion(true);

			pendingNextActionRef.current = () => {
				executeTransitionToNextQuestion(nextIdx, undefined, false);
			};

			nextQuestionTimeoutRef.current = setTimeout(() => {
				if (pendingNextActionRef.current) {
					pendingNextActionRef.current();
					pendingNextActionRef.current = null;
				}
			}, 650);
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
		setQuestionTimeRemaining(
			timerConfig.secondsPerQuestion || DEFAULT_QUESTION_TIMER_SECONDS,
		);
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
		setQuestionTimeRemaining(
			timerConfig.secondsPerQuestion || DEFAULT_QUESTION_TIMER_SECONDS,
		);

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
		await exportQuestSessionPdf({
			kidName,
			kidAge,
			selectedSkill,
			sheetNumber,
			scorePercent,
			correctCount,
			questions,
			timerSeconds,
			history,
		});
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

	// Render Time Warp Lightning Round Mode
	if (currentScreen === 'timewarp') {
		return (
			<Suspense fallback={<ScreenLoadingFallback />}>
				<TimeWarpMode
					onExit={() => {
						setCurrentScreen('dashboard');
						setAchievements(getStoredAchievements());
					}}
					soundEnabled={soundEnabled}
				/>
			</Suspense>
		);
	}

	// Render Skill Selection Dashboard
	if (currentScreen === 'dashboard') {
		return (
			<>
				<SkillSelectionDashboard
					profileStats={profileStats}
					onSelectSkill={handleSelectSkill}
					soundEnabled={soundEnabled}
					kidName={kidName}
					kidAge={kidAge}
					kidGender={kidGender}
					kidAvatar={kidAvatar}
					onOpenSettings={() => setCurrentScreen('settings')}
					onOpenCrewModal={() => setIsCrewModalOpen(true)}
					onStartTimeWarp={() => setCurrentScreen('timewarp')}
					onOpenObservatory={() => setIsObservatoryOpen(true)}
					onOpenPlanetarium={() => setIsPlanetariumOpen(true)}
					onOpenOdyssey={() => setIsOdysseyOpen(true)}
					onOpenHabitat={() => setIsHabitatOpen(true)}
					onOpenEducatorPortal={() => setIsEducatorPortalOpen(true)}
					onAnimationComplete={() => {
						if (!getStoredKidName() || !getStoredApiKey()) {
							setCurrentScreen('settings');
						}
					}}
					timerConfig={timerConfig}
					showVisualDiagrams={showVisualDiagrams}
					onToggleVisualDiagrams={handleToggleVisualDiagrams}
					dashboardToast={dashboardToast}
					onClearDashboardToast={() => setDashboardToast(null)}
					onUpdateSettings={handleRefreshSettingsFromStorage}
				/>

				{/* Modals triggered from Dashboard */}
				<DashboardModalsHub
					isPlanetariumOpen={isPlanetariumOpen}
					setIsPlanetariumOpen={setIsPlanetariumOpen}
					isObservatoryOpen={isObservatoryOpen}
					setIsObservatoryOpen={setIsObservatoryOpen}
					isOdysseyOpen={isOdysseyOpen}
					setIsOdysseyOpen={setIsOdysseyOpen}
					isHabitatOpen={isHabitatOpen}
					setIsHabitatOpen={setIsHabitatOpen}
					isEducatorPortalOpen={isEducatorPortalOpen}
					setIsEducatorPortalOpen={setIsEducatorPortalOpen}
					isCrewModalOpen={isCrewModalOpen}
					setIsCrewModalOpen={setIsCrewModalOpen}
					soundEnabled={soundEnabled}
					kidName={kidName}
					kidAge={kidAge}
					kidGender={kidGender}
					kidAvatar={kidAvatar}
					setKidName={setKidName}
					setKidAge={setKidAge}
					setKidGender={setKidGender}
					setKidAvatar={setKidAvatar}
					setAchievements={setAchievements}
				/>
			</>
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
				isTimerPaused={isTimerPaused}
				onToggleTimerPause={handleToggleTimerPause}
				soundEnabled={soundEnabled}
				onToggleSound={handleToggleSound}
				speechEnabled={speechEnabled}
				onToggleSpeech={handleToggleSpeech}
				onExitClick={handleOpenExitModal}
				kidName={kidName}
				kidAge={kidAge}
				kidGender={kidGender}
				kidAvatar={kidAvatar}
				onOpenCrewModal={() => setIsCrewModalOpen(true)}
				isCompleted={isCompleted}
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
					<QuestAiErrorCard
						aiError={aiError}
						soundEnabled={soundEnabled}
						onOpenSettings={() => setCurrentScreen('settings')}
						onRetry={() => handleSelectSkill(selectedSkill)}
						onBackToDashboard={() => setCurrentScreen('dashboard')}
					/>
				: !isCompleted ?
					/* Question Playing View */
					<div className='w-full flex flex-col justify-center flex-1 my-auto min-h-0 h-full'>
						{/* Loading Next Question Transition View (Timer Paused While Loading) */}
						{isLoadingNextQuestion ?
							<QuestLoadingNextView
								activeCosmicFact={activeCosmicFact}
								handleImmediateResumeAndLoadNext={handleImmediateResumeAndLoadNext}
							/>
						: !isSubmitted ?
							/* Layout when NOT submitted: Full-width layout with Question and Options side-by-side and full-width bottom Action Bar */
							<div
								onPointerDownCapture={resumeTimerIfPaused}
								className='flex flex-col justify-between gap-3 sm:gap-3.5 w-full h-full lg:max-h-[calc(100dvh-95px)] min-h-0 relative'>
								{/* Top Split Grid: Question Card on Left, Options Grid on Right (Blurred when timer is paused before submitting) */}
								<div
									className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch w-full flex-1 min-h-0 transition-all duration-300 ${
										isTimerPaused ?
											'filter blur-[16px] select-none pointer-events-none opacity-30'
										:	''
									}`}>
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
											onSelectOption={handleSelectOption}
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
											eliminatedOptionIds={eliminatedOptionIds}
											telemetryScan={telemetryScan}
										/>
									</div>
								</div>

								{/* Anti-Cheat / Screenshot Shield Overlay when timer is paused before submitting */}
								<QuestPauseShield
									isTimerPaused={isTimerPaused}
									resumeTimerIfPaused={resumeTimerIfPaused}
									soundEnabled={soundEnabled}
								/>

								{/* Quick-Access Cosmic Lifelines Console (Outside question section) */}
								<div className='flex-shrink-0 w-full'>
									<CosmicLifelinesBar
										cosmicClueUsed={cosmicClueUsed}
										onUseClue={handleUseCosmicClue}
										revealedClueIndex={revealedClueIndex}
										currentIndex={currentIndex}
										currentHint={currentQuestion?.hint}
										cosmicRayUsed={cosmicRayUsed}
										onUseCosmicRay={handleActivateCosmicRay}
										canUseCosmicRay={!isSubmitted && !isTimedOut}
										telemetryScanUsed={telemetryScanUsed}
										onUseTelemetryScan={handleActivateTelemetryScan}
										canUseTelemetryScan={!isSubmitted && !isTimedOut}
										chronoFreezeUsed={chronoFreezeUsed}
										onUseChronoFreeze={handleActivateChronoFreeze}
										canUseChronoFreeze={!isSubmitted && !isTimedOut}
										timerEnabled={timerConfig?.enabled}
										isPaused={isTimerPaused}
										soundEnabled={soundEnabled}
									/>
								</div>

								{/* Full-Width Bottom Action Bar (Skip, Center Timer, and Submit) */}
								<QuestActionBar
									isTimerPaused={isTimerPaused}
									handleSkip={handleSkip}
									timerConfig={timerConfig}
									handleToggleTimerPause={handleToggleTimerPause}
									chronoFreezeActive={chronoFreezeActive}
									questionTimeRemaining={questionTimeRemaining}
									timerSeconds={timerSeconds}
									selectedOptionId={selectedOptionId}
									handleSubmit={handleSubmit}
								/>
							</div>
						:	/* Layout when SUBMITTED / TIMED OUT: Question Card on Left, Solution Panel with NEXT button on Right */
							<QuestSubmittedSolutionView
								resumeTimerIfPaused={resumeTimerIfPaused}
								currentQuestion={currentQuestion}
								currentIndex={currentIndex}
								totalQuestions={questions.length}
								setIsZoomOpen={setIsZoomOpen}
								soundEnabled={soundEnabled}
								showVisualDiagrams={showVisualDiagrams}
								kidName={kidName}
								kidAge={kidAge}
								isReviewMode={isReviewMode}
								selectedOptionId={selectedOptionId}
								handleSelectOption={handleSelectOption}
								isTimedOut={isTimedOut}
								autoAdvanceCountdown={autoAdvanceCountdown}
								setIsAskDoubtOpen={setIsAskDoubtOpen}
								handleNext={handleNext}
								wasSkippedOnRevisit={wasSkippedOnRevisit}
								hasNextSkipped={
									isReviewMode &&
									skippedReviewQueue.filter((idx) => idx !== currentIndex).length > 0
								}
							/>
						}
					</div>
				:	/* Completion & Summary View */
					<QuestResultsView
						resultTab={resultTab}
						setResultTab={setResultTab}
						scorePercent={scorePercent}
						correctCount={correctCount}
						totalCount={questions.length}
						questions={questions}
						history={history}
						handleStartNextSheet={handleStartNextSheet}
						handleDownloadSheet={handleDownloadSheet}
						soundEnabled={soundEnabled}
						setCurrentScreen={setCurrentScreen}
						kidName={kidName}
						kidAge={kidAge}
						kidAvatar={kidAvatar}
						timerSeconds={timerSeconds}
						cosmicClueUsed={cosmicClueUsed}
						cosmicRayUsed={cosmicRayUsed}
						telemetryScanUsed={telemetryScanUsed}
						chronoFreezeUsed={chronoFreezeUsed}
						showVisualDiagrams={showVisualDiagrams}
					/>
				}
			</main>

			{/* Interactive Modals (Lazy Loaded on Demand) */}
			<QuestModalsHub
				isHintOpen={isHintOpen}
				setIsHintOpen={setIsHintOpen}
				currentQuestion={currentQuestion}
				soundEnabled={soundEnabled}
				handleActivateCosmicRay={handleActivateCosmicRay}
				cosmicRayUsed={cosmicRayUsed}
				isSubmitted={isSubmitted}
				isTimedOut={isTimedOut}
				handleActivateTelemetryScan={handleActivateTelemetryScan}
				telemetryScan={telemetryScan}
				telemetryScanUsed={telemetryScanUsed}
				handleActivateChronoFreeze={handleActivateChronoFreeze}
				chronoFreezeUsed={chronoFreezeUsed}
				eliminatedOptionIds={eliminatedOptionIds}
				timerConfig={timerConfig}
				isZoomOpen={isZoomOpen}
				setIsZoomOpen={setIsZoomOpen}
				isAskDoubtOpen={isAskDoubtOpen}
				setIsAskDoubtOpen={setIsAskDoubtOpen}
				kidAge={kidAge}
				kidName={kidName}
				isExitModalOpen={isExitModalOpen}
				setIsExitModalOpen={setIsExitModalOpen}
				handleConfirmExit={handleConfirmExit}
				currentIndex={currentIndex}
				totalQuestions={questions.length}
				selectedSkill={selectedSkill}
				isSkippedReviewPromptOpen={isSkippedReviewPromptOpen}
				handleStartSkippedReview={handleStartSkippedReview}
				handleSkipReviewAndFinish={handleSkipReviewAndFinish}
				history={history}
				isCrewModalOpen={isCrewModalOpen}
				setIsCrewModalOpen={setIsCrewModalOpen}
				isPlanetariumOpen={isPlanetariumOpen}
				setIsPlanetariumOpen={setIsPlanetariumOpen}
				isObservatoryOpen={isObservatoryOpen}
				setIsObservatoryOpen={setIsObservatoryOpen}
				isHabitatOpen={isHabitatOpen}
				setIsHabitatOpen={setIsHabitatOpen}
			/>
		</div>
	);
}
