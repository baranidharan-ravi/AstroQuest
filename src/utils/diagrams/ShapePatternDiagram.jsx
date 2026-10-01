import { Shapes } from 'lucide-react';
import { memo } from 'react';
import {
	DynamicShapeCard,
	extractShapeSequenceTerms,
	ShapeClusterCard,
} from '../shapeGenerator';

/**
 * ShapeClusterProgressionDiagram Component
 */
export const ShapeClusterProgressionDiagram = memo(
	function ShapeClusterProgressionDiagram({ data = {}, isSolution = false }) {
		const steps = data.steps || [
			{ step: 1, count: 1, shape: 'square', isShaded: true },
			{ step: 2, count: 3, shape: 'square', isShaded: true },
			{ step: 3, count: 6, shape: 'square', isShaded: true },
			{ step: 4, count: 10, shape: 'square', isShaded: true },
		];
		const targetStep =
			data.targetStep ||
			(steps.length > 0 ? steps[steps.length - 1].step + 2 : 6);
		const targetCount = data.targetCount || 21;
		const shape = data.shape || steps[0]?.shape || 'square';
		const isShaded = data.isShaded !== undefined ? data.isShaded : true;
		const color = data.color || '#3B82F6';

		return (
			<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-purple-50/90 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
				<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2.5 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
					<Shapes className='w-3.5 h-3.5 text-indigo-600' />
					<span>Growing Shape Count Progression</span>
				</div>

				<div className='flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 w-full'>
					{steps.map((st, idx) => (
						<div
							key={idx}
							className='flex items-center gap-1 sm:gap-1.5'>
							<ShapeClusterCard
								step={st.step}
								count={st.count}
								shape={st.shape || shape}
								isShaded={st.isShaded !== undefined ? st.isShaded : isShaded}
								color={st.color || color}
								patternId={`cluster-pat-${idx}`}
							/>
							{idx < steps.length - 1 && (
								<span className='text-xs font-black text-indigo-400'>➔</span>
							)}
						</div>
					))}

					<span className='text-xs font-black text-indigo-400'>➔</span>

					{/* Target Step Card */}
					<ShapeClusterCard
						step={targetStep}
						count={targetCount}
						shape={shape}
						isShaded={isShaded}
						color={color}
						isTarget={true}
						isSolution={isSolution}
						patternId={`cluster-pat-sol`}
					/>
				</div>

				{/* Solution Calculation Banner */}
				{isSolution && (
					<div className='mt-2.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black shadow-lg animate-bounce-short flex items-center gap-2'>
						<span>✨ Step {targetStep} Target Count:</span>
						<span>{targetCount} Shaded Squares</span>
					</div>
				)}
			</div>
		);
	},
);

/**
 * ShapeSequenceDiagram Component
 */
export const ShapeSequenceDiagram = memo(function ShapeSequenceDiagram({
	data = {},
	isSolution = false,
}) {
	let rawItems = [];
	if (Array.isArray(data.sequence)) {
		rawItems = data.sequence;
	} else if (Array.isArray(data.steps)) {
		rawItems = data.steps;
	}

	const qSource = data.question || data.questionText || data.raw || '';
	if (qSource) {
		const extracted = extractShapeSequenceTerms(qSource);
		if (extracted && extracted.length >= 2) {
			if (
				rawItems.length === 0 ||
				extracted.length > rawItems.length ||
				!rawItems.every((it, idx) => it === extracted[idx]) ||
				rawItems.every((it) => /^\d+(st|nd|rd|th)$/i.test(String(it).trim()))
			) {
				rawItems = extracted;
			}
		}
	}

	// Filter out any trailing question sentences, question marks, placeholders, or empty/invisible tokens
	let items = rawItems
		.map((item) =>
			typeof item === 'string' ?
				item.replace(/[\uFE0E\uFE0F\u200B-\u200D\uFEFF]/g, '').trim()
			:	item,
		)
		.filter((item) => {
			if (!item) return false;
			if (typeof item === 'string') {
				if (!item.trim()) return false;
				if (item === '?' || item.includes('?')) return false;
				if (/^(_+|\.\.\.+)$/.test(item)) return false;
				if (/^(what|which|how|find|comes|pattern|sequence|look)\b/i.test(item))
					return false;
			}
			return true;
		});

	if (items.length === 0) {
		items = [
			'Triangle (white)',
			'Square (shaded)',
			'Triangle (white)',
			'Square (shaded)',
		];
	}

	const nextItem =
		data.correctAnswer ||
		data.correctAnswerText ||
		data.nextItem ||
		data.nextVal ||
		items[0] ||
		'?';

	const isCompact = items.length >= 5;

	return (
		<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-purple-50/90 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2.5 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
				<Shapes className='w-3.5 h-3.5 text-indigo-600' />
				<span>Geometric Shape & Color Progression</span>
			</div>

			{/* Geometric Shape Cards Row */}
			<div className='flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 w-full'>
				{items.map((item, idx) => (
					<div
						key={idx}
						className='flex items-center gap-1 sm:gap-1.5'>
						<DynamicShapeCard
							item={item}
							index={idx}
							isCompact={isCompact}
						/>
						{idx < items.length - 1 && (
							<span className='text-[10px] sm:text-xs font-black text-indigo-400'>
								➔
							</span>
						)}
					</div>
				))}

				<span className='text-[10px] sm:text-xs font-black text-indigo-400'>
					➔
				</span>

				{/* Target Next Term Card */}
				<DynamicShapeCard
					item={nextItem}
					index={items.length}
					isTarget={true}
					isSolution={isSolution}
					isCompact={isCompact}
				/>
			</div>
		</div>
	);
});
