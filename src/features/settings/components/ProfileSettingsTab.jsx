import {
	Calendar,
	Check,
	Download,
	Minus,
	Plus,
	Smile,
	Sparkles,
	Upload,
	Users,
} from 'lucide-react';
import { memo, useState } from 'react';
import { isTimerMandatoryForAge } from '../../../constants';
import { playButtonPop } from '../../../utils/audioSynthesis';
import {
	getAvatarById,
	KidAvatar,
	PRESET_AVATARS,
} from '../../../utils/avatarManager';
import {
	getActiveCrewId,
	switchActiveCrewMember,
} from '../../../utils/crewManager';

const GENDER_BADGE_LABELS = {
	boy: '👦 Boy',
	girl: '👧 Girl',
};

const AVATAR_CATEGORY_LABELS = {
	Boys: '👦 Boys',
	Girls: '👧 Girls',
	'Cosmic Pals': '🤖 Cosmic Pals',
};

/**
 * ProfileSettingsTab
 * Manages Flight Crew profiles, Child Name & Age, and Gender & Avatar configuration.
 * Single Responsibility: Explorer Identity & Profile parameters.
 */
export const ProfileSettingsTab = memo(function ProfileSettingsTab({
	crewMembers = [],
	handleTriggerImportBackup,
	handleExportBackup,
	setIsCrewModalOpen,
	backupStatus,
	isFormLocked = false,
	isValidating = false,
	soundEnabled = true,
	nameInput,
	setNameInput,
	error,
	setError,
	ageInput,
	setAgeInput,
	isMandatoryTimer,
	setTimerEnabled,
	genderInput,
	avatarInput,
	avatarCategoryFilter,
	setAvatarCategoryFilter,
	filteredAvatars,
	handleGenderSelect,
	handleAvatarSelect,
}) {
	const quickAges = [3, 4, 5, 6, 7, 8];
	const [isCustomAge, setIsCustomAge] = useState(false);

	const handleQuickAgeSelect = (age) => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		setAgeInput(age);
		setIsCustomAge(false);
		if (error && setError) setError('');
		if (isTimerMandatoryForAge(age) && setTimerEnabled) {
			setTimerEnabled(true);
		}
	};

	const handleIncrementAge = (delta) => {
		if (isFormLocked) return;
		playButtonPop(soundEnabled);
		const next = Math.max(2, Math.min(14, Number(ageInput || 5) + delta));
		setAgeInput(next);
		setIsCustomAge(true);
		if (error && setError) setError('');
		if (isTimerMandatoryForAge(next) && setTimerEnabled) {
			setTimerEnabled(true);
		}
	};
	return (
		<div className='space-y-3.5 sm:space-y-6 animate-in fade-in duration-200'>
			{/* Astronaut Flight Crew Management Console with Integrated Backup & Portability */}
			<div className='bg-gradient-to-br from-[#0c133b]/90 via-[#0e1848]/85 to-[#080d28]/95 border border-cyan-500/35 rounded-2xl p-3.5 sm:p-4.5 flex flex-col gap-3 shadow-lg'>
				{/* Header & Action Toolbar */}
				<div className='flex items-center justify-between gap-3 flex-wrap'>
					<div className='flex items-center gap-2.5 min-w-0'>
						<div className='w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0 shadow-inner'>
							<Users className='w-4 h-4 sm:w-4.5 sm:h-4.5' />
						</div>
						<div className='min-w-0'>
							<div className='flex items-center gap-2'>
								<h2 className='text-xs sm:text-sm font-extrabold text-white truncate'>
									Astronaut Flight Crew Profiles
								</h2>
								<span className='text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex-shrink-0'>
									{crewMembers.length} Explorer
									{crewMembers.length === 1 ? '' : 's'}
								</span>
							</div>
							<p className='text-[10.5px] text-slate-300 truncate'>
								Switch explorer profiles or manage crew & system backups
							</p>
						</div>
					</div>

					{/* Action Toolbar */}
					<div className='flex items-center gap-2 flex-wrap'>
						{/* Backup Tools Group */}
						<div className='flex items-center bg-[#070A1E] p-0.5 rounded-xl border border-slate-700/80 shadow-inner'>
							<button
								type='button'
								disabled={isFormLocked}
								onClick={handleTriggerImportBackup}
								className='px-2 sm:px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
								title='Import complete backup (settings, crew profiles, and custom skillsets)'>
								<Upload className='w-3 h-3 text-cyan-400' />
								<span>Import</span>
							</button>
							<div className='w-px h-3.5 bg-slate-700/80 mx-0.5' />
							<button
								type='button'
								disabled={isFormLocked}
								onClick={handleExportBackup}
								className='px-2 sm:px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
								title='Export complete backup (settings, crew profiles, and custom skillsets)'>
								<Download className='w-3 h-3 text-amber-300' />
								<span>Export</span>
							</button>
						</div>

						{/* Primary Manage Crew Button */}
						<button
							type='button'
							disabled={isFormLocked}
							onClick={() => {
								playButtonPop(soundEnabled);
								setIsCrewModalOpen(true);
							}}
							className='px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
							<Users className='w-3.5 h-3.5' />
							<span>Manage Crew</span>
						</button>
					</div>
				</div>

				{/* Crew Members Quick-Switch Dock */}
				<div className='pt-2.5 border-t border-cyan-500/20'>
					<div className='flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin'>
						{crewMembers.map((member) => {
							const isActive = member.id === getActiveCrewId();
							return (
								<button
									key={member.id}
									type='button'
									disabled={isFormLocked}
									onClick={() => {
										if (isFormLocked) return;
										playButtonPop(soundEnabled);
										if (!isActive) {
											switchActiveCrewMember(member.id);
										}
									}}
									className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed ${
										isActive ?
											'bg-cyan-500/25 border-cyan-400 ring-2 ring-cyan-400/40 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]'
										:	'bg-[#080B22] border-slate-700/80 hover:border-slate-500 text-slate-300 hover:text-white'
									}`}>
									<KidAvatar
										avatarId={member.avatar}
										gender={member.gender}
										size='xs'
									/>
									<div className='text-left leading-tight'>
										<div className='flex items-center gap-1.5'>
											<span className='text-xs font-black text-white'>
												{member.name}
											</span>
											<span
												className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
													isActive ?
														'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
													:	'bg-slate-800 text-slate-400'
												}`}>
												Age {member.age}
											</span>
										</div>
									</div>
									{isActive ?
										<span
											className='w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-0.5'
											title='Active explorer'
										/>
									:	<span className='text-[10px] text-cyan-400 font-semibold ml-0.5'>
											Switch
										</span>
									}
								</button>
							);
						})}

						{/* Quick Add Explorer Shortcut */}
						<button
							type='button'
							disabled={isFormLocked}
							onClick={() => {
								playButtonPop(soundEnabled);
								setIsCrewModalOpen(true);
							}}
							className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 text-cyan-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'>
							<Plus className='w-3.5 h-3.5' />
							<span>Add Explorer</span>
						</button>
					</div>
				</div>
			</div>

			{/* Backup Feedback Alert Banner */}
			{backupStatus && (
				<div
					role='status'
					aria-live='polite'
					className={`p-3 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
						backupStatus.type === 'success' ?
							'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
						:	'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md'
					}`}>
					<span>{backupStatus.text}</span>
				</div>
			)}

			{/* Section 1: Child Name & Age */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
				{/* Name Card */}
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380]'>
					<label
						htmlFor='child-name-input'
						className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-1.5 sm:mb-2'>
						<Smile className='w-4 h-4 text-pink-400' />
						<span>Child's Name</span>
					</label>
					<input
						id='child-name-input'
						name='child_display_name'
						type='text'
						maxLength={30}
						autoComplete='off'
						data-1p-ignore='true'
						data-lpignore='true'
						data-form-type='other'
						aria-required='true'
						aria-describedby='child-name-desc'
						disabled={isValidating}
						value={nameInput}
						onChange={(e) => {
							setNameInput(e.target.value);
							if (error) setError('');
						}}
						placeholder='e.g. Leo, Maya, Alex...'
						className='w-full bg-[#0D1030] border border-pink-500/40 focus:border-pink-400 text-white font-bold text-sm sm:text-base rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 transition-all'
					/>
					<span
						id='child-name-desc'
						className='text-[10px] sm:text-[11px] text-slate-400 mt-1 block'>
						Used to personalize questions, voice feedback & reports.
					</span>
				</div>

				{/* Age Card */}
				<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380]'>
					<div className='flex items-center justify-between mb-2'>
						<label className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5'>
							<Calendar className='w-4 h-4 text-cyan-400' />
							<span>Child's Age</span>
						</label>
						<span className='text-xs font-black text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full'>
							{ageInput} Years Old
						</span>
					</div>

					{/* Quick Selection Pills */}
					<div
						role='group'
						aria-label='Select explorer age'
						className='grid grid-cols-6 gap-1 sm:gap-1.5'>
						{quickAges.map((age) => (
							<button
								key={age}
								type='button'
								disabled={isValidating}
								aria-label={`${age} years old`}
								aria-pressed={Number(ageInput) === age && !isCustomAge}
								onClick={() => handleQuickAgeSelect(age)}
								className={`py-2 px-0.5 sm:px-1 rounded-xl text-xs font-black transition-all border cursor-pointer text-center focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
									Number(ageInput) === age && !isCustomAge ?
										'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-md scale-105'
									:	'bg-[#0D1030] text-slate-300 border-slate-700/80 hover:bg-slate-800'
								}`}>
								{age}y
							</button>
						))}
					</div>

					{/* Custom Age Toggle */}
					<div className='flex items-center justify-between mt-2 pt-2 border-t border-white/10'>
						<span className='text-[11px] text-slate-400'>
							Other Age (2 to 14):
						</span>
						<button
							type='button'
							disabled={isValidating}
							aria-expanded={isCustomAge}
							onClick={() => {
								playButtonPop(soundEnabled);
								setIsCustomAge((prev) => !prev);
							}}
							className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
								isCustomAge ?
									'bg-cyan-500/30 text-cyan-300 border-cyan-400'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{isCustomAge ? 'Custom Stepper Active' : 'Change Age Range'}
						</button>
					</div>

					{/* Custom Age Stepper */}
					{isCustomAge && (
						<div className='flex items-center gap-2 bg-[#0D1030] border border-cyan-500/50 rounded-xl p-1.5 mt-2 animate-in fade-in duration-200'>
							<button
								type='button'
								disabled={isValidating}
								aria-label='Decrease age by 1 year'
								onClick={() => handleIncrementAge(-1)}
								className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none'>
								<Minus className='w-3.5 h-3.5' />
							</button>
							<div className='flex-1 text-center'>
								<input
									id='custom-age-input'
									name='child_age_years'
									aria-label='Custom age in years'
									type='number'
									min={2}
									max={14}
									maxLength={2}
									autoComplete='off'
									data-1p-ignore='true'
									data-lpignore='true'
									data-form-type='other'
									disabled={isValidating}
									value={ageInput}
									onKeyDown={(e) => {
										if (['e', 'E', '+', '-', '.'].includes(e.key)) {
											e.preventDefault();
										}
									}}
									onChange={(e) => {
										const raw = e.target.value;
										if (raw === '') {
											setAgeInput('');
											if (error) setError('');
											return;
										}
										const digits = raw.replace(/\D/g, '');
										if (!digits) {
											setAgeInput('');
											return;
										}
										const parsed = parseInt(digits, 10);
										if (parsed > 14) {
											setAgeInput(14);
										} else {
											setAgeInput(parsed);
										}
										if (error) setError('');
									}}
									onBlur={() => {
										const val = parseInt(ageInput, 10);
										if (isNaN(val) || val < 2) {
											setAgeInput(2);
										} else if (val > 14) {
											setAgeInput(14);
										} else {
											setAgeInput(val);
										}
									}}
									className='w-full bg-transparent text-center text-base font-black text-cyan-300 focus:outline-none'
								/>
								<span className='text-[10px] text-slate-400 block -mt-1'>
									(Ages 2 to 14)
								</span>
							</div>
							<button
								type='button'
								disabled={isValidating}
								aria-label='Increase age by 1 year'
								onClick={() => handleIncrementAge(1)}
								className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none'>
								<Plus className='w-3.5 h-3.5' />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Section 1B: Explorer Gender & Avatar Customization */}
			<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#2C3380] flex flex-col gap-3.5 sm:gap-4'>
				{/* Top Header & Active Avatar Preview */}
				<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-white/10'>
					<div className='flex items-center gap-3 sm:gap-3.5'>
						<div className='relative flex-shrink-0'>
							<KidAvatar
								avatarId={avatarInput}
								size='lg'
								showRing
								className='shadow-[0_0_20px_rgba(34,211,238,0.4)]'
							/>
							<span className='absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-md border-2 border-[#090B24]'>
								<Check className='w-3 h-3' />
							</span>
						</div>
						<div>
							<div className='flex items-center gap-2 flex-wrap'>
								<h3 className='text-sm sm:text-base font-black text-white'>
									{getAvatarById(avatarInput)?.name || 'Custom Explorer'}
								</h3>
								<span className='text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 capitalize'>
									{GENDER_BADGE_LABELS[genderInput] || '🚀 Space Cadet'}
								</span>
							</div>
							<p className='text-[11px] sm:text-xs text-slate-300 mt-0.5'>
								{getAvatarById(avatarInput)?.label || 'Hero Explorer Avatar'} •
								Shown on dashboard & question headers
							</p>
						</div>
					</div>

					{/* Gender Selection 3-Button Toggle */}
					<div className='w-full sm:w-auto flex flex-col items-start sm:items-end gap-1'>
						<span className='text-[11px] font-bold text-slate-400 uppercase tracking-wider'>
							Child's Gender
						</span>
						<div
							className='grid grid-cols-3 gap-1.5 w-full sm:w-auto'
							role='group'
							aria-label='Select explorer gender'>
							{[
								{ id: 'boy', label: 'Boy', icon: '👦' },
								{ id: 'girl', label: 'Girl', icon: '👧' },
								{ id: 'neutral', label: 'Cadet', icon: '🚀' },
							].map((opt) => {
								const isSelected = genderInput === opt.id;
								return (
									<button
										key={opt.id}
										type='button'
										disabled={isValidating}
										aria-pressed={isSelected}
										onClick={() => handleGenderSelect(opt.id)}
										className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
											isSelected ?
												'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-md scale-105'
											:	'bg-[#0D1030] text-slate-300 border-slate-700/80 hover:bg-slate-800'
										}`}>
										<span>{opt.icon}</span>
										<span>{opt.label}</span>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Preset Avatar Gallery */}
				<div className='flex flex-col gap-2.5'>
					<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
						<label className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5'>
							<Sparkles className='w-4 h-4 text-amber-400' />
							<span>Preset Avatar Gallery</span>
							<span className='text-[10px] text-slate-400 font-normal'>
								({PRESET_AVATARS.length} Options)
							</span>
						</label>

						{/* Category Filter Pills */}
						<div
							className='flex items-center gap-1 overflow-x-auto max-w-full pb-0.5'
							role='tablist'
							aria-label='Avatar categories'>
							{['All', 'Boys', 'Girls', 'Cosmic Pals'].map((category) => {
								const isActive = avatarCategoryFilter === category;
								return (
									<button
										key={category}
										type='button'
										role='tab'
										aria-selected={isActive}
										disabled={isValidating}
										onClick={() => {
											playButtonPop(soundEnabled);
											setAvatarCategoryFilter(category);
										}}
										className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
											isActive ?
												'bg-purple-600 text-white border-purple-400 shadow-sm'
											:	'bg-[#0D1030] text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800'
										}`}>
										{AVATAR_CATEGORY_LABELS[category] || 'All'}
									</button>
								);
							})}
						</div>
					</div>

					{/* Grid of Preset Avatars */}
					<div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5'>
						{filteredAvatars.map((avatar) => {
							const isSelected = avatarInput === avatar.id;
							return (
								<button
									key={avatar.id}
									type='button'
									disabled={isValidating}
									aria-label={`Select avatar ${avatar.name}`}
									aria-pressed={isSelected}
									onClick={() => handleAvatarSelect(avatar.id)}
									className={`relative p-2 rounded-xl flex flex-col items-center gap-1.5 transition-all text-center border cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
										isSelected ?
											'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-[1.03]'
										:	'bg-[#0D1030]/90 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80 hover:scale-[1.02]'
									}`}>
									{/* Active Checkmark Pin */}
									{isSelected && (
										<span className='absolute top-1 right-1 bg-cyan-400 text-slate-950 rounded-full p-0.5 shadow-sm'>
											<Check className='w-2.5 h-2.5 stroke-[3]' />
										</span>
									)}
									<KidAvatar
										avatarId={avatar.id}
										size='sm'
									/>
									<div className='min-w-0 w-full'>
										<p className='text-[11px] font-bold text-white truncate leading-tight'>
											{avatar.name.split(' ')[0]}
										</p>
										<p className='text-[9px] text-slate-400 truncate leading-none mt-0.5'>
											{avatar.label}
										</p>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
});

export default ProfileSettingsTab;
