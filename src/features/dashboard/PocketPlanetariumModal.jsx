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
import {
	playButtonPop,
	speakText,
	stopSpeaking,
} from '../../utils/audioSynthesis';
import { awardBadge, awardXP } from '../../utils/badgeManager';

export const CELESTIAL_BODIES = [
	{
		id: 'sun',
		name: 'The Sun ☀️',
		tagline: 'The glowing nuclear heart of our cosmic family.',
		type: 'Yellow Dwarf Star',
		diameter: '1,392,700 km (109x Earth)',
		distanceFromSun: 'Center (0 AU)',
		surfaceTemp: '5,500°C (15M°C at core)',
		dayLength: '27 Earth Days',
		moons: '8 Planets & Billions of Asteroids',
		color: 'from-amber-400 via-orange-500 to-red-600',
		glowColor: 'rgba(245, 158, 11, 0.7)',
		fact: 'The Sun makes up 99.8% of all the mass in the entire Solar System! More than 1 million Earths could fit inside it.',
		kidTip:
			'Never look directly at the real Sun without special solar glasses!',
	},
	{
		id: 'mercury',
		name: 'Mercury ☿',
		tagline: 'The speedy swift planet closest to the Sun.',
		type: 'Terrestrial Planet',
		diameter: '4,879 km (0.38x Earth)',
		distanceFromSun: '57.9 Million km (0.39 AU)',
		surfaceTemp: '430°C by day, -180°C by night',
		dayLength: '59 Earth Days',
		moons: '0',
		color: 'from-slate-400 via-stone-500 to-zinc-600',
		glowColor: 'rgba(148, 163, 184, 0.6)',
		fact: 'Mercury zips around the Sun in just 88 days—the fastest of any planet! But it spins so slowly that one day-night cycle lasts 176 Earth days.',
		kidTip:
			'Because it has virtually no atmosphere to trap heat, nights on Mercury are freezing cold!',
	},
	{
		id: 'venus',
		name: 'Venus ♀',
		tagline: 'The glittering Morning Star and hottest world.',
		type: 'Terrestrial Planet',
		diameter: '12,104 km (0.95x Earth)',
		distanceFromSun: '108.2 Million km (0.72 AU)',
		surfaceTemp: '465°C (Hottest in Solar System)',
		dayLength: '243 Earth Days (Retrograde)',
		moons: '0',
		color: 'from-amber-200 via-yellow-500 to-amber-700',
		glowColor: 'rgba(245, 158, 11, 0.6)',
		fact: 'Venus is covered in thick clouds of sulfuric acid that trap heat like a giant greenhouse. It spins backward compared to most other planets!',
		kidTip:
			'Venus is the brightest natural object in our night sky after the Moon.',
	},
	{
		id: 'earth',
		name: 'Earth 🌍',
		tagline: 'Our vibrant blue ocean sanctuary and only known home for life.',
		type: 'Terrestrial Planet',
		diameter: '12,742 km (1.00x Earth)',
		distanceFromSun: '149.6 Million km (1.00 AU)',
		surfaceTemp: '15°C Average (-88°C to +58°C)',
		dayLength: '24 Hours',
		moons: '1 (The Moon)',
		color: 'from-blue-500 via-emerald-400 to-cyan-300',
		glowColor: 'rgba(56, 189, 248, 0.7)',
		fact: 'Earth is the only known world in the universe with liquid water on its surface and breathable oxygen atmosphere that supports billions of living creatures.',
		kidTip:
			'Earth’s atmosphere protects us from meteoroids and harmful solar radiation like a cosmic shield!',
	},
	{
		id: 'mars',
		name: 'Mars ♂',
		tagline:
			'The dusty Red Planet where robotic rovers search for ancient water.',
		type: 'Terrestrial Planet',
		diameter: '6,779 km (0.53x Earth)',
		distanceFromSun: '227.9 Million km (1.52 AU)',
		surfaceTemp: '-63°C Average',
		dayLength: '24 Hours 37 Minutes',
		moons: '2 (Phobos & Deimos)',
		color: 'from-rose-500 via-red-600 to-amber-700',
		glowColor: 'rgba(239, 68, 68, 0.6)',
		fact: 'Mars has the biggest volcano in the Solar System, Olympus Mons, which is three times taller than Mount Everest! Its red color comes from iron rust in the soil.',
		kidTip:
			'NASA and international rovers like Perseverance and Curiosity are actively exploring Mars right now!',
	},
	{
		id: 'jupiter',
		name: 'Jupiter ♃',
		tagline: 'The colossal gas giant king and guardian of the inner planets.',
		type: 'Gas Giant',
		diameter: '139,820 km (11.0x Earth)',
		distanceFromSun: '778.5 Million km (5.20 AU)',
		surfaceTemp: '-110°C Cloud Top',
		dayLength: '9 Hours 56 Minutes',
		moons: '95 Known Moons (Ganymede, Europa)',
		color: 'from-amber-200 via-orange-400 to-amber-800',
		glowColor: 'rgba(217, 119, 6, 0.7)',
		fact: 'Jupiter’s famous Great Red Spot is a monster hurricane storm larger than the entire Earth that has been raging for over 300 years!',
		kidTip:
			'Jupiter spins so fast that its day is less than 10 hours long—the fastest spinning planet!',
	},
	{
		id: 'saturn',
		name: 'Saturn ♄',
		tagline: 'The majestic ringed marvel of dazzling ice and rock.',
		type: 'Gas Giant',
		diameter: '116,460 km (9.1x Earth)',
		distanceFromSun: '1.43 Billion km (9.58 AU)',
		surfaceTemp: '-140°C Cloud Top',
		dayLength: '10 Hours 33 Minutes',
		moons: '146 Known Moons (Titan, Enceladus)',
		color: 'from-amber-100 via-yellow-300 to-amber-600',
		glowColor: 'rgba(252, 211, 77, 0.7)',
		fact: 'Saturn’s spectacular rings span up to 282,000 kilometers across, yet they are as thin as just 10 meters in some spots! Saturn is so light it could float in a giant bathtub of water.',
		kidTip:
			'Titan, Saturn’s biggest moon, has clouds, rain, and lakes of liquid methane!',
	},
	{
		id: 'uranus',
		name: 'Uranus ♅',
		tagline: 'The rolling cyan ice giant that spins completely on its side.',
		type: 'Ice Giant',
		diameter: '50,724 km (4.0x Earth)',
		distanceFromSun: '2.87 Billion km (19.2 AU)',
		surfaceTemp: '-195°C Average',
		dayLength: '17 Hours 14 Minutes',
		moons: '28 Known Moons (Titania, Oberon)',
		color: 'from-cyan-300 via-teal-400 to-sky-600',
		glowColor: 'rgba(34, 211, 238, 0.7)',
		fact: 'Uranus rolls around the Sun on its side like a bowling ball! It gets its brilliant turquoise blue hue from methane gas in its frigid upper atmosphere.',
		kidTip:
			'Uranus was the very first planet discovered using a telescope, found by William Herschel in 1781.',
	},
	{
		id: 'neptune',
		name: 'Neptune ♆',
		tagline: 'The supersonic deep-blue wind palace at the edge of the planets.',
		type: 'Ice Giant',
		diameter: '49,244 km (3.9x Earth)',
		distanceFromSun: '4.50 Billion km (30.1 AU)',
		surfaceTemp: '-200°C Average',
		dayLength: '16 Hours 6 Minutes',
		moons: '16 Known Moons (Triton)',
		color: 'from-blue-600 via-indigo-600 to-sky-400',
		glowColor: 'rgba(59, 130, 246, 0.7)',
		fact: 'Neptune whips up the fastest winds in the Solar System, clocking speeds over 2,000 km/h—faster than a supersonic jet!',
		kidTip:
			'It takes Neptune over 165 Earth years to complete just one single orbit around the Sun.',
	},
	{
		id: 'pluto',
		name: 'Pluto ♇',
		tagline: 'The heart-shaped frozen kingdom in the Kuiper Belt.',
		type: 'Dwarf Planet',
		diameter: '2,377 km (0.18x Earth)',
		distanceFromSun: '5.91 Billion km (39.5 AU)',
		surfaceTemp: '-230°C Average',
		dayLength: '153 Hours (6.4 Earth Days)',
		moons: '5 (Charon, Styx, Nix, Kerberos, Hydra)',
		color: 'from-stone-300 via-amber-200 to-rose-300',
		glowColor: 'rgba(214, 211, 209, 0.6)',
		fact: 'When NASA’s New Horizons spacecraft flew past Pluto in 2015, it revealed a gigantic bright heart-shaped glacier of nitrogen ice named Tombaugh Regio!',
		kidTip:
			'Pluto’s largest moon, Charon, is so big that Pluto and Charon actually orbit each other like a cosmic double-planet.',
	},
];

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
