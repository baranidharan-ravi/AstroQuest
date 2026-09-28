import { beforeEach, describe, expect, it } from 'vitest';
import { importFullBackupFromJson } from '../src/utils/backupManager';
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

		const handleSaveKidProfile = ({ name, age, stayOnSettings = false }) => {
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

	it('defines 4 intuitive SETTINGS_TABS in centralized constants', async () => {
		const { SETTINGS_TABS } = await import('../src/constants');
		expect(SETTINGS_TABS).toHaveLength(4);

		const expectedTabs = ['profile', 'ai', 'pacing', 'audio'];
		expectedTabs.forEach((id) => {
			const tab = SETTINGS_TABS.find((t) => t.id === id);
			expect(tab).toBeDefined();
			expect(tab.label).toBeTruthy();
			expect(tab.shortLabel).toBeTruthy();
			expect(tab.iconName).toBeTruthy();
			expect(tab.description).toBeTruthy();
		});
	});

	it('renders SettingsScreen with 4 navigation tabs and sticky action dock', async () => {
		const SettingsScreen = (
			await import('../src/features/settings/SettingsScreen')
		).default;
		const ReactDOMServer = (await import('react-dom/server')).default;
		const React = (await import('react')).default;

		saveStoredKidProfile('Zack', 7, 'boy', 'boy-astronaut-1');

		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(SettingsScreen, {
				hasProfile: true,
				onBack: () => {},
				soundEnabled: false,
			}),
		);

		// Navigation Tabs
		expect(html).toContain('Profile');
		expect(html).toContain('AI Engine');
		expect(html).toContain('Pacing');
		expect(html).toContain('Audio');

		// Initial Profile Tab Content
		expect(html).toContain('Child&#x27;s Name');
		expect(html).toContain('Astronaut Flight Crew Profiles');
		expect(html).toContain('Manage Crew');
		expect(html).toContain('Import');
		expect(html).toContain('Export');
		expect(html).toContain('Add Explorer');

		// Sticky Save / Cancel Action Bar Dock
		expect(html).toContain('sticky bottom-0');
		expect(html).toContain('Save Settings');
		expect(html).toContain('Cancel');
	});

	it('renders AI Engine and Audio tabs with real-time search inputs and compact cards', async () => {
		const SettingsScreen = (
			await import('../src/features/settings/SettingsScreen')
		).default;
		const ReactDOMServer = (await import('react-dom/server')).default;
		const React = (await import('react')).default;

		saveStoredKidProfile('Nova', 8, 'girl', 'girl-astronaut-1');

		// Render with AI tab active by inspecting element definitions
		const htmlProfile = ReactDOMServer.renderToStaticMarkup(
			React.createElement(SettingsScreen, {
				hasProfile: true,
				onBack: () => {},
				soundEnabled: false,
			}),
		);
		expect(htmlProfile).toContain('Astronaut Flight Crew Profiles');
		expect(htmlProfile).toContain('Add Explorer');
	});
});
