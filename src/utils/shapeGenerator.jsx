/**
 * Checks if a string contains any shape, color, or visual geometry keywords
 */
export function hasShapeOrVisualConcept(text) {
	if (!text) return false;
	const lower = String(text).toLowerCase();
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
		/(?:[🌙🌕🌖🌗🌘🌑🌒🌓🌔🌚🌛🌜🌝]|[☀️🌞🌅🌤️]|[⭐🌟✨★☆]|[🔺🔻▲▼△▽▶◀]|[\u{1F7E0}-\u{1F7EB}]|[🔴🔵🟡🟢🟣🟠🟤⚫⚪●○■□◆◇⬛⬜]|(?:[🔷🔶🔹🔸💎💠])|(?:[❤️💙💚💛💜🧡🤍🖤🤎]))/u.test(
			text,
		) ||
		/[\u{1F300}-\u{1F6FF}\u{1F780}-\u{1F7FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}]/u.test(
			text,
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
	const sidesCount =
		sidesMatch ? parseInt(sidesMatch[1], 10)
		: sides > 0 ? sides
		: null;

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
export function DynamicSvgShape({
	parsed,
	size = 72,
	patternId = 'hatch',
	rotation = 0,
}) {
	const cx = size / 2;
	const cy = size / 2;
	const r = size * 0.4;
	const {
		shape,
		sides,
		color,
		isWhite,
		isShaded,
		isStriped,
		isDotted,
		isSolid,
		number,
		isQuadrant,
		quadrant,
	} = parsed || {};

	const strokeColor = '#0F172A';
	const strokeWidth = 2.8;

	let shapeFill = color || '#3B82F6';
	if (isDotted || parsed?.isDotted) {
		shapeFill = `url(#${patternId}-dotted)`;
	} else if (isStriped || parsed?.isStriped || isShaded || parsed?.isShaded) {
		shapeFill = `url(#${patternId}-striped)`;
	} else if (isWhite || parsed?.isWhite) {
		shapeFill = '#FFFFFF';
	} else {
		shapeFill =
			color ||
			(shape === 'sun' || shape === 'moon' || shape === 'star' ? '#F59E0B'
			: shape === 'heart' ? '#EF4444'
			: '#3B82F6');
	}

	let shapeElement = null;

	if (isQuadrant || shape === 'quadrant-square') {
		const quad = quadrant || 'top-right';
		const s = r * 1.6;
		const half = s / 2;
		const left = cx - half;
		const top = cy - half;

		shapeElement = (
			<g>
				{/* Top-Left Quadrant */}
				<rect
					x={left}
					y={top}
					width={half}
					height={half}
					fill={quad === 'top-left' ? shapeFill : '#FFFFFF'}
					stroke={strokeColor}
					strokeWidth={strokeWidth / 1.6}
				/>
				{/* Top-Right Quadrant */}
				<rect
					x={cx}
					y={top}
					width={half}
					height={half}
					fill={quad === 'top-right' ? shapeFill : '#FFFFFF'}
					stroke={strokeColor}
					strokeWidth={strokeWidth / 1.6}
				/>
				{/* Bottom-Right Quadrant */}
				<rect
					x={cx}
					y={cy}
					width={half}
					height={half}
					fill={quad === 'bottom-right' ? shapeFill : '#FFFFFF'}
					stroke={strokeColor}
					strokeWidth={strokeWidth / 1.6}
				/>
				{/* Bottom-Left Quadrant */}
				<rect
					x={left}
					y={cy}
					width={half}
					height={half}
					fill={quad === 'bottom-left' ? shapeFill : '#FFFFFF'}
					stroke={strokeColor}
					strokeWidth={strokeWidth / 1.6}
				/>
				{/* Outer Quadrant Border */}
				<rect
					x={left}
					y={top}
					width={s}
					height={s}
					rx='4'
					fill='none'
					stroke={strokeColor}
					strokeWidth={strokeWidth}
				/>
			</g>
		);
	} else if (shape === 'circle') {
		shapeElement = (
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill={shapeFill}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
			/>
		);
	} else if (shape === 'square' && sides === 4) {
		const s = r * 1.5;
		shapeElement = (
			<rect
				x={cx - s / 2}
				y={cy - s / 2}
				width={s}
				height={s}
				rx='5'
				fill={shapeFill}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
			/>
		);
	} else if (shape === 'diamond') {
		const points = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
		shapeElement = (
			<polygon
				points={points}
				fill={shapeFill}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
			/>
		);
	} else if (shape === 'star') {
		const points = `${cx},${cy - r} ${cx + r * 0.3},${cy - r * 0.3} ${cx + r},${cy - r * 0.3} ${cx + r * 0.45},${cy + r * 0.15} ${cx + r * 0.7},${cy + r * 0.8} ${cx},${cy + r * 0.35} ${cx - r * 0.7},${cy + r * 0.8} ${cx - r * 0.45},${cy + r * 0.15} ${cx - r},${cy - r * 0.3} ${cx - r * 0.3},${cy - r * 0.3}`;
		shapeElement = (
			<polygon
				points={points}
				fill={shapeFill}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
			/>
		);
	} else if (shape === 'moon') {
		const startX = cx + r * 0.15;
		const d = `M ${startX} ${cy - r} A ${r} ${r} 0 1 0 ${startX} ${cy + r} A ${r * 0.8} ${r * 0.8} 0 0 1 ${startX} ${cy - r} Z`;
		shapeElement = (
			<path
				d={d}
				fill={shapeFill}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
				strokeLinejoin='round'
			/>
		);
	} else if (shape === 'sun') {
		shapeElement = (
			<g>
				{[0, 45, 90, 135, 180, 225, 270, 315].map((angle, rayIdx) => {
					const rad = (angle * Math.PI) / 180;
					const x1 = cx + Math.cos(rad) * (r * 0.65);
					const y1 = cy + Math.sin(rad) * (r * 0.65);
					const x2 = cx + Math.cos(rad) * (r * 1.05);
					const y2 = cy + Math.sin(rad) * (r * 1.05);
					return (
						<line
							key={rayIdx}
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
							stroke={strokeColor}
							strokeWidth={strokeWidth * 1.1}
							strokeLinecap='round'
						/>
					);
				})}
				<circle
					cx={cx}
					cy={cy}
					r={r * 0.62}
					fill={shapeFill}
					stroke={strokeColor}
					strokeWidth={strokeWidth}
				/>
			</g>
		);
	} else if (shape === 'heart') {
		const d = `M ${cx} ${cy + r * 0.75} C ${cx - r * 1.3} ${cy - r * 0.15}, ${cx - r * 0.8} ${cy - r * 1.05}, ${cx} ${cy - r * 0.35} C ${cx + r * 0.8} ${cy - r * 1.05}, ${cx + r * 1.3} ${cy - r * 0.15}, ${cx} ${cy + r * 0.75} Z`;
		shapeElement = (
			<path
				d={d}
				fill={shapeFill}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
				strokeLinejoin='round'
			/>
		);
	} else {
		// Regular polygon for triangle (3), pentagon (5), hexagon (6), heptagon (7), octagon (8), etc.
		if (shape === 'circle' || (!sides && !shape)) {
			shapeElement = (
				<circle
					cx={cx}
					cy={cy}
					r={r}
					fill={shapeFill}
					stroke={strokeColor}
					strokeWidth={strokeWidth}
				/>
			);
		} else {
			const numSides = sides || 3;
			const points = getRegularPolygonPoints(numSides, cx, cy, r);
			shapeElement = (
				<polygon
					points={points}
					fill={shapeFill}
					stroke={strokeColor}
					strokeWidth={strokeWidth}
				/>
			);
		}
	}

	// Only show overlay text if there is an explicit numeric progression value (e.g. [Blue Circle, 3])
	const overlayText =
		(
			typeof number === 'number' ||
			(typeof number === 'string' && number.trim() !== '')
		) ?
			number
		:	null;

	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			className={`${
				size <= 54 ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-14 h-14 sm:w-16 sm:h-16'
			} flex-shrink-0 drop-shadow-md`}>
			<defs>
				{/* Diagonal Striped Hatch Pattern */}
				<pattern
					id={`${patternId}-striped`}
					width='8'
					height='8'
					patternTransform='rotate(45 0 0)'
					patternUnits='userSpaceOnUse'>
					<rect
						width='8'
						height='8'
						fill='#F8FAFC'
					/>
					<line
						x1='0'
						y1='0'
						x2='0'
						y2='8'
						stroke='#1E293B'
						strokeWidth='3.2'
					/>
				</pattern>

				{/* Polka Dot Hatch Pattern */}
				<pattern
					id={`${patternId}-dotted`}
					width='8'
					height='8'
					patternUnits='userSpaceOnUse'>
					<rect
						width='8'
						height='8'
						fill='#F8FAFC'
					/>
					<circle
						cx='4'
						cy='4'
						r='2.2'
						fill='#1E293B'
					/>
				</pattern>

				{/* Fallback patternId */}
				<pattern
					id={patternId}
					width='8'
					height='8'
					patternTransform='rotate(45 0 0)'
					patternUnits='userSpaceOnUse'>
					<rect
						width='8'
						height='8'
						fill='#E2E8F0'
					/>
					<line
						x1='0'
						y1='0'
						x2='0'
						y2='8'
						stroke='#1E293B'
						strokeWidth='3.5'
					/>
				</pattern>
			</defs>

			{shapeElement}

			{/* Center Progression Number Badge if applicable */}
			{overlayText !== null && (
				<g>
					<circle
						cx={cx}
						cy={cy}
						r='11'
						fill={
							isShaded ? '#0F172A'
							: isWhite ?
								'#0F172A'
							:	'#FFFFFF'
						}
						opacity='0.9'
					/>
					<text
						x={cx}
						y={cy + 1}
						fill={isShaded || isWhite ? '#FFFFFF' : '#0F172A'}
						fontSize='12'
						fontWeight='900'
						textAnchor='middle'
						dominantBaseline='middle'>
						{overlayText}
					</text>
				</g>
			)}
		</svg>
	);
}

/**
 * Clean Card container for dynamic shape sequence items (without side-count or shading text clutter)
 */
export function DynamicShapeCard({
	item,
	index = 0,
	isTarget = false,
	isSolution = false,
	isCompact = false,
}) {
	const parsed = parseDynamicShape(item);
	const uniquePatternId = `diag-hatch-${index}-${Math.random().toString(36).substr(2, 4)}`;

	const isQuestionItem =
		typeof item === 'string' &&
		(item.trim() === '?' ||
			item.trim().startsWith('?') ||
			item.trim() === '___' ||
			/^(what|which|how|find)\b/i.test(item.trim()));

	if ((isTarget || isQuestionItem) && !isSolution) {
		return (
			<div
				className={`flex flex-col items-center justify-center rounded-2xl bg-white border-2 border-dashed border-indigo-400 shadow-sm animate-pulse ${
					isCompact ?
						'p-1.5 sm:p-2 min-w-[64px] sm:min-w-[76px]'
					:	'p-3 min-w-[80px] sm:min-w-[95px]'
				}`}>
				<div
					className={`rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-inner ${
						isCompact ?
							'w-10 h-10 sm:w-12 sm:h-12 text-xl'
						:	'w-14 h-14 sm:w-16 sm:h-16 text-2xl'
					}`}>
					❓
				</div>
				<div className='flex flex-col items-center mt-1 text-center'>
					<span
						className={`font-black uppercase text-indigo-600 tracking-wider ${
							isCompact ? 'text-[9px]' : 'text-[10px]'
						}`}>
						Next Shape?
					</span>
				</div>
			</div>
		);
	}

	if (!parsed || !parsed.shape) {
		const textStr = String(item || '').trim();
		const isSingleEmoji =
			/^[\p{Emoji}\s\u200d\ufe0e\ufe0f\u25A0-\u25FF\u2B50-\u2B55\u2600-\u26FF\u{1F780}-\u{1F7FF}]+$/u.test(
				textStr,
			);

		return (
			<div
				className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-transform hover:scale-105 ${
					isCompact ?
						'p-1.5 sm:p-2 min-w-[64px] sm:min-w-[76px]'
					:	'p-2.5 sm:p-3 min-w-[80px] sm:min-w-[95px]'
				} ${
					isSolution ?
						'bg-gradient-to-tr from-emerald-50 to-teal-50 border-emerald-400 ring-2 ring-emerald-300 shadow-lg'
					:	'bg-white border-slate-200 shadow-md'
				}`}>
				<div
					className={`rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-extrabold ${
						isCompact ?
							'w-10 h-10 sm:w-12 sm:h-12 text-xl'
						:	'w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl'
					}`}>
					{textStr}
				</div>
				{!isSingleEmoji && textStr && (
					<div className='flex flex-col items-center mt-1 text-center w-full'>
						<h5
							className={`font-black text-slate-900 leading-tight ${
								isCompact ? 'text-[10px] sm:text-[11px]' : 'text-xs sm:text-sm'
							}`}>
							{textStr}
						</h5>
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-transform hover:scale-105 ${
				isCompact ?
					'p-1.5 sm:p-2 min-w-[64px] sm:min-w-[76px]'
				:	'p-2.5 sm:p-3 min-w-[80px] sm:min-w-[95px]'
			} ${
				isSolution ?
					'bg-gradient-to-tr from-emerald-50 to-teal-50 border-emerald-400 ring-2 ring-emerald-300 shadow-lg animate-bounce-short'
				:	'bg-white border-slate-200 shadow-md'
			}`}>
			<DynamicSvgShape
				parsed={parsed}
				size={isCompact ? 48 : 64}
				patternId={uniquePatternId}
			/>

			<div className='flex flex-col items-center mt-1 text-center w-full'>
				<h5
					className={`font-black text-slate-900 leading-tight ${
						isCompact ? 'text-[10px] sm:text-[11px]' : 'text-xs sm:text-sm'
					}`}>
					{(
						parsed.styleTag &&
						!parsed.shapeName
							.toLowerCase()
							.includes(parsed.styleTag.toLowerCase())
					) ?
						`${parsed.styleTag} ${parsed.shapeName}`
					:	parsed.shapeName}
				</h5>
			</div>
		</div>
	);
}

/**
 * Splits any sequence text or question string into distinct shape terms
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
		/(?:[🌙🌕🌖🌗🌘🌑🌒🌓🌔🌚🌛🌜🌝]|[☀️🌞🌅🌤️]|[⭐🌟✨★☆]|[🔺🔻▲▼△▽▶◀]|[\u{1F7E0}-\u{1F7EB}]|[🔴🔵🟡🟢🟣🟠🟤⚫⚪●○■□◆◇⬛⬜]|(?:[🔷🔶🔹🔸💎💠])|(?:[❤️💙💚💛💜🧡🤍🖤🤎]))/gu;

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
		return emojiMatches;
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
export function ShapeClusterCard({
	step,
	count = 1,
	shape = 'square',
	isShaded = true,
	isWhite = false,
	color = '#3B82F6',
	isTarget = false,
	isSolution = false,
	patternId = 'cluster-hatch',
}) {
	if (isTarget && !isSolution) {
		return (
			<div className='flex flex-col items-center justify-center p-3 rounded-2xl bg-white border-2 border-dashed border-indigo-400 min-w-[90px] sm:min-w-[105px] shadow-sm animate-pulse'>
				<span className='text-[10px] font-black uppercase text-indigo-500 mb-1.5 tracking-wider'>
					Step {step}
				</span>
				<div className='w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-inner'>
					❓
				</div>
				<span className='text-[10px] font-extrabold text-indigo-600 mt-2 bg-indigo-50 px-2 py-0.5 rounded'>
					How many?
				</span>
			</div>
		);
	}

	// Layout grid/triangular stack points for count 1, 3, 6, 10, 15, 21
	const renderMiniShapes = () => {
		const sz =
			count <= 1 ? 30
			: count <= 3 ? 20
			: count <= 6 ? 15
			: count <= 10 ? 12
			: 10;
		const fill =
			isShaded ? `url(#${patternId})`
			: isWhite ? '#FFFFFF'
			: color;

		// Arrangement rows for triangular numbers (1 -> [1], 3 -> [1, 2], 6 -> [1, 2, 3], 10 -> [1, 2, 3, 4], 15 -> [1, 2, 3, 4, 5])
		let rows = [];
		if (count === 1) rows = [1];
		else if (count === 2) rows = [2];
		else if (count === 3) rows = [1, 2];
		else if (count === 4) rows = [2, 2];
		else if (count === 5) rows = [2, 3];
		else if (count === 6) rows = [1, 2, 3];
		else if (count === 8) rows = [2, 3, 3];
		else if (count === 9) rows = [3, 3, 3];
		else if (count === 10) rows = [1, 2, 3, 4];
		else if (count <= 15) rows = [1, 2, 3, 4, 5];
		else if (count <= 21) rows = [1, 2, 3, 4, 5, 6];
		else rows = [4, 4, 4]; // fallback grid

		return (
			<svg
				viewBox='0 0 100 80'
				className='w-16 h-14 sm:w-20 sm:h-16'>
				<defs>
					<pattern
						id={patternId}
						width='6'
						height='6'
						patternTransform='rotate(45 0 0)'
						patternUnits='userSpaceOnUse'>
						<rect
							width='6'
							height='6'
							fill='#CBD5E1'
						/>
						<line
							x1='0'
							y1='0'
							x2='0'
							y2='6'
							stroke='#1E293B'
							strokeWidth='2.2'
						/>
					</pattern>
				</defs>

				{rows.map((rowItems, rowIdx) => {
					const totalRows = rows.length;
					const rowY = 40 - (totalRows * (sz + 2)) / 2 + rowIdx * (sz + 2);

					return Array.from({ length: rowItems }).map((_, colIdx) => {
						const rowX = 50 - (rowItems * (sz + 2)) / 2 + colIdx * (sz + 2);

						if (shape === 'circle') {
							return (
								<circle
									key={`${rowIdx}-${colIdx}`}
									cx={rowX + sz / 2}
									cy={rowY + sz / 2}
									r={sz / 2 - 1}
									fill={fill}
									stroke='#0F172A'
									strokeWidth='1.5'
								/>
							);
						}
						if (shape === 'triangle') {
							const pts = `${rowX + sz / 2},${rowY} ${rowX + sz},${rowY + sz} ${rowX},${rowY + sz}`;
							return (
								<polygon
									key={`${rowIdx}-${colIdx}`}
									points={pts}
									fill={fill}
									stroke='#0F172A'
									strokeWidth='1.5'
								/>
							);
						}

						// Default Square
						return (
							<rect
								key={`${rowIdx}-${colIdx}`}
								x={rowX}
								y={rowY}
								width={sz}
								height={sz}
								rx='2'
								fill={fill}
								stroke='#0F172A'
								strokeWidth='1.5'
							/>
						);
					});
				})}
			</svg>
		);
	};

	return (
		<div
			className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border-2 transition-transform hover:scale-105 min-w-[90px] sm:min-w-[105px] ${
				isSolution ?
					'bg-gradient-to-tr from-emerald-50 to-teal-50 border-emerald-400 ring-2 ring-emerald-300 shadow-lg animate-bounce-short'
				:	'bg-white border-slate-200 shadow-md'
			}`}>
			<span className='text-[10px] font-black uppercase text-indigo-700 mb-1 tracking-wider bg-indigo-50 px-2 py-0.2 rounded'>
				Step {step}
			</span>

			<div className='flex items-center justify-center my-0.5'>
				{renderMiniShapes()}
			</div>

			<span
				className={`text-[11px] font-black px-2 py-0.5 rounded-full mt-1.5 shadow-xs ${
					isSolution ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
				}`}>
				{count} {count === 1 ? 'square' : 'squares'}
			</span>
		</div>
	);
}

/**
 * Parses spatial rotation questions and quadrant progressions e.g.
 * "A square is rotated 90 degrees clockwise and its shaded quadrant shifts from the top-right to the bottom-right, then to the bottom-left. What position will the shaded quadrant occupy after the next 90-degree clockwise rotation?"
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
