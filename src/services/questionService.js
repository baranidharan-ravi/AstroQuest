import { generateAIQuestions, getStoredApiKey } from './aiGenerator';
import { getOfflineQuestQuestions, isOnline } from './offlinePackService';

export const CATEGORY_DESCRIPTIONS = {
	Visual:
		'Develop your ability to analyze and spot visual patterns, spatial arrangements, and geometric relationships.',
	'Analytical Thinking':
		'Develop your ability to plan, break down logical analogies, and deduce cause-and-effect relationships.',
};

/**
 * Fetches exactly 10 fresh, unseen questions strictly calibrated to the kid's age and selected skill.
 * Automatically falls back to the high-fidelity Offline Quest Vault if internet or API key is unavailable.
 *
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 * @param {number} kidAge (e.g. 2 to 14)
 */
export async function getFreshThinksheetSession(
	selectedSkill = 'Visual',
	sheetNumber = 1,
	kidAge = 5,
) {
	const apiKey = getStoredApiKey();

	// If offline or no API key, seamlessly use the curated offline pack
	if (!isOnline() || !apiKey) {
		console.info(
			'🛰️ [Offline Vault] Seamlessly loading verified offline quest pack.',
		);
		return getOfflineQuestQuestions(10, selectedSkill);
	}

	try {
		const aiQuestions = await generateAIQuestions(
			selectedSkill,
			sheetNumber,
			kidAge,
		);

		if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length > 0) {
			return aiQuestions.slice(0, 10);
		}
	} catch (err) {
		console.warn(
			'🛰️ [Offline Vault Fallback] AI generation issue, falling back to verified offline pack:',
			err?.message || err,
		);
		return getOfflineQuestQuestions(10, selectedSkill);
	}

	return getOfflineQuestQuestions(10, selectedSkill);
}

export const getFreshAstroQuestSession = getFreshThinksheetSession;
