import {
	Eraser,
	Eye,
	EyeOff,
	Paintbrush,
	Trash2,
	Undo2,
	X,
} from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';

const PALETTE_COLORS = [
	{ id: 'cyan', hex: '#06b6d4', label: 'Laser Cyan' },
	{ id: 'yellow', hex: '#facc15', label: 'Star Gold' },
	{ id: 'pink', hex: '#ec4899', label: 'Nebula Pink' },
	{ id: 'emerald', hex: '#10b981', label: 'Aurora Green' },
	{ id: 'white', hex: '#ffffff', label: 'Cosmic White' },
];

const STROKE_SIZES = [
	{ id: 'fine', size: 3, label: 'Fine' },
	{ id: 'medium', size: 6, label: 'Medium' },
	{ id: 'bold', size: 12, label: 'Bold' },
];

/**
 * QuestScratchpad — Interactive cosmic doodle and working canvas for young explorers.
 * Allows learners to sketch calculations, circle diagram elements, and jot notes during quests.
 */
export const QuestScratchpad = memo(function QuestScratchpad({
	isOpen,
	onClose,
	soundEnabled = true,
}) {
	const canvasRef = useRef(null);
	const containerRef = useRef(null);
	const isDrawingRef = useRef(false);
	const historyRef = useRef([]);

	const [activeColor, setActiveColor] = useState(PALETTE_COLORS[0].hex);
	const [activeSize, setActiveSize] = useState(STROKE_SIZES[1].size);
	const [isEraser, setIsEraser] = useState(false);
	const [isTranslucent, setIsTranslucent] = useState(false);
	const [hasStrokes, setHasStrokes] = useState(false);

	// Setup and resize canvas with High-DPI support
	useEffect(() => {
		if (!isOpen) return;

		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const resizeCanvas = () => {
			const rect = container.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;

			// Save existing image content before resizing
			const ctx = canvas.getContext('2d');
			let prevImage = null;
			if (canvas.width > 0 && canvas.height > 0) {
				try {
					prevImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
				} catch {
					// Ignore if canvas was empty
				}
			}

			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;

			ctx.scale(dpr, dpr);
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			if (prevImage) {
				ctx.putImageData(prevImage, 0, 0);
			}
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		return () => window.removeEventListener('resize', resizeCanvas);
	}, [isOpen]);

	// Save stroke history state
	const saveHistoryState = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		try {
			const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
			historyRef.current.push(data);
			if (historyRef.current.length > 20) {
				historyRef.current.shift();
			}
			setHasStrokes(true);
		} catch {
			// ignore
		}
	};

	// Pointer drawing handlers
	const handlePointerDown = (e) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.setPointerCapture(e.pointerId);
		isDrawingRef.current = true;

		// Save current state before beginning new stroke
		saveHistoryState();

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(x, y);

		if (isEraser) {
			ctx.globalCompositeOperation = 'destination-out';
			ctx.lineWidth = activeSize * 2.5;
		} else {
			ctx.globalCompositeOperation = 'source-over';
			ctx.strokeStyle = activeColor;
			ctx.lineWidth = activeSize;
		}

		ctx.lineTo(x + 0.1, y + 0.1);
		ctx.stroke();
	};

	const handlePointerMove = (e) => {
		if (!isDrawingRef.current) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const ctx = canvas.getContext('2d');
		ctx.lineTo(x, y);
		ctx.stroke();
	};

	const handlePointerUp = (e) => {
		if (!isDrawingRef.current) return;
		isDrawingRef.current = false;
		const canvas = canvasRef.current;
		if (canvas && e.pointerId) {
			try {
				canvas.releasePointerCapture(e.pointerId);
			} catch {
				// ignore
			}
		}
	};

	const handleUndo = () => {
		playButtonPop(soundEnabled);
		const canvas = canvasRef.current;
		if (!canvas || historyRef.current.length === 0) return;

		const lastState = historyRef.current.pop();
		const ctx = canvas.getContext('2d');
		ctx.putImageData(lastState, 0, 0);

		if (historyRef.current.length === 0) {
			setHasStrokes(false);
		}
	};

	const handleClear = () => {
		playButtonPop(soundEnabled);
		const canvas = canvasRef.current;
		if (!canvas) return;
		saveHistoryState();
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		setHasStrokes(false);
	};

	if (!isOpen) return null;

	return (
		<div
			className='absolute inset-0 z-30 flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl'
			style={{
				backgroundColor:
					isTranslucent ? 'rgba(10, 15, 45, 0.82)' : 'rgba(10, 15, 45, 0.97)',
				backdropFilter: 'blur(8px)',
			}}>
			{/* Top Toolbar */}
			<div className='flex items-center justify-between gap-2 px-3 py-2 bg-[#06081E]/95 border-b border-cyan-500/30 text-white shrink-0 select-none'>
				<div className='flex items-center gap-1.5'>
					<span className='w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300'>
						<Paintbrush className='w-3.5 h-3.5' />
					</span>
					<span className='font-black text-xs sm:text-sm tracking-wide text-cyan-200'>
						Cosmic Scratchpad
					</span>
					<span className='hidden sm:inline-block text-[10px] text-slate-400 font-semibold ml-1'>
						(Doodle & Calculate)
					</span>
				</div>

				{/* Controls */}
				<div className='flex items-center gap-1.5'>
					{/* Translucency Toggle */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setIsTranslucent((v) => !v);
						}}
						title={
							isTranslucent ? 'Make canvas solid' : (
								'See question through canvas'
							)
						}
						className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
							isTranslucent ?
								'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50'
							:	'bg-white/10 hover:bg-white/20 text-slate-300'
						}`}>
						{isTranslucent ?
							<>
								<Eye className='w-3.5 h-3.5' />
								<span className='text-[10px]'>Glass</span>
							</>
						:	<>
								<EyeOff className='w-3.5 h-3.5' />
								<span className='text-[10px]'>Solid</span>
							</>
						}
					</button>

					{/* Undo Button */}
					<button
						type='button'
						disabled={!hasStrokes}
						onClick={handleUndo}
						title='Undo last stroke'
						className='p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer'>
						<Undo2 className='w-3.5 h-3.5' />
					</button>

					{/* Clear Button */}
					<button
						type='button'
						disabled={!hasStrokes}
						onClick={handleClear}
						title='Clear scratchpad'
						className='p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-rose-200 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer'>
						<Trash2 className='w-3.5 h-3.5' />
					</button>

					{/* Close Button */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onClose();
						}}
						aria-label='Close scratchpad'
						className='p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white transition-all cursor-pointer ml-1'>
						<X className='w-4 h-4' />
					</button>
				</div>
			</div>

			{/* Canvas Area */}
			<div
				ref={containerRef}
				className='flex-1 relative touch-none cursor-crosshair overflow-hidden'>
				<canvas
					ref={canvasRef}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerUp}
					className='w-full h-full block'
				/>

				{!hasStrokes && (
					<div className='absolute inset-0 flex items-center justify-center pointer-events-none select-none'>
						<p className='text-xs sm:text-sm font-semibold text-slate-400/50 text-center px-4'>
							✍️ Sketch your steps, numbers, or drawings here!
						</p>
					</div>
				)}
			</div>

			{/* Bottom Tooldock: Colors & Stroke Sizes */}
			<div className='flex items-center justify-between gap-2 px-3 py-2 bg-[#06081E]/95 border-t border-cyan-500/20 text-white shrink-0 select-none'>
				{/* Colors */}
				<div className='flex items-center gap-1.5'>
					{PALETTE_COLORS.map((c) => {
						const isSelected = !isEraser && activeColor === c.hex;
						return (
							<button
								key={c.id}
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setIsEraser(false);
									setActiveColor(c.hex);
								}}
								title={c.label}
								className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
									isSelected ?
										'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#06081E]'
									:	'opacity-80 hover:opacity-100 hover:scale-110'
								}`}
								style={{ backgroundColor: c.hex }}
							/>
						);
					})}

					{/* Eraser Toggle */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setIsEraser((v) => !v);
						}}
						title='Eraser tool'
						className={`p-1 rounded-lg transition-all cursor-pointer ml-1 ${
							isEraser ?
								'bg-amber-400 text-slate-900 shadow-md scale-110'
							:	'bg-white/10 hover:bg-white/20 text-slate-300'
						}`}>
						<Eraser className='w-4 h-4' />
					</button>
				</div>

				{/* Stroke Width Selector */}
				<div className='flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10'>
					{STROKE_SIZES.map((s) => {
						const isSelected = activeSize === s.size;
						return (
							<button
								key={s.id}
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setActiveSize(s.size);
								}}
								title={`${s.label} stroke`}
								className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
									isSelected ?
										'bg-cyan-500 text-slate-950 font-black shadow-xs'
									:	'text-slate-400 hover:text-white'
								}`}>
								{s.label}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
});

export default QuestScratchpad;
