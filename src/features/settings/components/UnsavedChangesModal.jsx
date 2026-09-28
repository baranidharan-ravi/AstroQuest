import { AlertTriangle, RotateCcw, Save, X } from 'lucide-react';
import { memo } from 'react';
import { playButtonPop } from '../../../utils/audioSynthesis';

/**
 * UnsavedChangesModal
 * Confirmation dialog when explorer or parent attempts to navigate away with unsaved changes.
 */
export const UnsavedChangesModal = memo(function UnsavedChangesModal({
	isOpen,
	modalRef,
	onClose,
	onKeepEditing = onClose,
	onSaveAndLeave,
	onRevertAndLeave,
	soundEnabled = true,
}) {
	if (!isOpen) return null;

	const handleClose = () => {
		playButtonPop(soundEnabled);
		if (onClose) onClose();
		else if (onKeepEditing) onKeepEditing();
	};

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='unsaved-modal-title'
			aria-describedby='unsaved-modal-desc'
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200'>
			<div
				ref={modalRef}
				tabIndex={-1}
				className='bg-[#131642] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(251,191,36,0.35)] text-center animate-in zoom-in-95 duration-200 relative focus:outline-none'>
				{/* Close icon button */}
				<button
					type='button'
					aria-label='Close unsaved changes dialog'
					onClick={handleClose}
					className='absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400'
					title='Close'>
					<X className='w-5 h-5' />
				</button>

				<div
					aria-hidden='true'
					className='w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-300'>
					<AlertTriangle className='w-8 h-8' />
				</div>

				<h2
					id='unsaved-modal-title'
					className='text-xl sm:text-2xl font-black text-white mb-2'>
					Unsaved Changes Detected! ⚠️
				</h2>

				<p
					id='unsaved-modal-desc'
					className='text-xs sm:text-sm text-slate-300 font-semibold mb-6 leading-relaxed'>
					You modified your settings without saving. Please save your settings
					before navigating, or your changes will be discarded and reverted back
					to the previous values.
				</p>

				<div className='flex flex-col gap-3'>
					{/* 1. Save & Continue */}
					<button
						type='button'
						onClick={onSaveAndLeave}
						className='w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-95 text-white font-black text-sm sm:text-base tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-400'>
						<Save className='w-4 h-4' />
						<span>Save Settings & Continue 💾</span>
					</button>

					{/* 2. Discard & Revert */}
					<button
						type='button'
						onClick={onRevertAndLeave}
						className='w-full py-3.5 px-5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-200 hover:text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-rose-400'>
						<RotateCcw className='w-4 h-4 text-rose-300' />
						<span>Discard Changes & Revert ↩️</span>
					</button>

					{/* 3. Keep Editing */}
					<button
						type='button'
						onClick={handleClose}
						className='w-full py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400'>
						Keep Editing
					</button>
				</div>
			</div>
		</div>
	);
});

export default UnsavedChangesModal;
