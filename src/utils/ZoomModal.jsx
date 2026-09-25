import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
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
	const [scale, setScale] = React.useState(1.0);
	const [fitScale, setFitScale] = React.useState(1.0);
	const modalRef = React.useRef(null);
	const closeBtnRef = React.useRef(null);
	const containerRef = React.useRef(null);
	const contentRef = React.useRef(null);

	const isAppropriate = isDiagramAppropriateForQuestion(
		diagramType,
		diagramData,
		diagramData?.questionText,
	);

	// Compute auto-fit scale so the diagram fits completely without any scrollbars
	const computeFitScale = React.useCallback(() => {
		const container = containerRef.current;
		const content = contentRef.current;
		if (!container || !content) return;

		// Available dimensions with safe padding
		const padX = 24;
		const padY = 24;
		const availW = Math.max(container.clientWidth - padX, 80);
		const availH = Math.max(container.clientHeight - padY, 80);

		// Natural dimensions of the content
		const contentW = content.scrollWidth || content.offsetWidth || 1;
		const contentH = content.scrollHeight || content.offsetHeight || 1;

		if (contentW > 0 && contentH > 0) {
			const scaleX = availW / contentW;
			const scaleY = availH / contentH;
			// Fit completely within both width and height, capped at 1.0 (zoom out if needed to fit)
			const fit = Math.min(1.0, scaleX, scaleY);
			const safeFit = Math.max(0.35, Math.min(1.0, Math.round(fit * 100) / 100));
			setFitScale(safeFit);
			setScale(safeFit);
		}
	}, []);

	// Reset scale and compute fit when opened or data changes
	React.useEffect(() => {
		if (!isOpen || !diagramType || !isAppropriate) return;

		// Initial compute on next animation frame
		const rafId = requestAnimationFrame(() => {
			computeFitScale();
		});
		const timer = setTimeout(computeFitScale, 60);

		window.addEventListener('resize', computeFitScale);

		// Observe container size changes
		let resizeObserver = null;
		if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
			resizeObserver = new ResizeObserver(() => {
				computeFitScale();
			});
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			cancelAnimationFrame(rafId);
			clearTimeout(timer);
			window.removeEventListener('resize', computeFitScale);
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		};
	}, [isOpen, diagramType, diagramData, isAppropriate, computeFitScale]);

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
			className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='zoom-modal-title'>
			<div
				ref={modalRef}
				className='bg-white text-slate-800 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-200 max-h-[92vh]'>
				{/* Top Controls */}
				<div className='w-full flex items-center justify-between pb-3 border-b border-slate-200 mb-3 flex-shrink-0'>
					<h2
						id='zoom-modal-title'
						className='font-extrabold text-slate-700 text-base sm:text-lg flex items-center gap-1.5'>
						<span>🔍</span>
						<span>Close-up Diagram View</span>
					</h2>

					<div className='flex items-center gap-1 sm:gap-2'>
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								setScale((s) => Math.min(Number((s + 0.15).toFixed(2)), 1.8));
							}}
							aria-label='Zoom in'
							className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors'
							title='Zoom In'>
							<ZoomIn className='w-4 h-4' />
						</button>
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								setScale((s) => Math.max(Number((s - 0.15).toFixed(2)), 0.35));
							}}
							aria-label='Zoom out'
							className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors'
							title='Zoom Out'>
							<ZoomOut className='w-4 h-4' />
						</button>
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								setScale(fitScale);
							}}
							aria-label='Fit to view'
							className='p-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-700 font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none text-xs flex items-center gap-1 transition-colors'
							title='Fit to Window'>
							<RotateCcw className='w-3.5 h-3.5' />
							<span className='hidden sm:inline font-bold'>Fit</span>
						</button>
						<span
							aria-label={`Zoom level ${Math.round(scale * 100)} percent`}
							className='text-[11px] sm:text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-md min-w-[42px] text-center'>
							{Math.round(scale * 100)}%
						</span>
						<button
							ref={closeBtnRef}
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								onClose();
							}}
							aria-label='Close diagram view'
							className='p-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-lg text-slate-700 ml-1 sm:ml-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none transition-colors'
							title='Close'>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				{/* Scaled Diagram Viewport - zero scrollbars */}
				<div
					ref={containerRef}
					className='w-full overflow-hidden flex items-center justify-center p-3 sm:p-5 bg-slate-50/90 rounded-2xl min-h-[260px] sm:min-h-[340px] max-h-[64vh] relative border border-slate-100 select-none'
					style={{
						scrollbarWidth: 'none',
						msOverflowStyle: 'none',
					}}>
					<div
						ref={contentRef}
						className='flex items-center justify-center origin-center transition-transform duration-200 ease-out max-w-full'
						style={{
							transform: `scale(${scale})`,
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
					className='mt-4 sm:mt-5 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:outline-none transition-colors flex-shrink-0'>
					Done Looking ✨
				</button>
			</div>
		</div>
	);
});

export default ZoomModal;
