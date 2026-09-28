import { beforeEach, describe, expect, it } from 'vitest';
import {
	appMemoryStore,
	initialMemoryState,
	MemoryStoreManager,
	STORE_ACTIONS,
} from '../src/store/appMemoryStore';

describe('AppMemoryStore (In-Memory Reactive Store Suite)', () => {
	let store;

	beforeEach(() => {
		store = new MemoryStoreManager();
		appMemoryStore.dispatch({ type: STORE_ACTIONS.RESET_TRANSIENT_STATE });
	});

	it('initializes with default state values', () => {
		const state = store.getState();
		expect(state.settingsActiveTab).toBe('profile');
		expect(state.searchQueries.model).toBe('');
		expect(state.searchQueries.voice).toBe('');
		expect(state.searchQueries.skillset).toBe('');
		expect(state.avatarCategory).toBe('All');
		expect(state.scratchpad.tool).toBe('pen');
	});

	it('handles settings active tab updates without disk persistence', () => {
		store.dispatch({
			type: STORE_ACTIONS.SET_SETTINGS_ACTIVE_TAB,
			payload: 'ai',
		});
		expect(store.getState().settingsActiveTab).toBe('ai');

		store.dispatch({
			type: STORE_ACTIONS.SET_SETTINGS_ACTIVE_TAB,
			payload: 'pacing',
		});
		expect(store.getState().settingsActiveTab).toBe('pacing');
	});

	it('manages transient search queries in memory', () => {
		store.dispatch({
			type: STORE_ACTIONS.SET_SEARCH_QUERY,
			payload: { scope: 'model', query: 'gemini-2.5' },
		});
		expect(store.getState().searchQueries.model).toBe('gemini-2.5');

		store.dispatch({
			type: STORE_ACTIONS.SET_SEARCH_QUERY,
			payload: { scope: 'voice', query: 'David' },
		});
		expect(store.getState().searchQueries.voice).toBe('David');

		store.dispatch({
			type: STORE_ACTIONS.CLEAR_SEARCH_QUERY,
			payload: { scope: 'model' },
		});
		expect(store.getState().searchQueries.model).toBe('');
		expect(store.getState().searchQueries.voice).toBe('David');
	});

	it('manages scratchpad in-memory parameters and live telemetry', () => {
		store.dispatch({
			type: STORE_ACTIONS.SET_SCRATCHPAD_COLOR,
			payload: '#ec4899',
		});
		store.dispatch({
			type: STORE_ACTIONS.SET_SCRATCHPAD_TOOL,
			payload: 'eraser',
		});
		store.dispatch({
			type: STORE_ACTIONS.SET_LIVE_TELEMETRY,
			payload: { powerOutput: 1450, o2Saturation: 98 },
		});

		const state = store.getState();
		expect(state.scratchpad.color).toBe('#ec4899');
		expect(state.scratchpad.tool).toBe('eraser');
		expect(state.telemetryLive.powerOutput).toBe(1450);
		expect(state.telemetryLive.o2Saturation).toBe(98);
	});

	it('notifies subscribers upon dispatch and allows unsubscription', () => {
		let notifiedState = null;
		const unsubscribe = store.subscribe((newState) => {
			notifiedState = newState;
		});

		store.dispatch({
			type: STORE_ACTIONS.SET_AVATAR_CATEGORY,
			payload: 'Cosmic Pals',
		});

		expect(notifiedState).not.toBeNull();
		expect(notifiedState.avatarCategory).toBe('Cosmic Pals');

		// Unsubscribe
		unsubscribe();
		store.dispatch({
			type: STORE_ACTIONS.SET_AVATAR_CATEGORY,
			payload: 'Girls',
		});

		// notifiedState should still hold the previous state value
		expect(notifiedState.avatarCategory).toBe('Cosmic Pals');
		expect(store.getState().avatarCategory).toBe('Girls');
	});

	it('resets transient state cleanly', () => {
		store.dispatch({
			type: STORE_ACTIONS.SET_SETTINGS_ACTIVE_TAB,
			payload: 'audio',
		});
		store.dispatch({
			type: STORE_ACTIONS.SET_SEARCH_QUERY,
			payload: { scope: 'voice', query: 'Zira' },
		});

		expect(store.getState().settingsActiveTab).toBe('audio');
		expect(store.getState().searchQueries.voice).toBe('Zira');

		store.dispatch({ type: STORE_ACTIONS.RESET_TRANSIENT_STATE });

		expect(store.getState()).toEqual(initialMemoryState);
	});
});
