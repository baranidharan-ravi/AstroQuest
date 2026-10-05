import { Box } from 'lucide-react';
import { memo } from 'react';

/**
 * Renders a single 3D Isometric Cube in SVG with light, medium, and dark shaded faces
 */
export function render3DIsoCube({
	gx,
	gy,
	gz,
	size = 20,
	color = 'blue',
	key = '',
}) {
	const originX = 140;
	const originY = 145;

	const dx = size * 0.866;
	const dy = size * 0.5;
	const h = size * 0.95;

	const isoX = originX + (gx - gy) * dx;
	const isoY = originY + (gx + gy) * dy - gz * h;

	// Top Face
	const topPts = `${isoX},${isoY - h} ${isoX + dx},${isoY - h + dy} ${isoX},${isoY - h + 2 * dy} ${isoX - dx},${isoY - h + dy}`;
	// Left Face
	const leftPts = `${isoX - dx},${isoY - h + dy} ${isoX},${isoY - h + 2 * dy} ${isoX},${isoY + 2 * dy} ${isoX - dx},${isoY + dy}`;
	// Right Face
	const rightPts = `${isoX},${isoY - h + 2 * dy} ${isoX + dx},${isoY - h + dy} ${isoX + dx},${isoY + dy} ${isoX},${isoY + 2 * dy}`;

	let topFill = '#93C5FD';
	let leftFill = '#3B82F6';
	let rightFill = '#1D4ED8';

	if (color === 'amber') {
		topFill = '#FDE68A';
		leftFill = '#F59E0B';
		rightFill = '#B45309';
	} else if (color === 'pink') {
		topFill = '#FBCFE8';
		leftFill = '#EC4899';
		rightFill = '#BE185D';
	} else if (color === 'emerald') {
		topFill = '#A7F3D0';
		leftFill = '#10B981';
		rightFill = '#047857';
	}

	return (
		<g key={key}>
			<polygon
				points={topPts}
				fill={topFill}
				stroke='#0F172A'
				strokeWidth='1.2'
			/>
			<polygon
				points={leftPts}
				fill={leftFill}
				stroke='#0F172A'
				strokeWidth='1.2'
			/>
			<polygon
				points={rightPts}
				fill={rightFill}
				stroke='#0F172A'
				strokeWidth='1.2'
			/>
		</g>
	);
}

const getLayerColor = (color, layerIdx) => {
	if (color) return color;
	if (layerIdx === 0) return 'blue';
	if (layerIdx === 1) return 'amber';
	return 'pink';
};

const getLayerDotClass = (color, idx) => {
	if (color === 'blue' || idx === 0) return 'bg-blue-500';
	if (color === 'amber' || idx === 1) return 'bg-amber-500';
	return 'bg-pink-500';
};

/**
 * Isometric Block Tower Diagram Component
 *
 * Implements SOLID Single Responsibility:
 * Displays layered 3D isometric cube towers, pyramids, and unit volume metrics.
 */
export const IsometricTowerDiagram = memo(function IsometricTowerDiagram({
	data = {},
	isSolution = false,
}) {
	const layers = data.layers || [
		{ size: 3, count: 9, color: 'blue', label: 'Layer 1 (Base 3x3)' },
		{ size: 2, count: 4, color: 'amber', label: 'Layer 2 (Middle 2x2)' },
		{ size: 1, count: 1, color: 'pink', label: 'Layer 3 (Top 1x1)' },
	];

	const totalCubes =
		data.totalCubes ||
		layers.reduce((acc, l) => acc + (l.count || l.size * l.size), 0);

	// Build and depth-sort 3D cubes from back to front
	const cubesToRender = [];
	layers.forEach((layer, layerIdx) => {
		const sz = layer.size || 1;
		const col = getLayerColor(layer.color, layerIdx);
		const offset = (3 - sz) / 2; // Center smaller layers on top

		for (let x = 0; x < sz; x++) {
			for (let y = 0; y < sz; y++) {
				cubesToRender.push({
					gx: offset + x,
					gy: offset + y,
					gz: layerIdx,
					color: col,
					key: `cube-${layerIdx}-${x}-${y}`,
					depth: layerIdx * 100 + (offset + x + (offset + y)),
				});
			}
		}
	});

	// Back to front render order
	cubesToRender.sort((a, b) => a.depth - b.depth);

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-purple-50/90 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
				<Box className='w-3.5 h-3.5 text-indigo-600' />
				<span>3D Isometric Cube Tower Structure</span>
			</div>

			{/* 3D Isometric Viewport */}
			<div className='bg-white rounded-2xl p-2 border-2 border-indigo-100 shadow-inner flex items-center justify-center'>
				<svg
					viewBox='0 0 280 200'
					className='w-56 h-40 sm:w-64 sm:h-48 drop-shadow-lg'>
					{cubesToRender.map((c) =>
						render3DIsoCube({
							gx: c.gx,
							gy: c.gy,
							gz: c.gz,
							size: 20,
							color: c.color,
							key: c.key,
						}),
					)}
				</svg>
			</div>

			{/* Layer Volume Breakdown */}
			<div className='flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-3 w-full'>
				{layers.map((l, idx) => (
					<div
						key={`layer-breakdown-${l.label || `level-${idx + 1}`}`}
						className='flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-xs'>
						<div
							className={`w-3 h-3 rounded-full ${getLayerDotClass(l.color, idx)}`}
						/>
						<span className='text-[10px] sm:text-[11px] font-bold text-slate-800'>
							{l.label || `L${idx + 1}`}:{' '}
							<b className='text-indigo-600'>{l.count || l.size * l.size}</b>{' '}
							cubes
						</span>
					</div>
				))}
			</div>

			{/* Total Calculation Banner in Solution Mode */}
			{isSolution && (
				<div className='mt-2.5 px-3.5 py-1 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md animate-bounce-short flex items-center gap-1.5'>
					<span>✨ Total Volume:</span>
					<span>
						{layers.map((l) => l.count || l.size * l.size).join(' + ')} ={' '}
						{totalCubes} Unit Cubes
					</span>
				</div>
			)}
		</div>
	);
});

export default IsometricTowerDiagram;
