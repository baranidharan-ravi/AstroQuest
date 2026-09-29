import {
	Clock,
	Eye,
	EyeOff,
	Grid3X3,
	LayoutGrid,
	SlidersHorizontal,
	Sparkles,
	Zap,
} from 'lucide-react';
import { memo } from 'react';
import { playButtonPop } from '../../../utils/audioSynthesis';

/**
 * MissionParametersCard Component
 *
 * Implements SOLID Single Responsibility:
 * Renders consolidated quest controls: AI engine status, visual diagrams toggle,
 * countdown challenge timer, and auto-advance pacing.
 */
export const MissionParametersCard = memo(function MissionParametersCard({
	timerConfig,
	soundEnabled,
	cardSize,
	handleSetCardSize,
	hasApiKey,
	onOpenSettings,
	showVisualDiagrams,
	onToggleVisualDiagrams,
}) {
	return (
		<div className='w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 mb-4 sm:mb-5 shadow-xl flex flex-col gap-3 transition-all'>
			{/* Top Header Row: Section Title & Configure Button */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3'>
				<div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
					<div
						className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center border flex-shrink-0 transition-all ${
							timerConfig.enabled ?
								'bg-amber-400/20 border-amber-400/40 text-amber-300'
							:	'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
						}`}>
						<SlidersHorizontal className='w-4 h-4 sm:w-5 sm:h-5' />
					</div>
					<div className='min-w-0'>
						<div className='flex items-center gap-2'>
							<span className='font-extrabold text-sm sm:text-base text-white truncate'>
								🚀 Mission Parameters & Quest Controls
							</span>
						</div>
						<p className='text-[11px] sm:text-xs text-slate-300 font-medium'>
							Countdown challenge timer, AI synthesis engine, and visual clue
							parameters
						</p>
					</div>
				</div>

				<div className='flex items-center gap-1 bg-white/10 border border-white/15 p-1 rounded-xl text-xs flex-shrink-0'>
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							handleSetCardSize('standard');
						}}
						className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
							cardSize === 'standard' ?
								'bg-amber-400 text-slate-950 shadow-sm'
							:	'text-slate-300 hover:text-white hover:bg-white/10'
						}`}
						title='Standard card view'>
						<LayoutGrid className='w-3.5 h-3.5' />
						<span>Standard</span>
					</button>
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							handleSetCardSize('compact');
						}}
						className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
							cardSize === 'compact' ?
								'bg-amber-400 text-slate-950 shadow-sm'
							:	'text-slate-300 hover:text-white hover:bg-white/10'
						}`}
						title='Compact card view (space-saving)'>
						<Grid3X3 className='w-3.5 h-3.5' />
						<span>Compact</span>
					</button>
				</div>
			</div>

			<div className='flex items-center gap-2 sm:gap-2.5 flex-wrap pt-1 border-t border-white/10'>
				{/* 1. AI Question Engine Option / Status */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onOpenSettings();
					}}
					className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
						hasApiKey ?
							'bg-cyan-500/20 border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30'
						:	'bg-amber-500/15 border-amber-400/30 text-amber-300 hover:bg-amber-500/25'
					}`}
					title='AI Question Engine status. Click to configure API keys and AI models in Settings.'>
					<Sparkles className='w-3.5 h-3.5 text-amber-300' />
					<span>
						AI Engine:{' '}
						<strong className={hasApiKey ? 'text-cyan-200' : 'text-amber-200'}>
							{hasApiKey ? 'Active ✨' : 'Offline Vault 📦'}
						</strong>
					</span>
				</button>

				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						if (onToggleVisualDiagrams) {
							onToggleVisualDiagrams();
						} else {
							onOpenSettings();
						}
					}}
					className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
						showVisualDiagrams ?
							'bg-indigo-500/20 border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/30'
						:	'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'
					}`}
					title='Click to toggle Visual Diagrams & Illustrated Clues for questions'>
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

				<div
					className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-sm ${
						timerConfig.enabled ?
							'bg-amber-400/15 border-amber-400/30 text-amber-200'
						:	'bg-white/5 border-white/10 text-slate-300'
					}`}>
					<Clock className='w-3.5 h-3.5 text-amber-300' />
					<span>
						Timer:{' '}
						<strong className='text-amber-300'>
							{timerConfig.enabled ?
								`${timerConfig.secondsPerQuestion}s`
							:	'Unlimited'}
						</strong>
					</span>
				</div>

				<div className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 shadow-sm'>
					<Zap className='w-3.5 h-3.5 text-cyan-300' />
					<span>
						Pacing:{' '}
						<strong className='text-cyan-300'>
							{timerConfig.autoAdvanceEnabled ?
								`Auto (${timerConfig.autoAdvanceSeconds || 7}s)`
							:	'Manual'}
						</strong>
					</span>
				</div>
			</div>
		</div>
	);
});

export default MissionParametersCard;
