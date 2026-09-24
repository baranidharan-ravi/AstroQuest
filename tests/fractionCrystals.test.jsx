import { describe, expect, it } from 'vitest';
import InteractiveManipulative from '../src/features/quest/InteractiveManipulative';

describe('InteractiveManipulative — Fraction Crystals', () => {
	it('exports InteractiveManipulative component cleanly', () => {
		expect(InteractiveManipulative).toBeDefined();
		expect(typeof InteractiveManipulative).toBe('object');
	});
});
