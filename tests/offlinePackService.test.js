import { describe, expect, it } from 'vitest';
import {
	DEFAULT_OFFLINE_QUESTIONS,
	getOfflineQuestQuestions,
} from '../src/services/offlinePackService';

describe('Offline Quest Vault Service', () => {
	it('provides valid verified questions with 4 distinct options and a valid correctAnswerId', () => {
		expect(DEFAULT_OFFLINE_QUESTIONS.length).toBeGreaterThan(0);

		DEFAULT_OFFLINE_QUESTIONS.forEach((q) => {
			expect(q.id).toBeDefined();
			expect(q.question).toBeDefined();
			expect(q.options).toHaveLength(4);
			expect(['A', 'B', 'C', 'D']).toContain(q.correctAnswerId);
			expect(q.options.some((opt) => opt.id === q.correctAnswerId)).toBe(true);
			expect(q.solutionText).toBeDefined();
		});
	});

	it('returns requested count when fetching offline quest questions', () => {
		const pack = getOfflineQuestQuestions(5);
		expect(pack.length).toBeLessThanOrEqual(5);
		expect(pack.length).toBeGreaterThan(0);
	});
});
