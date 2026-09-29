/**
 * Intelligent Concept Visual Mapper for STEM & Analogy Words
 *
 * Implements SOLID Single Responsibility:
 * Maps conceptual keywords, emojis, and educational analogies
 * to appropriate icon/emoji representations for visual learning.
 */
export function getConceptVisual(text) {
	if (!text) return { icon: '💡', label: '' };
	const str = String(text).trim();

	// Extract existing emoji if present
	const existingEmoji = str.match(
		/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u,
	);

	const cleanLabel = str
		.replace(
			/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
			'',
		)
		.replace(/^\((.+)\)$/, '$1')
		.trim();

	const lower = cleanLabel.toLowerCase();

	if (existingEmoji) {
		return { icon: existingEmoji[0], label: cleanLabel };
	}

	// Comprehensive Concept Visual Dictionary
	if (lower.includes('photosynthesis'))
		return { icon: '☀️🍃', label: cleanLabel };
	if (lower.includes('respiration')) return { icon: '⚡🫁', label: cleanLabel };
	if (
		lower.includes('plant') ||
		lower.includes('flora') ||
		lower.includes('tree') ||
		lower.includes('leaf')
	)
		return { icon: '🌱', label: cleanLabel };
	if (
		lower.includes('animal') ||
		lower.includes('cell') ||
		lower.includes('fauna') ||
		lower.includes('organism')
	)
		return { icon: '🐾', label: cleanLabel };
	if (
		lower.includes('sun') ||
		lower.includes('solar') ||
		lower.includes('light') ||
		lower.includes('prism') ||
		lower.includes('refract') ||
		lower.includes('rainbow')
	)
		return { icon: '☀️🌈', label: cleanLabel };
	if (
		lower.includes('ice') ||
		lower.includes('cold') ||
		lower.includes('freeze')
	)
		return { icon: '🧊', label: cleanLabel };
	if (
		lower.includes('water') ||
		lower.includes('liquid') ||
		lower.includes('melt') ||
		lower.includes('rain')
	)
		return { icon: '💧', label: cleanLabel };
	if (lower.includes('microscope')) return { icon: '🔬', label: cleanLabel };
	if (lower.includes('telescope')) return { icon: '🔭', label: cleanLabel };
	if (
		lower.includes('galaxy') ||
		lower.includes('star') ||
		lower.includes('space') ||
		lower.includes('planet')
	)
		return { icon: '🌌', label: cleanLabel };
	if (
		lower.includes('microorganism') ||
		lower.includes('bacteria') ||
		lower.includes('microbe') ||
		lower.includes('virus')
	)
		return { icon: '🦠', label: cleanLabel };
	if (
		lower.includes('author') ||
		lower.includes('writer') ||
		lower.includes('novel') ||
		lower.includes('book')
	)
		return { icon: '📖', label: cleanLabel };
	if (lower.includes('architect') || lower.includes('blueprint'))
		return { icon: '📐', label: cleanLabel };
	if (
		lower.includes('building') ||
		lower.includes('house') ||
		lower.includes('monument')
	)
		return { icon: '🏛️', label: cleanLabel };
	if (
		lower.includes('sculptor') ||
		lower.includes('statue') ||
		lower.includes('art')
	)
		return { icon: '🗿', label: cleanLabel };
	if (
		lower.includes('thermometer') ||
		lower.includes('temperature') ||
		lower.includes('heat')
	)
		return { icon: '🌡️', label: cleanLabel };
	if (
		lower.includes('speedometer') ||
		lower.includes('speed') ||
		lower.includes('fast')
	)
		return { icon: '🏎️', label: cleanLabel };
	if (
		lower.includes('catalyst') ||
		lower.includes('chemical') ||
		lower.includes('reaction')
	)
		return { icon: '🧪', label: cleanLabel };
	if (
		lower.includes('mentor') ||
		lower.includes('teacher') ||
		lower.includes('coach')
	)
		return { icon: '🧑‍🏫', label: cleanLabel };
	if (
		lower.includes('growth') ||
		lower.includes('develop') ||
		lower.includes('learn')
	)
		return { icon: '🚀', label: cleanLabel };
	if (lower.includes('bird') || lower.includes('fly'))
		return { icon: '🐦', label: cleanLabel };
	if (lower.includes('nest')) return { icon: '🪺', label: cleanLabel };
	if (lower.includes('bee')) return { icon: '🐝', label: cleanLabel };
	if (lower.includes('hive') || lower.includes('honey'))
		return { icon: '🍯', label: cleanLabel };
	if (lower.includes('dog') || lower.includes('puppy'))
		return { icon: '🐶', label: cleanLabel };
	if (lower.includes('cat') || lower.includes('kitten'))
		return { icon: '🐱', label: cleanLabel };
	if (
		lower.includes('fish') ||
		lower.includes('swim') ||
		lower.includes('ocean')
	)
		return { icon: '🐟', label: cleanLabel };
	if (lower.includes('cloud') || lower.includes('sky'))
		return { icon: '☁️', label: cleanLabel };
	if (lower.includes('rock') || lower.includes('stone'))
		return { icon: '🪨', label: cleanLabel };
	if (lower.includes('glass') || lower.includes('window'))
		return { icon: '🪟', label: cleanLabel };
	if (lower.includes('battery') || lower.includes('power'))
		return { icon: '🔋', label: cleanLabel };
	if (
		lower.includes('bulb') ||
		lower.includes('lamp') ||
		lower.includes('glow')
	)
		return { icon: '💡', label: cleanLabel };
	if (
		lower.includes('car') ||
		lower.includes('vehicle') ||
		lower.includes('wheel')
	)
		return { icon: '🚗', label: cleanLabel };
	if (
		lower.includes('heart') ||
		lower.includes('blood') ||
		lower.includes('pulse')
	)
		return { icon: '❤️', label: cleanLabel };
	if (lower.includes('caterpillar') || lower.includes('cocoon'))
		return { icon: '🐛', label: cleanLabel };
	if (lower.includes('butterfly')) return { icon: '🦋', label: cleanLabel };
	if (lower.includes('tadpole')) return { icon: '🫧', label: cleanLabel };
	if (lower.includes('frog')) return { icon: '🐸', label: cleanLabel };
	if (lower.includes('seed')) return { icon: '🌰', label: cleanLabel };
	if (lower.includes('flower')) return { icon: '🌸', label: cleanLabel };
	if (lower.includes('apple')) return { icon: '🍎', label: cleanLabel };
	if (lower.includes('banana')) return { icon: '🍌', label: cleanLabel };
	if (lower.includes('circle')) return { icon: '🔴', label: cleanLabel };
	if (lower.includes('triangle')) return { icon: '🔺', label: cleanLabel };
	if (lower.includes('square')) return { icon: '🟦', label: cleanLabel };

	return { icon: '💡', label: cleanLabel };
}
