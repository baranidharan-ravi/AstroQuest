import React from 'react';
import { DynamicSvgShape } from './DynamicSvgShape';
import { parseDynamicShape } from './shapeParsers';

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
		const textStr = String(item || '')
			.replace(/[\uFE0E\uFE0F\u200B-\u200D\uFEFF]/g, '')
			.trim();
		if (!textStr) return null;
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

export default DynamicShapeCard;
