/**
 * Adaptive Difficulty & Cognitive Spaced Repetition Engine for AstroQuest.
 * Evaluates real-time session accuracy, streak velocity, and response time
 * to dynamically calibrate cognitive tiers and pedagogical scaffolding.
 */

export const DIFFICULTY_TIERS = {
	TIER_1: {
		id: 1,
		name: 'Cadet (Explorer)',
		icon: '🌱',
		maxRange: 10,
		distractorCount: 3,
	},
	TIER_2: {
		id: 2,
		name: 'Navigator (Apprentice)',
		icon: '🚀',
		maxRange: 20,
		distractorCount: 3,
	},
	TIER_3: {
		id: 3,
		name: 'Pilot (Adventurer)',
		icon: '🪐',
		maxRange: 50,
		distractorCount: 4,
	},
	TIER_4: {
		id: 4,
		name: 'Commander (Master)',
		icon: '⭐',
		maxRange: 100,
		distractorCount: 4,
	},
	TIER_5: {
		id: 5,
		name: 'Cosmic Legend (Frontier)',
		icon: '👑',
		maxRange: 500,
		distractorCount: 4,
	},
};

/**
 * Evaluates recent question performance to calculate the next recommended difficulty tier
 */
export function computeAdaptiveDifficulty({
	currentTier = 1,
	consecutiveCorrect = 0,
	consecutiveMistakes = 0,
	recentResponseTimesMs = [],
	cognitiveAptitudes = {},
}) {
	let recommendedTier = currentTier;
	let scaffoldingNeeded = false;
	let feedbackMessage = '';

	// Average response time in seconds
	const avgTimeSec =
		recentResponseTimesMs.length > 0 ?
			recentResponseTimesMs.reduce((a, b) => a + b, 0) /
			(recentResponseTimesMs.length * 1000)
		:	15;

	// Promote if strong accuracy streak and quick response
	if (consecutiveCorrect >= 3 && avgTimeSec < 20) {
		if (recommendedTier < 5) {
			recommendedTier += 1;
			feedbackMessage =
				'⚡ Rapid thinking detected! Difficulty calibrated upwards!';
		}
	} else if (consecutiveMistakes >= 2) {
		// Provide scaffolding and lower tier if needed
		scaffoldingNeeded = true;
		if (recommendedTier > 1) {
			recommendedTier -= 1;
			feedbackMessage =
				'🛡️ Activating supportive scaffolding to build solid foundations!';
		} else {
			feedbackMessage =
				'💡 Extra visual hints activated to assist your eagle eyes!';
		}
	}

	const tierInfo =
		DIFFICULTY_TIERS[`TIER_${recommendedTier}`] || DIFFICULTY_TIERS.TIER_1;

	return {
		recommendedTier,
		tierName: tierInfo.name,
		tierIcon: tierInfo.icon,
		scaffoldingNeeded,
		feedbackMessage,
		maxRange: tierInfo.maxRange,
	};
}

/**
 * Calculates domain-specific cognitive insights and growth tips for parents/educators
 */
export function generateCognitiveFlightRecommendations(domainScores = {}) {
	const tips = [];
	const domains = [
		{
			key: 'math',
			label: 'Mental Arithmetic & Logic',
			tip: 'Try mental math games like counting cosmic coins or fast-paced adding!',
		},
		{
			key: 'spatial',
			label: 'Spatial Reasoning',
			tip: 'Play with physical block building, folding origami, and isometric 3D puzzles!',
		},
		{
			key: 'pattern',
			label: 'Pattern Recognition',
			tip: 'Look for rhythmic patterns in nature, music beats, and shape sequences!',
		},
		{
			key: 'verbal',
			label: 'Language Reasoning',
			tip: 'Practice cosmic analogies and creative storytelling with your pet companion!',
		},
		{
			key: 'science',
			label: 'Scientific Inquiry',
			tip: 'Conduct simple kitchen experiments with water refraction, shadows, and magnets!',
		},
	];

	for (const d of domains) {
		const score = domainScores[d.key] ?? domainScores[d.label] ?? 70;
		if (score >= 85) {
			tips.push({
				domain: d.label,
				level: 'Mastery',
				text: `Outstanding mastery in ${d.label}! Ready for advanced problem-solving challenges.`,
			});
		} else if (score < 60) {
			tips.push({
				domain: d.label,
				level: 'Growth Area',
				text: `${d.tip}`,
			});
		}
	}

	if (tips.length === 0) {
		tips.push({
			domain: 'Overall Aptitude',
			level: 'Balanced',
			text: 'Well-rounded cosmic explorer! Continue exploring diverse question types across all 5 domains.',
		});
	}

	return tips;
}
