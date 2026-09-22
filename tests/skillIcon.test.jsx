import { describe, expect, it } from 'vitest';
import { POPULAR_ICONS } from '../src/constants';
import { ICON_MAP, SkillIcon } from '../src/utils/SkillIcon';

describe('SkillIcon Component & Constants', () => {
	it('defines at least 20 curated vector font icons in POPULAR_ICONS', () => {
		expect(POPULAR_ICONS.length).toBeGreaterThanOrEqual(20);
		POPULAR_ICONS.forEach((item) => {
			expect(item.id).toBeTruthy();
			expect(item.label).toBeTruthy();
			// Each item id should resolve to a valid Lucide icon component in ICON_MAP
			expect(ICON_MAP[item.id]).toBeDefined();
		});
	});

	it('maps legacy educational emojis to corresponding Lucide vector icons', () => {
		const emojis = [
			'🚀',
			'🪐',
			'🧠',
			'👁️',
			'🔬',
			'📐',
			'🌿',
			'⭐',
			'🧩',
			'🎨',
			'📚',
			'⚡',
			'💡',
			'🐾',
			'🎯',
			'🔢',
			'🤖',
			'🌍',
			'🧪',
		];
		emojis.forEach((emoji) => {
			expect(ICON_MAP[emoji]).toBeDefined();
		});
	});

	it('renders as a valid React component function', () => {
		expect(typeof SkillIcon).toBe('object'); // React.memo component
	});
});
