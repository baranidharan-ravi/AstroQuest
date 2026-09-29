import {
	AlertTriangle,
	Check,
	Dices,
	RefreshCw,
	Sparkles,
	X,
} from 'lucide-react';
import { memo } from 'react';
import { POPULAR_ICONS } from '../../../constants';
import { SkillIcon } from '../../../utils/SkillIcon';
import { COLOR_THEMES, SKILLSET_PRESETS } from '../../../utils/skillManager';

export const CreateSkillsetModal = memo(function CreateSkillsetModal({
	isCreateModalOpen,
	setIsCreateModalOpen,
	createModalRef,
	hasApiKey,
	isAiSuggesting,
	suggestMode,
	handleAiSuggestSkillset,
	aiSuggestSuccess,
	canAutoFill,
	hasTypedName,
	isGeneratedNameUnchanged,
	handleSelectPreset,
	newSkillName,
	setNewSkillName,
	newSkillTagline,
	setNewSkillTagline,
	newSkillDesc,
	setNewSkillDesc,
	newSkillIcon,
	setNewSkillIcon,
	newSkillColor,
	setNewSkillColor,
	createError,
	setCreateError,
	handleSaveNewSkill,
	handleOpenSettings,
	soundEnabled,
}) {
	if (!isCreateModalOpen) return null;

	return (
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
								<SkillIcon
									icon={preset.icon}
									className='w-4 h-4 text-cyan-300 shrink-0'
								/>
								<span>{preset.name}</span>
							</button>
						))}
					</div>
				</div>

				{/* AI Smart Auto-Fill & Topic Idea Generator */}
				<div className='mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/70 to-cyan-950/80 border border-cyan-400/40 shadow-inner flex flex-col gap-3'>
					<div className='flex items-start gap-3'>
						<div className='w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5'>
							<Sparkles className='w-4 h-4' />
						</div>
						<div className='flex-1 min-w-0'>
							<div className='flex items-center gap-2 flex-wrap'>
								<h4 className='text-xs font-bold text-white'>
									Smart Topic Generator & Auto-Fill
								</h4>
								<span className='text-[9px] px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase font-black tracking-wide'>
									AI Powered
								</span>
							</div>
							<p className='text-[11px] text-slate-300 mt-1 leading-relaxed'>
								Click{' '}
								<span className='text-purple-300 font-bold'>
									Surprise Me 🎲
								</span>{' '}
								for exciting random ideas, or type a topic name below to unlock{' '}
								<span className='text-amber-300 font-bold'>
									Auto-Fill with AI
								</span>
								!
							</p>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10'>
						<button
							type='button'
							disabled={isAiSuggesting}
							onClick={() => handleAiSuggestSkillset({ isRandom: true })}
							className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md ${
								isAiSuggesting && suggestMode === 'random' ?
									'bg-purple-950/80 border border-purple-400 text-purple-200 cursor-not-allowed animate-pulse'
								: isAiSuggesting ?
									'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
								:	'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white hover:scale-[1.02] active:scale-[0.98] border border-purple-400/50 cursor-pointer'
							}`}
							title='Generate a completely different, fresh random topic every time'>
							{isAiSuggesting && suggestMode === 'random' ?
								<>
									<RefreshCw className='w-3.5 h-3.5 animate-spin text-purple-200' />
									<span>Generating Surprise...</span>
								</>
							:	<>
									<Dices className='w-4 h-4 text-purple-200' />
									<span>Surprise Me 🎲</span>
								</>
							}
						</button>

						<button
							type='button'
							disabled={!canAutoFill}
							onClick={() => handleAiSuggestSkillset({ isRandom: false })}
							className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md ${
								isAiSuggesting && suggestMode === 'autofill' ?
									'bg-cyan-950/80 border border-cyan-400 text-cyan-300 cursor-not-allowed animate-pulse'
								: !canAutoFill ?
									'bg-slate-800/60 border border-slate-700/50 text-slate-500 cursor-not-allowed opacity-60'
								: isAiSuggesting ?
									'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
								:	'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 hover:scale-[1.02] active:scale-[0.98] border border-amber-300 cursor-pointer'
							}`}
							title={
								!hasTypedName ?
									'Type some words in the Skillset Name below to enable Auto-Fill'
								: isGeneratedNameUnchanged ?
									'Topic already filled by Surprise Me. Edit the name to re-enable Auto-Fill.'
								:	'Auto-complete skillset tagline, description, and icon based on your topic'

							}>
							{isAiSuggesting && suggestMode === 'autofill' ?
								<>
									<RefreshCw className='w-3.5 h-3.5 animate-spin text-cyan-300' />
									<span>Generating with AI...</span>
								</>
							:	<>
									<Sparkles className='w-4 h-4' />
									<span>Auto-Fill with AI</span>
								</>
							}
						</button>
					</div>
				</div>

				{/* AI Feedback Banner */}
				{aiSuggestSuccess && (
					<div
						role='status'
						aria-live='polite'
						className='mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2'>
						<Check className='w-4 h-4 text-emerald-400 flex-shrink-0' />
						<span>
							{typeof aiSuggestSuccess === 'string' ?
								aiSuggestSuccess
							:	'✓ Successfully auto-filled the skillset name, description, tagline, and icon!'
							}
						</span>
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
							<div className='flex items-center gap-2'>
								<button
									type='button'
									disabled={isAiSuggesting}
									onClick={() => handleAiSuggestSkillset({ isRandom: true })}
									className='text-[11px] font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50'
									title='Generate a fresh random topic'>
									<Dices className='w-3 h-3 text-purple-300' />
									<span>Surprise Me 🎲</span>
								</button>
								<span className='text-slate-600 text-xs'>•</span>
								<button
									type='button'
									disabled={!canAutoFill}
									onClick={() => handleAiSuggestSkillset({ isRandom: false })}
									className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
										!canAutoFill ?
											'text-slate-500 cursor-not-allowed opacity-50'
										:	'text-cyan-300 hover:text-cyan-200 cursor-pointer'
									}`}
									title={
										!hasTypedName ?
											'Type a skillset name first to use AI Suggest'
										: isGeneratedNameUnchanged ?
											'Topic already filled by Surprise Me. Edit name to use AI Suggest.'
										:	'Ask AI to suggest or complete name and description'
									}>
									<Sparkles className='w-3 h-3 text-amber-300' />
									<span>
										{isAiSuggesting && suggestMode === 'autofill' ?
											'Thinking...'
										:	'AI Suggest'}
									</span>
								</button>
							</div>
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
							Pedagogical Description <span className='text-rose-400'>*</span>
							<span className='text-[10px] text-slate-400 block font-normal'>
								Sent directly to Gemini AI prompt to guide questions generated
								for this skill.
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

					{/* Vector Font Icon Picker */}
					<div>
						<div className='flex items-center justify-between mb-1.5'>
							<span className='block text-xs font-bold text-slate-300'>
								Choose Skill Icon (Lucide Icon Pack):
							</span>
							<span className='text-[10px] text-cyan-300 font-semibold tracking-wide'>
								24 Vector Icons
							</span>
						</div>
						<div className='grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 mb-2 max-h-40 overflow-y-auto p-2 bg-[#090B24]/90 border border-white/10 rounded-2xl'>
							{POPULAR_ICONS.map((iconItem) => (
								<button
									key={iconItem.id}
									type='button'
									title={iconItem.label}
									aria-label={iconItem.label}
									disabled={isAiSuggesting}
									onClick={() => setNewSkillIcon(iconItem.id)}
									className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 ${
										(
											newSkillIcon === iconItem.id ||
											newSkillIcon === iconItem.label
										) ?
											'bg-cyan-500/30 border-2 border-cyan-400 scale-110 shadow-lg text-cyan-300'
										:	'bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white'
									}`}>
									<SkillIcon
										icon={iconItem.id}
										className='w-4 h-4'
									/>
								</button>
							))}
						</div>
						<div className='flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/10'>
							<span className='text-[11px] text-slate-400 font-semibold'>
								Active Icon:
							</span>
							<div className='w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0'>
								<SkillIcon
									icon={newSkillIcon}
									className='w-4 h-4'
								/>
							</div>
							<input
								type='text'
								maxLength={30}
								disabled={isAiSuggesting}
								value={newSkillIcon}
								onChange={(e) => setNewSkillIcon(e.target.value)}
								placeholder='Icon name (e.g. Rocket, Brain, Atom)'
								className='flex-1 bg-[#090B24] border border-white/20 focus:border-cyan-400 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none disabled:opacity-60'
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
	);
});

export default CreateSkillsetModal;
