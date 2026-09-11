import {
	AlertTriangle,
	Check,
	Clock,
	Download,
	Edit2,
	Eye,
	EyeOff,
	Info,
	Plus,
	RefreshCw,
	Settings,
	Sparkles,
	Timer,
	Trash2,
	Upload,
	X,
} from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
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
	SKILLSET_PRESETS,
} from '../../utils/skillManager';

const POPULAR_EMOJIS = [
	'🚀',
	'🪐',
	'🧠',
	'👁️',
	'🔬',
	'📐',
	'🌿',
	'⭐',
	'🧩',
	'🎨',
	'📚',
	'⚡',
	'💡',
	'🐾',
	'🎯',
	'🔢',
	'🦖',
	'🤖',
	'🌍',
	'🧪',
];

const SkillSelectionDashboard = memo(function SkillSelectionDashboard({
	onSelectSkill,
	soundEnabled,
	kidName,
	kidAge = 5,
	kidAvatar = 'boy-astronaut-1',
	onOpenSettings,
	onAnimationComplete,
	timerConfig = {
		enabled: false,
		secondsPerQuestion: 90,
		autoAdvanceEnabled: true,
		autoAdvanceSeconds: 7,
	},
	showVisualDiagrams = false,
	dashboardToast = null,
	onClearDashboardToast,
	onUpdateSettings,
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
	const [newSkillIcon, setNewSkillIcon] = useState('🚀');
	const [newSkillColor, setNewSkillColor] = useState('emerald');
	const [createError, setCreateError] = useState('');
	const [isAiSuggesting, setIsAiSuggesting] = useState(false);
	const [aiSuggestSuccess, setAiSuggestSuccess] = useState(false);

	const [hasApiKey, setHasApiKey] = useState(false);
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
	};

	const handleAiSuggestSkillset = async () => {
		playButtonPop(soundEnabled);
		const apiKey = getStoredApiKey();
		if (!apiKey) {
			setCreateError(
				'Please configure your Google Gemini API Key in Settings first to use AI Auto-Fill! 🔑',
			);
			return;
		}

		setIsAiSuggesting(true);
		setCreateError('');
		setAiSuggestSuccess(false);

		try {
			const suggestion = await suggestSkillsetDetails({
				name: newSkillName,
				tagline: newSkillTagline,
				description: newSkillDesc,
				kidAge,
			});

			setNewSkillName(suggestion.name);
			setNewSkillTagline(suggestion.tagline);
			setNewSkillDesc(suggestion.description);
			if (suggestion.icon) setNewSkillIcon(suggestion.icon);
			if (suggestion.color && COLOR_THEMES[suggestion.color]) {
				setNewSkillColor(suggestion.color);
			}

			setAiSuggestSuccess(true);
			playButtonPop(soundEnabled);
			setTimeout(() => setAiSuggestSuccess(false), 4500);
		} catch (err) {
			console.error('AI Suggest Skillset Failed:', err);
			if (err.message === 'MISSING_API_KEY') {
				setCreateError(
					'Google Gemini API Key is required! Please enter your key in Settings.',
				);
			} else {
				setCreateError(
					err.message ||
						'Could not generate skillset suggestion. Please check your API key or network connection.',
				);
			}
		} finally {
			setIsAiSuggesting(false);
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
				{/* Child Profile Badge with Personalized Avatar */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onOpenSettings();
					}}
					className={`flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 hover:border-purple-400 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0 ${
						isIntroActive ?
							'opacity-0 -translate-y-4 pointer-events-none'
						:	'opacity-100 translate-y-0'
					}`}
					title='Open Profile & Settings'>
					<KidAvatar
						avatarId={kidAvatar}
						size='xs'
						className='ring-1 ring-purple-300/60 shadow-sm'
						alt={`${kidName || 'Explorer'} avatar`}
					/>
					<span className='text-[10px] sm:text-xs font-black text-white whitespace-nowrap tracking-tight sm:tracking-wide'>
						{kidName || 'Explorer'} ({kidAge || 5}y)
					</span>
					<Edit2 className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-300 opacity-80 flex-shrink-0' />
				</button>

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
			</header>

			{/* Main Content Area */}
			<main
				className={`w-full max-w-5xl mx-auto flex flex-col items-center flex-1 justify-center py-4 sm:py-6 transition-all duration-700 delay-100 ${
					isIntroActive ?
						'opacity-0 translate-y-8 pointer-events-none'
					:	'opacity-100 translate-y-0'
				}`}>
				{/* Status Badges: AI Active & Visual Diagrams */}
				<div className='flex items-center gap-2.5 flex-wrap justify-center mb-3.5'>
					<div className='flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-200 shadow-sm'>
						<Sparkles className='w-4 h-4 text-amber-300' />
						<span>AI Question Engine Active</span>
					</div>

					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onOpenSettings();
						}}
						className={`flex items-center gap-1.5 backdrop-blur-md border px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
							showVisualDiagrams ?
								'bg-indigo-500/20 border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/30'
							:	'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
						}`}
						title='Visual Diagrams & Clues Display Setting (Click to configure)'>
						{showVisualDiagrams ?
							<>
								<Eye className='w-3.5 h-3.5 text-indigo-300' />
								<span>
									Visual Diagrams:{' '}
									<strong className='text-indigo-200'>Enabled 👁️</strong>
								</span>
							</>
						:	<>
								<EyeOff className='w-3.5 h-3.5 text-slate-400' />
								<span>
									Visual Diagrams:{' '}
									<strong className='text-slate-300'>Hidden 🙈</strong>
								</span>
							</>
						}
					</button>
				</div>

				{/* Question Timer & Settings Summary Card */}
				<div className='w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-4 sm:mb-5 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4'>
					{/* Left: Info */}
					<div className='flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto min-w-0'>
						<div
							className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center border flex-shrink-0 transition-all ${
								timerConfig.enabled ?
									'bg-amber-400/20 border-amber-400/40 text-amber-300'
								:	'bg-white/10 border-white/20 text-slate-300'
							}`}>
							<Clock className='w-4 h-4 sm:w-5 sm:h-5' />
						</div>
						<div className='min-w-0 flex-1'>
							<div className='flex items-center gap-2'>
								<span className='font-extrabold text-xs sm:text-base text-white truncate'>
									⚙️ Quest Settings & Pacing
								</span>
							</div>
							<div className='text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5 flex items-center gap-x-2 gap-y-0.5 flex-wrap'>
								<span>
									Timer:{' '}
									<strong className='text-amber-300'>
										{timerConfig.enabled ?
											`${timerConfig.secondsPerQuestion}s`
										:	'Unlimited'}
									</strong>
								</span>
								<span className='opacity-60'>•</span>
								<span>
									Next:{' '}
									<strong className='text-cyan-300'>
										{timerConfig.autoAdvanceEnabled ?
											`Auto in ${timerConfig.autoAdvanceSeconds || 7}s`
										:	'Manual'}
									</strong>
								</span>
								<span className='opacity-60'>•</span>
								<span>
									Diagrams:{' '}
									<strong className='text-indigo-300'>
										{showVisualDiagrams ? 'Shown 👁️' : 'Hidden 🙈'}
									</strong>
								</span>
							</div>
						</div>
					</div>

					{/* Right: Settings button */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onOpenSettings();
						}}
						className='w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer flex-shrink-0'>
						<Timer className='w-3.5 h-3.5 text-amber-300' />
						<span>Configure Settings</span>
					</button>
				</div>

				{/* Section Header with Action Buttons */}
				<div className='w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4'>
					<div>
						<h2 className='text-xl sm:text-2xl font-extrabold text-white tracking-wide drop-shadow'>
							Choose Your Cosmic Mission 🚀
						</h2>
						<p className='text-xs text-slate-300 font-semibold mt-0.5'>
							Select any built-in skill or create custom topics powered by
							Google Gemini AI.
						</p>
					</div>

					{/* Skillset Tools: Add, Import, Export */}
					<div className='flex items-center gap-2 flex-wrap'>
						<button
							type='button'
							onClick={handleTriggerImport}
							className='px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer'
							title='Import complete backup or skillsets from JSON file'>
							<Upload className='w-3.5 h-3.5 text-cyan-300' />
							<span>Import JSON</span>
						</button>

						<button
							type='button'
							onClick={handleExportSkills}
							className='px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer'
							title='Export complete backup (settings + skillsets) to JSON file'>
							<Download className='w-3.5 h-3.5 text-amber-300' />
							<span>Export JSON</span>
						</button>

						<button
							type='button'
							onClick={handleOpenCreateModal}
							className='px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer'>
							<Plus className='w-4 h-4' />
							<span>Add Custom Skill</span>
						</button>
					</div>
				</div>

				{/* Responsive Skill Cards Grid */}
				<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{skillsets.map((skill) => {
						const theme = COLOR_THEMES[skill.color] || COLOR_THEMES.cyan;
						const isCustom = !skill.isDefault;

						return (
							<div
								key={skill.id || skill.name}
								role='button'
								tabIndex={0}
								aria-label={`Start ${skill.name} Thinksheet: ${skill.tagline || ''}`}
								onClick={() => handleCardClick(skill.name)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleCardClick(skill.name);
									}
								}}
								className={`group bg-white text-slate-800 rounded-3xl p-5 shadow-2xl border-4 ${theme.cardBorder} cursor-pointer transform hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 flex flex-col justify-between min-h-[230px] focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none relative`}>
								<div>
									{/* Top Bar: Icon, Name, Tagline & Actions */}
									<div className='flex items-start justify-between gap-2 mb-3'>
										<div className='flex items-center gap-2.5'>
											<div
												aria-hidden='true'
												className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${theme.badgeColor}`}>
												{skill.icon || '🚀'}
											</div>
											<div>
												<h3 className='text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors leading-tight'>
													{skill.name}
												</h3>
												<span className='text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5'>
													{skill.tagline || 'Cognitive Challenge'}
												</span>
											</div>
										</div>

										{/* Action Icons */}
										<div className='flex items-center gap-1'>
											{isCustom && (
												<button
													type='button'
													onClick={(e) => handleRequestDelete(e, skill)}
													onKeyDown={(e) => e.stopPropagation()}
													aria-label={`Delete custom skill ${skill.name}`}
													className='p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer'
													title='Delete this custom skill'>
													<Trash2 className='w-4 h-4' />
												</button>
											)}

											<button
												type='button'
												onClick={(e) => handleInfoClick(e, skill)}
												onKeyDown={(e) => e.stopPropagation()}
												aria-label={`About ${skill.name} Skill`}
												className='p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer'
												title={`About ${skill.name}`}>
												<Info className='w-4 h-4' />
											</button>
										</div>
									</div>

									{/* Custom Skill Indicator Badge */}
									{isCustom && (
										<div className='mb-2'>
											<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200'>
												<Sparkles className='w-2.5 h-2.5' />
												<span>Custom Skill</span>
											</span>
										</div>
									)}

									{/* Description */}
									<p className='text-xs text-slate-600 font-semibold leading-relaxed line-clamp-3 mb-3'>
										{skill.description}
									</p>
								</div>

								{/* Card Footer: Action Button */}
								<div className='flex items-center justify-end pt-3 border-t border-slate-100'>
									<div
										aria-hidden='true'
										className={`w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-white font-extrabold text-xs shadow-md group-hover:scale-105 transition-all flex items-center justify-center gap-1.5`}>
										<span>Start {skill.name}</span>
										<span>➔</span>
									</div>
								</div>
							</div>
						);
					})}

					{/* Card: Add Custom Skillset Shortcut */}
					<div
						role='button'
						tabIndex={0}
						aria-label='Create and add a new custom skillset'
						onClick={handleOpenCreateModal}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleOpenCreateModal();
							}
						}}
						className='group bg-white/5 hover:bg-white/10 border-2 border-dashed border-cyan-400/50 hover:border-cyan-300 rounded-3xl p-5 shadow-xl cursor-pointer transform hover:-translate-y-1.5 transition-all duration-200 flex flex-col items-center justify-center min-h-[230px] text-center focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none'>
						<div className='w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-2.5 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all'>
							<Plus className='w-6 h-6' />
						</div>
						<h3 className='text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors'>
							Add Custom Skillset
						</h3>
						<p className='text-[11px] text-slate-300 font-semibold mt-1 max-w-xs'>
							Create any learning topic and let Gemini AI craft real-time
							questions!
						</p>
						<div className='mt-3.5 px-4 py-1.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-xs border border-cyan-400/30 group-hover:bg-cyan-400/30 transition-all flex items-center gap-1'>
							<Plus className='w-3.5 h-3.5' />
							<span>Create Topic</span>
						</div>
					</div>
				</div>
			</main>

			{/* Modal: Create Custom Skillset */}
			{isCreateModalOpen && (
				<div
					role='dialog'
					aria-modal='true'
					aria-labelledby='create-skill-title'
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto'
					onClick={() => setIsCreateModalOpen(false)}>
					<div
						ref={createModalRef}
						className='bg-gradient-to-b from-[#16194E] via-[#10133A] to-[#0A0C27] border-2 border-cyan-400/80 rounded-3xl p-5 sm:p-7 max-w-xl w-full text-white shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto'
						onClick={(e) => e.stopPropagation()}>
						{/* Close button */}
						<button
							type='button'
							onClick={() => setIsCreateModalOpen(false)}
							className='absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer'
							aria-label='Close modal'>
							<X className='w-5 h-5' />
						</button>

						<div className='flex items-center gap-3 mb-4'>
							<div className='w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xl'>
								✨
							</div>
							<div>
								<h3
									id='create-skill-title'
									className='text-xl font-black text-white'>
									Create New Cosmic Skillset
								</h3>
								<p className='text-xs text-slate-300 font-semibold'>
									AI will generate 100% custom questions matching this topic and
									description.
								</p>
							</div>
						</div>

						{/* Quick Presets / Templates */}
						<div className='mb-4'>
							<span className='text-xs font-bold text-cyan-300 block mb-1.5'>
								⚡ Quick Preset Inspiration (Click to fill):
							</span>
							<div className='flex flex-wrap gap-1.5'>
								{SKILLSET_PRESETS.map((preset) => (
									<button
										key={preset.name}
										type='button'
										disabled={isAiSuggesting}
										onClick={() => handleSelectPreset(preset)}
										className='px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-slate-200 hover:text-cyan-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50'>
										<span>{preset.icon}</span>
										<span>{preset.name}</span>
									</button>
								))}
							</div>
						</div>

						{/* AI Smart Auto-Fill Card */}
						<div className='mb-4 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-cyan-950/70 border border-cyan-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner'>
							<div className='flex items-center gap-2.5'>
								<div className='w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0'>
									<Sparkles className='w-4 h-4' />
								</div>
								<div>
									<h4 className='text-xs font-bold text-white flex items-center gap-1.5'>
										<span>AI Smart Auto-Fill</span>
										<span className='text-[9px] px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase font-black'>
											Gemini
										</span>
									</h4>
									<p className='text-[11px] text-slate-300'>
										Type any topic or keyword below, then click to auto-generate the complete skillset details!
									</p>
								</div>
							</div>

							<button
								type='button'
								disabled={isAiSuggesting}
								onClick={handleAiSuggestSkillset}
								className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md flex-shrink-0 w-full sm:w-auto ${
									isAiSuggesting ?
										'bg-cyan-950/80 border border-cyan-400 text-cyan-300 cursor-not-allowed animate-pulse'
									:	'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 hover:scale-105 active:scale-95 border border-amber-300 cursor-pointer'
								}`}
								title='Auto-generate skillset name, tagline, and pedagogical description using Google Gemini AI'>
								{isAiSuggesting ? (
									<>
										<RefreshCw className='w-3.5 h-3.5 animate-spin text-cyan-300' />
										<span>Generating with AI...</span>
									</>
								) : (
									<>
										<Sparkles className='w-3.5 h-3.5' />
										<span>Auto-Fill with AI</span>
									</>
								)}
							</button>
						</div>

						{/* AI Feedback Banner */}
						{aiSuggestSuccess && (
							<div
								role='status'
								aria-live='polite'
								className='mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2'>
								<Check className='w-4 h-4 text-emerald-400 flex-shrink-0' />
								<span>✓ Gemini AI successfully auto-filled the skillset name, description, tagline, and icon!</span>
							</div>
						)}

						{createError && (
							<div
								role='alert'
								className='mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-200 text-xs font-bold flex items-center gap-2'>
								<AlertTriangle className='w-4 h-4 flex-shrink-0 text-rose-400' />
								<span>{createError}</span>
							</div>
						)}

						<form
							onSubmit={handleSaveNewSkill}
							className='flex flex-col gap-4'>
							{/* Name */}
							<div>
								<div className='flex items-center justify-between mb-1'>
									<label
										htmlFor='custom-skill-name'
										className='block text-xs font-bold text-slate-300'>
										Skillset Name <span className='text-rose-400'>*</span>
									</label>
									<button
										type='button'
										disabled={isAiSuggesting}
										onClick={handleAiSuggestSkillset}
										className='text-[11px] font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50'
										title='Ask AI to suggest or complete name and description'>
										<Sparkles className='w-3 h-3 text-amber-300' />
										<span>{isAiSuggesting ? 'Thinking...' : 'AI Suggest'}</span>
									</button>
								</div>
								<input
									id='custom-skill-name'
									type='text'
									required
									disabled={isAiSuggesting}
									value={newSkillName}
									onChange={(e) => {
										setNewSkillName(e.target.value);
										if (createError) setCreateError('');
									}}
									placeholder='e.g. Space & Astronomy, Word Riddles, Nature Science'
									className='w-full bg-[#090B24] border border-cyan-400/50 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60'
								/>
							</div>

							{/* Tagline */}
							<div>
								<label
									htmlFor='custom-skill-tagline'
									className='block text-xs font-bold text-slate-300 mb-1'>
									Short Subtitle / Tagline (Optional)
								</label>
								<input
									id='custom-skill-tagline'
									type='text'
									disabled={isAiSuggesting}
									value={newSkillTagline}
									onChange={(e) => setNewSkillTagline(e.target.value)}
									placeholder='e.g. Planets & Exploration, Vocabulary & Rhymes'
									className='w-full bg-[#090B24] border border-white/20 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none disabled:opacity-60'
								/>
							</div>

							{/* Description */}
							<div>
								<label
									htmlFor='custom-skill-desc'
									className='block text-xs font-bold text-slate-300 mb-1'>
									Pedagogical Description{' '}
									<span className='text-rose-400'>*</span>
									<span className='text-[10px] text-slate-400 block font-normal'>
										Sent directly to Gemini AI prompt to guide questions
										generated for this skill.
									</span>
								</label>
								<textarea
									id='custom-skill-desc'
									required
									disabled={isAiSuggesting}
									rows={3}
									value={newSkillDesc}
									onChange={(e) => {
										setNewSkillDesc(e.target.value);
										if (createError) setCreateError('');
									}}
									placeholder='Describe the concepts, problem types, and topics the questions should cover (e.g. Identify planets, gravity riddles, constellations, and astronaut equipment)...'
									className='w-full bg-[#090B24] border border-cyan-400/50 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none disabled:opacity-60'
								/>
							</div>

							{/* Emoji Icon Picker */}
							<div>
								<span className='block text-xs font-bold text-slate-300 mb-1.5'>
									Choose Skill Icon:
								</span>
								<div className='flex items-center gap-1.5 flex-wrap mb-2'>
									{POPULAR_EMOJIS.map((emoji) => (
										<button
											key={emoji}
											type='button'
											disabled={isAiSuggesting}
											onClick={() => setNewSkillIcon(emoji)}
											className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer disabled:opacity-50 ${
												newSkillIcon === emoji ?
													'bg-cyan-500/30 border-2 border-cyan-400 scale-110 shadow-lg'
												:	'bg-white/10 hover:bg-white/20 border border-white/10'
											}`}>
											{emoji}
										</button>
									))}
								</div>
								<div className='flex items-center gap-2'>
									<span className='text-[11px] text-slate-400'>
										Selected Icon:
									</span>
									<span className='text-xl'>{newSkillIcon}</span>
									<input
										type='text'
										maxLength={4}
										disabled={isAiSuggesting}
										value={newSkillIcon}
										onChange={(e) => setNewSkillIcon(e.target.value)}
										placeholder='Type emoji'
										className='w-20 bg-[#090B24] border border-white/20 rounded-lg px-2 py-1 text-xs text-center text-white disabled:opacity-60'
									/>
								</div>
							</div>

							{/* Color Accent Picker */}
							<div>
								<span className='block text-xs font-bold text-slate-300 mb-1.5'>
									Card Color Theme:
								</span>
								<div className='flex items-center gap-2 flex-wrap'>
									{Object.entries(COLOR_THEMES).map(([key, theme]) => (
										<button
											key={key}
											type='button'
											disabled={isAiSuggesting}
											onClick={() => setNewSkillColor(key)}
											className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${theme.chipBg} ${
												newSkillColor === key ?
													'ring-2 ring-white scale-105 shadow-md'
												:	'opacity-70 hover:opacity-100'
											}`}>
											{newSkillColor === key && <Check className='w-3 h-3' />}
											<span>{theme.name}</span>
										</button>
									))}
								</div>
							</div>

							{/* Modal Footer Buttons */}
							<div className='flex items-center justify-end gap-3 pt-3 border-t border-white/10 mt-2'>
								<button
									type='button'
									disabled={isAiSuggesting}
									onClick={() => setIsCreateModalOpen(false)}
									className='px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all cursor-pointer disabled:opacity-50'>
									Cancel
								</button>
								<button
									type='submit'
									disabled={isAiSuggesting}
									className='px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
									<Sparkles className='w-4 h-4 text-amber-300' />
									<span>Save & Add Skillset</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal: Delete Confirmation */}
			{skillToDelete && (
				<div
					role='dialog'
					aria-modal='true'
					aria-labelledby='delete-skill-title'
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in'
					onClick={() => setSkillToDelete(null)}>
					<div
						className='bg-[#16194E] border-2 border-rose-500/80 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl'
						onClick={(e) => e.stopPropagation()}>
						<div className='flex items-center gap-3 mb-3'>
							<div className='w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400'>
								<Trash2 className='w-5 h-5' />
							</div>
							<div>
								<h3
									id='delete-skill-title'
									className='text-lg font-black text-white'>
									Delete Skillset?
								</h3>
								<span className='text-xs text-rose-300 font-semibold'>
									{skillToDelete.name}
								</span>
							</div>
						</div>

						<p className='text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed mb-5'>
							Are you sure you want to remove the custom skillset &ldquo;
							{skillToDelete.name}&rdquo;? Any future questions for this topic
							will no longer appear on your dashboard.
						</p>

						<div className='flex items-center justify-end gap-3'>
							<button
								type='button'
								onClick={() => setSkillToDelete(null)}
								className='px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all cursor-pointer'>
								Keep Skillset
							</button>
							<button
								type='button'
								onClick={handleConfirmDelete}
								className='px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer'>
								Yes, Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal: Skill Info & Description */}
			{infoModalSkill && (
				<div
					role='dialog'
					aria-modal='true'
					aria-labelledby='skill-info-title'
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in'
					onClick={() => setInfoModalSkill(null)}>
					<div
						className='bg-[#16194E] border-2 border-cyan-400 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl'
						onClick={(e) => e.stopPropagation()}>
						<div className='flex items-center gap-2.5 mb-2'>
							<span className='text-2xl'>{infoModalSkill.icon || '🚀'}</span>
							<div>
								<h3
									id='skill-info-title'
									className='text-xl font-black text-cyan-300 leading-tight'>
									{infoModalSkill.name}
								</h3>
								<span className='text-xs text-slate-400 font-semibold'>
									{infoModalSkill.tagline || 'Skill Overview'}
								</span>
							</div>
						</div>

						<p className='text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed mb-3'>
							{infoModalSkill.description}
						</p>

						{infoModalSkill.coreObjective && (
							<div className='p-3 rounded-xl bg-white/5 border border-white/10 mb-4'>
								<span className='text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 block mb-1'>
									🎯 Core Learning Objective:
								</span>
								<p className='text-xs text-slate-200 font-medium leading-relaxed'>
									{infoModalSkill.coreObjective}
								</p>
							</div>
						)}

						<button
							type='button'
							onClick={() => setInfoModalSkill(null)}
							aria-label='Close skill information modal'
							className='w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-sm transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none'>
							Got It!
						</button>
					</div>
				</div>
			)}
		</div>
	);
});

export default SkillSelectionDashboard;
