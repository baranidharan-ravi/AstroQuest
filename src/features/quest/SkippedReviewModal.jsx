import { Award, ChevronRight, RotateCcw, Sparkles, X } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';

const SkippedReviewModal = memo(function SkippedReviewModal({
	isOpen,
	onRevisit,
	onViewResults,
	skippedIndices = [],
	soundEnabled = true,
}) {
	const modalRef = useRef(null);
	const revisitBtnRef = useRef(null);
	const skippedCount = skippedIndices.length;

	// WCAG AA: Escape key and focus trapping
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				// Default to viewing results on escape dismissal
				onViewResults();
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
			if (revisitBtnRef.current) {
				revisitBtnRef.current.focus();
			}
		}, 60);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(timer);
		};
	}, [isOpen, onViewResults]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='skipped-modal-title'>
			<div
				ref={modalRef}
				className='bg-gradient-to-b from-[#1E1B4B] via-[#16194A] to-[#0D1030] border-4 border-amber-400/80 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.35)] text-white relative animate-in zoom-in-95 duration-200'>
				{/* Top Close Button (Defaults to viewing results) */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onViewResults();
					}}
					aria-label='Close and view results'
					className='absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none'
					title='Close'>
					<X className='w-5 h-5' />
				</button>

				{/* Header Icon & Title */}
				<div className='text-center mb-5'>
					<div
						aria-hidden='true'
						className='w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-lg mb-3 text-amber-300 animate-pulse'>
						<RotateCcw className='w-8 h-8' />
					</div>

					<h2
						id='skipped-modal-title'
						className='text-xl sm:text-2xl font-black text-white tracking-wide'>
						Skipped Questions Available!
					</h2>

					<p className='text-xs sm:text-sm font-semibold text-slate-300 mt-2 leading-relaxed'>
						You skipped{' '}
						<span className='text-amber-400 font-extrabold text-base'>
							{skippedCount}
						</span>{' '}
						{skippedCount === 1 ? 'question' : 'questions'} during your quest.
						Would you like to revisit them to score extra stars, or proceed
						straight to your results?
					</p>
				</div>

				{/* Skipped Question Pills */}
				<div className='bg-[#0A0D28]/70 border border-amber-400/30 rounded-2xl p-3.5 mb-6'>
					<div className='text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5'>
						<Sparkles className='w-3.5 h-3.5 text-amber-400' />
						<span>Questions Awaiting Answers:</span>
					</div>
					<div className='flex flex-wrap gap-2'>
						{skippedIndices.map((qIdx) => (
							<span
								key={qIdx}
								className='px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black flex items-center gap-1'>
								<span>Question {qIdx + 1}</span>
							</span>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex flex-col gap-3'>
					{/* Primary Action: Revisit Skipped Questions */}
					<button
						ref={revisitBtnRef}
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onRevisit();
						}}
						className='w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_8px_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:outline-none'>
						<RotateCcw className='w-5 h-5 text-slate-950 stroke-[2.5]' />
						<span>Revisit Skipped Questions ({skippedCount})</span>
					</button>

					{/* Secondary Action: Finish & View Results */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onViewResults();
						}}
						className='w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-bold text-xs sm:text-sm tracking-wide border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none'>
						<Award className='w-4 h-4 text-cyan-400' />
						<span>Finish & View Results</span>
						<ChevronRight className='w-4 h-4 opacity-60' />
					</button>
				</div>
			</div>
		</div>
	);
});

export default SkippedReviewModal;
