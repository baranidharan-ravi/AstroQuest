import { describe, expect, it } from 'vitest';
import QuestScratchpad from '../src/features/quest/QuestScratchpad';

describe('QuestScratchpad Component', () => {
	it('exports a valid React component', () => {
		expect(QuestScratchpad).toBeDefined();
		expect(typeof QuestScratchpad).toBe('object'); // React.memo component
	});
});
