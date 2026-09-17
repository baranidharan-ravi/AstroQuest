import { describe, expect, it } from 'vitest';
import {
	computeAdaptiveDifficulty,
	generateCognitiveFlightRecommendations,
} from '../src/utils/adaptiveEngine';

describe('Adaptive Difficulty Engine', () => {
	it('promotes tier when child maintains consecutive correct answers with fast response time', () => {
		const result = computeAdaptiveDifficulty({
			currentTier: 2,
			consecutiveCorrect: 4,
			consecutiveMistakes: 0,
			recentResponseTimesMs: [8000, 7000, 6500],
		});

		expect(result.recommendedTier).toBe(3);
		expect(result.scaffoldingNeeded).toBe(false);
	});

	it('activates scaffolding and lowers tier when child struggles with consecutive mistakes', () => {
		const result = computeAdaptiveDifficulty({
			currentTier: 3,
			consecutiveCorrect: 0,
			consecutiveMistakes: 2,
			recentResponseTimesMs: [25000, 30000],
		});

		expect(result.recommendedTier).toBe(2);
		expect(result.scaffoldingNeeded).toBe(true);
	});

	it('generates growth recommendations based on domain score thresholds', () => {
		const tips = generateCognitiveFlightRecommendations({
			math: 95,
			spatial: 50,
		});

		expect(tips.length).toBeGreaterThan(0);
		expect(tips.some((t) => t.level === 'Mastery')).toBe(true);
		expect(tips.some((t) => t.level === 'Growth Area')).toBe(true);
	});
});
