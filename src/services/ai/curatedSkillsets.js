import {
	AI_PROVIDERS,
	callClaudeApi,
	callGeminiApi,
	callOpenAiApi,
	decryptApiKey,
	getActiveAiProvider,
	getStoredApiKey,
} from './aiConfig';

export const CURATED_RANDOM_SKILLSETS = [
	{
		name: 'Deep Sea Ocean Mysteries',
		tagline: 'Glow-in-the-Dark Sea Creatures & Trenches',
		description:
			'Dive deep into the twilight and abyssal ocean zones! Discover bioluminescent lanternfish, giant squids, underwater hydrothermal vents, and the adaptations creatures need to survive extreme water pressure.',
		icon: '🐙',
		color: 'cyan',
	},
	{
		name: 'Kitchen Chemistry Lab',
		tagline: 'Fizzy Reactions & Edible Science Experiments',
		description:
			'Explore bubbling acids and bases, molecular gastronomy, crystal candy formations, and baking soda volcanoes. Uncover the secret molecular science behind cooking and everyday household discoveries.',
		icon: '🧪',
		color: 'emerald',
	},
	{
		name: 'Secret Spy Ciphers',
		tagline: 'Code Breaking, Cryptography & Secret Notes',
		description:
			'Become a master cryptographer! Solve Caesar ciphers, pigpen secret alphabets, frequency patterns, and mirror messages. Practice deductive logic and pattern discovery to crack top-secret hidden codes.',
		icon: '🕵️',
		color: 'purple',
	},
	{
		name: 'Dinosaur Fossil Hunters',
		tagline: 'Prehistoric Giants, Excavation & Bones',
		description:
			'Travel back through the Triassic, Jurassic, and Cretaceous periods. Identify carnivores vs herbivores by tooth shapes, piece together fossilized footprints, and explore how paleontologists reconstruct ancient Earth.',
		icon: '🦖',
		color: 'amber',
	},
	{
		name: 'Robotic Rovers & AI',
		tagline: 'Sensors, Motors & Martian Explorers',
		description:
			'Build futuristic rovers designed to navigate alien terrains! Learn how ultrasonic obstacle sensors, robotic gripper arms, solar panels, and smart algorithms help rovers explore distant planets autonomously.',
		icon: '🤖',
		color: 'blue',
	},
	{
		name: 'Optical Illusions & Light',
		tagline: 'Prisms, Rainbows & Brain-Bending Tricks',
		description:
			'Investigate how light bends through water droplets, creates shimmering mirages, and tricks the visual cortex. Experiment with color reflection, shadows, kaleidoscope mirrors, and anamorphic art.',
		icon: '🌈',
		color: 'purple',
	},
	{
		name: 'Wild Weather & Storms',
		tagline: 'Tornadoes, Lightning & Cloud Spotting',
		description:
			'Track massive atmospheric storms, hurricane eyes, and lightning discharges. Decode barometric pressure, learn the water cycle stages, and classify cumulus, cirrus, and cumulonimbus clouds like a meteorologist.',
		icon: '🌪️',
		color: 'cyan',
	},
	{
		name: 'Origami Geometry Quests',
		tagline: 'Paper Folding, Angles & 3D Polyhedrons',
		description:
			'Discover the hidden mathematics inside origami! Explore lines of symmetry, interior angles, tessellations, and how Japanese paper folding inspired deployable solar panels on space satellites.',
		icon: '📐',
		color: 'rose',
	},
	{
		name: 'Rainforest Canopy Rangers',
		tagline: 'Tree Frogs, Toucans & Emerald Vines',
		description:
			'Climb through the four layers of the tropical rainforest: forest floor, understory, canopy, and emergent layer. Study biodiversity, symbiotic animal partnerships, and the vital role trees play in producing oxygen.',
		icon: '🐒',
		color: 'emerald',
	},
	{
		name: 'Ancient Egyptian Engineers',
		tagline: 'Pyramids, Levers & River Nile Inventions',
		description:
			'Uncover the architectural genius of ancient civilizations! Learn how ramps, counterweights, papyrus scrolls, and astronomical alignments helped build magnificent stone monuments along the Nile river.',
		icon: '🏛️',
		color: 'amber',
	},
	{
		name: 'Aviation & Flight Physics',
		tagline: 'Lift, Thrust, Drag & Supersonic Wings',
		description:
			'Examine how birds, gliders, helicopters, and supersonic jets conquer the skies. Learn Bernoulli’s aerodynamic principle, wing camber, jet propulsion, and rudder navigation.',
		icon: '🦅',
		color: 'blue',
	},
	{
		name: 'Microscopic Cell Explorers',
		tagline: 'Bacteria, Mitochondria & Tiny Worlds',
		description:
			'Zoom in a thousand times beneath the microscope! Inspect plant chloroplasts, cell walls, friendly probiotic bacteria, and the microscopic organisms living inside a single drop of pond water.',
		icon: '🔬',
		color: 'emerald',
	},
	{
		name: 'Volcanic Wonders & Lava',
		tagline: 'Magma Chambers, Pumice & Ash Clouds',
		description:
			'Journey into the Earth’s mantle! Learn the difference between explosive composite volcanoes and gentle shield volcanoes, inspect cooling obsidian glass, and map the Pacific Ring of Fire.',
		icon: '🌋',
		color: 'rose',
	},
	{
		name: 'Sound Waves & Acoustics',
		tagline: 'Vibrations, Echoes & Musical Pitch',
		description:
			'Unravel how sound travels through air, water, and solid rock. Explore frequency, decibels, bat echolocation, and how violin strings and organ pipes vibrate to create harmonious music.',
		icon: '🎵',
		color: 'purple',
	},
	{
		name: 'Mars Colony Pioneers',
		tagline: 'Habitats, Red Soil & Oxygen Gardens',
		description:
			'Design a self-sustaining human outpost on Mars! Tackle real-world engineering challenges like recycling water, growing hydroponic potatoes, generating breathable oxygen, and shielding against cosmic radiation.',
		icon: '🪐',
		color: 'amber',
	},
	{
		name: 'Arctic Ice & Polar Wildlife',
		tagline: 'Glaciers, Narwhals & Snow Camouflage',
		description:
			'Trek across frozen tundras and polar ice shelves. Investigate blubber insulation, how polar bears track prey, narwhal tusk mysteries, and how reflective sea ice regulates Earth’s climate temperature.',
		icon: '🐻‍❄️',
		color: 'cyan',
	},
	{
		name: 'Supernovas & Cosmic Time',
		tagline: 'Stellar Collapses, Pulsars & Nebulas',
		description:
			'Witness the life cycles of stars from glowing stellar nurseries to cataclysmic supernova explosions! Study how heavy elements like iron and gold are forged inside stellar cores and scattered into space.',
		icon: '✨',
		color: 'purple',
	},
	{
		name: 'Electric Sparks & Circuits',
		tagline: 'Batteries, Switches & Conductive Playdough',
		description:
			'Harness the flow of electrons! Wire series and parallel circuits, discover conductors vs insulators, test lemon batteries, and experiment with electromagnetic coils and motors.',
		icon: '⚡',
		color: 'amber',
	},
	{
		name: 'Coral Reef Guardians',
		tagline: 'Anemones, Clownfish & Marine Nurseries',
		description:
			'Snorkel through vibrant underwater cities! Understand how coral polyps build calcium carbonate structures, observe symbiotic relationships between clownfish and anemones, and learn how to protect reef habitats.',
		icon: '🐠',
		color: 'cyan',
	},
	{
		name: 'Renewable Energy Heroes',
		tagline: 'Wind Turbines, Solar Panels & Hydro Power',
		description:
			'Power tomorrow’s green cities! Explore how giant wind turbine blades turn kinetic wind into electrical current, how photovoltaic solar cells catch sunlight, and how dams harness cascading water power.',
		icon: '🌱',
		color: 'emerald',
	},
	{
		name: 'The Human Brain & Memory',
		tagline: 'Neurons, Synapses & Logic Riddles',
		description:
			'Explore the amazing supercomputer inside your head! Learn how 86 billion neurons communicate with electrical pulses, how the brain creates memories during sleep, and test your brain with reflex and reaction puzzles.',
		icon: '🧠',
		color: 'rose',
	},
	{
		name: 'Constellation Stargazers',
		tagline: 'Mythology, Navigation & Night Skies',
		description:
			'Chart the nocturnal sky! Locate the North Star Polaris, trace Orion’s belt and the Big Dipper, and understand how ancient sea navigators crossed entire oceans using only star positions.',
		icon: '🌌',
		color: 'blue',
	},
	{
		name: 'Caves & Crystal Geodes',
		tagline: 'Stalactites, Mineral Gems & Underground Caverns',
		description:
			'Venture underground into limestone caverns! Study how dripping mineral water forms hanging stalactites and rising stalagmites over thousands of years, and discover how amethyst and quartz geodes grow.',
		icon: '💎',
		color: 'purple',
	},
	{
		name: 'Honeybee Hive Architects',
		tagline: 'Hexagon Wax, Waggle Dances & Pollination',
		description:
			'Inspect the engineering wonder of the beehive! Learn why hexagons are the most efficient geometric shape for packing honey, how bees communicate foraging flowers through waggle dances, and the importance of pollination.',
		icon: '🐝',
		color: 'amber',
	},
	{
		name: 'Rollercoaster Physics',
		tagline: 'Potential Energy, Loops & G-Forces',
		description:
			'Buckle up for a physics ride! Explore potential vs kinetic energy as rollercoasters climb steep hills and plunge down drop-offs. Learn why teardrop loops prevent excessive G-forces on riders.',
		icon: '🎢',
		color: 'rose',
	},
	{
		name: 'Bridges & Mega Towers',
		tagline: 'Suspension Cables, Trusses & Earthquakes',
		description:
			'Discover how civil engineers build soaring skyscrapers and mile-long suspension bridges. Experiment with triangle trusses, arch bridges, tuned mass dampers, and materials that withstand fierce winds.',
		icon: '🌉',
		color: 'blue',
	},
	{
		name: 'Aurora Borealis & Solar Wind',
		tagline: 'Northern Lights, Magnetic Fields & Sunspots',
		description:
			'Marvel at dancing green and magenta auroras in the night sky! Learn how the Sun shoots out solar wind particles and how Earth’s magnetic magnetosphere channels them toward the polar skies in glowing curtains.',
		icon: '🌠',
		color: 'cyan',
	},
	{
		name: 'Desert Wildlife Adaptations',
		tagline: 'Cactus Spines, Camels & Nocturnal Burrowers',
		description:
			'Survive the scorching heat of the Mojave and Sahara! Study how cacti store gallons of water, how camels endure weeks without drinking, and how fennec foxes use oversized ears to dissipate heat.',
		icon: '🐪',
		color: 'amber',
	},
	{
		name: 'Time Travel & Ancient Eras',
		tagline: 'Ice Ages, Bronze Tools & Lost Empires',
		description:
			'Step into the time machine! Compare daily life in the Stone Age, Bronze Age, and Iron Age. Discover how humans invented the wheel, forged metals, and built early seafaring civilizations.',
		icon: '⏳',
		color: 'blue',
	},
	{
		name: 'Zero Waste & Recycling Tech',
		tagline: 'Composting, Plastic Sorting & Eco Innovations',
		description:
			'Transform waste into wonder! Explore biodegradable mushroom packaging, mechanical sorting of recyclables with air jets and magnets, and how organic compost enriches soil for delicious fruits and vegetables.',
		icon: '♻️',
		color: 'emerald',
	},
];

export function getCuratedRandomSkillset(excludedTopics = []) {
	const normalizedExcluded = (excludedTopics || [])
		.map((t) => (t || '').toLowerCase().trim())
		.filter(Boolean);

	const candidates = CURATED_RANDOM_SKILLSETS.filter((skill) => {
		const sName = skill.name.toLowerCase();
		return !normalizedExcluded.some(
			(ex) => sName.includes(ex) || ex.includes(sName),
		);
	});

	let pool = candidates;
	if (pool.length === 0) {
		const lastExcluded = normalizedExcluded[normalizedExcluded.length - 1];
		pool = CURATED_RANDOM_SKILLSETS.filter(
			(s) => !lastExcluded || !s.name.toLowerCase().includes(lastExcluded),
		);
		if (pool.length === 0) pool = CURATED_RANDOM_SKILLSETS;
	}

	const selected = pool[Math.floor(Math.random() * pool.length)];
	return { ...selected };
}

export const RANDOM_TOPIC_DOMAINS = [
	'Deep sea ocean creatures, abyssal trenches, and bioluminescence',
	'Kitchen chemistry reactions, bubbling solutions, and edible experiments',
	'Secret spy ciphers, hidden codes, cryptography, and pattern detection',
	'Prehistoric dinosaur giants, fossil excavations, and ancient footprints',
	'Robotics, ultrasonic sensors, autonomous rovers, and smart algorithms',
	'Optical illusions, light refraction through prisms, rainbows, and reflections',
	'Wild weather, tornadoes, hurricane eyes, cloud types, and lightning',
	'Origami geometry, paper folding angles, symmetry, and polyhedrons',
	'Rainforest biodiversity, tree canopies, tropical frogs, and wildlife',
	'Ancient Egyptian engineering, pyramids, ramps, and Nile river technology',
	'Aviation aerodynamics, lift and drag, bird flight, and jet engines',
	'Microscopic pond organisms, plant cell chloroplasts, and friendly bacteria',
	'Volcanic magma chambers, lava tubes, pumice stones, and tectonic plates',
	'Sound wave vibrations, echoes, pitch frequency, and musical instruments',
	'Mars human colonies, red planet habitats, and oxygen recycling science',
	'Arctic ice sheets, narwhals, blubber insulation, and polar survival',
	'Supernovas, glowing nebulae, stellar nurseries, and cosmic time',
	'Electrical circuits, battery conductivity, switches, and static sparks',
	'Coral reef ecology, clownfish partnerships, and marine conservation',
	'Renewable energy, wind turbine kinetics, and solar cell electricity',
	'Human brain neurobiology, optical memory games, and reflex signals',
	'Honeybee hive hexagon geometry, waggle communication, and pollination',
	'Underground limestone caverns, stalactites, and crystal geodes',
	'Rollercoaster physics, potential vs kinetic energy, and velocity loops',
];

export async function suggestSkillsetDetails({
	name = '',
	tagline = '',
	description = '',
	kidAge = 5,
	apiKey = null,
	preferredModel = null,
	excludedTopics = [],
	isRandom = false,
} = {}) {
	const cleanName = (name || '').trim();
	const cleanTagline = (tagline || '').trim();
	const cleanDesc = (description || '').trim();

	const isExplicitRandomOrEmpty =
		isRandom || (!cleanName && !cleanTagline && !cleanDesc);

	const rawKey =
		apiKey !== undefined && apiKey !== null ? apiKey : getStoredApiKey();
	const realApiKey = decryptApiKey(rawKey);

	if (!realApiKey) {
		if (isExplicitRandomOrEmpty) {
			return getCuratedRandomSkillset(excludedTopics);
		}
		throw new Error('MISSING_API_KEY');
	}

	const normalizedExcluded = (excludedTopics || [])
		.map((t) => (t || '').toLowerCase().trim())
		.filter(Boolean);

	const availableDomains = RANDOM_TOPIC_DOMAINS.filter(
		(domain) =>
			!normalizedExcluded.some((ex) => domain.toLowerCase().includes(ex)),
	);
	const chosenDomain =
		availableDomains.length > 0 ?
			availableDomains[Math.floor(Math.random() * availableDomains.length)]
		:	RANDOM_TOPIC_DOMAINS[
				Math.floor(Math.random() * RANDOM_TOPIC_DOMAINS.length)
			];

	const userContextParts = [];
	if (!isRandom && cleanName)
		userContextParts.push(`- Topic / Title hint: "${cleanName}"`);
	if (!isRandom && cleanTagline)
		userContextParts.push(`- Subtitle hint: "${cleanTagline}"`);
	if (!isRandom && cleanDesc)
		userContextParts.push(`- Concept / Description hint: "${cleanDesc}"`);

	let userContextStr = '';
	if (userContextParts.length > 0) {
		userContextStr = userContextParts.join('\n');
	} else {
		userContextStr = `- No specific topic provided: create a completely fresh, exciting, and surprising exploration topic inspired by: "${chosenDomain}".`;
	}

	const nonRepetitionConstraint =
		normalizedExcluded.length > 0 ?
			`CRITICAL NON-REPETITION REQUIREMENT:
The user has recently explored the following topics: [${normalizedExcluded.slice(-25).join(', ')}].
You MUST NOT repeat any of these topics, themes, or close synonyms. Pick a completely novel, distinct, and fresh STEM or logic subject.\n`
		:	'';

	const promptText = `You are an expert STEM, logic, and early-childhood curriculum designer for an interactive learning app called "AstroQuest" for children aged 3 to 14.

The user is creating a new custom learning skillset. Based on the user's input below, generate a polished, highly engaging skillset definition calibrated for a ${kidAge}-year-old explorer.

User's Input:
${userContextStr}
Target Child Age: ${kidAge} years old

${nonRepetitionConstraint}
Guidelines:
1. "name": 2 to 4 words. Inspiring, clear, and age-appropriate (e.g. "Space & Astronomy", "Underwater Ocean Life", "Math Puzzle Quests", "Dinosaurs & Fossils", "Creative Word Riddles").
2. "tagline": 3 to 6 words. Catchy subtitle summarizing the adventure (e.g. "Planets, Stars & Cosmic Secrets" or "Fractions, Shapes & Fun Logic").
3. "description": 2 to 4 detailed sentences explaining the pedagogical concepts, questions, and problem types that Gemini AI should generate for this skill. Mention specific themes, puzzle formats, or observational tasks.
4. "icon": A single fitting emoji character (e.g. 🚀, 🪐, 🦖, 🌊, 🔢, 🌿, 🧩, 🎨, 🐾, ⚡, 💡, 🐙, 🧪, 🕵️, 🤖).
5. "color": Exactly one of these allowed color keys: "emerald", "blue", "purple", "amber", "rose", "cyan".

Return ONLY a single valid raw JSON object without markdown formatting, code blocks, or explanations:
{
  "name": "...",
  "tagline": "...",
  "description": "...",
  "icon": "...",
  "color": "..."
}`;

	try {
		const activeProvider = getActiveAiProvider();
		let candidateText = '';

		if (activeProvider === AI_PROVIDERS.OPENAI) {
			candidateText = await callOpenAiApi(
				promptText,
				realApiKey,
				preferredModel,
			);
		} else if (activeProvider === AI_PROVIDERS.CLAUDE) {
			candidateText = await callClaudeApi(
				promptText,
				realApiKey,
				preferredModel,
			);
		} else {
			const payload = {
				contents: [{ parts: [{ text: promptText }] }],
				generationConfig: {
					temperature: isExplicitRandomOrEmpty ? 0.85 : 0.7,
					topP: 0.95,
					maxOutputTokens: 500,
				},
			};

			const rawResponse = await callGeminiApi(
				payload,
				realApiKey,
				preferredModel,
			);
			candidateText =
				rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
		}

		if (!candidateText) {
			throw new Error(
				`No response received from ${activeProvider.toUpperCase()} AI.`,
			);
		}

		const cleanedJson = candidateText
			.replace(/```json\s*/gi, '')
			.replace(/```\s*/g, '')
			.trim();

		const jsonStart = cleanedJson.indexOf('{');
		const jsonEnd = cleanedJson.lastIndexOf('}');
		if (jsonStart === -1 || jsonEnd === -1) {
			throw new Error('AI response did not contain a valid JSON object.');
		}

		const parsed = JSON.parse(cleanedJson.substring(jsonStart, jsonEnd + 1));

		const allowedColors = [
			'emerald',
			'blue',
			'purple',
			'amber',
			'rose',
			'cyan',
		];
		const chosenColor =
			allowedColors.includes(parsed.color?.toLowerCase()) ?
				parsed.color.toLowerCase()
			:	'cyan';

		return {
			name: (parsed.name || cleanName || 'New Skillset').trim(),
			tagline: (parsed.tagline || cleanTagline || '').trim(),
			description: (parsed.description || cleanDesc || '').trim(),
			icon: (parsed.icon || '🚀').trim().slice(0, 4),
			color: chosenColor,
		};
	} catch (err) {
		if (isExplicitRandomOrEmpty) {
			console.warn(
				'AI skillset suggestion encountered an issue; using curated non-repeating skillset fallback:',
				err,
			);
			return getCuratedRandomSkillset(excludedTopics);
		}
		throw err;
	}
}
