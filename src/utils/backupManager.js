/**
 * backupManager.js
 * Cross-Device Backup & Portability Engine for AstroQuest.
 * Exports and imports complete application configuration (Explorer Profile,
 * Encrypted API Key, Gemini Model, Timers, Preferences) along with all
 * user-defined custom skillsets as a portable JSON file.
 */

import {
	getStoredEncryptedApiKey,
	getStoredSelectedModel,
	setStoredApiKey,
	setStoredSelectedModel,
} from '../services/aiGenerator';
import { getStoredVoiceURI, setStoredVoiceURI } from './audioSynthesis';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidName,
	getStoredPetAssistanceEnabled,
	getStoredPetSize,
	getStoredShowVisualDiagrams,
	getStoredTimerConfig,
	saveStoredKidProfile,
	saveStoredPetAssistanceEnabled,
	saveStoredPetSize,
	saveStoredShowVisualDiagrams,
	saveStoredTimerConfig,
} from './progressTracker';
import { getCustomSkillsets, saveCustomSkillset } from './skillManager';

/**
 * Compiles the complete backup payload containing settings and custom skillsets
 */
export function createFullBackupPayload() {
	return {
		app: 'AstroQuest',
		version: '2.0.0',
		exportedAt: new Date().toISOString(),
		settings: {
			kidName: getStoredKidName() || '',
			kidAge: Number(getStoredKidAge()) || 5,
			kidGender: getStoredKidGender() || 'boy',
			kidAvatar: getStoredKidAvatar() || 'boy-astronaut-1',
			apiKey: getStoredEncryptedApiKey() || '',
			selectedModel: getStoredSelectedModel() || '',
			timerConfig: getStoredTimerConfig(),
			showVisualDiagrams: getStoredShowVisualDiagrams(),
			petAssistanceEnabled: getStoredPetAssistanceEnabled(),
			petSize: getStoredPetSize() || 'medium',
			petType: (() => {
				try {
					return localStorage.getItem('astroquest_pet_type_v2') || 'dog';
				} catch {
					return 'dog';
				}
			})(),
			voiceURI: getStoredVoiceURI() || '',
		},
		skillsets: getCustomSkillsets(),
	};
}

/**
 * Exports complete settings and custom skillsets into a downloadable JSON file
 */
export function exportFullBackupToJsonFile() {
	const payload = createFullBackupPayload();
	const dataStr =
		'data:text/json;charset=utf-8,' +
		encodeURIComponent(JSON.stringify(payload, null, 2));
	const downloadAnchor = document.createElement('a');
	downloadAnchor.setAttribute('href', dataStr);
	downloadAnchor.setAttribute(
		'download',
		`astroquest_complete_backup_${new Date().toISOString().slice(0, 10)}.json`,
	);
	document.body.appendChild(downloadAnchor);
	downloadAnchor.click();
	downloadAnchor.remove();
}

/**
 * Imports complete settings and custom skillsets from a JSON backup string
 * Handles both full backup payloads ({ settings, skillsets }) and skillsets-only files
 */
export function importFullBackupFromJson(jsonString) {
	if (!jsonString || typeof jsonString !== 'string') {
		throw new Error('Invalid or empty JSON backup file.');
	}

	let data;
	try {
		data = JSON.parse(jsonString);
	} catch {
		throw new Error('Failed to parse JSON file. Please check the file format.');
	}

	let importedSkillCount = 0;
	let importedSettings = false;

	// 1. Import Settings
	if (data && data.settings && typeof data.settings === 'object') {
		const s = data.settings;
		if (
			s.kidName !== undefined ||
			s.kidAge !== undefined ||
			s.kidGender !== undefined ||
			s.kidAvatar !== undefined
		) {
			const name = String(s.kidName || '').trim();
			const age = Number(s.kidAge) || 5;
			const gender = String(s.kidGender || 'boy')
				.toLowerCase()
				.trim();
			const avatar = String(s.kidAvatar || 'boy-astronaut-1').trim();
			saveStoredKidProfile(name, age, gender, avatar);
		}
		if (s.apiKey) {
			setStoredApiKey(s.apiKey);
		}
		if (s.selectedModel) {
			setStoredSelectedModel(s.selectedModel);
		}
		if (s.timerConfig && typeof s.timerConfig === 'object') {
			saveStoredTimerConfig(s.timerConfig);
		}
		if (s.showVisualDiagrams !== undefined) {
			saveStoredShowVisualDiagrams(Boolean(s.showVisualDiagrams));
		}
		if (s.petAssistanceEnabled !== undefined) {
			saveStoredPetAssistanceEnabled(Boolean(s.petAssistanceEnabled));
		}
		if (s.petSize) {
			saveStoredPetSize(s.petSize);
		}
		if (s.petType) {
			try {
				localStorage.setItem('astroquest_pet_type_v2', s.petType);
			} catch {}
		}
		if (s.voiceURI !== undefined) {
			setStoredVoiceURI(s.voiceURI || null);
		}
		importedSettings = true;
	}

	// 2. Import Skillsets
	const incomingSkills =
		Array.isArray(data) ? data
		: Array.isArray(data.skillsets) ? data.skillsets
		: [];

	for (const item of incomingSkills) {
		if (item && item.name && item.description) {
			try {
				saveCustomSkillset({
					name: item.name,
					description: item.description,
					tagline: item.tagline || 'Custom Skill',
					icon: item.icon || '🚀',
					color: item.color || 'cyan',
				});
				importedSkillCount++;
			} catch (e) {
				console.warn(`Could not import skill "${item?.name}":`, e.message);
			}
		}
	}

	if (!importedSettings && importedSkillCount === 0) {
		throw new Error('No valid settings or skillsets found in the file.');
	}

	return {
		importedSettings,
		importedSkillCount,
		settings: data.settings || null,
		skillsets: incomingSkills,
	};
}
