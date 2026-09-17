/**
 * Offline Quest Vault Service for AstroQuest.
 * Provides a high-fidelity, verified question bank across all 5 cognitive domains
 * for offline classroom play, road trips, or when internet/API keys are unavailable.
 */

export const OFFLINE_STORAGE_KEY = 'astroquest_cached_offline_pack_v1';

export const DEFAULT_OFFLINE_QUESTIONS = [
	// 1. Spatial Reasoning & Geometry
	{
		id: 'off-spat-1',
		category: 'Visual',
		domain: 'Spatial Reasoning',
		question:
			'Which shape appears if you rotate this arrow 90 degrees clockwise?',
		options: [
			{ id: 'A', text: 'Pointing Down ⬇️' },
			{ id: 'B', text: 'Pointing Right ➡️' },
			{ id: 'C', text: 'Pointing Left ⬅️' },
			{ id: 'D', text: 'Pointing Up ⬆️' },
		],
		correctAnswerId: 'B',
		hint: 'Imagine the hands of a clock moving from 12 toward 3.',
		solutionText:
			'Rotating an upward arrow 90° clockwise turns it directly toward the right.',
		diagramType: 'shape-rotation',
		diagramData: { angle: 90, direction: 'CW' },
	},
	{
		id: 'off-spat-2',
		category: 'Visual',
		domain: 'Spatial Reasoning',
		question:
			'How many small cubes are needed to build this 2-layer cube tower?',
		options: [
			{ id: 'A', text: '3 cubes' },
			{ id: 'B', text: '4 cubes' },
			{ id: 'C', text: '5 cubes' },
			{ id: 'D', text: '8 cubes' },
		],
		correctAnswerId: 'C',
		hint: 'Remember the bottom layer has 4 cubes, plus 1 on top.',
		solutionText:
			'The bottom 2x2 layer has 4 cubes, and the top layer has 1 cube. 4 + 1 = 5 cubes in total.',
		diagramType: 'block-tower',
		diagramData: {
			layers: [
				{ size: 2, count: 4 },
				{ size: 1, count: 1 },
			],
			totalCubes: 5,
		},
	},
	{
		id: 'off-spat-3',
		category: 'Visual',
		domain: 'Spatial Reasoning',
		question:
			'If you fold this flat net along the dotted lines, what 3D solid will it form?',
		options: [
			{ id: 'A', text: 'A Sphere ⚪' },
			{ id: 'B', text: 'A Cube 🧊' },
			{ id: 'C', text: 'A Cylinder 🥫' },
			{ id: 'D', text: 'A Cone 🍦' },
		],
		correctAnswerId: 'B',
		hint: 'It has 6 equal square faces that fold together.',
		solutionText:
			'Six identical square faces connected in a cross net fold up perfectly into a 3D cube.',
		diagramType: 'shape-sequence',
		diagramData: {
			sequence: ['Square', 'Square', 'Square', 'Square', 'Square', 'Square'],
		},
	},

	// 2. Mental Arithmetic & Logic
	{
		id: 'off-math-1',
		category: 'Analytical Thinking',
		domain: 'Mental Arithmetic & Logic',
		question:
			'Captain Leo found 7 space crystals. A meteor shower gave him 6 more. How many crystals does he have now?',
		options: [
			{ id: 'A', text: '11 crystals' },
			{ id: 'B', text: '12 crystals' },
			{ id: 'C', text: '13 crystals' },
			{ id: 'D', text: '14 crystals' },
		],
		correctAnswerId: 'C',
		hint: '7 plus 3 makes 10, then add the remaining 3!',
		solutionText: '7 + 6 = 13. Captain Leo has 13 glowing space crystals.',
		diagramType: 'sequence-ladder',
		diagramData: { steps: ['7', '+6'], nextVal: '13', rule: '+6' },
	},
	{
		id: 'off-math-2',
		category: 'Analytical Thinking',
		domain: 'Mental Arithmetic & Logic',
		question:
			'A rocket fuel tank has 20 liters. Each warp jump uses 4 liters. How many warp jumps can the rocket make?',
		options: [
			{ id: 'A', text: '4 jumps' },
			{ id: 'B', text: '5 jumps' },
			{ id: 'C', text: '6 jumps' },
			{ id: 'D', text: '10 jumps' },
		],
		correctAnswerId: 'B',
		hint: 'Count by 4s: 4, 8, 12, 16, 20!',
		solutionText: '20 divided by 4 equals 5 warp jumps.',
		diagramType: 'sequence-ladder',
		diagramData: {
			steps: ['20', '16', '12', '8', '4', '0'],
			nextVal: '5 jumps',
			rule: '-4',
		},
	},
	{
		id: 'off-math-3',
		category: 'Analytical Thinking',
		domain: 'Mental Arithmetic & Logic',
		question:
			'If 2 cosmic balance scales are even: 1 Star = 2 Moons. How many Moons balance 3 Stars?',
		options: [
			{ id: 'A', text: '4 Moons' },
			{ id: 'B', text: '5 Moons' },
			{ id: 'C', text: '6 Moons' },
			{ id: 'D', text: '8 Moons' },
		],
		correctAnswerId: 'C',
		hint: 'Each star is worth 2 moons. Double 3!',
		solutionText: 'Since 1 Star = 2 Moons, 3 Stars = 3 × 2 = 6 Moons.',
		diagramType: 'balance-scale',
		diagramData: {
			leftWeight: 6,
			rightWeight: 6,
			leftLabel: '3 Stars',
			rightLabel: '6 Moons',
		},
	},

	// 3. Pattern Recognition & Sequences
	{
		id: 'off-pat-1',
		category: 'Visual',
		domain: 'Pattern Recognition',
		question:
			'What shape comes next in this cosmic sequence: 🔴, 🟦, 🔺, 🔴, 🟦, ?',
		options: [
			{ id: 'A', text: '🔴 Red Circle' },
			{ id: 'B', text: '🟦 Blue Square' },
			{ id: 'C', text: '🔺 Red Triangle' },
			{ id: 'D', text: '⭐ Golden Star' },
		],
		correctAnswerId: 'C',
		hint: 'The pattern repeats every 3 shapes: Circle, Square, Triangle...',
		solutionText:
			'The repeating unit is Circle, Square, Triangle. After the second Blue Square comes the Red Triangle.',
		diagramType: 'pattern-shapes',
		diagramData: {
			sequence: [
				'Red Circle',
				'Blue Square',
				'Red Triangle',
				'Red Circle',
				'Blue Square',
			],
			nextItem: 'Red Triangle',
		},
	},
	{
		id: 'off-pat-2',
		category: 'Analytical Thinking',
		domain: 'Pattern Recognition',
		question:
			'Find the missing number in this countdown pattern: 3, 6, 9, 12, ?',
		options: [
			{ id: 'A', text: '13' },
			{ id: 'B', text: '14' },
			{ id: 'C', text: '15' },
			{ id: 'D', text: '18' },
		],
		correctAnswerId: 'C',
		hint: 'Notice that each step adds 3 to the previous number.',
		solutionText: 'The rule is +3 each step: 3, 6, 9, 12, 12 + 3 = 15.',
		diagramType: 'sequence-ladder',
		diagramData: { steps: ['3', '6', '9', '12'], nextVal: '15', rule: '+3' },
	},
	{
		id: 'off-pat-3',
		category: 'Visual',
		domain: 'Pattern Recognition',
		question:
			'Look at the sequence of clock times: 1:00, 2:00, 3:00. What time is next?',
		options: [
			{ id: 'A', text: '3:30' },
			{ id: 'B', text: '4:00' },
			{ id: 'C', text: '5:00' },
			{ id: 'D', text: '12:00' },
		],
		correctAnswerId: 'B',
		hint: 'The hour hand moves forward by 1 hour each step.',
		solutionText:
			'The clock advances by exactly 1 hour each step: after 3:00 comes 4:00.',
		diagramType: 'analog-clock',
		diagramData: { hour: 4, minute: 0 },
	},

	// 4. Verbal & Language Reasoning
	{
		id: 'off-verb-1',
		category: 'Analytical Thinking',
		domain: 'Language Reasoning',
		question: 'Astronaut is to Spaceship as Captain is to: ?',
		options: [
			{ id: 'A', text: 'Bicycle 🚲' },
			{ id: 'B', text: 'Submarine or Ship 🚢' },
			{ id: 'C', text: 'Skateboard 🛹' },
			{ id: 'D', text: 'Shoe 👟' },
		],
		correctAnswerId: 'B',
		hint: 'An astronaut commands a spaceship. What vessel does a sea captain command?',
		solutionText:
			'An astronaut steers a spaceship through the cosmos, just as a nautical captain commands a ship on the water.',
		diagramType: 'analogy-map',
		diagramData: {
			itemA: 'Astronaut',
			itemB: 'Spaceship',
			itemC: 'Captain',
			itemD: 'Ship',
		},
	},
	{
		id: 'off-verb-2',
		category: 'Analytical Thinking',
		domain: 'Language Reasoning',
		question: 'Which word is the odd one out: Mercury, Mars, Jupiter, Ocean?',
		options: [
			{ id: 'A', text: 'Mercury' },
			{ id: 'B', text: 'Mars' },
			{ id: 'C', text: 'Jupiter' },
			{ id: 'D', text: 'Ocean' },
		],
		correctAnswerId: 'D',
		hint: 'Three of these are planets orbiting the Sun.',
		solutionText:
			'Mercury, Mars, and Jupiter are planets in our Solar System. Ocean is a body of water on Earth.',
		diagramType: 'cause-effect',
		diagramData: {
			cause: 'Planetary Science',
			action: 'Classification',
			effect: 'Ocean is Not a Planet',
		},
	},

	// 5. Scientific Inquiry & Observational Thinking
	{
		id: 'off-sci-1',
		category: 'Visual',
		domain: 'Scientific Inquiry',
		question:
			'When a ray of white sunlight passes through a glass triangular prism, what happens?',
		options: [
			{ id: 'A', text: 'It disappears into darkness ⬛' },
			{ id: 'B', text: 'It splits into rainbow colors 🌈' },
			{ id: 'C', text: 'It turns into green slime 🧪' },
			{ id: 'D', text: 'It freezes into ice ❄️' },
		],
		correctAnswerId: 'B',
		hint: 'Think about what makes rainbows appear after rain!',
		solutionText:
			'White light is made of all colors. A glass prism refracts each wavelength at slightly different angles, revealing the rainbow spectrum.',
		diagramType: 'optics-prism',
		diagramData: {},
	},
	{
		id: 'off-sci-2',
		category: 'Analytical Thinking',
		domain: 'Scientific Inquiry',
		question:
			'Why do astronauts float gracefully inside the International Space Station?',
		options: [
			{ id: 'A', text: 'There is zero gravity everywhere in space' },
			{ id: 'B', text: 'They are in freefall orbit around the Earth 🌍' },
			{ id: 'C', text: 'Their spacesuits are filled with helium balloons 🎈' },
			{ id: 'D', text: 'Magnets repel them from the floor' },
		],
		correctAnswerId: 'B',
		hint: 'Both the station and the astronauts are falling together around the curve of Earth.',
		solutionText:
			'Astronauts experience microgravity because the ISS and everything inside are in continuous freefall orbit around Earth.',
		diagramType: 'cause-effect',
		diagramData: {
			cause: 'Orbital Speed',
			action: 'Continuous Freefall',
			effect: 'Weightlessness',
		},
	},
];

/**
 * Returns a randomized slice of verified offline questions
 */
export function getOfflineQuestQuestions(count = 10, selectedSkill = 'All') {
	const pool = [...DEFAULT_OFFLINE_QUESTIONS];
	// Shuffle pool
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, Math.min(count, pool.length));
}

/**
 * Checks if the browser currently has active internet connectivity
 */
export function isOnline() {
	return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
