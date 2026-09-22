/**
 * skillManager.js
 * Centralized Skillset Management Engine for AstroQuest.
 * Handles built-in default skillsets, user-defined custom skillsets in localStorage,
 * file-based import/export, and dynamic prompt definition lookups for AI question generation.
 */

export const CUSTOM_SKILLS_STORAGE_KEY = 'astroquest_custom_skillsets_v1';

export const DEFAULT_SKILLSETS = [
	{
		id: 'visual',
		name: 'Visual',
		title: 'Visual Observation & Spatial Reasoning',
		tagline: 'Observation & Patterns',
		icon: 'Eye',
		color: 'cyan',
		badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-300',
		cardBorder: 'border-cyan-400 hover:border-cyan-300',
		buttonGradient: 'from-cyan-500 to-blue-600',
		description:
			'Missing grid tiles, pattern completions, object counting, symmetry, and balance puzzles.',
		coreObjective:
			'The student must observe, count, compare, or deduce patterns and spatial relationships from visual descriptions or diagram representations.',
		batch1Domain:
			'Batch 1 Focus: (1) Shape & color pattern progressions (e.g. AB, AAB, ABC sequences or number progressions), (2) Missing grid tile matrix deduction, (3) Balance scale weight logic.',
		batch2Domain:
			'Batch 2 Focus: (1) Object counting & arithmetic grouping puzzles, (2) 3D isometric block tower heights & volumes, (3) Spatial reflections, symmetry, or rotations.',
		isDefault: true,
	},
	{
		id: 'analytical_thinking',
		name: 'Analytical Thinking',
		title: 'Analytical Thinking & Logical Deduction',
		tagline: 'Logic & Relationships',
		icon: 'Brain',
		color: 'purple',
		badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
		cardBorder: 'border-purple-400 hover:border-purple-300',
		buttonGradient: 'from-purple-500 to-indigo-600',
		description:
			'Analogies, classification, cause-and-effect riddles, and logical deductions tailored to age.',
		coreObjective:
			'The student must analyze relationships, deduce outcomes from logical rules, connect concepts through analogies, or classify items based on defined properties.',
		batch1Domain:
			'Batch 1 Focus: (1) Relational & functional analogies (A : B :: C : D), (2) Everyday cause-and-effect science & nature riddles.',
		batch2Domain:
			'Batch 2 Focus: (1) Multi-step deductive logic clues & riddles, (2) Categorical classification (odd-one-out), (3) Sequence rules and conditional reasoning.',
		isDefault: true,
	},
];

/**
 * Curated preset templates for quick skillset creation inspiration
 */
export const SKILLSET_PRESETS = [
	{
		name: 'Science & Space Exploration',
		tagline: 'Planets, Physics & Wonders',
		icon: 'Rocket',
		color: 'emerald',
		description:
			'Planets, gravity, solar system facts, stars, telescopes, rocket launches, and space phenomena tailored for young explorers.',
	},
	{
		name: 'Math Word Puzzles & Operations',
		tagline: 'Numbers, Logic & Math Fun',
		icon: 'Calculator',
		color: 'amber',
		description:
			'Engaging arithmetic word problems, number sequences, real-world shopping math, time calculations, and friendly math riddles.',
	},
	{
		name: 'Nature & Animal Kingdom',
		tagline: 'Ecology, Habitats & Wildlife',
		icon: 'PawPrint',
		color: 'emerald',
		description:
			'Animal habitats, life cycles, food chains, weather patterns, plant growth, and curious nature science puzzles.',
	},
	{
		name: 'Word Power & Language Riddles',
		tagline: 'Vocabulary, Rhymes & Words',
		icon: 'BookOpen',
		color: 'blue',
		description:
			'Synonyms, antonyms, compound words, rhyming clues, figurative expressions, and word-building challenges.',
	},
];

/**
 * Color style mapping for custom skill cards
 */
export const COLOR_THEMES = {
	cyan: {
		id: 'cyan',
		name: 'Cosmic Cyan',
		badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-300',
		cardBorder: 'border-cyan-400 hover:border-cyan-300',
		buttonGradient: 'from-cyan-500 to-blue-600',
		hoverShadow: 'group-hover:shadow-cyan-400/50',
		chipBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
	},
	purple: {
		id: 'purple',
		name: 'Nebula Purple',
		badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
		cardBorder: 'border-purple-400 hover:border-purple-300',
		buttonGradient: 'from-purple-500 to-indigo-600',
		hoverShadow: 'group-hover:shadow-purple-400/50',
		chipBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
	},
	emerald: {
		id: 'emerald',
		name: 'Emerald Aurora',
		badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
		cardBorder: 'border-emerald-400 hover:border-emerald-300',
		buttonGradient: 'from-emerald-500 to-teal-600',
		hoverShadow: 'group-hover:shadow-emerald-400/50',
		chipBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
	},
	amber: {
		id: 'amber',
		name: 'Solar Amber',
		badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
		cardBorder: 'border-amber-400 hover:border-amber-300',
		buttonGradient: 'from-amber-500 to-orange-600',
		hoverShadow: 'group-hover:shadow-amber-400/50',
		chipBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
	},
	rose: {
		id: 'rose',
		name: 'Supernova Rose',
		badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
		cardBorder: 'border-rose-400 hover:border-rose-300',
		buttonGradient: 'from-rose-500 to-pink-600',
		hoverShadow: 'group-hover:shadow-rose-400/50',
		chipBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
	},
	blue: {
		id: 'blue',
		name: 'Deep Orbit Blue',
		badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
		cardBorder: 'border-blue-400 hover:border-blue-300',
		buttonGradient: 'from-blue-500 to-indigo-600',
		hoverShadow: 'group-hover:shadow-blue-400/50',
		chipBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
	},
};

/**
 * Retrieve user-created custom skillsets from localStorage
 */
export function getCustomSkillsets() {
	try {
		const raw = localStorage.getItem(CUSTOM_SKILLS_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return parsed.filter((item) => item && item.name && item.description);
		}
	} catch (err) {
		console.warn('Could not read custom skillsets from localStorage:', err);
	}
	return [];
}

/**
 * Returns merged array of default skillsets and custom user-created skillsets
 */
export function getAllSkillsets() {
	const custom = getCustomSkillsets();
	return [...DEFAULT_SKILLSETS, ...custom];
}

/**
 * Find definition for a given skill name (case-insensitive fallback)
 */
export function getSkillDefinition(skillName) {
	if (!skillName || typeof skillName !== 'string') {
		return DEFAULT_SKILLSETS[0];
	}

	const normalized = skillName.trim().toLowerCase();
	const all = getAllSkillsets();

	const match = all.find(
		(s) =>
			s.name.toLowerCase() === normalized ||
			(s.title && s.title.toLowerCase() === normalized) ||
			(s.id && s.id.toLowerCase() === normalized),
	);

	if (match) {
		return match;
	}

	// Fallback dynamic definition for custom skill
	return {
		id: normalized.replace(/\s+/g, '_'),
		name: skillName.trim(),
		title: `${skillName.trim()} Exploration`,
		tagline: 'Custom Learning Mission',
		icon: '🚀',
		color: 'cyan',
		description: `Challenges and puzzles focused on ${skillName.trim()}.`,
		coreObjective: `The student must analyze and answer age-calibrated questions centered around ${skillName.trim()}.`,
		batch1Domain: `Batch 1 Focus: Foundational principles, key concepts, and introductory puzzles for ${skillName.trim()}.`,
		batch2Domain: `Batch 2 Focus: Multi-step thinking, relational deductions, and problem-solving within ${skillName.trim()}.`,
		isDefault: false,
	};
}

/**
 * Save or update a custom skillset
 */
export function saveCustomSkillset({
	name,
	description,
	tagline = '',
	icon = '🚀',
	color = 'cyan',
}) {
	const trimmedName = String(name || '').trim();
	const trimmedDesc = String(description || '').trim();
	const trimmedTagline = String(tagline || '').trim() || 'Custom Skill';
	const trimmedIcon = String(icon || '🚀').trim() || '🚀';
	const selectedColor = COLOR_THEMES[color] ? color : 'cyan';

	if (!trimmedName) {
		throw new Error('Please enter a skillset name! ✨');
	}
	if (!trimmedDesc) {
		throw new Error('Please provide a description for the skillset! 📝');
	}

	// Check collision with default skill names
	const isDefaultCollision = DEFAULT_SKILLSETS.some(
		(d) => d.name.toLowerCase() === trimmedName.toLowerCase(),
	);
	if (isDefaultCollision) {
		throw new Error(
			`"${trimmedName}" is a built-in default skill and cannot be overwritten.`,
		);
	}

	const currentCustom = getCustomSkillsets();
	const themeInfo = COLOR_THEMES[selectedColor];

	const newSkill = {
		id: `custom_${trimmedName.toLowerCase().replace(/[^\w]/g, '_')}_${Date.now()}`,
		name: trimmedName,
		title: trimmedName,
		tagline: trimmedTagline,
		icon: trimmedIcon,
		color: selectedColor,
		badgeColor: themeInfo.badgeColor,
		cardBorder: themeInfo.cardBorder,
		buttonGradient: themeInfo.buttonGradient,
		description: trimmedDesc,
		coreObjective: `The student must solve age-appropriate challenges and questions focused on ${trimmedName}: ${trimmedDesc}.`,
		batch1Domain: `Batch 1 Focus: Foundational principles, key concepts, and introductory puzzles for ${trimmedName}.`,
		batch2Domain: `Batch 2 Focus: Multi-step thinking, relational deductions, and problem-solving within ${trimmedName}.`,
		isDefault: false,
		createdAt: new Date().toISOString(),
	};

	// Replace if existing or append
	const existingIdx = currentCustom.findIndex(
		(s) => s.name.toLowerCase() === trimmedName.toLowerCase(),
	);

	let updatedList;
	if (existingIdx >= 0) {
		updatedList = [...currentCustom];
		updatedList[existingIdx] = {
			...updatedList[existingIdx],
			...newSkill,
			id: updatedList[existingIdx].id,
		};
	} else {
		updatedList = [...currentCustom, newSkill];
	}

	try {
		localStorage.setItem(
			CUSTOM_SKILLS_STORAGE_KEY,
			JSON.stringify(updatedList),
		);
	} catch (err) {
		console.error('Failed to save custom skill to localStorage:', err);
		throw new Error('Storage error: could not persist the new skillset.');
	}

	return newSkill;
}

/**
 * Delete a custom skillset by name or id
 */
export function deleteCustomSkillset(skillIdentifier) {
	if (!skillIdentifier) return false;
	const idLower = String(skillIdentifier).trim().toLowerCase();

	const isDefault = DEFAULT_SKILLSETS.some(
		(d) => d.name.toLowerCase() === idLower || d.id.toLowerCase() === idLower,
	);
	if (isDefault) {
		throw new Error('Default built-in skills cannot be deleted.');
	}

	const currentCustom = getCustomSkillsets();
	const filtered = currentCustom.filter(
		(s) => s.name.toLowerCase() !== idLower && s.id.toLowerCase() !== idLower,
	);

	try {
		localStorage.setItem(CUSTOM_SKILLS_STORAGE_KEY, JSON.stringify(filtered));
		return true;
	} catch (err) {
		console.error('Failed to delete custom skill:', err);
		return false;
	}
}

/**
 * Exports all custom skillsets to a downloadable JSON file
 */
export function exportSkillsetsToJsonFile() {
	const custom = getCustomSkillsets();
	const payload = {
		app: 'AstroQuest',
		version: '2.0.0',
		exportedAt: new Date().toISOString(),
		skillsets: custom,
	};

	const dataStr =
		'data:text/json;charset=utf-8,' +
		encodeURIComponent(JSON.stringify(payload, null, 2));
	const downloadAnchor = document.createElement('a');
	downloadAnchor.setAttribute('href', dataStr);
	downloadAnchor.setAttribute(
		'download',
		`astroquest_skillsets_${new Date().toISOString().slice(0, 10)}.json`,
	);
	document.body.appendChild(downloadAnchor);
	downloadAnchor.click();
	downloadAnchor.remove();
}

/**
 * Imports skillsets from JSON string or file content
 */
export function importSkillsetsFromJson(jsonString) {
	if (!jsonString || typeof jsonString !== 'string') {
		throw new Error('Invalid or empty JSON file.');
	}

	let data;
	try {
		data = JSON.parse(jsonString);
	} catch {
		throw new Error('Failed to parse JSON file. Please check the file format.');
	}

	const incomingSkills = Array.isArray(data) ? data : data.skillsets;
	if (!Array.isArray(incomingSkills) || incomingSkills.length === 0) {
		throw new Error('No valid skillsets found in the uploaded file.');
	}

	let importedCount = 0;
	for (const item of incomingSkills) {
		if (item && item.name && item.description) {
			try {
				saveCustomSkillset({
					name: item.name,
					description: item.description,
					tagline: item.tagline || 'Custom Skill',
					icon: item.icon || '🚀',
					color: item.color || 'cyan',
				});
				importedCount++;
			} catch (e) {
				console.warn(`Could not import skill "${item?.name}":`, e.message);
			}
		}
	}

	return importedCount;
}
