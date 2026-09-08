import {
	AlertTriangle,
	ArrowLeft,
	Calendar,
	Check,
	Clock,
	Cpu,
	ExternalLink,
	Eye,
	EyeOff,
	FastForward,
	Key,
	Minus,
	Plus,
	RefreshCw,
	Rocket,
	RotateCcw,
	Save,
	Smile,
	Sparkles,
	Volume2,
	X,
} from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
	fetchOnlineGeminiModels,
	getAvailableGeminiModels,
	getLatestGeminiModel,
	getStoredApiKey,
	getStoredSelectedModel,
	hasCachedGeminiModels,
	setStoredApiKey,
	setStoredSelectedModel,
	validateGeminiApiKey,
} from '../../services/aiGenerator';
import {
	getAvailableVoices,
	getStoredVoiceURI,
	playButtonPop,
	setStoredVoiceURI,
	speakText,
} from '../../utils/audioSynthesis';
import {
	getStoredKidAge,
	getStoredKidName,
	getStoredShowVisualDiagrams,
	getStoredTimerConfig,
	saveStoredKidProfile,
	saveStoredShowVisualDiagrams,
	saveStoredTimerConfig,
} from '../../utils/progressTracker';

const SettingsScreen = memo(function SettingsScreen({
	onSaveAndReturn,
	onBack,
	soundEnabled = true,
	pendingSkill = null,
}) {
	const [nameInput, setNameInput] = useState(() => getStoredKidName() || '');
	const [ageInput, setAgeInput] = useState(() => getStoredKidAge() || 5);
	const [apiKeyInput, setApiKeyInput] = useState(() => getStoredApiKey() || '');
	const [showApiKey, setShowApiKey] = useState(false);
	const [isCustomAge, setIsCustomAge] = useState(false);
	const [showVisualDiagrams, setShowVisualDiagrams] = useState(
		getStoredShowVisualDiagrams,
	);

	// Gemini Model selection state
	const [selectedModel, setSelectedModel] = useState(() =>
		getStoredSelectedModel(),
	);

	// Question Timer Challenge state
	const [timerEnabled, setTimerEnabled] = useState(false);
	const [timerSeconds, setTimerSeconds] = useState(90);
	const [isCustomTimer, setIsCustomTimer] = useState(false);

	// Next Question Auto-Advance state
	const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
	const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState(7);
	const [isCustomAutoAdvance, setIsCustomAutoAdvance] = useState(false);

	const [isValidating, setIsValidating] = useState(false);
	const [error, setError] = useState('');
	const [saveSuccess, setSaveSuccess] = useState(false);

	// Dynamic Models State
	const [modelsList, setModelsList] = useState(() =>
		getAvailableGeminiModels(),
	);
	const [isFetchingModels, setIsFetchingModels] = useState(false);
	const [fetchModelStatus, setFetchModelStatus] = useState(null);

	// Voice picker state
	const [availableVoices, setAvailableVoices] = useState([]);
	const [selectedVoiceURI, setSelectedVoiceURI] = useState(
		() => getStoredVoiceURI() || '',
	);

	const [initialValues, setInitialValues] = useState(null);
	const [showUnsavedModal, setShowUnsavedModal] = useState(false);

	const quickAges = [3, 4, 5, 6, 7, 8];

	const handleFetchLiveModels = async () => {
		playButtonPop(soundEnabled);
		const targetKey = apiKeyInput.trim() || getStoredApiKey();
		if (!targetKey) {
			setFetchModelStatus({
				type: 'error',
				text: 'Please enter your Gemini API key in the field above before fetching live models.',
			});
			return;
		}

		setIsFetchingModels(true);
		setFetchModelStatus(null);
		try {
			const liveModels = await fetchOnlineGeminiModels(targetKey);
			setModelsList(liveModels);
			const latest = getLatestGeminiModel(liveModels);
			if (latest && latest.id) {
				setSelectedModel(latest.id);
				setStoredSelectedModel(latest.id);
				setInitialValues((prev) =>
					prev ? { ...prev, selectedModel: latest.id } : prev,
				);
			}
			setFetchModelStatus({
				type: 'success',
				text: `✓ Successfully refreshed ${liveModels.length} live Gemini models! Default set to "${latest?.name || latest?.id}".`,
			});
		} catch (err) {
			setFetchModelStatus({
				type: 'error',
				text:
					err.message ||
					'Could not fetch models from Google Gemini API. Please check your API key.',
			});
		} finally {
			setIsFetchingModels(false);
		}
	};

	// Auto-download latest models while loading if not yet cached
	useEffect(() => {
		// If models are already cached in localStorage, do not re-fetch on every opening
		if (hasCachedGeminiModels()) {
			return;
		}

		const targetKey = (apiKeyInput || '').trim() || getStoredApiKey();
		if (!targetKey) {
			return;
		}

		let isCancelled = false;
		const autoDownloadModelsOnMount = async () => {
			setIsFetchingModels(true);
			try {
				const liveModels = await fetchOnlineGeminiModels(targetKey);
				if (isCancelled) return;
				setModelsList(liveModels);
				const latest = getLatestGeminiModel(liveModels);
				if (latest && latest.id) {
					// Select the latest model as the default one in the downloaded list
					setSelectedModel(latest.id);
					setStoredSelectedModel(latest.id);
					setInitialValues((prev) =>
						prev ? { ...prev, selectedModel: latest.id } : prev,
					);
					setFetchModelStatus({
						type: 'success',
						text: `✓ Downloaded and cached ${liveModels.length} latest Gemini models! "${latest.name}" set as default.`,
					});
				}
			} catch (err) {
				if (isCancelled) return;
				console.warn('Auto-download models on mount failed:', err);
			} finally {
				if (!isCancelled) {
					setIsFetchingModels(false);
				}
			}
		};

		autoDownloadModelsOnMount();
		return () => {
			isCancelled = true;
		};
	}, []);

	useEffect(() => {
		const existingTimer = getStoredTimerConfig();
		const initTimerEnabled = Boolean(existingTimer.enabled);
		const initTimerSec = Number(existingTimer.secondsPerQuestion) || 90;
		const initAutoAdvanceEnabled =
			existingTimer.autoAdvanceEnabled !== undefined ?
				Boolean(existingTimer.autoAdvanceEnabled)
			:	true;
		const initAutoAdvanceSec = Number(existingTimer.autoAdvanceSeconds) || 7;
		const initName = getStoredKidName() || '';
		const initAge = Number(getStoredKidAge() || 5);
		const initApiKey = getStoredApiKey() || '';
		const initModel = getStoredSelectedModel();
		const initShowDiagrams = Boolean(getStoredShowVisualDiagrams());
		const initVoiceURI = getStoredVoiceURI() || '';

		setInitialValues({
			name: initName,
			age: initAge,
			apiKey: initApiKey,
			selectedModel: initModel,
			timerEnabled: initTimerEnabled,
			timerSeconds: initTimerSec,
			autoAdvanceEnabled: initAutoAdvanceEnabled,
			autoAdvanceSeconds: initAutoAdvanceSec,
			showVisualDiagrams: initShowDiagrams,
			selectedVoiceURI: initVoiceURI,
		});

		setNameInput(initName);
		setAgeInput(initAge);
		setApiKeyInput(initApiKey);
		setSelectedModel(initModel);
		setTimerEnabled(initTimerEnabled);
		setTimerSeconds(initTimerSec);
		setIsCustomTimer(![45, 60, 90, 120, 180].includes(initTimerSec));

		setAutoAdvanceEnabled(initAutoAdvanceEnabled);
		setAutoAdvanceSeconds(initAutoAdvanceSec);
		setIsCustomAutoAdvance(![3, 5, 7, 10, 15].includes(initAutoAdvanceSec));

		setIsCustomAge(!quickAges.includes(initAge));
		setShowVisualDiagrams(initShowDiagrams);
		setSelectedVoiceURI(initVoiceURI);

		// Load available voices — Chrome loads them async, so retry after a delay
		const loadVoices = () => {
			const voices = getAvailableVoices();
			if (voices.length > 0) {
				setAvailableVoices(voices);
			}
		};
		loadVoices();
		const voiceTimer = setTimeout(loadVoices, 500);
		return () => clearTimeout(voiceTimer);
	}, []);

	// Change detection: true if any setting differs from initial stored values
	const isDirty = useMemo(() => {
		if (!initialValues) return false;
		return (
			nameInput.trim() !== initialValues.name.trim() ||
			Number(ageInput) !== Number(initialValues.age) ||
			apiKeyInput.trim() !== initialValues.apiKey.trim() ||
			selectedModel !== initialValues.selectedModel ||
			timerEnabled !== initialValues.timerEnabled ||
			Number(timerSeconds) !== Number(initialValues.timerSeconds) ||
			autoAdvanceEnabled !== initialValues.autoAdvanceEnabled ||
			Number(autoAdvanceSeconds) !== Number(initialValues.autoAdvanceSeconds) ||
			showVisualDiagrams !== initialValues.showVisualDiagrams ||
			selectedVoiceURI !== initialValues.selectedVoiceURI
		);
	}, [
		initialValues,
		nameInput,
		ageInput,
		apiKeyInput,
		selectedModel,
		timerEnabled,
		timerSeconds,
		autoAdvanceEnabled,
		autoAdvanceSeconds,
		showVisualDiagrams,
		selectedVoiceURI,
	]);

	// Warn browser before tab close/refresh if unsaved changes exist
	useEffect(() => {
		if (!isDirty) return;
		const handleBeforeUnload = (e) => {
			e.preventDefault();
			e.returnValue = '';
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [isDirty]);

	// Intercept navigation if unsaved changes exist
	const unsavedModalRef = useRef(null);

	useEffect(() => {
		if (!showUnsavedModal) return;
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setShowUnsavedModal(false);
			} else if (e.key === 'Tab' && unsavedModalRef.current) {
				const focusableElements = unsavedModalRef.current.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
				);
				if (focusableElements.length === 0) return;
				const firstEl = focusableElements[0];
				const lastEl = focusableElements[focusableElements.length - 1];
				if (e.shiftKey && document.activeElement === firstEl) {
					e.preventDefault();
					lastEl.focus();
				} else if (!e.shiftKey && document.activeElement === lastEl) {
					e.preventDefault();
					firstEl.focus();
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [showUnsavedModal]);

	const handleAttemptLeave = () => {
		playButtonPop(soundEnabled);
		if (isDirty) {
			setShowUnsavedModal(true);
		} else if (onBack) {
			onBack();
		}
	};

	// Discard unsaved changes and revert state back to original stored values
	const handleRevertAndLeave = () => {
		playButtonPop(soundEnabled);
		if (initialValues) {
			setNameInput(initialValues.name);
			setAgeInput(initialValues.age);
			setApiKeyInput(initialValues.apiKey);
			setSelectedModel(initialValues.selectedModel);
			setTimerEnabled(initialValues.timerEnabled);
			setTimerSeconds(initialValues.timerSeconds);
			setIsCustomTimer(
				![45, 60, 90, 120, 180].includes(Number(initialValues.timerSeconds)),
			);
			setAutoAdvanceEnabled(initialValues.autoAdvanceEnabled);
			setAutoAdvanceSeconds(initialValues.autoAdvanceSeconds);
			setIsCustomAutoAdvance(
				![3, 5, 7, 10, 15].includes(Number(initialValues.autoAdvanceSeconds)),
			);
			setIsCustomAge(!quickAges.includes(Number(initialValues.age)));
			setShowVisualDiagrams(initialValues.showVisualDiagrams);
			setSelectedVoiceURI(initialValues.selectedVoiceURI);
		}
		setShowUnsavedModal(false);
		if (onBack) {
			onBack();
		}
	};

	// Save changes and proceed
	const handleSaveAndLeave = async () => {
		setShowUnsavedModal(false);
		await handleSave();
	};

	const handleQuickAgeSelect = (age) => {
		playButtonPop(soundEnabled);
		setAgeInput(age);
		setIsCustomAge(false);
		if (error) setError('');
	};

	const handleIncrementAge = (delta) => {
		playButtonPop(soundEnabled);
		const curr = parseInt(ageInput, 10) || 5;
		const nextAge = Math.min(14, Math.max(2, curr + delta));
		setAgeInput(nextAge);
		if (!quickAges.includes(nextAge)) {
			setIsCustomAge(true);
		}
	};

	const handleStepTimer = (delta) => {
		playButtonPop(soundEnabled);
		const curr = timerSeconds || 90;
		const nextSec = Math.min(300, Math.max(15, curr + delta));
		setTimerSeconds(nextSec);
	};

	const handleStepAutoAdvance = (delta) => {
		playButtonPop(soundEnabled);
		const curr = autoAdvanceSeconds || 7;
		const nextSec = Math.min(30, Math.max(2, curr + delta));
		setAutoAdvanceSeconds(nextSec);
	};

	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (isValidating) return;

		const trimmedName = nameInput.trim();
		if (!trimmedName) {
			setError('Please enter the explorer’s name! 😊');
			return;
		}

		const numAge = parseInt(ageInput, 10);
		if (!numAge || numAge < 2 || numAge > 14) {
			setError('Please select a valid age between 2 and 14 years old! 🎂');
			return;
		}

		const trimmedKey = apiKeyInput.trim();
		if (!trimmedKey) {
			setError(
				'Google Gemini API Key is mandatory for real-time AI questions! 🔑',
			);
			return;
		}

		setError('');
		setIsValidating(true);
		playButtonPop(soundEnabled);

		// Validate API Key live against the selected Gemini model
		const validationResult = await validateGeminiApiKey(
			trimmedKey,
			selectedModel,
		);

		if (!validationResult.valid) {
			setIsValidating(false);
			setError(
				validationResult.message ||
					'Invalid Google Gemini API Key. Please verify your key from Google AI Studio.',
			);
			return;
		}

		// 1. Save API Key
		setStoredApiKey(validationResult.cleanedKey);

		// 2. Save Selected Gemini Model
		setStoredSelectedModel(selectedModel);

		// 3. Save Kid Profile
		saveStoredKidProfile(trimmedName, numAge);

		// 4. Save Settings, Timer Config & Visual Diagrams Preference
		const updatedConfig = {
			enabled: timerEnabled,
			secondsPerQuestion: timerSeconds,
			autoAdvanceEnabled,
			autoAdvanceSeconds,
		};
		saveStoredTimerConfig(updatedConfig);
		saveStoredShowVisualDiagrams(showVisualDiagrams);
		setStoredVoiceURI(selectedVoiceURI || null);

		// Update initialValues to reflect newly saved state
		setInitialValues({
			name: trimmedName,
			age: numAge,
			apiKey: validationResult.cleanedKey,
			selectedModel,
			timerEnabled,
			timerSeconds,
			autoAdvanceEnabled,
			autoAdvanceSeconds,
			showVisualDiagrams,
			selectedVoiceURI: selectedVoiceURI || '',
		});

		setIsValidating(false);
		setSaveSuccess(true);

		speakText(`Settings saved for ${trimmedName}!`);

		if (onSaveAndReturn) {
			onSaveAndReturn({
				name: trimmedName,
				age: numAge,
				apiKey: validationResult.cleanedKey,
				selectedModel,
				timerConfig: updatedConfig,
				showVisualDiagrams,
			});
		}
	};

	const isKeyError =
		error &&
		(error.toLowerCase().includes('key') ||
			error.toLowerCase().includes('gemini') ||
			error.toLowerCase().includes('api'));

	const hasProfile = Boolean(getStoredKidName() && getStoredApiKey());

	return (
		<div className='min-h-screen space-background flex flex-col text-white font-sans overflow-x-hidden select-none py-4 px-3 sm:px-6'>
			{/* Top Bar Header */}
			<div className='max-w-3xl w-full mx-auto flex items-center justify-between gap-4 mb-6'>
				<div className='flex items-center gap-3'>
					{hasProfile && onBack && (
						<button
							onClick={handleAttemptLeave}
							className='p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition-all shadow-md cursor-pointer'
							title='Back to Dashboard'>
							<ArrowLeft className='w-5 h-5' />
						</button>
					)}
					<div>
						<h1 className='text-xl sm:text-2xl font-black text-white flex items-center gap-2'>
							<span>Explorer Profile & Settings</span>
							<Sparkles className='w-5 h-5 text-amber-300' />
						</h1>
						<p className='text-xs text-slate-300 font-semibold'>
							Configure child profile, Gemini API Key, AI model, and question
							pacing.
						</p>
					</div>
				</div>

				{pendingSkill && (
					<div className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black shadow'>
						<span>Ready to launch:</span>
						<span className='text-white'>{pendingSkill}</span>
					</div>
				)}
			</div>

			{/* Main Settings Form */}
			<div className='max-w-3xl w-full mx-auto bg-gradient-to-b from-[#1C1F5E]/90 via-[#141846]/95 to-[#0D1030] border-4 border-amber-400/80 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.25)] flex flex-col gap-6 backdrop-blur-md'>
				{/* Section 1: Child Name & Age */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{/* Name Card */}
					<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
						<label
							htmlFor='child-name-input'
							className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-2'>
							<Smile className='w-4 h-4 text-pink-400' />
							<span>Child's Name</span>
						</label>
						<input
							id='child-name-input'
							type='text'
							maxLength={30}
							aria-required='true'
							aria-describedby='child-name-desc'
							disabled={isValidating}
							value={nameInput}
							onChange={(e) => {
								setNameInput(e.target.value);
								if (error) setError('');
							}}
							placeholder='e.g. Leo, Maya, Alex...'
							className='w-full bg-[#0D1030] border border-pink-500/40 focus:border-pink-400 text-white font-bold text-sm sm:text-base rounded-xl px-4 py-3 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 transition-all'
						/>
						<span
							id='child-name-desc'
							className='text-[11px] text-slate-400 mt-1.5 block'>
							Used to personalize questions, voice feedback & reports.
						</span>
					</div>

					{/* Age Card */}
					<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
						<div className='flex items-center justify-between mb-2'>
							<label className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5'>
								<Calendar className='w-4 h-4 text-cyan-400' />
								<span>Child's Age</span>
							</label>
							<span className='text-xs font-black text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full'>
								{ageInput} Years Old
							</span>
						</div>

						{/* Quick Selection Pills */}
						<div
							role='group'
							aria-label='Select explorer age'
							className='grid grid-cols-3 sm:grid-cols-6 gap-1.5'>
							{quickAges.map((age) => (
								<button
									key={age}
									type='button'
									disabled={isValidating}
									aria-label={`${age} years old`}
									aria-pressed={Number(ageInput) === age && !isCustomAge}
									onClick={() => handleQuickAgeSelect(age)}
									className={`py-2 rounded-xl text-xs font-black transition-all border cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
										Number(ageInput) === age && !isCustomAge ?
											'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-md scale-105'
										:	'bg-[#0D1030] text-slate-300 border-slate-700/80 hover:bg-slate-800'
									}`}>
									{age} yo
								</button>
							))}
						</div>

						{/* Custom Age Toggle */}
						<div className='flex items-center justify-between mt-2 pt-2 border-t border-white/10'>
							<span className='text-[11px] text-slate-400'>
								Other Age (2 to 14):
							</span>
							<button
								type='button'
								disabled={isValidating}
								aria-expanded={isCustomAge}
								onClick={() => {
									playButtonPop(soundEnabled);
									setIsCustomAge((prev) => !prev);
								}}
								className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
									isCustomAge ?
										'bg-cyan-500/30 text-cyan-300 border-cyan-400'
									:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
								}`}>
								{isCustomAge ? 'Custom Stepper Active' : 'Change Age Range'}
							</button>
						</div>

						{/* Custom Age Stepper */}
						{isCustomAge && (
							<div className='flex items-center gap-2 bg-[#0D1030] border border-cyan-500/50 rounded-xl p-1.5 mt-2 animate-in fade-in duration-200'>
								<button
									type='button'
									disabled={isValidating}
									aria-label='Decrease age by 1 year'
									onClick={() => handleIncrementAge(-1)}
									className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none'>
									<Minus className='w-3.5 h-3.5' />
								</button>
								<div className='flex-1 text-center'>
									<input
										id='custom-age-input'
										aria-label='Custom age in years'
										type='number'
										min={2}
										max={14}
										disabled={isValidating}
										value={ageInput}
										onChange={(e) => {
											const val = parseInt(e.target.value, 10);
											setAgeInput(isNaN(val) ? '' : val);
											if (error) setError('');
										}}
										className='w-full bg-transparent text-center text-base font-black text-cyan-300 focus:outline-none'
									/>
									<span className='text-[10px] text-slate-400 block -mt-1'>
										(Ages 2 to 14)
									</span>
								</div>
								<button
									type='button'
									disabled={isValidating}
									aria-label='Increase age by 1 year'
									onClick={() => handleIncrementAge(1)}
									className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none'>
									<Plus className='w-3.5 h-3.5' />
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Section 2: Google Gemini API Key (Mandatory with Live Validation) */}
				<div
					className={`bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-inner ${
						isKeyError ?
							'border-rose-500 ring-2 ring-rose-400/40 animate-shake'
						:	'border-amber-400/60'
					}`}>
					<div className='flex items-center justify-between mb-2'>
						<label
							htmlFor='gemini-api-key-input'
							className='text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5'>
							<Key className='w-4 h-4 text-amber-400' />
							<span>
								Google Gemini API Key{' '}
								<span className='text-rose-400'>* (Mandatory)</span>
							</span>
						</label>
						<a
							href='https://aistudio.google.com/app/apikey'
							target='_blank'
							rel='noopener noreferrer'
							className='text-xs font-bold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded'>
							<span>Get Free Key from Google</span>
							<ExternalLink className='w-3.5 h-3.5' />
						</a>
					</div>

					<div className='relative flex items-center'>
						<input
							id='gemini-api-key-input'
							aria-required='true'
							aria-describedby='api-key-desc'
							type={showApiKey ? 'text' : 'password'}
							disabled={isValidating}
							value={apiKeyInput}
							onChange={(e) => {
								setApiKeyInput(e.target.value);
								if (error) setError('');
							}}
							placeholder='Paste your Gemini API key here (AIzaSy...)'
							className={`w-full bg-[#0D1030] border text-white font-mono text-xs sm:text-sm rounded-xl pl-4 pr-12 py-3 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all ${
								isKeyError ?
									'border-rose-400 focus:border-rose-500'
								:	'border-amber-400/50 focus:border-amber-400'
							}`}
						/>
						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setShowApiKey((prev) => !prev);
							}}
							aria-label={showApiKey ? 'Hide API Key' : 'Show API Key'}
							aria-pressed={showApiKey}
							className='absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none'
							title={showApiKey ? 'Hide API Key' : 'Show API Key'}>
							{showApiKey ?
								<EyeOff className='w-4 h-4 text-amber-400' />
							:	<Eye className='w-4 h-4' />}
						</button>
					</div>
					<span
						id='api-key-desc'
						className='text-[11px] text-slate-400 mt-1.5 block'>
						Required for 100% real-time AI generation. Validated live with
						Google Gemini API upon saving.
					</span>
				</div>

				{/* Section 3: Gemini AI Model Engine Selection */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-cyan-500/40 shadow-inner'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5'>
						<div className='flex items-center gap-2'>
							<Cpu className='w-4 h-4 text-cyan-400' />
							<span className='text-xs sm:text-sm font-bold text-white'>
								Gemini AI Model Engine
							</span>
						</div>
						<div className='flex items-center gap-2 flex-wrap'>
							{hasCachedGeminiModels() && !isFetchingModels && (
								<span
									className='text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-1'
									title='Models are cached locally and loaded instantly without re-fetching'>
									⚡ Cached
								</span>
							)}
							<button
								type='button'
								disabled={isFetchingModels || isValidating}
								onClick={handleFetchLiveModels}
								className='flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-[11px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50'>
								<RefreshCw
									className={`w-3.5 h-3.5 ${
										isFetchingModels ? 'animate-spin text-cyan-200' : ''
									}`}
								/>
								<span>
									{isFetchingModels ?
										'Downloading Models...'
									:	'Fetch Latest Models 🔄'}
								</span>
							</button>
							<span className='text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
								Active:{' '}
								{modelsList.find((m) => m.id === selectedModel)?.name ||
									selectedModel}
							</span>
						</div>
					</div>

					<p className='text-xs text-slate-300 mb-2'>
						Select which Google Gemini AI model generates questions in real
						time:
					</p>

					{fetchModelStatus && (
						<div
							className={`mb-3 p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between gap-2 ${
								fetchModelStatus.type === 'success' ?
									'bg-emerald-500/20 border-emerald-400 text-emerald-200'
								:	'bg-rose-500/20 border-rose-400 text-rose-200'
							}`}>
							<span>{fetchModelStatus.text}</span>
							<button
								type='button'
								onClick={() => setFetchModelStatus(null)}
								className='text-slate-400 hover:text-white text-xs font-black cursor-pointer px-1'>
								✕
							</button>
						</div>
					)}

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1'>
						{modelsList.map((model) => {
							const isSelected = selectedModel === model.id;
							return (
								<button
									key={model.id}
									type='button'
									disabled={isValidating || isFetchingModels}
									onClick={() => {
										playButtonPop(soundEnabled);
										setSelectedModel(model.id);
										if (error) setError('');
									}}
									className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col justify-between gap-1.5 ${
										isSelected ?
											'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/50'
										:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
									}`}>
									<div className='flex items-center justify-between gap-2'>
										<span
											className={`text-xs font-black ${
												isSelected ? 'text-cyan-300' : 'text-white'
											}`}>
											{model.name}
										</span>
										<span
											className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
											{model.badge}
										</span>
									</div>
									<div className='text-[11px] font-bold text-slate-300 flex items-center gap-1'>
										<span>{model.tag}</span>
									</div>
									<p className='text-[10px] text-slate-400 leading-snug'>
										{model.description}
									</p>
									{isSelected && (
										<div className='absolute top-3 right-3 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow'>
											<Check className='w-3 h-3 stroke-[3]' />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Section 4: Per-Question Time Limit */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
					<div className='flex items-center justify-between mb-2.5'>
						<div>
							<div className='flex items-center gap-2'>
								<Clock className='w-4 h-4 text-cyan-400' />
								<span className='text-xs sm:text-sm font-bold text-white'>
									Per-Question Time Limit
								</span>
								<span
									className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
										timerEnabled ?
											'bg-amber-400 text-slate-950 shadow'
										:	'bg-slate-800 text-slate-400'
									}`}>
									{timerEnabled ? 'Enabled' : 'Optional'}
								</span>
							</div>
							<p className='text-xs text-slate-400 mt-0.5'>
								Sets a countdown challenge for each individual question.
							</p>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setTimerEnabled((prev) => !prev);
							}}
							className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								timerEnabled ?
									'bg-amber-400 text-slate-950 border-amber-300 shadow'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{timerEnabled ? '⏱️ Timer ON' : 'Timer OFF'}
						</button>
					</div>

					{timerEnabled && (
						<div className='space-y-3 pt-2 animate-in fade-in duration-200 border-t border-white/10'>
							<div className='flex items-center gap-1.5 flex-wrap'>
								{[
									{ label: '45s', sec: 45 },
									{ label: '60s', sec: 60 },
									{ label: '90s (Default)', sec: 90 },
									{ label: '2m', sec: 120 },
									{ label: '3m', sec: 180 },
								].map((preset) => (
									<button
										key={preset.sec}
										type='button'
										disabled={isValidating}
										onClick={() => {
											playButtonPop(soundEnabled);
											setTimerSeconds(preset.sec);
											setIsCustomTimer(false);
										}}
										className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
											timerSeconds === preset.sec && !isCustomTimer ?
												'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-300 shadow-md font-black'
											:	'bg-[#0D1030] text-slate-300 border-slate-700 hover:bg-slate-800'
										}`}>
										{preset.label}
									</button>
								))}

								<button
									type='button'
									disabled={isValidating}
									onClick={() => {
										playButtonPop(soundEnabled);
										setIsCustomTimer((prev) => !prev);
									}}
									className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
										isCustomTimer ?
											'bg-amber-400/30 text-amber-300 border-amber-400'
										:	'bg-[#0D1030] text-slate-400 border-slate-700 hover:text-white'
									}`}>
									Custom Duration
								</button>
							</div>

							{isCustomTimer && (
								<div className='flex items-center gap-3 bg-[#0D1030] border border-amber-500/40 rounded-xl p-2 max-w-xs animate-in fade-in duration-200'>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepTimer(-15)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Minus className='w-4 h-4' />
									</button>
									<div className='flex-1 text-center font-mono font-black text-sm text-amber-300'>
										{timerSeconds} seconds
									</div>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepTimer(15)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Plus className='w-4 h-4' />
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Section 5: Next Question Auto-Advance Delay */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
					<div className='flex items-center justify-between mb-2.5'>
						<div>
							<div className='flex items-center gap-2'>
								<FastForward className='w-4 h-4 text-emerald-400' />
								<span className='text-xs sm:text-sm font-bold text-white'>
									Next Question Auto-Advance
								</span>
								<span
									className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
										autoAdvanceEnabled ?
											'bg-emerald-400 text-slate-950 shadow'
										:	'bg-slate-800 text-slate-400'
									}`}>
									{autoAdvanceEnabled ? 'Auto-Next Active' : 'Manual Next'}
								</span>
							</div>
							<p className='text-xs text-slate-400 mt-0.5'>
								Controls how long the solution is displayed before moving to the
								next question.
							</p>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setAutoAdvanceEnabled((prev) => !prev);
							}}
							className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								autoAdvanceEnabled ?
									'bg-emerald-400 text-slate-950 border-emerald-300 shadow'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{autoAdvanceEnabled ? '⏩ Auto Next ON' : 'Manual Next'}
						</button>
					</div>

					{!autoAdvanceEnabled && (
						<div className='p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-semibold'>
							💡 <strong>Manual Next Mode:</strong> The solution stays on screen
							indefinitely until you click <em>Next Question ➔</em>.
						</div>
					)}

					{autoAdvanceEnabled && (
						<div className='space-y-3 pt-2 animate-in fade-in duration-200 border-t border-white/10'>
							<div className='flex items-center gap-1.5 flex-wrap'>
								{[
									{ label: '3s', sec: 3 },
									{ label: '5s', sec: 5 },
									{ label: '7s (Default)', sec: 7 },
									{ label: '10s', sec: 10 },
									{ label: '15s', sec: 15 },
								].map((preset) => (
									<button
										key={preset.sec}
										type='button'
										disabled={isValidating}
										onClick={() => {
											playButtonPop(soundEnabled);
											setAutoAdvanceSeconds(preset.sec);
											setIsCustomAutoAdvance(false);
										}}
										className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
											(
												autoAdvanceSeconds === preset.sec &&
												!isCustomAutoAdvance
											) ?
												'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 border-emerald-300 shadow-md font-black'
											:	'bg-[#0D1030] text-slate-300 border-slate-700 hover:bg-slate-800'
										}`}>
										{preset.label}
									</button>
								))}

								<button
									type='button'
									disabled={isValidating}
									onClick={() => {
										playButtonPop(soundEnabled);
										setIsCustomAutoAdvance((prev) => !prev);
									}}
									className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
										isCustomAutoAdvance ?
											'bg-emerald-400/30 text-emerald-300 border-emerald-400'
										:	'bg-[#0D1030] text-slate-400 border-slate-700 hover:text-white'
									}`}>
									Custom Delay
								</button>
							</div>

							{isCustomAutoAdvance && (
								<div className='flex items-center gap-3 bg-[#0D1030] border border-emerald-500/40 rounded-xl p-2 max-w-xs animate-in fade-in duration-200'>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepAutoAdvance(-1)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Minus className='w-4 h-4' />
									</button>
									<div className='flex-1 text-center font-mono font-black text-sm text-emerald-300'>
										{autoAdvanceSeconds} seconds delay
									</div>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepAutoAdvance(1)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Plus className='w-4 h-4' />
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Section 6: Visual Diagrams & Clues Display */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-indigo-500/40 shadow-inner'>
					<div className='flex items-center justify-between mb-2'>
						<div className='flex items-center gap-2'>
							<Eye className='w-4 h-4 text-indigo-400' />
							<span className='text-xs sm:text-sm font-bold text-white'>
								Visual Diagrams & Clues
							</span>
							<span
								className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
									showVisualDiagrams ?
										'bg-indigo-500 text-white shadow'
									:	'bg-slate-800 text-slate-400'
								}`}>
								{showVisualDiagrams ? 'Enabled' : 'Disabled'}
							</span>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setShowVisualDiagrams((prev) => !prev);
							}}
							className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								showVisualDiagrams ?
									'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{showVisualDiagrams ? '👁️ Shown' : '🙈 Hidden'}
						</button>
					</div>

					<p className='text-xs text-slate-300 leading-relaxed'>
						Choose whether interactive visual diagrams, 3x3 matrices, sequence
						patterns, and STEM illustrations appear alongside questions and
						option choices.
					</p>

					{/* Warning Notice for Dynamic Visual Generation */}
					<div className='mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5'>
						<AlertTriangle className='w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5' />
						<div className='leading-relaxed'>
							<span className='font-bold text-amber-300'>
								Note on Dynamic Visual Generation:
							</span>{' '}
							Visual diagrams and option shapes are dynamically synthesized
							based on algorithmic models and AI prompts. Occasional visual
							discrepancies or slight mismatches between the text and rendered
							shapes may occur.
						</div>
					</div>
				</div>

				{/* Section 7: Narrator Voice */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-purple-500/40 shadow-inner'>
					<div className='flex items-center gap-2 mb-2'>
						<Volume2 className='w-4 h-4 text-purple-400' />
						<span className='text-xs sm:text-sm font-bold text-white'>
							Narrator Voice
						</span>
						{selectedVoiceURI && (
							<span className='text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/40 truncate max-w-[160px]'>
								{availableVoices.find((v) => v.voiceURI === selectedVoiceURI)
									?.name || 'Custom'}
							</span>
						)}
					</div>
					<p className='text-xs text-slate-300 mb-3'>
						Choose the voice used when reading questions aloud. Only one voice
						speaks at a time.
					</p>

					{availableVoices.length === 0 ?
						<div className='text-xs text-slate-400 font-semibold p-3 rounded-xl bg-slate-800/60 border border-slate-700'>
							⚠️ No voices available yet. Try clicking the speaker icon on a
							question to trigger voice loading, then reopen Settings.
						</div>
					:	<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1'>
							{/* Default / Auto option */}
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setSelectedVoiceURI('');
								}}
								className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
									!selectedVoiceURI ?
										'bg-purple-500/20 border-purple-400 ring-2 ring-purple-400/40'
									:	'bg-[#0D1030] border-slate-700 hover:border-slate-500'
								}`}>
								<div
									className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${
										!selectedVoiceURI ?
											'bg-purple-400 border-purple-300'
										:	'bg-transparent border-slate-500'
									}`}
								/>
								<div className='min-w-0'>
									<div className='text-xs font-black text-white'>
										Auto (Recommended)
									</div>
									<div className='text-[10px] text-slate-400'>
										Best available English voice
									</div>
								</div>
							</button>

							{availableVoices.map((voice) => {
								const isSelected = selectedVoiceURI === voice.voiceURI;
								return (
									<button
										key={voice.voiceURI}
										type='button'
										onClick={() => {
											playButtonPop(soundEnabled);
											setSelectedVoiceURI(voice.voiceURI);
											// Live preview of the voice
											speakText(
												'Hello! I am ready to read questions for you.',
												null,
												null,
											);
										}}
										className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
											isSelected ?
												'bg-purple-500/20 border-purple-400 ring-2 ring-purple-400/40'
											:	'bg-[#0D1030] border-slate-700 hover:border-slate-500'
										}`}>
										<div
											className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${
												isSelected ?
													'bg-purple-400 border-purple-300'
												:	'bg-transparent border-slate-500'
											}`}
										/>
										<div className='min-w-0'>
											<div
												className={`text-xs font-black truncate ${
													isSelected ? 'text-purple-200' : 'text-white'
												}`}>
												{voice.name}
											</div>
											<div className='text-[10px] text-slate-400 truncate'>
												{voice.lang}
												{voice.localService ? ' · Local' : ' · Network'}
											</div>
										</div>
									</button>
								);
							})}
						</div>
					}
				</div>

				{/* Error Alert */}

				{error && (
					<div
						role='alert'
						aria-live='assertive'
						className='bg-rose-500/20 border border-rose-500/50 rounded-2xl p-4 text-xs sm:text-sm font-bold text-rose-200 text-center animate-shake shadow-lg'>
						⚠️ {error}
					</div>
				)}

				{/* Save / Launch Action Bar */}
				<div className='flex flex-col sm:flex-row gap-3 items-center justify-end pt-2 border-t border-white/10'>
					{hasProfile && onBack && (
						<button
							type='button'
							disabled={isValidating}
							onClick={handleAttemptLeave}
							className='w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400'>
							Cancel
						</button>
					)}

					<button
						type='button'
						disabled={isValidating}
						onClick={handleSave}
						className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2.5 focus-visible:ring-4 focus-visible:ring-amber-400 ${
							isValidating ?
								'bg-gradient-to-r from-amber-600 via-pink-600 to-purple-700 opacity-90 cursor-wait animate-pulse text-white'
							:	'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-95 text-white hover:scale-105 active:scale-95 cursor-pointer'
						}`}>
						{isValidating ?
							<>
								<Sparkles className='w-5 h-5 text-amber-300 animate-spin' />
								<span>Validating Key with Gemini... ⏳</span>
							</>
						: pendingSkill ?
							<>
								<Rocket className='w-5 h-5 text-amber-300' />
								<span>Save & Launch {pendingSkill} 🚀</span>
							</>
						:	<>
								<Check className='w-5 h-5 stroke-[3]' />
								<span>Save Settings 🚀</span>
							</>
						}
					</button>
				</div>
			</div>

			{/* Unsaved Changes Confirmation Modal */}
			{showUnsavedModal && (
				<div
					role='dialog'
					aria-modal='true'
					aria-labelledby='unsaved-modal-title'
					aria-describedby='unsaved-modal-desc'
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200'>
					<div
						ref={unsavedModalRef}
						tabIndex={-1}
						className='bg-[#131642] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(251,191,36,0.35)] text-center animate-in zoom-in-95 duration-200 relative focus:outline-none'>
						{/* Close icon button */}
						<button
							type='button'
							aria-label='Close unsaved changes dialog'
							onClick={() => {
								playButtonPop(soundEnabled);
								setShowUnsavedModal(false);
							}}
							className='absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400'
							title='Close'>
							<X className='w-5 h-5' />
						</button>

						<div
							aria-hidden='true'
							className='w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-300'>
							<AlertTriangle className='w-8 h-8' />
						</div>

						<h2
							id='unsaved-modal-title'
							className='text-xl sm:text-2xl font-black text-white mb-2'>
							Unsaved Changes Detected! ⚠️
						</h2>

						<p
							id='unsaved-modal-desc'
							className='text-xs sm:text-sm text-slate-300 font-semibold mb-6 leading-relaxed'>
							You modified your settings without saving. Please save your
							settings before navigating, or your changes will be discarded and
							reverted back to the previous values.
						</p>

						<div className='flex flex-col gap-3'>
							{/* 1. Save & Continue */}
							<button
								type='button'
								onClick={handleSaveAndLeave}
								className='w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-95 text-white font-black text-sm sm:text-base tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-400'>
								<Save className='w-4 h-4' />
								<span>Save Settings & Continue 💾</span>
							</button>

							{/* 2. Discard & Revert */}
							<button
								type='button'
								onClick={handleRevertAndLeave}
								className='w-full py-3.5 px-5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-200 hover:text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-rose-400'>
								<RotateCcw className='w-4 h-4 text-rose-300' />
								<span>Discard Changes & Revert ↩️</span>
							</button>

							{/* 3. Keep Editing */}
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setShowUnsavedModal(false);
								}}
								className='w-full py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400'>
								Keep Editing
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});

export default SettingsScreen;
