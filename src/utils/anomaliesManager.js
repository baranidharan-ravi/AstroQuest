import { ANOMALIES_MAX_ITEMS, ANOMALIES_VAULT_STORAGE_KEY } from '../constants';

/**
 * Loads all recorded anomaly questions from the Spaced-Repetition Anomalies Vault.
 */
export function getAnomalies() {
	try {
		if (typeof localStorage === 'undefined') return [];
		const raw = localStorage.getItem(ANOMALIES_VAULT_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed : [];
		}
	} catch (err) {
		console.warn('Failed to load anomalies vault:', err);
	}
	return [];
}

/**
 * Persists anomalies array to localStorage.
 */
function saveAnomalies(items) {
	try {
		if (typeof localStorage === 'undefined') return;
		const bounded = items.slice(-ANOMALIES_MAX_ITEMS);
		localStorage.setItem(ANOMALIES_VAULT_STORAGE_KEY, JSON.stringify(bounded));
	} catch (err) {
		console.warn('Failed to save anomalies vault:', err);
	}
}

/**
 * Records a question where mistakes were made, lifelines were heavily used, or time expired.
 */
export function recordAnomaly(question, reason = 'incorrect') {
	if (!question) return;
	const existing = getAnomalies();
	const qId =
		question.id ||
		question.questionId ||
		question.questionText ||
		question.question;

	// Check if already in vault
	const existingIndex = existing.findIndex(
		(item) =>
			item.id === qId ||
			item.questionText === (question.question || question.questionText),
	);

	const anomalyItem = {
		id: qId,
		questionText:
			question.question || question.questionText || 'Cosmic Challenge',
		options: question.options || [],
		correctAnswerId: question.correctAnswerId || question.answer || 'A',
		solutionText: question.solutionText || question.explanation || '',
		skillName: question.skillName || 'Cosmic Exploration',
		reason,
		masteryLevel: 0,
		firstEncountered:
			existingIndex >= 0 ?
				existing[existingIndex].firstEncountered
			:	Date.now(),
		lastReviewed: Date.now(),
	};

	if (existingIndex >= 0) {
		existing[existingIndex] = {
			...existing[existingIndex],
			...anomalyItem,
			masteryLevel: Math.max(0, existing[existingIndex].masteryLevel - 1), // Step back on repeat failure
		};
	} else {
		existing.push(anomalyItem);
	}

	saveAnomalies(existing);
	return anomalyItem;
}

/**
 * Records that an explorer successfully resolved a question from the anomalies archive.
 * Promotes mastery level; reaching Level 2 permanently dissolves the anomaly.
 */
export function recordAnomalyMastery(questionId) {
	const items = getAnomalies();
	const index = items.findIndex((i) => i.id === questionId);
	if (index === -1) return { resolved: false, bonusXp: 0 };

	const item = items[index];
	const newLevel = (item.masteryLevel || 0) + 1;

	if (newLevel >= 2) {
		// Fully mastered and resolved! Remove from black hole
		items.splice(index, 1);
		saveAnomalies(items);
		return { resolved: true, bonusXp: 25, item };
	} else {
		items[index] = {
			...item,
			masteryLevel: newLevel,
			lastReviewed: Date.now(),
		};
		saveAnomalies(items);
		return { resolved: false, bonusXp: 10, item: items[index] };
	}
}

/**
 * Returns the count of active unresolved anomalies in the vault.
 */
export function getUnresolvedAnomaliesCount() {
	return getAnomalies().length;
}

/**
 * Clears the anomalies vault.
 */
export function clearAnomaliesVault() {
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(ANOMALIES_VAULT_STORAGE_KEY);
		}
	} catch {}
}
