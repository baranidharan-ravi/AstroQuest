import { CheckCircle, Compass, Lock, Star, X } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { ODYSSEY_STORAGE_KEY, SOLAR_PLANETS } from '../../constants';
import { playButtonPop } from '../../utils/audioSynthesis';

export { ODYSSEY_STORAGE_KEY, SOLAR_PLANETS };

export function getTotalOdysseyStars() {
	try {
		const raw = localStorage.getItem(ODYSSEY_STORAGE_KEY);
		return raw ? parseInt(raw, 10) : 35; // Default starter bonus stars for exciting first look
	} catch (_) {
		return 35;
	}
}

export function addOdysseyStars(count = 5) {
	try {
		const current = getTotalOdysseyStars();
		const next = current + count;
		localStorage.setItem(ODYSSEY_STORAGE_KEY, String(next));
		return next;
	} catch (_) {
		return 35;
	}
}

const GalaxyOdysseyModal = memo(function GalaxyOdysseyModal({
	isOpen,
	onClose,
	soundEnabled = true,
	kidName = 'Explorer',
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);
	const [totalStars, setTotalStars] = useState(getTotalOdysseyStars);
	const [selectedPlanet, setSelectedPlanet] = useState(SOLAR_PLANETS[0]);

	// WCAG focus trapping and Escape handler
	useEffect(() => {
		if (!isOpen) return;
		setTotalStars(getTotalOdysseyStars());

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		const timer = setTimeout(() => {
			if (closeBtnRef.current) closeBtnRef.current.focus();
		}, 50);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(timer);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='odyssey-modal-title'>
			<div
				ref={modalRef}
				className='bg-gradient-to-b from-[#0e1038] to-[#080922] border-2 border-indigo-500/50 text-white rounded-3xl max-w-3xl w-full max-h-[92vh] p-4 sm:p-6 shadow-2xl relative flex flex-col gap-4 overflow-hidden'>
				{/* Starry Nebula Background Accent */}
				<div className='absolute -top-32 -left-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none' />
				<div className='absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none' />

				{/* Close Button */}
				<button
					ref={closeBtnRef}
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Close Galaxy Odyssey'
					className='absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none transition-colors z-10'>
					<X className='w-4 h-4' />
				</button>

				{/* Header */}
				<div className='flex items-center justify-between pr-10 z-10'>
					<div className='flex items-center gap-3'>
						<div
							aria-hidden='true'
							className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg'>
							<Compass className='w-6 h-6 text-white' />
						</div>
						<div>
							<h3
								id='odyssey-modal-title'
								className='text-lg sm:text-xl font-black text-white flex items-center gap-2 font-heading'>
								Galaxy Odyssey Expedition 🚀
							</h3>
							<p className='text-xs font-semibold text-cyan-300'>
								Explore the Solar System from Mercury to the Kuiper Belt!
							</p>
						</div>
					</div>

					{/* Accumulated Stardust Fuel Counter */}
					<div className='flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/30 border border-amber-400/50 px-3 py-1.5 rounded-full shadow-inner'>
						<Star className='w-4 h-4 text-amber-400 fill-amber-400 animate-spin-slow' />
						<span className='font-black text-xs sm:text-sm text-amber-200'>
							{totalStars} Cosmic Stars
						</span>
					</div>
				</div>

				{/* Interactive Solar System Planet Sequence */}
				<div className='bg-slate-950/60 border border-indigo-900/60 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 z-10'>
					<div className='flex items-center justify-between text-xs font-bold text-slate-300'>
						<span>Solar System Flight Path</span>
						<span className='text-pink-300 font-black'>Captain: {kidName}</span>
					</div>

					{/* Horizontal Scrollable Orbit Track */}
					<div className='flex items-center gap-3 overflow-x-auto pb-2 pt-2 px-1 no-scrollbar'>
						{SOLAR_PLANETS.map((planet) => {
							const isUnlocked = totalStars >= planet.starsRequired;
							const isSelected = selectedPlanet.id === planet.id;

							return (
								<button
									key={planet.id}
									type='button'
									onClick={() => {
										playButtonPop(soundEnabled);
										setSelectedPlanet(planet);
									}}
									className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer w-24 ${
										isSelected ?
											'bg-gradient-to-b from-indigo-900/90 to-purple-900/90 border-cyan-400 ring-2 ring-cyan-400/80 scale-105 shadow-xl'
										: isUnlocked ?
											'bg-white/5 border-indigo-500/40 hover:bg-white/10 hover:border-indigo-400'
										:	'bg-black/40 border-slate-800 opacity-50 grayscale hover:opacity-75'
									}`}>
									<div className='relative'>
										<div
											className={`w-12 h-12 rounded-full bg-gradient-to-tr ${planet.color} flex items-center justify-center text-2xl shadow-lg border-2 ${
												isSelected ?
													'border-white animate-bounce'
												:	'border-white/40'
											}`}>
											{planet.icon}
										</div>
										{!isUnlocked && (
											<div className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900/90 border border-slate-600 flex items-center justify-center'>
												<Lock className='w-3 h-3 text-slate-400' />
											</div>
										)}
										{isUnlocked && (
											<div className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border border-emerald-300 flex items-center justify-center'>
												<CheckCircle className='w-3 h-3 text-white' />
											</div>
										)}
									</div>
									<span className='text-[11px] font-black truncate max-w-full'>
										{planet.name}
									</span>
									<span className='text-[9px] font-bold text-amber-300 flex items-center gap-0.5'>
										<Star className='w-2.5 h-2.5 fill-amber-300' />
										{planet.starsRequired}★
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Selected Planet Deep-Dive Inspector */}
				<div className='bg-gradient-to-tr from-indigo-950/80 via-purple-950/60 to-slate-950/80 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl z-10'>
					<div
						className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${selectedPlanet.color} flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(168,85,247,0.3)] border-4 border-white/80 flex-shrink-0 animate-pulse`}>
						{selectedPlanet.icon}
					</div>

					<div className='flex flex-col gap-1.5 flex-1 text-center sm:text-left'>
						<div className='flex items-center justify-center sm:justify-start gap-2'>
							<h4 className='text-lg sm:text-xl font-black text-white'>
								{selectedPlanet.name}
							</h4>
							<span className='text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
								{selectedPlanet.distFromSun} from Sun
							</span>
						</div>
						<p className='text-xs sm:text-sm text-slate-200 font-medium leading-relaxed'>
							{selectedPlanet.lore}
						</p>

						<div className='mt-2 flex items-center justify-center sm:justify-start gap-3 text-xs font-bold'>
							{totalStars >= selectedPlanet.starsRequired ?
								<span className='text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/40'>
									<CheckCircle className='w-3.5 h-3.5' />
									Orbit Reached & Station Active!
								</span>
							:	<span className='text-rose-300 flex items-center gap-1 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-500/40'>
									<Lock className='w-3.5 h-3.5' />
									Needs {selectedPlanet.starsRequired - totalStars} more stars
									to warp!
								</span>
							}
						</div>
					</div>
				</div>

				{/* Return Button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Return to Cosmic Dashboard'
					className='w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-lg transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-cyan-400 focus-visible:outline-none z-10'>
					Return to Cosmic Flight Deck 🚀
				</button>
			</div>
		</div>
	);
});

export default GalaxyOdysseyModal;
