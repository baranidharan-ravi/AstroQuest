import { RotateCcw, RotateCw } from 'lucide-react';
import React, { Fragment, memo } from 'react';
import { DynamicSvgShape } from '../shapeGenerator';

/**
 * Spatial Rotation & Quadrant Progression Diagram Component
 * 
 * Implements SOLID Single Responsibility:
 * Displays 2D spatial rotation, angular increments (CW / CCW),
 * and quadrant changes across educational challenge steps.
 */
export const SpatialRotationDiagram = memo(function SpatialRotationDiagram({
	data = {},
	isSolution = false,
}) {
	const steps = data.steps || [
		{
			step: 1,
			quadrant: 'top-right',
			deg: 0,
			isQuadrant: true,
			isShaded: true,
		},
		{
			step: 2,
			quadrant: 'bottom-right',
			deg: 90,
			isQuadrant: true,
			isShaded: true,
		},
		{
			step: 3,
			quadrant: 'bottom-left',
			deg: 180,
			isQuadrant: true,
			isShaded: true,
		},
	];
	const target = data.target || {
		step: 4,
		quadrant: 'top-left',
		deg: 270,
		isQuadrant: true,
		isShaded: true,
	};
	const angle = data.angle || 90;
	const direction = data.direction || 'CW';
	const isCCW = String(direction).toUpperCase() === 'CCW';

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border-2 border-indigo-400/50 shadow-xl max-w-xl w-full animate-in fade-in duration-300'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-cyan-300 tracking-wider mb-3 bg-cyan-950/80 px-3 py-0.5 rounded-full border border-cyan-500/40'>
				{isCCW ?
					<RotateCcw className='w-3.5 h-3.5 text-cyan-400 animate-spin-slow' />
				:	<RotateCw className='w-3.5 h-3.5 text-cyan-400 animate-spin-slow' />}
				<span>
					Spatial Geometry: {angle}°{' '}
					{isCCW ? 'Counter-Clockwise' : 'Clockwise'} Rotation
				</span>
			</div>

			<div className='flex items-center justify-center flex-wrap gap-2 sm:gap-3 w-full'>
				{steps.map((st, idx) => (
					<Fragment key={idx}>
						<div className='flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white text-slate-900 border-2 border-slate-200 shadow-md min-w-[85px] sm:min-w-[95px]'>
							<span className='text-[10px] font-black uppercase text-indigo-700 mb-1 tracking-wider bg-indigo-50 px-2 py-0.2 rounded'>
								Step {st.step || idx + 1}
							</span>
							<DynamicSvgShape
								parsed={st}
								size={60}
								patternId={`rot-hatch-${idx}`}
								rotation={st.deg || 0}
							/>
							<span className='text-[10px] font-extrabold text-slate-700 mt-1 capitalize'>
								{st.quadrant ?
									st.quadrant.replace('-', ' ')
								:	`${st.deg || 0}°`}
							</span>
						</div>

						{/* Rotation Arrow Indicator between steps */}
						<div className='flex flex-col items-center justify-center px-0.5 sm:px-1'>
							<div className='w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30 shadow-xs'>
								{isCCW ?
									<RotateCcw className='w-3.5 h-3.5 text-cyan-300' />
								:	<RotateCw className='w-3.5 h-3.5 text-cyan-300' />}
							</div>
							<span className='text-[9px] font-black text-cyan-300 mt-0.5 whitespace-nowrap bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30'>
								+{angle}° {direction}
							</span>
						</div>
					</Fragment>
				))}

				{/* Target Step Card */}
				{!isSolution ?
					<div className='flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white/10 border-2 border-dashed border-cyan-400 min-w-[85px] sm:min-w-[95px] shadow-sm animate-pulse'>
						<span className='text-[10px] font-black uppercase text-cyan-300 mb-1 tracking-wider'>
							Next Step
						</span>
						<div className='w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-300 font-black text-2xl'>
							❓
						</div>
						<span className='text-[10px] font-extrabold text-cyan-200 mt-1'>
							Position?
						</span>
					</div>
				:	<div className='flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 text-slate-900 border-2 border-emerald-400 ring-2 ring-emerald-300 shadow-xl min-w-[85px] sm:min-w-[95px] animate-bounce-short'>
						<span className='text-[10px] font-black uppercase text-emerald-800 mb-1 tracking-wider bg-emerald-100 px-2 py-0.2 rounded'>
							Next Step
						</span>
						<DynamicSvgShape
							parsed={target}
							size={60}
							patternId='rot-hatch-target'
							rotation={target.deg || 0}
						/>
						<span className='text-[10px] font-extrabold text-emerald-800 mt-1 capitalize font-mono'>
							{target.quadrant ?
								target.quadrant.replace('-', ' ')
							:	`${target.deg}°`}
						</span>
					</div>
				}
			</div>

			{/* Solution Banner */}
			{isSolution && (
				<div className='mt-3 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black shadow-lg animate-bounce-short flex items-center gap-2'>
					<span>
						✨ Next {angle}° {isCCW ? 'Counter-Clockwise' : 'Clockwise'}{' '}
						Position:
					</span>
					<span className='underline decoration-wavy capitalize'>
						{target.quadrant ?
							target.quadrant.replace('-', ' ')
						:	`${target.deg}°`}
					</span>
				</div>
			)}
		</div>
	);
});

export default SpatialRotationDiagram;
