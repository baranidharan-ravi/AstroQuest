import { beforeEach, describe, expect, it } from 'vitest';
import { PET_ACCESSORIES } from '../src/constants';
import PetWardrobeModal, {
	getStoredWardrobeState,
	saveStoredWardrobeState,
} from '../src/features/companion/PetWardrobeModal';

describe('Cosmo Pet Wardrobe & Accessories System', () => {
	beforeEach(() => {
		const store = new Map();
		globalThis.localStorage = {
			getItem: (key) => store.get(key) || null,
			setItem: (key, val) => store.set(key, String(val)),
			removeItem: (key) => store.delete(key),
			clear: () => store.clear(),
		};
	});

	it('exports a valid React component for PetWardrobeModal', () => {
		expect(PetWardrobeModal).toBeDefined();
		expect(typeof PetWardrobeModal).toBe('object');
	});

	it('defines comprehensive accessories across visor, suit, and trail slots', () => {
		expect(PET_ACCESSORIES.visor).toBeDefined();
		expect(PET_ACCESSORIES.suit).toBeDefined();
		expect(PET_ACCESSORIES.trail).toBeDefined();

		expect(PET_ACCESSORIES.visor.length).toBeGreaterThanOrEqual(4);
		expect(PET_ACCESSORIES.suit.length).toBeGreaterThanOrEqual(4);
		expect(PET_ACCESSORIES.trail.length).toBeGreaterThanOrEqual(4);

		['visor', 'suit', 'trail'].forEach((category) => {
			PET_ACCESSORIES[category].forEach((item) => {
				expect(item.id).toBeTruthy();
				expect(item.name).toBeTruthy();
				expect(item.category).toBe(category);
				expect(typeof item.starsCost).toBe('number');
				expect(item.icon).toBeTruthy();
				expect(item.badge).toBeTruthy();
				expect(item.glowColor).toBeTruthy();
			});
		});
	});

	it('ensures each slot provides a free default accessory', () => {
		expect(
			PET_ACCESSORIES.visor.some(
				(item) => item.starsCost === 0 && item.id === 'none',
			),
		).toBe(true);
		expect(
			PET_ACCESSORIES.suit.some(
				(item) => item.starsCost === 0 && item.id === 'standard',
			),
		).toBe(true);
		expect(
			PET_ACCESSORIES.trail.some(
				(item) => item.starsCost === 0 && item.id === 'none',
			),
		).toBe(true);
	});

	it('manages wardrobe state persistence and equipping properly', () => {
		const defaultState = getStoredWardrobeState();
		expect(defaultState.equipped.visor).toBe('none');
		expect(defaultState.equipped.suit).toBe('standard');
		expect(defaultState.equipped.trail).toBe('none');
		expect(defaultState.unlocked).toContain('none');
		expect(defaultState.unlocked).toContain('standard');

		// Equip cyber goggles and starlight glitter trail
		const nextState = {
			equipped: {
				visor: 'cyber_goggles',
				suit: 'lunar_silver',
				trail: 'starlight_sparkles',
			},
			unlocked: [
				'none',
				'standard',
				'cyber_goggles',
				'lunar_silver',
				'starlight_sparkles',
			],
		};
		saveStoredWardrobeState(nextState);

		const loaded = getStoredWardrobeState();
		expect(loaded.equipped.visor).toBe('cyber_goggles');
		expect(loaded.equipped.suit).toBe('lunar_silver');
		expect(loaded.equipped.trail).toBe('starlight_sparkles');
		expect(loaded.unlocked).toContain('cyber_goggles');
	});
});
