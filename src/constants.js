/**
 * AstroQuest - Centralized Application Constants & Single Source of Truth
 *
 * Implements SOLID Single Responsibility:
 * Central configuration registry and storage keys.
 * Curated data catalogs are maintained in modular data files under src/data/.
 */

// Re-exported Data Catalogs
export {
	CELESTIAL_BODIES,
	CELESTIAL_IMAGE_CATALOG,
	PLANET_COLOR_CONFIGS,
	SOLAR_PLANETS,
} from './data/celestialData.js';
export { COSMIC_FEATURE_MODES } from './data/cosmicFeatureModes.js';
export {
	COSMIC_LANGUAGES,
	CURRICULUM_STANDARDS,
} from './data/curriculumStandards.js';
export { HABITAT_MODULES } from './data/habitatModules.js';
export { POPULAR_EMOJIS, POPULAR_ICONS } from './data/popularIcons.js';
export { RAPID_FALLBACK_QUESTIONS } from './data/rapidFallbackQuestions.js';

// ─── Storage Keys ───────────────────────────────────────────────────────────
export const SUGGESTED_SKILLSETS_STORAGE_KEY =
	'astroquest_suggested_skillsets_v1';
export const HIGH_SCORE_KEY = 'astroquest_timewarp_highscore';
export const ODYSSEY_STORAGE_KEY = 'astroquest_total_stars_collected_v1';
export const HABITAT_STORAGE_KEY = 'astroquest_habitat_modules_v1';
export const CARD_DENSITY_STORAGE_KEY = 'astroquest_card_density_v1';
export const ANOMALIES_VAULT_STORAGE_KEY = 'astroquest_anomalies_vault_v1';
export const ANOMALIES_MAX_ITEMS = 50;
export const ACCESSIBILITY_SETTINGS_STORAGE_KEY = 'astroquest_accessibility_v1';

// ─── Quick Prompts for Question Creator ─────────────────────────────────────
export const QUICK_PROMPTS = [
	'Planets & Stars',
	'Rocket Science',
	'Black Holes & Gravity',
	'Moon Exploration',
	'Solar System Math',
	'Astronaut Life',
];

// ─── Cosmic Lifelines Configuration ─────────────────────────────────────────
export const CHRONO_FREEZE_SECONDS = 30;

export const LIFELINE_TABS = {
	CLUE: 'clue',
	RAY: 'ray',
	SCAN: 'scan',
	FREEZE: 'freeze',
};

export const LIFELINE_DEFINITIONS = {
	clue: {
		id: 'clue',
		label: 'Cosmic Clue',
		icon: 'Lightbulb',
		description: 'Pedagogical guidance and observational clues',
	},
	ray: {
		id: 'ray',
		label: '50/50 Cosmic Ray',
		icon: 'Zap',
		description: 'Vaporizes two incorrect choices',
	},
	scan: {
		id: 'scan',
		label: 'Starfleet Radar',
		icon: 'Radio',
		description: 'Deep-space sensor sweep calculating probability match',
	},
	freeze: {
		id: 'freeze',
		label: 'Chrono Freeze',
		icon: 'Clock',
		description: 'Adds +30s time warp dilation to the countdown timer',
	},
};

export const PURE_QUEST_XP_BONUS = 50;
export const PURE_QUEST_BADGE_ID = 'pure_quest';

// ─── Question Countdown Timer & Cognitive Age Rules ─────────────────────────
export const DEFAULT_QUESTION_TIMER_SECONDS = 60;
export const MANDATORY_TIMER_MIN_AGE = 8;
export const MANDATORY_TIMER_MAX_AGE = 14;

/**
 * Checks if question countdown timer is mandatory for a given explorer age.
 * Mandatory for Ages 8–14:
 * - Upper Elementary (Ages 8–10, Grades 3–5)
 * - Middle School (Ages 11–14, Grades 6–9)
 * Provides active cognitive challenge by preventing unlimited time.
 */
export const isTimerMandatoryForAge = (age) => {
	const num = Number(age);
	return !isNaN(num) && num >= MANDATORY_TIMER_MIN_AGE;
};

// ─── Settings Screen Navigation Tabs ────────────────────────────────────────
export const SETTINGS_TABS = [
	{
		id: 'profile',
		label: 'Explorer Profile',
		shortLabel: 'Profile',
		iconName: 'Smile',
		description: 'Child name, age, avatar & flight crew',
	},
	{
		id: 'ai',
		label: 'AI Engine & Key',
		shortLabel: 'AI Engine',
		iconName: 'Cpu',
		description: 'Provider, API key & model selection',
	},
	{
		id: 'pacing',
		label: 'Timer & Pacing',
		shortLabel: 'Pacing',
		iconName: 'Clock',
		description: 'Question countdown, auto-advance & diagrams',
	},
	{
		id: 'audio',
		label: 'Audio & Access',
		shortLabel: 'Audio',
		iconName: 'Volume2',
		description: 'Voice narrator, soundscape & accessibility',
	},
];
