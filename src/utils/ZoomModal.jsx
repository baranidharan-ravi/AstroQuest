import { X, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';
import { playButtonPop } from './audioSynthesis';
import VisualDiagram, {
	isDiagramAppropriateForQuestion,
} from './VisualDiagrams';

const ZoomModal = React.memo(function ZoomModal({
	diagramType,
	diagramData,
	isOpen,
	onClose,
	soundEnabled,
}) {
	const [scale, setScale] = React.useState(1.4);
	const modalRef = React.useRef(null);
	const closeBtnRef = React.useRef(null);

	const isAppropriate = isDiagramAppropriateForQuestion(
		diagramType,
		diagramData,
		diagramData?.questionText,
	);

	// WCAG AA: Escape key and focus trapping
	React.useEffect(() => {
		if (!isOpen || !diagramType || !isAppropriate) return;

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
		// Auto-focus first button on open
		const timer = setTimeout(() => {
			if (closeBtnRef.current) {
				closeBtnRef.current.focus();
			}
		}, 50);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(timer);
		};
	}, [isOpen, diagramType, isAppropriate, onClose]);

	if (!isOpen || !diagramType || !isAppropriate) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='zoom-modal-title'>
			<div
				ref={modalRef}
				className='bg-white text-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-200'>
				{/* Top Controls */}
				<div className='w-full flex items-center justify-between pb-3 border-b border-slate-200 mb-4'>
					<h2
						id='zoom-modal-title'
						className='font-extrabold text-slate-700 text-lg'>
						🔍 Close-up Diagram View
					</h2>

					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={() => setScale((s) => Math.min(s + 0.2, 2.2))}
							aria-label='Zoom in'
							className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none'
							title='Zoom In'>
							<ZoomIn className='w-4 h-4' />
						</button>
						<button
							type='button'
							onClick={() => setScale((s) => Math.max(s - 0.2, 0.8))}
							aria-label='Zoom out'
							className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none'
							title='Zoom Out'>
							<ZoomOut className='w-4 h-4' />
						</button>
						<button
							ref={closeBtnRef}
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								onClose();
							}}
							aria-label='Close diagram view'
							className='p-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-lg text-slate-700 ml-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none'
							title='Close'>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				{/* Scaled Diagram */}
				<div className='w-full overflow-auto flex items-center justify-center p-8 bg-slate-50 rounded-2xl min-h-[300px]'>
					<div
						style={{
							transform: `scale(${scale})`,
							transition: 'transform 0.2s ease-out',
						}}>
						<VisualDiagram
							type={diagramType}
							data={diagramData}
						/>
					</div>
				</div>

				{/* Done button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Finish close-up view'
					className='mt-5 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:outline-none'>
					Done Looking ✨
				</button>
			</div>
		</div>
	);
});

export default ZoomModal;
