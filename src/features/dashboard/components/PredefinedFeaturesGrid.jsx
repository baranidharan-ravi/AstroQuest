import { Sparkles } from 'lucide-react';
import { memo } from 'react';
import { COSMIC_FEATURE_MODES } from '../../../constants';

/**
 * PredefinedFeaturesGrid Component
 *
 * Implements SOLID Single Responsibility:
 * Displays grid of cosmic features (Galaxy Odyssey, Space Habitat, Planetarium, etc.)
 */
export const PredefinedFeaturesGrid = memo(function PredefinedFeaturesGrid({
	cardSize,
	handleModeClick,
}) {
	return (
		<section
			aria-labelledby='cosmic-explorations-heading'
			className='w-full bg-white/[0.05] backdrop-blur-md border border-white/15 hover:border-cyan-400/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col mb-4 sm:mb-5 transition-all'>
			{/* Section Header */}
			<div className='w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3.5 sm:mb-4 pb-3 border-b border-white/10'>
				<div className='flex items-center gap-2.5'>
					<div className='w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 flex-shrink-0'>
						<Sparkles className='w-4 h-4 text-purple-300' />
					</div>
					<div>
						<h2
							id='cosmic-explorations-heading'
							className='text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2 flex-wrap'>
							<span>Predefined Cosmic Missions & Special Modes</span>
							<span className='text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase'>
								{COSMIC_FEATURE_MODES.length} Modes
							</span>
						</h2>
						<p className='text-[11px] sm:text-xs text-slate-300 font-semibold mt-0.5'>
							Odyssey solar map, colony base builder, 60s speed challenge,
							observatory & worksheets
						</p>
					</div>
				</div>
			</div>

			{/* Predefined Quiz & Feature Cards Grid */}
			<div
				className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
					cardSize === 'compact' ? 'gap-2.5' : 'gap-3 sm:gap-3.5'
				}`}>
				{COSMIC_FEATURE_MODES.map((mode) => {
					const isCompact = cardSize === 'compact';
					return (
						<button
							key={mode.id}
							type='button'
							aria-label={`${mode.title || mode.shortTitle}: ${mode.desc || mode.shortDesc || ''}`}
							onClick={() => handleModeClick(mode)}
							className={`group text-left ${mode.bgGradient} ${
								isCompact ?
									'rounded-xl p-2.5 shadow-md flex items-center justify-between gap-2.5'
								:	'rounded-2xl p-3 sm:p-3.5 shadow-lg flex flex-col justify-between'
							} transition-all hover:scale-[1.02] active:scale-95 cursor-pointer focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none`}>
							{isCompact ?
								<>
									<div className='flex items-center gap-2.5 min-w-0'>
										<div
											className={`w-8 h-8 rounded-lg ${mode.iconBg} flex items-center justify-center text-base shadow-inner flex-shrink-0`}>
											{mode.icon}
										</div>
										<div className='min-w-0'>
											<div className='flex items-center gap-1.5'>
												<h3
													className={`text-xs font-black text-white ${mode.hoverText} transition-colors truncate`}>
													{mode.shortTitle}
												</h3>
												<span
													className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${mode.badgeStyle} hidden sm:inline`}>
													{mode.badge}
												</span>
											</div>
											<p className='text-[10px] text-slate-300 font-medium truncate'>
												{mode.shortDesc}
											</p>
										</div>
									</div>
									<div
										className={`text-[11px] font-black ${mode.accentText} flex items-center gap-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform`}>
										<span>{mode.shortAction}</span>
										<span>→</span>
									</div>
								</>
							:	<>
									<div>
										<div className='flex items-center justify-between gap-2 mb-1.5'>
											<div
												className={`w-8 h-8 rounded-xl ${mode.iconBg} flex items-center justify-center text-base shadow-inner`}>
												{mode.icon}
											</div>
											<span
												className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${mode.badgeStyle}`}>
												{mode.badge}
											</span>
										</div>
										<h3
											className={`text-xs sm:text-sm font-black text-white ${mode.hoverText} transition-colors`}>
											{mode.title}
										</h3>
										<p className='text-[10px] sm:text-[11px] text-slate-300 font-semibold mt-0.5 line-clamp-2 leading-snug'>
											{mode.desc}
										</p>
									</div>
									<div
										className={`mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-black ${mode.accentText}`}>
										<span>{mode.actionText}</span>
										<span>{mode.actionIcon}</span>
									</div>
								</>
							}
						</button>
					);
				})}
			</div>
		</section>
	);
});

export default PredefinedFeaturesGrid;
