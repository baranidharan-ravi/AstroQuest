import { describe, expect, it } from 'vitest';
import {
	CURATED_RANDOM_SKILLSETS,
	getCuratedRandomSkillset,
	suggestSkillsetDetails,
} from '../src/services/aiGenerator';

describe('Random Non-Repeating Skillset Generator', () => {
	it('contains a diverse curated bank with valid properties and allowed colors', () => {
		expect(CURATED_RANDOM_SKILLSETS.length).toBeGreaterThanOrEqual(30);

		const allowedColors = [
			'emerald',
			'blue',
			'purple',
			'amber',
			'rose',
			'cyan',
		];
		CURATED_RANDOM_SKILLSETS.forEach((skill) => {
			expect(skill.name).toBeTruthy();
			expect(skill.tagline).toBeTruthy();
			expect(skill.description).toBeTruthy();
			expect(skill.icon).toBeTruthy();
			expect(allowedColors).toContain(skill.color);
		});
	});

	it('returns a valid curated skillset and does not pick from excluded topics', () => {
		const firstSkill = getCuratedRandomSkillset([]);
		expect(firstSkill).toBeDefined();
		expect(firstSkill.name).toBeTruthy();

		// Exclude the first skill
		const secondSkill = getCuratedRandomSkillset([firstSkill.name]);
		expect(secondSkill.name).not.toBe(firstSkill.name);

		// Exclude both
		const thirdSkill = getCuratedRandomSkillset([
			firstSkill.name,
			secondSkill.name,
		]);
		expect([firstSkill.name, secondSkill.name]).not.toContain(thirdSkill.name);
	});

	it('generates 5 consecutive unique topics without repeating any previous topic', () => {
		const seen = [];
		for (let i = 0; i < 5; i++) {
			const skill = getCuratedRandomSkillset(seen);
			expect(seen).not.toContain(skill.name);
			seen.push(skill.name);
		}
		expect(new Set(seen).size).toBe(5);
	});

	it('gracefully provides a curated random skillset when no API key is set and fields are empty', async () => {
		const result = await suggestSkillsetDetails({
			name: '',
			tagline: '',
			description: '',
			kidAge: 6,
			apiKey: '',
			excludedTopics: ['Deep Sea Ocean Mysteries'],
			isRandom: true,
		});

		expect(result).toBeDefined();
		expect(result.name).toBeTruthy();
		expect(result.name.toLowerCase()).not.toContain('deep sea ocean mysteries');
		expect(result.description).toBeTruthy();
		expect(result.tagline).toBeTruthy();
		expect(result.icon).toBeTruthy();
		expect(['emerald', 'blue', 'purple', 'amber', 'rose', 'cyan']).toContain(
			result.color,
		);
	});
});
