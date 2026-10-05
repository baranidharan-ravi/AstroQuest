import { useEffect, useMemo, useRef, useState } from 'react';
import {
	DEFAULT_QUESTION_TIMER_SECONDS,
	isTimerMandatoryForAge,
} from '../../../constants';
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
} from '../../../services/aiGenerator';
import {
	appMemoryStore,
	STORE_ACTIONS,
	useMemoryStore,
} from '../../../store/appMemoryStore';
import {
	getStoredAmbientEnabled,
	getStoredAmbientVolume,
	isAmbientSoundPlaying,
	setAmbientVolume,
	setStoredAmbientEnabled,
	setStoredAmbientVolume,
	startAmbientSound,
	stopAmbientSound,
} from '../../../utils/ambientAudio';
import {
	applyAccessibilityDomClasses,
	getAvailableVoices,
	getStoredAccessibilitySettings,
	getStoredVoicePersonality,
	getStoredVoiceURI,
	playButtonPop,
	setStoredAccessibilitySettings,
	setStoredVoicePersonality,
	setStoredVoiceURI,
	speakText,
} from '../../../utils/audioSynthesis';
import {
	getDefaultAvatarForGender,
	PRESET_AVATARS,
} from '../../../utils/avatarManager';
import {
	exportFullBackupToJsonFile,
	importFullBackupFromJson,
} from '../../../utils/backupManager';
import { getAllCrewMembers } from '../../../utils/crewManager';
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
} from '../../../utils/progressTracker';

/**
 * useSettingsState Custom Hook
 * 
 * Implements SOLID Single Responsibility & Interface Segregation:
 * Manages all form states, validation, audio drivers, model fetching,
 * backup I/O, and persistence for AstroQuest settings.
 */
export function useSettingsState({
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
	const memoryAvatarCat = useMemoryStore((s) => s.avatarCategory);
	const [avatarCategoryFilter, setAvatarCategoryFilterState] = useState(
		() => memoryAvatarCat || 'All',
	);
	const setAvatarCategoryFilter = (cat) => {
		setAvatarCategoryFilterState(cat);
		appMemoryStore.dispatch({
			type: STORE_ACTIONS.SET_AVATAR_CATEGORY,
			payload: cat,
		});
	};
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
	const memoryActiveTab = useMemoryStore((s) => s.settingsActiveTab);
	const [activeTab, setActiveTabState] = useState(
		() => memoryActiveTab || 'profile',
	);
	const setActiveTab = (tabId) => {
		setActiveTabState(tabId);
		appMemoryStore.dispatch({
			type: STORE_ACTIONS.SET_SETTINGS_ACTIVE_TAB,
			payload: tabId,
		});
	};

	const isFormLocked = isValidating || saveSuccess;

	// Auto-scroll to top when settings are saved to highlight the confirmation banner
	useEffect(() => {
		if (saveSuccess) {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		}
	}, [saveSuccess]);

	// Dynamic Models State
	const [modelsList, setModelsList] = useState(() =>
		getAvailableModels(getActiveAiProvider() || AI_PROVIDERS.GEMINI),
	);
	const [isFetchingModels, setIsFetchingModels] = useState(false);
	const [fetchModelStatus, setFetchModelStatus] = useState(null);
	const memoryModelQuery = useMemoryStore((s) => s.searchQueries.model);
	const [modelSearchQuery, setModelSearchQueryState] = useState(
		() => memoryModelQuery || '',
	);
	const setModelSearchQuery = (query) => {
		setModelSearchQueryState(query);
		appMemoryStore.dispatch({
			type: STORE_ACTIONS.SET_SEARCH_QUERY,
			payload: { scope: 'model', query },
		});
	};

	const filteredModels = useMemo(() => {
		const query = modelSearchQuery.trim().toLowerCase();
		if (!query) return modelsList;
		return modelsList.filter(
			(m) =>
				(m.name && m.name.toLowerCase().includes(query)) ||
				(m.id && m.id.toLowerCase().includes(query)) ||
				(m.tag && m.tag.toLowerCase().includes(query)) ||
				(m.badge && m.badge.toLowerCase().includes(query)) ||
				(m.description && m.description.toLowerCase().includes(query)),
		);
	}, [modelsList, modelSearchQuery]);

	// Provider Switch Handler
	const handleSelectProvider = (prov) => {
		if (isFormLocked) return;
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
		setModelSearchQuery('');
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
	const memoryVoiceQuery = useMemoryStore((s) => s.searchQueries.voice);
	const [voiceSearchQuery, setVoiceSearchQueryState] = useState(
		() => memoryVoiceQuery || '',
	);
	const setVoiceSearchQuery = (query) => {
		setVoiceSearchQueryState(query);
		appMemoryStore.dispatch({
			type: STORE_ACTIONS.SET_SEARCH_QUERY,
			payload: { scope: 'voice', query },
		});
	};

	const filteredVoices = useMemo(() => {
		const query = voiceSearchQuery.trim().toLowerCase();
		if (!query) return availableVoices;
		return availableVoices.filter(
			(v) =>
				(v.name && v.name.toLowerCase().includes(query)) ||
				(v.lang && v.lang.toLowerCase().includes(query)),
		);
	}, [availableVoices, voiceSearchQuery]);

	// Neuro-Inclusive Accessibility & Multilingual State
	const [accessibility, setAccessibility] = useState(() =>
		getStoredAccessibilitySettings(),
	);

	const handleLanguageSelect = (code) => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		const next = { ...accessibility, language: code };
		setAccessibility(next);
		applyAccessibilityDomClasses(next);
	};

	const handleToggleDyslexic = () => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		const next = {
			...accessibility,
			dyslexicFont: !accessibility.dyslexicFont,
		};
		setAccessibility(next);
		applyAccessibilityDomClasses(next);
	};

	const handleToggleOled = () => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		const next = {
			...accessibility,
			highContrastOled: !accessibility.highContrastOled,
		};
		setAccessibility(next);
		applyAccessibilityDomClasses(next);
	};

	const handleToggleSensoryAudio = () => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		const next = {
			...accessibility,
			sensoryAudio: !accessibility.sensoryAudio,
		};
		setAccessibility(next);
	};

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
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		setGenderInput(newGender);
		const defaultAv = getDefaultAvatarForGender(newGender);
		setAvatarInput(defaultAv);
		if (error) setError('');
	};

	const handleAvatarSelect = (avatarId) => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		setAvatarInput(avatarId);
		if (error) setError('');
	};

	const handleExportBackup = () => {
		if (isFormLocked) return;
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
		if (isFormLocked) return;
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
			if (latest?.id) {
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
				if (latest?.id) {
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
		await handleSave(false);
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

	const handleStepTimer = (delta) => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		const curr = timerSeconds || DEFAULT_QUESTION_TIMER_SECONDS;
		const nextSec = Math.min(300, Math.max(15, curr + delta));
		setTimerSeconds(nextSec);
	};

	const handleStepAutoAdvance = (delta) => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		const curr = autoAdvanceSeconds || 7;
		const nextSec = Math.min(30, Math.max(2, curr + delta));
		setAutoAdvanceSeconds(nextSec);
	};

	const handleSave = async (shouldStay = true) => {
		if (isValidating) return;

		const trimmedName = nameInput.trim();
		if (!trimmedName) {
			setActiveTab('profile');
			setError('Please enter the explorer’s name! 😊');
			return;
		}

		const numAge = Number.parseInt(ageInput, 10);
		if (!numAge || numAge < 2 || numAge > 14) {
			setActiveTab('profile');
			setError('Please select a valid age between 2 and 14 years old! 🎂');
			return;
		}

		const activeProviderInfo =
			AI_PROVIDER_INFO[selectedProvider] ||
			AI_PROVIDER_INFO[AI_PROVIDERS.GEMINI];
		const trimmedKey = apiKeyInput.trim();
		if (!trimmedKey) {
			setActiveTab('ai');
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
			setActiveTab('ai');
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
		setStoredAccessibilitySettings(accessibility);

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
				stayOnSettings: shouldStay,
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


	return {
		hasProfile,
		handleAttemptLeave,
		saveSuccess,
		setSaveSuccess,
		activeTab,
		setActiveTab,
		isFormLocked,
		isValidating,
		handleSave,
		showUnsavedModal,
		setShowUnsavedModal,
		handleSaveAndLeave,
		handleRevertAndLeave,
		isCrewModalOpen,
		setIsCrewModalOpen,
		crewMembers,
		handleTriggerImportBackup,
		handleExportBackup,
		backupStatus,
		backupFileInputRef,
		handleBackupFileChange,
		setBackupStatus,
		nameInput,
		setNameInput,
		error,
		setError,
		ageInput,
		setAgeInput,
		isMandatoryTimer,
		setTimerEnabled,
		genderInput,
		avatarInput,
		handleGenderSelect,
		avatarCategoryFilter,
		setAvatarCategoryFilter,
		filteredAvatars,
		handleAvatarSelect,
		selectedProvider,
		handleSelectProvider,
		providerKeys,
		isKeyError,
		copyBlockedMessage,
		apiKeyInput,
		isRevealed,
		handlePasteKey,
		handleKeyChange,
		handleKeyBlur,
		handleBlockCopy,
		handleKeyDownKey,
		hasCachedGeminiModels,
		isFetchingModels,
		handleFetchLiveModels,
		modelsList,
		selectedModel,
		fetchModelStatus,
		setFetchModelStatus,
		modelSearchQuery,
		setModelSearchQuery,
		filteredModels,
		setSelectedModel,
		setProviderModels,
		isModelRateLimited,
		timerEnabled,
		timerSeconds,
		setTimerSeconds,
		isCustomTimer,
		setIsCustomTimer,
		handleStepTimer,
		autoAdvanceEnabled,
		setAutoAdvanceEnabled,
		autoAdvanceSeconds,
		setAutoAdvanceSeconds,
		isCustomAutoAdvance,
		setIsCustomAutoAdvance,
		handleStepAutoAdvance,
		showVisualDiagrams,
		setShowVisualDiagrams,
		selectedPersonality,
		setSelectedPersonality,
		ambientAudioEnabled,
		setAmbientAudioEnabled,
		ambientAudioVolume,
		setAmbientAudioVolume,
		startAmbientSound,
		stopAmbientSound,
		setAmbientVolume,
		isAmbientSoundPlaying,
		selectedVoiceURI,
		setSelectedVoiceURI,
		availableVoices,
		voiceSearchQuery,
		setVoiceSearchQuery,
		filteredVoices,
		accessibility,
		handleLanguageSelect,
		handleToggleDyslexic,
		handleToggleOled,
		handleToggleSensoryAudio,
	};
}

export default useSettingsState;
