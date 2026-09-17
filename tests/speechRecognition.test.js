import { describe, expect, it } from 'vitest';
import { matchSpokenOption } from '../src/hooks/useSpeechRecognition';

describe('Speech Recognition Answer Matching', () => {
	const sampleOptions = [
		{ id: 'A', text: 'Red Circle' },
		{ id: 'B', text: 'Blue Square' },
		{ id: 'C', text: 'Golden Star' },
		{ id: 'D', text: 'Green Triangle' },
	];

	it('matches explicit letter utterances', () => {
		expect(matchSpokenOption('Option B', sampleOptions)).toBe('B');
		expect(matchSpokenOption('I choose letter C', sampleOptions)).toBe('C');
		expect(matchSpokenOption('a', sampleOptions)).toBe('A');
		expect(matchSpokenOption('choice D please', sampleOptions)).toBe('D');
	});

	it('matches ordinal numbers (first, second, third, fourth)', () => {
		expect(matchSpokenOption('the first one', sampleOptions)).toBe('A');
		expect(matchSpokenOption('second', sampleOptions)).toBe('B');
		expect(matchSpokenOption('number 3', sampleOptions)).toBe('C');
		expect(matchSpokenOption('fourth option', sampleOptions)).toBe('D');
	});

	it('matches descriptive option text', () => {
		expect(
			matchSpokenOption('I think it is the blue square', sampleOptions),
		).toBe('B');
		expect(matchSpokenOption('golden star', sampleOptions)).toBe('C');
		expect(matchSpokenOption('green triangle', sampleOptions)).toBe('D');
	});

	it('returns null for unrelated speech', () => {
		expect(matchSpokenOption('I want some cookies', sampleOptions)).toBe(null);
		expect(matchSpokenOption('', sampleOptions)).toBe(null);
	});
});
