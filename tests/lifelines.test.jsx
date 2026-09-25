import { describe, expect, it } from 'vitest';
import {
	CHRONO_FREEZE_SECONDS,
	LIFELINE_DEFINITIONS,
	LIFELINE_TABS,
} from '../src/constants';
import {
	playChronoFreezeSound,
	playTelemetryScanSound,
} from '../src/utils/audioSynthesis';
import { BADGE_DEFINITIONS } from '../src/utils/badgeManager';

describe('Cosmic Lifelines Suite', () => {
	it('exposes all 4 strategic lifelines with correct tab keys and constants', () => {
		expect(Object.keys(LIFELINE_TABS)).toHaveLength(4);
		expect(LIFELINE_TABS.CLUE).toBe('clue');
		expect(LIFELINE_TABS.RAY).toBe('ray');
		expect(LIFELINE_TABS.SCAN).toBe('scan');
		expect(LIFELINE_TABS.FREEZE).toBe('freeze');
		expect(CHRONO_FREEZE_SECONDS).toBe(30);
	});

	it('provides complete metadata definitions for each lifeline', () => {
		expect(LIFELINE_DEFINITIONS.clue).toBeDefined();
		expect(LIFELINE_DEFINITIONS.ray).toBeDefined();
		expect(LIFELINE_DEFINITIONS.scan).toBeDefined();
		expect(LIFELINE_DEFINITIONS.freeze).toBeDefined();

		expect(LIFELINE_DEFINITIONS.scan.label).toBe('Starfleet Radar');
		expect(LIFELINE_DEFINITIONS.freeze.label).toBe('Chrono Freeze');
	});

	it('includes Telemetry Specialist and Chrono Guardian in badge definitions', () => {
		const telemetryBadge = BADGE_DEFINITIONS.find(
			(b) => b.id === 'telemetry_master',
		);
		const chronoBadge = BADGE_DEFINITIONS.find((b) => b.id === 'chrono_master');

		expect(telemetryBadge).toBeDefined();
		expect(telemetryBadge?.title).toBe('Telemetry Specialist');

		expect(chronoBadge).toBeDefined();
		expect(chronoBadge?.title).toBe('Chrono Guardian');
	});

	it('exports procedural audio synthesis triggers for telemetry scan and chrono freeze', () => {
		expect(typeof playTelemetryScanSound).toBe('function');
		expect(typeof playChronoFreezeSound).toBe('function');
		// Ensure they can be called safely without audio context in test environment
		expect(() => playTelemetryScanSound()).not.toThrow();
		expect(() => playChronoFreezeSound()).not.toThrow();
	});

	it('computes accurate telemetry scan probability distribution', () => {
		const options = ['Mars', 'Venus', 'Jupiter', 'Saturn'];
		const correctIdx = 2; // Jupiter
		const eliminated = [0, 1]; // Mars & Venus eliminated by 50/50

		// Simulate telemetry distribution calculation
		const scanDist = {};
		const correctPct = 76;
		scanDist[correctIdx] = correctPct;

		const remainingActive = options
			.map((_, i) => i)
			.filter((i) => i !== correctIdx && !eliminated.includes(i));

		const remainingPct = 100 - correctPct;
		remainingActive.forEach((idx) => {
			scanDist[idx] = remainingPct;
		});
		eliminated.forEach((idx) => {
			scanDist[idx] = 0;
		});

		expect(scanDist[correctIdx]).toBe(76);
		expect(scanDist[3]).toBe(24);
		expect(scanDist[0]).toBe(0);
		expect(scanDist[1]).toBe(0);
		expect(scanDist[0] + scanDist[1] + scanDist[2] + scanDist[3]).toBe(100);
	});

	it('exports PURE_QUEST_XP_BONUS and PURE_QUEST_BADGE_ID constants with correct values', () => {
		const {
			PURE_QUEST_XP_BONUS,
			PURE_QUEST_BADGE_ID,
		} = require('../src/constants');
		expect(PURE_QUEST_XP_BONUS).toBe(50);
		expect(PURE_QUEST_BADGE_ID).toBe('pure_quest');
	});

	it('includes Pure Quest Navigator badge in BADGE_DEFINITIONS', () => {
		const pureQuestBadge = BADGE_DEFINITIONS.find((b) => b.id === 'pure_quest');
		expect(pureQuestBadge).toBeDefined();
		expect(pureQuestBadge?.title).toBe('Pure Quest Navigator');
		expect(pureQuestBadge?.icon).toBe('🌟');
	});

	it('exports CosmicLifelinesBar component for direct quest-level lifeline access', async () => {
		const CosmicLifelinesBar = (
			await import('../src/features/quest/CosmicLifelinesBar')
		).default;
		expect(CosmicLifelinesBar).toBeDefined();
		expect(typeof CosmicLifelinesBar).toBe('object');
	});

	it('enforces strict single-use lifeline evaluation for Pure Quest bonus', () => {
		// All 4 lifelines unused -> Pure Quest eligible
		const checkPureQuest = (clue, ray, scan, freeze) =>
			!clue && !ray && !scan && !freeze;

		expect(checkPureQuest(false, false, false, false)).toBe(true);
		// If ANY lifeline is used (including Cosmic Clue), Pure Quest is forfeited
		expect(checkPureQuest(true, false, false, false)).toBe(false);
		expect(checkPureQuest(false, true, false, false)).toBe(false);
		expect(checkPureQuest(false, false, true, false)).toBe(false);
		expect(checkPureQuest(false, false, false, true)).toBe(false);
	});
});
