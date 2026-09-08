import { X, Zap } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';

const HintModal = memo(function HintModal({
	hintText,
	isOpen,
	onClose,
	soundEnabled,
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);

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
			if (closeBtnRef.current) {
				closeBtnRef.current.focus();
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
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='hint-modal-title'>
			<div
				ref={modalRef}
				className='bg-[#15194D] border-2 border-[#38419D] text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative transform animate-in zoom-in-95 duration-200'>
				{/* Close Button */}
				<button
					ref={closeBtnRef}
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Close hint dialog'
					className='absolute top-4 right-4 p-2 rounded-full bg-[#20276E] text-gray-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none'>
					<X className='w-4 h-4' />
				</button>

				{/* Header with Zap */}
				<div className='flex items-center gap-3 mb-4'>
					<div
						aria-hidden='true'
						className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center shadow-lg'>
						<Zap className='w-7 h-7 text-white fill-white animate-bounce-short' />
					</div>
					<div>
						<h3
							id='hint-modal-title'
							className='text-xl font-black text-white'>
							Super Explorer Hint! 💡
						</h3>
						<span className='text-xs font-semibold text-pink-300'>
							Here is a friendly clue to help you think
						</span>
					</div>
				</div>

				{/* Hint Body */}
				<div className='bg-white text-slate-800 rounded-2xl p-4 sm:p-5 font-bold text-sm sm:text-base leading-relaxed shadow-inner my-4'>
					{hintText ||
						'Look closely at the shapes, colors, and patterns! You can do it!'}
				</div>

				{/* Got It Button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Dismiss hint and return to puzzle'
					className='w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base shadow-lg transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:outline-none'>
					Got It! Let's Try 🚀
				</button>
			</div>
		</div>
	);
});

export default HintModal;
