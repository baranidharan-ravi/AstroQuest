import { useCallback, useState } from 'react';
import {
	getAmbientAudioEnabled,
	setAmbientAudioEnabled,
	startAmbientAudio,
	stopAmbientAudio,
} from '../utils/ambientAudio';
import {
	playButtonPop,
	playCorrectSound,
	playIncorrectSound,
	playStarSound,
	playVictoryFanfare,
	speakText,
	stopSpeaking,
} from '../utils/audioSynthesis';

/**
 * Custom hook providing unified control for sound effects, ambient cosmic soundscapes, and speech.
 */
export function useCosmicAudio(initialSoundEnabled = true) {
	const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
	const [ambientEnabled, setAmbientEnabled] = useState(() =>
		getAmbientAudioEnabled(),
	);

	const toggleSound = useCallback(() => {
		setSoundEnabled((prev) => {
			const next = !prev;
			if (!next) {
				stopSpeaking();
				stopAmbientAudio();
			}
			return next;
		});
	}, []);

	const toggleAmbient = useCallback(() => {
		setAmbientEnabled((prev) => {
			const next = !prev;
			setAmbientAudioEnabled(next);
			if (next) {
				startAmbientAudio();
			} else {
				stopAmbientAudio();
			}
			return next;
		});
	}, []);

	const playPop = useCallback(
		() => playButtonPop(soundEnabled),
		[soundEnabled],
	);
	const playSuccess = useCallback(
		() => playCorrectSound(soundEnabled),
		[soundEnabled],
	);
	const playError = useCallback(
		() => playIncorrectSound(soundEnabled),
		[soundEnabled],
	);
	const playStar = useCallback(
		(idx) => playStarSound(idx, soundEnabled),
		[soundEnabled],
	);
	const playFanfare = useCallback(
		() => playVictoryFanfare(soundEnabled),
		[soundEnabled],
	);

	return {
		soundEnabled,
		ambientEnabled,
		toggleSound,
		toggleAmbient,
		playPop,
		playSuccess,
		playError,
		playStar,
		playFanfare,
		speak: speakText,
		stopSpeaking,
	};
}
