import { Edit2, Gauge, Settings, Sparkles, Users } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import {
	CARD_DENSITY_STORAGE_KEY,
	DEFAULT_QUESTION_TIMER_SECONDS,
	SUGGESTED_SKILLSETS_STORAGE_KEY,
} from '../../constants';
import {
	getStoredApiKey,
	suggestSkillsetDetails,
} from '../../services/aiGenerator';
import { playButtonPop } from '../../utils/audioSynthesis';
import { KidAvatar } from '../../utils/avatarManager';
import {
	exportFullBackupToJsonFile,
	importFullBackupFromJson,
} from '../../utils/backupManager';
import {
	COLOR_THEMES,
	deleteCustomSkillset,
	getAllSkillsets,
	saveCustomSkillset,
} from '../../utils/skillManager';
import { generatePrintableWorksheet } from '../../utils/worksheetGenerator';
import {
	CreateSkillsetModal,
	MissionParametersCard,
	PredefinedFeaturesGrid,
	SkillDeleteModal,
	SkillInfoModal,
	SkillsetsGrid,
} from './components';

const SkillSelectionDashboard = memo(function SkillSelectionDashboard({
	onSelectSkill,
	soundEnabled,
	kidName,
	kidAge = 5,
	kidAvatar = 'boy-astronaut-1',
	onOpenSettings,
	onOpenCrewModal,
	onStartTimeWarp,
	onOpenObservatory,
	onOpenPlanetarium,
	onOpenOdyssey,
	onOpenHabitat,
	onOpenEducatorPortal,
	onAnimationComplete,
	timerConfig = {
		enabled: false,
		secondsPerQuestion: DEFAULT_QUESTION_TIMER_SECONDS,
		autoAdvanceEnabled: true,
		autoAdvanceSeconds: 7,
	},
	showVisualDiagrams = false,
	onToggleVisualDiagrams,
	dashboardToast = null,
	onClearDashboardToast,
	onUpdateSettings,
	onOpenPerformanceModal,
}) {
	const [skillsets, setSkillsets] = useState(() => getAllSkillsets());
	const [infoModalSkill, setInfoModalSkill] = useState(null);
	const [skillToDelete, setSkillToDelete] = useState(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [toastMessage, setToastMessage] = useState(null);

	// Create Modal Form State
	const [newSkillName, setNewSkillName] = useState('');
	const [newSkillTagline, setNewSkillTagline] = useState('');
	const [newSkillDesc, setNewSkillDesc] = useState('');
	const [newSkillIcon, setNewSkillIcon] = useState('Rocket');
	const [newSkillColor, setNewSkillColor] = useState('emerald');
	const [createError, setCreateError] = useState('');
	const [isAiSuggesting, setIsAiSuggesting] = useState(false);
	const [suggestMode, setSuggestMode] = useState(null); // 'random' | 'autofill' | null
	const [aiSuggestSuccess, setAiSuggestSuccess] = useState(false);
	const [recentSuggestedTopics, setRecentSuggestedTopics] = useState(() => {
		try {
			const saved = sessionStorage.getItem(SUGGESTED_SKILLSETS_STORAGE_KEY);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});
	const [lastSurpriseGeneratedName, setLastSurpriseGeneratedName] =
		useState('');

	const [hasApiKey, setHasApiKey] = useState(false);
	const [cardSize, setCardSize] = useState(() => {
		try {
			if (typeof localStorage !== 'undefined') {
				return localStorage.getItem(CARD_DENSITY_STORAGE_KEY) || 'standard';
			}
			return 'standard';
		} catch {
			return 'standard';
		}
	});

	const handleSetCardSize = (size) => {
		setCardSize(size);
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(CARD_DENSITY_STORAGE_KEY, size);
			}
		} catch {}
	};

	const [animationPhase, setAnimationPhase] = useState('center'); // 'center' | 'shrinking' | 'docked'

	const fileInputRef = useRef(null);
	const createModalRef = useRef(null);

	const isIntroActive = animationPhase !== 'docked';

	// Scroll to top by default on mount
	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}, []);

	// Handle external toast announcements (e.g. from settings import)
	useEffect(() => {
		if (dashboardToast) {
			setToastMessage(dashboardToast);
			const timer = setTimeout(() => {
				setToastMessage(null);
				if (onClearDashboardToast) onClearDashboardToast();
			}, 4500);
			return () => clearTimeout(timer);
		}
	}, [dashboardToast, onClearDashboardToast]);

	useEffect(() => {
		const key = getStoredApiKey();
		setHasApiKey(Boolean(key));

		// Step 1: Display in center with big font, then start shrinking to top header
		const shrinkTimer = setTimeout(() => {
			setAnimationPhase('shrinking');
		}, 750);

		// Step 2: Settle into docked position and notify parent
		const dockTimer = setTimeout(() => {
			setAnimationPhase('docked');
			if (onAnimationComplete) {
				onAnimationComplete();
			}
		}, 1500);

		return () => {
			clearTimeout(shrinkTimer);
			clearTimeout(dockTimer);
		};
	}, [onAnimationComplete]);

	// Modal escape and keyboard accessibility
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				if (isCreateModalOpen) setIsCreateModalOpen(false);
				if (infoModalSkill) setInfoModalSkill(null);
				if (skillToDelete) setSkillToDelete(null);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isCreateModalOpen, infoModalSkill, skillToDelete]);

	const handleCardClick = (skillName) => {
		playButtonPop(soundEnabled);
		onSelectSkill(skillName);
	};

	const handleModeClick = (mode) => {
		playButtonPop(soundEnabled);
		if (mode.id === 'worksheets') {
			handleDownloadWorksheet();
		} else if (mode.id === 'odyssey' && onOpenOdyssey) {
			onOpenOdyssey();
		} else if (mode.id === 'habitat' && onOpenHabitat) {
			onOpenHabitat();
		} else if (mode.id === 'timewarp' && onStartTimeWarp) {
			onStartTimeWarp();
		} else if (mode.id === 'observatory' && onOpenObservatory) {
			onOpenObservatory();
		} else if (mode.id === 'planetarium' && onOpenPlanetarium) {
			onOpenPlanetarium();
		} else if (mode.id === 'educator' && onOpenEducatorPortal) {
			onOpenEducatorPortal();
		} else if (mode.id === 'performance' && onOpenPerformanceModal) {
			onOpenPerformanceModal();
		}
	};

	const handleInfoClick = (e, skill) => {
		e.stopPropagation();
		playButtonPop(soundEnabled);
		setInfoModalSkill(skill);
	};

	const handleOpenCreateModal = () => {
		playButtonPop(soundEnabled);
		setNewSkillName('');
		setNewSkillTagline('');
		setNewSkillDesc('');
		setNewSkillIcon('🚀');
		setNewSkillColor('emerald');
		setCreateError('');
		setIsAiSuggesting(false);
		setAiSuggestSuccess(false);
		setLastSurpriseGeneratedName('');
		setIsCreateModalOpen(true);
	};

	const handleSelectPreset = (preset) => {
		playButtonPop(soundEnabled);
		setNewSkillName(preset.name);
		setNewSkillTagline(preset.tagline);
		setNewSkillDesc(preset.description);
		setNewSkillIcon(preset.icon);
		setNewSkillColor(preset.color);
		setCreateError('');
		setAiSuggestSuccess(false);
		setLastSurpriseGeneratedName(preset.name);
	};

	const recordSuggestedTopic = (topicName) => {
		if (!topicName) return;
		setRecentSuggestedTopics((prev) => {
			const filtered = prev.filter(
				(t) => t.toLowerCase() !== topicName.toLowerCase(),
			);
			const updated = [...filtered, topicName].slice(-30);
			try {
				sessionStorage.setItem(
					SUGGESTED_SKILLSETS_STORAGE_KEY,
					JSON.stringify(updated),
				);
			} catch {
				// ignore
			}
			return updated;
		});
	};

	const handleAiSuggestSkillset = async (options = {}) => {
		const isRandomRequest = Boolean(options?.isRandom);
		playButtonPop(soundEnabled);
		const apiKey = getStoredApiKey();
		const hasNoName = !newSkillName.trim();
		const forceRandom = isRandomRequest || hasNoName;

		// If user requested autofill but name is empty or unchanged from surprise generation
		if (!isRandomRequest) {
			if (hasNoName) {
				setCreateError(
					'Please type a topic or keyword in the Skillset Name field first to use Auto-Fill! ✏️',
				);
				return;
			}
			if (
				lastSurpriseGeneratedName &&
				newSkillName.trim().toLowerCase() ===
					lastSurpriseGeneratedName.toLowerCase()
			) {
				setCreateError(
					'This topic was already formulated by Surprise Me! Edit or customize the skillset name to use Auto-Fill. ✏️',
				);
				return;
			}
		}

		// If user typed a specific name without an API key, notify them they need an API key to complete their custom topic
		if (!apiKey && !forceRandom) {
			setCreateError(
				'Please configure your Google Gemini API Key in Settings first to auto-complete your custom topic! 🔑 Or click "Surprise Me 🎲" to generate an exciting topic instantly.',
			);
			return;
		}

		setSuggestMode(forceRandom ? 'random' : 'autofill');
		setIsAiSuggesting(true);
		setCreateError('');
		setAiSuggestSuccess(false);

		try {
			const suggestion = await suggestSkillsetDetails({
				name: forceRandom ? '' : newSkillName,
				tagline: forceRandom ? '' : newSkillTagline,
				description: forceRandom ? '' : newSkillDesc,
				kidAge,
				excludedTopics: recentSuggestedTopics,
				isRandom: forceRandom,
			});

			setNewSkillName(suggestion.name);
			setNewSkillTagline(suggestion.tagline);
			setNewSkillDesc(suggestion.description);
			if (suggestion.icon) setNewSkillIcon(suggestion.icon);
			if (suggestion.color && COLOR_THEMES[suggestion.color]) {
				setNewSkillColor(suggestion.color);
			}

			recordSuggestedTopic(suggestion.name);
			setLastSurpriseGeneratedName(suggestion.name.trim());

			setAiSuggestSuccess(
				forceRandom ?
					`✨ Generated random topic: "${suggestion.name}"! Click "Surprise Me 🎲" again for another topic.`
				:	`✓ Successfully auto-filled skillset details for "${suggestion.name}"!`,
			);
			playButtonPop(soundEnabled);
			setTimeout(() => setAiSuggestSuccess(false), 5000);
		} catch (err) {
			console.error('AI Suggest Skillset Failed:', err);
			if (err.message === 'MISSING_API_KEY') {
				setCreateError(
					'Google Gemini API Key is required! Please enter your key in Settings, or click "Surprise Me 🎲".',
				);
			} else {
				setCreateError(
					err.message ||
						'Could not generate skillset suggestion. Please check your API key or network connection.',
				);
			}
		} finally {
			setIsAiSuggesting(false);
			setSuggestMode(null);
		}
	};

	const handleSaveNewSkill = (e) => {
		if (e) e.preventDefault();
		try {
			const created = saveCustomSkillset({
				name: newSkillName,
				description: newSkillDesc,
				tagline: newSkillTagline,
				icon: newSkillIcon,
				color: newSkillColor,
			});
			setSkillsets(getAllSkillsets());
			setIsCreateModalOpen(false);
			playButtonPop(soundEnabled);
			setToastMessage(`✓ Added new skillset "${created.name}"!`);
			setTimeout(() => setToastMessage(null), 3500);
		} catch (err) {
			setCreateError(err.message);
		}
	};

	const handleRequestDelete = (e, skill) => {
		e.stopPropagation();
		playButtonPop(soundEnabled);
		setSkillToDelete(skill);
	};

	const handleConfirmDelete = () => {
		if (!skillToDelete) return;
		playButtonPop(soundEnabled);
		try {
			deleteCustomSkillset(skillToDelete.name);
			setSkillsets(getAllSkillsets());
			setToastMessage(`Skillset "${skillToDelete.name}" deleted.`);
			setTimeout(() => setToastMessage(null), 3000);
		} catch (err) {
			console.error(err);
		}
		setSkillToDelete(null);
	};

	const handleExportSkills = () => {
		playButtonPop(soundEnabled);
		try {
			exportFullBackupToJsonFile();
			setToastMessage('✓ Downloaded complete backup (settings + skillsets)!');
			setTimeout(() => setToastMessage(null), 3000);
		} catch (err) {
			setToastMessage(`Export failed: ${err.message}`);
			setTimeout(() => setToastMessage(null), 3000);
		}
	};

	const handleTriggerImport = () => {
		playButtonPop(soundEnabled);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const result = importFullBackupFromJson(event.target?.result);
				setSkillsets(getAllSkillsets());
				if (onUpdateSettings) {
					onUpdateSettings();
				}
				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
				document.documentElement.scrollTop = 0;
				document.body.scrollTop = 0;
				const msg =
					result.importedSettings ?
						`✓ Imported settings & ${result.importedSkillCount} custom skillset(s)!`
					:	`✓ Successfully imported ${result.importedSkillCount} custom skillset(s)!`;
				setToastMessage(msg);
				setTimeout(() => setToastMessage(null), 4000);
			} catch (err) {
				setToastMessage(`⚠️ Import failed: ${err.message}`);
				setTimeout(() => setToastMessage(null), 4000);
			}
		};
		reader.readAsText(file);
	};

	const handleDownloadWorksheet = async () => {
		playButtonPop(soundEnabled);
		try {
			await generatePrintableWorksheet({
				title: 'AstroQuest Cosmic Mission',
				skillName: 'Visual & Logic Explorations',
				studentName: kidName,
				studentAge: kidAge,
			});
			setToastMessage('🖨️ Printable Cosmic Worksheet downloaded!');
			setTimeout(() => setToastMessage(null), 4000);
		} catch (err) {
			console.error('Print worksheet error:', err);
		}
	};

	const hasTypedName = Boolean(newSkillName?.trim());
	const isGeneratedNameUnchanged = Boolean(
		lastSurpriseGeneratedName &&
		newSkillName.trim().toLowerCase() ===
			lastSurpriseGeneratedName.toLowerCase(),
	);
	const canAutoFill =
		hasTypedName && !isGeneratedNameUnchanged && !isAiSuggesting;

	return (
		<div className='min-h-screen space-background flex flex-col justify-between text-white font-sans overflow-x-hidden select-none p-4 sm:p-6'>
			{/* Hidden file input for importing backup */}
			<input
				type='file'
				ref={fileInputRef}
				accept='.json,application/json'
				className='hidden'
				onChange={handleFileChange}
			/>

			{/* Floating feedback toast notification */}
			{toastMessage && (
				<div
					role='status'
					aria-live='polite'
					className='fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#16194E] border border-cyan-400 text-white font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-3'>
					<Sparkles className='w-4 h-4 text-amber-300 flex-shrink-0' />
					<span>{toastMessage}</span>
				</div>
			)}

			{/* Top Header Bar */}
			<header className='w-full max-w-5xl mx-auto flex items-center justify-between gap-2 relative z-10'>
				{/* Combined Explorer Cadet & Flight Crew Capsule */}
				<div
					className={`flex items-center bg-gradient-to-r from-purple-950/80 via-[#131745] to-cyan-950/80 border border-purple-500/40 hover:border-cyan-400/60 p-0.5 sm:p-1 rounded-full shadow-lg transition-all flex-shrink-0 backdrop-blur-md ${
						isIntroActive ?
							'opacity-0 -translate-y-4 pointer-events-none'
						:	'opacity-100 translate-y-0'
					}`}>
					{/* Explorer Profile Details */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onOpenSettings();
						}}
						className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer group'
						title='Open Profile & Settings'>
						<KidAvatar
							avatarId={kidAvatar}
							size='xs'
							className='ring-1 ring-purple-300/60 group-hover:ring-purple-300 shadow-sm'
							alt={`${kidName || 'Explorer'} avatar`}
						/>
						<span className='text-[10px] sm:text-xs font-black text-white whitespace-nowrap tracking-tight sm:tracking-wide'>
							{kidName || 'Explorer'} ({kidAge || 5}y)
						</span>
						<Edit2 className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-300/80 group-hover:text-pink-300 flex-shrink-0' />
					</button>

					{/* Subtle Divider */}
					{onOpenCrewModal && (
						<div className='w-px h-3.5 sm:h-4 bg-white/20 mx-0.5 sm:mx-1 flex-shrink-0' />
					)}

					{/* Crew Switcher Action */}
					{onOpenCrewModal && (
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								onOpenCrewModal();
							}}
							className='flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full hover:bg-cyan-500/20 text-cyan-300 hover:text-white active:scale-95 transition-all cursor-pointer group'
							title='Switch Flight Crew Astronaut Profile'>
							<Users className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 group-hover:scale-110 transition-transform' />
							<span className='text-[10px] sm:text-xs font-black'>Crew</span>
						</button>
					)}
				</div>

				{/* Center ThinkSheet Badge with Animated Shrink-to-Top Transition */}
				{animationPhase !== 'docked' ?
					<>
						{/* Placeholder so header layout stays aligned */}
						<div className='w-28 sm:w-48 h-10 sm:h-12 invisible flex-shrink' />

						{/* Animated Floating Thinksheet Banner */}
						<div
							className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] flex items-center justify-center pointer-events-none ${
								animationPhase === 'center' ?
									'top-1/2 -translate-y-1/2 scale-110 sm:scale-135'
								:	'top-6 -translate-y-0 scale-100'
							}`}>
							<div
								className={`bg-[#22C55E] text-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#16A34A] flex items-center justify-center transition-all duration-700 shadow-2xl ${
									animationPhase === 'center' ?
										'px-10 py-5 sm:px-14 sm:py-6 shadow-[0_0_80px_rgba(34,197,94,0.8)] animate-pulse-glow'
									:	'px-4 sm:px-8 py-1.5 sm:py-2.5 shadow-xl'
								}`}>
								<h1
									className={`font-black tracking-wide drop-shadow-md text-white transition-all duration-700 flex items-center gap-2 sm:gap-3 ${
										animationPhase === 'center' ?
											'text-4xl sm:text-6xl md:text-7xl font-heading'
										:	'text-base sm:text-2xl font-heading'
									}`}>
									{animationPhase === 'center' && (
										<Sparkles className='w-7 h-7 sm:w-10 sm:h-10 text-yellow-300 animate-spin-slow' />
									)}
									<span>AstroQuest</span>
									{animationPhase === 'center' && (
										<span className='text-3xl sm:text-5xl animate-bounce'>
											🚀
										</span>
									)}
								</h1>
							</div>
							{/* Decorative side ribbon tabs */}
							<div className='absolute -left-2 top-2.5 sm:top-3 w-2.5 sm:w-3 h-4 sm:h-5 bg-white rounded-l-md opacity-90 shadow-sm' />
							<div className='absolute -right-2 top-2.5 sm:top-3 w-2.5 sm:w-3 h-4 sm:h-5 bg-white rounded-r-md opacity-90 shadow-sm' />
						</div>
					</>
				:	/* Fully Docked Header Badge in Normal DOM Flow */
					<div className='relative flex items-center justify-center animate-in fade-in duration-300 flex-shrink-0'>
						<div className='bg-[#22C55E] text-white px-3 sm:px-8 py-1 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl border-2 border-[#16A34A] flex items-center justify-center'>
							<h1 className='text-sm sm:text-2xl font-black tracking-wide drop-shadow-md font-heading'>
								AstroQuest
							</h1>
						</div>
						{/* Decorative side ribbon tabs */}
						<div className='absolute -left-2 top-2 w-2.5 sm:w-3 h-4 sm:h-5 bg-white rounded-l-md opacity-90 shadow-sm' />
						<div className='absolute -right-2 top-2 w-2.5 sm:w-3 h-4 sm:h-5 bg-white rounded-r-md opacity-90 shadow-sm' />
					</div>
				}

				<div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
					{/* Performance Observatory Button */}
					{onOpenPerformanceModal && (
						<button
							onClick={() => {
								playButtonPop(soundEnabled);
								onOpenPerformanceModal();
							}}
							className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-lg transition-all duration-700 border border-fuchsia-400/40 bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30 cursor-pointer ${
								isIntroActive ?
									'opacity-0 -translate-y-4 pointer-events-none'
								:	'opacity-100 translate-y-0'
							}`}
							title='Open Live Performance Observatory & Benchmarks'>
							<Gauge className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-fuchsia-300' />
							<span className='hidden sm:inline'>Performance</span>
						</button>
					)}

					{/* Settings Button */}
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onOpenSettings();
						}}
						className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-lg transition-all duration-700 border cursor-pointer flex-shrink-0 ${
							hasApiKey ?
								'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
							:	'bg-rose-500/30 text-rose-200 border-rose-400/50 hover:bg-rose-500/40 animate-pulse'
						} ${
							isIntroActive ?
								'opacity-0 -translate-y-4 pointer-events-none'
							:	'opacity-100 translate-y-0'
						}`}
						title='Open Profile & Settings'>
						<Settings className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300' />
						<span>Settings</span>
					</button>
				</div>
			</header>

			{/* Main Content Area */}
			<main
				className={`w-full max-w-5xl mx-auto flex flex-col items-center flex-1 justify-center py-4 sm:py-6 transition-all duration-700 delay-100 ${
					isIntroActive ?
						'opacity-0 translate-y-8 pointer-events-none'
					:	'opacity-100 translate-y-0'
				}`}>
				{/* Mission Parameters & Quest Controls Card */}
				<MissionParametersCard
					timerConfig={timerConfig}
					soundEnabled={soundEnabled}
					cardSize={cardSize}
					handleSetCardSize={handleSetCardSize}
					hasApiKey={hasApiKey}
					onOpenSettings={onOpenSettings}
					showVisualDiagrams={showVisualDiagrams}
					onToggleVisualDiagrams={onToggleVisualDiagrams}
				/>

				{/* Predefined Cosmic Challenges & Exploration Card with Section Border */}
				<PredefinedFeaturesGrid
					cardSize={cardSize}
					handleModeClick={handleModeClick}
				/>

				{/* Cosmic Missions Section Card with Section Border */}
				<SkillsetsGrid
					cardSize={cardSize}
					handleSetCardSize={handleSetCardSize}
					soundEnabled={soundEnabled}
					skillsets={skillsets}
					handleCardClick={handleCardClick}
					handleInfoClick={handleInfoClick}
					handleRequestDelete={handleRequestDelete}
					handleTriggerImport={handleTriggerImport}
					handleExportSkills={handleExportSkills}
					handleOpenCreateModal={handleOpenCreateModal}
				/>
			</main>

			{/* Modal: Create Custom Skillset */}
			<CreateSkillsetModal
				isCreateModalOpen={isCreateModalOpen}
				setIsCreateModalOpen={setIsCreateModalOpen}
				createModalRef={createModalRef}
				hasApiKey={hasApiKey}
				isAiSuggesting={isAiSuggesting}
				suggestMode={suggestMode}
				handleAiSuggestSkillset={handleAiSuggestSkillset}
				aiSuggestSuccess={aiSuggestSuccess}
				canAutoFill={canAutoFill}
				hasTypedName={hasTypedName}
				isGeneratedNameUnchanged={isGeneratedNameUnchanged}
				handleSelectPreset={handleSelectPreset}
				newSkillName={newSkillName}
				setNewSkillName={setNewSkillName}
				newSkillTagline={newSkillTagline}
				setNewSkillTagline={setNewSkillTagline}
				newSkillDesc={newSkillDesc}
				setNewSkillDesc={setNewSkillDesc}
				newSkillIcon={newSkillIcon}
				setNewSkillIcon={setNewSkillIcon}
				newSkillColor={newSkillColor}
				setNewSkillColor={setNewSkillColor}
				createError={createError}
				setCreateError={setCreateError}
				handleSaveNewSkill={handleSaveNewSkill}
				handleOpenSettings={() => {
					setIsCreateModalOpen(false);
					onOpenSettings();
				}}
				soundEnabled={soundEnabled}
			/>

			{/* Modal: Skillset Info Modal */}
			<SkillInfoModal
				infoModalSkill={infoModalSkill}
				setInfoModalSkill={setInfoModalSkill}
				onSelectSkill={onSelectSkill}
				handlePrintWorksheet={handleDownloadWorksheet}
				soundEnabled={soundEnabled}
			/>

			{/* Modal: Delete Skillset Confirmation Modal */}
			<SkillDeleteModal
				skillToDelete={skillToDelete}
				setSkillToDelete={setSkillToDelete}
				handleConfirmDelete={handleConfirmDelete}
				soundEnabled={soundEnabled}
			/>
		</div>
	);
});

export default SkillSelectionDashboard;
