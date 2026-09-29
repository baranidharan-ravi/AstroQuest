import { AlertTriangle, Trash2, X } from 'lucide-react';
import React, { memo } from 'react';
import { playButtonPop } from '../../../utils/audioSynthesis';

export const SkillDeleteModal = memo(function SkillDeleteModal({
	skillToDelete,
	setSkillToDelete,
	handleConfirmDelete,
	soundEnabled,
}) {
	if (!skillToDelete) return null;

	return (
<div
					role='dialog'
					aria-modal='true'
					aria-labelledby='delete-skill-title'
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in'
					onClick={() => setSkillToDelete(null)}>
					<div
						className='bg-[#16194E] border-2 border-rose-500/80 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl'
						onClick={(e) => e.stopPropagation()}>
						<div className='flex items-center gap-3 mb-3'>
							<div className='w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400'>
								<Trash2 className='w-5 h-5' />
							</div>
							<div>
								<h3
									id='delete-skill-title'
									className='text-lg font-black text-white'>
									Delete Skillset?
								</h3>
								<span className='text-xs text-rose-300 font-semibold'>
									{skillToDelete.name}
								</span>
							</div>
						</div>

						<p className='text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed mb-5'>
							Are you sure you want to remove the custom skillset &ldquo;
							{skillToDelete.name}&rdquo;? Any future questions for this topic
							will no longer appear on your dashboard.
						</p>

						<div className='flex items-center justify-end gap-3'>
							<button
								type='button'
								onClick={() => setSkillToDelete(null)}
								className='px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all cursor-pointer'>
								Keep Skillset
							</button>
							<button
								type='button'
								onClick={handleConfirmDelete}
								className='px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer'>
								Yes, Delete
							</button>
						</div>
					</div>
				</div>
	);
});

export default SkillDeleteModal;
