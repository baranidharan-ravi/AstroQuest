import { getSkillDefinition } from '../../utils/skillManager';
import { findMatchingCelestialImage } from './aiConfig';
import { synchronizeDiagramData } from './diagramSynchronizer';

/**
 * Sanitizes and repairs imperfect JSON from LLMs
 */
export function cleanAndRepairJsonString(rawText) {
	if (!rawText) return '';
	let text = rawText.trim();

	// 1. Strip markdown code block wrappers
	if (text.startsWith('```')) {
		text = text
			.replace(/^```(?:json)?\s*/i, '')
			.replace(/```\s*$/i, '')
			.trim();
	}

	// 2. Fix parenthesized expressions inside arrays:
	// e.g. [("(-5, 3)"), ("(-3, 5)")] -> ["(-5, 3)", "(-3, 5)"]
	// e.g. [( "abc" ), ( 'def' )] -> ["abc", "def"]
	text = text.replace(/\(\s*("[^"\\]*(?:\\.[^"\\]*)*")\s*\)/g, '$1');
	text = text.replace(/\(\s*('[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g, '$1');

	// 3. Fix Python-style constants
	text = text
		.replace(/:\s*True\b/g, ': true')
		.replace(/:\s*False\b/g, ': false')
		.replace(/:\s*None\b/g, ': null');

	// 4. Remove trailing commas before closing braces/brackets
	text = text.replace(/,\s*([\]}])/g, '$1');

	return text;
}

/**
 * Resilient JSON Parser for Gemini/OpenAI/Claude API responses
 */
export function parseGeminiJsonResponse(rawText) {
	if (!rawText) return null;

	const cleaned = cleanAndRepairJsonString(rawText);

	// Try direct parse on cleaned string
	try {
		const parsed = JSON.parse(cleaned);
		if (Array.isArray(parsed)) return parsed;
		if (parsed && typeof parsed === 'object') {
			for (const key of Object.keys(parsed)) {
				if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
					return parsed[key];
				}
			}
		}
	} catch (err) {
		// If strict JSON.parse fails, try extracting array pattern
		try {
			const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
			if (match) {
				const repairedMatch = cleanAndRepairJsonString(match[0]);
				const parsed = JSON.parse(repairedMatch);
				if (Array.isArray(parsed)) return parsed;
			}
		} catch (innerErr) {
			// Last-ditch: parse individual JSON objects { ... } from the text
			try {
				const objectMatches = cleaned.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
				if (objectMatches && objectMatches.length > 0) {
					const items = [];
					for (const objStr of objectMatches) {
						try {
							const obj = JSON.parse(cleanAndRepairJsonString(objStr));
							if (obj.question && obj.options) {
								items.push(obj);
							}
						} catch {}
					}
					if (items.length > 0) return items;
				}
			} catch {}
		}
	}

	return null;
}

/**
 * Helper to shuffle options and format question object with diagram alignment
 */
export function shuffleAndFormatOptions(questionObj, selectedSkill) {
	if (!questionObj) return null;

	let optionTexts = [];
	let correctText = '';

	if (Array.isArray(questionObj.options)) {
		if (typeof questionObj.options[0] === 'string') {
			optionTexts = [...questionObj.options];
			correctText =
				questionObj.correctAnswer ||
				questionObj.correctAnswerId ||
				optionTexts[0];
		} else if (typeof questionObj.options[0] === 'object') {
			optionTexts = questionObj.options.map(
				(opt) => opt.text || opt.label || String(opt),
			);
			const found = questionObj.options.find(
				(opt) =>
					opt.id === questionObj.correctAnswerId ||
					opt.text === questionObj.correctAnswer,
			);
			correctText =
				found ?
					found.text || found.id
				:	questionObj.correctAnswer || optionTexts[0];
		}
	}

	if (optionTexts.length < 2) {
		optionTexts = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
		correctText = optionTexts[0];
	}

	while (optionTexts.length < 4) {
		optionTexts.push(`Choice ${optionTexts.length + 1}`);
	}

	const uniqueTexts = Array.from(
		new Set(optionTexts.map((t) => String(t).trim())),
	);
	while (uniqueTexts.length < 4) {
		uniqueTexts.push(`Choice ${uniqueTexts.length + 1}`);
	}

	const shuffledTexts = uniqueTexts.slice(0, 4).sort(() => Math.random() - 0.5);
	const letters = ['A', 'B', 'C', 'D'];

	const newOptions = shuffledTexts.map((text, idx) => ({
		id: letters[idx],
		text: String(text),
	}));

	const correctIdx = shuffledTexts.indexOf(String(correctText).trim());
	const newCorrectId = letters[correctIdx >= 0 ? correctIdx : 0];

	const qText =
		questionObj.question ||
		questionObj.questionText ||
		questionObj.q ||
		'Look at the question and choose the best answer:';

	const rawDiagramType =
		questionObj.diagramType ||
		questionObj.dt ||
		(questionObj.imageUrl ? 'image' : null);
	const rawDiagramData =
		questionObj.diagramData ||
		questionObj.dd ||
		(questionObj.imageUrl ? { imageUrl: questionObj.imageUrl } : {});

	const { type: finalDiagramType, data: synchedData } = synchronizeDiagramData(
		rawDiagramType,
		rawDiagramData,
		qText,
		correctText,
		selectedSkill,
	);

	const celestialMatch = findMatchingCelestialImage(qText);
	const assignedDiagramType =
		finalDiagramType || (celestialMatch ? 'celestial_photo' : null);
	let assignedDiagramData = null;
	if (finalDiagramType) {
		assignedDiagramData = synchedData;
	} else if (celestialMatch) {
		assignedDiagramData = { celestialImage: celestialMatch };
	}

	return {
		id:
			questionObj.id ||
			`ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
		category: selectedSkill,
		categoryDescription:
			selectedSkill === 'Visual' ?
				'Pattern Completion, Counting & Spatial Recognition'
			:	'Logical Deduction, Analogies & Critical Thinking',
		question: qText,
		questionText: qText,
		promptAudio: qText,
		celestialImage: questionObj.celestialImage || celestialMatch || null,
		diagramType: assignedDiagramType,
		diagramData: assignedDiagramData,
		solutionDiagramType: assignedDiagramType,
		solutionDiagramData: assignedDiagramData,
		imageUrl: questionObj.imageUrl || synchedData?.imageUrl || null,
		options: newOptions,
		correctAnswerId: newCorrectId,
		correctAnswerText: String(correctText),
		solutionText:
			questionObj.solution ||
			questionObj.solutionText ||
			`The correct answer is ${correctText}.`,
		hint:
			questionObj.hint ||
			'Carefully observe the clues and patterns before selecting an answer.',
	};
}

const getPedagogicalExample = (
	isDefaultVisual,
	isDefaultAnalytical,
	visualEx,
	analyticalEx,
	defaultEx,
) => {
	if (isDefaultVisual) return visualEx;
	if (isDefaultAnalytical) return analyticalEx;
	return defaultEx;
};

/**
 * Generates age-specific pedagogy rules, teacher personas, and relevant examples
 */
export function getAgeSpecificPedagogy(age, selectedSkill) {
	const numAge = parseInt(age, 10) || 5;
	const skillInfo = getSkillDefinition(selectedSkill);
	const isDefaultVisual = selectedSkill === 'Visual';
	const isDefaultAnalytical = selectedSkill === 'Analytical Thinking';
	const isCustom = !isDefaultVisual && !isDefaultAnalytical;

	if (numAge <= 4) {
		return {
			persona: `preschool and early childhood educator creating simple, colorful, engaging visual challenges for a ${numAge}-year-old toddler`,
			guidelines: `
- Keep questions super short, simple, and visual with familiar animals, fruits, and shapes.
- For Visual: simple counting (1-5 objects), AB color patterns (🔴 🔵 🔴 🔵).
- For Analytical: Animal babies (Puppy to Dog, Kitten to Cat), basic sounds, color matching.
${isCustom ? `- For "${skillInfo.name}": Keep questions super simple, fun, and age-appropriate for a toddler, focusing on: ${skillInfo.description}` : ''}`,
			examples: getPedagogicalExample(
				isDefaultVisual,
				isDefaultAnalytical,
				`Example: "How many red apples 🍎 are in the basket?" -> "diagramType": "apple-counting", "diagramData": {"count": 3, "emoji": "🍎"}, "correctAnswer": "3 apples"`,
				`Example: "Puppy 🐶 is to Dog 🐕, as Kitten 🐱 is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Puppy 🐶", "itemB": "Dog 🐕", "itemC": "Kitten 🐱", "itemD": "Cat 🐈"}, "correctAnswer": "Cat 🐈"`,
				`Example: Age-appropriate introductory question directly exploring ${skillInfo.name}.`,
			),
		};
	}

	if (numAge <= 7) {
		return {
			persona: `elementary educator creating fun, logical puzzles for a ${numAge}-year-old early elementary student`,
			guidelines: `
- Use kindergarten/early grade-school vocabulary, addition within 1-12, AAB/ABC repeating patterns.
- For Visual: Counting 4-12 objects, grid tile gaps, balance scales.
- For Analytical: Functional analogies (Bird : Nest :: Bee : Hive), everyday cause-and-effect (sun melts ice, rain grows plants), odd-one-out categories.
${isCustom ? `- For "${skillInfo.name}": Create engaging early elementary challenges directly applying: ${skillInfo.description}` : ''}`,
			examples: getPedagogicalExample(
				isDefaultVisual,
				isDefaultAnalytical,
				`Example: "Complete the pattern: 🔴 🔴 🔷 🔴 🔴 ?" -> "diagramType": "pattern-shapes", "diagramData": {"sequence": ["🔴", "🔴", "🔷", "🔴", "🔴"], "nextItem": "🔷"}, "correctAnswer": "🔷"`,
				`Example: "If you leave an ice cube 🧊 in the warm sun ☀️, what happens?" -> "diagramType": "cause-effect", "diagramData": {"cause": "Ice Cube 🧊 in Sun ☀️", "action": "melts", "effect": "Water 💧"}, "correctAnswer": "It melts into water 💧"`,
				`Example: Creative elementary puzzle centered on ${skillInfo.name}.`,
			),
		};
	}

	if (numAge <= 10) {
		return {
			persona: `upper elementary logic and STEM instructor creating thought-provoking puzzles for a ${numAge}-year-old student (Grades 3-5)`,
			guidelines: `
- DO NOT generate baby/preschool counting questions!
- Use multi-step reasoning, geometric & number sequences (e.g. 4, 8, 12, 16, ? or 3, 6, 12, 24, ?), 3D block projections, grid matrices.
- For Analytical: Higher-order analogies (Author : Novel :: Sculptor : Statue, Thermometer : Temperature :: Speedometer : Speed), scientific classification (Carnivore/Herbivore/Omnivore, States of matter, simple machines), multi-step deductive clues.
${isCustom ? `- For "${skillInfo.name}": Create rigorous upper-elementary challenges, facts, and deductions testing: ${skillInfo.description}` : ''}`,
			examples: getPedagogicalExample(
				isDefaultVisual,
				isDefaultAnalytical,
				`Example: "Look at the number sequence: 5, 10, 20, 40, ? What comes next?" -> "diagramType": "sequence-ladder", "diagramData": {"steps": ["5", "10", "20", "40"], "nextVal": "80", "rule": "x2"}, "correctAnswer": "80", "options": ["60", "70", "80", "90"]`,
				`Example: "Author is to Book, as Architect is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Author ✍️", "itemB": "Book 📖", "itemC": "Architect 📐", "itemD": "Building 🏛️"}, "correctAnswer": "Building", "options": ["Painting", "Building", "Song", "Meal"]`,
				`Example: Thought-provoking challenge testing concepts in ${skillInfo.name}.`,
			),
		};
	}

	// Ages 11-14 (Middle School / Teen)
	return {
		persona: `middle school logic, mathematics, and advanced STEM educator creating challenging analytical puzzles for a ${numAge}-year-old teenager (Grades 6-9)`,
		guidelines: `
- STRICTLY FORBIDDEN: Do NOT give young kid questions (NO simple apple counting, NO baby animal pairings like puppy-dog!).
- For Visual: Challenging numerical sequences (e.g. 2, 5, 10, 17, 26, ? or Fibonacci), geometric matrix transformations, spatial rotations, isometric block tower volumes, coordinate reflections.
- For Analytical: Advanced abstract analogies (Microscope : Microorganism :: Telescope : Distant Galaxy, Catalyst : Chemical Reaction :: Mentor : Personal Growth), deductive syllogisms, physics principles (density, balance levers, electric circuits, refraction), critical thinking puzzles.
${isCustom ? `- For "${skillInfo.name}": Present advanced critical thinking and multi-step problem solving exploring: ${skillInfo.description}` : ''}`,
		examples: getPedagogicalExample(
			isDefaultVisual,
			isDefaultAnalytical,
			`Example: "Identify the pattern rule in the sequence: 2, 5, 10, 17, 26, ? What is the next term?" -> "diagramType": "sequence-ladder", "diagramData": {"steps": ["2", "5", "10", "17", "26"], "nextVal": "37", "rule": "+3, +5, +7, +9, +11"}, "correctAnswer": "37", "options": ["35", "37", "39", "41"], "solution": "The difference between terms increases by consecutive odd numbers (+3, +5, +7, +9, +11). 26 + 11 = 37."`,
			`Example: "Microscope is to Microorganism, as Telescope is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Microscope 🔬", "itemB": "Microorganism 🦠", "itemC": "Telescope 🔭", "itemD": "Distant Galaxy 🌌"}, "correctAnswer": "Distant Galaxy", "options": ["Subatomic Particle", "Distant Galaxy", "Microscopic Cell", "Sound Wave"], "solution": "A microscope is an instrument used to observe microscopic organisms, just as a telescope is used to observe distant galaxies."`,
			`Example: Advanced conceptual question on ${skillInfo.name}.`,
		),
	};
}
