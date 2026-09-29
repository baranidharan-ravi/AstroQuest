import { X } from 'lucide-react';
import { memo } from 'react';
import { POPULAR_ICONS } from '../../../constants';
import { playButtonPop } from '../../../utils/audioSynthesis';
import { SkillIcon } from '../../../utils/SkillIcon';

/**
 * SkillIconSelectorModal Component
 *
 * Implements SOLID Single Responsibility:
 * Modal dialog for selecting vector SVG font icons.
 */
export const SkillIconSelectorModal = memo(function SkillIconSelectorModal({
	isIconPickerOpen,
	setIsIconPickerOpen,
	newSkillIcon,
	setNewSkillIcon,
	soundEnabled,
}) {
	if (!isIconPickerOpen) return null;

	const handleSelect = (iconId) => {
		playButtonPop(soundEnabled);
		setNewSkillIcon(iconId);
		setIsIconPickerOpen(false);
	};

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='icon-picker-title'
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in'
			onClick={() => setIsIconPickerOpen(false)}>
			<div
				className='bg-gradient-to-b from-[#16194E] via-[#10133A] to-[#0A0C27] border-2 border-cyan-400/80 rounded-3xl p-5 sm:p-6 max-w-lg w-full text-white shadow-2xl relative'
				onClick={(e) => e.stopPropagation()}>
				{/* Close Button */}
				<button
					type='button'
					onClick={() => setIsIconPickerOpen(false)}
					className='absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer'
					aria-label='Close icon picker'>
					<X className='w-5 h-5' />
				</button>

				{/* Header */}
				<div className='flex items-center gap-3 mb-4'>
					<div className='w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0'>
						<SkillIcon
							icon={newSkillIcon || 'Rocket'}
							className='w-5 h-5'
						/>
					</div>
					<div>
						<h3
							id='icon-picker-title'
							className='text-lg font-black text-white'>
							Select Skill Icon
						</h3>
						<p className='text-xs text-slate-300 font-medium'>
							Choose from 24 curated vector icons
						</p>
					</div>
				</div>

				{/* Icon Grid */}
				<div className='grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4 max-h-64 overflow-y-auto p-2 bg-[#090B24]/90 border border-white/10 rounded-2xl'>
					{POPULAR_ICONS.map((iconItem) => {
						const isSelected =
							newSkillIcon === iconItem.id || newSkillIcon === iconItem.label;
						return (
							<button
								key={iconItem.id}
								type='button'
								title={iconItem.label}
								aria-label={iconItem.label}
								onClick={() => handleSelect(iconItem.id)}
								className={`h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer p-1 ${
									isSelected ?
										'bg-cyan-500/30 border-2 border-cyan-400 scale-105 shadow-lg text-cyan-300'
									:	'bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white'
								}`}>
								<SkillIcon
									icon={iconItem.id}
									className='w-5 h-5'
								/>
								<span className='text-[9px] font-semibold truncate max-w-full'>
									{iconItem.label}
								</span>
							</button>
						);
					})}
				</div>

				{/* Footer */}
				<div className='flex items-center justify-end pt-3 border-t border-white/10'>
					<button
						type='button'
						onClick={() => setIsIconPickerOpen(false)}
						className='px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all cursor-pointer'>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
});

export default SkillIconSelectorModal;
