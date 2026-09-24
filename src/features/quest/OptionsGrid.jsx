import { Check, X as XIcon } from 'lucide-react';
import { memo } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';
import {
	DynamicSvgShape,
	hasShapeOrVisualConcept,
	parseDynamicShape,
} from '../../utils/shapeGenerator';
import { getConceptVisual, LazyVisualImage } from '../../utils/VisualDiagrams';

const OptionsGrid = memo(function OptionsGrid({
	options,
	selectedOptionId,
	onSelectOption,
	isSubmitted,
	correctAnswerId,
	soundEnabled,
	showVisualDiagrams = false,
	eliminatedOptionIds = [],
	telemetryScan = null,
}) {
	const handleKeyDown = (e, currentIdx) => {
		if (isSubmitted) return;
		let nextIdx = null;
		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			e.preventDefault();
			nextIdx = (currentIdx + 1) % options.length;
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			e.preventDefault();
			nextIdx = (currentIdx - 1 + options.length) % options.length;
		}
		if (nextIdx !== null && options[nextIdx]) {
			onSelectOption(options[nextIdx].id);
			const btn = document.getElementById(`option-btn-${options[nextIdx].id}`);
			if (btn) btn.focus();
		}
	};

	return (
		<div
			role='radiogroup'
			aria-labelledby='question-prompt-heading'
			aria-label='Answer options'
			className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5 p-1 flex-1 h-full w-full'>
			{options.map((opt, idx) => {
				const isSelected = selectedOptionId === opt.id;
				const isCorrect = opt.id === correctAnswerId;
				const text = String(opt.text || '');
				const isPureEmoji =
					/^[\p{Emoji}\s\u200d\ufe0e\ufe0f\u25A0-\u25FF\u2B50-\u2B55\u2600-\u26FF\u{1F780}-\u{1F7FF}]+$/u.test(
						text.trim(),
					);

				const isShapeOption =
					showVisualDiagrams && !isPureEmoji && hasShapeOrVisualConcept(text);
				const parsedShape = isShapeOption ? parseDynamicShape(text) : null;
				const conceptVisual =
					showVisualDiagrams && !isPureEmoji && !parsedShape ?
						getConceptVisual(text)
					:	null;
				const optionImage =
					showVisualDiagrams ? opt.imageUrl || opt.image || null : null;

				const isEliminated =
					!isSubmitted && eliminatedOptionIds.includes(opt.id);

				// Distinct Card Background & Ring State
				let cardStyle =
					'bg-white text-slate-800 border-2 border-slate-200 hover:border-indigo-400 shadow-md hover:shadow-lg hover:scale-[1.01]';
				let badgeStyle = 'bg-[#2A2368] text-white';
				let contrastBoxStyle =
					'bg-slate-100/90 border border-slate-300 shadow-inner';

				if (isEliminated) {
					// 50/50 Cosmic Ray Eliminated Option
					cardStyle =
						'bg-slate-900/40 text-slate-500 border-2 border-dashed border-rose-500/30 opacity-30 pointer-events-none scale-95 shadow-none select-none';
					badgeStyle = 'bg-rose-950/70 text-rose-400 border border-rose-500/40';
					contrastBoxStyle =
						'bg-slate-900/60 border border-slate-700 opacity-40';
				} else if (!isSubmitted) {
					if (isSelected) {
						// Selected State: High-contrast Orange gradient with dark offset ring
						cardStyle =
							'bg-gradient-to-tr from-[#FF9500] to-[#FF6B00] text-white shadow-2xl scale-[1.02] border-2 border-white ring-4 ring-orange-400/80 ring-offset-2 ring-offset-[#0d1033]';
						badgeStyle = 'bg-[#1F174B] text-white ring-2 ring-white/60';
						// Contrast pedestal for shape on orange card
						contrastBoxStyle =
							'bg-white/95 border-2 border-white shadow-md text-slate-900';
					}
				} else {
					// Submitted States
					if (isCorrect) {
						// Correct Answer: Vibrant Emerald Green
						cardStyle =
							'bg-gradient-to-tr from-[#00D166] to-[#059669] text-white shadow-2xl scale-[1.02] border-2 border-white ring-4 ring-emerald-400/80 ring-offset-2 ring-offset-[#0d1033]';
						badgeStyle = 'bg-[#093D22] text-white ring-2 ring-white/60';
						contrastBoxStyle =
							'bg-white/95 border-2 border-white shadow-md text-slate-900';
					} else if (isSelected && !isCorrect) {
						// Selected Wrong Answer: Coral Red
						cardStyle =
							'bg-gradient-to-tr from-[#FF435A] to-[#DC2626] text-white shadow-2xl scale-[1.02] border-2 border-white ring-4 ring-rose-400/80 ring-offset-2 ring-offset-[#0d1033]';
						badgeStyle = 'bg-[#5C0F17] text-white ring-2 ring-white/60';
						contrastBoxStyle =
							'bg-white/95 border-2 border-white shadow-md text-slate-900';
					} else {
						// Other unselected answers: Dimmed
						cardStyle =
							'bg-white/80 text-slate-400 opacity-55 pointer-events-none border-slate-200';
						badgeStyle = 'bg-slate-200 text-slate-500';
						contrastBoxStyle =
							'bg-slate-100 border border-slate-200 opacity-60';
					}
				}

				const accessibleLabel =
					isEliminated ?
						`Option ${opt.id}: ${text} - Eliminated by 50/50 Cosmic Ray`
					:	`Option ${opt.id}: ${text}${
							isSubmitted ?
								isCorrect ? ' - Correct answer'
								: isSelected ? ' - Your incorrect answer'
								: ''
							: isSelected ? ' - Selected'
							: ''
						}`;

				return (
					<button
						key={opt.id}
						id={`option-btn-${opt.id}`}
						type='button'
						role='radio'
						aria-checked={isSelected}
						aria-disabled={isSubmitted || isEliminated}
						aria-label={accessibleLabel}
						disabled={isSubmitted || isEliminated}
						onKeyDown={(e) => handleKeyDown(e, idx)}
						onClick={() => {
							if (isEliminated) return;
							playButtonPop(soundEnabled);
							onSelectOption(opt.id);
						}}
						className={`rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 flex items-center justify-start gap-2.5 sm:gap-3.5 transition-all duration-200 text-left flex-1 h-full min-h-[72px] sm:min-h-[86px] cursor-pointer relative overflow-hidden focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:outline-none ${cardStyle}`}>
						{/* Letter Badge (A, B, C, D) */}
						<div
							aria-hidden='true'
							className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base flex-shrink-0 shadow-md ${badgeStyle}`}>
							{isSubmitted && isCorrect ?
								<Check className='w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]' />
							: isSubmitted && isSelected && !isCorrect ?
								<XIcon className='w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]' />
							:	opt.id}
						</div>

						{/* Option Image, Dynamic Visual Shape, or Concept Icon */}
						{optionImage ?
							<div
								aria-hidden='true'
								className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all overflow-hidden ${contrastBoxStyle}`}>
								<LazyVisualImage
									src={optionImage}
									alt={`Option ${opt.id}`}
									className='w-full h-full object-contain p-1'
								/>
							</div>
						: parsedShape ?
							<div
								aria-hidden='true'
								className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${contrastBoxStyle}`}>
								<DynamicSvgShape
									parsed={parsedShape}
									size={52}
									patternId={`opt-hatch-${opt.id}-${idx}`}
								/>
							</div>
						: conceptVisual?.icon && conceptVisual.icon !== '💡' ?
							<div
								aria-hidden='true'
								className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 transition-all ${contrastBoxStyle}`}>
								{conceptVisual.icon}
							</div>
						:	null}

						{/* Option Content Text */}
						<div
							className={`flex flex-col justify-center flex-1 min-w-0 ${isPureEmoji ? 'items-center text-center' : ''}`}>
							<span
								className={`font-black tracking-tight leading-snug break-words ${
									isPureEmoji ?
										'text-3xl sm:text-4xl filter drop-shadow-sm select-none'
									:	`text-sm sm:text-base md:text-lg ${isSelected && !isSubmitted ? 'text-white' : ''}`
								}`}>
								{text}
							</span>
						</div>

						{/* 50/50 Cosmic Ray Elimination Pill */}
						{isEliminated && (
							<span
								aria-hidden='true'
								className='ml-auto text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 flex-shrink-0'>
								50/50 Blasted ☄️
							</span>
						)}

						{/* Starfleet Telemetry Scan Confidence Pill */}
						{!isEliminated && telemetryScan && telemetryScan[opt.id] !== undefined && (
							<span
								aria-hidden='true'
								className={`ml-auto text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 flex items-center gap-1 ${
									telemetryScan[opt.id] >= 50 ?
										'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
									:	'bg-slate-500/20 text-slate-400 border-slate-400/30'
								}`}>
								<span>🛸</span>
								<span>{telemetryScan[opt.id]}%</span>
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
});

export default OptionsGrid;
