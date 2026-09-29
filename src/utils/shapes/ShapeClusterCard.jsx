import React from 'react';
import { DynamicSvgShape } from './DynamicSvgShape';
import { parseDynamicShape } from './shapeParsers';

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

export default ShapeClusterCard;
