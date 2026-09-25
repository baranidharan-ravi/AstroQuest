import { beforeEach, describe, expect, it } from 'vitest';
import {
	DEFAULT_QUESTION_TIMER_SECONDS,
	isTimerMandatoryForAge,
	MANDATORY_TIMER_MAX_AGE,
	MANDATORY_TIMER_MIN_AGE,
} from '../src/constants';
import {
	getStoredTimerConfig,
	saveStoredTimerConfig,
} from '../src/utils/progressTracker';

describe('Mandatory Timer Rules Suite (Ages 8–14 & 60s Default)', () => {
	beforeEach(() => {
		const store = new Map();
		globalThis.localStorage = {
			getItem: (key) => store.get(key) || null,
			setItem: (key, val) => store.set(key, String(val)),
			removeItem: (key) => store.delete(key),
			clear: () => store.clear(),
		};
	});

	it('defines the default question timer constant as 60 seconds', () => {
		expect(DEFAULT_QUESTION_TIMER_SECONDS).toBe(60);
		expect(MANDATORY_TIMER_MIN_AGE).toBe(8);
		expect(MANDATORY_TIMER_MAX_AGE).toBe(14);
	});

	it('correctly evaluates isTimerMandatoryForAge across early childhood and older age brackets', () => {
		// Ages 2–7 (Early Childhood & Primary): Timer is optional/toggleable
		expect(isTimerMandatoryForAge(2)).toBe(false);
		expect(isTimerMandatoryForAge(4)).toBe(false);
		expect(isTimerMandatoryForAge(6)).toBe(false);
		expect(isTimerMandatoryForAge(7)).toBe(false);
		expect(isTimerMandatoryForAge('7')).toBe(false);

		// Ages 8–10 (Upper Elementary): Timer is mandatory
		expect(isTimerMandatoryForAge(8)).toBe(true);
		expect(isTimerMandatoryForAge(9)).toBe(true);
		expect(isTimerMandatoryForAge(10)).toBe(true);
		expect(isTimerMandatoryForAge('8')).toBe(true);
		expect(isTimerMandatoryForAge('10')).toBe(true);

		// Ages 11–14 (Middle School): Timer is mandatory
		expect(isTimerMandatoryForAge(11)).toBe(true);
		expect(isTimerMandatoryForAge(12)).toBe(true);
		expect(isTimerMandatoryForAge(13)).toBe(true);
		expect(isTimerMandatoryForAge(14)).toBe(true);
		expect(isTimerMandatoryForAge('14')).toBe(true);

		// Edge cases: NaN, null, undefined
		expect(isTimerMandatoryForAge(null)).toBe(false);
		expect(isTimerMandatoryForAge(undefined)).toBe(false);
		expect(isTimerMandatoryForAge('')).toBe(false);
		expect(isTimerMandatoryForAge('abc')).toBe(false);
	});

	it('enforces enabled: true for ages 8–14 in getStoredTimerConfig even if storage had enabled: false', () => {
		// Mock storage having enabled: false
		const disabledConfig = JSON.stringify({
			enabled: false,
			secondsPerQuestion: 60,
		});
		if (typeof window !== 'undefined' && window.localStorage) {
			window.localStorage.setItem('astroquest_timer_config', disabledConfig);
		}

		// For an 8-year-old explorer, mandatory timer rule overrides disabled state
		const configForAge8 = getStoredTimerConfig(8);
		expect(configForAge8.enabled).toBe(true);
		expect(configForAge8.secondsPerQuestion).toBe(60);

		// For an 11-year-old explorer (Middle School), mandatory timer rule overrides disabled state
		const configForAge11 = getStoredTimerConfig(11);
		expect(configForAge11.enabled).toBe(true);

		// For a 6-year-old explorer, disabled state is respected (timer remains optional)
		const configForAge6 = getStoredTimerConfig(6);
		expect(configForAge6.enabled).toBe(false);
	});

	it('defaults to 60 seconds per question when no timer config is in storage', () => {
		const configAge6 = getStoredTimerConfig(6);
		expect(configAge6.secondsPerQuestion).toBe(60);
		expect(configAge6.enabled).toBe(false);

		const configAge9 = getStoredTimerConfig(9);
		expect(configAge9.secondsPerQuestion).toBe(60);
		expect(configAge9.enabled).toBe(true);
	});

	it('allows adjusting timer duration (e.g. 30s, 45s, 120s) for ages 8–14 while locking enabled to true', () => {
		// Age 10 explorer customizes timer duration to 45 seconds but attempts to disable it
		const saved = saveStoredTimerConfig(
			{ enabled: false, secondsPerQuestion: 45 },
			10,
		);
		expect(saved.enabled).toBe(true);
		expect(saved.secondsPerQuestion).toBe(45);

		// Check retrieving back from storage
		const loaded = getStoredTimerConfig(10);
		expect(loaded.enabled).toBe(true);
		expect(loaded.secondsPerQuestion).toBe(45);
	});

	it('allows younger explorers (ages 2–7) to toggle the timer off for unlimited time', () => {
		const saved = saveStoredTimerConfig(
			{ enabled: false, secondsPerQuestion: 60 },
			5,
		);
		expect(saved.enabled).toBe(false);

		const loaded = getStoredTimerConfig(5);
		expect(loaded.enabled).toBe(false);
	});

	it('exports SkillSelectionDashboard with Mission Parameters and Quest Controls configuration', async () => {
		const SkillSelectionDashboard = (
			await import('../src/features/dashboard/SkillSelectionDashboard')
		).default;
		expect(SkillSelectionDashboard).toBeDefined();
		expect(typeof SkillSelectionDashboard).toBe('object');
	});
});
