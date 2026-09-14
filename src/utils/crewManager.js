// Multi-Child Astronaut "Flight Crew" Profiles Manager
// Enables multiple children (siblings or classroom students) to share the same device
// with isolated ages, avatars, XP, ranks, badges, and learning preferences.

import {
	getStoredAmbientEnabled,
	getStoredAmbientVolume,
	setStoredAmbientEnabled,
	setStoredAmbientVolume,
} from './ambientAudio';
import {
	getStoredVoicePersonality,
	getStoredVoiceURI,
	setStoredVoicePersonality,
	setStoredVoiceURI,
} from './audioSynthesis';
import { getStoredAchievements, saveAchievements } from './badgeManager';
import {
	getStoredKidAge,
	getStoredKidAvatar,
	getStoredKidGender,
	getStoredKidName,
	getStoredShowVisualDiagrams,
	getStoredTimerConfig,
	saveStoredKidProfile,
	saveStoredShowVisualDiagrams,
	saveStoredTimerConfig,
} from './progressTracker';

const CREW_REGISTRY_KEY = 'astroquest_crew_registry';
const ACTIVE_CREW_ID_KEY = 'astroquest_active_crew_id';

/**
 * Ensures at least one initial crew member exists based on existing localStorage settings.
 */
function ensureInitialCrew() {
	try {
		let registry = null;
		const raw = localStorage.getItem(CREW_REGISTRY_KEY);
		if (raw) {
			try {
				registry = JSON.parse(raw);
			} catch {}
		}

		if (!Array.isArray(registry) || registry.length === 0) {
			const existingName = getStoredKidName() || 'Cadet Explorer';
			const existingAge = getStoredKidAge() || 5;
			const existingGender = getStoredKidGender() || 'boy';
			const existingAvatar = getStoredKidAvatar() || 'astronaut_orange';
			const existingAch = getStoredAchievements() || { xp: 0, badges: [] };

			const initialMember = {
				id: 'crew_' + Date.now(),
				name: existingName,
				age: existingAge,
				gender: existingGender,
				avatar: existingAvatar,
				xp: existingAch.xp || 0,
				badges: existingAch.badges || [],
				timerConfig: getStoredTimerConfig(),
				showVisualDiagrams: getStoredShowVisualDiagrams(),
				voiceURI: getStoredVoiceURI() || '',
				voicePersonality: getStoredVoicePersonality() || 'classic',
				ambientEnabled: getStoredAmbientEnabled(),
				ambientVolume: getStoredAmbientVolume(),
				createdAt: new Date().toISOString(),
				lastActiveAt: new Date().toISOString(),
			};

			registry = [initialMember];
			localStorage.setItem(CREW_REGISTRY_KEY, JSON.stringify(registry));
			localStorage.setItem(ACTIVE_CREW_ID_KEY, initialMember.id);
		}

		let activeId = localStorage.getItem(ACTIVE_CREW_ID_KEY);
		if (!activeId || !registry.some((m) => m.id === activeId)) {
			activeId = registry[0].id;
			localStorage.setItem(ACTIVE_CREW_ID_KEY, activeId);
		}

		return { registry, activeId };
	} catch (err) {
		console.warn('Error in ensureInitialCrew:', err);
		return { registry: [], activeId: null };
	}
}

/**
 * Get all registered crew members
 */
export function getAllCrewMembers() {
	const { registry } = ensureInitialCrew();
	return registry || [];
}

/**
 * Get the currently active crew member ID
 */
export function getActiveCrewId() {
	const { activeId } = ensureInitialCrew();
	return activeId;
}

/**
 * Get the currently active crew member object
 */
export function getActiveCrewMember() {
	const { registry, activeId } = ensureInitialCrew();
	return registry.find((m) => m.id === activeId) || registry[0] || null;
}

/**
 * Sync current global state back into the active crew member profile in registry
 */
export function syncActiveCrewProfile() {
	try {
		const activeId = localStorage.getItem(ACTIVE_CREW_ID_KEY);
		const raw = localStorage.getItem(CREW_REGISTRY_KEY);
		if (!activeId || !raw) return;

		const registry = JSON.parse(raw);
		const index = registry.findIndex((m) => m.id === activeId);
		if (index === -1) return;

		const ach = getStoredAchievements() || { xp: 0, badges: [] };

		registry[index] = {
			...registry[index],
			name: getStoredKidName() || registry[index].name,
			age: getStoredKidAge() || registry[index].age,
			gender: getStoredKidGender() || registry[index].gender,
			avatar: getStoredKidAvatar() || registry[index].avatar,
			xp: ach.xp || 0,
			badges: ach.badges || [],
			timerConfig: getStoredTimerConfig(),
			showVisualDiagrams: getStoredShowVisualDiagrams(),
			voiceURI: getStoredVoiceURI() || '',
			voicePersonality: getStoredVoicePersonality() || 'classic',
			ambientEnabled: getStoredAmbientEnabled(),
			ambientVolume: getStoredAmbientVolume(),
			lastActiveAt: new Date().toISOString(),
		};

		localStorage.setItem(CREW_REGISTRY_KEY, JSON.stringify(registry));
	} catch (err) {
		console.warn('Could not sync active crew profile:', err);
	}
}

/**
 * Switch active crew member to targetId
 */
export function switchActiveCrewMember(targetId) {
	try {
		// 1. Sync current state before switching
		syncActiveCrewProfile();

		const raw = localStorage.getItem(CREW_REGISTRY_KEY);
		if (!raw) return null;
		const registry = JSON.parse(raw);
		const targetMember = registry.find((m) => m.id === targetId);
		if (!targetMember) return null;

		// 2. Set new active ID
		localStorage.setItem(ACTIVE_CREW_ID_KEY, targetId);

		// 3. Hydrate global localStorage keys for target member
		saveStoredKidProfile(
			targetMember.name,
			targetMember.age,
			targetMember.gender,
			targetMember.avatar,
		);
		saveAchievements({
			xp: targetMember.xp || 0,
			badges: targetMember.badges || [],
		});
		if (targetMember.timerConfig) {
			saveStoredTimerConfig(targetMember.timerConfig);
		}
		if (typeof targetMember.showVisualDiagrams === 'boolean') {
			saveStoredShowVisualDiagrams(targetMember.showVisualDiagrams);
		}
		if (targetMember.voiceURI) {
			setStoredVoiceURI(targetMember.voiceURI);
		}
		if (targetMember.voicePersonality) {
			setStoredVoicePersonality(targetMember.voicePersonality);
		}
		if (typeof targetMember.ambientEnabled === 'boolean') {
			setStoredAmbientEnabled(targetMember.ambientEnabled);
		}
		if (typeof targetMember.ambientVolume === 'number') {
			setStoredAmbientVolume(targetMember.ambientVolume);
		}

		// 4. Dispatch global event for reactive UI updates
		if (typeof window !== 'undefined') {
			window.dispatchEvent(
				new CustomEvent('astroquest:crew_switched', {
					detail: { member: targetMember },
				}),
			);
		}

		return targetMember;
	} catch (err) {
		console.warn('Error switching crew member:', err);
		return null;
	}
}

/**
 * Add a new crew member to the registry
 */
export function createCrewMember({ name, age, gender, avatar }) {
	try {
		syncActiveCrewProfile();

		const { registry } = ensureInitialCrew();
		const newMember = {
			id: 'crew_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
			name: String(name).trim() || 'Cadet',
			age: Number(age) || 5,
			gender: gender || 'boy',
			avatar: avatar || 'astronaut_orange',
			xp: 0,
			badges: [],
			timerConfig: getStoredTimerConfig(),
			showVisualDiagrams: getStoredShowVisualDiagrams(),
			voiceURI: getStoredVoiceURI() || '',
			voicePersonality: getStoredVoicePersonality() || 'classic',
			ambientEnabled: false,
			ambientVolume: 0.25,
			createdAt: new Date().toISOString(),
			lastActiveAt: new Date().toISOString(),
		};

		const updated = [...registry, newMember];
		localStorage.setItem(CREW_REGISTRY_KEY, JSON.stringify(updated));

		// Automatically switch to the newly created member
		return switchActiveCrewMember(newMember.id);
	} catch (err) {
		console.warn('Error creating crew member:', err);
		return null;
	}
}

/**
 * Delete a crew member from the registry
 */
export function deleteCrewMember(memberId) {
	try {
		const { registry, activeId } = ensureInitialCrew();
		if (registry.length <= 1) {
			console.warn('Cannot delete the last remaining crew member.');
			return false;
		}

		const updated = registry.filter((m) => m.id !== memberId);
		localStorage.setItem(CREW_REGISTRY_KEY, JSON.stringify(updated));

		if (activeId === memberId) {
			// If we deleted the active member, switch to the first remaining member
			switchActiveCrewMember(updated[0].id);
		} else {
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new CustomEvent('astroquest:crew_updated'));
			}
		}

		return true;
	} catch (err) {
		console.warn('Error deleting crew member:', err);
		return false;
	}
}
