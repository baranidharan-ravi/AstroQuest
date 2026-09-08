import { HelpCircle, Sparkles, Volume2, X } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';
import { playButtonPop, speakText } from '../../utils/audioSynthesis';

const AskDoubtModal = memo(function AskDoubtModal({
	question,
	isOpen,
	onClose,
	soundEnabled,
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);

	// WCAG AA: Escape key and focus trapping
	useEffect(() => {
		if (!isOpen || !question) return;

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
	}, [isOpen, question, onClose]);

	if (!isOpen || !question) return null;

	const handleAudioExplain = () => {
		playButtonPop(soundEnabled);
		speakText(
			`Here is a special explanation for this question. ${question.solutionText} Remember to count step by step, or look for clues in the picture.`,
		);
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='ask-doubt-modal-title'>
			<div
				ref={modalRef}
				className='bg-[#15194D] border-2 border-[#38419D] text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col gap-4'>
				{/* Close Button */}
				<button
					ref={closeBtnRef}
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Close AI doubt helper dialog'
					className='absolute top-4 right-4 p-2 rounded-full bg-[#20276E] text-gray-300 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none'>
					<X className='w-4 h-4' />
				</button>

				{/* Header */}
				<div className='flex items-center gap-3'>
					<div
						aria-hidden='true'
						className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center shadow-lg'>
						<HelpCircle className='w-7 h-7 text-white' />
					</div>
					<div>
						<h3
							id='ask-doubt-modal-title'
							className='text-xl font-black text-white'>
							AI Doubt Helper 🤖
						</h3>
						<span className='text-xs font-semibold text-pink-300'>
							Need extra help understanding? We've got you!
						</span>
					</div>
				</div>

				{/* Friendly Explanation */}
				<div className='bg-white text-slate-800 rounded-2xl p-5 shadow-inner flex flex-col gap-3'>
					<div className='flex items-center justify-between'>
						<span className='text-xs font-black uppercase tracking-wider text-purple-600'>
							Step-by-Step Breakdown:
						</span>
						<button
							type='button'
							onClick={handleAudioExplain}
							aria-label='Read explanation aloud'
							className='flex items-center gap-1 text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-700 px-2.5 py-1 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none'>
							<Volume2 className='w-3.5 h-3.5' />
							<span>Read Aloud</span>
						</button>
					</div>

					<p className='text-sm font-bold text-slate-700 leading-relaxed'>
						{question.solutionText}
					</p>

					<div className='bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-bold text-amber-900 flex items-start gap-2'>
						<Sparkles
							aria-hidden='true'
							className='w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5'
						/>
						<span>
							Pro Tip for 5yo Explorers: Take your time to point at each shape
							on your screen with your finger!
						</span>
					</div>
				</div>

				{/* Buttons */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Close doubt helper and continue'
					className='w-full py-3.5 rounded-xl bg-[#FF5B84] hover:bg-[#FF435A] text-white font-extrabold text-base shadow-lg transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:outline-none'>
					I Understand Now! 👍
				</button>
			</div>
		</div>
	);
});

export default AskDoubtModal;
