// Pure Web Audio API Sound Generator & Web Speech API Narration
// Zero external asset files needed, 100% reliable & zero latency

let audioCtx = null;

function getAudioContext() {
	try {
		if (!audioCtx) {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			if (AudioContext) {
				audioCtx = new AudioContext();
			}
		}
		if (audioCtx && audioCtx.state === 'suspended') {
			audioCtx.resume().catch(() => {});
		}
		return audioCtx;
	} catch (err) {
		console.warn('Web Audio API not supported or restricted by browser', err);
		return null;
	}
}

/**
 * Play a cheerful, bright chime for correct answers
 */
export function playCorrectSound(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)
	const now = ctx.currentTime;

	notes.forEach((freq, index) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.setValueAtTime(freq, now + index * 0.08);

		gain.gain.setValueAtTime(0, now + index * 0.08);
		gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now + index * 0.08);
		osc.stop(now + index * 0.08 + 0.36);
	});
}

/**
 * Play a gentle, encouraging cartoon "Uh oh" boing for incorrect answers
 */
export function playIncorrectSound(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;

	// Gentle low-pass filtered cartoon boing
	const osc1 = ctx.createOscillator();
	const osc2 = ctx.createOscillator();
	const gain = ctx.createGain();
	const filter = ctx.createBiquadFilter();

	filter.type = 'lowpass';
	filter.frequency.setValueAtTime(600, now);

	osc1.type = 'triangle';
	osc1.frequency.setValueAtTime(260, now);
	osc1.frequency.exponentialRampToValueAtTime(140, now + 0.3);

	osc2.type = 'sine';
	osc2.frequency.setValueAtTime(220, now + 0.1);
	osc2.frequency.exponentialRampToValueAtTime(120, now + 0.38);

	gain.gain.setValueAtTime(0.25, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

	osc1.connect(filter);
	osc2.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	osc1.start(now);
	osc1.stop(now + 0.4);
	osc2.start(now + 0.1);
	osc2.stop(now + 0.4);
}

/**
 * Play a tactile click/tap for button presses
 */
export function playButtonPop(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = 'sine';
	osc.frequency.setValueAtTime(600, now);
	osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

	gain.gain.setValueAtTime(0.15, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

	osc.connect(gain);
	gain.connect(ctx.destination);

	osc.start(now);
	osc.stop(now + 0.06);
}

/**
 * Play shimmering star sound
 */
export function playStarSound(index = 0, enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const pitches = [587.33, 739.99, 880.0]; // D5, F#5, A5
	const freq = pitches[index % pitches.length] || 880;
	const now = ctx.currentTime;

	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = 'sine';
	osc.frequency.setValueAtTime(freq, now);

	gain.gain.setValueAtTime(0.2, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

	osc.connect(gain);
	gain.connect(ctx.destination);

	osc.start(now);
	osc.stop(now + 0.5);
}

/**
 * Play complete victory fanfare
 */
export function playVictoryFanfare(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const melody = [
		{ freq: 523.25, time: 0.0, dur: 0.15 }, // C5
		{ freq: 659.25, time: 0.15, dur: 0.15 }, // E5
		{ freq: 783.99, time: 0.3, dur: 0.15 }, // G5
		{ freq: 1046.5, time: 0.45, dur: 0.45 }, // C6
		{ freq: 880.0, time: 0.9, dur: 0.2 }, // A5
		{ freq: 1046.5, time: 1.1, dur: 0.7 }, // C6 (hold)
	];

	const now = ctx.currentTime;

	melody.forEach((note) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(note.freq, now + note.time);

		gain.gain.setValueAtTime(0.25, now + note.time);
		gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now + note.time);
		osc.stop(now + note.time + note.dur + 0.05);
	});
}

// Emoji-to-word dictionary for emoji-only prompts (e.g. pattern sequences "🍎 🍌 🍎 🍌")
const EMOJI_SPEECH_MAP = {
	'🍎': 'apple',
	'🍏': 'green apple',
	'🍌': 'banana',
	'🍓': 'strawberry',
	'🍇': 'grapes',
	'🍊': 'orange',
	'🍉': 'watermelon',
	'🐶': 'puppy',
	'🐕': 'dog',
	'🐱': 'kitten',
	'🐈': 'cat',
	'🦆': 'duck',
	'🐄': 'cow',
	'🐮': 'cow',
	'🐦': 'bird',
	'🐟': 'fish',
	'🦁': 'lion',
	'🐸': 'frog',
	'🐝': 'bee',
	'🦋': 'butterfly',
	'🔴': 'red circle',
	'🔵': 'blue circle',
	'🟡': 'yellow circle',
	'🟢': 'green circle',
	'🔷': 'blue diamond',
	'⭐': 'star',
	'⬛': 'black square',
	'⬜': 'white square',
	'🚗': 'car',
	'🚀': 'rocket',
	'🎈': 'balloon',
	'🧊': 'ice cube',
	'☀️': 'sun',
	'🌙': 'moon',
	'🧢': 'hat',
	'🧦': 'socks',
};

const EMOJI_REGEX =
	/\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\uFE00-\uFE0F\u200D\u20E3]/gu;

/**
 * Clean text for friendly speech narration:
 * 1. Replaces known emojis with words (e.g. 🍎 -> "apple", 🚗 -> "car")
 * 2. Removes remaining symbols/emojis
 * 3. Strips markdown asterisks, hashes, backticks
 * 4. Normalizes whitespace
 */
export function cleanTextForSpeech(text) {
	if (!text || typeof text !== 'string') return '';
	let str = text;

	// Replace mapped emojis with spoken equivalents
	for (const [emoji, word] of Object.entries(EMOJI_SPEECH_MAP)) {
		str = str.replaceAll(emoji, ` ${word} `);
	}

	// Remove unmapped emojis or symbols
	str = str.replace(EMOJI_REGEX, ' ');

	// Strip markdown formatting (*, _, `, #, [], (), etc.)
	str = str
		.replace(/\*\*(.*?)\*\*/g, '$1')
		.replace(/\*(.*?)\*/g, '$1')
		.replace(/__(.*?)__/g, '$1')
		.replace(/_(.*?)_/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/^#+\s+/gm, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

	// Normalize spaces
	str = str.replace(/\s+/g, ' ').trim();
	return str;
}

// Pre-warm and cache speech synthesis voices across browser engines
let cachedVoices = [];
function populateVoiceList() {
	if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
		try {
			const voices = window.speechSynthesis.getVoices();
			if (voices && voices.length > 0) {
				cachedVoices = voices;
			}
		} catch {}
	}
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
	populateVoiceList();
	if (window.speechSynthesis.onvoiceschanged !== undefined) {
		window.speechSynthesis.onvoiceschanged = populateVoiceList;
	}
}

/**
 * Returns all available browser voices, loading them fresh if needed.
 */
export function getAvailableVoices() {
	if (typeof window === 'undefined' || !('speechSynthesis' in window))
		return [];
	const fresh = window.speechSynthesis.getVoices();
	if (fresh && fresh.length > 0) {
		cachedVoices = fresh;
		return fresh;
	}
	return cachedVoices || [];
}

const VOICE_URI_KEY = 'thinksheet_voice_uri';

/** Persist the user's chosen voice URI to localStorage */
export function setStoredVoiceURI(uri) {
	try {
		if (uri) {
			localStorage.setItem(VOICE_URI_KEY, uri);
		} else {
			localStorage.removeItem(VOICE_URI_KEY);
		}
	} catch {}
}

/** Read the user's stored voice URI, or null if not set */
export function getStoredVoiceURI() {
	try {
		return localStorage.getItem(VOICE_URI_KEY) || null;
	} catch {
		return null;
	}
}

/**
 * Pick the voice to use, in priority order:
 * 1. User-selected voice URI from settings
 * 2. Preferred English voice (Natural / Google / Samantha / Jenny / Guy / Aria / David / Zira)
 * 3. Any English voice
 * 4. First available voice
 */
function resolveVoice(voices) {
	if (!voices || voices.length === 0) return null;

	// 1. User-selected
	const storedUri = getStoredVoiceURI();
	if (storedUri) {
		const match = voices.find((v) => v.voiceURI === storedUri);
		if (match) return match;
	}

	// 2. Preferred English voice names
	const preferred = voices.find(
		(v) =>
			v.lang &&
			v.lang.startsWith('en') &&
			(v.name.includes('Natural') ||
				v.name.includes('Google') ||
				v.name.includes('Samantha') ||
				v.name.includes('Jenny') ||
				v.name.includes('Guy') ||
				v.name.includes('Aria') ||
				v.name.includes('David') ||
				v.name.includes('Zira') ||
				v.name.includes('Child')),
	);
	if (preferred) return preferred;

	// 3. Any English voice
	const anyEn = voices.find((v) => v.lang && v.lang.startsWith('en'));
	if (anyEn) return anyEn;

	// 4. Fallback
	return voices[0] || null;
}

let activeUtterance = null; // Hold module-level reference to prevent Chromium garbage collection

/**
 * Web Speech API Voice Narrator for Kids
 * Resilient against Chromium paused state and garbage collection quirks.
 * Always cancels any previous speech before starting a new one (single voice guarantee).
 */
export function speakText(text, onStart = null, onEnd = null) {
	try {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
			console.warn('Speech synthesis not supported on this browser.');
			if (onEnd) onEnd();
			return;
		}

		// Cancel previous speech and resume if paused
		if (window.speechSynthesis.paused) {
			window.speechSynthesis.resume();
		}
		window.speechSynthesis.cancel();
		activeUtterance = null;

		const cleaned = cleanTextForSpeech(text);
		if (!cleaned) {
			if (onEnd) onEnd();
			return;
		}

		const utterance = new SpeechSynthesisUtterance(cleaned);
		activeUtterance = utterance; // Prevent garbage collection in V8
		if (typeof window !== 'undefined') {
			window.__astroUtterance = utterance;
		}

		utterance.rate = 0.92; // natural pace for young learners
		utterance.pitch = 1.1; // friendly tone
		utterance.lang = 'en-US';

		// Resolve and apply voice (respects user's saved preference)
		const liveVoices = window.speechSynthesis.getVoices();
		const voices =
			liveVoices && liveVoices.length > 0 ? liveVoices : cachedVoices;
		if (voices && voices.length > 0) {
			cachedVoices = voices;
		}
		const voice = resolveVoice(voices);
		if (voice) {
			utterance.voice = voice;
			utterance.lang = voice.lang || 'en-US';
		}

		utterance.onstart = () => {
			if (onStart) onStart();
		};

		utterance.onend = () => {
			activeUtterance = null;
			if (onEnd) onEnd();
		};

		utterance.onerror = (err) => {
			if (err.error !== 'interrupted' && err.error !== 'canceled') {
				console.warn('Speech synthesis utterance error:', err);
			}
			activeUtterance = null;
			if (onEnd) onEnd();
		};

		// Speak immediately to preserve user gesture context in WebKit/Safari/Chromium
		if (window.speechSynthesis.paused) {
			window.speechSynthesis.resume();
		}
		window.speechSynthesis.speak(utterance);
	} catch (err) {
		console.warn('Speech synthesis error', err);
		if (onEnd) onEnd();
	}
}

export function stopSpeaking() {
	try {
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			window.speechSynthesis.cancel();
		}
		activeUtterance = null;
	} catch (err) {
		console.warn('Speech synthesis stop error', err);
	}
}

/**
 * Play an authentic, cheerful puppy bark
 */
export function playDogBark(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;

	// Friendly two-stage puppy bark
	[0, 0.16].forEach((delay, idx) => {
		const osc = ctx.createOscillator();
		const filter = ctx.createBiquadFilter();
		const gain = ctx.createGain();

		osc.type = 'sawtooth';
		filter.type = 'bandpass';
		filter.Q.setValueAtTime(3.5, now + delay);
		filter.frequency.setValueAtTime(idx === 0 ? 780 : 920, now + delay);
		filter.frequency.exponentialRampToValueAtTime(350, now + delay + 0.11);

		osc.frequency.setValueAtTime(idx === 0 ? 320 : 380, now + delay);
		osc.frequency.exponentialRampToValueAtTime(220, now + delay + 0.11);

		gain.gain.setValueAtTime(0, now + delay);
		gain.gain.linearRampToValueAtTime(0.28, now + delay + 0.015);
		gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now + delay);
		osc.stop(now + delay + 0.13);
	});
}

/**
 * Play a cute, vocalized cat meow
 */
export function playCatMeow(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const filter = ctx.createBiquadFilter();
	const gain = ctx.createGain();

	osc.type = 'triangle';
	filter.type = 'bandpass';
	filter.Q.setValueAtTime(4.0, now);

	// "Me-o-w" contour: starts around 400Hz, rises to 820Hz, then trails down to 480Hz
	osc.frequency.setValueAtTime(380, now);
	osc.frequency.linearRampToValueAtTime(740, now + 0.12);
	osc.frequency.exponentialRampToValueAtTime(460, now + 0.38);

	filter.frequency.setValueAtTime(500, now);
	filter.frequency.linearRampToValueAtTime(1100, now + 0.14);
	filter.frequency.exponentialRampToValueAtTime(600, now + 0.38);

	gain.gain.setValueAtTime(0, now);
	gain.gain.linearRampToValueAtTime(0.24, now + 0.06);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

	osc.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	osc.start(now);
	osc.stop(now + 0.39);
}

/**
 * Play a gentle munching / drinking water lap sound
 */
export function playPetSlurp(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	[0, 0.09, 0.18].forEach((delay) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.setValueAtTime(650 + Math.random() * 200, now + delay);
		osc.frequency.exponentialRampToValueAtTime(280, now + delay + 0.06);

		gain.gain.setValueAtTime(0, now + delay);
		gain.gain.linearRampToValueAtTime(0.14, now + delay + 0.01);
		gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now + delay);
		osc.stop(now + delay + 0.07);
	});
}

/**
 * Play a bouncy cartoon boing for playing with toys
 */
export function playToyBoing(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = 'sine';
	osc.frequency.setValueAtTime(240, now);
	osc.frequency.exponentialRampToValueAtTime(680, now + 0.22);

	gain.gain.setValueAtTime(0.2, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

	osc.connect(gain);
	gain.connect(ctx.destination);

	osc.start(now);
	osc.stop(now + 0.26);
}

/**
 * Play sound effect corresponding to active pet type
 */
export function playPetSound(petType = 'dog', enabled = true) {
	if (!enabled) return;

	if (petType === 'cat') {
		playCatMeow(enabled);
	} else if (petType === 'robot') {
		const ctx = getAudioContext();
		if (!ctx) return;
		const now = ctx.currentTime;
		[0, 0.08, 0.16].forEach((delay, idx) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'triangle';
			osc.frequency.setValueAtTime([880, 1174, 1480][idx], now + delay);
			gain.gain.setValueAtTime(0.15, now + delay);
			gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.07);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now + delay);
			osc.stop(now + delay + 0.08);
		});
	} else if (petType === 'alien') {
		const ctx = getAudioContext();
		if (!ctx) return;
		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(540, now);
		osc.frequency.linearRampToValueAtTime(1180, now + 0.16);
		osc.frequency.linearRampToValueAtTime(680, now + 0.3);
		gain.gain.setValueAtTime(0.18, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(now);
		osc.stop(now + 0.31);
	} else {
		playDogBark(enabled);
	}
}
