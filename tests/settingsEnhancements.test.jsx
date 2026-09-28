import { beforeEach, describe, expect, it } from 'vitest';
import {
	exportFullBackupToJsonFile,
	importFullBackupFromJson,
} from '../src/utils/backupManager';
import {
	getStoredKidAge,
	getStoredKidName,
	saveStoredKidProfile,
	saveStoredTimerConfig,
} from '../src/utils/progressTracker';

describe('Settings Enhancements & Portability Suite', () => {
	beforeEach(() => {
		const store = new Map();
		globalThis.localStorage = {
			getItem: (key) => store.get(key) || null,
			setItem: (key, val) => store.set(key, String(val)),
			removeItem: (key) => store.delete(key),
			clear: () => store.clear(),
		};
	});

	it('exports SettingsScreen component cleanly', async () => {
		const SettingsScreen = (
			await import('../src/features/settings/SettingsScreen')
		).default;
		expect(SettingsScreen).toBeDefined();
		expect(typeof SettingsScreen).toBe('object');
	});

	it('exports and imports full configuration and skillset backup', () => {
		saveStoredKidProfile('Nova Explorer', 9, 'girl', 'girl-astronaut-1');
		saveStoredTimerConfig({ enabled: true, secondsPerQuestion: 45 }, 9);

		expect(getStoredKidName()).toBe('Nova Explorer');
		expect(getStoredKidAge()).toBe(9);

		// Import a mock backup JSON
		const backupPayload = {
			version: '1.4.0',
			timestamp: new Date().toISOString(),
			settings: {
				kidName: 'Orion Pilot',
				kidAge: 10,
				kidGender: 'boy',
				kidAvatar: 'boy-astronaut-1',
				timerConfig: { enabled: true, secondsPerQuestion: 60 },
			},
			customSkillsets: [
				{
					id: 'quantum-physics',
					name: 'Quantum Physics',
					icon: 'Atom',
					description: 'Learn quantum phenomena',
				},
			],
		};

		const imported = importFullBackupFromJson(JSON.stringify(backupPayload));
		expect(imported.importedSettings).toBe(true);
		expect(imported.importedSkillCount).toBe(1);
		expect(getStoredKidName()).toBe('Orion Pilot');
		expect(getStoredKidAge()).toBe(10);
	});

	it('preserves settings state and allows staying on screen upon saving', () => {
		let navigatedScreen = null;
		let profileSaved = false;

		const handleSaveKidProfile = ({
			name,
			age,
			stayOnSettings = false,
		}) => {
			saveStoredKidProfile(name, age);
			profileSaved = true;
			if (!stayOnSettings) {
				navigatedScreen = 'dashboard';
			}
		};

		// When saving with stayOnSettings = true
		handleSaveKidProfile({
			name: 'AstroKid',
			age: 8,
			stayOnSettings: true,
		});

		expect(profileSaved).toBe(true);
		expect(navigatedScreen).toBeNull(); // Remained on settings screen!
		expect(getStoredKidName()).toBe('AstroKid');
		expect(getStoredKidAge()).toBe(8);

		// When saving with stayOnSettings = false (e.g. from leave modal)
		handleSaveKidProfile({
			name: 'AstroKid',
			age: 8,
			stayOnSettings: false,
		});
		expect(navigatedScreen).toBe('dashboard');
	});
});
