import {
	Clock,
	Edit2,
	Eye,
	EyeOff,
	Info,
	Settings,
	Sparkles,
	Timer,
} from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { getStoredApiKey } from '../../services/aiGenerator';
import { playButtonPop } from '../../utils/audioSynthesis';

const SkillSelectionDashboard = memo(function SkillSelectionDashboard({
	onSelectSkill,
	soundEnabled,
	kidName,
	kidAge = 5,
	onOpenSettings,
	onAnimationComplete,
	timerConfig = {
		enabled: false,
		secondsPerQuestion: 90,
		autoAdvanceEnabled: true,
		autoAdvanceSeconds: 7,
	},
	showVisualDiagrams = false,
}) {
	const [infoModalTopic, setInfoModalTopic] = useState(null);
	const [hasApiKey, setHasApiKey] = useState(false);
	const [animationPhase, setAnimationPhase] = useState('center'); // 'center' | 'shrinking' | 'docked'

	const isIntroActive = animationPhase !== 'docked';

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

	const handleCardClick = (skill) => {
		playButtonPop(soundEnabled);
		onSelectSkill(skill);
	};

	const handleInfoClick = (e, topic) => {
		e.stopPropagation();
		playButtonPop(soundEnabled);
		setInfoModalTopic(topic);
	};

	return (
		<div className='min-h-screen space-background flex flex-col justify-between text-white font-sans overflow-x-hidden select-none p-4 sm:p-6'>
			{/* Top Header Bar */}
			<header className='w-full max-w-5xl mx-auto flex items-center justify-between gap-2 relative z-10'>
				{/* Child Profile Badge */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onOpenSettings();
					}}
					className={`flex items-center gap-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 hover:border-purple-400 px-3.5 py-1.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
						isIntroActive ?
							'opacity-0 -translate-y-4 pointer-events-none'
						:	'opacity-100 translate-y-0'
					}`}
					title='Open Profile & Settings'>
					<div className='w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center text-xs font-black text-pink-300'>
						⭐
					</div>
					<span className='text-xs font-black text-white tracking-wide'>
						👋 {kidName || 'Explorer'} (Age {kidAge || 5})
					</span>
					<Edit2 className='w-3 h-3 text-pink-300 opacity-80' />
				</button>

				{/* Green Center ThinkSheet Badge with Animated Shrink-to-Top Transition */}
				{animationPhase !== 'docked' ?
					<>
						{/* Placeholder so header layout stays aligned */}
						<div className='w-40 sm:w-48 h-12 invisible' />

						{/* Animated Floating Thinksheet Banner */}
						<div
							className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] flex items-center justify-center pointer-events-none ${
								animationPhase === 'center' ?
									'top-1/2 -translate-y-1/2 scale-110 sm:scale-135'
								:	'top-6 -translate-y-0 scale-100'
							}`}>
							<div
								className={`bg-[#22C55E] text-white rounded-3xl border-4 border-[#16A34A] flex items-center justify-center transition-all duration-700 shadow-2xl ${
									animationPhase === 'center' ?
										'px-10 py-5 sm:px-14 sm:py-6 shadow-[0_0_80px_rgba(34,197,94,0.8)] animate-pulse-glow'
									:	'px-8 py-2.5 border-2 rounded-2xl shadow-xl'
								}`}>
								<h1
									className={`font-black tracking-wide drop-shadow-md text-white transition-all duration-700 flex items-center gap-3 ${
										animationPhase === 'center' ?
											'text-4xl sm:text-6xl md:text-7xl font-heading'
										:	'text-xl sm:text-2xl font-heading'
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
							<div className='absolute -left-2 top-3 w-3 h-5 bg-white rounded-l-md opacity-90 shadow-sm' />
							<div className='absolute -right-2 top-3 w-3 h-5 bg-white rounded-r-md opacity-90 shadow-sm' />
						</div>
					</>
				:	/* Fully Docked Header Badge in Normal DOM Flow */
					<div className='relative flex items-center justify-center animate-in fade-in duration-300'>
						<div className='bg-[#22C55E] text-white px-8 py-2.5 rounded-2xl shadow-xl border-2 border-[#16A34A] flex items-center justify-center'>
							<h1 className='text-xl sm:text-2xl font-black tracking-wide drop-shadow-md font-heading'>
								AstroQuest
							</h1>
						</div>
						{/* Decorative side ribbon tabs */}
						<div className='absolute -left-2 top-2.5 w-3 h-5 bg-white rounded-l-md opacity-90 shadow-sm' />
						<div className='absolute -right-2 top-2.5 w-3 h-5 bg-white rounded-r-md opacity-90 shadow-sm' />
					</div>
				}

				{/* Settings Button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onOpenSettings();
					}}
					className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-700 border cursor-pointer ${
						hasApiKey ?
							'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
						:	'bg-rose-500/30 text-rose-200 border-rose-400/50 hover:bg-rose-500/40 animate-pulse'
					} ${
						isIntroActive ?
							'opacity-0 -translate-y-4 pointer-events-none'
						:	'opacity-100 translate-y-0'
					}`}
					title='Open Profile & Settings'>
					<Settings className='w-3.5 h-3.5 text-amber-300' />
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
				<div className='w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 sm:p-4 mb-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4'>
					{/* Left: Info */}
					<div className='flex items-center gap-3 w-full sm:w-auto'>
						<div
							className={`w-10 h-10 rounded-2xl flex items-center justify-center border flex-shrink-0 transition-all ${
								timerConfig.enabled ?
									'bg-amber-400/20 border-amber-400/40 text-amber-300'
								:	'bg-white/10 border-white/20 text-slate-300'
							}`}>
							<Clock className='w-5 h-5' />
						</div>
						<div>
							<div className='flex items-center gap-2'>
								<span className='font-extrabold text-sm sm:text-base text-white'>
									⚙️ Quest Settings & Pacing
								</span>
							</div>
							<p className='text-xs text-slate-300 font-semibold mt-0.5 flex items-center gap-2 flex-wrap'>
								<span>
									Timer:{' '}
									<strong className='text-amber-300'>
										{timerConfig.enabled ?
											`${timerConfig.secondsPerQuestion}s/question`
										:	'Unlimited'}
									</strong>
								</span>
								<span>•</span>
								<span>
									Next:{' '}
									<strong className='text-emerald-300'>
										{timerConfig.autoAdvanceEnabled ?
											`Auto in ${timerConfig.autoAdvanceSeconds || 7}s`
										:	'Manual'}
									</strong>
								</span>
								<span>•</span>
								<span>
									Diagrams:{' '}
									<strong
										className={
											showVisualDiagrams ?
												'text-indigo-300 font-extrabold'
											:	'text-slate-400 font-extrabold'
										}>
										{showVisualDiagrams ? '👁️ Shown' : '🙈 Hidden'}
									</strong>
								</span>
							</p>
						</div>
					</div>

					{/* Right: Settings Button */}
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onOpenSettings();
						}}
						className='px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer'>
						<Timer className='w-3.5 h-3.5 text-amber-300' />
						<span>Configure Settings</span>
					</button>
				</div>

				{/* Call to Action Heading */}
				<h2 className='text-xl sm:text-2xl font-extrabold text-white text-center mb-6 tracking-wide drop-shadow'>
					Select a skill and solve thinksheets
				</h2>

				{/* Two Interactive Skill Cards */}
				<div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
					{/* Skill Card 1: VISUAL */}
					<div
						role='button'
						tabIndex={0}
						aria-label='Start Visual Thinksheet: Observation & Patterns'
						onClick={() => handleCardClick('Visual')}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleCardClick('Visual');
							}
						}}
						className='group bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-cyan-400 hover:border-cyan-300 cursor-pointer transform hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 flex flex-col justify-between min-h-[220px] focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none'>
						<div>
							{/* Card Header */}
							<div className='flex items-center justify-between mb-3'>
								<div className='flex items-center gap-2'>
									<div
										aria-hidden='true'
										className='w-10 h-10 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 font-black shadow-inner'>
										👁️
									</div>
									<div>
										<h3 className='text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors'>
											Visual
										</h3>
										<span className='text-xs font-bold text-cyan-600 uppercase tracking-wider'>
											Observation & Patterns
										</span>
									</div>
								</div>

								{/* Info Button */}
								<button
									type='button'
									onClick={(e) => handleInfoClick(e, 'Visual')}
									onKeyDown={(e) => e.stopPropagation()}
									aria-label='About Visual Skills'
									className='p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none'
									title='About Visual Skills'>
									<Info className='w-5 h-5' />
								</button>
							</div>

							{/* Description */}
							<p className='text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed mb-4'>
								Missing grid tiles, pattern completions, object counting,
								symmetry, and balance puzzles.
							</p>
						</div>

						{/* Card Footer: Action Button */}
						<div className='flex items-center justify-end pt-3 border-t border-slate-100'>
							<div
								aria-hidden='true'
								className='w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-md group-hover:shadow-cyan-400/50 group-hover:scale-105 transition-all flex items-center justify-center gap-1.5'>
								<span>Start Visual Sheet</span>
								<span>➔</span>
							</div>
						</div>
					</div>

					{/* Skill Card 2: ANALYTICAL THINKING */}
					<div
						role='button'
						tabIndex={0}
						aria-label='Start Analytical Thinking Thinksheet: Logic & Relationships'
						onClick={() => handleCardClick('Analytical Thinking')}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleCardClick('Analytical Thinking');
							}
						}}
						className='group bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-purple-400 hover:border-purple-300 cursor-pointer transform hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 flex flex-col justify-between min-h-[220px] focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:outline-none'>
						<div>
							{/* Card Header */}
							<div className='flex items-center justify-between mb-3'>
								<div className='flex items-center gap-2'>
									<div
										aria-hidden='true'
										className='w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-black shadow-inner'>
										🧠
									</div>
									<div>
										<h3 className='text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors'>
											Analytical Thinking
										</h3>
										<span className='text-xs font-bold text-purple-600 uppercase tracking-wider'>
											Logic & Relationships
										</span>
									</div>
								</div>

								{/* Info Button */}
								<button
									type='button'
									onClick={(e) => handleInfoClick(e, 'Analytical Thinking')}
									onKeyDown={(e) => e.stopPropagation()}
									aria-label='About Analytical Thinking Skills'
									className='p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none'
									title='About Analytical Thinking'>
									<Info className='w-5 h-5' />
								</button>
							</div>

							{/* Description */}
							<p className='text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed mb-4'>
								Analogies, classification, cause-and-effect riddles, and logical
								deductions tailored to age.
							</p>
						</div>

						{/* Card Footer: Action Button */}
						<div className='flex items-center justify-end pt-3 border-t border-slate-100'>
							<div
								aria-hidden='true'
								className='w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-md group-hover:shadow-purple-400/50 group-hover:scale-105 transition-all flex items-center justify-center gap-1.5'>
								<span>Start Analytical Sheet</span>
								<span>➔</span>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Skill Info Description Modal */}
			{infoModalTopic && (
				<div
					role='dialog'
					aria-modal='true'
					aria-labelledby='skill-info-title'
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in'
					onClick={() => setInfoModalTopic(null)}>
					<div
						className='bg-[#16194E] border-2 border-purple-400 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl'
						onClick={(e) => e.stopPropagation()}>
						<h3
							id='skill-info-title'
							className='text-xl font-black mb-2 text-cyan-300'>
							{infoModalTopic}
						</h3>
						<p className='text-sm text-slate-300 font-semibold leading-relaxed mb-4'>
							{infoModalTopic === 'Visual' ?
								'Visual Thinksheets train spatial awareness, geometric pattern completion, object counting, grid observation, and symmetry detection.'
							:	'Analytical Thinking Thinksheets develop logical reasoning, analogy deduction, classification, and everyday cause-and-effect problem solving.'
							}
						</p>
						<button
							type='button'
							onClick={() => setInfoModalTopic(null)}
							aria-label='Close skill information modal'
							className='w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:outline-none'>
							Got It!
						</button>
					</div>
				</div>
			)}
		</div>
	);
});

export default SkillSelectionDashboard;
