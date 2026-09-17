import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Web Speech API Speech Recognition.
 * Enables children to speak their answers hands-free (e.g. "Option A", "Second one", "Red Circle").
 */
export function useSpeechRecognition({
	options = [],
	onSelectOption,
	soundEnabled = true,
	enabled = true,
}) {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState('');
	const [isSupported, setIsSupported] = useState(false);
	const [error, setError] = useState(null);
	const recognitionRef = useRef(null);

	// Check browser support on mount
	useEffect(() => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		setIsSupported(Boolean(SpeechRecognition));

		if (!SpeechRecognition) {
			return;
		}

		const recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.lang = 'en-US';

		recognition.onstart = () => {
			setIsListening(true);
			setError(null);
			setTranscript('');
		};

		recognition.onresult = (event) => {
			let currentTranscript = '';
			for (let i = event.resultIndex; i < event.results.length; i++) {
				currentTranscript += event.results[i][0].transcript;
			}
			setTranscript(currentTranscript);

			// Check for answer matches in the spoken text
			const matchId = matchSpokenOption(currentTranscript, options);
			if (matchId && onSelectOption) {
				onSelectOption(matchId);
			}
		};

		recognition.onerror = (event) => {
			console.warn('[SpeechRecognition error]:', event.error);
			setIsListening(false);
			if (event.error !== 'no-speech') {
				setError(event.error);
			}
		};

		recognition.onend = () => {
			setIsListening(false);
		};

		recognitionRef.current = recognition;

		return () => {
			try {
				recognition.abort();
			} catch (_) {}
		};
	}, [options, onSelectOption]);

	const startListening = useCallback(() => {
		if (!recognitionRef.current || isListening) return;
		try {
			setError(null);
			setTranscript('');
			recognitionRef.current.start();
		} catch (err) {
			console.warn('Could not start speech recognition:', err);
		}
	}, [isListening]);

	const stopListening = useCallback(() => {
		if (!recognitionRef.current || !isListening) return;
		try {
			recognitionRef.current.stop();
		} catch (err) {
			console.warn('Could not stop speech recognition:', err);
		}
	}, [isListening]);

	const toggleListening = useCallback(() => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	}, [isListening, startListening, stopListening]);

	return {
		isSupported,
		isListening,
		transcript,
		error,
		startListening,
		stopListening,
		toggleListening,
	};
}

/**
 * Intelligent parser mapping spoken speech to option IDs (A, B, C, D, etc.)
 */
export function matchSpokenOption(spokenText, options = []) {
	if (!spokenText || !options || options.length === 0) return null;

	const clean = spokenText.toLowerCase().trim();

	// 1. Direct letter matches
	if (/\b(option\s+a|choice\s+a|\ba\b|letter\s+a)\b/i.test(clean)) return 'A';
	if (/\b(option\s+b|choice\s+b|\bb\b|letter\s+b|bee)\b/i.test(clean))
		return 'B';
	if (/\b(option\s+c|choice\s+c|\bc\b|letter\s+c|see|sea)\b/i.test(clean))
		return 'C';
	if (/\b(option\s+d|choice\s+d|\bd\b|letter\s+d|dee)\b/i.test(clean))
		return 'D';

	// 2. Ordinal & number matches
	if (/\b(first|number 1|number one|1st)\b/i.test(clean))
		return options[0]?.id || 'A';
	if (/\b(second|number 2|number two|2nd)\b/i.test(clean))
		return options[1]?.id || 'B';
	if (/\b(third|number 3|number three|3rd)\b/i.test(clean))
		return options[2]?.id || 'C';
	if (/\b(fourth|number 4|number four|4th)\b/i.test(clean))
		return options[3]?.id || 'D';

	// 3. Match against option text content
	for (const opt of options) {
		const optText = String(opt.text || '')
			.toLowerCase()
			.trim();
		if (!optText) continue;

		// Exact or partial containment if sufficiently descriptive
		if (clean === optText || clean.includes(optText)) {
			return opt.id;
		}

		// Check word overlap for multi-word answers
		const optWords = optText.split(/\s+/).filter((w) => w.length > 2);
		if (optWords.length > 0) {
			const matchingWords = optWords.filter((w) => clean.includes(w));
			if (matchingWords.length === optWords.length) {
				return opt.id;
			}
		}
	}

	return null;
}
