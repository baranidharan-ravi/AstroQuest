/**
 * cryptoStorage.js
 * Client-side cryptographic storage module.
 * Encrypts sensitive keys (e.g. Google Gemini API Key) before storing in localStorage,
 * preventing plain-text exposure in DevTools Application tab.
 *
 * Implements a synchronous salted keystream vault cipher so that getters and setters
 * return real decrypted credentials instantaneously to synchronous React components,
 * while writing scrambled ciphertext payloads to localStorage.
 */

const ENCRYPTION_PREFIX = 'enc:v1:';
const VAULT_PREFIX = 'enc:v1:vault:';
const B64_PREFIX = 'enc:v1:b64:';
const VAULT_SALT = 'astroquest_cosmic_key_vault_98721';

// In-memory decrypted cache for instantaneous zero-latency reads
const memoryVault = new Map();

/**
 * Synchronous salted XOR cipher
 */
export function encryptPayload(text) {
	if (!text || typeof text !== 'string') return '';
	try {
		let xored = '';
		for (let i = 0; i < text.length; i++) {
			xored += String.fromCharCode(
				text.charCodeAt(i) ^ VAULT_SALT.charCodeAt(i % VAULT_SALT.length),
			);
		}
		return `${VAULT_PREFIX}${btoa(encodeURIComponent(xored))}`;
	} catch (err) {
		console.warn('Vault encryption fallback to b64:', err);
		return `${B64_PREFIX}${btoa(encodeURIComponent(text))}`;
	}
}

/**
 * Synchronous salted XOR decipher
 */
export function decryptPayload(cipher) {
	if (!cipher || typeof cipher !== 'string') return '';

	// Legacy unencrypted plaintext
	if (!cipher.startsWith(ENCRYPTION_PREFIX)) {
		return cipher;
	}

	// 1. Salted Vault format
	if (cipher.startsWith(VAULT_PREFIX)) {
		try {
			const b64 = cipher.slice(VAULT_PREFIX.length);
			const xored = decodeURIComponent(atob(b64));
			let result = '';
			for (let i = 0; i < xored.length; i++) {
				result += String.fromCharCode(
					xored.charCodeAt(i) ^ VAULT_SALT.charCodeAt(i % VAULT_SALT.length),
				);
			}
			return result;
		} catch (err) {
			console.warn('Vault decryption failed:', err);
			return '';
		}
	}

	// 2. Base64 format
	if (cipher.startsWith(B64_PREFIX)) {
		try {
			return decodeURIComponent(atob(cipher.slice(B64_PREFIX.length)));
		} catch (_) {
			return '';
		}
	}

	// 3. If an incompatible asynchronous hex ciphertext was saved, discard and return empty
	return '';
}

/**
 * Synchronous read from secure storage
 * Returns decrypted plaintext API key
 */
export function getSecureStorageItem(storageKey) {
	// Check in-memory cache first
	if (memoryVault.has(storageKey)) {
		const cached = memoryVault.get(storageKey);
		if (cached && !cached.startsWith(ENCRYPTION_PREFIX)) {
			return cached;
		}
	}

	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return '';

		// If it's encrypted, decrypt it
		if (raw.startsWith(ENCRYPTION_PREFIX)) {
			const decrypted = decryptPayload(raw);
			if (decrypted) {
				memoryVault.set(storageKey, decrypted);
				return decrypted;
			}
			// If decryption returned empty (e.g. incompatible previous hex string), clear broken item
			localStorage.removeItem(storageKey);
			return '';
		}

		// Legacy plaintext: migrate automatically to encrypted storage
		const encrypted = encryptPayload(raw);
		localStorage.setItem(storageKey, encrypted);
		memoryVault.set(storageKey, raw);
		return raw;
	} catch (err) {
		console.warn('Secure storage read error:', err);
		return '';
	}
}

/**
 * Synchronous write to secure storage
 * Saves encrypted ciphertext in localStorage, caches decrypted in memory
 */
export function setSecureStorageItem(storageKey, plainValue) {
	if (!plainValue) {
		memoryVault.delete(storageKey);
		try {
			localStorage.removeItem(storageKey);
		} catch (_) {}
		return;
	}

	const strVal = String(plainValue).trim();
	memoryVault.set(storageKey, strVal);

	try {
		const encrypted = encryptPayload(strVal);
		localStorage.setItem(storageKey, encrypted);
	} catch (err) {
		console.warn('Secure storage write error:', err);
	}
}

/**
 * Remove item from storage and memory
 */
export function removeSecureStorageItem(storageKey) {
	memoryVault.delete(storageKey);
	try {
		localStorage.removeItem(storageKey);
	} catch (_) {}
}
