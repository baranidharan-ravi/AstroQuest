import { beforeEach, describe, expect, it } from 'vitest';
import {
	HABITAT_MODULES,
	HABITAT_STORAGE_KEY,
} from '../src/constants';
import CosmicHabitatModal, {
	getStoredHabitatModules,
	saveStoredHabitatModules,
} from '../src/features/dashboard/CosmicHabitatModal';

describe('Cosmic Habitat & Modular Space Base', () => {
	beforeEach(() => {
		const store = new Map();
		globalThis.localStorage = {
			getItem: (key) => store.get(key) || null,
			setItem: (key, val) => store.set(key, String(val)),
			removeItem: (key) => store.delete(key),
			clear: () => store.clear(),
		};
	});

	it('exports a valid React component for CosmicHabitatModal', () => {
		expect(CosmicHabitatModal).toBeDefined();
		expect(typeof CosmicHabitatModal).toBe('object');
	});

	it('contains all curated habitat modules with valid telemetry specs', () => {
		expect(HABITAT_MODULES.length).toBeGreaterThanOrEqual(6);

		HABITAT_MODULES.forEach((mod) => {
			expect(mod.id).toBeTruthy();
			expect(mod.name).toBeTruthy();
			expect(mod.tagline).toBeTruthy();
			expect(mod.category).toBeTruthy();
			expect(typeof mod.starsCost).toBe('number');
			expect(mod.icon).toBeTruthy();
			expect(mod.perk).toBeTruthy();
			expect(mod.statType).toBeTruthy();
			expect(typeof mod.statValue).toBe('number');
		});
	});

	it('ensures the starter bio-dome module is cost-free (0 stars)', () => {
		const starter = HABITAT_MODULES.find((m) => m.id === 'hydroponic_dome');
		expect(starter).toBeDefined();
		expect(starter.starsCost).toBe(0);
	});

	it('handles storage persistence for unlocked modules', () => {
		// Defaults to starter module
		const initial = getStoredHabitatModules();
		expect(initial).toContain('hydroponic_dome');

		// Save new module
		const updated = ['hydroponic_dome', 'solar_matrix', 'comm_dish'];
		saveStoredHabitatModules(updated);

		const retrieved = getStoredHabitatModules();
		expect(retrieved).toEqual(updated);
		expect(retrieved.length).toBe(3);
	});
});
