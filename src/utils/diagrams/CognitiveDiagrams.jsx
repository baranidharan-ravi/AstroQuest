import {
	ArrowRight,
	Link2,
	Scale,
	Shapes,
	Sparkles,
	Zap,
} from 'lucide-react';
import React, { memo } from 'react';
import { DynamicShapeCard } from '../shapeGenerator';
import { getConceptVisual } from './conceptVisualDictionary';

/**
 * AnalogyMapDiagram Component
 */
export const AnalogyMapDiagram = memo(function AnalogyMapDiagram({
	data = {},
	isSolution = false,
}) {
	const visA = getConceptVisual(data.itemA || 'Concept A');
	const visB = getConceptVisual(data.itemB || 'Concept B');
	const visC = getConceptVisual(data.itemC || 'Concept C');
	const visD = getConceptVisual(data.itemD || data.target || '?');

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-[#1A1D54]/10 via-[#312B63]/10 to-[#141846]/10 rounded-2xl border-2 border-indigo-200/90 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-700 tracking-wider mb-2.5 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80'>
				<Link2 className='w-3.5 h-3.5 text-indigo-600' />
				<span>Concept Relationship Analogy</span>
			</div>

			{/* Pair 1 (Given Relationship) */}
			<div className='w-full grid grid-cols-11 items-center gap-1.5 sm:gap-2 mb-2'>
				<div className='col-span-5 bg-white border-2 border-indigo-300/80 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.02]'>
					<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
						{visA.icon}
					</div>
					<div className='flex-1 min-w-0'>
						<span className='text-[10px] font-bold text-indigo-500 uppercase block tracking-wider'>
							Source
						</span>
						<h4 className='text-xs sm:text-sm font-black text-slate-900 leading-snug break-words'>
							{visA.label || 'Concept A'}
						</h4>
					</div>
				</div>

				<div className='col-span-1 flex items-center justify-center'>
					<div className='w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm'>
						<ArrowRight className='w-3.5 h-3.5 stroke-[3]' />
					</div>
				</div>

				<div className='col-span-5 bg-gradient-to-tr from-indigo-600 to-purple-700 border-2 border-indigo-400 text-white rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.02]'>
					<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
						{visB.icon}
					</div>
					<div className='flex-1 min-w-0'>
						<span className='text-[10px] font-bold text-indigo-200 uppercase block tracking-wider'>
							Relates to
						</span>
						<h4 className='text-xs sm:text-sm font-black text-white leading-snug break-words'>
							{visB.label || 'Concept B'}
						</h4>
					</div>
				</div>
			</div>

			{/* Center Parallel Divider */}
			<div className='flex items-center gap-3 w-full my-1'>
				<div className='flex-1 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent' />
				<span className='text-[10px] font-black uppercase text-purple-700 bg-purple-100/90 px-3 py-0.5 rounded-full border border-purple-300/80 tracking-widest shadow-xs'>
					✨ in the same way as ✨
				</span>
				<div className='flex-1 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent' />
			</div>

			{/* Pair 2 (Target Relationship) */}
			<div className='w-full grid grid-cols-11 items-center gap-1.5 sm:gap-2 mt-2'>
				<div className='col-span-5 bg-white border-2 border-pink-300/80 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.02]'>
					<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
						{visC.icon}
					</div>
					<div className='flex-1 min-w-0'>
						<span className='text-[10px] font-bold text-pink-500 uppercase block tracking-wider'>
							Target
						</span>
						<h4 className='text-xs sm:text-sm font-black text-slate-900 leading-snug break-words'>
							{visC.label || 'Concept C'}
						</h4>
					</div>
				</div>

				<div className='col-span-1 flex items-center justify-center'>
					<div className='w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm'>
						<ArrowRight className='w-3.5 h-3.5 stroke-[3]' />
					</div>
				</div>

				<div
					className={`col-span-5 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-all ${
						isSolution ?
							'bg-gradient-to-tr from-emerald-600 to-teal-600 border-2 border-emerald-400 text-white ring-2 ring-emerald-300 animate-bounce-short'
						:	'bg-gradient-to-tr from-pink-50 to-purple-50 border-2 border-dashed border-pink-400 text-pink-900'
					}`}>
					<div
						className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0 ${
							isSolution ? 'bg-white/20' : 'bg-pink-200 text-pink-700'
						}`}>
						{isSolution ? visD.icon : '❓'}
					</div>
					<div className='flex-1 min-w-0'>
						<span
							className={`text-[10px] font-bold uppercase block tracking-wider ${
								isSolution ? 'text-emerald-100' : 'text-pink-500'
							}`}>
							{isSolution ? 'Correct Solution' : 'What belongs here?'}
						</span>
						<h4
							className={`text-xs sm:text-sm font-black leading-snug break-words ${
								isSolution ? 'text-white' : 'text-pink-800'
							}`}>
							{isSolution ?
								visD.label || 'Answer'
							:	'Choose option on right ➔'}
						</h4>
					</div>
				</div>
			</div>
		</div>
	);
});

/**
 * OddOneOutDiagram Component
 */
export const OddOneOutDiagram = memo(function OddOneOutDiagram({
	data = {},
	isSolution = false,
}) {
	const target = data.target || data.answer || 'Odd-One-Out Item';
	const visTarget = getConceptVisual(target);

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90 rounded-2xl border-2 border-amber-300 shadow-sm max-w-xl w-full animate-in fade-in duration-300 overflow-hidden'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-amber-900 tracking-wider mb-2.5 bg-amber-200/80 px-3 py-0.5 rounded-full border border-amber-300'>
				<Sparkles className='w-3.5 h-3.5 text-amber-600' />
				<span>Classification & Odd-One-Out Analysis</span>
			</div>

			<div className='w-full bg-white rounded-2xl p-3 sm:p-4 border border-amber-200 shadow-xs flex flex-col items-center text-center gap-2.5'>
				<span className='text-[11px] sm:text-xs font-bold text-amber-900'>
					🎯 Clue: Three items share the exact same state of matter or
					property. One belongs to a different group!
				</span>

				{isSolution ?
					<div className='w-full p-3 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md flex items-center justify-center gap-3 animate-bounce-short border-2 border-emerald-400'>
						<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl shadow-inner flex-shrink-0'>
							{visTarget.icon}
						</div>
						<div className='text-left'>
							<span className='text-[10px] font-black uppercase text-emerald-100 block tracking-wider'>
								✓ Odd-One-Out Identified
							</span>
							<h4 className='text-sm sm:text-base font-black text-white leading-tight'>
								{target}
							</h4>
						</div>
					</div>
				:	<div className='w-full p-2.5 rounded-xl bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 flex items-center justify-center gap-2 font-black text-xs sm:text-sm'>
						<span>🔍 Compare: Solid 🧊 vs Liquid 💧 vs Gas 💨</span>
					</div>
				}
			</div>
		</div>
	);
});

/**
 * CauseEffectDiagram Component
 */
export const CauseEffectDiagram = memo(function CauseEffectDiagram({
	data = {},
	isSolution = false,
}) {
	const visCause = getConceptVisual(data.cause || 'Initial Event');
	const visEffect = getConceptVisual(data.effect || 'Outcome');
	const action = data.action || 'leads to';
	const cleanAction =
		action.length > 25 ? action.slice(0, 22) + '...' : action;

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-yellow-50/90 rounded-2xl border-2 border-amber-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300 overflow-hidden'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-amber-800 tracking-wider mb-2.5 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300'>
				<Zap className='w-3.5 h-3.5 text-amber-600' />
				<span>Process & Cause-and-Effect Chain</span>
			</div>

			<div
				className={`w-full flex ${
					isSolution ? 'flex-col' : 'flex-col sm:flex-row'
				} items-stretch sm:items-center justify-between gap-2 sm:gap-2.5`}>
				<div className='flex-1 min-w-[135px] bg-white border-2 border-amber-300 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3'>
					<div className='w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
						{visCause.icon}
					</div>
					<div className='flex-1 min-w-0'>
						<span className='text-[10px] font-bold text-amber-600 uppercase block tracking-wider truncate'>
							Initial Setup
						</span>
						<h4
							className='text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug'
							title={visCause.label}>
							{visCause.label || 'Setup'}
						</h4>
					</div>
				</div>

				<div className='flex items-center justify-center gap-1 px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[10px] sm:text-[11px] shadow-xs max-w-[170px] sm:max-w-[200px] mx-auto flex-shrink-0'>
					<span className='truncate'>
						{isSolution ? '⬇ ' : '➔ '}
						{cleanAction}
						{isSolution ? ' ⬇' : ' ➔'}
					</span>
				</div>

				<div
					className={`flex-1 min-w-[135px] rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-all ${
						isSolution ?
							'bg-gradient-to-tr from-emerald-600 to-teal-600 border-2 border-emerald-400 text-white ring-2 ring-emerald-300 animate-bounce-short'
						:	'bg-white border-2 border-dashed border-orange-400 text-orange-950'
					}`}>
					<div
						className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0 ${
							isSolution ? 'bg-white/20' : 'bg-orange-100 text-orange-600'
						}`}>
						{isSolution ? visEffect.icon : '❓'}
					</div>
					<div className='flex-1 min-w-0'>
						<span
							className={`text-[10px] font-bold uppercase block tracking-wider truncate ${
								isSolution ? 'text-emerald-100' : 'text-orange-500'
							}`}>
							{isSolution ? 'Resulting Phenomenon' : 'Result / Outcome'}
						</span>
						<h4
							className={`text-xs sm:text-sm font-black line-clamp-2 leading-snug ${
								isSolution ? 'text-white' : 'text-orange-900'
							}`}
							title={isSolution ? visEffect.label : 'What happens?'}>
							{isSolution ? visEffect.label || 'Outcome' : 'What happens?'}
						</h4>
					</div>
				</div>
			</div>
		</div>
	);
});

/**
 * SequenceLadderDiagram Component
 */
export const SequenceLadderDiagram = memo(function SequenceLadderDiagram({
	data = {},
	isSolution = false,
}) {
	const rawSteps = Array.isArray(data.steps) ? data.steps : [];
	const nextVal = data.nextVal || '?';
	const rule = data.rule || '';

	return (
		<div className='flex flex-col items-center justify-center p-3.5 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl border-2 border-cyan-200 shadow-sm my-2 max-w-xl w-full animate-in fade-in duration-300'>
			<div className='text-[10px] sm:text-xs font-black uppercase text-cyan-800 tracking-wider mb-2.5 bg-cyan-100 px-3 py-0.5 rounded-full border border-cyan-300'>
				🔢 Number & Sequence Rule Progression
			</div>

			<div className='flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 w-full'>
				{rawSteps.map((step, idx) => (
					<div
						key={idx}
						className='flex items-center gap-1.5'>
						<div className='min-w-[48px] px-3.5 py-2 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-md border border-cyan-400'>
							{step}
						</div>
						{idx < rawSteps.length - 1 && (
							<span className='text-xs font-black text-cyan-500'>➔</span>
						)}
					</div>
				))}
				<span className='text-xs font-black text-cyan-500'>➔</span>
				<div
					className={`min-w-[48px] px-3.5 py-2 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center shadow-md transition-all ${
						isSolution ?
							'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white ring-2 ring-emerald-300 animate-bounce-short border border-emerald-400'
						:	'bg-white border-2 border-dashed border-cyan-500 text-cyan-700'
					}`}>
					{isSolution ? nextVal : '?'}
				</div>
			</div>

			{rule && (
				<div className='mt-2.5 px-3 py-1 bg-white/80 rounded-xl border border-cyan-200 text-[11px] font-bold text-cyan-900'>
					Rule: {rule}
				</div>
			)}
		</div>
	);
});

/**
 * MatrixGridDiagram Component
 */
export const MatrixGridDiagram = memo(function MatrixGridDiagram({
	data = {},
	isSolution = false,
}) {
	const rawGrid = data.grid || [
		['Square (Gray)', 'Circle (White)', 'Triangle (White)'],
		['Square (White)', 'Circle (Gray)', 'Triangle (White)'],
		['Square (Gray)', 'Circle (White)', '?'],
	];
	const answer = data.answer || data.correctAnswer || 'Triangle (Gray)';

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-purple-50 via-indigo-50 to-slate-50 rounded-2xl border-2 border-purple-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-purple-800 tracking-wider mb-2.5 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-300'>
				<Shapes className='w-3.5 h-3.5 text-purple-600' />
				<span>3x3 Matrix Grid Shape & Shading Progression</span>
			</div>

			<div className='grid grid-cols-3 gap-2.5 bg-white p-3 rounded-2xl border-2 border-purple-200 shadow-md'>
				{rawGrid.flat().map((cell, idx) => {
					const isTarget =
						cell === '?' || idx === rawGrid.flat().length - 1;

					return (
						<div
							key={idx}
							className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all shadow-xs min-w-[70px] sm:min-w-[80px] min-h-[70px] ${
								isTarget ?
									isSolution ?
										'bg-gradient-to-tr from-emerald-50 to-teal-50 border-2 border-emerald-500 ring-2 ring-emerald-300 shadow-md animate-bounce-short'
									:	'bg-purple-50 border-2 border-dashed border-purple-400 text-purple-600'
								:	'bg-slate-50 border border-slate-200 hover:scale-105'
							}`}>
							{isTarget && !isSolution ?
								<div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-black text-xl'>
									❓
								</div>
							:	<DynamicShapeCard
									item={isTarget ? answer : cell}
									isTarget={isTarget}
									isSolution={isSolution}
									index={idx}
								/>
							}
						</div>
					);
				})}
			</div>
		</div>
	);
});

/**
 * GridTilesDiagram Component
 */
export const GridTilesDiagram = memo(function GridTilesDiagram({
	data = {},
	isSolution = false,
}) {
	const rows = data.rows || 6;
	const cols = data.cols || 6;
	const holeRow = data.holeRow ?? 1;
	const holeCol = data.holeCol ?? 2;
	const holeW = data.holeW ?? 3;
	const holeH = data.holeH ?? 3;
	const totalHoleTiles = holeW * holeH;

	const size = 200;
	const cellW = size / cols;
	const cellH = size / rows;
	const startX = 20;
	const startY = 20;

	const holeX = startX + holeCol * cellW;
	const holeY = startY + holeRow * cellH;
	const holeWidth = holeW * cellW;
	const holeHeight = holeH * cellH;

	return (
		<div className='flex flex-col items-center justify-center p-3'>
			<svg
				viewBox='0 0 240 240'
				className='w-48 h-48 sm:w-56 sm:h-56'>
				<rect
					x={startX}
					y={startY}
					width={size}
					height={size}
					fill='#F8FAFC'
					stroke='#94A3B8'
					strokeWidth='2'
					rx='4'
				/>
				{Array.from({ length: cols + 1 }).map((_, i) => (
					<line
						key={`v-${i}`}
						x1={startX + i * cellW}
						y1={startY}
						x2={startX + i * cellW}
						y2={startY + size}
						stroke='#CBD5E1'
						strokeWidth='1.5'
					/>
				))}
				{Array.from({ length: rows + 1 }).map((_, i) => (
					<line
						key={`h-${i}`}
						x1={startX}
						y1={startY + i * cellH}
						x2={startX + size}
						y2={startY + i * cellH}
						stroke='#CBD5E1'
						strokeWidth='1.5'
					/>
				))}
				<rect
					x={holeX}
					y={holeY}
					width={holeWidth}
					height={holeHeight}
					fill='#FFFFFF'
				/>
				{isSolution ?
					<g>
						<rect
							x={holeX}
							y={holeY}
							width={holeWidth}
							height={holeHeight}
							fill='#FFE4E6'
							stroke='#EF4444'
							strokeWidth='3'
							rx='2'
						/>
						{Array.from({ length: holeW - 1 }).map((_, i) => (
							<line
								key={`sol-v-${i}`}
								x1={holeX + (i + 1) * cellW}
								y1={holeY}
								x2={holeX + (i + 1) * cellW}
								y2={holeY + holeHeight}
								stroke='#EF4444'
								strokeWidth='2'
							/>
						))}
						{Array.from({ length: holeH - 1 }).map((_, i) => (
							<line
								key={`sol-h-${i}`}
								x1={holeX}
								y1={holeY + (i + 1) * cellH}
								x2={holeX + holeWidth}
								y2={holeY + (i + 1) * cellH}
								stroke='#EF4444'
								strokeWidth='2'
							/>
						))}
						{Array.from({ length: totalHoleTiles }).map((_, i) => {
							const r = Math.floor(i / holeW);
							const c = i % holeW;
							const tx = holeX + (c + 0.5) * cellW;
							const ty = holeY + (r + 0.5) * cellH + 2;
							return (
								<text
									key={`num-${i}`}
									x={tx}
									y={ty}
									fill='#DC2626'
									fontSize={holeW > 3 ? '16' : '20'}
									fontWeight='bold'
									textAnchor='middle'
									dominantBaseline='middle'
									fontFamily='Nunito, sans-serif'>
									{i + 1}
								</text>
							);
						})}
					</g>
				:	null}
			</svg>
		</div>
	);
});

/**
 * AppleCountingDiagram Component
 */
export const AppleCountingDiagram = memo(function AppleCountingDiagram({
	data = {},
	isSolution = false,
}) {
	const count = Number(data.count) > 0 ? Number(data.count) : 4;
	const emoji = data.emoji || '🍎';
	return (
		<div className='flex flex-col items-center justify-center p-2'>
			<div className='bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-center gap-3 max-w-sm shadow-inner'>
				{Array.from({ length: count }).map((_, idx) => (
					<div
						key={idx}
						className='relative flex items-center justify-center w-11 h-11 bg-white rounded-2xl shadow-sm border border-emerald-100 transform hover:scale-110 transition-transform'>
						<span className='text-2xl'>{emoji}</span>
						{isSolution && (
							<span className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow'>
								{idx + 1}
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
});

/**
 * ScaleBalanceDiagram Component
 */
export const ScaleBalanceDiagram = memo(function ScaleBalanceDiagram({
	data = {},
	isSolution = false,
}) {
	const qText = data.questionText || data.question || '';
	const qLower = qText.toLowerCase();

	let leftEmoji = data.leftEmoji;
	let rightEmoji = data.rightEmoji;
	let leftLabel = data.leftLabel;
	let rightLabel = data.rightLabel;

	if (!leftEmoji) {
		if (qLower.includes('car')) leftEmoji = '🚗';
		else if (qLower.includes('apple')) leftEmoji = '🍎';
		else if (qLower.includes('ball')) leftEmoji = '⚽';
		else if (qLower.includes('book')) leftEmoji = '📚';
		else if (qLower.includes('coin')) leftEmoji = '🪙';
		else if (qLower.includes('star')) leftEmoji = '⭐';
		else leftEmoji = '🚗';
	}

	if (!rightEmoji) {
		if (qLower.includes('block') || qLower.includes('brick'))
			rightEmoji = '🧱';
		else if (qLower.includes('cube')) rightEmoji = '🧊';
		else if (qLower.includes('marble')) rightEmoji = '⚪';
		else if (qLower.includes('weight')) rightEmoji = '⚖️';
		else rightEmoji = '🧱';
	}

	if (!leftLabel && qText) {
		const carMatch = qText.match(
			/(\d+)\s*(?:identical\s*)?(?:toy\s*)?car/i,
		);
		if (carMatch) {
			leftLabel = `${carMatch[1]} Car${parseInt(carMatch[1], 10) > 1 ? 's' : ''}`;
		} else {
			leftLabel = '1 Toy Car';
		}
	}

	if (!rightLabel && qText) {
		if (data.correctAnswerText || data.correctAnswer) {
			rightLabel = String(data.correctAnswerText || data.correctAnswer);
		} else {
			const blockMatch = qText.match(/(\d+)\s*(?:wooden\s*)?block/i);
			if (blockMatch) rightLabel = `${blockMatch[1]} Blocks`;
			else rightLabel = 'Blocks';
		}
	}

	const heavySide = data.heavySide || 'balanced';
	const isRightHeavy = heavySide === 'right';
	const isLeftHeavy = heavySide === 'left';
	const isBalanced =
		heavySide === 'balanced' || (!isRightHeavy && !isLeftHeavy);

	const beamY1 =
		isBalanced ? 100
		: isRightHeavy ? 80
		: 120;
	const beamY2 =
		isBalanced ? 100
		: isRightHeavy ? 120
		: 80;

	const leftPanY =
		isBalanced ? 122
		: isRightHeavy ? 102
		: 142;
	const rightPanY =
		isBalanced ? 122
		: isRightHeavy ? 142
		: 102;

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/80 via-sky-50/70 to-purple-50/80 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
				<Scale className='w-3.5 h-3.5 text-indigo-600' />
				<span>Balance Scale Reasoning</span>
			</div>

			<svg
				viewBox='0 0 280 160'
				className='w-64 sm:w-72 h-36 drop-shadow-sm'>
				{/* Fulcrum base */}
				<polygon
					points='140,105 120,150 160,150'
					fill='#475569'
					stroke='#334155'
					strokeWidth='1.5'
				/>
				<circle
					cx='140'
					cy='105'
					r='5'
					fill='#0EA5E9'
				/>

				{/* Scale Beam */}
				<line
					x1='30'
					y1={beamY1}
					x2='250'
					y2={beamY2}
					stroke='#1E293B'
					strokeWidth='5'
					strokeLinecap='round'
				/>

				{/* Left Hanging Strings */}
				<line
					x1='50'
					y1={beamY1 + 2}
					x2='35'
					y2={leftPanY}
					stroke='#94A3B8'
					strokeWidth='1.5'
				/>
				<line
					x1='50'
					y1={beamY1 + 2}
					x2='65'
					y2={leftPanY}
					stroke='#94A3B8'
					strokeWidth='1.5'
				/>

				{/* Left Pan */}
				<path
					d={`M 25 ${leftPanY} Q 50 ${leftPanY + 12} 75 ${leftPanY}`}
					fill='none'
					stroke='#334155'
					strokeWidth='3.5'
					strokeLinecap='round'
				/>
				<text
					x='50'
					y={leftPanY - 5}
					fontSize='22'
					textAnchor='middle'>
					{leftEmoji}
				</text>
				<text
					x='50'
					y={leftPanY + 22}
					fontSize='10'
					fontWeight='900'
					fill='#1E293B'
					textAnchor='middle'>
					{leftLabel || 'Left Pan'}
				</text>

				{/* Right Hanging Strings */}
				<line
					x1='230'
					y1={beamY2 + 2}
					x2='215'
					y2={rightPanY}
					stroke='#94A3B8'
					strokeWidth='1.5'
				/>
				<line
					x1='230'
					y1={beamY2 + 2}
					x2='245'
					y2={rightPanY}
					stroke='#94A3B8'
					strokeWidth='1.5'
				/>

				{/* Right Pan */}
				<path
					d={`M 205 ${rightPanY} Q 230 ${rightPanY + 12} 255 ${rightPanY}`}
					fill='none'
					stroke='#334155'
					strokeWidth='3.5'
					strokeLinecap='round'
				/>
				<text
					x='230'
					y={rightPanY - 5}
					fontSize='22'
					textAnchor='middle'>
					{isSolution ? rightEmoji : '❓'}
				</text>
				<text
					x='230'
					y={rightPanY + 22}
					fontSize='10'
					fontWeight='900'
					fill={isSolution ? '#059669' : '#6366F1'}
					textAnchor='middle'>
					{isSolution ? rightLabel || '3 Blocks' : 'How many blocks?'}
				</text>

				{/* Center Balance Indicator */}
				{isBalanced && (
					<g>
						<rect
							x='105'
							y='68'
							width='70'
							height='18'
							rx='9'
							fill='#ECFDF5'
							stroke='#10B981'
							strokeWidth='1.2'
						/>
						<text
							x='140'
							y='81'
							fontSize='9'
							fontWeight='900'
							fill='#047857'
							textAnchor='middle'>
							⚖️ BALANCED
						</text>
					</g>
				)}
			</svg>
		</div>
	);
});
