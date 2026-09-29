import { CELESTIAL_IMAGE_CATALOG } from '../../constants';

/**
 * Strict validity & relevance gatekeeper.
 * Returns false if the diagram cannot be authentically and accurately generated for this question,
 * preventing any misleading, fabricated, or nonsense imagery from ever reaching the student.
 * 
 * Implements SOLID Single Responsibility:
 * Validates pedagogical correctness and ensures diagrams strictly align with question semantics.
 */
export function isDiagramAppropriateForQuestion(
	type,
	data = {},
	questionText = '',
) {
	if (!type || !data) return false;

	const qText = String(
		questionText || data.questionText || data.question || '',
	).toLowerCase();

	switch (type) {
		case 'apple-counting': {
			// Never show apple counting for balance scales, math equations, sequences, or spatial problems
			const forbiddenKeywords = [
				'balance',
				'scale',
				'weigh',
				'pattern',
				'sequence',
				'prism',
				'cube',
				'tower',
				'rotation',
				'clockwise',
				'quadrant',
				'matrix',
				'analogy',
				'ratio',
				'fraction',
				'degree',
				'odd one out',
			];
			if (forbiddenKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}

			// Inappropriate if the question does not explicitly ask to count tangible items
			const countingDirectives = [
				'how many',
				'count',
				'total number of',
				'in the basket',
				'on the tree',
				'in the box',
				'are shown',
			];
			if (!countingDirectives.some((cd) => qText.includes(cd))) {
				return false;
			}

			const count = Number(data.count);
			if (isNaN(count) || count < 1 || count > 20) {
				return false;
			}

			// If emoji is default apple '🍎', verify question actually mentions apples or fruit
			const emoji = data.emoji;
			if (
				(!emoji || emoji === '🍎') &&
				!qText.includes('apple') &&
				!qText.includes('fruit')
			) {
				return false;
			}

			return true;
		}

		case 'scale-balance': {
			// Inappropriate if question does not mention balance, scales, or weights
			if (
				!qText.includes('balance') &&
				!qText.includes('scale') &&
				!qText.includes('weigh') &&
				!qText.includes('heavier') &&
				!qText.includes('lighter')
			) {
				return false;
			}

			// Inappropriate if question is a multi-step algebraic word problem
			// (e.g. "2 blocks and 1 marble balance 5 weights... If 1 marble weighs the same as 3 weights...")
			// A single static scale diagram cannot depict multi-clause algebra accurately without misleading!
			const isMultiClauseAlgebra =
				(qText.match(/\bbalance\b/gi) || []).length >= 2 ||
				(qText.includes('and') &&
					(qText.includes('weighs the same as') ||
						qText.includes('equal to'))) ||
				(qText.includes('if') &&
					qText.includes('then') &&
					qText.includes('balance'));

			if (isMultiClauseAlgebra && !data.isCustomMultiScale) {
				return false;
			}

			return true;
		}

		case 'pattern-shapes':
		case 'shape-sequence': {
			const items =
				Array.isArray(data.sequence) ? data.sequence
				: Array.isArray(data.steps) ? data.steps
				: [];
			if (items.length < 2) return false;
			// If it's the fallback placeholder "Triangle (white)", ensure it wasn't fabricated
			if (
				items.length === 4 &&
				items[0] === 'Triangle (white)' &&
				items[1] === 'Square (shaded)' &&
				!qText.includes('triangle') &&
				!qText.includes('square')
			) {
				return false;
			}
			return true;
		}

		case 'sequence-ladder': {
			const steps = Array.isArray(data.steps) ? data.steps : [];
			if (steps.length < 2) return false;
			if (steps.every((s) => /^\d+(st|nd|rd|th)$/i.test(String(s).trim()))) {
				return false;
			}
			return true;
		}

		case 'block-tower':
		case 'isometric-tower': {
			const towerKeywords = [
				'cube',
				'tower',
				'layer',
				'pyramid',
				'isometric',
				'block structure',
				'unit cube',
			];
			if (qText && !towerKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'optics-prism': {
			const prismKeywords = [
				'prism',
				'refract',
				'rainbow',
				'dispersion',
				'white light',
				'bending of light',
			];
			if (qText && !prismKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'analogy-map': {
			if (
				!data.itemA ||
				data.itemA === 'Concept A' ||
				!data.itemB ||
				data.itemB === 'Concept B' ||
				!data.itemC ||
				data.itemC === 'Concept C'
			) {
				return false;
			}
			return true;
		}

		case 'cause-effect': {
			if (
				!data.cause ||
				data.cause === 'Event / Condition' ||
				data.cause === '...' ||
				!data.action ||
				!data.effect
			) {
				return false;
			}
			return true;
		}

		case 'shape-rotation': {
			const rotationKeywords = [
				'rotat',
				'degree',
				'clockwise',
				'counter-clockwise',
				'turn',
				'quadrant',
			];
			if (qText && !rotationKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'grid-tiles':
		case 'matrix-grid': {
			const gridKeywords = ['grid', 'tile', 'matrix', '3x3'];
			if (qText && !gridKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'odd-one-out': {
			const oddKeywords = [
				'odd',
				'not belong',
				'different group',
				'different state',
			];
			if (qText && !oddKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'image': {
			return Boolean(data.imageUrl || data.src);
		}

		case 'celestial_photo': {
			return Boolean(
				data.celestialImage ||
				data.image ||
				CELESTIAL_IMAGE_CATALOG.some((item) =>
					item.keywords.some((kw) => qText.toLowerCase().includes(kw)),
				),
			);
		}

		default:
			return true;
	}
}

export default isDiagramAppropriateForQuestion;
