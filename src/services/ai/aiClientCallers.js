import apiClient from '../apiClient';
import {
	AI_PROVIDERS,
	AVAILABLE_GEMINI_MODELS,
	checkProxyAvailability,
	decryptApiKey,
	DEFAULT_CLAUDE_MODEL,
	DEFAULT_GEMINI_MODEL,
	DEFAULT_OPENAI_MODEL,
	getActiveAiProvider,
	getAvailableGeminiModels,
	getStoredApiKey,
	getStoredSelectedModel,
	isModelRateLimited,
	isResourceExhausted,
	markModelRateLimited,
	setStoredSelectedModel,
} from './aiConfig';

/**
 * Universal Gemini API Caller prioritizing healthy models with fast fallback on HTTP 429 rate limits
 */
export async function callGeminiApi(payload, apiKey, preferredModel = null) {
	const activeSelected =
		preferredModel || getStoredSelectedModel() || DEFAULT_GEMINI_MODEL;
	const realApiKey = decryptApiKey(apiKey || getStoredApiKey());

	// 1. Check if secure Node.js Express proxy is available
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

	const healthyModels = allModelIds.filter(
		(m) => !isModelRateLimited(m) && m !== activeSelected,
	);
	const rateLimitedModels = allModelIds.filter(
		(m) => isModelRateLimited(m) && m !== activeSelected,
	);

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

			const res = await apiClient.post(url, payload, { skipRetry429: true });
			if (res.data) {
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

export async function validateOpenAiApiKey(apiKey, preferredModel = null) {
	if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
		return {
			valid: false,
			message: 'Please enter your OpenAI API Key! 🔑',
		};
	}

	const cleanedKey = apiKey.replace(/^["']|["']$/g, '').trim();
	const decryptedKey = decryptApiKey(cleanedKey);

	if (decryptedKey.length < 20) {
		return {
			valid: false,
			message: 'Invalid OpenAI API Key format. Keys usually start with "sk-".',
		};
	}

	try {
		const res = await apiClient.get('https://api.openai.com/v1/models', {
			headers: {
				Authorization: `Bearer ${decryptedKey}`,
			},
			skipRetry: true,
		});

		if (res.status === 200) {
			return { valid: true, cleanedKey: decryptedKey };
		}
		return { valid: false, message: 'OpenAI API key validation failed.' };
	} catch (err) {
		const status = err.response?.status;
		const errMsg = err.response?.data?.error?.message;
		if (status === 401) {
			return {
				valid: false,
				message:
					'Invalid OpenAI API Key. Please verify your key at platform.openai.com.',
			};
		}
		return {
			valid: false,
			message:
				errMsg ||
				'Unable to connect to OpenAI API. Please check your internet connection and API key.',
		};
	}
}

export async function validateClaudeApiKey(apiKey, preferredModel = null) {
	if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
		return {
			valid: false,
			message: 'Please enter your Anthropic Claude API Key! 🔑',
		};
	}

	const cleanedKey = apiKey.replace(/^["']|["']$/g, '').trim();
	const decryptedKey = decryptApiKey(cleanedKey);

	if (decryptedKey.length < 20) {
		return {
			valid: false,
			message:
				'Invalid Anthropic Claude API Key format. Keys start with "sk-ant-".',
		};
	}

	try {
		const model = preferredModel || DEFAULT_CLAUDE_MODEL;
		const res = await apiClient.post(
			'https://api.anthropic.com/v1/messages',
			{
				model,
				max_tokens: 1,
				messages: [{ role: 'user', content: 'Hi' }],
			},
			{
				headers: {
					'x-api-key': decryptedKey,
					'anthropic-version': '2023-06-01',
					'anthropic-dangerous-direct-browser-access': 'true',
					'Content-Type': 'application/json',
				},
				skipRetry: true,
			},
		);

		if (res.status === 200) {
			return { valid: true, cleanedKey: decryptedKey };
		}
		return {
			valid: false,
			message: 'Anthropic Claude API key validation failed.',
		};
	} catch (err) {
		const status = err.response?.status;
		const errMsg = err.response?.data?.error?.message;
		if (status === 401) {
			return {
				valid: false,
				message:
					'Invalid Anthropic Claude API Key. Please verify your key at console.anthropic.com.',
			};
		}
		return {
			valid: false,
			message:
				errMsg ||
				'Unable to connect to Anthropic Claude API. Please check your internet connection and API key.',
		};
	}
}

export async function validateApiKey(
	apiKey,
	provider = null,
	preferredModel = null,
) {
	const targetProvider = provider || getActiveAiProvider();
	if (targetProvider === AI_PROVIDERS.OPENAI) {
		return validateOpenAiApiKey(apiKey, preferredModel);
	}
	if (targetProvider === AI_PROVIDERS.CLAUDE) {
		return validateClaudeApiKey(apiKey, preferredModel);
	}
	return validateGeminiApiKey(apiKey, preferredModel);
}

export async function callOpenAiApi(prompt, apiKey, preferredModel = null) {
	const realApiKey = decryptApiKey(
		apiKey || getStoredApiKey(AI_PROVIDERS.OPENAI),
	);
	if (!realApiKey) {
		throw new Error('MISSING_API_KEY');
	}

	const model =
		preferredModel ||
		getStoredSelectedModel(AI_PROVIDERS.OPENAI) ||
		DEFAULT_OPENAI_MODEL;

	const requestBody = {
		model,
		messages: [
			{
				role: 'system',
				content:
					'You are an expert educator and puzzle creator for children. Output ONLY valid, parseable JSON conforming strictly to the requested schema. Never output markdown commentary, explanations, or code fences outside the JSON.',
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		temperature: 0.75,
		response_format: { type: 'json_object' },
	};

	try {
		const res = await apiClient.post(
			'https://api.openai.com/v1/chat/completions',
			requestBody,
			{
				headers: {
					Authorization: `Bearer ${realApiKey}`,
					'Content-Type': 'application/json',
				},
				skipRetry429: true,
			},
		);

		const content = res.data?.choices?.[0]?.message?.content || '';
		return content;
	} catch (err) {
		const status = err.response?.status;
		const errMsg = err.response?.data?.error?.message || err.message || '';
		if (status === 401) {
			throw new Error(
				'Invalid OpenAI API Key. Please verify your key at platform.openai.com.',
			);
		}
		if (status === 429) {
			throw new Error(
				'OpenAI rate limit reached or insufficient quota. Check usage at platform.openai.com.',
			);
		}
		throw new Error(errMsg || 'Failed to generate questions via OpenAI API.');
	}
}

export async function callClaudeApi(prompt, apiKey, preferredModel = null) {
	const realApiKey = decryptApiKey(
		apiKey || getStoredApiKey(AI_PROVIDERS.CLAUDE),
	);
	if (!realApiKey) {
		throw new Error('MISSING_API_KEY');
	}

	const model =
		preferredModel ||
		getStoredSelectedModel(AI_PROVIDERS.CLAUDE) ||
		DEFAULT_CLAUDE_MODEL;

	const requestBody = {
		model,
		max_tokens: 4096,
		temperature: 0.75,
		system:
			'You are an expert educator and puzzle creator for children. You output strictly raw JSON matching the requested structure. Never include markdown code fences or conversational text.',
		messages: [
			{
				role: 'user',
				content: prompt,
			},
			{
				role: 'assistant',
				content: '[',
			},
		],
	};

	try {
		const res = await apiClient.post(
			'https://api.anthropic.com/v1/messages',
			requestBody,
			{
				headers: {
					'x-api-key': realApiKey,
					'anthropic-version': '2023-06-01',
					'anthropic-dangerous-direct-browser-access': 'true',
					'Content-Type': 'application/json',
				},
				skipRetry429: true,
			},
		);

		const rawText = res.data?.content?.[0]?.text || '';
		const fullJson = '[' + rawText.trim();
		return fullJson;
	} catch (err) {
		const status = err.response?.status;
		const errMsg = err.response?.data?.error?.message || err.message || '';
		if (status === 401) {
			throw new Error(
				'Invalid Anthropic Claude API Key. Please verify your key at console.anthropic.com.',
			);
		}
		if (status === 429) {
			throw new Error(
				'Anthropic Claude rate limit reached. Please check your credit balance at console.anthropic.com.',
			);
		}
		throw new Error(
			errMsg || 'Failed to generate questions via Anthropic Claude API.',
		);
	}
}
