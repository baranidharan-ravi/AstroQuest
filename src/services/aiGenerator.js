import {
	decryptPayload,
	encryptPayload,
	getSecureStorageItem,
	setSecureStorageItem,
} from '../utils/cryptoStorage';
import {
	extractShapeSequenceTerms,
	hasShapeOrVisualConcept,
	parseMatrixGridFromQuestion,
	parseRotationSequence,
	parseStepShapeCountSequence,
} from '../utils/shapeGenerator';
import { getSkillDefinition } from '../utils/skillManager';
import { isDiagramAppropriateForQuestion } from '../utils/VisualDiagrams';
import apiClient from './apiClient';

const AI_KEY_STORAGE = 'thinksheet_gemini_api_key';
const SELECTED_MODEL_KEY = 'thinksheet_selected_gemini_model_v1';
const SEEN_QUESTIONS_KEY = 'thinksheet_seen_question_signatures_v9';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';

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

export function getStoredEncryptedApiKey() {
	try {
		const raw = localStorage.getItem(AI_KEY_STORAGE);
		if (raw && typeof raw === 'string') {
			const trimmed = raw.trim();
			if (trimmed.startsWith('enc:v1:')) return trimmed;
			if (trimmed) return encryptPayload(trimmed);
		}
		const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
		if (envKey) {
			const cleaned = envKey.replace(/^["']|["']$/g, '').trim();
			if (cleaned.startsWith('enc:v1:')) return cleaned;
			if (cleaned) return encryptPayload(cleaned);
		}
		return '';
	} catch (_) {
		return '';
	}
}

export function getStoredApiKey() {
	let key = getSecureStorageItem(AI_KEY_STORAGE);
	if (!key || key.startsWith('enc:v1:')) {
		key = import.meta.env.VITE_GEMINI_API_KEY || '';
	}

	if (typeof key === 'string') {
		key = key.replace(/^["']|["']$/g, '').trim();
	}

	// Defensive check: NEVER return encrypted ciphertext as a usable API key!
	if (key.startsWith('enc:v1:')) {
		return decryptApiKey(key);
	}

	return key;
}

export function setStoredApiKey(key) {
	if (key) {
		const cleaned = decryptApiKey(key)
			.replace(/^["']|["']$/g, '')
			.trim();
		setSecureStorageItem(AI_KEY_STORAGE, cleaned);
	} else {
		localStorage.removeItem(AI_KEY_STORAGE);
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

	// Heavily penalize models that currently have exhausted quota (HTTP 429) or unreleased rate-limited previews
	if (isModelRateLimited(id) || id === 'gemini-3.8-flash') {
		return -10000;
	}

	// Extract version number: e.g. "gemini-3.5-flash-lite" -> 3.5, "gemini-3-flash-preview" -> 3.0, "gemini-2.5-flash" -> 2.5
	const versionMatch = id.match(/gemini-(\d+(?:\.\d+)?)/);
	const version = versionMatch ? parseFloat(versionMatch[1]) : 1.0;

	// Variant scoring: flash-lite is ultra-fast & has high quota for real-time educational quizzes
	let typeScore = 0;
	if (id.includes('flash-lite') || id.includes('lite')) {
		typeScore = 500; // Strong boost: high RPM quota & lowest generation latency
	} else if (id.includes('flash')) {
		typeScore = 200;
	} else if (id.includes('pro')) {
		typeScore = 50;
	}

	// Penalize experimental/preview variants that often have zero/strict free-tier quota
	let modifier = 0;
	if (id.includes('exp') || id.includes('preview')) {
		modifier -= 100;
	}

	// Any unverified high-version models above 3.5 that are NOT flash-lite should not supersede proven models
	if (version > 3.5 && !id.includes('lite')) {
		modifier -= 300;
	}

	return version * 1000 + typeScore + modifier;
}

/**
 * Returns true if dynamic models have already been fetched and cached in localStorage
 */
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

/**
 * Returns the cached timestamp or null
 */
export function getCachedGeminiModelsTimestamp() {
	try {
		const ts = localStorage.getItem(DYNAMIC_MODELS_TIMESTAMP_KEY);
		return ts ? parseInt(ts, 10) : null;
	} catch {
		return null;
	}
}

/**
 * Finds and returns the latest / highest-scoring healthy Gemini model from a list
 */
export function getLatestGeminiModel(modelsList) {
	const list =
		modelsList && Array.isArray(modelsList) && modelsList.length > 0 ?
			modelsList
		:	getAvailableGeminiModels();
	if (!Array.isArray(list) || list.length === 0) {
		return AVAILABLE_GEMINI_MODELS[0];
	}

	// Prefer non-rate-limited models first
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

/**
 * Fetches the latest available Gemini models live from Google's Gemini API
 */
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

	// Filter for generative Gemini models supporting generateContent
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

	// Sort models so the latest and best models appear first
	filtered.sort((a, b) => getModelScore(b.id) - getModelScore(a.id));

	// Mark the very latest model as the recommended/latest default
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

export function getStoredSelectedModel() {
	try {
		const saved = localStorage.getItem(SELECTED_MODEL_KEY);
		const available = getAvailableGeminiModels();
		// If saved model exists and is NOT currently rate-limited, use it
		if (
			saved &&
			saved !== 'gemini-3.8-flash' &&
			available.some((m) => m.id === saved) &&
			!isModelRateLimited(saved)
		) {
			return saved;
		}
		// If no model is saved or saved model is rate-limited, default to the latest healthy model
		const latest = getLatestGeminiModel(available);
		if (latest && latest.id) {
			return latest.id;
		}
	} catch {}
	return DEFAULT_GEMINI_MODEL;
}

export function setStoredSelectedModel(modelId) {
	try {
		if (modelId) {
			localStorage.setItem(SELECTED_MODEL_KEY, modelId);
		}
	} catch (err) {
		console.warn('Could not save selected Gemini model', err);
	}
}

function getSeenSignatures() {
	try {
		const raw = localStorage.getItem(SEEN_QUESTIONS_KEY);
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
}

function saveSeenSignatures(seenSet) {
	try {
		const arr = Array.from(seenSet).slice(-600);
		localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(arr));
	} catch (err) {
		console.warn('Could not save seen signatures', err);
	}
}

/**
 * Explicit Skillset Definitions, Pedagogical Descriptions, and Distinct Batch Domains
 */
export const SKILL_DEFINITIONS = {
	Visual: {
		title: 'Visual Observation & Spatial Reasoning',
		description:
			'Visual observation, recognizing geometric and color pattern progressions, spatial rotations, object counting and arithmetic groupings, missing grid tiles, 3D isometric block projections, and balance scale weight logic.',
		coreObjective:
			'The student must observe, count, compare, or deduce patterns and spatial relationships from visual descriptions or diagram representations.',
		batch1Domain:
			'Batch 1 Focus: (1) Shape & color pattern progressions (e.g. AB, AAB, ABC sequences or number progressions), (2) Missing grid tile matrix deduction, (3) Balance scale weight logic.',
		batch2Domain:
			'Batch 2 Focus: (1) Object counting & arithmetic grouping puzzles, (2) 3D isometric block tower heights & volumes, (3) Spatial reflections, symmetry, or rotations.',
	},
	'Analytical Thinking': {
		title: 'Analytical Thinking & Logical Deduction',
		description:
			'Logical deduction, relational analogies (A : B :: C : D), everyday cause-and-effect science & nature riddles, categorical classification (odd-one-out), deductive logic clues, syllogisms, and multi-step critical thinking.',
		coreObjective:
			'The student must analyze relationships, deduce outcomes from logical rules, connect concepts through analogies, or classify items based on defined properties.',
		batch1Domain:
			'Batch 1 Focus: (1) Relational & functional analogies (A : B :: C : D), (2) Everyday cause-and-effect science & nature riddles.',
		batch2Domain:
			'Batch 2 Focus: (1) Multi-step deductive logic clues & riddles, (2) Categorical classification (odd-one-out), (3) Sequence rules and conditional reasoning.',
	},
};

/**
 * Universal Gemini API Caller prioritizing healthy models with fast fallback on HTTP 429 rate limits
 */
async function callGeminiApi(payload, apiKey, preferredModel = null) {
	const activeSelected =
		preferredModel || getStoredSelectedModel() || DEFAULT_GEMINI_MODEL;
	const realApiKey = decryptApiKey(apiKey || getStoredApiKey());

	// 1. Check if secure Node.js Express proxy is available (Zero API key in Network tab!)
	const hasProxy = await checkProxyAvailability();
	if (hasProxy) {
		try {
			const proxyRes = await apiClient.post(
				'/api/generate-content',
				{
					model: activeSelected,
					contents: payload.contents,
					systemInstruction: payload.systemInstruction,
					generationConfig: payload.generationConfig,
				},
				{
					headers: {
						...(realApiKey ? { 'x-gemini-key': realApiKey } : {}),
					},
					skipRetry429: true,
				},
			);

			if (proxyRes.data) {
				return proxyRes.data;
			}
		} catch (proxyErr) {
			console.warn(
				'[Proxy] Connection failed, falling back to direct client call:',
				proxyErr,
			);
		}
	}

	if (!realApiKey) {
		throw new Error('MISSING_API_KEY');
	}

	const availableModels = getAvailableGeminiModels();
	const allModelIds = Array.from(
		new Set([
			...availableModels.map((m) => m.id),
			...AVAILABLE_GEMINI_MODELS.map((m) => m.id),
		]),
	);

	// Separate models into healthy vs rate-limited
	const healthyModels = allModelIds.filter(
		(m) => !isModelRateLimited(m) && m !== activeSelected,
	);
	const rateLimitedModels = allModelIds.filter(
		(m) => isModelRateLimited(m) && m !== activeSelected,
	);

	// Sequence: if activeSelected is healthy, try it first; if it's already rate-limited, try healthy models first!
	const modelsToTry =
		isModelRateLimited(activeSelected) ?
			[...healthyModels, activeSelected, ...rateLimitedModels]
		:	[activeSelected, ...healthyModels, ...rateLimitedModels];

	let lastError = null;

	for (const model of modelsToTry) {
		try {
			const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
				realApiKey,
			)}`;

			// Pass skipRetry429: true so rate limit exhaustion fails fast to the next fallback model without 7-second retry delay
			const res = await apiClient.post(url, payload, { skipRetry429: true });
			if (res.data) {
				// If a fallback model was used, auto-switch and persist it as active model
				if (model !== activeSelected) {
					console.log(
						`[Gemini API] Successfully auto-switched and saved active model to healthy fallback: "${model}" (was "${activeSelected}")`,
					);
					setStoredSelectedModel(model);
				}
				return res.data;
			}
		} catch (err) {
			const status = err.response?.status;
			const body = err.response?.data;
			const errMsg = body?.error?.message || err.message || '';
			lastError = new Error(`Model ${model} (${status || 'ERR'}): ${errMsg}`);

			if (isResourceExhausted(status, body, errMsg)) {
				markModelRateLimited(model);
				console.warn(
					`[Gemini API] Model ${model} returned HTTP ${status} (Quota / Rate Limit Exceeded). Flagged as rate-limited, immediately trying fallback model...`,
				);
			} else {
				console.warn(
					`[Gemini API] ${model} returned HTTP ${status}, trying fallback model...`,
				);
			}

			if (
				status === 400 &&
				(errMsg.toLowerCase().includes('api_key') ||
					errMsg.toLowerCase().includes('key not valid') ||
					errMsg.toLowerCase().includes('invalid api key') ||
					errMsg.toLowerCase().includes('api key expired'))
			) {
				throw new Error(
					'Invalid Gemini API Key. Please verify your key from Google AI Studio.',
				);
			}
			if (status === 403) {
				throw new Error(
					'Gemini API key access forbidden. Ensure Generative Language API is enabled.',
				);
			}

			if (
				err.message?.includes('Invalid Gemini API Key') ||
				err.message?.includes('access forbidden')
			) {
				throw err;
			}
			lastError = err;
		}
	}

	throw lastError || new Error('All Gemini API model endpoints failed.');
}

/**
 * Validates a Gemini API key by making a lightweight test ping using the selected model
 * Returns { valid: true, cleanedKey } or { valid: false, message }
 */
export async function validateGeminiApiKey(apiKey, preferredModel = null) {
	if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
		return {
			valid: false,
			message: 'Please enter your Google Gemini API Key! 🔑',
		};
	}

	const cleanedKey = apiKey.replace(/^["']|["']$/g, '').trim();
	const decryptedKey = decryptApiKey(cleanedKey);

	if (decryptedKey.length < 15) {
		return {
			valid: false,
			message:
				'Invalid API Key length. Please paste a valid key from Google AI Studio.',
		};
	}

	try {
		const payload = {
			contents: [{ parts: [{ text: 'Hello' }] }],
			generationConfig: { maxOutputTokens: 10 },
		};

		await callGeminiApi(payload, decryptedKey, preferredModel);
		return { valid: true, cleanedKey: decryptedKey };
	} catch (err) {
		console.error('API Key validation error:', err);
		return {
			valid: false,
			message:
				err.message ||
				'API key validation failed. Please check and re-enter your key from Google AI Studio.',
		};
	}
}

/**
 * Asks Gemini AI to suggest and formulate a complete, kid-friendly skillset
 * (Name, Subtitle Tagline, Pedagogical Description, Icon Emoji, and Color Theme)
 * based on user-provided rough keywords or partial input.
 */
export async function suggestSkillsetDetails({
	name = '',
	tagline = '',
	description = '',
	kidAge = 5,
	apiKey = null,
	preferredModel = null,
} = {}) {
	const realApiKey = decryptApiKey(apiKey || getStoredApiKey());
	if (!realApiKey) {
		throw new Error('MISSING_API_KEY');
	}

	const cleanName = (name || '').trim();
	const cleanTagline = (tagline || '').trim();
	const cleanDesc = (description || '').trim();

	const userContextParts = [];
	if (cleanName) userContextParts.push(`- Topic / Title hint: "${cleanName}"`);
	if (cleanTagline) userContextParts.push(`- Subtitle hint: "${cleanTagline}"`);
	if (cleanDesc) userContextParts.push(`- Concept / Description hint: "${cleanDesc}"`);

	const userContextStr =
		userContextParts.length > 0 ?
			userContextParts.join('\n')
		:	'- No specific topic provided: create an exciting, creative STEM or logic exploration topic suitable for children.';

	const promptText = `You are an expert STEM, logic, and early-childhood curriculum designer for an interactive learning app called "AstroQuest" for children aged 3 to 14.

The user is creating a new custom learning skillset. Based on the user's input below, generate a polished, highly engaging skillset definition calibrated for a ${kidAge}-year-old explorer.

User's Input:
${userContextStr}
Target Child Age: ${kidAge} years old

Guidelines:
1. "name": 2 to 4 words. Inspiring, clear, and age-appropriate (e.g. "Space & Astronomy", "Underwater Ocean Life", "Math Puzzle Quests", "Dinosaurs & Fossils", "Creative Word Riddles").
2. "tagline": 3 to 6 words. Catchy subtitle summarizing the adventure (e.g. "Planets, Stars & Cosmic Secrets" or "Fractions, Shapes & Fun Logic").
3. "description": 2 to 4 detailed sentences explaining the pedagogical concepts, questions, and problem types that Gemini AI should generate for this skill. Mention specific themes, puzzle formats, or observational tasks.
4. "icon": A single fitting emoji character (e.g. 🚀, 🪐, 🦖, 🌊, 🔢, 🌿, 🧩, 🎨, 🐾, ⚡, 💡).
5. "color": Exactly one of these allowed color keys: "emerald", "blue", "purple", "amber", "rose", "cyan".

Return ONLY a single valid raw JSON object without markdown formatting, code blocks, or explanations:
{
  "name": "...",
  "tagline": "...",
  "description": "...",
  "icon": "...",
  "color": "..."
}`;

	const payload = {
		contents: [{ parts: [{ text: promptText }] }],
		generationConfig: {
			temperature: 0.7,
			topP: 0.95,
			maxOutputTokens: 500,
		},
	};

	const rawResponse = await callGeminiApi(payload, realApiKey, preferredModel);

	// Extract candidate text
	const candidateText =
		rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
	if (!candidateText) {
		throw new Error('No response received from Gemini AI.');
	}

	// Clean code blocks or wrapping text
	const cleanedJson = candidateText
		.replace(/```json\s*/gi, '')
		.replace(/```\s*/g, '')
		.trim();

	const jsonStart = cleanedJson.indexOf('{');
	const jsonEnd = cleanedJson.lastIndexOf('}');
	if (jsonStart === -1 || jsonEnd === -1) {
		throw new Error('AI response did not contain a valid JSON object.');
	}

	const parsed = JSON.parse(cleanedJson.substring(jsonStart, jsonEnd + 1));

	const allowedColors = ['emerald', 'blue', 'purple', 'amber', 'rose', 'cyan'];
	const chosenColor =
		allowedColors.includes(parsed.color?.toLowerCase()) ?
			parsed.color.toLowerCase()
		:	'cyan';

	return {
		name: (parsed.name || cleanName || 'New Skillset').trim(),
		tagline: (parsed.tagline || cleanTagline || '').trim(),
		description: (parsed.description || cleanDesc || '').trim(),
		icon: (parsed.icon || '🚀').trim().slice(0, 4),
		color: chosenColor,
	};
}

/**
 * Ensures diagram data mathematically and visually matches the correct answer
 * Provides rich diagram auto-detection for all questions
 */
function synchronizeDiagramData(
	diagramType,
	rawData = {},
	questionText = '',
	correctText = '',
	selectedSkill = 'Visual',
) {
	let type = diagramType;
	const data = {
		...rawData,
		questionText,
		correctAnswerText: correctText,
	};

	const lower = questionText.toLowerCase();

	const parsedShapeCountSequence = parseStepShapeCountSequence(
		questionText,
		correctText,
	);

	const parsedRotation = parseRotationSequence(questionText, correctText);

	// 1. Auto-detect diagram type based on deep question analysis
	if (parsedRotation) {
		type = 'shape-rotation';
		Object.assign(data, parsedRotation);
	} else if (parsedShapeCountSequence) {
		type = 'shape-pattern-grid';
		data.steps = parsedShapeCountSequence.steps;
		data.targetStep = parsedShapeCountSequence.targetStep;
		data.targetCount = parsedShapeCountSequence.targetCount;
		data.shape = parsedShapeCountSequence.shape;
		data.isShaded = parsedShapeCountSequence.isShaded;
		data.color = parsedShapeCountSequence.color;
	} else if (
		lower.includes('prism') ||
		lower.includes('refraction') ||
		lower.includes('white light') ||
		lower.includes('rainbow') ||
		lower.includes('dispersion') ||
		lower.includes('bending effect') ||
		(lower.includes('light') && lower.includes('bend'))
	) {
		type = 'optics-prism';
	} else if (
		lower.includes('isometric') ||
		lower.includes('unit cube') ||
		lower.includes('block structure') ||
		lower.includes('3d tower') ||
		lower.includes('stacking') ||
		lower.includes('volume')
	) {
		type = 'block-tower';
	} else if (
		(lower.includes('3x3') &&
			(lower.includes('grid') || lower.includes('matrix'))) ||
		lower.includes('matrix')
	) {
		type = 'matrix-grid';
		const parsedGrid = parseMatrixGridFromQuestion(questionText, correctText);
		if (parsedGrid) {
			data.grid = parsedGrid.grid;
			data.answer = parsedGrid.answer;
		}
	} else if (
		lower.includes('is to') ||
		questionText.includes('::') ||
		/\b[A-Za-z0-9]+\s*:\s*[A-Za-z0-9]+\s*::/.test(questionText)
	) {
		type = 'analogy-map';
	} else if (
		lower.includes('sequence') ||
		lower.includes('pattern') ||
		lower.includes('next number') ||
		/\d+,\s*\d+,\s*\d+/.test(questionText)
	) {
		const isShape =
			hasShapeOrVisualConcept(questionText) ||
			lower.includes('shape') ||
			lower.includes('figure');
		type = isShape ? 'shape-sequence' : 'sequence-ladder';
	} else if (
		lower.includes('odd-one-out') ||
		lower.includes('odd one out') ||
		lower.includes('not belong') ||
		lower.includes('different group') ||
		lower.includes('states of matter') ||
		lower.includes('room temperature')
	) {
		type = 'odd-one-out';
		data.target = correctText;
	} else if (
		lower.includes('balance') ||
		lower.includes('scale') ||
		lower.includes('heavier') ||
		lower.includes('lighter') ||
		lower.includes('weigh')
	) {
		type = 'scale-balance';
	} else if (
		lower.includes('cause') ||
		lower.includes('effect') ||
		lower.includes('happen') ||
		lower.includes('if you leave') ||
		lower.includes('when heated') ||
		lower.includes('when cooled') ||
		lower.includes('melts') ||
		lower.includes('freeze')
	) {
		type = 'cause-effect';
	} else if (
		(lower.includes('how many') || lower.includes('count')) &&
		!lower.includes('balance') &&
		!lower.includes('scale')
	) {
		type = 'apple-counting';
	} else if (lower.includes('grid') || lower.includes('tile')) {
		type = 'grid-tiles';
	} else {
		// If no authentic, appropriate diagram matches this question,
		// DO NOT fabricate a misleading diagram! Set type = null so the question
		// is displayed cleanly without any deceptive visuals.
		type = null;
	}

	const numMatch =
		String(correctText).match(/\d+/) || String(questionText).match(/\d+/);
	const parsedNum = numMatch ? parseInt(numMatch[0], 10) : null;

	// 2. Exact mathematical parameter extraction per diagram type
	if (type === 'scale-balance') {
		// Detect item types and quantities from question text
		let leftEmoji = '🚗';
		let rightEmoji = '🧱';
		let leftLabel = '1 Toy Car';
		let rightLabel = 'Wooden Blocks';

		if (lower.includes('car')) leftEmoji = '🚗';
		else if (lower.includes('apple')) leftEmoji = '🍎';
		else if (lower.includes('ball')) leftEmoji = '⚽';
		else if (lower.includes('book')) leftEmoji = '📚';
		else if (lower.includes('coin')) leftEmoji = '🪙';
		else if (lower.includes('star')) leftEmoji = '⭐';

		if (lower.includes('block') || lower.includes('brick')) rightEmoji = '🧱';
		else if (lower.includes('cube')) rightEmoji = '🧊';
		else if (lower.includes('marble')) rightEmoji = '⚪';
		else if (lower.includes('weight') || lower.includes('gram'))
			rightEmoji = '⚖️';
		else if (lower.includes('coin')) rightEmoji = '🪙';

		// Extract numbers associated with items if present
		const carMatch = questionText.match(
			/(\d+)\s*(?:identical\s*)?(?:toy\s*)?car/i,
		);
		const blockMatch = questionText.match(/(\d+)\s*(?:wooden\s*)?block/i);

		if (carMatch) {
			leftLabel = `${carMatch[1]} Car${parseInt(carMatch[1], 10) > 1 ? 's' : ''}`;
		}
		if (blockMatch) {
			rightLabel = `${blockMatch[1]} Blocks`;
		}

		data.leftEmoji = data.leftEmoji || leftEmoji;
		data.rightEmoji = data.rightEmoji || rightEmoji;
		data.leftLabel = data.leftLabel || leftLabel;
		data.rightLabel =
			correctText ? `${correctText.trim()}` : data.rightLabel || rightLabel;
		data.heavySide =
			lower.includes('heavier on the left') ? 'left'
			: lower.includes('heavier on the right') ? 'right'
			: 'balanced';
	} else if (type === 'block-tower' || type === 'isometric-tower') {
		// Analyze 3D stepped pyramid / cube layers
		if (
			(lower.includes('3x3') ||
				lower.includes('9 cubes') ||
				lower.includes('9')) &&
			(lower.includes('2x2') ||
				lower.includes('4 cubes') ||
				lower.includes('4')) &&
			(lower.includes('top') ||
				lower.includes('1 single cube') ||
				lower.includes('1'))
		) {
			data.layers = [
				{ size: 3, count: 9, color: 'blue', label: 'Base Layer (3x3)' },
				{ size: 2, count: 4, color: 'amber', label: 'Middle Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = 14;
		} else if (
			(lower.includes('2x2') || lower.includes('4 cubes')) &&
			(lower.includes('1 cube') || lower.includes('top'))
		) {
			data.layers = [
				{ size: 2, count: 4, color: 'blue', label: 'Base Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = 5;
		} else if (parsedNum && parsedNum === 14) {
			data.layers = [
				{ size: 3, count: 9, color: 'blue', label: 'Base Layer (3x3)' },
				{ size: 2, count: 4, color: 'amber', label: 'Middle Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = 14;
		} else {
			data.layers = [
				{ size: 3, count: 9, color: 'blue', label: 'Base Layer (3x3)' },
				{ size: 2, count: 4, color: 'amber', label: 'Middle Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = parsedNum || 14;
		}
	} else if (type === 'matrix-grid') {
		const parsedGrid = parseMatrixGridFromQuestion(questionText, correctText);
		if (parsedGrid) {
			data.grid = parsedGrid.grid;
			data.answer = parsedGrid.answer;
		} else {
			data.grid = data.grid || [
				['Square (Gray)', 'Circle (White)', 'Triangle (White)'],
				['Square (White)', 'Circle (Gray)', 'Triangle (White)'],
				['Square (Gray)', 'Circle (White)', '?'],
			];
			data.answer = correctText.trim() || 'Triangle (Gray)';
		}
	} else if (type === 'analogy-map') {
		const cleanQ = questionText.replace(/\?|\.{2,}/g, '').trim();
		const isToMatch = cleanQ.match(
			/(.+?)\s+is to\s+(.+?)(?:,\s*as|\s+as)\s+(.+?)\s+is to\s*(.*)/i,
		);
		const colonMatch = cleanQ.match(
			/(.+?)\s*:\s*(.+?)\s*::\s*(.+?)\s*:\s*(.*)/,
		);

		if (isToMatch) {
			data.itemA = data.itemA || isToMatch[1].trim();
			data.itemB = data.itemB || isToMatch[2].trim();
			data.itemC = data.itemC || isToMatch[3].trim();
			data.itemD = data.itemD || correctText.trim();
		} else if (colonMatch) {
			data.itemA = data.itemA || colonMatch[1].trim();
			data.itemB = data.itemB || colonMatch[2].trim();
			data.itemC = data.itemC || colonMatch[3].trim();
			data.itemD = data.itemD || correctText.trim();
		} else {
			data.itemA = data.itemA || 'Concept A';
			data.itemB = data.itemB || 'Concept B';
			data.itemC = data.itemC || 'Concept C';
			data.itemD = data.itemD || correctText.trim();
		}
	} else if (type === 'sequence-ladder') {
		const numbersInQ = questionText.match(/-?\d+(?:\.\d+)?/g);
		if (numbersInQ && numbersInQ.length >= 2) {
			if (
				!data.steps ||
				!Array.isArray(data.steps) ||
				numbersInQ.length >= data.steps.length
			) {
				data.steps = numbersInQ.map((n) => n.trim());
			}
		} else {
			data.steps =
				data.steps && data.steps.length > 0 ?
					data.steps
				:	['1st', '2nd', '3rd', '4th'];
		}
		data.nextVal = correctText.trim() || data.nextVal;
	} else if (type === 'odd-one-out') {
		data.target = data.target || correctText.trim();
		data.rule =
			data.rule ||
			'Compare the items to find the one that belongs to a different state or category';
	} else if (type === 'cause-effect') {
		const parts = questionText.split(/,|then|what happens/i);
		data.cause =
			data.cause ||
			(parts[0] ? parts[0].trim().replace(/^if\s+/i, '') : 'Event / Condition');
		let act = data.action || 'leads to';
		if (act.length > 25) {
			act = act.slice(0, 22) + '...';
		}
		data.action = act;
		data.effect = data.effect || correctText.trim();
	} else if (type === 'apple-counting') {
		const count =
			parsedNum && parsedNum > 0 && parsedNum <= 25 ?
				parsedNum
			:	Number(data.count) || 4;
		data.count = count;
		const emojiMatch = questionText.match(
			/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u,
		);
		let contextEmoji = emojiMatch ? emojiMatch[0] : null;
		if (!contextEmoji) {
			if (lower.includes('car')) contextEmoji = '🚗';
			else if (lower.includes('block') || lower.includes('brick'))
				contextEmoji = '🧱';
			else if (lower.includes('star')) contextEmoji = '⭐';
			else if (lower.includes('coin')) contextEmoji = '🪙';
			else if (lower.includes('book')) contextEmoji = '📚';
			else if (lower.includes('flower')) contextEmoji = '🌸';
			else if (lower.includes('ball')) contextEmoji = '⚽';
			else if (lower.includes('cookie')) contextEmoji = '🍪';
			else contextEmoji = '🍎';
		}
		data.emoji = data.emoji || contextEmoji;
	} else if (type === 'pattern-shapes' || type === 'shape-sequence') {
		const extracted = extractShapeSequenceTerms(questionText);
		if (extracted && extracted.length >= 2) {
			// Prioritize ground-truth sequence extracted directly from the actual question text:
			if (
				!data.sequence ||
				!Array.isArray(data.sequence) ||
				extracted.length >= data.sequence.length ||
				!data.sequence.every((it, idx) => it === extracted[idx])
			) {
				data.sequence = extracted;
			}
		} else if (
			!data.sequence ||
			!Array.isArray(data.sequence) ||
			data.sequence.length < 2
		) {
			const emojis = questionText.match(
				/(?:[🔺🔻▲▼△▽▶◀]|[\u{1F7E0}-\u{1F7EB}]|[🔴🔵🟡🟢🟣🟠🟤⚫⚪●○■□◆◇⬛⬜]|(?:[🔷🔶🔹🔸💎💠])|(?:[⭐🌟✨★☆])|(?:[❤️💙💚💛💜🧡🤍🖤🤎]))/gu,
			);
			data.sequence =
				emojis && emojis.length >= 2 ?
					emojis
				:	[
						'Triangle (white)',
						'Square (shaded)',
						'Triangle (white)',
						'Square (shaded)',
					];
		}

		if (Array.isArray(data.sequence)) {
			data.sequence = data.sequence
				.map((s) => (typeof s === 'string' ? s.trim() : s))
				.filter(
					(s) =>
						s &&
						s !== '?' &&
						!String(s).includes('?') &&
						!/^(what|which|how|find|comes)\b/i.test(String(s)),
				);
		}
		data.nextItem =
			correctText.trim() || data.nextItem || data.nextVal || data.sequence[0];
	} else if (type === 'grid-tiles') {
		const count = parsedNum && parsedNum > 0 ? parsedNum : data.count || 4;
		data.count = count;
		data.holeW = count <= 4 ? count : Math.min(4, Math.ceil(Math.sqrt(count)));
		data.holeH = Math.ceil(count / data.holeW);
		data.rows = Math.max(5, data.holeH + 2);
		data.cols = Math.max(5, data.holeW + 2);
		data.holeRow = 1;
		data.holeCol = 1;
	}

	// 3. Strict relevance and authenticity validation:
	// If the diagram cannot be authentically generated or is mismatched, discard it completely.
	if (!type || !isDiagramAppropriateForQuestion(type, data, questionText)) {
		return { type: null, data: null };
	}

	return { type, data };
}

// Helper to shuffle options and format question object
function shuffleAndFormatOptions(questionObj, selectedSkill) {
	if (!questionObj) return null;

	let optionTexts = [];
	let correctText = '';

	if (Array.isArray(questionObj.options)) {
		if (typeof questionObj.options[0] === 'string') {
			optionTexts = [...questionObj.options];
			correctText =
				questionObj.correctAnswer ||
				questionObj.correctAnswerId ||
				optionTexts[0];
		} else if (typeof questionObj.options[0] === 'object') {
			optionTexts = questionObj.options.map(
				(opt) => opt.text || opt.label || String(opt),
			);
			const found = questionObj.options.find(
				(opt) =>
					opt.id === questionObj.correctAnswerId ||
					opt.text === questionObj.correctAnswer,
			);
			correctText =
				found ?
					found.text || found.id
				:	questionObj.correctAnswer || optionTexts[0];
		}
	}

	if (optionTexts.length < 2) {
		optionTexts = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
		correctText = optionTexts[0];
	}

	while (optionTexts.length < 4) {
		optionTexts.push(`Choice ${optionTexts.length + 1}`);
	}

	const uniqueTexts = Array.from(
		new Set(optionTexts.map((t) => String(t).trim())),
	);
	while (uniqueTexts.length < 4) {
		uniqueTexts.push(`Choice ${uniqueTexts.length + 1}`);
	}

	const shuffledTexts = uniqueTexts.slice(0, 4).sort(() => Math.random() - 0.5);
	const letters = ['A', 'B', 'C', 'D'];

	const newOptions = shuffledTexts.map((text, idx) => ({
		id: letters[idx],
		text: String(text),
	}));

	const correctIdx = shuffledTexts.indexOf(String(correctText).trim());
	const newCorrectId = letters[correctIdx >= 0 ? correctIdx : 0];

	const qText =
		questionObj.question ||
		questionObj.questionText ||
		questionObj.q ||
		'Look at the question and choose the best answer:';

	const rawDiagramType =
		questionObj.diagramType ||
		questionObj.dt ||
		(questionObj.imageUrl ? 'image' : null);
	const rawDiagramData =
		questionObj.diagramData ||
		questionObj.dd ||
		(questionObj.imageUrl ? { imageUrl: questionObj.imageUrl } : {});

	const { type: finalDiagramType, data: synchedData } = synchronizeDiagramData(
		rawDiagramType,
		rawDiagramData,
		qText,
		correctText,
		selectedSkill,
	);

	return {
		id:
			questionObj.id ||
			`ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
		category: selectedSkill,
		categoryDescription:
			selectedSkill === 'Visual' ?
				'Pattern Completion, Counting & Spatial Recognition'
			:	'Logical Deduction, Analogies & Critical Thinking',
		question: qText,
		questionText: qText,
		promptAudio: qText,
		diagramType: finalDiagramType || null,
		diagramData: finalDiagramType ? synchedData : null,
		solutionDiagramType: finalDiagramType || null,
		solutionDiagramData: finalDiagramType ? synchedData : null,
		imageUrl: questionObj.imageUrl || synchedData?.imageUrl || null,
		options: newOptions,
		correctAnswerId: newCorrectId,
		correctAnswerText: String(correctText),
		solutionText:
			questionObj.solution ||
			questionObj.solutionText ||
			`The correct answer is ${correctText}.`,
		hint:
			questionObj.hint ||
			'Carefully observe the clues and patterns before selecting an answer.',
	};
}

/**
 * Sanitizes and repairs imperfect JSON from LLMs
 */
function cleanAndRepairJsonString(rawText) {
	if (!rawText) return '';
	let text = rawText.trim();

	// 1. Strip markdown code block wrappers
	if (text.startsWith('```')) {
		text = text
			.replace(/^```(?:json)?\s*/i, '')
			.replace(/```\s*$/i, '')
			.trim();
	}

	// 2. Fix parenthesized expressions inside arrays:
	// e.g. [("(-5, 3)"), ("(-3, 5)")] -> ["(-5, 3)", "(-3, 5)"]
	// e.g. [( "abc" ), ( 'def' )] -> ["abc", "def"]
	text = text.replace(/\(\s*("[^"\\]*(?:\\.[^"\\]*)*")\s*\)/g, '$1');
	text = text.replace(/\(\s*('[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g, '$1');

	// 3. Fix Python-style constants
	text = text
		.replace(/:\s*True\b/g, ': true')
		.replace(/:\s*False\b/g, ': false')
		.replace(/:\s*None\b/g, ': null');

	// 4. Remove trailing commas before closing braces/brackets
	text = text.replace(/,\s*([\]}])/g, '$1');

	return text;
}

/**
 * Resilient JSON Parser for Gemini API responses
 */
function parseGeminiJsonResponse(rawText) {
	if (!rawText) return null;

	const cleaned = cleanAndRepairJsonString(rawText);

	// Try direct parse on cleaned string
	try {
		const parsed = JSON.parse(cleaned);
		if (Array.isArray(parsed)) return parsed;
		if (parsed && typeof parsed === 'object') {
			for (const key of Object.keys(parsed)) {
				if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
					return parsed[key];
				}
			}
		}
	} catch (err) {
		// If strict JSON.parse fails, try extracting array pattern
		try {
			const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
			if (match) {
				const repairedMatch = cleanAndRepairJsonString(match[0]);
				const parsed = JSON.parse(repairedMatch);
				if (Array.isArray(parsed)) return parsed;
			}
		} catch (innerErr) {
			// Last-ditch: parse individual JSON objects { ... } from the text
			try {
				const objectMatches = cleaned.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
				if (objectMatches && objectMatches.length > 0) {
					const items = [];
					for (const objStr of objectMatches) {
						try {
							const obj = JSON.parse(cleanAndRepairJsonString(objStr));
							if (obj.question && obj.options) {
								items.push(obj);
							}
						} catch {}
					}
					if (items.length > 0) return items;
				}
			} catch {}
		}
	}

	return null;
}

/**
 * Generates age-specific pedagogy rules, teacher personas, and relevant examples
 */
function getAgeSpecificPedagogy(age, selectedSkill) {
	const numAge = parseInt(age, 10) || 5;
	const skillInfo = getSkillDefinition(selectedSkill);
	const isDefaultVisual = selectedSkill === 'Visual';
	const isDefaultAnalytical = selectedSkill === 'Analytical Thinking';
	const isCustom = !isDefaultVisual && !isDefaultAnalytical;

	if (numAge <= 4) {
		return {
			persona: `preschool and early childhood educator creating simple, colorful, engaging visual challenges for a ${numAge}-year-old toddler`,
			guidelines: `
- Keep questions super short, simple, and visual with familiar animals, fruits, and shapes.
- For Visual: simple counting (1-5 objects), AB color patterns (🔴 🔵 🔴 🔵).
- For Analytical: Animal babies (Puppy to Dog, Kitten to Cat), basic sounds, color matching.
${isCustom ? `- For "${skillInfo.name}": Keep questions super simple, fun, and age-appropriate for a toddler, focusing on: ${skillInfo.description}` : ''}`,
			examples:
				isDefaultVisual ?
					`Example: "How many red apples 🍎 are in the basket?" -> "diagramType": "apple-counting", "diagramData": {"count": 3, "emoji": "🍎"}, "correctAnswer": "3 apples"`
				: isDefaultAnalytical ?
					`Example: "Puppy 🐶 is to Dog 🐕, as Kitten 🐱 is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Puppy 🐶", "itemB": "Dog 🐕", "itemC": "Kitten 🐱", "itemD": "Cat 🐈"}, "correctAnswer": "Cat 🐈"`
				:	`Example: Age-appropriate introductory question directly exploring ${skillInfo.name}.`,
		};
	}

	if (numAge <= 7) {
		return {
			persona: `elementary educator creating fun, logical puzzles for a ${numAge}-year-old early elementary student`,
			guidelines: `
- Use kindergarten/early grade-school vocabulary, addition within 1-12, AAB/ABC repeating patterns.
- For Visual: Counting 4-12 objects, grid tile gaps, balance scales.
- For Analytical: Functional analogies (Bird : Nest :: Bee : Hive), everyday cause-and-effect (sun melts ice, rain grows plants), odd-one-out categories.
${isCustom ? `- For "${skillInfo.name}": Create engaging early elementary challenges directly applying: ${skillInfo.description}` : ''}`,
			examples:
				isDefaultVisual ?
					`Example: "Complete the pattern: 🔴 🔴 🔷 🔴 🔴 ?" -> "diagramType": "pattern-shapes", "diagramData": {"sequence": ["🔴", "🔴", "🔷", "🔴", "🔴"], "nextItem": "🔷"}, "correctAnswer": "🔷"`
				: isDefaultAnalytical ?
					`Example: "If you leave an ice cube 🧊 in the warm sun ☀️, what happens?" -> "diagramType": "cause-effect", "diagramData": {"cause": "Ice Cube 🧊 in Sun ☀️", "action": "melts", "effect": "Water 💧"}, "correctAnswer": "It melts into water 💧"`
				:	`Example: Creative elementary puzzle centered on ${skillInfo.name}.`,
		};
	}

	if (numAge <= 10) {
		return {
			persona: `upper elementary logic and STEM instructor creating thought-provoking puzzles for a ${numAge}-year-old student (Grades 3-5)`,
			guidelines: `
- DO NOT generate baby/preschool counting questions!
- Use multi-step reasoning, geometric & number sequences (e.g. 4, 8, 12, 16, ? or 3, 6, 12, 24, ?), 3D block projections, grid matrices.
- For Analytical: Higher-order analogies (Author : Novel :: Sculptor : Statue, Thermometer : Temperature :: Speedometer : Speed), scientific classification (Carnivore/Herbivore/Omnivore, States of matter, simple machines), multi-step deductive clues.
${isCustom ? `- For "${skillInfo.name}": Create rigorous upper-elementary challenges, facts, and deductions testing: ${skillInfo.description}` : ''}`,
			examples:
				isDefaultVisual ?
					`Example: "Look at the number sequence: 5, 10, 20, 40, ? What comes next?" -> "diagramType": "sequence-ladder", "diagramData": {"steps": ["5", "10", "20", "40"], "nextVal": "80", "rule": "x2"}, "correctAnswer": "80", "options": ["60", "70", "80", "90"]`
				: isDefaultAnalytical ?
					`Example: "Author is to Book, as Architect is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Author ✍️", "itemB": "Book 📖", "itemC": "Architect 📐", "itemD": "Building 🏛️"}, "correctAnswer": "Building", "options": ["Painting", "Building", "Song", "Meal"]`
				:	`Example: Thought-provoking challenge testing concepts in ${skillInfo.name}.`,
		};
	}

	// Ages 11-14 (Middle School / Teen)
	return {
		persona: `middle school logic, mathematics, and advanced STEM educator creating challenging analytical puzzles for a ${numAge}-year-old teenager (Grades 6-9)`,
		guidelines: `
- STRICTLY FORBIDDEN: Do NOT give young kid questions (NO simple apple counting, NO baby animal pairings like puppy-dog!).
- For Visual: Challenging numerical sequences (e.g. 2, 5, 10, 17, 26, ? or Fibonacci), geometric matrix transformations, spatial rotations, isometric block tower volumes, coordinate reflections.
- For Analytical: Advanced abstract analogies (Microscope : Microorganism :: Telescope : Distant Galaxy, Catalyst : Chemical Reaction :: Mentor : Personal Growth), deductive syllogisms, physics principles (density, balance levers, electric circuits, refraction), critical thinking puzzles.
${isCustom ? `- For "${skillInfo.name}": Present advanced critical thinking and multi-step problem solving exploring: ${skillInfo.description}` : ''}`,
		examples:
			isDefaultVisual ?
				`Example: "Identify the pattern rule in the sequence: 2, 5, 10, 17, 26, ? What is the next term?" -> "diagramType": "sequence-ladder", "diagramData": {"steps": ["2", "5", "10", "17", "26"], "nextVal": "37", "rule": "+3, +5, +7, +9, +11"}, "correctAnswer": "37", "options": ["35", "37", "39", "41"], "solution": "The difference between terms increases by consecutive odd numbers (+3, +5, +7, +9, +11). 26 + 11 = 37."`
			: isDefaultAnalytical ?
				`Example: "Microscope is to Microorganism, as Telescope is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Microscope 🔬", "itemB": "Microorganism 🦠", "itemC": "Telescope 🔭", "itemD": "Distant Galaxy 🌌"}, "correctAnswer": "Distant Galaxy", "options": ["Subatomic Particle", "Distant Galaxy", "Microscopic Cell", "Sound Wave"], "solution": "A microscope is an instrument used to observe microscopic organisms, just as a telescope is used to observe distant galaxies."`
			:	`Example: Advanced conceptual question on ${skillInfo.name}.`,
	};
}

/**
 * Fetch a high-quality batch with skillset description, domain focus, and strict non-repetition rules
 */
async function fetchBatch(
	selectedSkill,
	count,
	kidAge,
	batchId,
	apiKey,
	preferredModel = null,
) {
	const skillInfo = getSkillDefinition(selectedSkill);
	const isVisual =
		selectedSkill === 'Visual' ||
		skillInfo.id === 'visual' ||
		skillInfo.name?.toLowerCase() === 'visual';
	const pedagogy = getAgeSpecificPedagogy(kidAge, selectedSkill);

	const domainFocus =
		batchId === 1 ?
			skillInfo.batch1Domain ||
			`Batch 1 Focus: Core principles, foundational concepts, and introductory puzzles directly reflecting: ${skillInfo.description}`
		:	skillInfo.batch2Domain ||
			`Batch 2 Focus: Multi-step reasoning, practical problem-solving, and engaging challenges directly reflecting: ${skillInfo.description}`;

	const prompt = `You are an expert educator and puzzle creator.
TARGET SKILLSET: "${skillInfo.title || skillInfo.name}"
SKILLSET DESCRIPTION: "${skillInfo.description}"
CORE LEARNING OBJECTIVE: "${skillInfo.coreObjective || `The student must solve age-appropriate challenges and questions focused specifically on ${skillInfo.name}: ${skillInfo.description}`}"
TARGET STUDENT AGE: Strictly calibrated for a ${kidAge}-year-old child (Grade/Cognitive level appropriate).

CURRENT BATCH DOMAIN (Batch ${batchId}):
${domainFocus}

AGE PEDAGOGY GUIDELINES (Age ${kidAge}):
${pedagogy.guidelines}

${pedagogy.examples}

CRITICAL RULES (100% Non-Repetitive, Visually-Enriched & Accurate):
1. Every single question in this batch must be 100% UNIQUE in concept, wording, and numerical values. Do NOT repeat or rephrase questions within the batch.
2. ALWAYS provide an accurate, matching visual diagram structure in "diagramType" and "diagramData":
   - For Spatial Rotation / 90° Turn questions: use "diagramType": "shape-rotation", "diagramData": {"angle": 90, "direction": "CW", "steps": [{"step": 1, "quadrant": "top-right", "deg": 0}, {"step": 2, "quadrant": "bottom-right", "deg": 90}, {"step": 3, "quadrant": "bottom-left", "deg": 180}], "target": {"step": 4, "quadrant": "top-left", "deg": 270}}
   - For Optics / Light / Prism / Refraction questions: use "diagramType": "optics-prism", "diagramData": {}
   - For Science & Nature Process / Cause & Effect: use "diagramType": "cause-effect", "diagramData": {"cause": "...", "action": "...", "effect": "..."}
   - For 4-term Analogies (A : B :: C : D): use "diagramType": "analogy-map", "diagramData": {"itemA": "...", "itemB": "...", "itemC": "...", "itemD": "..."}
   - For 3D Isometric Cube Pyramids: use "diagramType": "block-tower", "diagramData": {"layers": [{"size": 3, "count": 9}, {"size": 2, "count": 4}, {"size": 1, "count": 1}], "totalCubes": 14}
   - For Geometric Shape Progressions: use "diagramType": "pattern-shapes" or "shape-sequence", "diagramData": {"sequence": ["Red Circle", "Blue Square", "Green Triangle", "Red Circle", "Blue Square", "Green Triangle", "Red Circle", "Blue Square"], "nextItem": "Green Triangle"}. CRITICAL: "sequence" MUST contain EVERY SINGLE term in the question prompt up to the "?" in identical order. NEVER truncate or abbreviate the sequence.
   - For Number Progressions: use "diagramType": "sequence-ladder", "diagramData": {"steps": ["2", "4", "8", "16"], "nextVal": "32", "rule": "x2"}. CRITICAL: "steps" MUST contain every number stated in the question sequence.
3. Every question must have 4 distinct, plausible multiple-choice options with exactly 1 unambiguous correct answer.
4. All multiple-choice options in the "options" array MUST be standard JSON strings e.g. ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]. Do NOT use tuples or parentheses around items like [("...")].
5. The complexity and vocabulary MUST strictly fit a ${kidAge}-year-old student.

Output a valid JSON Array of ${count} items. Format:
[
  {
    "question": "Age-appropriate question text matching ${skillInfo.title}",
    "diagramType": ${
			isVisual ?
				kidAge >= 8 ?
					'"block-tower"'
				:	'"apple-counting"'
			: kidAge >= 8 ? '"cause-effect"'
			: '"analogy-map"'
		},
    "diagramData": ${
			isVisual ?
				kidAge >= 8 ?
					'{"totalCubes": 14}'
				:	'{"count": 4, "emoji": "🍎"}'
			: kidAge >= 8 ?
				'{"cause": "White light entering glass prism", "action": "bends and splits", "effect": "Refraction"}'
			:	'{"itemA": "Puppy 🐶", "itemB": "Dog 🐕", "itemC": "Kitten 🐱", "itemD": "Cat 🐈"}'
		},
    "options": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
    "correctAnswer": "Choice 1",
    "solution": "1-2 sentences explaining why this is the correct logical answer.",
    "hint": "1 helpful clue that guides the thinking process."
  }
]
Return ONLY the valid JSON array without any markdown preamble.`;

	const bodyPayload = {
		contents: [{ parts: [{ text: prompt }] }],
		generationConfig: {
			responseMimeType: 'application/json',
			temperature: 0.75,
			maxOutputTokens: 8192,
		},
	};

	const data = await callGeminiApi(bodyPayload, apiKey, preferredModel);
	const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
	const parsed = parseGeminiJsonResponse(rawText);

	if (Array.isArray(parsed) && parsed.length > 0) {
		return parsed;
	}

	console.warn('[Gemini API] Failed to parse JSON response batch:', rawText);
	return [];
}

/**
 * Fallback emergency top-up pool for rare cases where AI returns 8 or 9 questions
 * Guarantees exactly 10 questions are always delivered without fail.
 */
function generateEmergencyTopUp(selectedSkill, kidAge, countNeeded, localSeen) {
	const isVisual = selectedSkill === 'Visual';
	const age = parseInt(kidAge, 10) || 5;

	const visualPool = [
		{
			question:
				'Examine the shape rotation: A square with its top-right quadrant shaded rotates 90 degrees clockwise each step. What position will the shaded quadrant occupy next?',
			diagramType: 'shape-rotation',
			diagramData: {
				angle: 90,
				direction: 'CW',
				steps: [
					{
						step: 1,
						quadrant: 'top-right',
						deg: 0,
						isQuadrant: true,
						isShaded: true,
					},
					{
						step: 2,
						quadrant: 'bottom-right',
						deg: 90,
						isQuadrant: true,
						isShaded: true,
					},
					{
						step: 3,
						quadrant: 'bottom-left',
						deg: 180,
						isQuadrant: true,
						isShaded: true,
					},
				],
				target: {
					step: 4,
					quadrant: 'top-left',
					deg: 270,
					isQuadrant: true,
					isShaded: true,
				},
			},
			options: ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right'],
			correctAnswer: 'Top-Left',
			solution:
				'Rotating 90° clockwise shifts the shaded corner from bottom-left to top-left.',
			hint: 'Follow the clockwise direction of clock hands.',
		},
		{
			question:
				'Examine the growing shape progression: Step 1 has 1 shaded square, Step 2 has 3 shaded squares, Step 3 has 6 shaded squares, and Step 4 has 10 shaded squares. Following this triangular sequence, how many shaded squares are in Step 6?',
			diagramType: 'shape-pattern-grid',
			diagramData: {
				steps: [
					{ step: 1, count: 1, shape: 'square', isShaded: true },
					{ step: 2, count: 3, shape: 'square', isShaded: true },
					{ step: 3, count: 6, shape: 'square', isShaded: true },
					{ step: 4, count: 10, shape: 'square', isShaded: true },
				],
				targetStep: 6,
				targetCount: 21,
			},
			options: ['21', '18', '15', '28'],
			correctAnswer: '21',
			solution:
				'The sequence adds +2, +3, +4, +5, +6. Step 5 = 15, and Step 6 = 15 + 6 = 21.',
			hint: 'Triangular number formula: n * (n + 1) / 2.',
		},
		{
			question:
				'Look at the number progression: 4, 8, 16, 32, ? What is the next number in this sequence?',
			diagramType: 'sequence-ladder',
			diagramData: {
				steps: ['4', '8', '16', '32'],
				nextVal: '64',
				rule: 'x2',
			},
			options: ['64', '48', '56', '72'],
			correctAnswer: '64',
			solution: 'Each term is doubled (multiplied by 2): 32 × 2 = 64.',
			hint: 'Multiply the previous number by 2.',
		},
		{
			question:
				'Examine the stepped 3D block pyramid: Base layer has 9 cubes (3x3), middle layer has 4 cubes (2x2), and top layer has 1 cube (1x1). What is the total volume in unit cubes?',
			diagramType: 'block-tower',
			diagramData: {
				layers: [
					{ size: 3, count: 9 },
					{ size: 2, count: 4 },
					{ size: 1, count: 1 },
				],
				totalCubes: 14,
			},
			options: ['14', '12', '16', '18'],
			correctAnswer: '14',
			solution: 'Sum the cubes in all 3 layers: 9 + 4 + 1 = 14 unit cubes.',
			hint: 'Add 9 + 4 + 1.',
		},
		{
			question:
				'Observe the shape progression: Triangle, Square, Pentagon, Hexagon, ? Which geometric polygon comes next?',
			diagramType: 'pattern-shapes',
			diagramData: {
				sequence: ['Triangle', 'Square', 'Pentagon', 'Hexagon'],
				nextItem: 'Heptagon',
			},
			options: ['Heptagon', 'Octagon', 'Decagon', 'Circle'],
			correctAnswer: 'Heptagon',
			solution:
				'The side counts increase by 1: 3, 4, 5, 6 sides. The next shape has 7 sides (Heptagon).',
			hint: 'Count the number of sides: 3, 4, 5, 6, ?',
		},
		{
			question: 'Identify the pattern: 5, 10, 15, 20, 25, ? What comes next?',
			diagramType: 'sequence-ladder',
			diagramData: {
				steps: ['5', '10', '15', '20', '25'],
				nextVal: '30',
				rule: '+5',
			},
			options: ['30', '35', '28', '32'],
			correctAnswer: '30',
			solution: 'Counting by fives: 25 + 5 = 30.',
			hint: 'Add 5 to 25.',
		},
	];

	const analyticalPool = [
		{
			question:
				'When a beam of white sunlight passes through a glass triangular prism, it bends and disperses into a spectrum of rainbow colors. What is the scientific term for this light-bending effect?',
			diagramType: 'optics-prism',
			diagramData: {},
			options: ['Refraction', 'Reflection', 'Absorption', 'Diffusion'],
			correctAnswer: 'Refraction',
			solution:
				'Refraction is the bending of light waves as they pass from air into the denser glass medium.',
			hint: 'Look at the light bending as it enters the prism.',
		},
		{
			question: 'Microscope is to Biologist, as Telescope is to...?',
			diagramType: 'analogy-map',
			diagramData: {
				itemA: 'Microscope 🔬',
				itemB: 'Biologist 🧬',
				itemC: 'Telescope 🔭',
				itemD: 'Astronomer 🌌',
			},
			options: ['Astronomer', 'Geologist', 'Architect', 'Chemist'],
			correctAnswer: 'Astronomer',
			solution:
				'A biologist uses a microscope to view cells, while an astronomer uses a telescope to study stars.',
			hint: 'Who uses a telescope to study planets and stars?',
		},
		{
			question:
				'If water is heated to its boiling point of 100°C (212°F), what physical state change occurs?',
			diagramType: 'cause-effect',
			diagramData: {
				cause: 'Water heated to 100°C 🔥',
				action: 'boils',
				effect: 'Steam / Water Vapor 💨',
			},
			options: [
				'It evaporates into water vapor (steam)',
				'It freezes into ice',
				'It condenses into liquid',
				'It turns into rock',
			],
			correctAnswer: 'It evaporates into water vapor (steam)',
			solution:
				'Boiling causes liquid water molecules to gain energy and transition into steam (gas).',
			hint: 'Think about steam rising from a boiling kettle.',
		},
		{
			question: 'Author is to Book, as Architect is to...?',
			diagramType: 'analogy-map',
			diagramData: {
				itemA: 'Author ✍️',
				itemB: 'Book 📖',
				itemC: 'Architect 📐',
				itemD: 'Building 🏛️',
			},
			options: ['Building', 'Painting', 'Song', 'Sculpture'],
			correctAnswer: 'Building',
			solution:
				'An author designs and writes books, while an architect designs buildings.',
			hint: 'What structure does an architect design?',
		},
		{
			question: 'Glove is to Hand, as Sock is to...?',
			diagramType: 'analogy-map',
			diagramData: {
				itemA: 'Glove 🧤',
				itemB: 'Hand 🖐️',
				itemC: 'Sock 🧦',
				itemD: 'Foot 🦶',
			},
			options: ['Foot', 'Head', 'Wrist', 'Ankle'],
			correctAnswer: 'Foot',
			solution: 'A glove protects the hand, just as a sock protects the foot.',
			hint: 'Which body part wears a sock?',
		},
		{
			question: 'Seed is to Plant, as Egg is to...?',
			diagramType: 'analogy-map',
			diagramData: {
				itemA: 'Seed 🌱',
				itemB: 'Plant 🌿',
				itemC: 'Egg 🥚',
				itemD: 'Bird 🐦',
			},
			options: ['Bird', 'Nest', 'Branch', 'Feather'],
			correctAnswer: 'Bird',
			solution: 'A seed develops into a plant, and an egg hatches into a bird.',
			hint: 'What creature hatches from an egg?',
		},
	];

	const pool = isVisual ? visualPool : analyticalPool;
	const results = [];

	for (const item of pool) {
		if (results.length >= countNeeded) break;
		const norm = String(item.question).toLowerCase().trim();
		if (localSeen && localSeen.has(norm)) continue;
		results.push(item);
	}

	return results;
}

/**
 * Generate exactly 10 high-quality, non-repeating AI questions calibrated to kidAge and skillset
 * Always returns strictly 10 items.
 */
export async function generateAIQuestions(
	selectedSkill = 'Visual',
	sheetNumber = 1,
	kidAge = 5,
) {
	const apiKey = getStoredApiKey();

	if (!apiKey) {
		throw new Error('MISSING_API_KEY');
	}

	const preferredModel = getStoredSelectedModel();
	const seenSignatures = getSeenSignatures();

	const normalizeText = (text) =>
		String(text || '')
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s+/g, ' ')
			.trim();

	let combined = [];

	try {
		// Request 6 from batch 1 and 6 from batch 2 (total 12) to ensure a healthy buffer
		const [batch1, batch2] = await Promise.all([
			fetchBatch(selectedSkill, 6, kidAge, 1, apiKey, preferredModel),
			fetchBatch(selectedSkill, 6, kidAge, 2, apiKey, preferredModel),
		]);

		combined = [...batch1, ...batch2];
	} catch (err) {
		console.warn(
			'Parallel batch issue, falling back to single batch:',
			err.message,
		);
	}

	// Fallback single batch of 12 if needed
	if (combined.length < 8) {
		try {
			const singleBatch = await fetchBatch(
				selectedSkill,
				12,
				kidAge,
				1,
				apiKey,
				preferredModel,
			);
			combined = [...singleBatch];
		} catch (err) {
			console.error('Single batch fallback failed:', err);
		}
	}

	// Deduplicate and format
	const uniqueQuestions = [];
	const localSeen = new Set();

	for (const rawQ of combined) {
		if (!rawQ || !rawQ.question) continue;
		const norm = normalizeText(rawQ.question);
		if (localSeen.has(norm)) continue;
		localSeen.add(norm);

		const formatted = shuffleAndFormatOptions(rawQ, selectedSkill);
		if (formatted) {
			uniqueQuestions.push({
				...formatted,
				id: `ai_${selectedSkill.toLowerCase().replace(/\s+/g, '_')}_${kidAge}yo_${Date.now()}_${uniqueQuestions.length}_${Math.random().toString(36).substr(2, 4)}`,
			});
			seenSignatures.add(norm);
		}

		if (uniqueQuestions.length === 10) break;
	}

	// Top-up pass if we got 8 or 9 questions
	if (uniqueQuestions.length < 10) {
		const needed = 10 - uniqueQuestions.length;
		try {
			const topUpBatch = await fetchBatch(
				selectedSkill,
				Math.max(needed + 2, 4),
				kidAge,
				3,
				apiKey,
				preferredModel,
			);
			for (const rawQ of topUpBatch) {
				if (uniqueQuestions.length === 10) break;
				if (!rawQ || !rawQ.question) continue;
				const norm = normalizeText(rawQ.question);
				if (localSeen.has(norm)) continue;
				localSeen.add(norm);

				const formatted = shuffleAndFormatOptions(rawQ, selectedSkill);
				if (formatted) {
					uniqueQuestions.push({
						...formatted,
						id: `ai_${selectedSkill.toLowerCase().replace(/\s+/g, '_')}_${kidAge}yo_${Date.now()}_${uniqueQuestions.length}_${Math.random().toString(36).substr(2, 4)}`,
					});
					seenSignatures.add(norm);
				}
			}
		} catch (err) {
			console.warn('Top-up batch fetch failed:', err.message);
		}
	}

	// Emergency top-up guarantee so questions.length is ALWAYS strictly 10
	if (uniqueQuestions.length < 10) {
		const emergencyItems = generateEmergencyTopUp(
			selectedSkill,
			kidAge,
			10 - uniqueQuestions.length,
			localSeen,
		);
		for (const rawQ of emergencyItems) {
			if (uniqueQuestions.length === 10) break;
			const formatted = shuffleAndFormatOptions(rawQ, selectedSkill);
			if (formatted) {
				uniqueQuestions.push({
					...formatted,
					id: `ai_${selectedSkill.toLowerCase().replace(/\s+/g, '_')}_${kidAge}yo_${Date.now()}_${uniqueQuestions.length}_${Math.random().toString(36).substr(2, 4)}`,
				});
			}
		}
	}

	saveSeenSignatures(seenSignatures);

	// Strictly deliver exactly 10 questions
	return uniqueQuestions.slice(0, 10);
}

// LocalStorage key for persisting the active image provider
const ACTIVE_IMAGE_PROVIDER_KEY = 'astroquest_active_image_provider';

// In-memory cache for AI-generated visual images
const aiImageCache = new Map();

/**
 * Convert Blob to Base64 Data URI
 */
function blobToDataUri(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

// 1. Google Imagen 3 Handler
async function generateWithImagen(prompt, apiKey) {
	if (!apiKey) {
		const err = new Error('No Gemini API key provided for Imagen');
		err.isResourceExhausted = true;
		throw err;
	}
	const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(apiKey)}`;
	let data;
	try {
		const response = await apiClient.post(imagenUrl, {
			instances: [{ prompt }],
			parameters: {
				sampleCount: 1,
				aspectRatio: '1:1',
			},
		});
		data = response.data;
	} catch (err) {
		const status = err.response?.status || 500;
		const errData = err.response?.data;
		const customErr = new Error(
			errData?.error?.message || `Imagen HTTP ${status}`,
		);
		if (isResourceExhausted(status, errData, customErr.message)) {
			customErr.isResourceExhausted = true;
		}
		throw customErr;
	}

	const base64Bytes = data?.predictions?.[0]?.bytesBase64Encoded;
	if (!base64Bytes) {
		throw new Error('No image bytes returned from Imagen');
	}
	return `data:image/png;base64,${base64Bytes}`;
}

// 2. Google Gemini 2.5 Flash Native Image Handler
async function generateWithGeminiFlash(prompt, apiKey) {
	if (!apiKey) {
		const err = new Error('No Gemini API key provided for Gemini Flash');
		err.isResourceExhausted = true;
		throw err;
	}
	const flashUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(apiKey)}`;
	let flashData;
	try {
		const flashResp = await apiClient.post(flashUrl, {
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: {
				responseModalities: ['IMAGE'],
			},
		});
		flashData = flashResp.data;
	} catch (err) {
		const status = err.response?.status || 500;
		const errData = err.response?.data;
		const customErr = new Error(
			errData?.error?.message || `Gemini Flash HTTP ${status}`,
		);
		if (isResourceExhausted(status, errData, customErr.message)) {
			customErr.isResourceExhausted = true;
		}
		throw customErr;
	}

	const part = flashData?.candidates?.[0]?.content?.parts?.[0];
	if (!part?.inlineData?.data) {
		throw new Error('No inline image data from Gemini Flash');
	}
	const mime = part.inlineData.mimeType || 'image/png';
	return `data:${mime};base64,${part.inlineData.data}`;
}

/**
 * Sanitize prompt for URL and image model safety: converts emojis to descriptive words
 */
function sanitizePromptForImage(text) {
	return String(text || '')
		.replace(/⭐/g, ' star ')
		.replace(/🌙/g, ' moon ')
		.replace(/☀️/g, ' sun ')
		.replace(/🔴/g, ' red circle ')
		.replace(/🔵/g, ' blue circle ')
		.replace(/🔷/g, ' blue diamond ')
		.replace(/🟩/g, ' green square ')
		.replace(/🔺/g, ' red triangle ')
		.replace(/🍎/g, ' apple ')
		.replace(/🧊/g, ' ice cube ')
		.replace(/💧/g, ' water drop ')
		.replace(/🔬/g, ' microscope ')
		.replace(/🔭/g, ' telescope ')
		.replace(/🌌/g, ' galaxy ')
		.replace(/[^\w\s.,?!:;-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 160);
}

// 3. Free Provider: Pollinations AI (Turbo Fast) - Highest availability, zero 429 errors
async function generateWithPollinationsTurbo(prompt) {
	const clean = sanitizePromptForImage(prompt);
	const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?width=400&height=400&nologo=true&model=turbo`;

	if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('Pollinations Turbo load timeout'));
			}, 3500);

			const img = new Image();
			img.onload = () => {
				clearTimeout(timer);
				resolve(url);
			};
			img.onerror = () => {
				clearTimeout(timer);
				reject(
					new Error('Pollinations Turbo blocked by browser ORB or network'),
				);
			};
			img.src = url;
		});
	}
	return url;
}

// 4. Free Provider: Pollinations AI (Standard)
async function generateWithPollinationsDefault(prompt) {
	const clean = sanitizePromptForImage(prompt);
	const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?width=400&height=400&nologo=true`;

	if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('Pollinations Default load timeout'));
			}, 3500);

			const img = new Image();
			img.onload = () => {
				clearTimeout(timer);
				resolve(url);
			};
			img.onerror = () => {
				clearTimeout(timer);
				reject(
					new Error('Pollinations Default blocked by browser ORB or network'),
				);
			};
			img.src = url;
		});
	}
	return url;
}

// 5. Free Provider: Pollinations AI (Flux)
async function generateWithPollinationsFlux(prompt) {
	const clean = sanitizePromptForImage(prompt);
	const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?width=400&height=400&nologo=true&model=flux`;

	if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('Pollinations Flux load timeout'));
			}, 3500);

			const img = new Image();
			img.onload = () => {
				clearTimeout(timer);
				resolve(url);
			};
			img.onerror = () => {
				clearTimeout(timer);
				reject(
					new Error('Pollinations Flux blocked by browser ORB or rate limit'),
				);
			};
			img.src = url;
		});
	}
	return url;
}

// Ordered list of AI Image Generation Providers (Fast & reliable first)
export const IMAGE_PROVIDERS = [
	{
		id: 'gemini_imagen',
		name: 'Google Imagen 3',
		type: 'gemini',
		handler: generateWithImagen,
	},
	{
		id: 'gemini_flash',
		name: 'Gemini Flash Image',
		type: 'gemini',
		handler: generateWithGeminiFlash,
	},
	{
		id: 'pollinations_turbo',
		name: 'Pollinations AI (Turbo Free)',
		type: 'free',
		handler: generateWithPollinationsTurbo,
	},
	{
		id: 'pollinations_default',
		name: 'Pollinations AI (Standard Free)',
		type: 'free',
		handler: generateWithPollinationsDefault,
	},
	{
		id: 'pollinations_flux',
		name: 'Pollinations AI (Flux Free)',
		type: 'free',
		handler: generateWithPollinationsFlux,
	},
];

export function getActiveImageProviderIndex() {
	try {
		const stored = localStorage.getItem(ACTIVE_IMAGE_PROVIDER_KEY);
		if (stored !== null) {
			const idx = parseInt(stored, 10);
			if (!isNaN(idx) && idx >= 0 && idx < IMAGE_PROVIDERS.length) {
				return idx;
			}
		}
	} catch (_) {}
	return 0;
}

export function setActiveImageProviderIndex(index) {
	try {
		const safeIdx = Math.max(0, Math.min(index, IMAGE_PROVIDERS.length - 1));
		localStorage.setItem(ACTIVE_IMAGE_PROVIDER_KEY, String(safeIdx));
	} catch (_) {}
}

export function getActiveImageProvider() {
	const idx = getActiveImageProviderIndex();
	return IMAGE_PROVIDERS[idx] || IMAGE_PROVIDERS[0];
}

/**
 * Request an AI-generated image for an educational prompt.
 * Uses the currently active image provider.
 * If RESOURCE_EXHAUSTED or quota error occurs, automatically switches to the next free API,
 * persists the new provider for future generations, and retries until an image is produced.
 */
export async function generateAiVisualImage(
	promptDescription,
	customKey = null,
) {
	if (!promptDescription) return null;
	const apiKey = customKey || getStoredApiKey();

	const cacheKey = String(promptDescription).trim().toLowerCase();
	if (aiImageCache.has(cacheKey)) {
		return aiImageCache.get(cacheKey);
	}

	const cleanedDesc = sanitizePromptForImage(promptDescription);
	const cleanedPrompt = `Clean educational puzzle illustration for elementary kids, vector style, simple geometric and logical objects on crisp white background: ${cleanedDesc}`;

	// 1. Try secure Node.js Express proxy first (Zero API key in Network tab!)
	const hasProxy = await checkProxyAvailability();
	if (hasProxy) {
		try {
			const proxyResp = await apiClient.post(
				'/api/generate-image',
				{ prompt: cleanedPrompt },
				{
					headers: {
						...(apiKey ? { 'x-gemini-key': apiKey } : {}),
					},
				},
			);
			if (proxyResp.data?.imageUrl) {
				aiImageCache.set(cacheKey, proxyResp.data.imageUrl);
				return proxyResp.data.imageUrl;
			}
		} catch (err) {
			console.warn(
				'[Proxy Image failed, falling back to client providers]:',
				err,
			);
		}
	}

	let currentIdx = getActiveImageProviderIndex();
	const totalProviders = IMAGE_PROVIDERS.length;
	let attempts = 0;

	while (attempts < totalProviders) {
		const provider = IMAGE_PROVIDERS[currentIdx];
		try {
			console.log(
				`[AI Image] Attempting generation with provider: ${provider.name} (Index: ${currentIdx})`,
			);
			const imageUri = await provider.handler(cleanedPrompt, apiKey);
			if (imageUri) {
				// Generation succeeded: keep this provider active for all future generations
				setActiveImageProviderIndex(currentIdx);
				aiImageCache.set(cacheKey, imageUri);
				return imageUri;
			}
		} catch (err) {
			console.warn(
				`[AI Image] Provider ${provider.name} failed:`,
				err?.message || err,
			);
			const isExhausted =
				err?.isResourceExhausted ||
				isResourceExhausted(err?.status, null, err?.message || '');

			if (isExhausted) {
				console.warn(
					`[AI Image] RESOURCE_EXHAUSTED on ${provider.name}! Switching to next free image provider...`,
				);
			}

			// Advance to next provider in the chain and persist it
			currentIdx = (currentIdx + 1) % totalProviders;
			setActiveImageProviderIndex(currentIdx);
			console.log(
				`[AI Image] Switched active provider to: ${IMAGE_PROVIDERS[currentIdx].name} for future generations.`,
			);
		}
		attempts++;
	}

	// Cache failure as null to avoid repeated failing calls in the same session
	aiImageCache.set(cacheKey, null);
	return null;
}

/**
 * Fetch an AI-generated image for a specific question diagram
 */
export async function getAiImageForQuestion(question, apiKey = null) {
	if (!question) return null;
	const promptText =
		question.diagramData?.prompt ||
		question.question ||
		question.questionText ||
		'';
	if (!promptText) return null;
	return generateAiVisualImage(promptText, apiKey);
}

/**
 * Fetch an AI-generated image for a specific option choice
 */
export async function getAiImageForOption(
	questionText,
	optionText,
	apiKey = null,
) {
	if (!optionText) return null;
	const promptText = `${optionText} (for: ${questionText || ''})`;
	return generateAiVisualImage(promptText, apiKey);
}
