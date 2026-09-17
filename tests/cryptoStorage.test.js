import { describe, expect, it } from 'vitest';
import { decryptPayload, encryptPayload } from '../src/utils/cryptoStorage';

describe('CryptoStorage Vault Security', () => {
	it('encrypts and decrypts sensitive strings accurately (round-trip)', () => {
		const originalKey = 'AIzaSyA_TestKey_1234567890_CosmicVault';
		const encrypted = encryptPayload(originalKey);

		expect(encrypted).not.toBe(originalKey);
		expect(encrypted.startsWith('enc:v1:')).toBe(true);

		const decrypted = decryptPayload(encrypted);
		expect(decrypted).toBe(originalKey);
	});

	it('gracefully handles empty, invalid, or null inputs', () => {
		expect(encryptPayload('')).toBe('');
		expect(encryptPayload(null)).toBe('');
		expect(decryptPayload('')).toBe('');
		expect(decryptPayload(null)).toBe('');
		expect(decryptPayload('plain-unencrypted-text')).toBe(
			'plain-unencrypted-text',
		);
	});
});
