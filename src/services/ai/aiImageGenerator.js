import apiClient from '../apiClient';
import {
	checkProxyAvailability,
	getStoredApiKey,
	isResourceExhausted,
} from './aiConfig';

const ACTIVE_IMAGE_PROVIDER_KEY = 'astroquest_active_image_provider';

// In-memory cache for AI-generated visual images
const aiImageCache = new Map();

/**
 * Convert Blob to Base64 Data URI
 */
export function blobToDataUri(blob) {
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
export function sanitizePromptForImage(text) {
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
			const idx = Number.parseInt(stored, 10);
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

	// 1. Try secure Node.js Express proxy first
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

			currentIdx = (currentIdx + 1) % totalProviders;
			setActiveImageProviderIndex(currentIdx);
			console.log(
				`[AI Image] Switched active provider to: ${IMAGE_PROVIDERS[currentIdx].name} for future generations.`,
			);
		}
		attempts++;
	}

	aiImageCache.set(cacheKey, null);
	return null;
}

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

export async function getAiImageForOption(
	questionText,
	optionText,
	apiKey = null,
) {
	if (!optionText) return null;
	const promptText = `${optionText} (for: ${questionText || ''})`;
	return generateAiVisualImage(promptText, apiKey);
}
