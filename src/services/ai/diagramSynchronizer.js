import {
	extractShapeSequenceTerms,
	hasShapeOrVisualConcept,
	parseMatrixGridFromQuestion,
	parseRotationSequence,
	parseStepShapeCountSequence,
} from '../../utils/shapeGenerator';
import { isDiagramAppropriateForQuestion } from '../../utils/VisualDiagrams';

/**
 * Ensures diagram data mathematically and visually matches the correct answer
 * Provides rich diagram auto-detection for all questions
 *
 * Implements SOLID Single Responsibility:
 * Analyzes question semantics and synchronizes diagram geometric specs.
 */
export function synchronizeDiagramData(
	diagramType,
	rawData = {},
	questionText = '',
	correctText = '',
	selectedSkill = 'Visual',
) {
	let type = diagramType;
	const data = {
		...rawData,
		questionText,
		correctAnswerText: correctText,
	};

	const lower = questionText.toLowerCase();

	const parsedShapeCountSequence = parseStepShapeCountSequence(
		questionText,
		correctText,
	);

	const parsedRotation = parseRotationSequence(questionText, correctText);

	// 1. Auto-detect diagram type based on deep question analysis
	if (parsedRotation) {
		type = 'shape-rotation';
		Object.assign(data, parsedRotation);
	} else if (parsedShapeCountSequence) {
		type = 'shape-pattern-grid';
		data.steps = parsedShapeCountSequence.steps;
		data.targetStep = parsedShapeCountSequence.targetStep;
		data.targetCount = parsedShapeCountSequence.targetCount;
		data.shape = parsedShapeCountSequence.shape;
		data.isShaded = parsedShapeCountSequence.isShaded;
		data.color = parsedShapeCountSequence.color;
	} else if (
		lower.includes('prism') ||
		lower.includes('refraction') ||
		lower.includes('white light') ||
		lower.includes('rainbow') ||
		lower.includes('dispersion') ||
		lower.includes('bending effect') ||
		(lower.includes('light') && lower.includes('bend'))
	) {
		type = 'optics-prism';
	} else if (
		lower.includes('isometric') ||
		lower.includes('unit cube') ||
		lower.includes('block structure') ||
		lower.includes('3d tower') ||
		lower.includes('stacking') ||
		lower.includes('volume')
	) {
		type = 'block-tower';
	} else if (
		(lower.includes('3x3') &&
			(lower.includes('grid') || lower.includes('matrix'))) ||
		lower.includes('matrix')
	) {
		type = 'matrix-grid';
		const parsedGrid = parseMatrixGridFromQuestion(questionText, correctText);
		if (parsedGrid) {
			data.grid = parsedGrid.grid;
			data.answer = parsedGrid.answer;
		}
	} else if (
		lower.includes('is to') ||
		questionText.includes('::') ||
		/\b[A-Za-z0-9]+\s*:\s*[A-Za-z0-9]+\s*::/.test(questionText)
	) {
		type = 'analogy-map';
	} else if (
		lower.includes('sequence') ||
		lower.includes('pattern') ||
		lower.includes('next number') ||
		/\d+,\s*\d+,\s*\d+/.test(questionText)
	) {
		const isShape =
			hasShapeOrVisualConcept(questionText) ||
			lower.includes('shape') ||
			lower.includes('figure');
		type = isShape ? 'shape-sequence' : 'sequence-ladder';
	} else if (
		lower.includes('odd-one-out') ||
		lower.includes('odd one out') ||
		lower.includes('not belong') ||
		lower.includes('different group') ||
		lower.includes('states of matter') ||
		lower.includes('room temperature')
	) {
		type = 'odd-one-out';
		data.target = correctText;
	} else if (
		lower.includes('balance') ||
		lower.includes('scale') ||
		lower.includes('heavier') ||
		lower.includes('lighter') ||
		lower.includes('weigh')
	) {
		type = 'scale-balance';
	} else if (
		lower.includes('cause') ||
		lower.includes('effect') ||
		lower.includes('happen') ||
		lower.includes('if you leave') ||
		lower.includes('when heated') ||
		lower.includes('when cooled') ||
		lower.includes('melts') ||
		lower.includes('freeze')
	) {
		type = 'cause-effect';
	} else if (
		(lower.includes('how many') || lower.includes('count')) &&
		!lower.includes('balance') &&
		!lower.includes('scale')
	) {
		type = 'apple-counting';
	} else if (lower.includes('grid') || lower.includes('tile')) {
		type = 'grid-tiles';
	} else {
		// If no authentic, appropriate diagram matches this question,
		// DO NOT fabricate a misleading diagram! Set type = null so the question
		// is displayed cleanly without any deceptive visuals.
		type = null;
	}

	const numMatch =
		String(correctText).match(/\d+/) || String(questionText).match(/\d+/);
	const parsedNum = numMatch ? Number.parseInt(numMatch[0], 10) : null;

	// 2. Exact mathematical parameter extraction per diagram type
	if (type === 'scale-balance') {
		let leftEmoji = '🚗';
		let rightEmoji = '🧱';
		let leftLabel = '1 Toy Car';
		let rightLabel = 'Wooden Blocks';

		if (lower.includes('car')) leftEmoji = '🚗';
		else if (lower.includes('apple')) leftEmoji = '🍎';
		else if (lower.includes('ball')) leftEmoji = '⚽';
		else if (lower.includes('book')) leftEmoji = '📚';
		else if (lower.includes('coin')) leftEmoji = '🪙';
		else if (lower.includes('star')) leftEmoji = '⭐';

		if (lower.includes('block') || lower.includes('brick')) rightEmoji = '🧱';
		else if (lower.includes('cube')) rightEmoji = '🧊';
		else if (lower.includes('marble')) rightEmoji = '⚪';
		else if (lower.includes('weight') || lower.includes('gram'))
			rightEmoji = '⚖️';
		else if (lower.includes('coin')) rightEmoji = '🪙';

		const carMatch = questionText.match(
			/(\d+)\s*(?:identical\s*)?(?:toy\s*)?car/i,
		);
		const blockMatch = questionText.match(/(\d+)\s*(?:wooden\s*)?block/i);

		if (carMatch) {
			leftLabel = `${carMatch[1]} Car${Number.parseInt(carMatch[1], 10) > 1 ? 's' : ''}`;
		}
		if (blockMatch) {
			rightLabel = `${blockMatch[1]} Blocks`;
		}

		data.leftEmoji = data.leftEmoji || leftEmoji;
		data.rightEmoji = data.rightEmoji || rightEmoji;
		data.leftLabel = data.leftLabel || leftLabel;
		data.rightLabel =
			correctText ? `${correctText.trim()}` : data.rightLabel || rightLabel;
		let heavySide = 'balanced';
		if (lower.includes('heavier on the left')) {
			heavySide = 'left';
		} else if (lower.includes('heavier on the right')) {
			heavySide = 'right';
		}
		data.heavySide = heavySide;
	} else if (type === 'block-tower' || type === 'isometric-tower') {
		if (
			(lower.includes('3x3') ||
				lower.includes('9 cubes') ||
				lower.includes('9')) &&
			(lower.includes('2x2') ||
				lower.includes('4 cubes') ||
				lower.includes('4')) &&
			(lower.includes('top') ||
				lower.includes('1 single cube') ||
				lower.includes('1'))
		) {
			data.layers = [
				{ size: 3, count: 9, color: 'blue', label: 'Base Layer (3x3)' },
				{ size: 2, count: 4, color: 'amber', label: 'Middle Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = 14;
		} else if (
			(lower.includes('2x2') || lower.includes('4 cubes')) &&
			(lower.includes('1 cube') || lower.includes('top'))
		) {
			data.layers = [
				{ size: 2, count: 4, color: 'blue', label: 'Base Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = 5;
		} else if (parsedNum && parsedNum === 14) {
			data.layers = [
				{ size: 3, count: 9, color: 'blue', label: 'Base Layer (3x3)' },
				{ size: 2, count: 4, color: 'amber', label: 'Middle Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = 14;
		} else {
			data.layers = [
				{ size: 3, count: 9, color: 'blue', label: 'Base Layer (3x3)' },
				{ size: 2, count: 4, color: 'amber', label: 'Middle Layer (2x2)' },
				{ size: 1, count: 1, color: 'pink', label: 'Top Layer (1x1)' },
			];
			data.totalCubes = parsedNum || 14;
		}
	} else if (type === 'matrix-grid') {
		const parsedGrid = parseMatrixGridFromQuestion(questionText, correctText);
		if (parsedGrid) {
			data.grid = parsedGrid.grid;
			data.answer = parsedGrid.answer;
		} else {
			data.grid = data.grid || [
				['Square (Gray)', 'Circle (White)', 'Triangle (White)'],
				['Square (White)', 'Circle (Gray)', 'Triangle (White)'],
				['Square (Gray)', 'Circle (White)', '?'],
			];
			data.answer = correctText.trim() || 'Triangle (Gray)';
		}
	} else if (type === 'analogy-map') {
		const cleanQ = questionText.replace(/\?|\.{2,}/g, '').trim();
		const isToMatch = cleanQ.match(
			/(.+?)\s+is to\s+(.+?)(?:,\s*as|\s+as)\s+(.+?)\s+is to\s*(.*)/i,
		);
		const colonMatch = cleanQ.match(
			/(.+?)\s*:\s*(.+?)\s*::\s*(.+?)\s*:\s*(.*)/,
		);

		if (isToMatch) {
			data.itemA = data.itemA || isToMatch[1].trim();
			data.itemB = data.itemB || isToMatch[2].trim();
			data.itemC = data.itemC || isToMatch[3].trim();
			data.itemD = data.itemD || correctText.trim();
		} else if (colonMatch) {
			data.itemA = data.itemA || colonMatch[1].trim();
			data.itemB = data.itemB || colonMatch[2].trim();
			data.itemC = data.itemC || colonMatch[3].trim();
			data.itemD = data.itemD || correctText.trim();
		} else {
			data.itemA = data.itemA || 'Concept A';
			data.itemB = data.itemB || 'Concept B';
			data.itemC = data.itemC || 'Concept C';
			data.itemD = data.itemD || correctText.trim();
		}
	} else if (type === 'sequence-ladder') {
		const numbersInQ = questionText.match(/-?\d+(?:\.\d+)?/g);
		if (numbersInQ && numbersInQ.length >= 2) {
			if (
				!data.steps ||
				!Array.isArray(data.steps) ||
				numbersInQ.length >= data.steps.length
			) {
				data.steps = numbersInQ.map((n) => n.trim());
			}
		} else {
			data.steps =
				data.steps && data.steps.length > 0 ?
					data.steps
				:	['1st', '2nd', '3rd', '4th'];
		}
		data.nextVal = correctText.trim() || data.nextVal;
	} else if (type === 'odd-one-out') {
		data.target = data.target || correctText.trim();
		data.rule =
			data.rule ||
			'Compare the items to find the one that belongs to a different state or category';
	} else if (type === 'cause-effect') {
		const parts = questionText.split(/,|then|what happens/i);
		data.cause =
			data.cause ||
			(parts[0] ? parts[0].trim().replace(/^if\s+/i, '') : 'Event / Condition');
		let act = data.action || 'leads to';
		if (act.length > 25) {
			act = act.slice(0, 22) + '...';
		}
		data.action = act;
		data.effect = data.effect || correctText.trim();
	} else if (type === 'apple-counting') {
		const count =
			parsedNum && parsedNum > 0 && parsedNum <= 25 ?
				parsedNum
			:	Number(data.count) || 4;
		data.count = count;
		const emojiMatch = questionText.match(
			/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u,
		);
		let contextEmoji = emojiMatch ? emojiMatch[0] : null;
		if (!contextEmoji) {
			if (lower.includes('car')) contextEmoji = '🚗';
			else if (lower.includes('block') || lower.includes('brick'))
				contextEmoji = '🧱';
			else if (lower.includes('star')) contextEmoji = '⭐';
			else if (lower.includes('coin')) contextEmoji = '🪙';
			else if (lower.includes('book')) contextEmoji = '📚';
			else if (lower.includes('flower')) contextEmoji = '🌸';
			else if (lower.includes('ball')) contextEmoji = '⚽';
			else if (lower.includes('cookie')) contextEmoji = '🍪';
			else contextEmoji = '🍎';
		}
		data.emoji = data.emoji || contextEmoji;
	} else if (type === 'pattern-shapes' || type === 'shape-sequence') {
		const extracted = extractShapeSequenceTerms(questionText);
		if (extracted && extracted.length >= 2) {
			if (
				!data.sequence ||
				!Array.isArray(data.sequence) ||
				extracted.length >= data.sequence.length ||
				!data.sequence.every((it, idx) => it === extracted[idx])
			) {
				data.sequence = extracted;
			}
		} else if (
			!data.sequence ||
			!Array.isArray(data.sequence) ||
			data.sequence.length < 2
		) {
			const emojis = questionText.match(
				/(?:[🌙🌕🌖🌗🌘🌑🌒🌓🌔🌚🌛🌜🌝]|[\u2600\u{1F31E}\u{1F305}\u{1F324}]|[⭐🌟✨★☆]|[🔺🔻▲▼△▽▶◀]|[\u{1F7E0}-\u{1F7EB}]|[🔴🔵🟡🟢🟣🟠🟤⚫⚪●○■□◆◇⬛⬜]|(?:[🔷🔶🔹🔸💎💠])|(?:\u2764\uFE0F|[💙💚💛💜🧡🤍🖤🤎]))\uFE0F?/gu,
			);
			data.sequence =
				emojis && emojis.length >= 2 ?
					emojis
						.map((m) =>
							m.replace(/[\uFE0E\uFE0F\u200B-\u200D\uFEFF]/g, '').trim(),
						)
						.filter(Boolean)
				:	[
						'Triangle (white)',
						'Square (shaded)',
						'Triangle (white)',
						'Square (shaded)',
					];
		}

		if (Array.isArray(data.sequence)) {
			data.sequence = data.sequence
				.map((s) => (typeof s === 'string' ? s.trim() : s))
				.filter(
					(s) =>
						s &&
						s !== '?' &&
						!String(s).includes('?') &&
						!/^(what|which|how|find|comes)\b/i.test(String(s)),
				);
		}
		data.nextItem =
			correctText.trim() || data.nextItem || data.nextVal || data.sequence[0];
	} else if (type === 'grid-tiles') {
		const count = parsedNum && parsedNum > 0 ? parsedNum : data.count || 4;
		data.count = count;
		data.holeW = count <= 4 ? count : Math.min(4, Math.ceil(Math.sqrt(count)));
		data.holeH = Math.ceil(count / data.holeW);
		data.rows = Math.max(5, data.holeH + 2);
		data.cols = Math.max(5, data.holeW + 2);
		data.holeRow = 1;
		data.holeCol = 1;
	}

	if (!type || !isDiagramAppropriateForQuestion(type, data, questionText)) {
		return { type: null, data: null };
	}

	return { type, data };
}
