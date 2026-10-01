import { getRegularPolygonPoints } from './shapeParsers';

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
	} else if (color) {
		shapeFill = color;
	} else if (shape === 'sun' || shape === 'moon' || shape === 'star') {
		shapeFill = '#F59E0B';
	} else if (shape === 'heart') {
		shapeFill = '#EF4444';
	} else {
		shapeFill = '#3B82F6';
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
						fill={isShaded || isWhite ? '#0F172A' : '#FFFFFF'}
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

export default DynamicSvgShape;
