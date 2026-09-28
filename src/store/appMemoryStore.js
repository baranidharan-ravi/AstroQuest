/**
 * AstroQuest In-Memory Reactive Store (Redux Pattern)
 *
 * Implements SOLID principles:
 * - Single Responsibility: Manages non-critical, in-memory transient application state.
 * - Open/Closed: Reducers and actions can be registered without modifying store core.
 * - Dependency Inversion: Exposes a standardized dispatch/getState/subscribe interface.
 *
 * Replaces localStorage for non-important, high-frequency, or transient state
 * (search queries, active filters, scratchpad parameters, telemetry cache, UI overlays)
 * without incurring disk I/O latency or degrading app performance.
 */

import { useSyncExternalStore } from 'react';

// Action Types
export const STORE_ACTIONS = {
	SET_SETTINGS_ACTIVE_TAB: 'ui/setSettingsActiveTab',
	SET_SEARCH_QUERY: 'ui/setSearchQuery',
	CLEAR_SEARCH_QUERY: 'ui/clearSearchQuery',
	SET_AVATAR_CATEGORY: 'ui/setAvatarCategory',
	SET_SCRATCHPAD_COLOR: 'scratchpad/setColor',
	SET_SCRATCHPAD_TOOL: 'scratchpad/setTool',
	SET_LIVE_TELEMETRY: 'telemetry/setLive',
	RESET_TRANSIENT_STATE: 'ui/resetTransient',
};

export const initialMemoryState = {
	settingsActiveTab: 'profile',
	searchQueries: {
		model: '',
		voice: '',
		skillset: '',
	},
	avatarCategory: 'All',
	scratchpad: {
		color: '#22d3ee',
		tool: 'pen',
		isGlassMode: false,
	},
	telemetryLive: {},
};

export function memoryReducer(state = initialMemoryState, action = {}) {
	switch (action.type) {
		case STORE_ACTIONS.SET_SETTINGS_ACTIVE_TAB:
			return { ...state, settingsActiveTab: action.payload };

		case STORE_ACTIONS.SET_SEARCH_QUERY:
			return {
				...state,
				searchQueries: {
					...state.searchQueries,
					[action.payload.scope]: action.payload.query,
				},
			};

		case STORE_ACTIONS.CLEAR_SEARCH_QUERY:
			return {
				...state,
				searchQueries: {
					...state.searchQueries,
					[action.payload.scope]: '',
				},
			};

		case STORE_ACTIONS.SET_AVATAR_CATEGORY:
			return { ...state, avatarCategory: action.payload };

		case STORE_ACTIONS.SET_SCRATCHPAD_COLOR:
			return {
				...state,
				scratchpad: { ...state.scratchpad, color: action.payload },
			};

		case STORE_ACTIONS.SET_SCRATCHPAD_TOOL:
			return {
				...state,
				scratchpad: { ...state.scratchpad, tool: action.payload },
			};

		case STORE_ACTIONS.SET_LIVE_TELEMETRY:
			return {
				...state,
				telemetryLive: { ...state.telemetryLive, ...action.payload },
			};

		case STORE_ACTIONS.RESET_TRANSIENT_STATE:
			return { ...initialMemoryState };

		default:
			return state;
	}
}

/**
 * MemoryStoreManager
 * Thread-safe, high-performance in-memory Redux-like store with Zero LocalStorage overhead.
 */
export class MemoryStoreManager {
	constructor(reducer = memoryReducer, defaultState = initialMemoryState) {
		this.reducer = reducer;
		this.state = defaultState;
		this.listeners = new Set();
	}

	getState = () => this.state;

	dispatch = (action) => {
		const nextState = this.reducer(this.state, action);
		if (nextState !== this.state) {
			this.state = nextState;
			this.listeners.forEach((listener) => {
				try {
					listener(this.state);
				} catch (err) {
					console.error('[MemoryStore] Listener dispatch error:', err);
				}
			});
		}
		return action;
	};

	subscribe = (listener) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	};
}

// Global Singleton Instance
export const appMemoryStore = new MemoryStoreManager();

/**
 * useMemoryStore Hook
 * Subscribes React components to in-memory state slices with high-performance useSyncExternalStore.
 */
export function useMemoryStore(selector = (s) => s) {
	return useSyncExternalStore(
		appMemoryStore.subscribe,
		() => selector(appMemoryStore.getState()),
		() => selector(initialMemoryState),
	);
}
