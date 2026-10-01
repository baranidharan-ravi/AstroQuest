export function hasShapeOrVisualConcept(text) {
	if (!text) return false;
	const cleanText = String(text)
		.replace(/[\uFE0E\uFE0F\u200B-\u200D\uFEFF]/g, '')
		.trim();
	if (!cleanText) return false;
	const lower = cleanText.toLowerCase();
	return (
		lower.includes('triangle') ||
		lower.includes('square') ||
		lower.includes('circle') ||
		lower.includes('pentagon') ||
		lower.includes('hexagon') ||
		lower.includes('heptagon') ||
		lower.includes('octagon') ||
		lower.includes('nonagon') ||
		lower.includes('decagon') ||
		lower.includes('star') ||
		lower.includes('moon') ||
		lower.includes('crescent') ||
		lower.includes('sun') ||
		lower.includes('heart') ||
		lower.includes('diamond') ||
		lower.includes('rhombus') ||
		lower.includes('sides') ||
		lower.includes('white') ||
		lower.includes('shaded') ||
		lower.includes('gray') ||
		lower.includes('grey') ||
		lower.includes('blue') ||
		lower.includes('green') ||
		lower.includes('red') ||
		lower.includes('cyan') ||
		lower.includes('yellow') ||
		lower.includes('orange') ||
		lower.includes('purple') ||
		lower.includes('pink') ||
		lower.includes('[') ||
		/(?:[🌙🌕🌖🌗🌘🌑🌒🌓🌔🌚🌛🌜🌝]|[\u2600\u{1F31E}\u{1F305}\u{1F324}]|[⭐🌟✨★☆]|[🔺🔻▲▼△▽▶◀]|[\u{1F7E0}-\u{1F7EB}]|[🔴🔵🟡🟢🟣🟠🟤⚫⚪●○■□◆◇⬛⬜]|(?:[🔷🔶🔹🔸💎💠])|(?:[❤️💙💚💛💜🧡🤍🖤🤎]))\uFE0F?/u.test(
			cleanText,
		) ||
		/[\u{1F300}-\u{1F6FF}\u{1F780}-\u{1F7FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}]/u.test(
			cleanText,
		)
	);
}

/**
 * Computes exact regular polygon points for any N-sided regular polygon (N >= 3)
 */
export function getRegularPolygonPoints(sides, cx = 36, cy = 36, r = 28) {
	const points = [];
	const startAngle = -Math.PI / 2; // Point top vertex up
	for (let i = 0; i < sides; i++) {
		const angle = startAngle + (i * 2 * Math.PI) / sides;
		const x = (cx + r * Math.cos(angle)).toFixed(1);
		const y = (cy + r * Math.sin(angle)).toFixed(1);
		points.push(`${x},${y}`);
	}
	return points.join(' ');
}

/**
 * Parses any raw text descriptor, emoji, or bracketed term into a complete visual shape specification.
 * Handles:
 * - Geometric shapes: Triangle (3), Square (4), Pentagon (5), Hexagon (6), Heptagon (7), Octagon (8), Nonagon (9), Decagon (10), Circle (0), Star, Diamond, Heart
 * - Colors: Blue, Green, Red, Cyan, Yellow, Orange, Purple, Pink, Gold, Teal, Navy, etc.
 * - Shading / Fill: White (empty/outline), Shaded (diagonal hatch / dark slate fill), Solid color
 * - Numbers and side counts: (3 sides), (4 sides), or numerical values
 */
export function parseDynamicShape(rawInput) {
	if (!rawInput) {
		return null;
	}

	const text = String(rawInput)
		.replace(/[\uFE0E\uFE0F\u200B-\u200D\uFEFF]/g, '')
		.replace(/^\[|\]$/g, '')
		.replace(/^\((.+)\)$/, '$1')
		.trim();

	if (!text) return null;

	const lower = text.toLowerCase();

	// Check if this is an emoji or unicode shape
	if (text.includes('🔺') || text.includes('🔻'))
		return {
			shape: 'triangle',
			sides: 3,
			color: '#EF4444',
			colorName: 'Red',
			shapeName: 'Triangle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Red',
			raw: text,
		};
	if (text.includes('▲') || text.includes('▼'))
		return {
			shape: 'triangle',
			sides: 3,
			color: '#1E293B',
			colorName: 'Black',
			shapeName: 'Triangle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Black',
			raw: text,
		};
	if (text.includes('△') || text.includes('▽'))
		return {
			shape: 'triangle',
			sides: 3,
			color: '#3B82F6',
			colorName: 'White',
			shapeName: 'Triangle',
			isWhite: true,
			isShaded: false,
			styleTag: 'White',
			raw: text,
		};

	if (text.includes('🟩'))
		return {
			shape: 'square',
			sides: 4,
			color: '#10B981',
			colorName: 'Green',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Green',
			raw: text,
		};
	if (text.includes('🟥'))
		return {
			shape: 'square',
			sides: 4,
			color: '#EF4444',
			colorName: 'Red',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Red',
			raw: text,
		};
	if (text.includes('🟦'))
		return {
			shape: 'square',
			sides: 4,
			color: '#3B82F6',
			colorName: 'Blue',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Blue',
			raw: text,
		};
	if (text.includes('🟨'))
		return {
			shape: 'square',
			sides: 4,
			color: '#F59E0B',
			colorName: 'Yellow',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Yellow',
			raw: text,
		};
	if (text.includes('🟪'))
		return {
			shape: 'square',
			sides: 4,
			color: '#8B5CF6',
			colorName: 'Purple',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Purple',
			raw: text,
		};
	if (text.includes('🟧'))
		return {
			shape: 'square',
			sides: 4,
			color: '#F97316',
			colorName: 'Orange',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Orange',
			raw: text,
		};
	if (text.includes('🟫'))
		return {
			shape: 'square',
			sides: 4,
			color: '#78350F',
			colorName: 'Brown',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Brown',
			raw: text,
		};
	if (text.includes('⬛') || text.includes('■'))
		return {
			shape: 'square',
			sides: 4,
			color: '#1E293B',
			colorName: 'Black',
			shapeName: 'Square',
			isWhite: false,
			isShaded: false,
			styleTag: 'Black',
			raw: text,
		};
	if (text.includes('⬜') || text.includes('□'))
		return {
			shape: 'square',
			sides: 4,
			color: '#3B82F6',
			colorName: 'White',
			shapeName: 'Square',
			isWhite: true,
			isShaded: false,
			styleTag: 'White',
			raw: text,
		};

	if (text.includes('🔴'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#EF4444',
			colorName: 'Red',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Red',
			raw: text,
		};
	if (text.includes('🔵'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#3B82F6',
			colorName: 'Blue',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Blue',
			raw: text,
		};
	if (text.includes('🟡'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#F59E0B',
			colorName: 'Yellow',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Yellow',
			raw: text,
		};
	if (text.includes('🟢'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#10B981',
			colorName: 'Green',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Green',
			raw: text,
		};
	if (text.includes('🟣'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#8B5CF6',
			colorName: 'Purple',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Purple',
			raw: text,
		};
	if (text.includes('🟠'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#F97316',
			colorName: 'Orange',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Orange',
			raw: text,
		};
	if (text.includes('🟤'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#78350F',
			colorName: 'Brown',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Brown',
			raw: text,
		};
	if (text.includes('⚫') || text.includes('●'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#1E293B',
			colorName: 'Black',
			shapeName: 'Circle',
			isWhite: false,
			isShaded: false,
			styleTag: 'Black',
			raw: text,
		};
	if (text.includes('⚪') || text.includes('○'))
		return {
			shape: 'circle',
			sides: 0,
			color: '#3B82F6',
			colorName: 'White',
			shapeName: 'Circle',
			isWhite: true,
			isShaded: false,
			styleTag: 'White',
			raw: text,
		};

	if (text.includes('🔷') || text.includes('🔹'))
		return {
			shape: 'diamond',
			sides: 4,
			color: '#3B82F6',
			colorName: 'Blue',
			shapeName: 'Diamond',
			isWhite: false,
			isShaded: false,
			styleTag: 'Blue',
			raw: text,
		};
	if (text.includes('🔶') || text.includes('🔸'))
		return {
			shape: 'diamond',
			sides: 4,
			color: '#F97316',
			colorName: 'Orange',
			shapeName: 'Diamond',
			isWhite: false,
			isShaded: false,
			styleTag: 'Orange',
			raw: text,
		};
	if (text.includes('◆'))
		return {
			shape: 'diamond',
			sides: 4,
			color: '#1E293B',
			colorName: 'Black',
			shapeName: 'Diamond',
			isWhite: false,
			isShaded: false,
			styleTag: 'Black',
			raw: text,
		};
	if (text.includes('◇'))
		return {
			shape: 'diamond',
			sides: 4,
			color: '#3B82F6',
			colorName: 'White',
			shapeName: 'Diamond',
			isWhite: true,
			isShaded: false,
			styleTag: 'White',
			raw: text,
		};

	if (text.includes('⭐') || text.includes('🌟') || text.includes('✨'))
		return {
			shape: 'star',
			sides: 5,
			color: '#F59E0B',
			colorName: 'Gold',
			shapeName: 'Star',
			isWhite: false,
			isShaded: false,
			styleTag: 'Gold',
			raw: text,
		};
	if (text.includes('★'))
		return {
			shape: 'star',
			sides: 5,
			color: '#1E293B',
			colorName: 'Black',
			shapeName: 'Star',
			isWhite: false,
			isShaded: false,
			styleTag: 'Black',
			raw: text,
		};
	if (text.includes('☆'))
		return {
			shape: 'star',
			sides: 5,
			color: '#3B82F6',
			colorName: 'White',
			shapeName: 'Star',
			isWhite: true,
			isShaded: false,
			styleTag: 'White',
			raw: text,
		};

	if (text.includes('❤️'))
		return {
			shape: 'heart',
			sides: 0,
			color: '#EF4444',
			colorName: 'Red',
			shapeName: 'Heart',
			isWhite: false,
			isShaded: false,
			styleTag: 'Red',
			raw: text,
		};
	if (text.includes('💙'))
		return {
			shape: 'heart',
			sides: 0,
			color: '#3B82F6',
			colorName: 'Blue',
			shapeName: 'Heart',
			isWhite: false,
			isShaded: false,
			styleTag: 'Blue',
			raw: text,
		};
	if (text.includes('💚'))
		return {
			shape: 'heart',
			sides: 0,
			color: '#10B981',
			colorName: 'Green',
			shapeName: 'Heart',
			isWhite: false,
			isShaded: false,
			styleTag: 'Green',
			raw: text,
		};
	if (text.includes('💛'))
		return {
			shape: 'heart',
			sides: 0,
			color: '#F59E0B',
			colorName: 'Yellow',
			shapeName: 'Heart',
			isWhite: false,
			isShaded: false,
			styleTag: 'Yellow',
			raw: text,
		};
	if (text.includes('💜'))
		return {
			shape: 'heart',
			sides: 0,
			color: '#8B5CF6',
			colorName: 'Purple',
			shapeName: 'Heart',
			isWhite: false,
			isShaded: false,
			styleTag: 'Purple',
			raw: text,
		};
	if (text.includes('🧡'))
		return {
			shape: 'heart',
			sides: 0,
			color: '#F97316',
			colorName: 'Orange',
			shapeName: 'Heart',
			isWhite: false,
			isShaded: false,
			styleTag: 'Orange',
			raw: text,
		};

	if (
		text.includes('🌙') ||
		text.includes('🌕') ||
		text.includes('🌖') ||
		text.includes('🌗') ||
		text.includes('🌘') ||
		text.includes('🌑') ||
		text.includes('🌒') ||
		text.includes('🌓') ||
		text.includes('🌔') ||
		text.includes('🌚') ||
		text.includes('🌛') ||
		text.includes('🌜') ||
		text.includes('🌝') ||
		lower.includes('moon') ||
		lower.includes('crescent')
	)
		return {
			shape: 'moon',
			sides: 0,
			color: '#F59E0B',
			colorName: 'Gold',
			shapeName: 'Moon',
			isWhite: false,
			isShaded: false,
			styleTag: 'Gold',
			raw: text,
		};

	if (text.includes('☀️') || text.includes('🌞') || text.includes('🌅'))
		return {
			shape: 'sun',
			sides: 0,
			color: '#F59E0B',
			colorName: 'Gold',
			shapeName: 'Sun',
			isWhite: false,
			isShaded: false,
			styleTag: 'Gold',
			raw: text,
		};

	if (text.includes('⚡'))
		return {
			shape: 'lightning',
			sides: 0,
			color: '#F59E0B',
			colorName: 'Gold',
			shapeName: 'Lightning',
			isWhite: false,
			isShaded: false,
			styleTag: 'Gold',
			raw: text,
		};

	if (text.includes('☁️') || text.includes('☁'))
		return {
			shape: 'cloud',
			sides: 0,
			color: '#3B82F6',
			colorName: 'Blue',
			shapeName: 'Cloud',
			isWhite: false,
			isShaded: false,
			styleTag: 'Blue',
			raw: text,
		};

	// 1. Determine Shape and Side Count from text keywords
	let shape = null;
	let sides = 0;
	let shapeName = '';

	if (
		lower.includes('triangle') ||
		lower.includes('3 sides') ||
		lower.includes('3-sided')
	) {
		shape = 'triangle';
		sides = 3;
		shapeName = 'Triangle';
	} else if (
		lower.includes('square') ||
		lower.includes('4 sides') ||
		lower.includes('4-sided') ||
		lower.includes('quadrilateral') ||
		lower.includes('rect')
	) {
		shape = 'square';
		sides = 4;
		shapeName = 'Square';
	} else if (
		lower.includes('pentagon') ||
		lower.includes('5 sides') ||
		lower.includes('5-sided')
	) {
		shape = 'pentagon';
		sides = 5;
		shapeName = 'Pentagon';
	} else if (
		lower.includes('hexagon') ||
		lower.includes('6 sides') ||
		lower.includes('6-sided')
	) {
		shape = 'hexagon';
		sides = 6;
		shapeName = 'Hexagon';
	} else if (
		lower.includes('heptagon') ||
		lower.includes('7 sides') ||
		lower.includes('7-sided')
	) {
		shape = 'heptagon';
		sides = 7;
		shapeName = 'Heptagon';
	} else if (
		lower.includes('octagon') ||
		lower.includes('8 sides') ||
		lower.includes('8-sided')
	) {
		shape = 'octagon';
		sides = 8;
		shapeName = 'Octagon';
	} else if (
		lower.includes('nonagon') ||
		lower.includes('enneagon') ||
		lower.includes('9 sides')
	) {
		shape = 'nonagon';
		sides = 9;
		shapeName = 'Nonagon';
	} else if (lower.includes('decagon') || lower.includes('10 sides')) {
		shape = 'decagon';
		sides = 10;
		shapeName = 'Decagon';
	} else if (lower.includes('star')) {
		shape = 'star';
		sides = 5;
		shapeName = 'Star';
	} else if (lower.includes('moon') || lower.includes('crescent')) {
		shape = 'moon';
		sides = 0;
		shapeName = 'Moon';
	} else if (lower.includes('sun') || lower.includes('sunburst')) {
		shape = 'sun';
		sides = 0;
		shapeName = 'Sun';
	} else if (lower.includes('heart')) {
		shape = 'heart';
		sides = 0;
		shapeName = 'Heart';
	} else if (lower.includes('diamond') || lower.includes('rhombus')) {
		shape = 'diamond';
		sides = 4;
		shapeName = 'Diamond';
	} else if (lower.includes('circle') || lower.includes('round')) {
		shape = 'circle';
		sides = 0;
		shapeName = 'Circle';
	}

	// 2. Check for explicit sides in parentheses e.g. "(3 sides)" or "(6 sides)"
	const sidesMatch = text.match(/(\d+)\s*sides?/i);
	let sidesCount = null;
	if (sidesMatch) {
		sidesCount = parseInt(sidesMatch[1], 10);
	} else if (sides > 0) {
		sidesCount = sides;
	}

	if (sidesCount && sidesCount >= 3 && !shape) {
		sides = sidesCount;
		if (sides === 3) {
			shape = 'triangle';
			shapeName = 'Triangle';
		} else if (sides === 4) {
			shape = 'square';
			shapeName = 'Square';
		} else if (sides === 5) {
			shape = 'pentagon';
			shapeName = 'Pentagon';
		} else if (sides === 6) {
			shape = 'hexagon';
			shapeName = 'Hexagon';
		} else if (sides === 7) {
			shape = 'heptagon';
			shapeName = 'Heptagon';
		} else if (sides === 8) {
			shape = 'octagon';
			shapeName = 'Octagon';
		} else if (sides === 9) {
			shape = 'nonagon';
			shapeName = 'Nonagon';
		} else if (sides === 10) {
			shape = 'decagon';
			shapeName = 'Decagon';
		}
	}

	// 3. Determine Fill Style (White, Shaded, Striped, Dotted, Solid, or Specific Color)
	const isStriped =
		lower.includes('striped') ||
		lower.includes('stripe') ||
		lower.includes('stripes') ||
		lower.includes('hatch') ||
		lower.includes('lined');

	const isDotted =
		lower.includes('dotted') ||
		lower.includes('dots') ||
		lower.includes('spotted') ||
		lower.includes('polka');

	const isSolid =
		lower.includes('solid') ||
		lower.includes('filled') ||
		lower.includes('full');

	const isWhite =
		lower.includes('white') ||
		lower.includes('unshaded') ||
		lower.includes('blank') ||
		lower.includes('empty') ||
		lower.includes('hollow') ||
		lower.includes('clear');

	const isShaded =
		lower.includes('shaded') ||
		lower.includes('dark') ||
		lower.includes('grey') ||
		lower.includes('gray') ||
		lower.includes('black');

	let color = '#6366F1'; // Default primary indigo
	let colorName = 'Indigo';

	if (isWhite) {
		color = '#FFFFFF';
		colorName = 'White';
	} else if (isShaded) {
		color = '#334155'; // Dark slate shaded
		colorName = 'Shaded';
	} else if (lower.includes('blue') || lower.includes('navy')) {
		color = '#3B82F6';
		colorName = 'Blue';
	} else if (
		lower.includes('green') ||
		lower.includes('emerald') ||
		lower.includes('lime')
	) {
		color = '#10B981';
		colorName = 'Green';
	} else if (
		lower.includes('red') ||
		lower.includes('crimson') ||
		lower.includes('rose')
	) {
		color = '#EF4444';
		colorName = 'Red';
	} else if (
		lower.includes('cyan') ||
		lower.includes('teal') ||
		lower.includes('sky') ||
		lower.includes('turquoise')
	) {
		color = '#06B6D4';
		colorName = 'Cyan';
	} else if (
		lower.includes('yellow') ||
		lower.includes('gold') ||
		lower.includes('amber')
	) {
		color = '#F59E0B';
		colorName = 'Yellow';
	} else if (lower.includes('orange')) {
		color = '#F97316';
		colorName = 'Orange';
	} else if (lower.includes('purple') || lower.includes('violet')) {
		color = '#8B5CF6';
		colorName = 'Purple';
	} else if (lower.includes('pink') || lower.includes('magenta')) {
		color = '#EC4899';
		colorName = 'Pink';
	}

	if (!isWhite && !isShaded && colorName === 'Indigo') {
		if (shape === 'star' || shape === 'sun' || shape === 'moon') {
			color = '#F59E0B';
			colorName = 'Gold';
		} else if (shape === 'heart') {
			color = '#EF4444';
			colorName = 'Red';
		}
	}

	// 4. Extract quadrant position if present (e.g. top-left, top-right, bottom-left, bottom-right)
	const isQuadrant =
		lower.includes('top-left') ||
		lower.includes('top left') ||
		lower.includes('top-right') ||
		lower.includes('top right') ||
		lower.includes('bottom-left') ||
		lower.includes('bottom left') ||
		lower.includes('bottom-right') ||
		lower.includes('bottom right') ||
		lower.includes('quadrant');

	let quadrant = 'top-right';
	if (lower.includes('top-left') || lower.includes('top left'))
		quadrant = 'top-left';
	else if (lower.includes('top-right') || lower.includes('top right'))
		quadrant = 'top-right';
	else if (lower.includes('bottom-left') || lower.includes('bottom left'))
		quadrant = 'bottom-left';
	else if (lower.includes('bottom-right') || lower.includes('bottom right'))
		quadrant = 'bottom-right';

	// 5. Extract standalone progression number (if not the side count)
	let number = null;
	const allNumbers = text.match(/-?\d+(?:\.\d+)?/g);
	if (allNumbers && allNumbers.length > 0) {
		if (sidesMatch) {
			const sideVal = sidesMatch[1];
			const remaining = allNumbers.filter((n) => n !== sideVal);
			if (remaining.length > 0) number = remaining[0];
		} else {
			number = allNumbers[0];
		}
	}

	let styleTag = '';
	if (isDotted) styleTag = 'Dotted';
	else if (isStriped) styleTag = 'Striped';
	else if (isSolid) styleTag = 'Solid';
	else if (isWhite) styleTag = 'White';
	else if (isShaded) styleTag = 'Shaded';
	else if (colorName !== 'Indigo') styleTag = colorName;
	else if (sidesCount) styleTag = `${sidesCount} sides`;

	if (!shape && isQuadrant) {
		shape = 'quadrant-square';
		shapeName = 'Quadrant Square';
	}

	if (!shape) {
		return null;
	}

	return {
		raw: text,
		shape: isQuadrant ? 'quadrant-square' : shape,
		sides,
		sidesCount,
		color,
		colorName,
		isWhite,
		isShaded,
		isStriped,
		isDotted,
		isSolid,
		number,
		shapeName: isQuadrant ? 'Quadrant Square' : shapeName,
		styleTag,
		isQuadrant,
		quadrant,
	};
}

/**
 * Renders an exact SVG geometric shape with filled color, diagonal hatch shading, quadrant division, and bold contrast borders
 */

export function extractShapeSequenceTerms(questionText, defaultTerms = []) {
	if (!questionText) return defaultTerms;

	// 1. Check for bracketed items: e.g. [Blue Circle, 3], [Green Square, 6]
	const bracketMatches = questionText.match(/\[[^\]]+\]/g);
	if (bracketMatches && bracketMatches.length >= 2) {
		return bracketMatches.map((s) => s.trim());
	}

	// 2. Check for parenthesized terms: e.g. Triangle (3 sides, white), Square (4 sides, shaded)
	const parenPattern = /([A-Za-z]+)\s*\(([^)]+)\)/g;
	const parenMatches = [];
	let match;
	while ((match = parenPattern.exec(questionText)) !== null) {
		parenMatches.push(`${match[1]} (${match[2]})`);
	}
	if (parenMatches.length >= 2) {
		return parenMatches;
	}

	// 3. Extract shape & symbol emojis if 2 or more are present!
	const SHAPE_EMOJI_REGEX =
		/(?:[🌙🌕🌖🌗🌘🌑🌒🌓🌔🌚🌛🌜🌝]|[\u2600\u{1F31E}\u{1F305}\u{1F324}]|[⭐🌟✨★☆]|[🔺🔻▲▼△▽▶◀]|[\u{1F7E0}-\u{1F7EB}]|[🔴🔵🟡🟢🟣🟠🟤⚫⚪●○■□◆◇⬛⬜]|(?:[🔷🔶🔹🔸💎💠])|(?:[❤️💙💚💛💜🧡🤍🖤🤎]))\uFE0F?/gu;

	// If questionText has multiple lines, find the line that contains the sequence pattern (e.g. contains ? or multiple emojis)
	// to avoid picking up decorative emojis in the question title/prompt (e.g. "What shape comes next in the pattern? ⭐")
	let emojiSearchText = questionText;
	const lines = String(questionText)
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);
	if (lines.length > 1) {
		const seqLine = lines.find(
			(l) =>
				(l.includes('?') || l.includes('➔') || l.includes('→')) &&
				(l.match(SHAPE_EMOJI_REGEX) || []).length >= 2,
		);
		if (seqLine) {
			emojiSearchText = seqLine;
		} else {
			const candidateLine = lines.find(
				(l) => (l.match(SHAPE_EMOJI_REGEX) || []).length >= 2,
			);
			if (candidateLine) emojiSearchText = candidateLine;
		}
	} else {
		// Single line with leading question prompt e.g. "What shape comes next in the pattern? ⭐ 🌙 ⭐ 🌙 ⭐ ?"
		// Strip the question prompt before the first sequence block if it ends with ? or :
		const colonSplit = questionText.split(/:\s*/);
		if (
			colonSplit.length > 1 &&
			(colonSplit[colonSplit.length - 1].match(SHAPE_EMOJI_REGEX) || [])
				.length >= 2
		) {
			emojiSearchText = colonSplit.pop();
		} else {
			const qMarkMatch = questionText.match(/^([^?]+\?\s*)(.+)$/s);
			if (
				qMarkMatch &&
				(qMarkMatch[2].match(SHAPE_EMOJI_REGEX) || []).length >= 2
			) {
				emojiSearchText = qMarkMatch[2];
			}
		}
	}

	const emojiMatches = emojiSearchText.match(SHAPE_EMOJI_REGEX);
	if (emojiMatches && emojiMatches.length >= 2) {
		const validMatches = emojiMatches
			.map((m) => m.replace(/[\uFE0E\uFE0F\u200B-\u200D\uFEFF]/g, '').trim())
			.filter(Boolean);
		if (validMatches.length >= 2) {
			return validMatches;
		}
	}

	// 4. Split by arrow (➔, ->, →) or comma
	const candidate = questionText.split(/:\s*/).pop();
	const cleaned = candidate
		.replace(/\?.*$/, '')
		.replace(
			/^(?:what|which|how|find|identify|look at).*?\b(?:pattern|sequence|progression)\b[:\s]*/i,
			'',
		)
		.trim();

	const arrowSplit = cleaned.split(/\s*(?:➔|->|→)\s*/);
	if (arrowSplit.length >= 2) {
		const valid = arrowSplit.filter(
			(s) => s && s !== '?' && !s.startsWith('?'),
		);
		if (valid.length >= 2) return valid;
	}

	const commaSplit = cleaned.split(/,\s*(?![^()]*\))/);
	if (commaSplit.length >= 2) {
		const valid = commaSplit.filter(
			(s) =>
				s &&
				s !== '?' &&
				!s.startsWith('?') &&
				!/^(what|which|how|find|comes)\b/i.test(s),
		);
		if (valid.length >= 2) return valid;
	}

	// 5. Check if question contains sequences separated by spaces or dashes
	const spaceTokens = cleaned
		.split(/[\s-]+/)
		.filter((t) => hasShapeOrVisualConcept(t));
	if (spaceTokens.length >= 2) {
		return spaceTokens;
	}

	return defaultTerms;
}

/**
 * Parses multi-step growing shape count progressions e.g.
 * "Step 1 has 1 shaded square, Step 2 has 3 shaded squares, Step 3 has 6 shaded squares, Step 4 has 10 shaded squares..."
 */
export function parseStepShapeCountSequence(questionText, correctText = '') {
	if (!questionText) return null;

	const stepRegex =
		/(?:Step|Figure|Stage)\s*(\d+)\s*(?:has|contains|shows|is|=|:)\s*(\d+)\s*([^,.]+)/gi;
	const steps = [];
	let match;

	while ((match = stepRegex.exec(questionText)) !== null) {
		const stepNum = parseInt(match[1], 10);
		const count = parseInt(match[2], 10);
		const rawDesc = match[3].trim();
		const parsed = parseDynamicShape(rawDesc);

		steps.push({
			step: stepNum,
			count,
			shape: parsed.shape || 'square',
			shapeName: parsed.shapeName || 'Square',
			isShaded: parsed.isShaded ?? true,
			isWhite: parsed.isWhite ?? false,
			color: parsed.color || '#3B82F6',
			rawDesc,
		});
	}

	if (steps.length < 2) return null;

	// Extract target step e.g. "how many shaded squares are in Step 6?"
	const targetStepMatch = questionText.match(
		/(?:in|at|for)\s*(?:Step|Figure|Stage)\s*(\d+)/i,
	);
	const targetStep =
		targetStepMatch ?
			parseInt(targetStepMatch[1], 10)
		:	steps[steps.length - 1].step + 2;

	const numInCorrect = String(correctText).match(/\d+/);
	const targetCount =
		numInCorrect ?
			parseInt(numInCorrect[0], 10)
		:	(targetStep * (targetStep + 1)) / 2;

	return {
		steps,
		targetStep,
		targetCount,
		shape: steps[0].shape,
		isShaded: steps[0].isShaded,
		color: steps[0].color,
	};
}

/**
 * Renders an exact cluster of N shapes (e.g. 1 square, 3 squares, 6 squares, 10 squares)
 */

export function parseRotationSequence(questionText, correctText = '') {
	if (!questionText) return null;
	const lower = questionText.toLowerCase();

	const hasRotation =
		lower.includes('rotat') ||
		lower.includes('degree') ||
		lower.includes('clockwise') ||
		lower.includes('quadrant');

	if (!hasRotation) return null;

	// Extract angle
	const angleMatch = questionText.match(/(\d+)\s*(?:deg|degree)/i);
	const angle = angleMatch ? parseInt(angleMatch[1], 10) : 90;

	// Extract direction
	const isCCW =
		lower.includes('counter-clockwise') ||
		lower.includes('counterclockwise') ||
		lower.includes('ccw') ||
		lower.includes('anti-clockwise') ||
		lower.includes('anticlockwise');
	const direction = isCCW ? 'CCW' : 'CW';

	// Quadrant cycle: Top-Right (0) -> Bottom-Right (1) -> Bottom-Left (2) -> Top-Left (3)
	const quadCycle = ['top-right', 'bottom-right', 'bottom-left', 'top-left'];

	// Match positions in order of appearance in the question
	const foundPositions = [];
	const posLookups = [
		{
			id: 'top-right',
			idx:
				lower.indexOf('top-right') !== -1 ?
					lower.indexOf('top-right')
				:	lower.indexOf('top right'),
		},
		{
			id: 'bottom-right',
			idx:
				lower.indexOf('bottom-right') !== -1 ?
					lower.indexOf('bottom-right')
				:	lower.indexOf('bottom right'),
		},
		{
			id: 'bottom-left',
			idx:
				lower.indexOf('bottom-left') !== -1 ?
					lower.indexOf('bottom-left')
				:	lower.indexOf('bottom left'),
		},
		{
			id: 'top-left',
			idx:
				lower.indexOf('top-left') !== -1 ?
					lower.indexOf('top-left')
				:	lower.indexOf('top left'),
		},
	];

	const sortedLookups = posLookups
		.filter((p) => p.idx !== -1)
		.sort((a, b) => a.idx - b.idx);

	if (sortedLookups.length >= 2) {
		const steps = sortedLookups.map((p, idx) => ({
			step: idx + 1,
			quadrant: p.id,
			shape: 'quadrant-square',
			isQuadrant: true,
			isShaded: true,
			deg: idx * angle * (isCCW ? -1 : 1),
		}));

		const lastQuad = sortedLookups[sortedLookups.length - 1].id;
		const lastCycleIdx = quadCycle.indexOf(lastQuad);
		const targetCycleIdx =
			isCCW ? (lastCycleIdx - 1 + 4) % 4 : (lastCycleIdx + 1) % 4;
		const targetQuad = quadCycle[targetCycleIdx];

		return {
			isQuadrant: true,
			angle,
			direction,
			steps,
			target: {
				step: steps.length + 1,
				quadrant: targetQuad,
				shape: 'quadrant-square',
				isQuadrant: true,
				isShaded: true,
				deg: steps.length * angle * (isCCW ? -1 : 1),
			},
		};
	}

	// General angle rotation fallback
	return {
		isQuadrant: false,
		angle,
		direction,
		steps: [
			{ step: 1, deg: 0, shape: 'square', isShaded: true },
			{ step: 2, deg: angle, shape: 'square', isShaded: true },
			{ step: 3, deg: angle * 2, shape: 'square', isShaded: true },
		],
		target: {
			step: 4,
			deg: angle * 3,
			shape: 'square',
			isShaded: true,
		},
	};
}

/**
 * Accurately parses a 3x3 matrix grid from question text
 */
export function parseMatrixGridFromQuestion(questionText, correctText = '') {
	if (!questionText) return null;

	const r1 = questionText.match(
		/(?:row\s*1|first\s*row)\s*(?:has|contains|:)?\s*([^.]+?)(?:\.|$|row\s*2|second\s*row)/i,
	);
	const r2 = questionText.match(
		/(?:row\s*2|second\s*row)\s*(?:has|contains|:)?\s*([^.]+?)(?:\.|$|row\s*3|third\s*row)/i,
	);
	const r3 = questionText.match(
		/(?:row\s*3|third\s*row)\s*(?:has|contains|:)?\s*([^.]+?)(?:\.|\?|$)/i,
	);

	const splitRowItems = (str) => {
		if (!str) return [];
		return str
			.replace(/\band\b/gi, ',')
			.split(',')
			.map((s) =>
				s
					.trim()
					.replace(/^a\s+/i, '')
					.replace(/^an\s+/i, ''),
			)
			.filter(
				(s) =>
					s.length > 0 && !/which|missing|what|tile|find|determine/i.test(s),
			);
	};

	if (r1 && r2 && r3) {
		const row1 = splitRowItems(r1[1]);
		const row2 = splitRowItems(r2[1]);
		const row3 = splitRowItems(r3[1]);

		if (row1.length >= 2 && row2.length >= 2) {
			while (row1.length < 3) row1.push('Circle');
			while (row2.length < 3) row2.push('Circle');
			while (row3.length < 2) row3.push('Circle');

			return {
				grid: [row1.slice(0, 3), row2.slice(0, 3), [row3[0], row3[1], '?']],
				answer: correctText ? correctText.trim() : 'Answer',
			};
		}
	}

	return null;
}
