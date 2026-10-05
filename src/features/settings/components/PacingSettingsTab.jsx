import {
	AlertTriangle,
	Clock,
	Eye,
	FastForward,
	Lock,
	Minus,
	Plus,
} from 'lucide-react';
import { memo } from 'react';
import { playButtonPop } from '../../../utils/audioSynthesis';

const getTimerBadgeClass = (isMandatoryTimer, timerEnabled) => {
	if (isMandatoryTimer) return 'bg-amber-400 text-slate-950 shadow';
	if (timerEnabled) return 'bg-emerald-400 text-slate-950 shadow';
	return 'bg-slate-800 text-slate-400';
};

const getTimerBadgeText = (isMandatoryTimer, timerEnabled) => {
	if (isMandatoryTimer) return 'Mandatory (Ages 8–14)';
	if (timerEnabled) return 'Enabled';
	return 'Optional';
};

const getTimerToggleTitle = (isMandatoryTimer, timerEnabled) => {
	if (isMandatoryTimer) {
		return 'Countdown timer is mandatory for Ages 8–14 to ensure active challenge. You can change the question duration below.';
	}
	if (timerEnabled) return 'Turn timer off (unlimited time)';
	return 'Turn timer on';
};

const getTimerToggleClass = (isMandatoryTimer, timerEnabled) => {
	if (isMandatoryTimer) {
		return 'bg-amber-400 text-slate-950 border-amber-300 shadow cursor-not-allowed opacity-95';
	}
	if (timerEnabled) {
		return 'bg-emerald-400 text-slate-950 border-emerald-300 shadow cursor-pointer';
	}
	return 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white cursor-pointer';
};

const renderTimerToggleContent = (isMandatoryTimer, timerEnabled) => {
	if (isMandatoryTimer) {
		return (
			<>
				<Lock className='w-3 h-3 text-slate-950 inline' />
				<span>⏱️ ON</span>
			</>
		);
	}
	if (timerEnabled) {
		return '⏱️ ON';
	}
	return 'Timer OFF';
};

/**
 * PacingSettingsTab Component
 *
 * Implements SOLID Single Responsibility Principle:
 * Responsible purely for Question Countdown Timer configuration,
 * Auto-Advance timing delay, and Visual Diagram clue toggles.
 */
export const PacingSettingsTab = memo(function PacingSettingsTab({
	isMandatoryTimer,
	timerEnabled,
	setTimerEnabled,
	isValidating,
	soundEnabled,
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
}) {
	return (
		<div className='space-y-3.5 sm:space-y-6 animate-in fade-in duration-200'>
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
								className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase ${getTimerBadgeClass(
									isMandatoryTimer,
									timerEnabled,
								)}`}>
								{getTimerBadgeText(isMandatoryTimer, timerEnabled)}
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
						title={getTimerToggleTitle(isMandatoryTimer, timerEnabled)}
						className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-black transition-all border flex items-center gap-1 ${getTimerToggleClass(
							isMandatoryTimer,
							timerEnabled,
						)}`}>
						{renderTimerToggleContent(isMandatoryTimer, timerEnabled)}
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
						💡 <strong>Manual Next Mode:</strong>{' '}The solution stays on screen
						indefinitely until you click{' '}<em>Next Question ➔</em>.
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
										autoAdvanceSeconds === preset.sec && !isCustomAutoAdvance ?
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
					patterns, and STEM illustrations appear alongside questions and option
					choices.
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
		</div>
	);
});

export default PacingSettingsTab;
