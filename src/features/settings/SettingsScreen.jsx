import {
	AlertTriangle,
	ArrowLeft,
	Calendar,
	Check,
	Clock,
	Cpu,
	Download,
	ExternalLink,
	Eye,
	FastForward,
	Key,
	Lock,
	Minus,
	Plus,
	RefreshCw,
	Rocket,
	RotateCcw,
	Save,
	ShieldAlert,
	Smile,
	Sparkles,
	Upload,
	Users,
	Volume2,
	X,
} from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
	DEFAULT_QUESTION_TIMER_SECONDS,
	isTimerMandatoryForAge,
} from '../../constants';
import {
	AI_PROVIDER_INFO,
	AI_PROVIDERS,
	decryptApiKey,
	encryptApiKey,
	fetchOnlineGeminiModels,
	getActiveAiProvider,
	getAvailableModels,
	getLatestGeminiModel,
	getStoredApiKey,
	getStoredEncryptedApiKey,
	getStoredSelectedModel,
	hasCachedGeminiModels,
	isModelRateLimited,
	setActiveAiProvider,
	setStoredApiKey,
	setStoredSelectedModel,
	validateApiKey,
} from '../../services/aiGenerator';
import {
	getStoredAmbientEnabled,
	getStoredAmbientVolume,
	isAmbientSoundPlaying,
	setAmbientVolume,
	setStoredAmbientEnabled,
	setStoredAmbientVolume,
	startAmbientSound,
	stopAmbientSound,
} from '../../utils/ambientAudio';
import {
	COSMIC_VOICE_PERSONALITIES,
	getAvailableVoices,
	getStoredVoicePersonality,
	getStoredVoiceURI,
	playButtonPop,
	setStoredVoicePersonality,
	setStoredVoiceURI,
	speakText,
} from '../../utils/audioSynthesis';
import {
	getAvatarById,
	getDefaultAvatarForGender,
	KidAvatar,
	PRESET_AVATARS,
} from '../../utils/avatarManager';
import {
	exportFullBackupToJsonFile,
	importFullBackupFromJson,
} from '../../utils/backupManager';
import {
	getActiveCrewId,
	getAllCrewMembers,
	switchActiveCrewMember,
} from '../../utils/crewManager';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidGender,
	getStoredKidName,
	getStoredShowVisualDiagrams,
	getStoredTimerConfig,
	saveStoredKidProfile,
	saveStoredShowVisualDiagrams,
	saveStoredTimerConfig,
} from '../../utils/progressTracker';
import CrewSwitcherModal from '../dashboard/CrewSwitcherModal';

const SettingsScreen = memo(function SettingsScreen({
	onSaveAndReturn,
	onBack,
	soundEnabled = true,
	pendingSkill = null,
}) {
	const [nameInput, setNameInput] = useState(() => getStoredKidName() || '');
	const [ageInput, setAgeInput] = useState(() => getStoredKidAge() || 5);
	const [genderInput, setGenderInput] = useState(
		() => getStoredKidGender() || 'boy',
	);
	const [avatarInput, setAvatarInput] = useState(
		() => getStoredKidAvatar() || 'boy-astronaut-1',
	);
	const [avatarCategoryFilter, setAvatarCategoryFilter] = useState('All');
	// Multi-Provider AI State
	const [selectedProvider, setSelectedProvider] = useState(
		() => getActiveAiProvider() || AI_PROVIDERS.GEMINI,
	);
	const [providerKeys, setProviderKeys] = useState(() => ({
		[AI_PROVIDERS.GEMINI]: getStoredEncryptedApiKey(AI_PROVIDERS.GEMINI) || '',
		[AI_PROVIDERS.OPENAI]: getStoredEncryptedApiKey(AI_PROVIDERS.OPENAI) || '',
		[AI_PROVIDERS.CLAUDE]: getStoredEncryptedApiKey(AI_PROVIDERS.CLAUDE) || '',
	}));
	const [providerModels, setProviderModels] = useState(() => ({
		[AI_PROVIDERS.GEMINI]: getStoredSelectedModel(AI_PROVIDERS.GEMINI),
		[AI_PROVIDERS.OPENAI]: getStoredSelectedModel(AI_PROVIDERS.OPENAI),
		[AI_PROVIDERS.CLAUDE]: getStoredSelectedModel(AI_PROVIDERS.CLAUDE),
	}));

	const [apiKeyInput, setApiKeyInput] = useState(
		() =>
			getStoredEncryptedApiKey(getActiveAiProvider() || AI_PROVIDERS.GEMINI) ||
			'',
	);
	// API Key security & auto-masking state
	const [isRevealed, setIsRevealed] = useState(false);
	const [copyBlockedMessage, setCopyBlockedMessage] = useState(false);
	const revealTimeoutRef = useRef(null);
	const copyBlockedTimeoutRef = useRef(null);

	const triggerRevealTimer = () => {
		if (revealTimeoutRef.current) {
			clearTimeout(revealTimeoutRef.current);
		}
		setIsRevealed(true);
		revealTimeoutRef.current = setTimeout(() => {
			setIsRevealed(false);
			setApiKeyInput((curr) => {
				if (curr && !curr.startsWith('enc:v1:')) {
					return encryptApiKey(curr);
				}
				return curr;
			});
		}, 3000);
	};

	const showCopyBlockedTooltip = () => {
		if (copyBlockedTimeoutRef.current) {
			clearTimeout(copyBlockedTimeoutRef.current);
		}
		setCopyBlockedMessage(true);
		copyBlockedTimeoutRef.current = setTimeout(() => {
			setCopyBlockedMessage(false);
		}, 3000);
	};

	const handlePasteKey = (e) => {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text')?.trim() || '';
		if (!pasted) return;

		// Immediately convert to encrypted string so plaintext is never exposed in the field
		const encrypted = encryptApiKey(pasted);
		setApiKeyInput(encrypted);
		setProviderKeys((prev) => ({ ...prev, [selectedProvider]: encrypted }));
		if (error) setError('');
		triggerRevealTimer();
	};

	const handleKeyChange = (e) => {
		const val = e.target.value;
		if (error) setError('');

		if (!val) {
			setApiKeyInput('');
			setProviderKeys((prev) => ({ ...prev, [selectedProvider]: '' }));
			return;
		}

		// User is typing/editing: reveal text while actively typing
		triggerRevealTimer();

		if (val.startsWith('enc:v1:')) {
			setApiKeyInput(val);
			setProviderKeys((prev) => ({ ...prev, [selectedProvider]: val }));
			return;
		}

		setApiKeyInput(val);
		setProviderKeys((prev) => ({ ...prev, [selectedProvider]: val }));
	};

	const handleKeyBlur = () => {
		// When user leaves the field, ensure any plaintext typed value is converted to encrypted payload
		if (apiKeyInput && !apiKeyInput.startsWith('enc:v1:')) {
			const encrypted = encryptApiKey(apiKeyInput);
			setApiKeyInput(encrypted);
			setProviderKeys((prev) => ({ ...prev, [selectedProvider]: encrypted }));
		}
	};

	const handleBlockCopy = (e) => {
		e.preventDefault();
		showCopyBlockedTooltip();
	};

	const handleKeyDownKey = (e) => {
		// Intercept copy and cut shortcuts (Ctrl+C, Cmd+C, Ctrl+X, Cmd+X)
		if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'x', 'X'].includes(e.key)) {
			e.preventDefault();
			showCopyBlockedTooltip();
		}
	};

	useEffect(() => {
		return () => {
			if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
			if (copyBlockedTimeoutRef.current)
				clearTimeout(copyBlockedTimeoutRef.current);
		};
	}, []);
	const [isCustomAge, setIsCustomAge] = useState(false);
	const [showVisualDiagrams, setShowVisualDiagrams] = useState(
		getStoredShowVisualDiagrams,
	);

	// Active AI Model selection state
	const [selectedModel, setSelectedModel] = useState(() =>
		getStoredSelectedModel(getActiveAiProvider() || AI_PROVIDERS.GEMINI),
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
		getAvailableModels(getActiveAiProvider() || AI_PROVIDERS.GEMINI),
	);
	const [isFetchingModels, setIsFetchingModels] = useState(false);
	const [fetchModelStatus, setFetchModelStatus] = useState(null);

	// Provider Switch Handler
	const handleSelectProvider = (prov) => {
		playButtonPop(soundEnabled);
		if (prov === selectedProvider) return;

		// Persist in-progress state for current provider
		const currentKey = apiKeyInput;
		const updatedKeys = {
			...providerKeys,
			[selectedProvider]: currentKey,
		};
		const updatedModels = {
			...providerModels,
			[selectedProvider]: selectedModel,
		};
		setProviderKeys(updatedKeys);
		setProviderModels(updatedModels);

		setSelectedProvider(prov);
		const newKey = updatedKeys[prov] || '';
		setApiKeyInput(newKey);
		const newModels = getAvailableModels(prov);
		setModelsList(newModels);
		const newSelectedModel =
			updatedModels[prov] ||
			newModels[0]?.id ||
			AI_PROVIDER_INFO[prov]?.defaultModel ||
			'';
		setSelectedModel(newSelectedModel);
		if (error) setError('');
		setIsRevealed(false);
	};

	// Voice personality & Ambient audio state
	const [selectedPersonality, setSelectedPersonality] = useState(
		() => getStoredVoicePersonality() || 'classic',
	);
	const [ambientAudioEnabled, setAmbientAudioEnabled] = useState(() =>
		getStoredAmbientEnabled(),
	);
	const [ambientAudioVolume, setAmbientAudioVolume] = useState(() =>
		getStoredAmbientVolume(),
	);
	// Voice picker state
	const [availableVoices, setAvailableVoices] = useState([]);
	const [selectedVoiceURI, setSelectedVoiceURI] = useState(
		() => getStoredVoiceURI() || '',
	);

	const [initialValues, setInitialValues] = useState(null);
	const [showUnsavedModal, setShowUnsavedModal] = useState(false);
	const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
	const [crewMembers, setCrewMembers] = useState(() => getAllCrewMembers());

	// Cross-Device Backup & Restore State
	const backupFileInputRef = useRef(null);
	const [backupStatus, setBackupStatus] = useState(null);

	const quickAges = [3, 4, 5, 6, 7, 8];

	const filteredAvatars = useMemo(() => {
		if (avatarCategoryFilter === 'All') return PRESET_AVATARS;
		return PRESET_AVATARS.filter((a) => a.category === avatarCategoryFilter);
	}, [avatarCategoryFilter]);

	const handleGenderSelect = (newGender) => {
		playButtonPop(soundEnabled);
		setGenderInput(newGender);
		const defaultAv = getDefaultAvatarForGender(newGender);
		setAvatarInput(defaultAv);
		if (error) setError('');
	};

	const handleAvatarSelect = (avatarId) => {
		playButtonPop(soundEnabled);
		setAvatarInput(avatarId);
		if (error) setError('');
	};

	const handleExportBackup = () => {
		playButtonPop(soundEnabled);
		try {
			exportFullBackupToJsonFile();
			setBackupStatus({
				type: 'success',
				text: '✓ Downloaded complete configuration and skillsets backup JSON!',
			});
			setTimeout(() => setBackupStatus(null), 4000);
		} catch (err) {
			setBackupStatus({
				type: 'error',
				text: `Export failed: ${err.message}`,
			});
			setTimeout(() => setBackupStatus(null), 4000);
		}
	};

	const handleTriggerImportBackup = () => {
		playButtonPop(soundEnabled);
		if (backupFileInputRef.current) {
			backupFileInputRef.current.value = '';
			backupFileInputRef.current.click();
		}
	};

	const handleBackupFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const result = importFullBackupFromJson(event.target?.result);
				const newKidName = getStoredKidName() || '';
				const newKidAge = Number(getStoredKidAge() || 5);
				const newKidGender = getStoredKidGender() || 'boy';
				const newKidAvatar =
					getStoredKidAvatar() || getDefaultAvatarForGender(newKidGender);
				const newActiveProv =
					result.settings?.activeAiProvider ||
					getActiveAiProvider() ||
					AI_PROVIDERS.GEMINI;
				const newEncryptedKey = getStoredEncryptedApiKey(newActiveProv) || '';
				const newModel = getStoredSelectedModel(newActiveProv);
				const newProviderKeys = {
					[AI_PROVIDERS.GEMINI]:
						getStoredEncryptedApiKey(AI_PROVIDERS.GEMINI) || '',
					[AI_PROVIDERS.OPENAI]:
						getStoredEncryptedApiKey(AI_PROVIDERS.OPENAI) || '',
					[AI_PROVIDERS.CLAUDE]:
						getStoredEncryptedApiKey(AI_PROVIDERS.CLAUDE) || '',
				};
				const newProviderModels = {
					[AI_PROVIDERS.GEMINI]: getStoredSelectedModel(AI_PROVIDERS.GEMINI),
					[AI_PROVIDERS.OPENAI]: getStoredSelectedModel(AI_PROVIDERS.OPENAI),
					[AI_PROVIDERS.CLAUDE]: getStoredSelectedModel(AI_PROVIDERS.CLAUDE),
				};
				const newTimerConfig = getStoredTimerConfig();
				const newTimerSec = Number(newTimerConfig.secondsPerQuestion) || 90;
				const newAutoAdvanceSec =
					Number(newTimerConfig.autoAdvanceSeconds) || 7;
				const newShowDiagrams = Boolean(getStoredShowVisualDiagrams());
				const newVoiceURI = getStoredVoiceURI() || '';

				setNameInput(newKidName);
				setAgeInput(newKidAge);
				setGenderInput(newKidGender);
				setAvatarInput(newKidAvatar);
				setSelectedProvider(newActiveProv);
				setProviderKeys(newProviderKeys);
				setProviderModels(newProviderModels);
				setModelsList(getAvailableModels(newActiveProv));
				setApiKeyInput(newEncryptedKey);
				setSelectedModel(newModel);
				setTimerEnabled(Boolean(newTimerConfig.enabled));
				setTimerSeconds(newTimerSec);
				setIsCustomTimer(![45, 60, 90, 120, 180].includes(newTimerSec));
				setAutoAdvanceEnabled(newTimerConfig.autoAdvanceEnabled !== false);
				setAutoAdvanceSeconds(newAutoAdvanceSec);
				setIsCustomAutoAdvance(![3, 5, 7, 10, 15].includes(newAutoAdvanceSec));
				setIsCustomAge(!quickAges.includes(newKidAge));
				setShowVisualDiagrams(newShowDiagrams);
				setSelectedVoiceURI(newVoiceURI);

				setInitialValues({
					name: newKidName,
					age: newKidAge,
					gender: newKidGender,
					avatar: newKidAvatar,
					selectedProvider: newActiveProv,
					apiKey: newEncryptedKey,
					providerKeys: newProviderKeys,
					providerModels: newProviderModels,
					selectedModel: newModel,
					timerEnabled: Boolean(newTimerConfig.enabled),
					timerSeconds: newTimerSec,
					autoAdvanceEnabled: newTimerConfig.autoAdvanceEnabled !== false,
					autoAdvanceSeconds: newAutoAdvanceSec,
					showVisualDiagrams: newShowDiagrams,
					selectedVoiceURI: newVoiceURI,
				});

				playButtonPop(soundEnabled);
				const toastNotice =
					result.importedSettings ?
						`✓ Successfully imported settings & ${result.importedSkillCount} custom skillset(s)!`
					:	`✓ Successfully imported ${result.importedSkillCount} custom skillset(s)!`;

				// Automatically save the settings page and return to the homepage with the imported info
				if (onSaveAndReturn) {
					onSaveAndReturn({
						name: newKidName,
						age: newKidAge,
						gender: newKidGender,
						avatar: newKidAvatar,
						apiKey: decryptApiKey(newEncryptedKey),
						selectedModel: newModel,
						timerConfig: newTimerConfig,
						showVisualDiagrams: newShowDiagrams,
						toastNotice,
					});
				}
			} catch (err) {
				setBackupStatus({
					type: 'error',
					text: `⚠️ Import failed: ${err.message}`,
				});
				setTimeout(() => setBackupStatus(null), 5000);
			}
		};
		reader.readAsText(file);
	};

	const handleFetchLiveModels = async () => {
		playButtonPop(soundEnabled);
		if (selectedProvider !== AI_PROVIDERS.GEMINI) {
			setFetchModelStatus({
				type: 'success',
				text: `✓ Models for ${AI_PROVIDER_INFO[selectedProvider]?.name || 'AI'} are curated, tested, and up to date.`,
			});
			return;
		}

		const targetKey =
			decryptApiKey(apiKeyInput.trim()) || getStoredApiKey(AI_PROVIDERS.GEMINI);
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
				setStoredSelectedModel(latest.id, AI_PROVIDERS.GEMINI);
				setProviderModels((prev) => ({
					...prev,
					[AI_PROVIDERS.GEMINI]: latest.id,
				}));
				setInitialValues((prev) =>
					prev ?
						{
							...prev,
							selectedModel: latest.id,
							providerModels: {
								...prev.providerModels,
								[AI_PROVIDERS.GEMINI]: latest.id,
							},
						}
					:	prev,
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
		if (selectedProvider !== AI_PROVIDERS.GEMINI) {
			return;
		}

		// If models are already cached in localStorage, do not re-fetch on every opening
		if (hasCachedGeminiModels()) {
			return;
		}

		const targetKey =
			decryptApiKey((apiKeyInput || '').trim()) ||
			getStoredApiKey(AI_PROVIDERS.GEMINI);
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
					const currentSaved = getStoredSelectedModel(AI_PROVIDERS.GEMINI);
					// Auto-select latest healthy model if none set, or if current selection is rate-limited
					if (
						!currentSaved ||
						isModelRateLimited(currentSaved) ||
						currentSaved === 'gemini-3.8-flash'
					) {
						setSelectedModel(latest.id);
						setStoredSelectedModel(latest.id, AI_PROVIDERS.GEMINI);
						setProviderModels((prev) => ({
							...prev,
							[AI_PROVIDERS.GEMINI]: latest.id,
						}));
						setInitialValues((prev) =>
							prev ?
								{
									...prev,
									selectedModel: latest.id,
									providerModels: {
										...prev.providerModels,
										[AI_PROVIDERS.GEMINI]: latest.id,
									},
								}
							:	prev,
						);
						setFetchModelStatus({
							type: 'success',
							text: `✓ Downloaded and cached ${liveModels.length} latest Gemini models! "${latest.name}" set as default.`,
						});
					}
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
	}, [selectedProvider]);

	useEffect(() => {
		const initAge = Number(getStoredKidAge() || 5);
		const existingTimer = getStoredTimerConfig(initAge);
		const initTimerEnabled =
			isTimerMandatoryForAge(initAge) ? true : Boolean(existingTimer.enabled);
		const initTimerSec =
			Number(existingTimer.secondsPerQuestion) ||
			DEFAULT_QUESTION_TIMER_SECONDS;
		const initAutoAdvanceEnabled =
			existingTimer.autoAdvanceEnabled !== undefined ?
				Boolean(existingTimer.autoAdvanceEnabled)
			:	true;
		const initAutoAdvanceSec = Number(existingTimer.autoAdvanceSeconds) || 7;
		const initName = getStoredKidName() || '';
		const initGender = getStoredKidGender() || 'boy';
		const initAvatar =
			getStoredKidAvatar() || getDefaultAvatarForGender(initGender);

		const initProvider = getActiveAiProvider() || AI_PROVIDERS.GEMINI;
		const initProviderKeys = {
			[AI_PROVIDERS.GEMINI]:
				getStoredEncryptedApiKey(AI_PROVIDERS.GEMINI) || '',
			[AI_PROVIDERS.OPENAI]:
				getStoredEncryptedApiKey(AI_PROVIDERS.OPENAI) || '',
			[AI_PROVIDERS.CLAUDE]:
				getStoredEncryptedApiKey(AI_PROVIDERS.CLAUDE) || '',
		};
		const initProviderModels = {
			[AI_PROVIDERS.GEMINI]: getStoredSelectedModel(AI_PROVIDERS.GEMINI),
			[AI_PROVIDERS.OPENAI]: getStoredSelectedModel(AI_PROVIDERS.OPENAI),
			[AI_PROVIDERS.CLAUDE]: getStoredSelectedModel(AI_PROVIDERS.CLAUDE),
		};
		const initApiKey = initProviderKeys[initProvider] || '';
		const initModel = initProviderModels[initProvider];

		const initShowDiagrams = Boolean(getStoredShowVisualDiagrams());
		const initVoiceURI = getStoredVoiceURI() || '';
		const initPersonality = getStoredVoicePersonality() || 'classic';
		const initAmbientEnabled = getStoredAmbientEnabled();
		const initAmbientVol = getStoredAmbientVolume();

		setInitialValues({
			name: initName,
			age: initAge,
			gender: initGender,
			avatar: initAvatar,
			selectedProvider: initProvider,
			apiKey: initApiKey,
			providerKeys: initProviderKeys,
			providerModels: initProviderModels,
			selectedModel: initModel,
			timerEnabled: initTimerEnabled,
			timerSeconds: initTimerSec,
			autoAdvanceEnabled: initAutoAdvanceEnabled,
			autoAdvanceSeconds: initAutoAdvanceSec,
			showVisualDiagrams: initShowDiagrams,
			selectedVoiceURI: initVoiceURI,
			voicePersonality: initPersonality,
			ambientEnabled: initAmbientEnabled,
			ambientVolume: initAmbientVol,
		});

		setNameInput(initName);
		setAgeInput(initAge);
		setGenderInput(initGender);
		setAvatarInput(initAvatar);
		setSelectedProvider(initProvider);
		setProviderKeys(initProviderKeys);
		setProviderModels(initProviderModels);
		setApiKeyInput(initApiKey);
		setSelectedModel(initModel);
		setModelsList(getAvailableModels(initProvider));
		setTimerEnabled(initTimerEnabled);
		setTimerSeconds(initTimerSec);
		setIsCustomTimer(![30, 45, 60, 90, 120, 180].includes(initTimerSec));

		setAutoAdvanceEnabled(initAutoAdvanceEnabled);
		setAutoAdvanceSeconds(initAutoAdvanceSec);
		setIsCustomAutoAdvance(![3, 5, 7, 10, 15].includes(initAutoAdvanceSec));

		setIsCustomAge(!quickAges.includes(initAge));
		setShowVisualDiagrams(initShowDiagrams);
		setSelectedVoiceURI(initVoiceURI);
		setSelectedPersonality(initPersonality);
		setAmbientAudioEnabled(initAmbientEnabled);
		setAmbientAudioVolume(initAmbientVol);

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

	// Sync settings inputs when an astronaut flight crew profile is switched
	useEffect(() => {
		const handleCrewSync = () => {
			setCrewMembers(getAllCrewMembers());
			const initName = getStoredKidName() || '';
			const initAge = Number(getStoredKidAge() || 5);
			const initGender = getStoredKidGender() || 'boy';
			const initAvatar =
				getStoredKidAvatar() || getDefaultAvatarForGender(initGender);
			const initPersonality = getStoredVoicePersonality() || 'classic';

			setNameInput(initName);
			setAgeInput(initAge);
			setGenderInput(initGender);
			setAvatarInput(initAvatar);
			setSelectedPersonality(initPersonality);

			setInitialValues((prev) =>
				prev ?
					{
						...prev,
						name: initName,
						age: initAge,
						gender: initGender,
						avatar: initAvatar,
						voicePersonality: initPersonality,
					}
				:	prev,
			);
		};

		window.addEventListener('astroquest:crew_switched', handleCrewSync);
		window.addEventListener('astroquest:crew_updated', handleCrewSync);
		return () => {
			window.removeEventListener('astroquest:crew_switched', handleCrewSync);
			window.removeEventListener('astroquest:crew_updated', handleCrewSync);
		};
	}, []);

	// Change detection: true if any setting differs from initial stored values
	const isDirty = useMemo(() => {
		if (!initialValues) return false;
		return (
			nameInput.trim() !== initialValues.name.trim() ||
			Number(ageInput) !== Number(initialValues.age) ||
			genderInput !== initialValues.gender ||
			avatarInput !== initialValues.avatar ||
			selectedProvider !== initialValues.selectedProvider ||
			apiKeyInput.trim() !== initialValues.apiKey.trim() ||
			selectedModel !== initialValues.selectedModel ||
			(providerKeys[AI_PROVIDERS.GEMINI] || '') !==
				(initialValues.providerKeys?.[AI_PROVIDERS.GEMINI] || '') ||
			(providerKeys[AI_PROVIDERS.OPENAI] || '') !==
				(initialValues.providerKeys?.[AI_PROVIDERS.OPENAI] || '') ||
			(providerKeys[AI_PROVIDERS.CLAUDE] || '') !==
				(initialValues.providerKeys?.[AI_PROVIDERS.CLAUDE] || '') ||
			(providerModels[AI_PROVIDERS.GEMINI] || '') !==
				(initialValues.providerModels?.[AI_PROVIDERS.GEMINI] || '') ||
			(providerModels[AI_PROVIDERS.OPENAI] || '') !==
				(initialValues.providerModels?.[AI_PROVIDERS.OPENAI] || '') ||
			(providerModels[AI_PROVIDERS.CLAUDE] || '') !==
				(initialValues.providerModels?.[AI_PROVIDERS.CLAUDE] || '') ||
			timerEnabled !== initialValues.timerEnabled ||
			Number(timerSeconds) !== Number(initialValues.timerSeconds) ||
			autoAdvanceEnabled !== initialValues.autoAdvanceEnabled ||
			Number(autoAdvanceSeconds) !== Number(initialValues.autoAdvanceSeconds) ||
			showVisualDiagrams !== initialValues.showVisualDiagrams ||
			selectedVoiceURI !== initialValues.selectedVoiceURI ||
			selectedPersonality !== initialValues.voicePersonality ||
			ambientAudioEnabled !== initialValues.ambientEnabled ||
			Number(ambientAudioVolume) !== Number(initialValues.ambientVolume)
		);
	}, [
		initialValues,
		nameInput,
		ageInput,
		genderInput,
		avatarInput,
		selectedProvider,
		apiKeyInput,
		selectedModel,
		providerKeys,
		providerModels,
		timerEnabled,
		timerSeconds,
		autoAdvanceEnabled,
		autoAdvanceSeconds,
		showVisualDiagrams,
		selectedVoiceURI,
		selectedPersonality,
		ambientAudioEnabled,
		ambientAudioVolume,
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
			setGenderInput(initialValues.gender);
			setAvatarInput(initialValues.avatar);
			setSelectedProvider(initialValues.selectedProvider);
			setApiKeyInput(initialValues.apiKey);
			setProviderKeys(initialValues.providerKeys || {});
			setSelectedModel(initialValues.selectedModel);
			setProviderModels(initialValues.providerModels || {});
			setModelsList(getAvailableModels(initialValues.selectedProvider));
			setTimerEnabled(initialValues.timerEnabled);
			setTimerSeconds(initialValues.timerSeconds);
			setIsCustomTimer(
				![30, 45, 60, 90, 120, 180].includes(
					Number(initialValues.timerSeconds),
				),
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

	const isMandatoryTimer = isTimerMandatoryForAge(ageInput);

	useEffect(() => {
		if (isMandatoryTimer && !timerEnabled) {
			setTimerEnabled(true);
			if (!timerSeconds) {
				setTimerSeconds(DEFAULT_QUESTION_TIMER_SECONDS);
			}
		}
	}, [isMandatoryTimer, timerEnabled, timerSeconds]);

	const handleQuickAgeSelect = (age) => {
		playButtonPop(soundEnabled);
		setAgeInput(age);
		setIsCustomAge(false);
		if (isTimerMandatoryForAge(age)) {
			setTimerEnabled(true);
			if (!timerSeconds) setTimerSeconds(DEFAULT_QUESTION_TIMER_SECONDS);
		}
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
		if (isTimerMandatoryForAge(nextAge)) {
			setTimerEnabled(true);
			if (!timerSeconds) setTimerSeconds(DEFAULT_QUESTION_TIMER_SECONDS);
		}
	};

	const handleStepTimer = (delta) => {
		playButtonPop(soundEnabled);
		const curr = timerSeconds || DEFAULT_QUESTION_TIMER_SECONDS;
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

		const activeProviderInfo =
			AI_PROVIDER_INFO[selectedProvider] ||
			AI_PROVIDER_INFO[AI_PROVIDERS.GEMINI];
		const trimmedKey = apiKeyInput.trim();
		if (!trimmedKey) {
			setError(
				`${activeProviderInfo.name} API Key is mandatory for real-time AI questions! 🔑`,
			);
			return;
		}

		const decryptedKey = decryptApiKey(trimmedKey);

		setError('');
		setIsValidating(true);
		playButtonPop(soundEnabled);

		// Validate API Key live against the selected AI provider and model
		const validationResult = await validateApiKey(
			decryptedKey,
			selectedProvider,
			selectedModel,
		);

		if (!validationResult.valid) {
			setIsValidating(false);
			setError(
				validationResult.message ||
					`Invalid ${activeProviderInfo.name} API Key. Please verify your key.`,
			);
			return;
		}

		// 1. Save Active AI Provider
		setActiveAiProvider(selectedProvider);

		// 2. Save API Key for active provider (encrypted)
		setStoredApiKey(validationResult.cleanedKey, selectedProvider);
		// Save any secondary keys entered across other providers
		Object.entries(providerKeys).forEach(([prov, encKey]) => {
			if (prov !== selectedProvider && encKey) {
				const plain = decryptApiKey(encKey);
				if (plain) setStoredApiKey(plain, prov);
			}
		});

		// 3. Encrypted string to display in field and update initialValues
		const encryptedKey = getStoredEncryptedApiKey(selectedProvider);
		setApiKeyInput(encryptedKey);
		const updatedSavedKeys = {
			...providerKeys,
			[selectedProvider]: encryptedKey,
		};
		setProviderKeys(updatedSavedKeys);

		// 4. Save Selected AI Model
		setStoredSelectedModel(selectedModel, selectedProvider);
		Object.entries(providerModels).forEach(([prov, modId]) => {
			if (prov !== selectedProvider && modId) {
				setStoredSelectedModel(modId, prov);
			}
		});
		const updatedSavedModels = {
			...providerModels,
			[selectedProvider]: selectedModel,
		};
		setProviderModels(updatedSavedModels);

		// 5. Save Kid Profile
		saveStoredKidProfile(trimmedName, numAge, genderInput, avatarInput);

		// 6. Save Settings, Timer Config, Visual Diagrams & Audio Preferences
		const effectiveTimerEnabled =
			isTimerMandatoryForAge(numAge) ? true : Boolean(timerEnabled);
		const updatedConfig = {
			enabled: effectiveTimerEnabled,
			secondsPerQuestion: Math.max(
				15,
				Math.min(600, Number(timerSeconds) || DEFAULT_QUESTION_TIMER_SECONDS),
			),
			autoAdvanceEnabled,
			autoAdvanceSeconds,
		};
		saveStoredTimerConfig(updatedConfig, numAge);
		saveStoredShowVisualDiagrams(showVisualDiagrams);
		setStoredVoiceURI(selectedVoiceURI || null);
		setStoredVoicePersonality(selectedPersonality);
		setStoredAmbientEnabled(ambientAudioEnabled);
		setStoredAmbientVolume(ambientAudioVolume);

		if (ambientAudioEnabled) {
			startAmbientSound(ambientAudioVolume);
		} else {
			stopAmbientSound();
		}

		// Update initialValues to reflect newly saved state
		setInitialValues({
			name: trimmedName,
			age: numAge,
			gender: genderInput,
			avatar: avatarInput,
			selectedProvider,
			apiKey: encryptedKey,
			providerKeys: updatedSavedKeys,
			providerModels: updatedSavedModels,
			selectedModel,
			timerEnabled: effectiveTimerEnabled,
			timerSeconds: updatedConfig.secondsPerQuestion,
			autoAdvanceEnabled,
			autoAdvanceSeconds,
			showVisualDiagrams,
			selectedVoiceURI: selectedVoiceURI || '',
			voicePersonality: selectedPersonality,
			ambientEnabled: ambientAudioEnabled,
			ambientVolume: ambientAudioVolume,
		});

		setIsValidating(false);
		setSaveSuccess(true);

		speakText(`Settings saved for ${trimmedName}!`);

		if (onSaveAndReturn) {
			onSaveAndReturn({
				name: trimmedName,
				age: numAge,
				gender: genderInput,
				avatar: avatarInput,
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
			error.toLowerCase().includes('openai') ||
			error.toLowerCase().includes('claude') ||
			error.toLowerCase().includes('chatgpt') ||
			error.toLowerCase().includes('anthropic') ||
			error.toLowerCase().includes('api'));

	const hasProfile = Boolean(getStoredKidName() && getStoredApiKey());

	return (
		<div className='min-h-screen space-background flex flex-col text-white font-sans overflow-x-hidden select-none py-3 sm:py-6 px-2 sm:px-6'>
			{/* Top Bar Header */}
			<div className='max-w-3xl w-full mx-auto flex items-center justify-between gap-3 mb-4 sm:mb-6'>
				<div className='flex items-center gap-2.5 sm:gap-3'>
					{hasProfile && onBack && (
						<button
							onClick={handleAttemptLeave}
							className='p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition-all shadow-md cursor-pointer flex-shrink-0'
							title='Back to Dashboard'>
							<ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
						</button>
					)}
					<div>
						<h1 className='text-lg sm:text-2xl font-black text-white flex items-center gap-1.5 sm:gap-2'>
							<span>Explorer Profile & Settings</span>
							<Sparkles className='w-4 h-4 sm:w-5 sm:h-5 text-amber-300 flex-shrink-0' />
						</h1>
						<p className='text-[11px] sm:text-xs text-slate-300 font-semibold'>
							Configure child profile, Gemini API Key, AI model, and question
							pacing.
						</p>
					</div>
				</div>

				{pendingSkill && (
					<div className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black shadow flex-shrink-0'>
						<span>Ready to launch:</span>
						<span className='text-white'>{pendingSkill}</span>
					</div>
				)}
			</div>

			{/* Hidden file input for importing backup */}
			<input
				type='file'
				ref={backupFileInputRef}
				accept='.json,application/json'
				className='hidden'
				onChange={handleBackupFileChange}
			/>

			{/* Main Settings Form */}
			<div className='max-w-3xl w-full mx-auto bg-gradient-to-b from-[#1C1F5E]/90 via-[#141846]/95 to-[#0D1030] border-2 sm:border-4 border-amber-400/80 rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.25)] flex flex-col gap-3.5 sm:gap-6 backdrop-blur-md'>
				{/* Cross-Device Backup & Portability Card */}
				<div className='bg-gradient-to-r from-cyan-950/50 via-indigo-950/40 to-purple-950/50 border border-cyan-400/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-md'>
					<div className='flex items-center gap-2.5 sm:gap-3'>
						<div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0'>
							<Sparkles className='w-4 h-4 sm:w-5 sm:h-5 text-cyan-300' />
						</div>
						<div className='min-w-0'>
							<h2 className='text-xs sm:text-base font-extrabold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap'>
								<span>Cross-Device Backup & Portability</span>
								<span className='text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase font-black'>
									Multi-PC
								</span>
							</h2>
							<p className='text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5'>
								Export or import your profile, API key, model choice, and custom
								skillsets to move to another computer.
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2 w-full sm:w-auto'>
						<button
							type='button'
							disabled={isValidating}
							onClick={handleTriggerImportBackup}
							className='flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer'
							title='Import complete backup (settings and custom skillsets)'>
							<Upload className='w-3.5 h-3.5 text-cyan-300' />
							<span>Import</span>
						</button>

						<button
							type='button'
							disabled={isValidating}
							onClick={handleExportBackup}
							className='flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer'
							title='Export complete backup (settings and custom skillsets)'>
							<Download className='w-3.5 h-3.5 text-amber-300' />
							<span>Export</span>
						</button>
					</div>
				</div>

				{/* Backup Feedback Alert Banner */}
				{backupStatus && (
					<div
						role='status'
						aria-live='polite'
						className={`p-3 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
							backupStatus.type === 'success' ?
								'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
							:	'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md'
						}`}>
						<span>{backupStatus.text}</span>
					</div>
				)}

				{/* Astronaut Flight Crew Management Card */}
				<div className='bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-cyan-950/40 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-3 shadow-md'>
					<div className='flex items-center justify-between gap-2 flex-wrap'>
						<div className='flex items-center gap-2'>
							<Users className='w-5 h-5 text-cyan-400' />
							<div>
								<h2 className='text-xs sm:text-base font-extrabold text-white flex items-center gap-2'>
									<span>Astronaut Flight Crew Profiles</span>
									<span className='text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
										{crewMembers.length} Explorer
										{crewMembers.length === 1 ? '' : 's'}
									</span>
								</h2>
								<p className='text-[11px] text-slate-300'>
									Manage multiple children on this device without sharing
									progress or settings.
								</p>
							</div>
						</div>

						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								setIsCrewModalOpen(true);
							}}
							className='px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer'>
							<Users className='w-3.5 h-3.5' />
							<span>Manage Crew Profiles</span>
						</button>
					</div>

					{/* Crew Member Quick-Switch Chips */}
					<div className='flex items-center gap-2 overflow-x-auto pb-1 pt-1'>
						{crewMembers.map((member) => {
							const isActive = member.id === getActiveCrewId();
							return (
								<button
									key={member.id}
									type='button'
									onClick={() => {
										playButtonPop(soundEnabled);
										if (!isActive) {
											switchActiveCrewMember(member.id);
										}
									}}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
										isActive ?
											'bg-cyan-500/25 border-cyan-400 ring-2 ring-cyan-400/40 text-white shadow-md'
										:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 text-slate-300 hover:text-white'
									}`}>
									<KidAvatar
										avatarId={member.avatar}
										gender={member.gender}
										size='xs'
									/>
									<span className='text-xs font-black'>{member.name}</span>
									<span className='text-[10px] text-slate-400 font-bold'>
										Age {member.age}
									</span>
									{isActive && (
										<span className='w-2 h-2 rounded-full bg-cyan-400 animate-pulse' />
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Section 1: Child Name & Age */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
					{/* Name Card */}
					<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380]'>
						<label
							htmlFor='child-name-input'
							className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-1.5 sm:mb-2'>
							<Smile className='w-4 h-4 text-pink-400' />
							<span>Child's Name</span>
						</label>
						<input
							id='child-name-input'
							name='child_display_name'
							type='text'
							maxLength={30}
							autoComplete='off'
							data-1p-ignore='true'
							data-lpignore='true'
							data-form-type='other'
							aria-required='true'
							aria-describedby='child-name-desc'
							disabled={isValidating}
							value={nameInput}
							onChange={(e) => {
								setNameInput(e.target.value);
								if (error) setError('');
							}}
							placeholder='e.g. Leo, Maya, Alex...'
							className='w-full bg-[#0D1030] border border-pink-500/40 focus:border-pink-400 text-white font-bold text-sm sm:text-base rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 transition-all'
						/>
						<span
							id='child-name-desc'
							className='text-[10px] sm:text-[11px] text-slate-400 mt-1 block'>
							Used to personalize questions, voice feedback & reports.
						</span>
					</div>

					{/* Age Card */}
					<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380]'>
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
							className='grid grid-cols-6 gap-1 sm:gap-1.5'>
							{quickAges.map((age) => (
								<button
									key={age}
									type='button'
									disabled={isValidating}
									aria-label={`${age} years old`}
									aria-pressed={Number(ageInput) === age && !isCustomAge}
									onClick={() => handleQuickAgeSelect(age)}
									className={`py-2 px-0.5 sm:px-1 rounded-xl text-xs font-black transition-all border cursor-pointer text-center focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
										Number(ageInput) === age && !isCustomAge ?
											'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-md scale-105'
										:	'bg-[#0D1030] text-slate-300 border-slate-700/80 hover:bg-slate-800'
									}`}>
									{age}y
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
										name='child_age_years'
										aria-label='Custom age in years'
										type='number'
										min={2}
										max={14}
										maxLength={2}
										autoComplete='off'
										data-1p-ignore='true'
										data-lpignore='true'
										data-form-type='other'
										disabled={isValidating}
										value={ageInput}
										onKeyDown={(e) => {
											// Block exponential, sign, and decimal characters
											if (['e', 'E', '+', '-', '.'].includes(e.key)) {
												e.preventDefault();
											}
										}}
										onChange={(e) => {
											const raw = e.target.value;
											if (raw === '') {
												setAgeInput('');
												if (error) setError('');
												return;
											}
											// Keep only digits
											const digits = raw.replace(/\D/g, '');
											if (!digits) {
												setAgeInput('');
												return;
											}
											const parsed = parseInt(digits, 10);
											if (parsed > 14) {
												setAgeInput(14);
											} else {
												setAgeInput(parsed);
											}
											if (error) setError('');
										}}
										onBlur={() => {
											const val = parseInt(ageInput, 10);
											if (isNaN(val) || val < 2) {
												setAgeInput(2);
											} else if (val > 14) {
												setAgeInput(14);
											} else {
												setAgeInput(val);
											}
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

				{/* Section 1B: Explorer Gender & Avatar Customization */}
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380] flex flex-col gap-3.5 sm:gap-4'>
					{/* Top Header & Active Avatar Preview */}
					<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-white/10'>
						<div className='flex items-center gap-3 sm:gap-3.5'>
							{/* Large Glowing Avatar Display */}
							<div className='relative flex-shrink-0'>
								<KidAvatar
									avatarId={avatarInput}
									size='lg'
									showRing
									className='shadow-[0_0_20px_rgba(34,211,238,0.4)]'
								/>
								<span className='absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-md border-2 border-[#090B24]'>
									<Check className='w-3 h-3' />
								</span>
							</div>
							<div>
								<div className='flex items-center gap-2 flex-wrap'>
									<h3 className='text-sm sm:text-base font-black text-white'>
										{getAvatarById(avatarInput)?.name || 'Custom Explorer'}
									</h3>
									<span className='text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 capitalize'>
										{genderInput === 'boy' ?
											'👦 Boy'
										: genderInput === 'girl' ?
											'👧 Girl'
										:	'🚀 Space Cadet'}
									</span>
								</div>
								<p className='text-[11px] sm:text-xs text-slate-300 mt-0.5'>
									{getAvatarById(avatarInput)?.label || 'Hero Explorer Avatar'}{' '}
									• Shown on dashboard & question headers
								</p>
							</div>
						</div>

						{/* Gender Selection 3-Button Toggle */}
						<div className='w-full sm:w-auto flex flex-col items-start sm:items-end gap-1'>
							<span className='text-[11px] font-bold text-slate-400 uppercase tracking-wider'>
								Child's Gender
							</span>
							<div
								className='grid grid-cols-3 gap-1.5 w-full sm:w-auto'
								role='group'
								aria-label='Select explorer gender'>
								{[
									{ id: 'boy', label: 'Boy', icon: '👦' },
									{ id: 'girl', label: 'Girl', icon: '👧' },
									{ id: 'neutral', label: 'Cadet', icon: '🚀' },
								].map((opt) => {
									const isSelected = genderInput === opt.id;
									return (
										<button
											key={opt.id}
											type='button'
											disabled={isValidating}
											aria-pressed={isSelected}
											onClick={() => handleGenderSelect(opt.id)}
											className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
												isSelected ?
													'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-md scale-105'
												:	'bg-[#0D1030] text-slate-300 border-slate-700/80 hover:bg-slate-800'
											}`}>
											<span>{opt.icon}</span>
											<span>{opt.label}</span>
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Preset Avatar Gallery */}
					<div className='flex flex-col gap-2.5'>
						<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
							<label className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5'>
								<Sparkles className='w-4 h-4 text-amber-400' />
								<span>Preset Avatar Gallery</span>
								<span className='text-[10px] text-slate-400 font-normal'>
									({PRESET_AVATARS.length} Options)
								</span>
							</label>

							{/* Category Filter Pills */}
							<div
								className='flex items-center gap-1 overflow-x-auto max-w-full pb-0.5'
								role='tablist'
								aria-label='Avatar categories'>
								{['All', 'Boys', 'Girls', 'Cosmic Pals'].map((category) => {
									const isActive = avatarCategoryFilter === category;
									return (
										<button
											key={category}
											type='button'
											role='tab'
											aria-selected={isActive}
											disabled={isValidating}
											onClick={() => {
												playButtonPop(soundEnabled);
												setAvatarCategoryFilter(category);
											}}
											className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
												isActive ?
													'bg-purple-600 text-white border-purple-400 shadow-sm'
												:	'bg-[#0D1030] text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800'
											}`}>
											{category === 'Boys' ?
												'👦 Boys'
											: category === 'Girls' ?
												'👧 Girls'
											: category === 'Cosmic Pals' ?
												'🤖 Cosmic Pals'
											:	'All'}
										</button>
									);
								})}
							</div>
						</div>

						{/* Grid of Preset Avatars */}
						<div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5'>
							{filteredAvatars.map((avatar) => {
								const isSelected = avatarInput === avatar.id;
								return (
									<button
										key={avatar.id}
										type='button'
										disabled={isValidating}
										aria-label={`Select avatar ${avatar.name}`}
										aria-pressed={isSelected}
										onClick={() => handleAvatarSelect(avatar.id)}
										className={`relative p-2 rounded-xl flex flex-col items-center gap-1.5 transition-all text-center border cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
											isSelected ?
												'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-[1.03]'
											:	'bg-[#0D1030]/90 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80 hover:scale-[1.02]'
										}`}>
										{/* Active Checkmark Pin */}
										{isSelected && (
											<span className='absolute top-1 right-1 bg-cyan-400 text-slate-950 rounded-full p-0.5 shadow-sm'>
												<Check className='w-2.5 h-2.5 stroke-[3]' />
											</span>
										)}
										<KidAvatar
											avatarId={avatar.id}
											size='sm'
										/>
										<div className='min-w-0 w-full'>
											<p className='text-[11px] font-bold text-white truncate leading-tight'>
												{avatar.name.split(' ')[0]}
											</p>
											<p className='text-[9px] text-slate-400 truncate leading-none mt-0.5'>
												{avatar.label}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Section 2: AI Intelligence Provider Selection */}
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-indigo-500/40 shadow-inner flex flex-col gap-3'>
					<div className='flex items-center justify-between gap-2 flex-wrap'>
						<div className='flex items-center gap-2'>
							<Sparkles className='w-4 h-4 text-amber-400 flex-shrink-0' />
							<span className='text-xs sm:text-sm font-bold text-white'>
								Select AI Intelligence Provider
							</span>
						</div>
						<span className='text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 uppercase'>
							{AI_PROVIDER_INFO[selectedProvider]?.name || 'Gemini'} Active
						</span>
					</div>

					<p className='text-[11px] sm:text-xs text-slate-300'>
						Choose your preferred AI to generate 100% real-time, adaptive
						AstroQuest questions:
					</p>

					<div
						className='grid grid-cols-1 sm:grid-cols-3 gap-2.5'
						role='radiogroup'
						aria-label='Select AI Provider'>
						{Object.values(AI_PROVIDERS).map((provId) => {
							const info = AI_PROVIDER_INFO[provId];
							const isSelected = selectedProvider === provId;
							const hasKey = Boolean(providerKeys[provId]);

							return (
								<button
									key={provId}
									type='button'
									role='radio'
									aria-checked={isSelected}
									disabled={isValidating}
									onClick={() => handleSelectProvider(provId)}
									className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col justify-between gap-2.5 ${
										isSelected ?
											'bg-gradient-to-b from-indigo-950/80 via-[#161c4e] to-purple-950/80 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
										:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
									}`}>
									<div className='flex items-start justify-between gap-1.5'>
										<div className='flex items-center gap-2'>
											<span
												className='text-xl flex-shrink-0'
												role='img'
												aria-label={info.name}>
												{provId === AI_PROVIDERS.GEMINI ?
													'✨'
												: provId === AI_PROVIDERS.OPENAI ?
													'🟢'
												:	'🎭'}
											</span>
											<div>
												<h3
													className={`text-xs sm:text-sm font-black leading-tight ${
														isSelected ? 'text-amber-300' : 'text-white'
													}`}>
													{info.name}
												</h3>
												<p className='text-[10px] text-slate-400 font-medium'>
													{provId === AI_PROVIDERS.GEMINI ?
														'Google AI Studio'
													: provId === AI_PROVIDERS.OPENAI ?
														'OpenAI Platform'
													:	'Anthropic Console'}
												</p>
											</div>
										</div>

										{isSelected && (
											<div className='w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow flex-shrink-0'>
												<Check className='w-3 h-3 stroke-[3]' />
											</div>
										)}
									</div>

									<div className='flex items-center justify-between gap-1 mt-0.5 flex-wrap'>
										<span
											className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${info.badgeColor}`}>
											{info.badge}
										</span>
										{hasKey && (
											<span className='text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5'>
												<Check className='w-2.5 h-2.5' /> Key Stored
											</span>
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Section 2B: Provider API Key (Mandatory with Live Validation) */}
				<div
					className={`bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all shadow-inner ${
						isKeyError ?
							'border-rose-500 ring-2 ring-rose-400/40 animate-shake'
						:	'border-amber-400/60'
					}`}>
					<div className='flex flex-wrap items-center justify-between gap-1.5 mb-2'>
						<label
							htmlFor='active-api-key-input'
							className='text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5'>
							<Key className='w-4 h-4 text-amber-400 flex-shrink-0' />
							<span>{AI_PROVIDER_INFO[selectedProvider]?.name} API Key</span>
							<span className='text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase'>
								Mandatory
							</span>
						</label>
						<a
							href={AI_PROVIDER_INFO[selectedProvider]?.portalUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='text-[11px] sm:text-xs font-bold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded'>
							<span>
								{selectedProvider === AI_PROVIDERS.GEMINI ?
									'Get Free Key'
								:	`Get ${AI_PROVIDER_INFO[selectedProvider]?.name} Key`}
							</span>
							<ExternalLink className='w-3 h-3' />
						</a>
					</div>

					<div className='relative flex items-center'>
						{/* Copy-blocked tooltip notification */}
						{copyBlockedMessage && (
							<div
								role='alert'
								aria-live='assertive'
								className='absolute -top-10 left-0 sm:left-auto right-0 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xl border border-rose-400'>
								<ShieldAlert className='w-4 h-4 text-amber-200 flex-shrink-0' />
								<span>Copy functionality is not allowed for this field</span>
							</div>
						)}

						<input
							id='active-api-key-input'
							name='active_api_key_field'
							aria-required='true'
							aria-describedby='api-key-desc'
							type='text'
							style={{
								WebkitTextSecurity: isRevealed ? 'none' : 'disc',
								textSecurity: isRevealed ? 'none' : 'disc',
							}}
							autoComplete='off'
							autoCorrect='off'
							autoCapitalize='off'
							spellCheck='false'
							data-1p-ignore='true'
							data-lpignore='true'
							data-form-type='other'
							data-bwignore='true'
							disabled={isValidating}
							value={apiKeyInput}
							onPaste={handlePasteKey}
							onChange={handleKeyChange}
							onBlur={handleKeyBlur}
							onCopy={handleBlockCopy}
							onCut={handleBlockCopy}
							onKeyDown={handleKeyDownKey}
							placeholder={AI_PROVIDER_INFO[selectedProvider]?.keyPlaceholder}
							className={`w-full bg-[#0D1030] border text-white font-mono text-xs sm:text-sm rounded-xl pl-4 pr-12 py-3 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all ${
								isKeyError ?
									'border-rose-400 focus:border-rose-500'
								:	'border-amber-400/50 focus:border-amber-400'
							}`}
						/>

						{/* Encrypted Vault indicator (Replaces eye icon toggle) */}
						<div
							className='absolute right-3 p-1.5 rounded-lg text-emerald-400/80 flex items-center justify-center'
							title={
								isRevealed ?
									'Revealed (auto-masking in 3 seconds)'
								:	'Secure Encrypted Field'
							}
							aria-hidden='true'>
							<Lock
								className={`w-4 h-4 ${
									isRevealed ?
										'text-amber-400 animate-pulse'
									:	'text-emerald-400'
								}`}
							/>
						</div>
					</div>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1.5'>
						<span
							id='api-key-desc'
							className='text-[11px] text-slate-400 block'>
							{isRevealed ?
								<span className='text-amber-300 font-semibold'>
									⚠️ Key visible — auto-masking in 3 seconds.
								</span>
							:	`Required for 100% real-time AI generation via ${AI_PROVIDER_INFO[selectedProvider]?.name}. Value is encrypted in the field.`
							}
						</span>
						<span className='text-[10px] text-emerald-400/90 font-mono flex items-center gap-1'>
							<Lock className='w-3 h-3 inline' />
							<span>Encrypted Vault (Copy Disabled)</span>
						</span>
					</div>
				</div>

				{/* Section 3: AI Model Engine Selection */}
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-cyan-500/40 shadow-inner'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2'>
						<div className='flex items-center gap-2 flex-wrap'>
							<Cpu className='w-4 h-4 text-cyan-400 flex-shrink-0' />
							<span className='text-xs sm:text-sm font-bold text-white'>
								{AI_PROVIDER_INFO[selectedProvider]?.name} Model Engine
							</span>
							{selectedProvider === AI_PROVIDERS.GEMINI &&
								hasCachedGeminiModels() &&
								!isFetchingModels && (
									<span
										className='text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-1'
										title='Models are cached locally and loaded instantly without re-fetching'>
										⚡ Cached
									</span>
								)}
						</div>
						<div className='flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap'>
							{selectedProvider === AI_PROVIDERS.GEMINI && (
								<button
									type='button'
									disabled={isFetchingModels || isValidating}
									onClick={handleFetchLiveModels}
									className='flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-[11px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50'>
									<RefreshCw
										className={`w-3.5 h-3.5 ${
											isFetchingModels ? 'animate-spin text-cyan-200' : ''
										}`}
									/>
									<span>
										{isFetchingModels ? 'Downloading...' : 'Fetch Latest 🔄'}
									</span>
								</button>
							)}
							<span className='text-[10px] font-black px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 truncate max-w-[130px] sm:max-w-none'>
								{modelsList.find((m) => m.id === selectedModel)?.name ||
									selectedModel}
							</span>
						</div>
					</div>

					<p className='text-[11px] sm:text-xs text-slate-300 mb-2'>
						Select which {AI_PROVIDER_INFO[selectedProvider]?.name} model
						generates questions in real time:
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

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-h-[360px] overflow-y-auto pr-1'>
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
										setProviderModels((prev) => ({
											...prev,
											[selectedProvider]: model.id,
										}));
										if (error) setError('');
									}}
									className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col justify-between gap-1.5 ${
										isSelected ?
											'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/50'
										:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
									}`}>
									<div className='flex items-start justify-between gap-2'>
										<span
											className={`text-xs font-black leading-tight ${
												isSelected ? 'text-cyan-300' : 'text-white'
											}`}>
											{model.name}
										</span>
										<div className='flex items-center gap-1.5 flex-shrink-0'>
											{isSelected && (
												<div className='w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow'>
													<Check className='w-3 h-3 stroke-[3]' />
												</div>
											)}
											{(
												selectedProvider === AI_PROVIDERS.GEMINI &&
												isModelRateLimited(model.id)
											) ?
												<span className='text-[9px] font-black px-2 py-0.5 rounded-full border bg-rose-500/20 text-rose-300 border-rose-400/40'>
													⚠️ 429 Quota Limited
												</span>
											:	<span
													className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
													{model.badge}
												</span>
											}
										</div>
									</div>
									<div className='text-[10px] sm:text-[11px] font-bold text-slate-300 flex items-center gap-1'>
										<span>{model.tag}</span>
									</div>
									<p className='text-[10px] text-slate-400 leading-snug'>
										{model.description}
									</p>
								</button>
							);
						})}
					</div>
				</div>

				{/* Section 4: Per-Question Time Limit */}
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380]'>
					<div className='flex items-center justify-between gap-2 mb-2.5'>
						<div className='min-w-0'>
							<div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
								<Clock className='w-4 h-4 text-cyan-400 flex-shrink-0' />
								<span className='text-xs sm:text-sm font-bold text-white'>
									Per-Question Time Limit
								</span>
								<span
									className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase ${
										isMandatoryTimer ? 'bg-amber-400 text-slate-950 shadow'
										: timerEnabled ? 'bg-emerald-400 text-slate-950 shadow'
										: 'bg-slate-800 text-slate-400'
									}`}>
									{isMandatoryTimer ?
										'Mandatory (Ages 8–14)'
									: timerEnabled ?
										'Enabled'
									:	'Optional'}
								</span>
							</div>
							<p className='text-[11px] sm:text-xs text-slate-400 mt-0.5'>
								{isMandatoryTimer ?
									'Sets an active countdown challenge for each question. Mandatory for Upper Elementary (8–10) & Middle School (11–14). Customize challenge duration below!'
								:	'Sets a countdown challenge for each individual question. Optional for younger explorers.'
								}
							</p>
						</div>

						<button
							type='button'
							disabled={isValidating || isMandatoryTimer}
							onClick={() => {
								if (isMandatoryTimer) return;
								playButtonPop(soundEnabled);
								setTimerEnabled((prev) => !prev);
							}}
							title={
								isMandatoryTimer ?
									'Countdown timer is mandatory for Ages 8–14 to ensure active challenge. You can change the question duration below.'
								: timerEnabled ?
									'Turn timer off (unlimited time)'
								:	'Turn timer on'
							}
							className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-black transition-all border flex items-center gap-1 ${
								isMandatoryTimer ?
									'bg-amber-400 text-slate-950 border-amber-300 shadow cursor-not-allowed opacity-95'
								: timerEnabled ?
									'bg-emerald-400 text-slate-950 border-emerald-300 shadow cursor-pointer'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white cursor-pointer'
							}`}>
							{isMandatoryTimer ?
								<>
									<Lock className='w-3 h-3 text-slate-950 inline' />
									<span>⏱️ ON</span>
								</>
							: timerEnabled ?
								'⏱️ ON'
							:	'Timer OFF'}
						</button>
					</div>

					{timerEnabled && (
						<div className='space-y-2.5 pt-2.5 animate-in fade-in duration-200 border-t border-white/10'>
							<div className='grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5'>
								{[
									{ label: '30s', sec: 30 },
									{ label: '45s', sec: 45 },
									{ label: '60s (Def)', sec: 60 },
									{ label: '90s', sec: 90 },
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
										className={`py-2 px-1 sm:px-3 rounded-xl text-xs font-black transition-all border cursor-pointer text-center ${
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
									className={`py-2 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
										isCustomTimer ?
											'bg-amber-400/30 text-amber-300 border-amber-400'
										:	'bg-[#0D1030] text-slate-400 border-slate-700 hover:text-white'
									}`}>
									Custom
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
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380]'>
					<div className='flex items-center justify-between gap-2 mb-2.5'>
						<div className='min-w-0'>
							<div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
								<FastForward className='w-4 h-4 text-emerald-400 flex-shrink-0' />
								<span className='text-xs sm:text-sm font-bold text-white'>
									Next Question Auto-Advance
								</span>
								<span
									className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase ${
										autoAdvanceEnabled ?
											'bg-emerald-400 text-slate-950 shadow'
										:	'bg-slate-800 text-slate-400'
									}`}>
									{autoAdvanceEnabled ? 'Active' : 'Manual'}
								</span>
							</div>
							<p className='text-[11px] sm:text-xs text-slate-400 mt-0.5'>
								Controls how long solution is shown before next question.
							</p>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setAutoAdvanceEnabled((prev) => !prev);
							}}
							className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								autoAdvanceEnabled ?
									'bg-emerald-400 text-slate-950 border-emerald-300 shadow'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{autoAdvanceEnabled ? '⏩ Auto ON' : 'Manual Next'}
						</button>
					</div>

					{!autoAdvanceEnabled && (
						<div className='p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-semibold'>
							💡 <strong>Manual Next Mode:</strong> The solution stays on screen
							indefinitely until you click <em>Next Question ➔</em>.
						</div>
					)}

					{autoAdvanceEnabled && (
						<div className='space-y-2.5 pt-2.5 animate-in fade-in duration-200 border-t border-white/10'>
							<div className='grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5'>
								{[
									{ label: '3s', sec: 3 },
									{ label: '5s', sec: 5 },
									{ label: '7s (Def)', sec: 7 },
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
										className={`py-2 px-1 sm:px-3 rounded-xl text-xs font-black transition-all border cursor-pointer text-center ${
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
									className={`py-2 px-1 sm:px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
										isCustomAutoAdvance ?
											'bg-emerald-400/30 text-emerald-300 border-emerald-400'
										:	'bg-[#0D1030] text-slate-400 border-slate-700 hover:text-white'
									}`}>
									Custom
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
										{autoAdvanceSeconds}s delay
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
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-indigo-500/40 shadow-inner'>
					<div className='flex items-center justify-between gap-2 mb-2'>
						<div className='min-w-0'>
							<div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
								<Eye className='w-4 h-4 text-indigo-400 flex-shrink-0' />
								<span className='text-xs sm:text-sm font-bold text-white'>
									Visual Diagrams & Clues
								</span>
								<span
									className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase ${
										showVisualDiagrams ?
											'bg-indigo-500 text-white shadow'
										:	'bg-slate-800 text-slate-400'
									}`}>
									{showVisualDiagrams ? 'Enabled' : 'Disabled'}
								</span>
							</div>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setShowVisualDiagrams((prev) => !prev);
							}}
							className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								showVisualDiagrams ?
									'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{showVisualDiagrams ? '👁️ Shown' : '🙈 Hidden'}
						</button>
					</div>

					<p className='text-[11px] sm:text-xs text-slate-300 leading-relaxed'>
						Choose whether interactive visual diagrams, 3x3 matrices, sequence
						patterns, and STEM illustrations appear alongside questions and
						option choices.
					</p>

					{/* Warning Notice for Dynamic Visual Generation */}
					<div className='mt-2.5 p-2.5 sm:p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[11px] sm:text-xs flex items-start gap-2.5 leading-relaxed'>
						<AlertTriangle className='w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5' />
						<div>
							<strong className='text-amber-300'>Note:</strong> Visual diagrams
							and option shapes are dynamically synthesized based on AI prompts.
							Minor visual variations may occasionally occur.
						</div>
					</div>
				</div>

				{/* Section 7: Cosmic Audio & Sensory Focus Suite */}
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-purple-500/40 shadow-inner space-y-4'>
					{/* Header */}
					<div className='flex items-center justify-between gap-2 border-b border-purple-500/20 pb-2.5'>
						<div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
							<Volume2 className='w-4 h-4 text-purple-400 flex-shrink-0' />
							<span className='text-xs sm:text-sm font-bold text-white'>
								Cosmic Voice & Audio Focus Suite
							</span>
						</div>
						<span className='text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
							Real-Time Audio
						</span>
					</div>

					{/* 7.1 Cosmic Voice Personalities */}
					<div>
						<div className='text-xs font-black text-purple-200 mb-1 flex items-center gap-1.5'>
							<span>🎙️ Narrator Personality</span>
						</div>
						<p className='text-[11px] sm:text-xs text-slate-300 mb-2.5'>
							Select the personality and vocal pace of your cosmic flight
							instructor:
						</p>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
							{COSMIC_VOICE_PERSONALITIES.map((p) => {
								const isSelected = selectedPersonality === p.id;
								return (
									<button
										key={p.id}
										type='button'
										onClick={() => {
											playButtonPop(soundEnabled);
											setSelectedPersonality(p.id);
											const phrases = {
												classic: 'Hello! I am ready to read questions for you.',
												bot: 'Beep-boop! All circuits operational. Ready for mission!',
												nova: 'Commander Nova here! Prepare for stellar navigation!',
												nebula:
													'Welcome, young star traveler. Take a gentle breath.',
											};
											speakText(phrases[p.id] || phrases.classic);
										}}
										className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
											isSelected ?
												'bg-purple-500/25 border-purple-400 ring-2 ring-purple-400/50 shadow-md'
											:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500'
										}`}>
										<span className='text-xl sm:text-2xl leading-none flex-shrink-0'>
											{p.emoji}
										</span>
										<div className='min-w-0 flex-1'>
											<div className='flex items-center justify-between gap-1'>
												<span
													className={`text-xs font-black ${
														isSelected ? 'text-purple-200' : 'text-white'
													}`}>
													{p.name}
												</span>
												{isSelected && (
													<span className='text-[9px] font-black text-purple-300 bg-purple-500/30 px-1.5 py-0.2 rounded-full border border-purple-400/50'>
														ACTIVE
													</span>
												)}
											</div>
											<div className='text-[10px] text-slate-400 leading-tight mt-0.5'>
												{p.description}
											</div>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* 7.2 Ambient Deep-Space Focus Lo-Fi Soundscape */}
					<div className='pt-3 border-t border-purple-500/20'>
						<div className='flex items-center justify-between gap-2 mb-1.5'>
							<div className='flex items-center gap-1.5'>
								<span className='text-sm'>🎧</span>
								<span className='text-xs font-black text-cyan-200'>
									Deep-Space Focus Ambient Sound
								</span>
							</div>
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									const next = !ambientAudioEnabled;
									setAmbientAudioEnabled(next);
									if (next) {
										startAmbientSound(ambientAudioVolume);
									} else {
										stopAmbientSound();
									}
								}}
								className={`px-3 py-1 rounded-full text-xs font-black transition-all border cursor-pointer ${
									ambientAudioEnabled ?
										'bg-cyan-500 text-cyan-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
									:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
								}`}>
								{ambientAudioEnabled ? '✨ Active' : 'Off'}
							</button>
						</div>
						<p className='text-[11px] text-slate-300 mb-2 leading-relaxed'>
							Gentle 432Hz harmonic space drone &amp; soothing star chimes.
							Scientifically designed to calm test anxiety and improve focus.
						</p>

						{ambientAudioEnabled && (
							<div className='bg-[#080B1E] p-2.5 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn'>
								<div className='flex items-center gap-2 w-full sm:w-auto'>
									<span className='text-xs text-slate-400 font-bold'>
										Soundscape Volume:
									</span>
									<input
										type='range'
										min='0.05'
										max='0.8'
										step='0.05'
										value={ambientAudioVolume}
										onChange={(e) => {
											const val = parseFloat(e.target.value);
											setAmbientAudioVolume(val);
											setAmbientVolume(val);
										}}
										className='w-28 sm:w-36 accent-cyan-400 cursor-pointer'
									/>
									<span className='text-xs font-mono font-bold text-cyan-300'>
										{Math.round(ambientAudioVolume * 100)}%
									</span>
								</div>
								<button
									type='button'
									onClick={() => {
										if (isAmbientSoundPlaying()) {
											stopAmbientSound();
										} else {
											startAmbientSound(ambientAudioVolume);
										}
									}}
									className='text-[11px] font-bold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 transition-all cursor-pointer'>
									{isAmbientSoundPlaying() ? '⏸ Pause Preview' : '▶ Test Audio'}
								</button>
							</div>
						)}
					</div>

					{/* 7.3 Specific Browser Voice Picker */}
					<div className='pt-3 border-t border-purple-500/20'>
						<div className='flex items-center justify-between gap-2 mb-1.5'>
							<span className='text-xs font-bold text-slate-300'>
								Specific Synthesizer Voice Override
							</span>
							{selectedVoiceURI && (
								<span className='text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/40 truncate max-w-[150px]'>
									{availableVoices.find((v) => v.voiceURI === selectedVoiceURI)
										?.name || 'Custom'}
								</span>
							)}
						</div>

						{availableVoices.length === 0 ?
							<div className='text-xs text-slate-400 font-semibold p-2.5 rounded-xl bg-slate-800/60 border border-slate-700'>
								⚠️ No voices loaded yet. Click speaker icon on a question to
								pre-warm voices.
							</div>
						:	<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1'>
								{/* Default / Auto option */}
								<button
									type='button'
									onClick={() => {
										playButtonPop(soundEnabled);
										setSelectedVoiceURI('');
									}}
									className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
										!selectedVoiceURI ?
											'bg-purple-500/20 border-purple-400 ring-2 ring-purple-400/40'
										:	'bg-[#0D1030] border-slate-700 hover:border-slate-500'
									}`}>
									<div
										className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 ${
											!selectedVoiceURI ?
												'bg-purple-400 border-purple-300'
											:	'bg-transparent border-slate-500'
										}`}
									/>
									<div className='min-w-0'>
										<div className='text-xs font-bold text-white'>
											Auto (Recommended)
										</div>
										<div className='text-[10px] text-slate-400'>
											Matches personality automatically
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
												speakText('Voice calibrated for mission.');
											}}
											className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
												isSelected ?
													'bg-purple-500/20 border-purple-400 ring-2 ring-purple-400/40'
												:	'bg-[#0D1030] border-slate-700 hover:border-slate-500'
											}`}>
											<div
												className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 ${
													isSelected ?
														'bg-purple-400 border-purple-300'
													:	'bg-transparent border-slate-500'
												}`}
											/>
											<div className='min-w-0'>
												<div
													className={`text-xs font-bold truncate ${
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
				<div className='flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-end pt-2 border-t border-white/10'>
					{hasProfile && onBack && (
						<button
							type='button'
							disabled={isValidating}
							onClick={handleAttemptLeave}
							className='w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400 text-center'>
							Cancel
						</button>
					)}

					<button
						type='button'
						disabled={isValidating}
						onClick={handleSave}
						className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2.5 focus-visible:ring-4 focus-visible:ring-amber-400 ${
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

			{/* Crew Switcher Modal */}
			{isCrewModalOpen && (
				<CrewSwitcherModal
					isOpen={isCrewModalOpen}
					onClose={() => setIsCrewModalOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}
		</div>
	);
});

export default SettingsScreen;
