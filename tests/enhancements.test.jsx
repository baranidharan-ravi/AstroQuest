import { beforeEach, describe, expect, it } from 'vitest';
import {
	ACCESSIBILITY_SETTINGS_STORAGE_KEY,
	ANOMALIES_VAULT_STORAGE_KEY,
	CELESTIAL_IMAGE_CATALOG,
	COSMIC_LANGUAGES,
	CURRICULUM_STANDARDS,
} from '../src/constants';
import {
	clearAnomaliesVault,
	getAnomalies,
	getUnresolvedAnomaliesCount,
	recordAnomaly,
	recordAnomalyMastery,
} from '../src/utils/anomaliesManager';
import {
	getStoredAccessibilitySettings,
	setStoredAccessibilitySettings,
} from '../src/utils/audioSynthesis';
import {
	findMatchingCelestialImage,
	generateExpeditionCampaign,
} from '../src/services/aiGenerator';
import {
	generateQrDataUrl,
	getMatchingStandardsForSkill,
} from '../src/utils/worksheetGenerator';

describe('AstroQuest Enhancements Suite (Ideas 3, 5, 6)', () => {
	beforeEach(() => {
		const store = new Map();
		globalThis.localStorage = {
			getItem: (key) => store.get(key) || null,
			setItem: (key, val) => store.set(key, String(val)),
			removeItem: (key) => store.delete(key),
			clear: () => store.clear(),
		};
		clearAnomaliesVault();
	});

	it('exports valid centralized constants for languages, standards, and celestial catalog', () => {
		expect(ANOMALIES_VAULT_STORAGE_KEY).toBe('astroquest_anomalies_vault_v1');
		expect(ACCESSIBILITY_SETTINGS_STORAGE_KEY).toBe('astroquest_accessibility_v1');

		// Check supported languages
		expect(COSMIC_LANGUAGES.length).toBeGreaterThanOrEqual(7);
		const codes = COSMIC_LANGUAGES.map((l) => l.code);
		expect(codes).toContain('en-US');
		expect(codes).toContain('es-ES');
		expect(codes).toContain('fr-FR');
		expect(codes).toContain('de-DE');
		expect(codes).toContain('hi-IN');
		expect(codes).toContain('ta-IN');
		expect(codes).toContain('ja-JP');

		// Check curriculum standards
		expect(CURRICULUM_STANDARDS.ngss.length).toBeGreaterThanOrEqual(4);
		expect(CURRICULUM_STANDARDS.ccssMath.length).toBeGreaterThanOrEqual(4);

		// Check celestial catalog
		expect(CELESTIAL_IMAGE_CATALOG.length).toBeGreaterThanOrEqual(4);
		expect(CELESTIAL_IMAGE_CATALOG[0].source).toContain('NASA');
	});

	it('generates dynamic Scan-to-Play QR data URLs and matches curriculum standards for worksheets', async () => {
		const testUrl = 'https://astroquest.app/?skill=Astronomy&age=6';
		const qrDataUrl = await generateQrDataUrl(testUrl);
		expect(qrDataUrl).toBeDefined();
		expect(typeof qrDataUrl).toBe('string');
		expect(qrDataUrl.startsWith('data:image/png;base64,')).toBe(true);

		const astronomyStandards = getMatchingStandardsForSkill('astronomy');
		expect(astronomyStandards.length).toBeGreaterThanOrEqual(1);
		expect(astronomyStandards.some((s) => s.code.includes('NGSS'))).toBe(true);

		const fractionStandards = getMatchingStandardsForSkill('fractions and crystals');
		expect(fractionStandards.some((s) => s.code.includes('CCSS.MATH'))).toBe(true);
	});

	it('manages the Spaced-Repetition Anomalies Vault with progressive mastery resolution', () => {
		expect(getUnresolvedAnomaliesCount()).toBe(0);

		const testQ = {
			id: 'test_q_1',
			questionText: 'Which planet has rings of shimmering ice?',
			options: [
				{ id: 'A', text: 'Saturn' },
				{ id: 'B', text: 'Mercury' },
			],
			correctAnswerId: 'A',
			solutionText: 'Saturn is famous for its extensive, bright ring system.',
			skillName: 'Solar Planets',
		};

		// Record an anomaly
		recordAnomaly(testQ, 'incorrect');
		expect(getUnresolvedAnomaliesCount()).toBe(1);

		const items = getAnomalies();
		expect(items[0].questionText).toContain('rings');
		expect(items[0].masteryLevel).toBe(0);

		// First mastery pass (Level 1)
		const firstPass = recordAnomalyMastery('test_q_1');
		expect(firstPass.resolved).toBe(false);
		expect(firstPass.bonusXp).toBe(10);
		expect(getUnresolvedAnomaliesCount()).toBe(1);

		// Second mastery pass (Level 2 -> permanently resolved!)
		const secondPass = recordAnomalyMastery('test_q_1');
		expect(secondPass.resolved).toBe(true);
		expect(secondPass.bonusXp).toBe(25);
		expect(getUnresolvedAnomaliesCount()).toBe(0);
	});

	it('persists and restores neuro-inclusive accessibility preferences', () => {
		const initial = getStoredAccessibilitySettings();
		expect(initial.language).toBe('en-US');
		expect(initial.dyslexicFont).toBe(false);

		setStoredAccessibilitySettings({
			language: 'es-ES',
			dyslexicFont: true,
			highContrastOled: true,
			sensoryAudio: true,
		});

		const updated = getStoredAccessibilitySettings();
		expect(updated.language).toBe('es-ES');
		expect(updated.dyslexicFont).toBe(true);
		expect(updated.highContrastOled).toBe(true);
		expect(updated.sensoryAudio).toBe(true);
	});

	it('matches real NASA celestial imagery and generates 5-stage space expeditions', async () => {
		const match = findMatchingCelestialImage('Tell me about the Pillars of Creation in the Eagle Nebula');
		expect(match).not.toBeNull();
		expect(match.title).toContain('Pillars of Creation');

		const campaign = await generateExpeditionCampaign({ theme: 'Europa Submersible', kidAge: 7 });
		expect(campaign).toHaveLength(5);
		expect(campaign[0].isExpedition).toBe(true);
		expect(campaign[0].expeditionStage).toBe(1);
		expect(campaign[4].expeditionStage).toBe(5);
	});
});
