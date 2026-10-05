// Persistent storage manager for Skill Thinksheets

const STORAGE_KEY = 'thinksheet_active_session_v1';

export function saveSessionState(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (err) {
		console.warn('Could not save thinksheet session to localStorage', err);
	}
}

export function loadSessionState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch (err) {
		console.warn('Could not load thinksheet session from localStorage', err);
		return null;
	}
}

export function clearSessionState() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (err) {
		console.warn('Could not clear thinksheet session', err);
	}
}

export function exportSessionToFile(
	sessionData,
	filename = 'thinksheet_progress.json',
) {
	const jsonStr = JSON.stringify(sessionData, null, 2);
	const blob = new Blob([jsonStr], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
