import {
	ChevronLeft,
	ChevronRight,
	Compass,
	Globe,
	Info,
	Moon,
	Sparkles,
	Thermometer,
	Volume2,
	X,
} from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { CELESTIAL_BODIES } from '../../constants';
import {
	playButtonPop,
	speakText,
	stopSpeaking,
} from '../../utils/audioSynthesis';
import { awardBadge, awardXP } from '../../utils/badgeManager';

export { CELESTIAL_BODIES };

const PocketPlanetariumModal = memo(function PocketPlanetariumModal({
	isOpen,
	onClose,
	soundEnabled = true,
}) {
	const [currentIndex, setCurrentIndex] = useState(3); // Start on Earth
	const [exploredBodies, setExploredBodies] = useState(
		() => new Set(['earth']),
	);
	const [isNarrating, setIsNarrating] = useState(false);

	const activeBody = CELESTIAL_BODIES[currentIndex];

	useEffect(() => {
		if (isOpen) {
			setExploredBodies((prev) => new Set([...prev, activeBody.id]));
		}
	}, [isOpen, activeBody.id]);

	// Award Solar Voyager badge if explored >= 6 celestial bodies
	useEffect(() => {
		if (exploredBodies.size >= 6) {
			awardBadge('solar_voyager');
			awardXP(25);
		}
	}, [exploredBodies.size]);

	// Clean up speech on close
	useEffect(() => {
		if (!isOpen) {
			stopSpeaking();
			setIsNarrating(false);
		}
	}, [isOpen]);

	// Keyboard controls
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				onClose();
			} else if (e.key === 'ArrowRight') {
				handleNext();
			} else if (e.key === 'ArrowLeft') {
				handlePrev();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, currentIndex]);

	if (!isOpen) return null;

	const handleSelectIndex = (idx) => {
		playButtonPop(soundEnabled);
		stopSpeaking();
		setIsNarrating(false);
		setCurrentIndex(idx);
		setExploredBodies((prev) => new Set([...prev, CELESTIAL_BODIES[idx].id]));
	};

	const handleNext = () => {
		const nextIdx = (currentIndex + 1) % CELESTIAL_BODIES.length;
		handleSelectIndex(nextIdx);
	};

	const handlePrev = () => {
		const prevIdx =
			(currentIndex - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length;
		handleSelectIndex(prevIdx);
	};

	const handleNarrate = () => {
		playButtonPop(soundEnabled);
		if (isNarrating) {
			stopSpeaking();
			setIsNarrating(false);
			return;
		}

		const narrationText = `${activeBody.name}. ${activeBody.tagline}. ${activeBody.fact}. Did you know? ${activeBody.kidTip}`;
		setIsNarrating(true);
		speakText(
			narrationText,
			() => setIsNarrating(true),
			() => setIsNarrating(false),
		);
	};

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='planetarium-title'
			className='fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none'>
			<div className='relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#090D16] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col overflow-hidden text-white'>
				{/* Top Bar Header */}
				<div className='flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-white/5 backdrop-blur-sm'>
					<div className='flex items-center gap-2.5'>
						<div className='w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner'>
							🪐
						</div>
						<div>
							<h2
								id='planetarium-title'
								className='text-base sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200'>
								Solar System Pocket Planetarium
							</h2>
							<p className='text-[11px] text-slate-300 font-semibold'>
								Interactive 3D Planetary Neighborhood • Explore & Discover
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<div className='hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-bold text-cyan-300'>
							<Sparkles className='w-3 h-3' />
							<span>{exploredBodies.size} / 10 Explored</span>
						</div>

						<button
							type='button'
							onClick={onClose}
							className='p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer'
							title='Close Planetarium'>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				{/* Planet Carousel Navigation Pills */}
				<div className='flex items-center gap-1.5 px-3 sm:px-6 py-2.5 bg-black/40 overflow-x-auto border-b border-white/5 scrollbar-thin'>
					{CELESTIAL_BODIES.map((body, idx) => {
						const isSelected = idx === currentIndex;
						const isVisited = exploredBodies.has(body.id);
						return (
							<button
								key={body.id}
								type='button'
								onClick={() => handleSelectIndex(idx)}
								className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
									isSelected ?
										'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_12px_rgba(34,211,238,0.5)] scale-105'
									: isVisited ? 'bg-white/10 text-slate-200 hover:bg-white/15'
									: 'bg-white/5 text-slate-400 hover:bg-white/10'
								}`}>
								<span>{body.name.split(' ')[0]}</span>
								{isVisited && !isSelected && (
									<span className='w-1.5 h-1.5 rounded-full bg-cyan-400' />
								)}
							</button>
						);
					})}
				</div>

				{/* Main Content Area: Visual Planet + Details Card */}
				<div className='flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center'>
					{/* Left: 3D Visual Sphere & Quick Orbit Info */}
					<div className='md:col-span-5 flex flex-col items-center justify-center relative'>
						{/* Background Star Orbit Ring */}
						<div className='w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-dashed border-cyan-500/20 absolute flex items-center justify-center animate-spin [animation-duration:40s]' />

						{/* 3D Planet Sphere */}
						<div
							className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br ${activeBody.color} shadow-2xl relative flex items-center justify-center transition-all duration-500 transform hover:scale-105`}
							style={{
								boxShadow: `0 0 40px ${activeBody.glowColor}, inset -15px -15px 35px rgba(0,0,0,0.6)`,
							}}>
							{/* Saturn / Uranus Special Planetary Ring */}
							{activeBody.id === 'saturn' && (
								<div
									className='absolute w-56 sm:w-68 h-16 sm:h-20 rounded-full border-4 sm:border-8 border-amber-200/50 -rotate-12 pointer-events-none'
									style={{
										boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
									}}
								/>
							)}
							{activeBody.id === 'uranus' && (
								<div className='absolute w-44 sm:w-56 h-12 sm:h-16 rounded-full border-2 sm:border-4 border-cyan-200/40 rotate-85 pointer-events-none' />
							)}
						</div>

						{/* Audio Narration Button */}
						<button
							type='button'
							onClick={handleNarrate}
							className={`mt-6 px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
								isNarrating ?
									'bg-purple-500 text-white animate-pulse ring-2 ring-purple-300'
								:	'bg-white/10 hover:bg-white/20 text-cyan-200 border border-cyan-500/30'
							}`}>
							<Volume2 className='w-4 h-4' />
							<span>
								{isNarrating ?
									'Pause Audio Guide'
								:	'Listen to Planetary Guide 🎧'}
							</span>
						</button>
					</div>

					{/* Right: Detailed Planet Information Dossier */}
					<div className='md:col-span-7 flex flex-col gap-4'>
						{/* Title & Tagline */}
						<div>
							<div className='flex items-center gap-2'>
								<span className='px-2.5 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-black uppercase text-indigo-300 tracking-wider'>
									{activeBody.type}
								</span>
								<span className='text-xs text-slate-400 font-semibold'>
									Planet #{currentIndex + 1} of 10
								</span>
							</div>
							<h3 className='text-2xl sm:text-3xl font-black text-white mt-1'>
								{activeBody.name}
							</h3>
							<p className='text-xs sm:text-sm text-cyan-200 font-medium italic mt-0.5'>
								"{activeBody.tagline}"
							</p>
						</div>

						{/* Key Astronomical Stats Matrix */}
						<div className='grid grid-cols-2 gap-2.5 bg-black/30 border border-white/10 rounded-2xl p-3 text-xs'>
							<div className='flex items-center gap-2'>
								<Globe className='w-4 h-4 text-cyan-400 flex-shrink-0' />
								<div>
									<div className='text-[10px] text-slate-400 uppercase font-bold'>
										Diameter
									</div>
									<div className='font-extrabold text-slate-200'>
										{activeBody.diameter}
									</div>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Compass className='w-4 h-4 text-amber-400 flex-shrink-0' />
								<div>
									<div className='text-[10px] text-slate-400 uppercase font-bold'>
										Distance
									</div>
									<div className='font-extrabold text-slate-200 truncate'>
										{activeBody.distanceFromSun}
									</div>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Thermometer className='w-4 h-4 text-rose-400 flex-shrink-0' />
								<div>
									<div className='text-[10px] text-slate-400 uppercase font-bold'>
										Temperature
									</div>
									<div className='font-extrabold text-slate-200'>
										{activeBody.surfaceTemp}
									</div>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Moon className='w-4 h-4 text-purple-400 flex-shrink-0' />
								<div>
									<div className='text-[10px] text-slate-400 uppercase font-bold'>
										Moons
									</div>
									<div className='font-extrabold text-slate-200'>
										{activeBody.moons}
									</div>
								</div>
							</div>
						</div>

						{/* Educational Cosmic Fact Box */}
						<div className='bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/30 rounded-2xl p-3.5'>
							<div className='flex items-center gap-1.5 text-cyan-300 font-extrabold text-xs mb-1'>
								<Sparkles className='w-3.5 h-3.5' />
								<span>Astronomer Factoid</span>
							</div>
							<p className='text-xs sm:text-sm text-slate-200 leading-relaxed font-medium'>
								{activeBody.fact}
							</p>
						</div>

						{/* Junior Explorer Tip */}
						<div className='bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5'>
							<Info className='w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5' />
							<p className='text-xs text-amber-200 leading-snug font-semibold'>
								{activeBody.kidTip}
							</p>
						</div>
					</div>
				</div>

				{/* Bottom Stepper Actions */}
				<div className='flex items-center justify-between px-4 sm:px-6 py-3 border-t border-white/10 bg-black/40'>
					<button
						type='button'
						onClick={handlePrev}
						className='px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer'>
						<ChevronLeft className='w-4 h-4' />
						<span>Previous World</span>
					</button>

					<div className='text-xs font-extrabold text-slate-300'>
						Use <kbd className='px-1 py-0.5 bg-white/10 rounded'>←</kbd>{' '}
						<kbd className='px-1 py-0.5 bg-white/10 rounded'>→</kbd> keys
					</div>

					<button
						type='button'
						onClick={handleNext}
						className='px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer'>
						<span>Next World</span>
						<ChevronRight className='w-4 h-4' />
					</button>
				</div>
			</div>
		</div>
	);
});

export default PocketPlanetariumModal;
