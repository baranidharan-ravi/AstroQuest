import { memo } from 'react';
import { SkillIcon } from '../../../utils/SkillIcon';

export const SkillInfoModal = memo(function SkillInfoModal({
	infoModalSkill,
	setInfoModalSkill,
	onSelectSkill,
	handlePrintWorksheet,
	soundEnabled,
}) {
	if (!infoModalSkill) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in'>
			<button
				type='button'
				tabIndex={-1}
				aria-label='Close skill information modal backdrop'
				className='fixed inset-0 w-full h-full bg-transparent border-0 cursor-default focus:outline-none'
				onClick={() => setInfoModalSkill(null)}
			/>
			<dialog
				open
				aria-labelledby='skill-info-title'
				className='relative z-10 m-auto bg-[#16194E] border-2 border-cyan-400 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl block'>
				<div className='flex items-center gap-2.5 mb-2'>
					<div className='w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0'>
						<SkillIcon
							icon={infoModalSkill.icon || 'Rocket'}
							className='w-6 h-6'
						/>
					</div>
					<div>
						<h3
							id='skill-info-title'
							className='text-xl font-black text-cyan-300 leading-tight'>
							{infoModalSkill.name}
						</h3>
						<span className='text-xs text-slate-400 font-semibold'>
							{infoModalSkill.tagline || 'Skill Overview'}
						</span>
					</div>
				</div>

				<p className='text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed mb-3'>
					{infoModalSkill.description}
				</p>

				{infoModalSkill.coreObjective && (
					<div className='p-3 rounded-xl bg-white/5 border border-white/10 mb-4'>
						<span className='text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 block mb-1'>
							🎯 Core Learning Objective:
						</span>
						<p className='text-xs text-slate-200 font-medium leading-relaxed'>
							{infoModalSkill.coreObjective}
						</p>
					</div>
				)}

				<button
					type='button'
					onClick={() => setInfoModalSkill(null)}
					aria-label='Close skill information modal'
					className='w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-sm transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none'>
					Got It!
				</button>
			</dialog>
		</div>
	);
});

export default SkillInfoModal;
