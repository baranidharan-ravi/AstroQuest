import {
	Download,
	Grid3X3,
	Info,
	LayoutGrid,
	Plus,
	Sparkles,
	Trash2,
	Upload,
} from 'lucide-react';
import { memo } from 'react';
import { playButtonPop } from '../../../utils/audioSynthesis';
import { SkillIcon } from '../../../utils/SkillIcon';
import { COLOR_THEMES } from '../../../utils/skillManager';

/**
 * SkillsetsGrid Component
 *
 * Implements SOLID Single Responsibility:
 * Displays category navigation tabs, skill cards with live telemetry stats,
 * and the Add Custom Skillset shortcut card.
 */
export const SkillsetsGrid = memo(function SkillsetsGrid({
	cardSize,
	handleSetCardSize,
	soundEnabled,
	skillsets = [],
	handleCardClick,
	handleInfoClick,
	handleRequestDelete,
	handleTriggerImport,
	handleExportSkills,
	handleOpenCreateModal,
}) {
	return (
		<section
			aria-labelledby='cosmic-missions-heading'
			className='w-full bg-white/[0.05] backdrop-blur-md border border-white/15 hover:border-cyan-400/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col transition-all'>
			{/* Section Header with Action Buttons */}
			<div className='w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 pb-3.5 border-b border-white/10'>
				<div>
					<h2
						id='cosmic-missions-heading'
						className='text-xl sm:text-2xl font-extrabold text-white tracking-wide drop-shadow'>
						Choose Your Cosmic Mission 🚀
					</h2>
					<p className='text-xs text-slate-300 font-semibold mt-0.5'>
						Select any built-in skill or create custom topics powered by Google
						Gemini AI.
					</p>
				</div>

				{/* Skillset Tools: Add, Import, Export */}
				<div className='flex items-center gap-2 flex-wrap'>
					{/* Cosmic Mission Card Size Toggle */}
					<div className='flex items-center gap-1 bg-white/10 border border-white/15 p-0.5 rounded-xl text-xs'>
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								handleSetCardSize('standard');
							}}
							className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
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
							className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
								cardSize === 'compact' ?
									'bg-amber-400 text-slate-950 shadow-sm'
								:	'text-slate-300 hover:text-white hover:bg-white/10'
							}`}
							title='Compact card view'>
							<Grid3X3 className='w-3.5 h-3.5' />
							<span>Compact</span>
						</button>
					</div>

					<button
						type='button'
						onClick={handleTriggerImport}
						className='px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer'
						title='Import complete backup or skillsets'>
						<Upload className='w-3.5 h-3.5 text-cyan-300' />
						<span>Import</span>
					</button>

					<button
						type='button'
						onClick={handleExportSkills}
						className='px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer'
						title='Export complete backup (settings + skillsets)'>
						<Download className='w-3.5 h-3.5 text-amber-300' />
						<span>Export</span>
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
			<div
				className={`w-full grid ${
					cardSize === 'compact' ?
						'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
					:	'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
				}`}>
				{skillsets.map((skill) => {
					const theme = COLOR_THEMES[skill.color] || COLOR_THEMES.cyan;
					const isCustom = !skill.isDefault;

					return (
						<div
							key={skill.id || skill.name}
							className={`group bg-white text-slate-800 ${
								cardSize === 'compact' ?
									'rounded-xl p-3 shadow-md min-h-[118px] border-2'
								:	'rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 shadow-xl min-h-[195px] border-4'
							} ${theme.cardBorder} transform hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between focus-within:ring-4 focus-within:ring-cyan-400 relative`}>
							<div>
								{/* Top Bar: Icon, Name, Tagline & Actions */}
								<div
									className={`flex items-start justify-between gap-2 ${
										cardSize === 'compact' ? 'mb-1.5' : 'mb-2 sm:mb-2.5'
									}`}>
									<div className='flex items-center gap-2.5 min-w-0'>
										<div
											aria-hidden='true'
											className={`${
												cardSize === 'compact' ?
													'w-8 h-8 rounded-lg text-base'
												:	'w-10 h-10 rounded-xl text-xl'
											} flex items-center justify-center font-black shadow-inner flex-shrink-0 ${theme.badgeColor}`}>
											<SkillIcon
												icon={skill.icon || 'Rocket'}
												className={
													cardSize === 'compact' ? 'w-4 h-4' : (
														'w-5 sm:w-6 h-5 sm:h-6'
													)
												}
											/>
										</div>
										<div className='min-w-0'>
											<div className='flex items-center gap-1.5'>
												<h3 className='truncate leading-tight'>
													<button
														type='button'
														onClick={() => handleCardClick(skill.name)}
														className={`${
															cardSize === 'compact' ?
																'text-sm font-extrabold truncate'
															:	'text-base sm:text-lg font-extrabold truncate'
														} text-slate-900 group-hover:text-cyan-600 transition-colors text-left cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded`}>
														{skill.name}
													</button>
												</h3>
												{isCustom && cardSize === 'compact' && (
													<span className='px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold border border-emerald-200 shrink-0'>
														Custom
													</span>
												)}
											</div>
											<span className='text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5 truncate'>
												{skill.tagline || 'Cognitive Challenge'}
											</span>
										</div>
									</div>

									{/* Action Icons */}
									<div className='flex items-center gap-1 flex-shrink-0'>
										{isCustom && (
											<button
												type='button'
												onClick={(e) => handleRequestDelete(e, skill)}
												onKeyDown={(e) => e.stopPropagation()}
												aria-label={`Delete custom skill ${skill.name}`}
												className={`${
													cardSize === 'compact' ? 'p-1' : 'p-1.5'
												} rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer`}
												title='Delete this custom skill'>
												<Trash2
													className={
														cardSize === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'
													}
												/>
											</button>
										)}

										<button
											type='button'
											onClick={(e) => handleInfoClick(e, skill)}
											onKeyDown={(e) => e.stopPropagation()}
											aria-label={`About ${skill.name} Skill`}
											className={`${
												cardSize === 'compact' ? 'p-1' : 'p-1.5'
											} rounded-full hover:bg-slate-100 text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer`}
											title={`About ${skill.name}`}>
											<Info
												className={
													cardSize === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'
												}
											/>
										</button>
									</div>
								</div>

								{/* Custom Skill Indicator Badge (Standard mode) */}
								{isCustom && cardSize !== 'compact' && (
									<div className='mb-2'>
										<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200'>
											<Sparkles className='w-2.5 h-2.5' />
											<span>Custom Skill</span>
										</span>
									</div>
								)}

								{/* Description */}
								<p
									className={`${
										cardSize === 'compact' ?
											'text-[11px] text-slate-600 font-medium leading-snug line-clamp-1 sm:line-clamp-2 mb-2'
										:	'text-xs text-slate-600 font-semibold leading-relaxed line-clamp-3 mb-3'
									}`}>
									{skill.description}
								</p>
							</div>

							{/* Card Footer: Action Button */}
							<div
								className={`flex items-center justify-end ${
									cardSize === 'compact' ? 'pt-2' : 'pt-3'
								} border-t border-slate-100`}>
								<button
									type='button'
									onClick={() => handleCardClick(skill.name)}
									aria-label={`Start ${skill.name} Thinksheet: ${skill.tagline || ''}`}
									className={`${
										cardSize === 'compact' ?
											'px-3 py-1 rounded-lg text-[11px] gap-1'
										:	'w-full sm:w-auto px-5 py-2 rounded-xl text-xs gap-1.5'
									} bg-gradient-to-r ${theme.buttonGradient} text-white font-extrabold shadow-sm group-hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none`}>
									<span>
										{cardSize === 'compact' ? 'Start' : `Start ${skill.name}`}
									</span>
									<span>➔</span>
								</button>
							</div>
						</div>
					);
				})}

				{/* Card: Add Custom Skillset Shortcut */}
				<button
					type='button'
					aria-label='Create and add a new custom skillset'
					onClick={handleOpenCreateModal}
					className={`group bg-white/5 hover:bg-white/10 border-2 border-dashed border-cyan-400/50 hover:border-cyan-300 ${
						cardSize === 'compact' ?
							'rounded-xl p-3 min-h-[118px] flex flex-col items-center justify-center text-center'
						:	'rounded-3xl p-5 min-h-[195px] flex flex-col items-center justify-center text-center'
					} shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-200 focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none w-full`}>
					<div
						className={`${
							cardSize === 'compact' ?
								'w-8 h-8 rounded-lg mb-1.5'
							:	'w-12 h-12 rounded-2xl mb-2.5'
						} bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all`}>
						<Plus className={cardSize === 'compact' ? 'w-4 h-4' : 'w-6 h-6'} />
					</div>
					<h3
						className={`${
							cardSize === 'compact' ? 'text-sm font-black' : (
								'text-base sm:text-lg font-black'
							)
						} text-white group-hover:text-cyan-300 transition-colors`}>
						Add Custom Skillset
					</h3>
					<p
						className={`${
							cardSize === 'compact' ?
								'text-[10px] line-clamp-1 mt-0.5'
							:	'text-[11px] mt-1'
						} text-slate-300 font-semibold max-w-xs`}>
						Create any learning topic and let Gemini AI craft real-time
						questions!
					</p>
					<div
						className={`${
							cardSize === 'compact' ?
								'mt-2 px-2.5 py-0.5 text-[10px]'
							:	'mt-3.5 px-4 py-1.5 text-xs'
						} rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30 group-hover:bg-cyan-400/30 transition-all flex items-center gap-1`}>
						<Plus
							className={cardSize === 'compact' ? 'w-3 h-3' : 'w-3.5 h-3.5'}
						/>
						<span>Create Topic</span>
					</div>
				</button>
			</div>
		</section>
	);
});

export default SkillsetsGrid;
