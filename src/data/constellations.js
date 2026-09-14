/**
 * AstroQuest Constellation Registry & Daily Star Coordinate Engine
 * Real astronomical constellations with normalized SVG coordinates (0-100),
 * connecting star lines, kid-friendly celestial facts, and streak progress tracker.
 */

export const CONSTELLATIONS = [
	{
		id: 'orion',
		name: 'Orion the Hunter',
		latinName: 'Orion',
		season: 'Winter',
		color: '#38BDF8', // Cyan/Sky
		tagline: 'The mighty celestial giant with a shining belt of three stars.',
		story:
			'In ancient star lore, Orion was a legendary cosmic explorer who travels across the night sky alongside his faithful hunting dog, Canis Major. His three belt stars point directly to Sirius, the brightest star in the sky!',
		funFact:
			'The red star Betelgeuse in Orion’s shoulder is a supergiant star so immense that if placed at our Sun, it would engulf Earth and Mars!',
		lines: [
			['betelgeuse', 'bellatrix'],
			['betelgeuse', 'alnitak'],
			['bellatrix', 'mintaka'],
			['alnitak', 'alnilam'],
			['alnilam', 'mintaka'],
			['alnitak', 'saiph'],
			['mintaka', 'rigel'],
			['saiph', 'rigel'],
		],
		stars: [
			{
				id: 'betelgeuse',
				name: 'Betelgeuse',
				x: 32,
				y: 25,
				size: 6,
				color: '#F87171',
				type: 'Red Supergiant',
			},
			{
				id: 'bellatrix',
				name: 'Bellatrix',
				x: 68,
				y: 28,
				size: 5,
				color: '#93C5FD',
				type: 'Blue Giant',
			},
			{
				id: 'alnitak',
				name: 'Alnitak (Belt)',
				x: 42,
				y: 52,
				size: 4.5,
				color: '#E0F2FE',
				type: 'Belt Star 1',
			},
			{
				id: 'alnilam',
				name: 'Alnilam (Belt)',
				x: 50,
				y: 50,
				size: 5,
				color: '#E0F2FE',
				type: 'Belt Star 2',
			},
			{
				id: 'mintaka',
				name: 'Mintaka (Belt)',
				x: 58,
				y: 48,
				size: 4.5,
				color: '#E0F2FE',
				type: 'Belt Star 3',
			},
			{
				id: 'saiph',
				name: 'Saiph',
				x: 36,
				y: 78,
				size: 4.5,
				color: '#BAE6FD',
				type: 'Blue Supergiant',
			},
			{
				id: 'rigel',
				name: 'Rigel',
				x: 66,
				y: 76,
				size: 6.5,
				color: '#60A5FA',
				type: 'Brightest Star',
			},
		],
	},
	{
		id: 'ursa_major',
		name: 'Ursa Major (Big Dipper)',
		latinName: 'Ursa Major',
		season: 'Spring / All Year',
		color: '#FBBF24', // Amber/Gold
		tagline:
			'The Great Bear whose spoon-like stars guide sailors toward the North Star.',
		story:
			'The Big Dipper is an asterism inside the Great Bear constellation. For thousands of years, stargazers used its two pointer stars (Merak and Dubhe) to locate Polaris, the North Star, which never moves from its place in the northern sky!',
		funFact:
			'The middle star in the handle, Mizar, is actually a twin star system with companion Alcor! Ancient Roman soldiers used this as an eye-test.',
		lines: [
			['alkaid', 'mizar'],
			['mizar', 'alioth'],
			['alioth', 'megrez'],
			['megrez', 'phecda'],
			['phecda', 'merak'],
			['merak', 'dubhe'],
			['dubhe', 'megrez'],
		],
		stars: [
			{
				id: 'alkaid',
				name: 'Alkaid',
				x: 18,
				y: 68,
				size: 5,
				color: '#FDE68A',
				type: 'Handle Tip',
			},
			{
				id: 'mizar',
				name: 'Mizar',
				x: 32,
				y: 56,
				size: 4.8,
				color: '#FEF3C7',
				type: 'Double Star',
			},
			{
				id: 'alioth',
				name: 'Alioth',
				x: 44,
				y: 50,
				size: 5.2,
				color: '#FEF3C7',
				type: 'Brightest in Bear',
			},
			{
				id: 'megrez',
				name: 'Megrez',
				x: 58,
				y: 48,
				size: 4.2,
				color: '#FDE68A',
				type: 'Bowl Joiner',
			},
			{
				id: 'phecda',
				name: 'Phecda',
				x: 56,
				y: 68,
				size: 4.5,
				color: '#FDE68A',
				type: 'Bowl Bottom Left',
			},
			{
				id: 'merak',
				name: 'Merak',
				x: 76,
				y: 64,
				size: 5,
				color: '#FEF3C7',
				type: 'Pointer Star',
			},
			{
				id: 'dubhe',
				name: 'Dubhe',
				x: 78,
				y: 42,
				size: 5.5,
				color: '#F59E0B',
				type: 'North Pointer Star',
			},
		],
	},
	{
		id: 'cassiopeia',
		name: 'Cassiopeia the Queen',
		latinName: 'Cassiopeia',
		season: 'Autumn / All Year',
		color: '#F472B6', // Pink
		tagline:
			'The radiant celestial queen seated on a shimmering cosmic throne.',
		story:
			'Cassiopeia appears as a majestic celestial "W" or "M" in the sky directly opposite the Big Dipper. In mythology, she was a queen famous for her beauty, sailing through the stars upon a celestial throne.',
		funFact:
			'Because Cassiopeia circles close to the North Pole, observers in Europe, North America, and northern Asia can see her all 365 nights a year!',
		lines: [
			['caph', 'schedar'],
			['schedar', 'gamma_cas'],
			['gamma_cas', 'ruchbah'],
			['ruchbah', 'segin'],
		],
		stars: [
			{
				id: 'caph',
				name: 'Caph',
				x: 18,
				y: 55,
				size: 5,
				color: '#FBCFE8',
				type: 'Right Peak',
			},
			{
				id: 'schedar',
				name: 'Schedar',
				x: 35,
				y: 35,
				size: 5.5,
				color: '#F472B6',
				type: 'Orange Giant',
			},
			{
				id: 'gamma_cas',
				name: 'Navi (Gamma)',
				x: 52,
				y: 58,
				size: 5.8,
				color: '#FDE047',
				type: 'Variable Star',
			},
			{
				id: 'ruchbah',
				name: 'Ruchbah',
				x: 70,
				y: 38,
				size: 5,
				color: '#FBCFE8',
				type: 'White Star',
			},
			{
				id: 'segin',
				name: 'Segin',
				x: 84,
				y: 60,
				size: 4.5,
				color: '#DDD6FE',
				type: 'Blue Giant',
			},
		],
	},
	{
		id: 'cygnus',
		name: 'Cygnus the Swan',
		latinName: 'Cygnus',
		season: 'Summer',
		color: '#34D399', // Emerald
		tagline:
			'The celestial swan flying gracefully down the Milky Way star stream.',
		story:
			'Cygnus forms the famous "Northern Cross" flying south along the Milky Way river. Its brightest star, Deneb, is the tail of the swan and forms the famous Summer Triangle with Vega and Altair.',
		funFact:
			'Albireo, the star at the swan’s beak, looks like one star to the eye, but through a small telescope reveals itself as a stunning sapphire blue and golden topaz double!',
		lines: [
			['deneb', 'sadr'],
			['sadr', 'albireo'],
			['gienah', 'sadr'],
			['sadr', 'delta_cyg'],
		],
		stars: [
			{
				id: 'deneb',
				name: 'Deneb',
				x: 50,
				y: 18,
				size: 6.2,
				color: '#A7F3D0',
				type: 'Supergiant Swan Tail',
			},
			{
				id: 'sadr',
				name: 'Sadr',
				x: 50,
				y: 48,
				size: 5.4,
				color: '#6EE7B7',
				type: 'Swan Heart / Center',
			},
			{
				id: 'gienah',
				name: 'Gienah',
				x: 22,
				y: 44,
				size: 4.8,
				color: '#A7F3D0',
				type: 'Eastern Wing',
			},
			{
				id: 'delta_cyg',
				name: 'Fawaris (Delta)',
				x: 78,
				y: 50,
				size: 4.8,
				color: '#A7F3D0',
				type: 'Western Wing',
			},
			{
				id: 'albireo',
				name: 'Albireo',
				x: 50,
				y: 82,
				size: 5,
				color: '#FBBF24',
				type: 'Jewel Beak Double',
			},
		],
	},
	{
		id: 'pegasus',
		name: 'Pegasus the Winged Horse',
		latinName: 'Pegasus',
		season: 'Autumn',
		color: '#A78BFA', // Violet
		tagline:
			'The magnificent winged cosmic horse leaping across the starry night.',
		story:
			'Pegasus represents the mythic winged steed born from the clouds. The four brightest stars form the "Great Square of Pegasus", a giant celestial window into deep space.',
		funFact:
			'The star 51 Pegasi inside this constellation made history in 1995 when astronomers discovered the first ever exoplanet orbiting a Sun-like star outside our solar system!',
		lines: [
			['scheat', 'alpheratz'],
			['alpheratz', 'algenib'],
			['algenib', 'markab'],
			['markab', 'scheat'],
			['scheat', 'matar'],
			['markab', 'homam'],
			['homam', 'enif'],
		],
		stars: [
			{
				id: 'scheat',
				name: 'Scheat',
				x: 42,
				y: 30,
				size: 5.2,
				color: '#FDBA74',
				type: 'Red Giant',
			},
			{
				id: 'alpheratz',
				name: 'Alpheratz',
				x: 72,
				y: 30,
				size: 5.4,
				color: '#C4B5FD',
				type: 'Top Corner Star',
			},
			{
				id: 'markab',
				name: 'Markab',
				x: 40,
				y: 62,
				size: 5.2,
				color: '#DDD6FE',
				type: 'Saddle Star',
			},
			{
				id: 'algenib',
				name: 'Algenib',
				x: 70,
				y: 64,
				size: 4.8,
				color: '#C4B5FD',
				type: 'Lower Wing',
			},
			{
				id: 'matar',
				name: 'Matar',
				x: 24,
				y: 22,
				size: 4.2,
				color: '#E9D5FF',
				type: 'Front Leg',
			},
			{
				id: 'homam',
				name: 'Homam',
				x: 25,
				y: 72,
				size: 4.2,
				color: '#E9D5FF',
				type: 'Chest Star',
			},
			{
				id: 'enif',
				name: 'Enif (Muzzle)',
				x: 12,
				y: 84,
				size: 5.6,
				color: '#FDE047',
				type: 'Supergiant Muzzle',
			},
		],
	},
];

const STORAGE_KEY = 'astroquest_constellations';

/**
 * Loads constellation progress from localStorage
 */
export function getStoredConstellationProgress() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			return {
				unlockedStars: parsed.unlockedStars || { orion: 2 }, // default starting stars
				completedConstellations:
					Array.isArray(parsed.completedConstellations) ?
						parsed.completedConstellations
					:	[],
				lastStarDate: parsed.lastStarDate || null,
			};
		}
	} catch {}

	// Initial default with Orion having 2 unlocked stars so first-time users see progress immediately
	return {
		unlockedStars: { orion: 2, ursa_major: 1 },
		completedConstellations: [],
		lastStarDate: null,
	};
}

/**
 * Saves constellation progress
 */
export function saveConstellationProgress(progress) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
	} catch {}
}

/**
 * Awards a new star coordinate towards the current active constellation
 * @param {string} [targetConstellationId]
 * @returns {{ awarded: boolean, constellationId: string, starCount: number, isComplete: boolean }}
 */
export function awardStarCoordinate(targetConstellationId) {
	const progress = getStoredConstellationProgress();
	const constellationId =
		targetConstellationId ||
		CONSTELLATIONS.find((c) => !progress.completedConstellations.includes(c.id))
			?.id ||
		'orion';

	const constellation = CONSTELLATIONS.find((c) => c.id === constellationId);
	if (!constellation) return { awarded: false };

	const currentCount = progress.unlockedStars[constellationId] || 0;
	if (currentCount >= constellation.stars.length) {
		if (!progress.completedConstellations.includes(constellationId)) {
			progress.completedConstellations.push(constellationId);
			saveConstellationProgress(progress);
		}
		return {
			awarded: false,
			constellationId,
			starCount: currentCount,
			isComplete: true,
		};
	}

	const newCount = currentCount + 1;
	progress.unlockedStars[constellationId] = newCount;
	const isComplete = newCount >= constellation.stars.length;

	if (
		isComplete &&
		!progress.completedConstellations.includes(constellationId)
	) {
		progress.completedConstellations.push(constellationId);
	}

	progress.lastStarDate = new Date().toISOString().slice(0, 10);
	saveConstellationProgress(progress);

	return {
		awarded: true,
		constellationId,
		starCount: newCount,
		isComplete,
	};
}
