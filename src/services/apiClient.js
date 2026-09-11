/**
 * apiClient.js
 *
 * Centralised axios instance for ALL HTTP calls in ThinkSheet.
 *
 * Features:
 *  - Axios interceptors (middleware) handling network failures, status codes & common failure scenarios
 *  - Automatic retry up to 3 times on network drop / network failure / 5xx / 429
 *  - Exponential backoff between retries (1s, 2s, 4s)
 *  - Informs the user via floating notification banner that a network drop happened and is retrying
 *  - Success notification when connection is restored
 *  - Support for `skipRetry: true` on optional background probes (like local proxy healthcheck)
 */

import axios from 'axios';
import {
	hideNetworkNotification,
	showNetworkNotification,
} from '../utils/networkNotifier';

// ─── Configuration ────────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000; // 1s → 2s → 4s
const RETRY_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

// ─── Axios Instance ───────────────────────────────────────────────────────────

const apiClient = axios.create({
	timeout: 60_000, // 60s timeout
	headers: {
		'Content-Type': 'application/json',
	},
});

// ─── Retry & Classification Helpers ───────────────────────────────────────────

function isNetworkOrRetryableError(error) {
	// 1. Pure network failure / network drop (no HTTP response received)
	if (!error.response) return true;

	// 2. Retryable HTTP status codes (server overloaded, rate limit, gateway drop)
	return RETRY_STATUS_CODES.has(error.response.status);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function classifyError(error) {
	if (!error.response) {
		if (
			error.code === 'ECONNABORTED' ||
			error.message?.toLowerCase().includes('timeout')
		) {
			return {
				kind: 'timeout',
				message: 'Connection timed out due to network latency.',
			};
		}
		return {
			kind: 'network_drop',
			message: 'A network drop happened.',
		};
	}

	const status = error.response.status;
	const body = error.response.data;
	const msg = body?.error?.message || body?.message || error.message || '';

	if (status === 401 || status === 403) {
		return { kind: 'auth', message: 'Authentication error with API key.' };
	}
	if (status === 400 && msg.toLowerCase().includes('key')) {
		return { kind: 'api_key', message: 'Invalid Gemini API key.' };
	}
	if (status === 429) {
		return { kind: 'rate_limit', message: 'API rate limit reached.' };
	}
	if (status >= 500) {
		return { kind: 'server', message: `Server error encountered (${status}).` };
	}
	return { kind: 'general', message: `Request failed with code ${status}.` };
}

// ─── Request Interceptor (Middleware) ─────────────────────────────────────────

apiClient.interceptors.request.use(
	(config) => {
		if (config._retryCount === undefined) {
			config._retryCount = 0;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// ─── Response Interceptor (Middleware: Retry + Notification) ───────────────────

apiClient.interceptors.response.use(
	(response) => {
		const cfg = response.config;
		// If this request succeeded after previously retrying due to network drop, inform user
		if (cfg && cfg._retryCount > 0 && !cfg.skipRetry) {
			showNetworkNotification(
				'Network connection restored! Successfully retrieved information.',
				'success',
				3000,
			);
		}
		return response;
	},
	async (error) => {
		const config = error.config;

		// If config missing or caller opted out of retries (e.g. optional proxy probe)
		if (!config || config.skipRetry) {
			return Promise.reject(error);
		}

		const { kind, message: errorMsg } = classifyError(error);

		// Non-retryable authentication / invalid key errors should fail immediately
		if (kind === 'auth' || kind === 'api_key') {
			hideNetworkNotification();
			return Promise.reject(error);
		}

		// Fast-fail on rate limits (HTTP 429) when caller has alternative model fallbacks
		if (config.skipRetry429 && error.response?.status === 429) {
			return Promise.reject(error);
		}

		config._retryCount = config._retryCount ?? 0;

		// Check if error qualifies for retry
		if (isNetworkOrRetryableError(error) && config._retryCount < MAX_RETRIES) {
			config._retryCount += 1;
			const attempt = config._retryCount;
			const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);

			// Inform the user of retry with appropriate context (rate limit vs network drop)
			const notificationMsg =
				kind === 'rate_limit' ?
					`AI rate limit reached. Retrying (${attempt}/${MAX_RETRIES})...`
				:	`A network drop happened. Retrying to get the information again (${attempt}/${MAX_RETRIES})...`;

			showNetworkNotification(notificationMsg, 'warning');

			console.warn(
				`[apiClient] Network issue detected (${errorMsg}). Retrying attempt ${attempt}/${MAX_RETRIES} in ${backoff}ms...`,
			);

			await sleep(backoff);
			return apiClient(config);
		}

		// Retries exhausted or unrecoverable error
		if (config._retryCount >= MAX_RETRIES) {
			showNetworkNotification(
				`Network failure: Unable to reach server after ${MAX_RETRIES} retry attempts. Please check your internet connection.`,
				'error',
				8000,
			);
		}

		return Promise.reject(error);
	},
);

// ─── Convenience Wrappers ─────────────────────────────────────────────────────

export async function apiPost(url, body = {}, config = {}) {
	const resp = await apiClient.post(url, body, config);
	return resp.data;
}

export async function apiGet(url, config = {}) {
	const resp = await apiClient.get(url, config);
	return resp.data;
}

export default apiClient;
