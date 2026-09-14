import { Sparkles, X, Zap } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';

const HintModal = memo(function HintModal({
	hintText,
	isOpen,
	onClose,
	soundEnabled,
	onActivateCosmicRay,
	cosmicRayUsed = false,
	canUseCosmicRay = true,
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);
	const [activeTab, setActiveTab] = useState('clue'); // 'clue' | 'ray' | 'steps'

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
				className='bg-[#15194D] border-2 border-[#38419D] text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transform animate-in zoom-in-95 duration-200'>
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
							Cosmic Clues & Power-Ups 💡
						</h3>
						<span className='text-xs font-semibold text-pink-300'>
							Choose a hint or blast away 2 wrong answers!
						</span>
					</div>
				</div>

				{/* Tier Navigation Tabs */}
				<div className='grid grid-cols-2 gap-2 mb-4 bg-[#0E1238] p-1.5 rounded-2xl border border-white/10'>
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setActiveTab('clue');
						}}
						className={`py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
							activeTab === 'clue' ?
								'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
							:	'text-slate-400 hover:text-white'
						}`}>
						💡 Cosmic Clue
					</button>

					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setActiveTab('ray');
						}}
						className={`py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
							activeTab === 'ray' ?
								'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
							:	'text-slate-400 hover:text-white'
						}`}>
						<span>⚡ 50/50 Blast</span>
						{cosmicRayUsed && (
							<span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
						)}
					</button>
				</div>

				{/* Tab 1: Cosmic Clue */}
				{activeTab === 'clue' && (
					<div className='bg-white text-slate-800 rounded-2xl p-4 sm:p-5 font-bold text-sm sm:text-base leading-relaxed shadow-inner my-3 animate-in fade-in duration-150'>
						{hintText ||
							'Look closely at the shapes, numbers, and relationships. Eliminate options that don’t fit!'}
					</div>
				)}

				{/* Tab 2: 50/50 Cosmic Ray Blast */}
				{activeTab === 'ray' && (
					<div className='bg-gradient-to-b from-[#1C1F5E] to-[#121644] border border-amber-400/40 rounded-2xl p-4 sm:p-5 text-center my-3 animate-in fade-in duration-150'>
						<div className='w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow'>
							<Sparkles className='w-6 h-6 animate-spin' />
						</div>
						<h4 className='text-base sm:text-lg font-black text-white mb-1'>
							50/50 Cosmic Ray Power-Up ☄️
						</h4>
						<p className='text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed'>
							{cosmicRayUsed ?
								'The Cosmic Ray has already disintegrated 2 incorrect options from this question!'
							:	'Fire a cosmic beam to vaporize 2 incorrect options, leaving only the right answer and 1 distractor!'
							}
						</p>

						<button
							type='button'
							disabled={cosmicRayUsed || !canUseCosmicRay}
							onClick={() => {
								if (onActivateCosmicRay) {
									onActivateCosmicRay();
								}
								onClose();
							}}
							className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
								cosmicRayUsed ?
									'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 opacity-80 cursor-not-allowed'
								:	'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-amber-400/50'
							}`}>
							<Zap className='w-4 h-4 fill-current' />
							<span>
								{cosmicRayUsed ?
									'✓ 2 Options Blasted!'
								:	'Fire 50/50 Cosmic Ray ⚡'}
							</span>
						</button>
					</div>
				)}

				{/* Primary Action Button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Dismiss hint and return to puzzle'
					className='w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm sm:text-base shadow-lg transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:outline-none mt-2'>
					Back to Challenge 🚀
				</button>
			</div>
		</div>
	);
});

export default HintModal;
