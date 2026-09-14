// Pure Web Audio API Procedural Deep-Space Ambient Soundscape
// Zero external asset files needed, 0 KB download size, 100% offline & battery-friendly

let ambientCtx = null;
let masterGain = null;
let droneOsc1 = null;
let droneOsc2 = null;
let droneFilter = null;
let chimeTimer = null;
let isPlaying = false;

const AMBIENT_ENABLED_KEY = 'astroquest_ambient_enabled';
const AMBIENT_VOL_KEY = 'astroquest_ambient_volume';

export function getStoredAmbientEnabled() {
	try {
		return localStorage.getItem(AMBIENT_ENABLED_KEY) === 'true';
	} catch {
		return false;
	}
}

export function setStoredAmbientEnabled(enabled) {
	try {
		localStorage.setItem(AMBIENT_ENABLED_KEY, enabled ? 'true' : 'false');
	} catch {}
}

export function getStoredAmbientVolume() {
	try {
		const val = parseFloat(localStorage.getItem(AMBIENT_VOL_KEY));
		return Number.isFinite(val) ? Math.max(0.05, Math.min(1.0, val)) : 0.25;
	} catch {
		return 0.25;
	}
}

export function setStoredAmbientVolume(vol) {
	try {
		localStorage.setItem(AMBIENT_VOL_KEY, String(vol));
	} catch {}
}

function getAmbientContext() {
	try {
		if (!ambientCtx) {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			if (AudioContext) {
				ambientCtx = new AudioContext();
			}
		}
		if (ambientCtx && ambientCtx.state === 'suspended') {
			ambientCtx.resume().catch(() => {});
		}
		return ambientCtx;
	} catch (err) {
		console.warn('Web Audio ambient context error:', err);
		return null;
	}
}

/**
 * Trigger a soft, gentle celestial chime in the pentatonic scale
 */
function playStarChime(ctx, destinationGain) {
	if (!ctx || !isPlaying) return;

	try {
		// Child-friendly cosmic pentatonic notes (C5, D5, E5, G5, A5, C6)
		const pentatonicNotes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
		const freq =
			pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
		const now = ctx.currentTime;

		const osc = ctx.createOscillator();
		const chimeGain = ctx.createGain();
		const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

		osc.type = 'sine';
		osc.frequency.setValueAtTime(freq, now);

		// Ethereal bell envelope: soft 0.15s attack, gentle 2.8s exponential decay
		chimeGain.gain.setValueAtTime(0.0001, now);
		chimeGain.gain.exponentialRampToValueAtTime(0.08, now + 0.15);
		chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

		if (panner) {
			// Subtle stereo motion across space (-0.6 to +0.6)
			const panValue = (Math.random() * 1.2 - 0.6).toFixed(2);
			panner.pan.setValueAtTime(parseFloat(panValue), now);
			osc.connect(chimeGain);
			chimeGain.connect(panner);
			panner.connect(destinationGain);
		} else {
			osc.connect(chimeGain);
			chimeGain.connect(destinationGain);
		}

		osc.start(now);
		osc.stop(now + 3.1);
	} catch {}
}

function scheduleNextChime() {
	if (!isPlaying) return;
	// Random interval between 4.5s and 8.5s for natural cosmic feel
	const interval = Math.floor(Math.random() * 4000) + 4500;
	chimeTimer = setTimeout(() => {
		if (isPlaying && ambientCtx && masterGain) {
			playStarChime(ambientCtx, masterGain);
			scheduleNextChime();
		}
	}, interval);
}

/**
 * Start the procedural ambient space soundscape
 */
export function startAmbientSound(customVol = null) {
	try {
		if (isPlaying) return;

		const ctx = getAmbientContext();
		if (!ctx) return;

		const targetVol = customVol !== null ? customVol : getStoredAmbientVolume();
		const now = ctx.currentTime;

		masterGain = ctx.createGain();
		masterGain.gain.setValueAtTime(0.0001, now);
		// Smooth 1.2-second fade-in
		masterGain.gain.linearRampToValueAtTime(targetVol, now + 1.2);
		masterGain.connect(ctx.destination);

		// Deep warm space harmonic drone (108Hz fundamental + 216.5Hz octave)
		droneFilter = ctx.createBiquadFilter();
		droneFilter.type = 'lowpass';
		droneFilter.frequency.setValueAtTime(260, now); // Warm, non-fatiguing low-pass

		droneOsc1 = ctx.createOscillator();
		droneOsc1.type = 'sine';
		droneOsc1.frequency.setValueAtTime(108, now);

		droneOsc2 = ctx.createOscillator();
		droneOsc2.type = 'sine';
		droneOsc2.frequency.setValueAtTime(216.4, now); // Gentle natural detuning for warmth

		const droneGain = ctx.createGain();
		droneGain.gain.setValueAtTime(0.35, now);

		droneOsc1.connect(droneGain);
		droneOsc2.connect(droneGain);
		droneGain.connect(droneFilter);
		droneFilter.connect(masterGain);

		droneOsc1.start(now);
		droneOsc2.start(now);

		isPlaying = true;
		scheduleNextChime();
	} catch (err) {
		console.warn('Could not start ambient sound:', err);
	}
}

/**
 * Stop the ambient sound with a smooth fade-out
 */
export function stopAmbientSound() {
	try {
		if (!isPlaying) return;
		isPlaying = false;

		if (chimeTimer) {
			clearTimeout(chimeTimer);
			chimeTimer = null;
		}

		if (ambientCtx && masterGain) {
			const now = ambientCtx.currentTime;
			// Smooth 0.8s fade out
			masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
			setTimeout(() => {
				try {
					if (droneOsc1) {
						droneOsc1.stop();
						droneOsc1.disconnect();
						droneOsc1 = null;
					}
					if (droneOsc2) {
						droneOsc2.stop();
						droneOsc2.disconnect();
						droneOsc2 = null;
					}
					if (masterGain) {
						masterGain.disconnect();
						masterGain = null;
					}
				} catch {}
			}, 900);
		}
	} catch (err) {
		console.warn('Could not stop ambient sound:', err);
	}
}

export function setAmbientVolume(volume) {
	setStoredAmbientVolume(volume);
	if (masterGain && ambientCtx && isPlaying) {
		const now = ambientCtx.currentTime;
		masterGain.gain.linearRampToValueAtTime(volume, now + 0.1);
	}
}

export function isAmbientSoundPlaying() {
	return isPlaying;
}

// Battery and tab focus lifecycle optimization
if (typeof document !== 'undefined') {
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			if (ambientCtx && ambientCtx.state === 'running') {
				ambientCtx.suspend().catch(() => {});
			}
		} else {
			if (isPlaying && ambientCtx && ambientCtx.state === 'suspended') {
				ambientCtx.resume().catch(() => {});
			}
		}
	});
}
