import {
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	ChevronsDown,
	ChevronsUp,
	Download,
	LayoutGrid,
	Lightbulb,
	RefreshCw,
	SkipForward,
	XCircle,
} from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';
import VisualDiagram, {
	isDiagramAppropriateForQuestion,
} from '../../utils/VisualDiagrams';

const QuestionSummary = memo(function QuestionSummary({
	questions,
	history,
	onStartNextSheet,
	onDownloadPdf,
	activeTab,
	setActiveTab,
	soundEnabled,
	onBackToDashboard,
	showVisualDiagrams = false,
}) {
	// Track which question accordions are currently expanded
	const [expandedIndices, setExpandedIndices] = useState(() => new Set());

	const toggleExpand = useCallback(
		(idx) => {
			playButtonPop(soundEnabled);
			setExpandedIndices((prev) => {
				const next = new Set(prev);
				if (next.has(idx)) {
					next.delete(idx);
				} else {
					next.add(idx);
				}
				return next;
			});
		},
		[soundEnabled],
	);

	const handleExpandAll = useCallback(() => {
		playButtonPop(soundEnabled);
		const all = new Set(questions.map((_, i) => i));
		setExpandedIndices(all);
	}, [questions, soundEnabled]);

	const handleCollapseAll = useCallback(() => {
		playButtonPop(soundEnabled);
		setExpandedIndices(new Set());
	}, [soundEnabled]);

	const isAllExpanded =
		questions.length > 0 && expandedIndices.size === questions.length;
	const isAllCollapsed = expandedIndices.size === 0;

	return (
		<div className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500'>
			{/* Top Tabs */}
			<div
				role='tablist'
				aria-label='Quest results views'
				className='flex items-center gap-3 mb-6'>
				<button
					type='button'
					role='tab'
					id='tab-overview'
					aria-selected={activeTab === 'overview'}
					aria-controls='panel-overview'
					tabIndex={activeTab === 'overview' ? 0 : -1}
					onClick={() => {
						playButtonPop(soundEnabled);
						setActiveTab('overview');
					}}
					className={`px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg focus-visible:ring-4 focus-visible:ring-pink-400 cursor-pointer ${
						activeTab === 'overview' ?
							'bg-[#FF5B84] text-white ring-4 ring-pink-500/30'
						:	'bg-[#15184C] text-gray-300 hover:text-white border border-[#2B3280]'
					}`}>
					Result Overview
				</button>

				<button
					type='button'
					role='tab'
					id='tab-summary'
					aria-selected={activeTab === 'summary'}
					aria-controls='panel-summary'
					tabIndex={activeTab === 'summary' ? 0 : -1}
					onClick={() => {
						playButtonPop(soundEnabled);
						setActiveTab('summary');
					}}
					className={`px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg focus-visible:ring-4 focus-visible:ring-pink-400 cursor-pointer ${
						activeTab === 'summary' ?
							'bg-[#FF5B84] text-white ring-4 ring-pink-500/30'
						:	'bg-[#15184C] text-gray-300 hover:text-white border border-[#2B3280]'
					}`}>
					Question Summary
				</button>
			</div>

			{/* Controls: Question count & Expand / Collapse All buttons */}
			<div className='w-full flex items-center justify-between gap-3 mb-4 px-1'>
				<div className='flex items-center gap-2'>
					<span className='text-xs sm:text-sm font-black text-slate-300'>
						{questions.length} Questions
					</span>
					<span className='text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full'>
						{expandedIndices.size === questions.length ?
							'All Expanded'
						: expandedIndices.size === 0 ?
							'All Collapsed'
						:	`${expandedIndices.size} Expanded`}
					</span>
				</div>

				<div className='flex items-center gap-2'>
					{/* Expand All Button */}
					<button
						type='button'
						onClick={handleExpandAll}
						disabled={isAllExpanded}
						aria-label='Expand all questions'
						className={`px-3 sm:px-3.5 py-1.5 rounded-xl border font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-cyan-400 ${
							isAllExpanded ?
								'bg-white/5 border-white/10 text-slate-500 opacity-60 cursor-not-allowed'
							:	'bg-[#181D58] hover:bg-[#232B78] border-[#38419D] text-cyan-300 hover:text-white cursor-pointer hover:scale-105 active:scale-95'
						}`}
						title='Expand all questions'>
						<ChevronsDown className='w-4 h-4' />
						<span>Expand All</span>
					</button>

					{/* Collapse All Button */}
					<button
						type='button'
						onClick={handleCollapseAll}
						disabled={isAllCollapsed}
						aria-label='Collapse all questions'
						className={`px-3 sm:px-3.5 py-1.5 rounded-xl border font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-pink-400 ${
							isAllCollapsed ?
								'bg-white/5 border-white/10 text-slate-500 opacity-60 cursor-not-allowed'
							:	'bg-[#181D58] hover:bg-[#232B78] border-[#38419D] text-pink-300 hover:text-white cursor-pointer hover:scale-105 active:scale-95'
						}`}
						title='Collapse all questions'>
						<ChevronsUp className='w-4 h-4' />
						<span>Collapse All</span>
					</button>
				</div>
			</div>

			{/* Questions Accordion List */}
			<div
				id='panel-summary'
				role='tabpanel'
				aria-labelledby='tab-summary'
				tabIndex={0}
				className='w-full flex flex-col gap-3 focus:outline-none'>
				{questions.map((q, idx) => {
					const userResult = history[idx] || {};
					const isCorrect = userResult.isCorrect;
					const isExpanded = expandedIndices.has(idx);
					const userOption = q.options.find(
						(o) => o.id === userResult.selectedOptionId,
					);
					const correctOption = q.options.find(
						(o) => o.id === q.correctAnswerId,
					);

					return (
						<div
							key={q.id || idx}
							className='bg-[#121644] border-2 border-[#29317D] rounded-2xl overflow-hidden shadow-lg transition-all'>
							{/* Accordion Header */}
							<button
								type='button'
								id={`q-header-${idx}`}
								aria-expanded={isExpanded}
								aria-controls={`q-details-${idx}`}
								onClick={() => toggleExpand(idx)}
								className='w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#181D58] transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer'>
								<div className='flex items-center gap-3'>
									{/* Status Icon */}
									{isCorrect ?
										<CheckCircle2 className='w-6 h-6 text-[#00D166] flex-shrink-0' />
									: userResult.skipped ?
										<div
											className='w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center flex-shrink-0'
											title='Question Skipped'>
											<SkipForward className='w-3.5 h-3.5 text-amber-400' />
										</div>
									:	<XCircle className='w-6 h-6 text-[#FF435A] flex-shrink-0' />}

									{/* Question Index & Text */}
									<div>
										<div className='flex items-center gap-2'>
											<span className='text-xs font-black text-slate-400'>
												Q{idx + 1}/{questions.length}
											</span>
											{userResult.skipped && (
												<span className='text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/50'>
													Skipped
												</span>
											)}
											<span className='text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-[#202766] text-cyan-300 border border-[#313C96]'>
												{q.category}
											</span>
										</div>
										<p className='text-sm sm:text-base font-bold text-white mt-1 line-clamp-1'>
											{q.question || q.questionText}
										</p>
									</div>
								</div>

								{/* Right Arrow */}
								<div className='p-2 rounded-xl bg-[#1B215E] text-gray-300'>
									{isExpanded ?
										<ChevronUp className='w-4 h-4' />
									:	<ChevronDown className='w-4 h-4' />}
								</div>
							</button>

							{/* Accordion Body */}
							{isExpanded && (
								<div
									id={`q-details-${idx}`}
									role='region'
									aria-labelledby={`q-header-${idx}`}
									className='p-4 sm:p-6 bg-[#0E1238] border-t border-[#29317D] flex flex-col gap-4'>
									{/* Question Full Text */}
									<p className='text-base sm:text-lg font-bold text-white leading-relaxed'>
										{q.question || q.questionText}
									</p>

									{/* Visual Diagram Preview */}
									{showVisualDiagrams &&
										q.diagramType &&
										isDiagramAppropriateForQuestion(
											q.diagramType,
											q.diagramData,
											q.question || q.questionText,
										) && (
											<VisualDiagram
												type={q.diagramType}
												data={{
													...q.diagramData,
													questionText: q.question || q.questionText,
													correctAnswerText:
														q.correctAnswerText || q.correctAnswer,
												}}
											/>
										)}

									{/* Answers Comparison */}
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
										<div
											className={`p-3.5 rounded-xl border-2 ${
												isCorrect ?
													'bg-emerald-50 border-emerald-400 text-emerald-900'
												: userResult.skipped ?
													'bg-amber-50 border-amber-400 text-amber-900'
												:	'bg-rose-50 border-rose-400 text-rose-900'
											}`}>
											<span className='text-xs font-black uppercase tracking-wider block mb-1'>
												Your Answer:
											</span>
											<span className='font-bold text-sm sm:text-base'>
												{userOption ?
													`${userOption.id}. ${userOption.text}`
												: userResult.skipped ?
													'⏭️ Skipped (Not Answered)'
												: userResult.timedOut ?
													'⏱️ Timed Out (Not Answered)'
												:	'Not answered'}
											</span>
										</div>

										<div className='p-3.5 rounded-xl border-2 bg-emerald-50 border-emerald-400 text-emerald-900'>
											<span className='text-xs font-black uppercase tracking-wider block mb-1'>
												Correct Answer:
											</span>
											<span className='font-bold text-sm sm:text-base'>
												{correctOption ?
													`${correctOption.id}. ${correctOption.text}`
												:	''}
											</span>
										</div>
									</div>

									{/* Solution Card with Visual */}
									<div className='bg-purple-50 rounded-2xl p-4 border border-purple-200'>
										<div className='flex items-center gap-2 text-purple-800 font-black text-sm mb-2'>
											<Lightbulb className='w-4 h-4 text-amber-500 fill-amber-400' />
											<span>Solution Explanation</span>
										</div>
										<p className='text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed mb-3'>
											{q.solutionText}
										</p>
										{showVisualDiagrams &&
											(q.solutionDiagramType || q.diagramType) &&
											isDiagramAppropriateForQuestion(
												q.solutionDiagramType || q.diagramType,
												q.solutionDiagramData || q.diagramData,
												q.question || q.questionText,
											) && (
												<VisualDiagram
													type={q.solutionDiagramType || q.diagramType}
													data={{
														...(q.solutionDiagramData || q.diagramData),
														questionText: q.question || q.questionText,
														correctAnswerText:
															q.correctAnswerText || q.correctAnswer,
													}}
													isSolution={true}
												/>
											)}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Bottom Action Buttons */}
			<div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-2xl'>
				<button
					type='button'
					aria-label='Start next AstroQuest with 10 new questions'
					onClick={() => {
						playButtonPop(soundEnabled);
						onStartNextSheet();
					}}
					className='w-full sm:w-auto py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-extrabold text-sm sm:text-base shadow-[0_10px_25px_rgba(255,91,132,0.4)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-pink-400'>
					<RefreshCw className='w-4 h-4 animate-spin-slow' />
					<span>Start Next AstroQuest</span>
				</button>

				{onDownloadPdf && (
					<button
						type='button'
						aria-label='Download session PDF report'
						onClick={() => {
							playButtonPop(soundEnabled);
							onDownloadPdf();
						}}
						className='w-full sm:w-auto py-3.5 sm:py-4 px-6 rounded-2xl bg-[#0F143D] hover:bg-[#1A205E] border-2 border-cyan-400 text-cyan-300 hover:text-white font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cyan-400'>
						<Download className='w-4 h-4' />
						<span>Download PDF Report 📄</span>
					</button>
				)}

				{onBackToDashboard && (
					<button
						type='button'
						aria-label='Back to Skills Hub'
						onClick={() => {
							playButtonPop(soundEnabled);
							onBackToDashboard();
						}}
						className='w-full sm:w-auto py-3.5 sm:py-4 px-6 rounded-2xl bg-[#1C2263] hover:bg-[#252D80] border border-[#3A45A8] text-slate-300 hover:text-white font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-4 focus-visible:ring-indigo-400'>
						<LayoutGrid className='w-4 h-4' />
						<span>Skills Hub</span>
					</button>
				)}
			</div>
		</div>
	);
});

export default QuestionSummary;
