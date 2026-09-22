/**
 * AstroQuest Centralized Constants
 * Consolidates configuration, default content, and storage keys used across components.
 */

// ==========================================
// Storage Keys
// ==========================================

export const SUGGESTED_SKILLSETS_STORAGE_KEY =
	'astroquest_suggested_skillsets_v1';
export const HIGH_SCORE_KEY = 'astroquest_timewarp_highscore';
export const ODYSSEY_STORAGE_KEY = 'astroquest_total_stars_collected_v1';

export const STORAGE_PET_KEY = 'astroquest_pet_type_v2';
export const STORAGE_MINIMIZED_KEY = 'astroquest_pet_minimized_v2';
export const STORAGE_POS_KEY = 'astroquest_pet_float_pos_v4';
export const STORAGE_TOOLBAR_POS_KEY = 'astroquest_pet_vertical_toolbar_pos_v6';
export const STORAGE_TOOLBAR_COLLAPSED_KEY =
	'astroquest_pet_toolbar_collapsed_v6';
export const STORAGE_SIZE_KEY = 'astroquest_pet_size_v1';

// ==========================================
// Dashboard: Emoji Picker & Planetarium
// ==========================================

export const POPULAR_EMOJIS = [
	'🚀',
	'🪐',
	'🧠',
	'👁️',
	'🔬',
	'📐',
	'🌿',
	'⭐',
	'🧩',
	'🎨',
	'📚',
	'⚡',
	'💡',
	'🐾',
	'🎯',
	'🔢',
	'🦖',
	'🤖',
	'🌍',
	'🧪',
];

export const SOLAR_PLANETS = [
	{
		id: 'mercury',
		name: 'Mercury',
		icon: '🪨',
		distFromSun: '58M km',
		color: 'from-amber-600 to-stone-500',
		starsRequired: 0,
		lore: 'The fastest orbit in the Solar System! Only 88 days around the Sun.',
	},
	{
		id: 'venus',
		name: 'Venus',
		icon: '🌋',
		distFromSun: '108M km',
		color: 'from-amber-500 to-orange-600',
		starsRequired: 5,
		lore: 'The hottest planet! Thick yellow clouds trap heat in a giant runaway greenhouse.',
	},
	{
		id: 'earth',
		name: 'Earth & Moon',
		icon: '🌍',
		distFromSun: '150M km',
		color: 'from-blue-500 to-emerald-500',
		starsRequired: 15,
		lore: 'Home base of AstroQuest! The only known world with liquid water oceans and life.',
	},
	{
		id: 'mars',
		name: 'Mars',
		icon: '🔴',
		distFromSun: '228M km',
		color: 'from-red-600 to-amber-700',
		starsRequired: 30,
		lore: 'The Red Planet, home to Olympus Mons: the largest volcano in the Solar System.',
	},
	{
		id: 'asteroid',
		name: 'Asteroid Belt',
		icon: '☄️',
		distFromSun: '400M km',
		color: 'from-slate-600 to-zinc-700',
		starsRequired: 50,
		lore: 'Millions of rocky cosmic fragments, including dwarf planet Ceres!',
	},
	{
		id: 'jupiter',
		name: 'Jupiter',
		icon: '🌀',
		distFromSun: '778M km',
		color: 'from-amber-700 to-orange-400',
		starsRequired: 75,
		lore: 'King of planets! A gas giant with a Great Red Spot storm larger than Earth.',
	},
	{
		id: 'saturn',
		name: 'Saturn',
		icon: '🪐',
		distFromSun: '1.4B km',
		color: 'from-yellow-600 to-amber-300',
		starsRequired: 105,
		lore: 'Adorned with thousands of shimmering ice rings orbiting in harmonic resonance.',
	},
	{
		id: 'uranus',
		name: 'Uranus',
		icon: '❄️',
		distFromSun: '2.9B km',
		color: 'from-cyan-500 to-teal-400',
		starsRequired: 140,
		lore: 'An ice giant rolling sideways like a bowling ball on a 98-degree axial tilt.',
	},
	{
		id: 'neptune',
		name: 'Neptune',
		icon: '💨',
		distFromSun: '4.5B km',
		color: 'from-blue-600 to-indigo-700',
		starsRequired: 180,
		lore: 'The windiest world with supersonic cosmic storms roaring at 2,000 km/h.',
	},
	{
		id: 'kuiper',
		name: 'Kuiper Belt & Pluto',
		icon: '💎',
		distFromSun: '6.0B km',
		color: 'from-purple-900 to-pink-600',
		starsRequired: 220,
		lore: 'The cosmic frontier of icy dwarf worlds and ancient wandering comets!',
	},
];

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

// ==========================================
// Quest: Prompts & Time-Warp Fallbacks
// ==========================================

export const QUICK_PROMPTS = [
	{ label: '💡 Secret Clue', text: 'Can you give me a secret clue?' },
	{ label: '🔍 Break it Down', text: 'Can we break down step 1 together?' },
	{
		label: '🤔 Why not another choice?',
		text: 'Why might someone get confused by this question?',
	},
	{
		label: '🚀 Explain simply',
		text: 'Can you explain this simply like a fun cosmic puzzle?',
	},
];

export const RAPID_FALLBACK_QUESTIONS = [
	{
		id: 'tw_1',
		question: 'What is 7 + 8?',
		options: [
			{ id: 'a', text: '14' },
			{ id: 'b', text: '15' },
			{ id: 'c', text: '16' },
			{ id: 'd', text: '17' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_2',
		question: 'Which planet is called the Red Planet?',
		options: [
			{ id: 'a', text: 'Venus' },
			{ id: 'b', text: 'Jupiter' },
			{ id: 'c', text: 'Mars' },
			{ id: 'd', text: 'Saturn' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 'tw_3',
		question: 'What comes next: 2, 4, 6, 8, __?',
		options: [
			{ id: 'a', text: '9' },
			{ id: 'b', text: '10' },
			{ id: 'c', text: '11' },
			{ id: 'd', text: '12' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_4',
		question: 'Which shape has exactly 3 sides and 3 corners?',
		options: [
			{ id: 'a', text: 'Square' },
			{ id: 'b', text: 'Triangle' },
			{ id: 'c', text: 'Circle' },
			{ id: 'd', text: 'Rectangle' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_5',
		question: 'What is 10 - 4?',
		options: [
			{ id: 'a', text: '5' },
			{ id: 'b', text: '6' },
			{ id: 'c', text: '7' },
			{ id: 'd', text: '8' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_6',
		question: 'Which is the largest planet in our solar system?',
		options: [
			{ id: 'a', text: 'Earth' },
			{ id: 'b', text: 'Neptune' },
			{ id: 'c', text: 'Jupiter' },
			{ id: 'd', text: 'Mars' },
		],
		correctAnswerId: 'c',
	},
	{
		id: 'tw_7',
		question: 'What is 5 × 4?',
		options: [
			{ id: 'a', text: '15' },
			{ id: 'b', text: '20' },
			{ id: 'c', text: '25' },
			{ id: 'd', text: '30' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_8',
		question: 'Which star is at the center of our solar system?',
		options: [
			{ id: 'a', text: 'Sirius' },
			{ id: 'b', text: 'The Sun' },
			{ id: 'c', text: 'Polaris' },
			{ id: 'd', text: 'Betelgeuse' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_9',
		question:
			'If you have 12 star candies and give 5 to an astronaut, how many are left?',
		options: [
			{ id: 'a', text: '6' },
			{ id: 'b', text: '7' },
			{ id: 'c', text: '8' },
			{ id: 'd', text: '9' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_10',
		question: 'What comes next in the pattern: 🔴, 🔵, 🔴, 🔵, __?',
		options: [
			{ id: 'a', text: '🔴 (Red)' },
			{ id: 'b', text: '🔵 (Blue)' },
			{ id: 'c', text: '🟢 (Green)' },
			{ id: 'd', text: '🟡 (Yellow)' },
		],
		correctAnswerId: 'a',
	},
	{
		id: 'tw_11',
		question: 'What is 9 + 6?',
		options: [
			{ id: 'a', text: '14' },
			{ id: 'b', text: '15' },
			{ id: 'c', text: '16' },
			{ id: 'd', text: '17' },
		],
		correctAnswerId: 'b',
	},
	{
		id: 'tw_12',
		question: 'How many sides does a pentagon have?',
		options: [
			{ id: 'a', text: '4' },
			{ id: 'b', text: '5' },
			{ id: 'c', text: '6' },
			{ id: 'd', text: '8' },
		],
		correctAnswerId: 'b',
	},
];

// ==========================================
// Companion: Pet Profiles & Sizing
// ==========================================

export const PET_PROFILES = {
	robot: {
		id: 'robot',
		name: 'Beep the Bot',
		species: '3D Cyber Companion',
		emoji: '🤖',
		badge: 'Logic Helper',
		treatName: 'Energy Spark Battery',
		treatEmoji: '⚡',
		imageSrc: '/assets/pets/robot-3d.png',
		themeColor: 'from-cyan-400 via-sky-400 to-blue-500',
		borderColor: 'border-cyan-300',
		glowColor: 'rgba(34, 211, 238, 0.65)',
	},
	cat: {
		id: 'cat',
		name: 'Luna the Cat',
		species: '3D Astronaut Kitten',
		emoji: '🐱',
		badge: 'Star Navigator',
		treatName: 'Tasty Tuna Snack',
		treatEmoji: '🐟',
		imageSrc: '/assets/pets/cat-3d.png',
		themeColor: 'from-amber-400 via-orange-400 to-pink-500',
		borderColor: 'border-amber-300',
		glowColor: 'rgba(251, 146, 60, 0.65)',
	},
	dog: {
		id: 'dog',
		name: 'Rocket the Pup',
		species: '3D Space Scout Pup',
		emoji: '🐶',
		badge: 'Loyal Scout',
		treatName: 'Crunchy Kibble',
		treatEmoji: '🍖',
		imageSrc: '/assets/pets/dog-3d.png',
		themeColor: 'from-amber-400 via-orange-400 to-amber-500',
		borderColor: 'border-amber-300',
		glowColor: 'rgba(251, 191, 36, 0.65)',
	},
	alien: {
		id: 'alien',
		name: 'Zog the Buddy',
		species: '3D Cosmic Alien Pal',
		emoji: '🛸',
		badge: 'Friendly Pal',
		treatName: 'Sweet Cosmic Gummy',
		treatEmoji: '🍇',
		imageSrc: '/assets/pets/alien-3d.png',
		themeColor: 'from-emerald-400 via-teal-400 to-cyan-500',
		borderColor: 'border-emerald-300',
		glowColor: 'rgba(52, 211, 153, 0.65)',
	},
};

export const PET_SIZES = {
	small: {
		id: 'small',
		label: 'Small',
		px: 104,
		badge: 'Compact',
		iconText: 'S',
	},
	medium: {
		id: 'medium',
		label: 'Medium',
		px: 148,
		badge: 'Standard',
		iconText: 'M',
	},
	large: { id: 'large', label: 'Large', px: 192, badge: 'Hero', iconText: 'L' },
};

// ==========================================
// Cosmic Themes & Visual Loader
// ==========================================

export const PLANET_COLOR_CONFIGS = {
	cyan: {
		planetGradient: 'from-[#38BDF8] via-[#0284C7] to-[#082F49]',
		surfaceLight: 'bg-cyan-300/30',
		ringBorder: 'border-cyan-300/70',
		ringGradient:
			'linear-gradient(90deg, rgba(56,189,248,0.15) 0%, rgba(125,211,252,0.6) 50%, rgba(2,132,199,0.15) 100%)',
		glowColor: 'rgba(34, 211, 238, 0.65)',
		atmosphereGlow: 'shadow-[0_0_35px_rgba(34,211,238,0.5)]',
		badgeBg: 'bg-cyan-950/70 border-cyan-400/40 text-cyan-300',
		beaconColor: 'bg-cyan-400',
		accentText: 'text-cyan-300',
		pathColor: '#22D3EE',
	},
	purple: {
		planetGradient: 'from-[#C084FC] via-[#7C3AED] to-[#2E1065]',
		surfaceLight: 'bg-purple-300/30',
		ringBorder: 'border-purple-300/70',
		ringGradient:
			'linear-gradient(90deg, rgba(192,132,252,0.15) 0%, rgba(216,180,254,0.6) 50%, rgba(124,58,237,0.15) 100%)',
		glowColor: 'rgba(192, 132, 252, 0.65)',
		atmosphereGlow: 'shadow-[0_0_35px_rgba(192,132,252,0.5)]',
		badgeBg: 'bg-purple-950/70 border-purple-400/40 text-purple-300',
		beaconColor: 'bg-purple-400',
		accentText: 'text-purple-300',
		pathColor: '#C084FC',
	},
	emerald: {
		planetGradient: 'from-[#34D399] via-[#059669] to-[#022C22]',
		surfaceLight: 'bg-emerald-300/30',
		ringBorder: 'border-emerald-300/70',
		ringGradient:
			'linear-gradient(90deg, rgba(52,211,153,0.15) 0%, rgba(110,231,183,0.6) 50%, rgba(5,150,105,0.15) 100%)',
		glowColor: 'rgba(52, 211, 153, 0.65)',
		atmosphereGlow: 'shadow-[0_0_35px_rgba(52,211,153,0.5)]',
		badgeBg: 'bg-emerald-950/70 border-emerald-400/40 text-emerald-300',
		beaconColor: 'bg-emerald-400',
		accentText: 'text-emerald-300',
		pathColor: '#34D399',
	},
	amber: {
		planetGradient: 'from-[#FBBF24] via-[#D97706] to-[#451A03]',
		surfaceLight: 'bg-amber-300/30',
		ringBorder: 'border-amber-300/70',
		ringGradient:
			'linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(252,211,77,0.6) 50%, rgba(217,119,6,0.15) 100%)',
		glowColor: 'rgba(251, 191, 36, 0.65)',
		atmosphereGlow: 'shadow-[0_0_35px_rgba(251,191,36,0.5)]',
		badgeBg: 'bg-amber-950/70 border-amber-400/40 text-amber-300',
		beaconColor: 'bg-amber-400',
		accentText: 'text-amber-300',
		pathColor: '#FBBF24',
	},
	blue: {
		planetGradient: 'from-[#60A5FA] via-[#2563EB] to-[#172554]',
		surfaceLight: 'bg-blue-300/30',
		ringBorder: 'border-blue-300/70',
		ringGradient:
			'linear-gradient(90deg, rgba(96,165,250,0.15) 0%, rgba(147,197,253,0.6) 50%, rgba(37,99,235,0.15) 100%)',
		glowColor: 'rgba(96, 165, 250, 0.65)',
		atmosphereGlow: 'shadow-[0_0_35px_rgba(96,165,250,0.5)]',
		badgeBg: 'bg-blue-950/70 border-blue-400/40 text-blue-300',
		beaconColor: 'bg-blue-400',
		accentText: 'text-blue-300',
		pathColor: '#60A5FA',
	},
	rose: {
		planetGradient: 'from-[#FB7185] via-[#E11D48] to-[#4C0519]',
		surfaceLight: 'bg-rose-300/30',
		ringBorder: 'border-rose-300/70',
		ringGradient:
			'linear-gradient(90deg, rgba(251,113,133,0.15) 0%, rgba(252,164,175,0.6) 50%, rgba(225,29,72,0.15) 100%)',
		glowColor: 'rgba(251, 113, 133, 0.65)',
		atmosphereGlow: 'shadow-[0_0_35px_rgba(251,113,133,0.5)]',
		badgeBg: 'bg-rose-950/70 border-rose-400/40 text-rose-300',
		beaconColor: 'bg-rose-400',
		accentText: 'text-rose-300',
		pathColor: '#FB7185',
	},
};
