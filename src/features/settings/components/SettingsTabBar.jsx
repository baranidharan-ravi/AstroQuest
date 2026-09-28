import { Clock, Cpu, Smile, Sparkles, Volume2 } from 'lucide-react';
import { memo } from 'react';
import { SETTINGS_TABS } from '../../../constants';
import { playButtonPop } from '../../../utils/audioSynthesis';

const TAB_ICONS = {
	profile: Smile,
	ai: Cpu,
	pacing: Clock,
	audio: Volume2,
};

/**
 * SettingsTabBar
 * Renders the top navigation tab bar for Settings.
 */
export const SettingsTabBar = memo(function SettingsTabBar({
	activeTab,
	setActiveTab,
	onSelectTab,
	soundEnabled = true,
}) {
	const handleSelect = onSelectTab || setActiveTab;

	return (
		<div className='sticky top-2 sm:top-4 z-30 bg-[#0B0E2B]/95 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-amber-400/30 shadow-lg flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none'>
			{SETTINGS_TABS.map((tab) => {
				const TabIcon = TAB_ICONS[tab.id] || Sparkles;
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							if (handleSelect) handleSelect(tab.id);
						}}
						className={`flex-1 min-w-[78px] sm:min-w-[120px] py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-all font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer border ${
							isActive ?
								'bg-gradient-to-r from-amber-500/25 via-pink-500/20 to-purple-500/25 border-amber-400 text-white shadow-md ring-1 ring-amber-400/50'
							:	'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
						}`}>
						<TabIcon
							className={`w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0 ${
								isActive ? 'text-amber-300' : 'text-slate-400'
							}`}
						/>
						<span className='truncate'>{tab.shortLabel || tab.label}</span>
					</button>
				);
			})}
		</div>
	);
});

export default SettingsTabBar;
