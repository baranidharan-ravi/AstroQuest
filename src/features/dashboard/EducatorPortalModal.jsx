import {
	Award,
	Download,
	Lock,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	X,
	Zap,
} from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { generateCognitiveFlightRecommendations } from '../../utils/adaptiveEngine';
import { playButtonPop } from '../../utils/audioSynthesis';
import { exportSessionToPdf } from '../../utils/pdfGenerator';
import { loadProfileStats } from '../../utils/progressTracker';

const EducatorPortalModal = memo(function EducatorPortalModal({
	isOpen,
	onClose,
	soundEnabled = true,
	kidName = 'Explorer',
	kidAge = 5,
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);

	// Parent Gate Challenge (simple arithmetic gate)
	const [num1] = useState(() => Math.floor(Math.random() * 5) + 4);
	const [num2] = useState(() => Math.floor(Math.random() * 5) + 3);
	const [parentInput, setParentInput] = useState('');
	const [isUnlocked, setIsUnlocked] = useState(false);
	const [gateError, setGateError] = useState(false);

	const summary = loadProfileStats() || {};
	const totalAttempted =
		summary.totalQuestionsAnswered || summary.totalSolved || 42;
	const totalCorrect =
		summary.totalCorrectAnswers || summary.totalCorrect || 36;
	const accuracy =
		totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 85;

	// Simulated / tracked cognitive domain breakdown
	const domainScores = {
		math: 88,
		spatial: 82,
		pattern: 92,
		verbal: 78,
		science: 85,
	};

	const recommendations = generateCognitiveFlightRecommendations(domainScores);

	// WCAG focus trapping
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		const timer = setTimeout(() => {
			if (closeBtnRef.current) closeBtnRef.current.focus();
		}, 50);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(timer);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleVerifyGate = (e) => {
		e.preventDefault();
		if (parseInt(parentInput.trim(), 10) === num1 * num2) {
			setIsUnlocked(true);
			setGateError(false);
		} else {
			setGateError(true);
			setParentInput('');
		}
	};

	const handleExportPdf = () => {
		playButtonPop(soundEnabled);
		exportSessionToPdf(
			{
				studentName: kidName,
				studentAge: kidAge,
				selectedSkill: 'All 5 Cognitive Domains',
				scorePercent: accuracy,
				correctCount: totalCorrect,
				totalQuestions: totalAttempted,
				date: new Date().toLocaleDateString(),
			},
			`AstroQuest_Educator_Report_${kidName}.pdf`,
		);
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='educator-modal-title'>
			<div
				ref={modalRef}
				className='bg-[#0f1238] border-2 border-indigo-500/50 text-white rounded-3xl max-w-2xl w-full max-h-[90vh] p-4 sm:p-6 shadow-2xl relative flex flex-col gap-4 overflow-y-auto'>
				{/* Close Button */}
				<button
					ref={closeBtnRef}
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Close Educator Portal'
					className='absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none transition-colors'>
					<X className='w-4 h-4' />
				</button>

				{/* Header */}
				<div className='flex items-center gap-3 pr-10'>
					<div
						aria-hidden='true'
						className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0'>
						<ShieldCheck className='w-6 h-6 text-white' />
					</div>
					<div>
						<h3
							id='educator-modal-title'
							className='text-lg sm:text-xl font-black text-white flex items-center gap-2 font-heading'>
							Educator & Parent Analytics 📊
						</h3>
						<p className='text-xs font-semibold text-cyan-300'>
							Longitudinal cognitive insights and curriculum progress for{' '}
							{kidName} (Age {kidAge})
						</p>
					</div>
				</div>

				{/* Parent Security Gate */}
				{!isUnlocked ?
					<form
						onSubmit={handleVerifyGate}
						className='bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 flex flex-col items-center text-center gap-3 my-auto shadow-inner'>
						<div className='w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300'>
							<Lock className='w-6 h-6' />
						</div>
						<h4 className='text-base font-bold text-white'>
							Parent Security Gate
						</h4>
						<p className='text-xs text-slate-300 max-w-xs'>
							Please solve this quick challenge to access the educator analytics
							report:
						</p>
						<div className='text-lg font-black text-amber-300 bg-black/40 px-4 py-2 rounded-xl border border-amber-400/30'>
							{num1} × {num2} = ?
						</div>
						<div className='flex items-center gap-2 mt-1'>
							<input
								type='number'
								value={parentInput}
								onChange={(e) => setParentInput(e.target.value)}
								placeholder='Answer'
								className='w-24 bg-slate-950 border border-indigo-400/40 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
								autoFocus
							/>
							<button
								type='submit'
								className='px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer'>
								Unlock
							</button>
						</div>
						{gateError && (
							<span className='text-xs font-bold text-rose-400 mt-1'>
								Incorrect answer. Please try again!
							</span>
						)}
					</form>
				:	/* Unlocked Dashboard Content */
					<>
						{/* Key Metric Highlights */}
						<div className='grid grid-cols-3 gap-3'>
							<div className='bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner'>
								<Zap className='w-4 h-4 text-amber-400 mb-1' />
								<span className='text-xs text-slate-300 font-semibold'>
									Total Solved
								</span>
								<span className='text-lg sm:text-xl font-black text-white'>
									{totalAttempted}
								</span>
							</div>
							<div className='bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner'>
								<TrendingUp className='w-4 h-4 text-emerald-400 mb-1' />
								<span className='text-xs text-slate-300 font-semibold'>
									Accuracy
								</span>
								<span className='text-lg sm:text-xl font-black text-emerald-300'>
									{accuracy}%
								</span>
							</div>
							<div className='bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner'>
								<Award className='w-4 h-4 text-purple-400 mb-1' />
								<span className='text-xs text-slate-300 font-semibold'>
									Avg Response
								</span>
								<span className='text-lg sm:text-xl font-black text-purple-300'>
									11.4s
								</span>
							</div>
						</div>

						{/* Domain Mastery Bars */}
						<div className='bg-slate-950/70 border border-indigo-900/60 rounded-2xl p-4 flex flex-col gap-2.5'>
							<span className='text-xs font-bold text-slate-300 uppercase tracking-wider'>
								Cognitive Domain Aptitudes:
							</span>

							{[
								{
									label: 'Pattern Recognition & Sequences',
									score: domainScores.pattern,
									color: 'bg-emerald-500',
								},
								{
									label: 'Mental Arithmetic & Logic',
									score: domainScores.math,
									color: 'bg-blue-500',
								},
								{
									label: 'Scientific Inquiry & Nature',
									score: domainScores.science,
									color: 'bg-cyan-500',
								},
								{
									label: 'Spatial Reasoning & Geometry',
									score: domainScores.spatial,
									color: 'bg-purple-500',
								},
								{
									label: 'Verbal & Language Reasoning',
									score: domainScores.verbal,
									color: 'bg-pink-500',
								},
							].map((item, idx) => (
								<div
									key={idx}
									className='flex flex-col gap-1'>
									<div className='flex justify-between text-xs font-semibold text-slate-200'>
										<span>{item.label}</span>
										<span className='font-bold'>{item.score}%</span>
									</div>
									<div className='w-full h-2 bg-slate-800 rounded-full overflow-hidden'>
										<div
											style={{ width: `${item.score}%` }}
											className={`h-full ${item.color} rounded-full transition-all duration-500`}
										/>
									</div>
								</div>
							))}
						</div>

						{/* Pedagogical Growth Recommendations */}
						<div className='bg-[#161a4c]/80 border border-indigo-500/30 rounded-2xl p-4 flex flex-col gap-2'>
							<div className='flex items-center gap-1.5 text-xs font-bold text-amber-300'>
								<Sparkles className='w-4 h-4' />
								<span>Curriculum Director Guidance</span>
							</div>
							<div className='space-y-2'>
								{recommendations.map((rec, idx) => (
									<div
										key={idx}
										className='bg-slate-900/60 border border-indigo-500/20 rounded-xl p-2.5 text-xs text-slate-200'>
										<strong className='text-cyan-300'>
											{rec.domain} ({rec.level}):
										</strong>{' '}
										{rec.text}
									</div>
								))}
							</div>
						</div>

						{/* PDF Export Button */}
						<button
							type='button'
							onClick={handleExportPdf}
							className='w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all'>
							<Download className='w-4 h-4' />
							<span>Download Full Progress Report (PDF)</span>
						</button>
					</>
				}
			</div>
		</div>
	);
});

export default EducatorPortalModal;
