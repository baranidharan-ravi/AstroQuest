import { Check, Rocket, Sparkles } from 'lucide-react';
import React, { memo } from 'react';
import { SETTINGS_TABS } from '../../../constants';
import { playButtonPop } from '../../../utils/audioSynthesis';

/**
 * SettingsStickyDock
 * High-visibility sticky bottom dock for saving, canceling, or editing settings.
 */
export const SettingsStickyDock = memo(function SettingsStickyDock({
	nameInput,
	activeTab,
	saveSuccess,
	isValidating,
	hasProfile,
	pendingSkill,
	soundEnabled = true,
	setSaveSuccess,
	onEditSettings,
	onBack,
	handleAttemptLeave,
	onAttemptLeave = handleAttemptLeave,
	handleSave,
	onSave = handleSave,
}) {
	const handleEdit = () => {
		playButtonPop(soundEnabled);
		if (onEditSettings) onEditSettings();
		if (setSaveSuccess) setSaveSuccess(false);
	};

	const handleBack = () => {
		playButtonPop(soundEnabled);
		if (onBack) onBack();
	};

	const handleSaveClick = () => {
		if (onSave) onSave(true);
	};

	return (
		<div className='sticky bottom-0 z-40 bg-[#0D1030]/95 backdrop-blur-md border-t-2 border-amber-400/50 shadow-[0_-10px_35px_rgba(0,0,0,0.65)] -mx-3 sm:-mx-8 -mb-3 sm:-mb-8 p-3 sm:p-4 rounded-b-2xl sm:rounded-b-3xl flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between'>
			<div className='hidden sm:flex items-center gap-2 text-xs text-slate-300 font-medium pl-1'>
				<span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
				<span className='font-bold text-white'>{nameInput || 'Explorer'}</span>
				<span className='text-slate-500'>•</span>
				<span className='text-amber-300 font-semibold'>
					{SETTINGS_TABS.find((t) => t.id === activeTab)?.label}
				</span>
			</div>

			{saveSuccess ?
				<div className='flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto ml-auto'>
					<button
						type='button'
						onClick={handleEdit}
						className='w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2'>
						<span>Edit Settings ✏️</span>
					</button>

					{hasProfile && onBack && (
						<button
							type='button'
							onClick={handleBack}
							className='w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95'>
							<span>Back to Dashboard ➔</span>
						</button>
					)}
				</div>
			:	<div className='flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto ml-auto'>
					{hasProfile && onBack && (
						<button
							type='button'
							disabled={isValidating}
							onClick={onAttemptLeave}
							className='w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400 text-center disabled:opacity-50 disabled:cursor-not-allowed'>
							Cancel
						</button>
					)}

					<button
						type='button'
						disabled={isValidating}
						onClick={handleSaveClick}
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
			}
		</div>
	);
});

export default SettingsStickyDock;
