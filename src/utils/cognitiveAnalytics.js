// Cognitive Analytics & Skill Mastery Diagnostics Engine for AstroQuest
// Evaluates young learner aptitude across 5 fundamental cognitive domains
// Pure mathematical evaluation, zero external analytics dependencies

const COGNITIVE_STATS_KEY = 'astroquest_cognitive_stats';

export const COGNITIVE_DOMAINS = [
	{
		id: 'math',
		name: 'Mental Arithmetic',
		shortName: 'Arithmetic',
		icon: '🔢',
		color: '#22D3EE', // Cyan
		description: 'Number sense, arithmetic operations, and quick mental math',
	},
	{
		id: 'visual',
		name: 'Spatial Reasoning',
		shortName: 'Spatial',
		icon: '🧩',
		color: '#A855F7', // Purple
		description:
			'Geometry, spatial visualization, matrices, and mental rotation',
	},
	{
		id: 'patterns',
		name: 'Pattern Recognition',
		shortName: 'Patterns',
		icon: '🎯',
		color: '#F59E0B', // Amber
		description: 'Rule deduction, number & visual sequence completion',
	},
	{
		id: 'verbal',
		name: 'Verbal & Language',
		shortName: 'Verbal',
		icon: '📖',
		color: '#EC4899', // Pink
		description:
			'Word association, comprehension, vocabulary, and phonetic clues',
	},
	{
		id: 'logic',
		name: 'Scientific Inquiry',
		shortName: 'Inquiry',
		icon: '🔬',
		color: '#10B981', // Emerald
		description:
			'Hypothesis testing, classification, deduction, and nature STEM',
	},
];

/**
 * Classify a question into one of the 5 cognitive domains
 */
export function classifyQuestionDomain(question) {
	if (!question) return 'math';

	const text = (
		(question.question || '') +
		' ' +
		(question.questionText || '') +
		' ' +
		(question.category || '') +
		' ' +
		(question.diagramType || '')
	).toLowerCase();

	// Spatial / Visual
	if (
		question.category === 'Visual' ||
		question.diagramType ||
		text.includes('shape') ||
		text.includes('triangle') ||
		text.includes('circle') ||
		text.includes('rotate') ||
		text.includes('angle') ||
		text.includes('cube') ||
		text.includes('matrix') ||
		text.includes('symmetry') ||
		text.includes('grid')
	) {
		return 'visual';
	}

	// Pattern recognition
	if (
		text.includes('pattern') ||
		text.includes('next in') ||
		text.includes('sequence') ||
		text.includes('rule') ||
		text.includes('comes next') ||
		text.includes('series')
	) {
		return 'patterns';
	}

	// Verbal / Language
	if (
		text.includes('word') ||
		text.includes('rhyme') ||
		text.includes('spelling') ||
		text.includes('letter') ||
		text.includes('meaning') ||
		text.includes('sentence') ||
		text.includes('opposite') ||
		text.includes('synonym')
	) {
		return 'verbal';
	}

	// Scientific Inquiry / Logic
	if (
		text.includes('planet') ||
		text.includes('solar') ||
		text.includes('gravity') ||
		text.includes('animal') ||
		text.includes('science') ||
		text.includes('experiment') ||
		text.includes('water') ||
		text.includes('light') ||
		text.includes('organism') ||
		text.includes('moon')
	) {
		return 'logic';
	}

	// Default to arithmetic
	return 'math';
}

/**
 * Calculate cognitive domain scores from the current quest's questions and history
 */
export function calculateQuestCognitiveScores(questions = [], history = []) {
	// Initialize counts
	const domainTallies = {
		math: { total: 0, correct: 0 },
		visual: { total: 0, correct: 0 },
		patterns: { total: 0, correct: 0 },
		verbal: { total: 0, correct: 0 },
		logic: { total: 0, correct: 0 },
	};

	questions.forEach((q, idx) => {
		const domain = classifyQuestionDomain(q);
		const outcome = history[idx];
		domainTallies[domain].total += 1;
		if (outcome && outcome.isCorrect) {
			domainTallies[domain].correct += 1;
		}
	});

	// Compute percentage scores. If a domain had no questions in this specific quest,
	// assign a calibrated baseline (75%) so the radar chart looks balanced.
	const result = {};
	COGNITIVE_DOMAINS.forEach((d) => {
		const tally = domainTallies[d.id];
		if (tally.total > 0) {
			result[d.id] = Math.round((tally.correct / tally.total) * 100);
		} else {
			result[d.id] = 75; // Baseline representation
		}
	});

	return result;
}

/**
 * Get cumulative cognitive scores across all historical quests
 */
export function getStoredCognitiveStats() {
	try {
		const raw = localStorage.getItem(COGNITIVE_STATS_KEY);
		if (raw) {
			return JSON.parse(raw);
		}
	} catch {}
	return {
		math: 80,
		visual: 85,
		patterns: 78,
		verbal: 82,
		logic: 88,
	};
}

/**
 * Record a completed quest's cognitive scores into historical stats
 */
export function recordQuestCognitiveScores(newScores) {
	try {
		const current = getStoredCognitiveStats();
		const updated = {};
		COGNITIVE_DOMAINS.forEach((d) => {
			const oldScore = current[d.id] || 75;
			const newScore =
				newScores[d.id] !== undefined ? newScores[d.id] : oldScore;
			// Exponential moving average (70% previous + 30% new)
			updated[d.id] = Math.round(oldScore * 0.7 + newScore * 0.3);
		});
		localStorage.setItem(COGNITIVE_STATS_KEY, JSON.stringify(updated));
		return updated;
	} catch {
		return newScores;
	}
}
