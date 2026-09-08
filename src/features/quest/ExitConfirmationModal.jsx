import { LogOut, Play, X } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';

const ExitConfirmationModal = memo(function ExitConfirmationModal({
	isOpen,
	onClose,
	onConfirmExit,
	currentIndex = 0,
	totalQuestions = 10,
	selectedSkill = 'Visual',
	soundEnabled = true,
}) {
	const modalRef = useRef(null);
	const primaryBtnRef = useRef(null);

	// WCAG AA: Escape key and focus trapping
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
				return;
			}

			if (e.key === 'Tab' && modalRef.current) {
				const focusables = modalRef.current.querySelectorAll(
					'button:not([disabled]), [tabindex="0"]',
				);
				if (focusables.length === 0) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];

				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		const timer = setTimeout(() => {
			if (primaryBtnRef.current) {
				primaryBtnRef.current.focus();
			}
		}, 50);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(timer);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='exit-modal-title'>
			<div
				ref={modalRef}
				className='bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-rose-400/80 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.35)] text-white relative animate-in zoom-in-95 duration-200'>
				{/* Top Close / Cancel Button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Cancel and continue quest'
					className='absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none'
					title='Close'>
					<X className='w-5 h-5' />
				</button>

				{/* Header Icon & Title */}
				<div className='text-center mb-5'>
					<div
						aria-hidden='true'
						className='w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shadow-lg mb-3 text-rose-300'>
						<LogOut className='w-7 h-7' />
					</div>

					<h2
						id='exit-modal-title'
						className='text-xl sm:text-2xl font-black text-white tracking-wide'>
						Exit AstroQuest?
					</h2>
					<p className='text-xs sm:text-sm font-semibold text-slate-300 mt-2 leading-relaxed'>
						You are currently on Question{' '}
						<span className='text-cyan-300 font-extrabold'>
							{currentIndex + 1}
						</span>{' '}
						of {totalQuestions} in{' '}
						<span className='text-pink-300 font-extrabold'>
							{selectedSkill}
						</span>
						.
					</p>
					<p
						role='alert'
						className='text-xs text-amber-200/90 font-medium mt-1.5 bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-1.5'>
						⚠️ Thinksheet is in progress. If you exit now, progress will not be
						saved.
					</p>
				</div>

				{/* Action Buttons */}
				<div className='flex flex-col gap-2.5 mt-2'>
					{/* Primary: Continue Quest */}
					<button
						ref={primaryBtnRef}
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onClose();
						}}
						aria-label='Continue AstroQuest'
						className='w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-lg transform hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:outline-none'>
						<Play className='w-4 h-4 fill-white' />
						<span>Continue AstroQuest 🚀</span>
					</button>

					{/* Secondary: Exit to Skills Hub */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onConfirmExit();
						}}
						aria-label='Exit without saving'
						className='w-full py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/50 hover:border-rose-400 text-rose-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-4 focus-visible:ring-rose-400 focus-visible:outline-none'>
						<LogOut className='w-4 h-4' />
						<span>Exit Without Saving 🚪</span>
					</button>
				</div>
			</div>
		</div>
	);
});

export default ExitConfirmationModal;
