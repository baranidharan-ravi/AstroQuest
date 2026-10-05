import { CELESTIAL_IMAGE_CATALOG } from '../../constants';
import {
	decryptPayload,
	encryptPayload,
	getSecureStorageItem,
	setSecureStorageItem,
} from '../../utils/cryptoStorage';
import apiClient from '../apiClient';

/**
 * Searches curated NASA/JWST imagery catalog for relevant celestial objects.
 */
export function findMatchingCelestialImage(text) {
	if (!text) return null;
	const lower = String(text).toLowerCase();
	return (
		CELESTIAL_IMAGE_CATALOG.find(
			(item) =>
				item.keywords.some((kw) => lower.includes(kw)) ||
				lower.includes(item.title.toLowerCase()),
		) || null
	);
}

export const AI_PROVIDERS = {
	GEMINI: 'gemini',
	OPENAI: 'openai',
	CLAUDE: 'claude',
};

export const AI_PROVIDER_INFO = {
	[AI_PROVIDERS.GEMINI]: {
		id: 'gemini',
		name: 'Google Gemini',
		company: 'Google',
		icon: '🌟',
		badge: 'Free Tier Available',
		badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
		keyStorageKey: 'thinksheet_gemini_api_key',
		modelStorageKey: 'thinksheet_selected_gemini_model_v1',
		defaultModel: 'gemini-2.5-flash',
		keyPrefixHint: 'AIza...',
		keyPortalUrl: 'https://aistudio.google.com/app/apikey',
		keyPortalName: 'Google AI Studio',
		freeNotice:
			'100% free tier available from Google AI Studio. Zero credit card required.',
	},
	[AI_PROVIDERS.OPENAI]: {
		id: 'openai',
		name: 'OpenAI (ChatGPT)',
		company: 'OpenAI',
		icon: '⚡',
		badge: 'GPT-4o & Mini',
		badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
		keyStorageKey: 'thinksheet_openai_api_key',
		modelStorageKey: 'thinksheet_selected_openai_model_v1',
		defaultModel: 'gpt-4o-mini',
		keyPrefixHint: 'sk-proj-... / sk-...',
		keyPortalUrl: 'https://platform.openai.com/api-keys',
		keyPortalName: 'OpenAI Platform',
		freeNotice:
			'Uses personal OpenAI API Key. Fast generation with GPT-4o Mini.',
	},
	[AI_PROVIDERS.CLAUDE]: {
		id: 'claude',
		name: 'Anthropic Claude',
		company: 'Anthropic',
		icon: '🧠',
		badge: 'Claude 3.5 Sonnet & Haiku',
		badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
		keyStorageKey: 'thinksheet_claude_api_key',
		modelStorageKey: 'thinksheet_selected_claude_model_v1',
		defaultModel: 'claude-3-5-haiku-20241022',
		keyPrefixHint: 'sk-ant-api03-...',
		keyPortalUrl: 'https://console.anthropic.com/settings/keys',
		keyPortalName: 'Anthropic Console',
		freeNotice:
			'Uses personal Anthropic API Key with direct client-side browser access.',
	},
};

export const ACTIVE_PROVIDER_STORAGE = 'thinksheet_active_ai_provider_v1';
export const AI_KEY_STORAGE = 'thinksheet_gemini_api_key';
export const SELECTED_MODEL_KEY = 'thinksheet_selected_gemini_model_v1';
export const SEEN_QUESTIONS_KEY = 'thinksheet_seen_question_signatures_v9';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';
export const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
export const DEFAULT_CLAUDE_MODEL = 'claude-3-5-haiku-20241022';

export function getActiveAiProvider() {
	try {
		const raw = localStorage.getItem(ACTIVE_PROVIDER_STORAGE);
		if (raw && Object.values(AI_PROVIDERS).includes(raw)) {
			return raw;
		}
	} catch (_) {}
	return AI_PROVIDERS.GEMINI;
}

export function setActiveAiProvider(provider) {
	if (!provider || !Object.values(AI_PROVIDERS).includes(provider)) return;
	try {
		localStorage.setItem(ACTIVE_PROVIDER_STORAGE, provider);
	} catch (_) {}
}

// Cached proxy availability flag
let isProxyAvailable = null;

/**
 * Checks whether the local Node.js Express proxy middleware is running on /api/health
 */
export async function checkProxyAvailability() {
	if (isProxyAvailable !== null) return isProxyAvailable;
	try {
		const res = await apiClient.get('/api/health', { skipRetry: true });
		const data = res.data;
		isProxyAvailable = data?.proxy === true;
		if (isProxyAvailable) {
			console.log(
				'🔒 [Security] Node.js Express Proxy detected! API calls are securely routed through server middleware without exposing keys in client Network tab.',
			);
		}
		return isProxyAvailable;
	} catch (_) {}
	isProxyAvailable = false;
	return false;
}

export const AVAILABLE_GEMINI_MODELS = [
	{
		id: 'gemini-3.5-flash-lite',
		name: 'Gemini 3.5 Flash Lite',
		badge: 'Recommended',
		badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
		tag: '⚡ Ultra-Fast & Lightweight',
		description:
			'Lowest latency and fastest generation time. Highly optimized for real-time question synthesis.',
	},
	{
		id: 'gemini-3.5-flash',
		name: 'Gemini 3.5 Flash',
		badge: 'Frontier',
		badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
		tag: '🧠 High Reasoning & Speed',
		description:
			'Advanced reasoning capabilities balanced with fast generation speed. Great for complex logic.',
	},
	{
		id: 'gemini-3-flash-preview',
		name: 'Gemini 3 Flash Preview',
		badge: 'Preview',
		badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
		tag: '🔮 Next-Gen Preview',
		description:
			'Experimental preview model featuring next-gen intelligence and creative puzzle synthesis.',
	},
	{
		id: 'gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		badge: 'Stable',
		badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
		tag: '🛡️ General Purpose',
		description:
			'Standard workhorse model with consistent speed and well-tested educational capabilities.',
	},
];

export const AVAILABLE_OPENAI_MODELS = [
	{
		id: 'gpt-4o-mini',
		name: 'GPT-4o Mini',
		badge: 'Recommended',
		badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
		tag: '⚡ Ultra-Fast & Cost-Effective',
		description:
			'Fastest generation, lowest latency, and excellent child-friendly question formatting.',
	},
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		badge: 'Frontier',
		badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
		tag: '🧠 Premier Multimodal Intelligence',
		description:
			'High intelligence and advanced reasoning for complex analytical and STEM logic.',
	},
	{
		id: 'o3-mini',
		name: 'o3-mini',
		badge: 'Reasoning',
		badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
		tag: '🔬 Advanced Math & Logic',
		description:
			'Next-gen reasoning model tailored for deep STEM problem-solving and puzzles.',
	},
	{
		id: 'o1-mini',
		name: 'o1-mini',
		badge: 'Logic',
		badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
		tag: '🧩 Deep Deductive Reasoning',
		description:
			'Thorough step-by-step thinking for multi-step logic riddles and analogies.',
	},
];

export const AVAILABLE_CLAUDE_MODELS = [
	{
		id: 'claude-3-5-haiku-20241022',
		name: 'Claude 3.5 Haiku',
		badge: 'Recommended',
		badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
		tag: '⚡ Lightning-Fast & Snappy',
		description:
			'Anthropic’s fastest model with superb comprehension, ideal for rapid interactive quizzes.',
	},
	{
		id: 'claude-3-5-sonnet-20241022',
		name: 'Claude 3.5 Sonnet',
		badge: 'Frontier',
		badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
		tag: '🏆 Industry-Leading Reasoning',
		description:
			'Unmatched pedagogical clarity, thoughtful explanations, and rich creative puzzles.',
	},
	{
		id: 'claude-3-opus-20240229',
		name: 'Claude 3 Opus',
		badge: 'Deep Thought',
		badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
		tag: '📚 Comprehensive Synthesis',
		description:
			'Deep analytical power for nuanced curriculum design and complex logic trees.',
	},
];

export function encryptApiKey(key) {
	if (!key || typeof key !== 'string') return '';
	const trimmed = key.replace(/^["']|["']$/g, '').trim();
	if (!trimmed) return '';
	if (trimmed.startsWith('enc:v1:')) return trimmed;
	return encryptPayload(trimmed);
}

export function decryptApiKey(cipherOrPlain) {
	if (!cipherOrPlain || typeof cipherOrPlain !== 'string') return '';
	const trimmed = cipherOrPlain.replace(/^["']|["']$/g, '').trim();
	if (!trimmed) return '';
	if (!trimmed.startsWith('enc:v1:')) return trimmed;
	return decryptPayload(trimmed);
}

export function getStoredEncryptedApiKey(provider = null) {
	const targetProvider = provider || getActiveAiProvider();
	const storageKey =
		AI_PROVIDER_INFO[targetProvider]?.keyStorageKey || AI_KEY_STORAGE;
	try {
		const raw = localStorage.getItem(storageKey);
		if (raw && typeof raw === 'string') {
			const trimmed = raw.trim();
			if (trimmed.startsWith('enc:v1:')) return trimmed;
			if (trimmed) return encryptPayload(trimmed);
		}
		if (targetProvider === AI_PROVIDERS.GEMINI) {
			const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
			if (envKey) {
				const cleaned = envKey.replace(/^["']|["']$/g, '').trim();
				if (cleaned.startsWith('enc:v1:')) return cleaned;
				if (cleaned) return encryptPayload(cleaned);
			}
		} else if (targetProvider === AI_PROVIDERS.OPENAI) {
			const envKey = import.meta.env.VITE_OPENAI_API_KEY || '';
			if (envKey) {
				const cleaned = envKey.replace(/^["']|["']$/g, '').trim();
				if (cleaned.startsWith('enc:v1:')) return cleaned;
				if (cleaned) return encryptPayload(cleaned);
			}
		} else if (targetProvider === AI_PROVIDERS.CLAUDE) {
			const envKey = import.meta.env.VITE_CLAUDE_API_KEY || '';
			if (envKey) {
				const cleaned = envKey.replace(/^["']|["']$/g, '').trim();
				if (cleaned.startsWith('enc:v1:')) return cleaned;
				if (cleaned) return encryptPayload(cleaned);
			}
		}
		return '';
	} catch (_) {
		return '';
	}
}

export function getStoredApiKey(provider = null) {
	const targetProvider = provider || getActiveAiProvider();
	const storageKey =
		AI_PROVIDER_INFO[targetProvider]?.keyStorageKey || AI_KEY_STORAGE;
	let key = getSecureStorageItem(storageKey);

	if (!key || key.startsWith('enc:v1:')) {
		if (targetProvider === AI_PROVIDERS.GEMINI) {
			key = import.meta.env.VITE_GEMINI_API_KEY || '';
		} else if (targetProvider === AI_PROVIDERS.OPENAI) {
			key = import.meta.env.VITE_OPENAI_API_KEY || '';
		} else if (targetProvider === AI_PROVIDERS.CLAUDE) {
			key = import.meta.env.VITE_CLAUDE_API_KEY || '';
		}
	}

	if (typeof key === 'string') {
		key = key.replace(/^["']|["']$/g, '').trim();
	}

	// Defensive check: NEVER return encrypted ciphertext as a usable API key!
	if (key?.startsWith('enc:v1:')) {
		return decryptApiKey(key);
	}

	return key || '';
}

export function setStoredApiKey(key, provider = null) {
	const targetProvider = provider || getActiveAiProvider();
	const storageKey =
		AI_PROVIDER_INFO[targetProvider]?.keyStorageKey || AI_KEY_STORAGE;
	if (key) {
		const cleaned = decryptApiKey(key)
			.replace(/^["']|["']$/g, '')
			.trim();
		setSecureStorageItem(storageKey, cleaned);
	} else {
		localStorage.removeItem(storageKey);
	}
}

export const DYNAMIC_MODELS_STORAGE_KEY = 'thinksheet_dynamic_gemini_models_v1';
export const DYNAMIC_MODELS_TIMESTAMP_KEY =
	'thinksheet_dynamic_gemini_models_timestamp_v1';
export const RATE_LIMITED_MODELS_STORAGE_KEY =
	'thinksheet_rate_limited_models_v1';

// In-memory set of rate-limited/exhausted models for current session
const inMemoryRateLimitedModels = new Set();

/**
 * Detect quota exhaustion / rate limit / resource exhausted errors (HTTP 429 / 503)
 */
export function isResourceExhausted(status, errorPayload, errorText = '') {
	if (status === 429 || status === 503) return true;
	const text =
		`${JSON.stringify(errorPayload || {})} ${errorText}`.toUpperCase();
	return (
		text.includes('RESOURCE_EXHAUSTED') ||
		text.includes('QUOTA') ||
		text.includes('RATE_LIMIT') ||
		text.includes('LIMIT EXCEEDED') ||
		text.includes('BILLING')
	);
}

/**
 * Marks a model as rate-limited/quota-exhausted for the current session
 */
export function markModelRateLimited(modelId) {
	if (!modelId) return;
	const clean = modelId.replace(/^models\//, '').trim();
	inMemoryRateLimitedModels.add(clean);
	try {
		const raw = sessionStorage.getItem(RATE_LIMITED_MODELS_STORAGE_KEY);
		const list = raw ? JSON.parse(raw) : [];
		if (!list.includes(clean)) {
			list.push(clean);
			sessionStorage.setItem(
				RATE_LIMITED_MODELS_STORAGE_KEY,
				JSON.stringify(list),
			);
		}
	} catch {}
}

/**
 * Checks if a model is currently marked as rate-limited or quota-exhausted
 */
export function isModelRateLimited(modelId) {
	if (!modelId) return false;
	const clean = modelId.replace(/^models\//, '').trim();
	if (inMemoryRateLimitedModels.has(clean)) return true;
	try {
		const raw = sessionStorage.getItem(RATE_LIMITED_MODELS_STORAGE_KEY);
		if (raw) {
			const list = JSON.parse(raw);
			return Array.isArray(list) && list.includes(clean);
		}
	} catch {}
	return false;
}

/**
 * Clears the rate-limited model cache
 */
export function clearRateLimitedModels() {
	inMemoryRateLimitedModels.clear();
	try {
		sessionStorage.removeItem(RATE_LIMITED_MODELS_STORAGE_KEY);
	} catch {}
}

/**
 * Computes a numeric ranking score for a Gemini model ID.
 * Higher score = newer version and better suited for real-time quiz generation.
 */
export function getModelScore(modelId) {
	const id = (modelId || '').toLowerCase().replace(/^models\//, '');

	if (isModelRateLimited(id) || id === 'gemini-3.8-flash') {
		return -10000;
	}

	const versionMatch = id.match(/gemini-(\d+(?:\.\d+)?)/);
	const version = versionMatch ? parseFloat(versionMatch[1]) : 1.0;

	let typeScore = 0;
	if (id.includes('flash-lite') || id.includes('lite')) {
		typeScore = 500;
	} else if (id.includes('flash')) {
		typeScore = 200;
	} else if (id.includes('pro')) {
		typeScore = 50;
	}

	let modifier = 0;
	if (id.includes('exp') || id.includes('preview')) {
		modifier -= 100;
	}

	if (version > 3.5 && !id.includes('lite')) {
		modifier -= 300;
	}

	return version * 1000 + typeScore + modifier;
}

export function hasCachedGeminiModels() {
	try {
		const saved = localStorage.getItem(DYNAMIC_MODELS_STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed) && parsed.length > 0) {
				return true;
			}
		}
	} catch {}
	return false;
}

export function getCachedGeminiModelsTimestamp() {
	try {
		const ts = localStorage.getItem(DYNAMIC_MODELS_TIMESTAMP_KEY);
		return ts ? Number.parseInt(ts, 10) : null;
	} catch {
		return null;
	}
}

export function getLatestGeminiModel(modelsList) {
	const list =
		modelsList && Array.isArray(modelsList) && modelsList.length > 0 ?
			modelsList
		:	getAvailableGeminiModels();
	if (!Array.isArray(list) || list.length === 0) {
		return AVAILABLE_GEMINI_MODELS[0];
	}

	const healthy = list.filter((m) => !isModelRateLimited(m.id));
	const candidates = healthy.length > 0 ? healthy : list;

	const sorted = [...candidates].sort(
		(a, b) => getModelScore(b.id) - getModelScore(a.id),
	);
	return sorted[0];
}

export function getAvailableGeminiModels() {
	try {
		const saved = localStorage.getItem(DYNAMIC_MODELS_STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed) && parsed.length > 0) {
				return [...parsed].sort(
					(a, b) => getModelScore(b.id) - getModelScore(a.id),
				);
			}
		}
	} catch {}
	return [...AVAILABLE_GEMINI_MODELS].sort(
		(a, b) => getModelScore(b.id) - getModelScore(a.id),
	);
}

export async function fetchOnlineGeminiModels(apiKey) {
	const rawTarget = apiKey || getStoredApiKey() || '';
	const cleanedKey = decryptApiKey(rawTarget).trim();
	if (!cleanedKey) {
		throw new Error(
			'Please enter a Gemini API key first to fetch available models.',
		);
	}

	const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanedKey)}`;

	let response;
	try {
		response = await apiClient.get(url);
	} catch (err) {
		const status = err.response?.status || 500;
		const errMsg = err.response?.data?.error?.message || err.message;
		throw new Error(`Failed to fetch models (${status}): ${errMsg}`);
	}

	const data = response.data;
	if (!data.models || !Array.isArray(data.models)) {
		throw new Error('No models found in API response.');
	}

	const filtered = data.models
		.filter((m) => {
			const id = (m.name || '').replace(/^models\//, '');
			const methods = m.supportedGenerationMethods || [];
			return (
				methods.includes('generateContent') &&
				id.toLowerCase().includes('gemini') &&
				!id.includes('embedding') &&
				!id.includes('aqa') &&
				!id.includes('imagen') &&
				!id.includes('computer-use')
			);
		})
		.map((m) => {
			const id = m.name.replace(/^models\//, '');
			const isFlash = id.includes('flash');
			const isPro = id.includes('pro');
			const isLite = id.includes('lite');
			const isPreview = id.includes('preview');
			const isExperimental = id.includes('exp');

			let badge = 'Active';
			let badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';
			let tag = '🤖 Gemini Model';

			if (isLite) {
				badge = 'Lightweight';
				badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
				tag = '⚡ Ultra-Fast & Efficient';
			} else if (isPreview || isExperimental) {
				badge = 'Preview';
				badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-400/40';
				tag = '🔮 Next-Gen Intelligence';
			} else if (isFlash) {
				badge = 'Fast';
				badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-400/40';
				tag = '🚀 High Speed & Reasoning';
			} else if (isPro) {
				badge = 'Frontier';
				badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40';
				tag = '🧠 Deep Cognitive Reasoning';
			}

			return {
				id,
				name: m.displayName || id,
				badge,
				badgeColor,
				tag,
				description:
					m.description ||
					`Google Gemini ${id} model for real-time pedagogical generation.`,
			};
		});

	if (filtered.length === 0) {
		throw new Error('No compatible Gemini content generation models found.');
	}

	filtered.sort((a, b) => getModelScore(b.id) - getModelScore(a.id));

	if (filtered.length > 0) {
		filtered[0].badge = 'Latest Default';
		filtered[0].badgeColor =
			'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
		filtered[0].tag = '🌟 Latest Google AI Model';
	}

	try {
		localStorage.setItem(DYNAMIC_MODELS_STORAGE_KEY, JSON.stringify(filtered));
		localStorage.setItem(DYNAMIC_MODELS_TIMESTAMP_KEY, Date.now().toString());
	} catch (e) {
		console.warn('Could not cache models in localStorage', e);
	}

	return filtered;
}

export function getStoredSelectedModel(provider = null) {
	const targetProvider = provider || getActiveAiProvider();
	const storageKey =
		AI_PROVIDER_INFO[targetProvider]?.modelStorageKey || SELECTED_MODEL_KEY;
	const defaultModel =
		AI_PROVIDER_INFO[targetProvider]?.defaultModel || DEFAULT_GEMINI_MODEL;

	try {
		const saved = localStorage.getItem(storageKey);
		if (targetProvider === AI_PROVIDERS.OPENAI) {
			if (saved && AVAILABLE_OPENAI_MODELS.some((m) => m.id === saved)) {
				return saved;
			}
			return DEFAULT_OPENAI_MODEL;
		}

		if (targetProvider === AI_PROVIDERS.CLAUDE) {
			if (saved && AVAILABLE_CLAUDE_MODELS.some((m) => m.id === saved)) {
				return saved;
			}
			return DEFAULT_CLAUDE_MODEL;
		}

		// Gemini
		const available = getAvailableGeminiModels();
		if (
			saved &&
			saved !== 'gemini-3.8-flash' &&
			available.some((m) => m.id === saved) &&
			!isModelRateLimited(saved)
		) {
			return saved;
		}
		const latest = getLatestGeminiModel(available);
		if (latest?.id) {
			return latest.id;
		}
	} catch {}
	return defaultModel;
}

export function setStoredSelectedModel(modelId, provider = null) {
	const targetProvider = provider || getActiveAiProvider();
	const storageKey =
		AI_PROVIDER_INFO[targetProvider]?.modelStorageKey || SELECTED_MODEL_KEY;
	try {
		if (modelId) {
			localStorage.setItem(storageKey, String(modelId).trim());
		}
	} catch (err) {
		console.warn(`Could not save selected model for ${targetProvider}`, err);
	}
}

export function getAvailableModels(provider = null) {
	const targetProvider = provider || getActiveAiProvider();
	if (targetProvider === AI_PROVIDERS.OPENAI) {
		return AVAILABLE_OPENAI_MODELS;
	}
	if (targetProvider === AI_PROVIDERS.CLAUDE) {
		return AVAILABLE_CLAUDE_MODELS;
	}
	return getAvailableGeminiModels();
}

export function getSeenSignatures() {
	try {
		const raw = localStorage.getItem(SEEN_QUESTIONS_KEY);
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
}

export function saveSeenSignatures(seenSet) {
	try {
		const arr = Array.from(seenSet).slice(-600);
		localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(arr));
	} catch (err) {
		console.warn('Could not save seen signatures', err);
	}
}

export {
	callClaudeApi,
	callGeminiApi,
	callOpenAiApi,
	validateApiKey,
	validateClaudeApiKey,
	validateGeminiApiKey,
	validateOpenAiApiKey,
} from './aiClientCallers';
