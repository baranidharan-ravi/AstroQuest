import { Plus, Trash2, UserCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import { playButtonPop, playCorrectSound } from '../../utils/audioSynthesis';
import {
	getDefaultAvatarForGender,
	KidAvatar,
	PRESET_AVATARS,
} from '../../utils/avatarManager';
import { calculateRank } from '../../utils/badgeManager';
import {
	createCrewMember,
	deleteCrewMember,
	getActiveCrewId,
	getAllCrewMembers,
	switchActiveCrewMember,
} from '../../utils/crewManager';

export default function CrewSwitcherModal({
	isOpen,
	onClose,
	soundEnabled = true,
}) {
	const [crewList, setCrewList] = useState(() => getAllCrewMembers());
	const [activeId, setActiveId] = useState(() => getActiveCrewId());
	const [isAddingNew, setIsAddingNew] = useState(false);

	// New member form states
	const [newName, setNewName] = useState('');
	const [newAge, setNewAge] = useState(6);
	const [newGender, setNewGender] = useState('boy');
	const [newAvatar, setNewAvatar] = useState('boy-astronaut-1');
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const refreshList = () => {
		setCrewList(getAllCrewMembers());
		setActiveId(getActiveCrewId());
	};

	const handleSwitch = (id) => {
		playButtonPop(soundEnabled);
		switchActiveCrewMember(id);
		refreshList();
		setTimeout(() => {
			onClose();
		}, 200);
	};

	const handleDelete = (e, id) => {
		e.stopPropagation();
		playButtonPop(soundEnabled);
		if (
			window.confirm('Remove this astronaut profile from your flight crew?')
		) {
			deleteCrewMember(id);
			refreshList();
		}
	};

	const handleCreateNew = (e) => {
		e.preventDefault();
		const trimmed = newName.trim();
		if (!trimmed) {
			setError('Please enter an astronaut name.');
			return;
		}

		playCorrectSound(soundEnabled);
		createCrewMember({
			name: trimmed,
			age: Number(newAge) || 6,
			gender: newGender,
			avatar: newAvatar,
		});

		refreshList();
		setIsAddingNew(false);
		setNewName('');
		setError('');
		onClose();
	};

	const quickAges = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn'
			role='dialog'
			aria-modal='true'
			aria-labelledby='crew-modal-title'>
			<div className='relative w-full max-w-lg bg-gradient-to-b from-[#181B45] via-[#101335] to-[#0A0D28] border-2 border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-white overflow-hidden max-h-[90vh] flex flex-col'>
				{/* Top Bar */}
				<div className='flex items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4 flex-shrink-0'>
					<div className='flex items-center gap-2'>
						<span className='p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
							<Users className='w-5 h-5' />
						</span>
						<div>
							<h2
								id='crew-modal-title'
								className='text-base sm:text-lg font-black text-white flex items-center gap-1.5'>
								<span>Flight Crew Profiles</span>
								<span className='text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40'>
									{crewList.length} Astronaut{crewList.length === 1 ? '' : 's'}
								</span>
							</h2>
							<p className='text-[11px] text-slate-300'>
								Switch explorers or add siblings &amp; classmates
							</p>
						</div>
					</div>

					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onClose();
						}}
						className='p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer'
						aria-label='Close modal'>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Body Content */}
				<div className='flex-1 overflow-y-auto pr-1 space-y-3 min-h-0'>
					{!isAddingNew ?
						<>
							{/* Astronaut List */}
							<div className='space-y-2.5'>
								{crewList.map((member) => {
									const isActive = member.id === activeId;
									const rank = calculateRank(member.xp || 0);
									return (
										<div
											key={member.id}
											onClick={() => !isActive && handleSwitch(member.id)}
											className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
												isActive ?
													'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
												:	'bg-[#131742]/70 border-slate-700/80 hover:border-cyan-500/50 hover:bg-[#181E55] cursor-pointer'
											}`}>
											<div className='flex items-center gap-3 min-w-0'>
												<div className='relative flex-shrink-0'>
													<KidAvatar
														avatarId={member.avatar}
														gender={member.gender}
														size='md'
													/>
													{isActive && (
														<span
															className='absolute -bottom-1 -right-1 bg-cyan-400 text-cyan-950 p-0.5 rounded-full ring-2 ring-[#101335]'
															title='Active astronaut'>
															<UserCheck className='w-3.5 h-3.5' />
														</span>
													)}
												</div>

												<div className='min-w-0'>
													<div className='flex items-center gap-2'>
														<span className='font-black text-sm text-white truncate'>
															{member.name}
														</span>
														<span className='text-[10px] font-bold text-slate-300 bg-black/40 px-1.5 py-0.2 rounded'>
															Age {member.age}
														</span>
													</div>
													<div className='flex items-center gap-1.5 text-[11px] text-cyan-300 mt-0.5'>
														<span>{rank.icon}</span>
														<span className='font-semibold'>{rank.title}</span>
														<span className='text-slate-400'>•</span>
														<span className='font-mono text-slate-300 font-bold'>
															{member.xp || 0} XP
														</span>
													</div>
												</div>
											</div>

											<div className='flex items-center gap-2 flex-shrink-0'>
												{isActive ?
													<span className='text-xs font-black text-cyan-300 bg-cyan-400/20 px-2.5 py-1 rounded-xl border border-cyan-400/50'>
														ACTIVE
													</span>
												:	<button
														type='button'
														onClick={() => handleSwitch(member.id)}
														className='text-xs font-black text-white bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer'>
														Switch
													</button>
												}

												{crewList.length > 1 && (
													<button
														type='button'
														onClick={(e) => handleDelete(e, member.id)}
														className='p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer'
														title='Delete profile'>
														<Trash2 className='w-4 h-4' />
													</button>
												)}
											</div>
										</div>
									);
								})}
							</div>

							{/* Add New Astronaut Button */}
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setIsAddingNew(true);
								}}
								className='w-full py-3 px-4 rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 hover:text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer mt-3'>
								<Plus className='w-4 h-4' />
								<span>Add New Astronaut to Flight Crew</span>
							</button>
						</>
					:	/* Add New Astronaut Form */
						<form
							onSubmit={handleCreateNew}
							className='space-y-3.5 animate-fadeIn'>
							<div className='flex items-center justify-between'>
								<h3 className='text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider'>
									🚀 Recruit New Astronaut
								</h3>
								<button
									type='button'
									onClick={() => setIsAddingNew(false)}
									className='text-xs text-slate-400 hover:text-white underline cursor-pointer'>
									Cancel
								</button>
							</div>

							{error && (
								<div className='p-2 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-bold text-center'>
									{error}
								</div>
							)}

							{/* Child Name */}
							<div>
								<label className='block text-xs font-bold text-slate-300 mb-1'>
									Astronaut Name:
								</label>
								<input
									type='text'
									maxLength={20}
									placeholder='e.g. Diya, Rohan, Maya'
									value={newName}
									onChange={(e) => {
										setNewName(e.target.value);
										if (error) setError('');
									}}
									className='w-full px-3 py-2 rounded-xl bg-[#0B0E2A] border border-cyan-500/40 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400'
									autoFocus
								/>
							</div>

							{/* Child Age */}
							<div>
								<label className='block text-xs font-bold text-slate-300 mb-1'>
									Age (for adaptive difficulty):
								</label>
								<div className='flex flex-wrap gap-1.5'>
									{quickAges.map((age) => (
										<button
											key={age}
											type='button'
											onClick={() => {
												playButtonPop(soundEnabled);
												setNewAge(age);
											}}
											className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer ${
												newAge === age ?
													'bg-cyan-500 text-cyan-950 shadow-md scale-105'
												:	'bg-[#0B0E2A] border border-slate-700 text-slate-300 hover:border-slate-500'
											}`}>
											{age}
										</button>
									))}
								</div>
							</div>

							{/* Gender */}
							<div>
								<label className='block text-xs font-bold text-slate-300 mb-1'>
									Gender:
								</label>
								<div className='grid grid-cols-2 gap-2'>
									{['boy', 'girl'].map((g) => (
										<button
											key={g}
											type='button'
											onClick={() => {
												playButtonPop(soundEnabled);
												setNewGender(g);
												setNewAvatar(getDefaultAvatarForGender(g));
											}}
											className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
												newGender === g ?
													'bg-purple-600 text-white shadow-md'
												:	'bg-[#0B0E2A] border border-slate-700 text-slate-400'
											}`}>
											{g === 'boy' ? '👦 Boy' : '👧 Girl'}
										</button>
									))}
								</div>
							</div>

							{/* Avatar Selection */}
							<div>
								<label className='block text-xs font-bold text-slate-300 mb-1.5'>
									Choose Mission Avatar:
								</label>
								<div className='grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-[#090C25] rounded-xl border border-slate-800'>
									{PRESET_AVATARS.slice(0, 12).map((av) => (
										<button
											key={av.id}
											type='button'
											onClick={() => {
												playButtonPop(soundEnabled);
												setNewAvatar(av.id);
											}}
											className={`p-1 rounded-xl transition-all flex flex-col items-center cursor-pointer ${
												newAvatar === av.id ?
													'bg-cyan-500/30 border-2 border-cyan-400 scale-105'
												:	'hover:bg-white/5 border border-transparent'
											}`}>
											<KidAvatar
												avatarId={av.id}
												gender={newGender}
												size='sm'
											/>
										</button>
									))}
								</div>
							</div>

							{/* Submit Button */}
							<button
								type='submit'
								className='w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-cyan-950 font-black text-sm shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer mt-2'>
								Launch Astronaut Profile 🚀
							</button>
						</form>
					}
				</div>
			</div>
		</div>
	);
}
