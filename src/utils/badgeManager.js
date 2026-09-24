/**
 * AstroQuest Astronaut Rank & Mission Badge Progression System
 * Tracks XP, cosmic ranks, and collectible badges in localStorage.
 */

const STORAGE_KEY = 'astroquest_achievements';

export const ASTRONAUT_RANKS = [
	{
		level: 1,
		title: 'Stargazer',
		icon: '🔭',
		minXp: 0,
		maxXp: 99,
		color: 'from-blue-500 to-indigo-600',
	},
	{
		level: 2,
		title: 'Space Cadet',
		icon: '🚀',
		minXp: 100,
		maxXp: 249,
		color: 'from-cyan-500 to-blue-600',
	},
	{
		level: 3,
		title: 'Lunar Explorer',
		icon: '🌕',
		minXp: 250,
		maxXp: 499,
		color: 'from-amber-400 to-orange-500',
	},
	{
		level: 4,
		title: 'Cosmic Navigator',
		icon: '🪐',
		minXp: 500,
		maxXp: 899,
		color: 'from-purple-500 to-pink-600',
	},
	{
		level: 5,
		title: 'Galactic Commander',
		icon: '👑',
		minXp: 900,
		maxXp: Infinity,
		color: 'from-amber-300 via-pink-500 to-purple-600',
	},
];

export const BADGE_DEFINITIONS = [
	{
		id: 'first_launch',
		title: 'First Launch',
		description: 'Complete your first AstroQuest adventure.',
		icon: '🚀',
		color: 'border-cyan-400/60 bg-cyan-950/40 text-cyan-300',
	},
	{
		id: 'speed_of_light',
		title: 'Speed of Light',
		description: 'Answer a question correctly in under 15 seconds.',
		icon: '⚡',
		color: 'border-amber-400/60 bg-amber-950/40 text-amber-300',
	},
	{
		id: 'nebula_scholar',
		title: 'Nebula Scholar',
		description: 'Revisit and successfully conquer a skipped challenge.',
		icon: '🌌',
		color: 'border-purple-400/60 bg-purple-950/40 text-purple-300',
	},
	{
		id: 'stellar_streak',
		title: 'Stellar Streak',
		description: 'Answer 3 or more questions correctly in one quest.',
		icon: '⭐',
		color: 'border-yellow-400/60 bg-yellow-950/40 text-yellow-300',
	},
	{
		id: 'supernova_perfect',
		title: 'Supernova Perfect',
		description: 'Score a perfect 100% on a full quest.',
		icon: '🌟',
		color: 'border-pink-400/60 bg-pink-950/40 text-pink-300',
	},
	{
		id: 'cosmic_ray',
		title: 'Cosmic Ray Master',
		description: 'Activate the 50/50 Cosmic Ray power-up.',
		icon: '☄️',
		color: 'border-rose-400/60 bg-rose-950/40 text-rose-300',
	},
	{
		id: 'time_warp_champion',
		title: 'Time Warp Champion',
		description: 'Score 50+ points in the Time Warp Lightning Round.',
		icon: '⚡',
		color: 'border-indigo-400/60 bg-indigo-950/40 text-indigo-300',
	},
	{
		id: 'boss_slayer',
		title: 'Boss Encounter Victor',
		description: 'Conquer the Mission Control Final Boss Question.',
		icon: '👾',
		color: 'border-red-400/60 bg-red-950/40 text-red-300',
	},
	{
		id: 'stellar_astronomer',
		title: 'Stellar Astronomer',
		description: 'Unlock star coordinates in the Constellation Observatory.',
		icon: '🌠',
		color: 'border-teal-400/60 bg-teal-950/40 text-teal-300',
	},
	{
		id: 'solar_voyager',
		title: 'Solar Voyager',
		description: 'Explore celestial worlds in the Pocket Planetarium.',
		icon: '🪐',
		color: 'border-amber-400/60 bg-amber-950/40 text-amber-300',
	},
	{
		id: 'telemetry_master',
		title: 'Telemetry Specialist',
		description: 'Deploy the Starfleet Telemetry Scan radar sweep.',
		icon: '🛸',
		color: 'border-cyan-400/60 bg-cyan-950/40 text-cyan-300',
	},
	{
		id: 'chrono_master',
		title: 'Chrono Guardian',
		description: 'Activate the Chrono Freeze time warp boost.',
		icon: '⏱️',
		color: 'border-emerald-400/60 bg-emerald-950/40 text-emerald-300',
	},
];

export function getStoredAchievements() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			return {
				xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
				badges: Array.isArray(parsed.badges) ? parsed.badges : [],
				unlockedAt: parsed.unlockedAt || {},
			};
		}
	} catch {}
	return { xp: 0, badges: [], unlockedAt: {} };
}

export function saveAchievements(achievements) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
	} catch {}
}

export function calculateRank(xp = 0) {
	const currentRank =
		[...ASTRONAUT_RANKS].reverse().find((r) => xp >= r.minXp) ||
		ASTRONAUT_RANKS[0];
	const nextRank =
		ASTRONAUT_RANKS.find((r) => r.level === currentRank.level + 1) || null;

	let progress = 100;
	if (nextRank) {
		const range = nextRank.minXp - currentRank.minXp;
		const currentProgress = xp - currentRank.minXp;
		progress = Math.min(
			100,
			Math.max(0, Math.round((currentProgress / range) * 100)),
		);
	}

	return {
		...currentRank,
		nextRankTitle: nextRank ? nextRank.title : 'Maximum Rank',
		nextRankXp: nextRank ? nextRank.minXp : xp,
		progressPercent: progress,
	};
}

export function awardXP(amount) {
	const current = getStoredAchievements();
	const newXp = Math.max(0, (current.xp || 0) + amount);
	const updated = { ...current, xp: newXp };
	saveAchievements(updated);
	return {
		newXp,
		rank: calculateRank(newXp),
	};
}

export function awardBadge(badgeId) {
	const current = getStoredAchievements();
	if (current.badges.includes(badgeId)) {
		return { newlyAwarded: false, badge: null };
	}

	const badgeDef = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
	if (!badgeDef) return { newlyAwarded: false, badge: null };

	const updatedBadges = [...current.badges, badgeId];
	const updatedUnlockedAt = {
		...current.unlockedAt,
		[badgeId]: new Date().toISOString(),
	};
	// Bonus XP for unlocking a badge!
	const updatedXp = (current.xp || 0) + 25;

	const updated = {
		xp: updatedXp,
		badges: updatedBadges,
		unlockedAt: updatedUnlockedAt,
	};
	saveAchievements(updated);

	return {
		newlyAwarded: true,
		badge: badgeDef,
		xpAwarded: 25,
	};
}
