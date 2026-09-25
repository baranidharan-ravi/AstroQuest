// Progress Tracker & Profile Manager for Skill Thinksheets

import {
	DEFAULT_QUESTION_TIMER_SECONDS,
	isTimerMandatoryForAge,
} from '../constants';

const PROFILE_KEY = 'thinksheet_kid_profile_v4';
const KID_NAME_KEY = 'thinksheet_custom_kid_name_v2';
const KID_AGE_KEY = 'thinksheet_custom_kid_age_v2';
const KID_GENDER_KEY = 'astroquest_kid_gender_v1';
const KID_AVATAR_KEY = 'astroquest_kid_avatar_v1';
const TIMER_CONFIG_KEY = 'thinksheet_timer_config_v1';

export const DEFAULT_TIMER_CONFIG = {
	enabled: false,
	secondsPerQuestion: DEFAULT_QUESTION_TIMER_SECONDS,
	autoAdvanceEnabled: true,
	autoAdvanceSeconds: 7,
};

export function getStoredTimerConfig(kidAge) {
	try {
		const raw =
			typeof localStorage !== 'undefined' ?
				localStorage.getItem(TIMER_CONFIG_KEY)
			:	null;
		const resolvedAge =
			kidAge !== undefined ? Number(kidAge) : Number(getStoredKidAge() || 5);
		const isMandatory = isTimerMandatoryForAge(resolvedAge);

		if (raw) {
			const parsed = JSON.parse(raw);
			return {
				enabled: isMandatory ? true : Boolean(parsed.enabled),
				secondsPerQuestion:
					Number(parsed.secondsPerQuestion) || DEFAULT_QUESTION_TIMER_SECONDS,
				autoAdvanceEnabled:
					parsed.autoAdvanceEnabled !== undefined ?
						Boolean(parsed.autoAdvanceEnabled)
					:	true,
				autoAdvanceSeconds: Number(parsed.autoAdvanceSeconds) || 7,
			};
		}

		if (isMandatory) {
			return {
				...DEFAULT_TIMER_CONFIG,
				enabled: true,
				secondsPerQuestion: DEFAULT_QUESTION_TIMER_SECONDS,
			};
		}
	} catch {}

	const resolvedAge =
		kidAge !== undefined ? Number(kidAge) : Number(getStoredKidAge() || 5);
	return isTimerMandatoryForAge(resolvedAge) ?
			{
				...DEFAULT_TIMER_CONFIG,
				enabled: true,
				secondsPerQuestion: DEFAULT_QUESTION_TIMER_SECONDS,
			}
		:	DEFAULT_TIMER_CONFIG;
}

export function saveStoredTimerConfig(config, kidAge) {
	try {
		const resolvedAge =
			kidAge !== undefined ? Number(kidAge) : Number(getStoredKidAge() || 5);
		const isMandatory = isTimerMandatoryForAge(resolvedAge);

		const normalized = {
			enabled: isMandatory ? true : Boolean(config.enabled),
			secondsPerQuestion: Math.max(
				15,
				Math.min(
					600,
					Number(config.secondsPerQuestion) || DEFAULT_QUESTION_TIMER_SECONDS,
				),
			),
			autoAdvanceEnabled:
				config.autoAdvanceEnabled !== undefined ?
					Boolean(config.autoAdvanceEnabled)
				:	true,
			autoAdvanceSeconds: Math.max(
				2,
				Math.min(60, Number(config.autoAdvanceSeconds) || 7),
			),
		};

		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(TIMER_CONFIG_KEY, JSON.stringify(normalized));
		}
		return normalized;
	} catch (err) {
		console.warn('Could not save timer config', err);
	}
}

const VISUAL_DIAGRAMS_CONFIG_KEY = 'astroquest_show_visual_diagrams_v2';

export function getStoredShowVisualDiagrams() {
	try {
		const raw = localStorage.getItem(VISUAL_DIAGRAMS_CONFIG_KEY);
		if (raw !== null) {
			return raw === 'true';
		}
	} catch {}
	return false; // Default to false (visual diagrams disabled by default)
}

export function saveStoredShowVisualDiagrams(show) {
	try {
		localStorage.setItem(VISUAL_DIAGRAMS_CONFIG_KEY, String(Boolean(show)));
	} catch (err) {
		console.warn('Could not save visual diagrams preference', err);
	}
}

export const INITIAL_PROFILE = {
	visualSolved: 0,
	analyticalSolved: 0,
	visualScores: [],
	analyticalScores: [],
	thinksheetsRemaining: 10,
	expiryDate: '31st October, 2026',
	studentName: '',
	studentAge: 5,
};

export function getStoredKidName() {
	try {
		return localStorage.getItem(KID_NAME_KEY) || '';
	} catch {
		return '';
	}
}

export function getStoredKidAge() {
	try {
		const raw = localStorage.getItem(KID_AGE_KEY);
		return raw ? parseInt(raw, 10) || 5 : 5;
	} catch {
		return 5;
	}
}

export function getStoredKidGender() {
	try {
		return localStorage.getItem(KID_GENDER_KEY) || 'boy';
	} catch {
		return 'boy';
	}
}

export function saveStoredKidGender(gender) {
	try {
		if (gender) {
			localStorage.setItem(KID_GENDER_KEY, String(gender).toLowerCase().trim());
		}
	} catch (err) {
		console.warn('Could not save kid gender to localStorage', err);
	}
}

export function getStoredKidAvatar() {
	try {
		return localStorage.getItem(KID_AVATAR_KEY) || 'boy-astronaut-1';
	} catch {
		return 'boy-astronaut-1';
	}
}

export function saveStoredKidAvatar(avatar) {
	try {
		if (avatar) {
			localStorage.setItem(KID_AVATAR_KEY, String(avatar).trim());
		}
	} catch (err) {
		console.warn('Could not save kid avatar to localStorage', err);
	}
}

export function saveStoredKidProfile(name, age, gender, avatar) {
	try {
		if (name) {
			localStorage.setItem(KID_NAME_KEY, name.trim());
		} else {
			localStorage.removeItem(KID_NAME_KEY);
		}
		if (age) {
			localStorage.setItem(KID_AGE_KEY, String(age));
		}
		if (gender) {
			localStorage.setItem(KID_GENDER_KEY, String(gender).toLowerCase().trim());
		}
		if (avatar) {
			localStorage.setItem(KID_AVATAR_KEY, String(avatar).trim());
		}
	} catch (err) {
		console.warn('Could not save kid profile to localStorage', err);
	}
}

const SELECTED_SKILL_KEY = 'thinksheet_selected_skill_v1';

export function getStoredSelectedSkill() {
	try {
		const stored = localStorage.getItem(SELECTED_SKILL_KEY);
		if (stored) return stored;
		const sessionRaw = localStorage.getItem('thinksheet_active_session_v1');
		if (sessionRaw) {
			const session = JSON.parse(sessionRaw);
			if (session && session.selectedSkill) {
				return session.selectedSkill;
			}
		}
	} catch {}
	return 'Visual';
}

export function saveStoredSelectedSkill(skill) {
	try {
		if (skill) {
			localStorage.setItem(SELECTED_SKILL_KEY, String(skill).trim());
		}
	} catch (err) {
		console.warn('Could not save selected skill to localStorage', err);
	}
}

export function loadProfileStats() {
	try {
		const raw = localStorage.getItem(PROFILE_KEY);
		const kidName = getStoredKidName();
		const kidAge = getStoredKidAge();
		if (!raw)
			return { ...INITIAL_PROFILE, studentName: kidName, studentAge: kidAge };
		return {
			...INITIAL_PROFILE,
			...JSON.parse(raw),
			studentName: kidName,
			studentAge: kidAge,
		};
	} catch {
		return INITIAL_PROFILE;
	}
}

export function saveProfileStats(stats) {
	try {
		localStorage.setItem(PROFILE_KEY, JSON.stringify(stats));
	} catch (err) {
		console.warn('Could not save profile stats', err);
	}
}

export function resetProfileStats() {
	try {
		localStorage.removeItem(PROFILE_KEY);
		localStorage.removeItem(KID_NAME_KEY);
		localStorage.removeItem(KID_AGE_KEY);
	} catch (err) {
		console.warn('Could not clear profile stats', err);
	}
	return INITIAL_PROFILE;
}

/**
 * Record a completed Thinksheet session and update stats
 */
export function recordCompletedSheet(skill, scorePercent) {
	const profile = loadProfileStats();

	if (skill === 'Visual') {
		profile.visualSolved = (profile.visualSolved || 0) + 1;
		profile.visualScores = [...(profile.visualScores || []), scorePercent];
	} else if (skill === 'Analytical Thinking') {
		profile.analyticalSolved = (profile.analyticalSolved || 0) + 1;
		profile.analyticalScores = [
			...(profile.analyticalScores || []),
			scorePercent,
		];
	} else {
		// Custom Skillset Tracking
		profile.customSkills = profile.customSkills || {};
		const skillKey = String(skill || 'Custom').trim();
		profile.customSkills[skillKey] = profile.customSkills[skillKey] || {
			solved: 0,
			scores: [],
		};
		profile.customSkills[skillKey].solved += 1;
		profile.customSkills[skillKey].scores.push(scorePercent);
	}

	if (profile.thinksheetsRemaining > 0) {
		profile.thinksheetsRemaining = Math.max(
			0,
			profile.thinksheetsRemaining - 1,
		);
	}

	saveProfileStats(profile);
	return profile;
}

/**
 * Calculate skill level (LV1 to LV5) and title based on solved count & score
 */
export function calculateSkillLevel(solvedCount, scores = []) {
	if (solvedCount === 0) {
		return {
			levelNumber: 1,
			levelTitle: 'Beginner',
			progressPercent: 0,
			avgScore: 0,
		};
	}

	const avg =
		scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;

	let levelNumber = 1;
	let levelTitle = 'Learner';
	let progressPercent = 20;

	if (solvedCount >= 20 && avg >= 85) {
		levelNumber = 5;
		levelTitle = 'Master';
		progressPercent = 100;
	} else if (solvedCount >= 12 && avg >= 75) {
		levelNumber = 4;
		levelTitle = 'Proficient';
		progressPercent = 80;
	} else if (solvedCount >= 8 && avg >= 70) {
		levelNumber = 3;
		levelTitle = 'Capable';
		progressPercent = 60;
	} else if (solvedCount >= 4) {
		levelNumber = 2;
		levelTitle = 'Explorer';
		progressPercent = 40;
	} else {
		levelNumber = 1;
		levelTitle = 'Learner';
		progressPercent = 20;
	}

	return {
		levelNumber,
		levelTitle,
		progressPercent,
		avgScore: Math.round(avg),
	};
}
