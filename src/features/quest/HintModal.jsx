import { Clock, Radio, Sparkles, X, Zap } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { CHRONO_FREEZE_SECONDS, LIFELINE_TABS } from '../../constants';
import { playButtonPop } from '../../utils/audioSynthesis';

const HintModal = memo(function HintModal({
	hintText,
	isOpen,
	onClose,
	soundEnabled,
	onActivateCosmicRay,
	cosmicRayUsed = false,
	canUseCosmicRay = true,
	onActivateTelemetryScan,
	telemetryScan = null,
	telemetryScanUsed = false,
	canUseTelemetryScan = true,
	onActivateChronoFreeze,
	chronoFreezeUsed = false,
	canUseChronoFreeze = true,
	currentQuestion = null,
	eliminatedOptionIds = [],
	timerEnabled = true,
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);
	const [activeTab, setActiveTab] = useState(LIFELINE_TABS.CLUE);

	// WCAG AA: Escape key and focus trapping
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
				return;
			}

			if (e.key === 'Tab' && modalRef.current) {
				const focusables = modalRef.current.querySelectorAll(
					'button:not([disabled]), [tabindex="0"]',
				);
				if (focusables.length === 0) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];

				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		const timer = setTimeout(() => {
			if (closeBtnRef.current) {
				closeBtnRef.current.focus();
			}
		}, 50);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(timer);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='hint-modal-title'>
			<div
				ref={modalRef}
				className='bg-[#15194D] border-2 border-[#38419D] text-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative transform animate-in zoom-in-95 duration-200 overflow-hidden'>
				{/* Close Button */}
				<button
					ref={closeBtnRef}
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Close lifeline dialog'
					className='absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full bg-[#20276E] text-gray-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none z-10'>
					<X className='w-4 h-4' />
				</button>

				{/* Header with Zap */}
				<div className='flex items-center gap-3 mb-4 pr-10'>
					<div
						aria-hidden='true'
						className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-cyan-400 flex items-center justify-center shadow-lg flex-shrink-0'>
						<Sparkles className='w-6 h-6 text-white fill-white animate-spin-slow' />
					</div>
					<div>
						<h3
							id='hint-modal-title'
							className='text-lg sm:text-xl font-black text-white leading-tight'>
							Cosmic Lifelines & Power-Ups 🛸
						</h3>
						<span className='text-xs font-semibold text-pink-300'>
							Choose a hint, blast wrong answers, scan telemetry, or add time!
						</span>
					</div>
				</div>

				{/* 4-Tier Lifeline Navigation Tabs */}
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-4 bg-[#0E1238] p-1.5 rounded-2xl border border-white/10'>
					{/* Tab 1: Cosmic Clue */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setActiveTab(LIFELINE_TABS.CLUE);
						}}
						className={`py-2 px-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
							activeTab === LIFELINE_TABS.CLUE ?
								'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
							:	'text-slate-400 hover:text-white'
						}`}>
						<span>💡</span>
						<span>Clue</span>
					</button>

					{/* Tab 2: 50/50 Blast */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setActiveTab(LIFELINE_TABS.RAY);
						}}
						className={`py-2 px-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
							activeTab === LIFELINE_TABS.RAY ?
								'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
							:	'text-slate-400 hover:text-white'
						}`}>
						<span>⚡</span>
						<span>50/50</span>
						{cosmicRayUsed && (
							<span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5' />
						)}
					</button>

					{/* Tab 3: Telemetry Scan */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setActiveTab(LIFELINE_TABS.SCAN);
						}}
						className={`py-2 px-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
							activeTab === LIFELINE_TABS.SCAN ?
								'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
							:	'text-slate-400 hover:text-white'
						}`}>
						<span>🛸</span>
						<span>Scan</span>
						{telemetryScanUsed && (
							<span className='w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-0.5' />
						)}
					</button>

					{/* Tab 4: Chrono Freeze */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							setActiveTab(LIFELINE_TABS.FREEZE);
						}}
						className={`py-2 px-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
							activeTab === LIFELINE_TABS.FREEZE ?
								'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
							:	'text-slate-400 hover:text-white'
						}`}>
						<span>⏱️</span>
						<span>+30s</span>
						{chronoFreezeUsed && (
							<span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5' />
						)}
					</button>
				</div>

				{/* Tab 1: Cosmic Clue */}
				{activeTab === LIFELINE_TABS.CLUE && (
					<div className='bg-white text-slate-800 rounded-2xl p-4 sm:p-5 font-bold text-sm sm:text-base leading-relaxed shadow-inner my-3 animate-in fade-in duration-150 border-2 border-pink-200'>
						<div className='flex items-center gap-2 mb-2 text-pink-600 text-xs font-black uppercase tracking-wider'>
							<span>✨ Mission Control Guidance</span>
						</div>
						{hintText ||
							'Look closely at the shapes, numbers, and relationships. Eliminate options that don’t fit!'}
					</div>
				)}

				{/* Tab 2: 50/50 Cosmic Ray Blast */}
				{activeTab === LIFELINE_TABS.RAY && (
					<div className='bg-gradient-to-b from-[#1C1F5E] to-[#121644] border border-amber-400/40 rounded-2xl p-4 sm:p-5 text-center my-3 animate-in fade-in duration-150'>
						<div className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto mb-2 shadow'>
							<Zap className='w-6 h-6 animate-pulse' />
						</div>
						<h4 className='text-base sm:text-lg font-black text-white mb-1'>
							50/50 Cosmic Ray Power-Up ☄️
						</h4>
						<p className='text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed'>
							{cosmicRayUsed ?
								'The Cosmic Ray has already disintegrated 2 incorrect options from this question!'
							:	'Fire a cosmic beam to vaporize 2 incorrect options, leaving only the right answer and 1 distractor!'
							}
						</p>

						<button
							type='button'
							disabled={cosmicRayUsed || !canUseCosmicRay}
							onClick={() => {
								if (onActivateCosmicRay) {
									onActivateCosmicRay();
								}
								onClose();
							}}
							className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
								cosmicRayUsed ?
									'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 opacity-80 cursor-not-allowed'
								:	'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-amber-400/50'
							}`}>
							<Zap className='w-4 h-4 fill-current' />
							<span>
								{cosmicRayUsed ?
									'✓ 2 Options Blasted!'
								:	'Fire 50/50 Cosmic Ray ⚡'}
							</span>
						</button>
					</div>
				)}

				{/* Tab 3: Starfleet Telemetry Scan */}
				{activeTab === LIFELINE_TABS.SCAN && (
					<div className='bg-gradient-to-b from-[#11244A] to-[#0A1734] border border-cyan-400/40 rounded-2xl p-4 sm:p-5 my-3 animate-in fade-in duration-150'>
						<div className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mx-auto mb-2 shadow'>
							<Radio className='w-6 h-6 animate-pulse' />
						</div>
						<h4 className='text-base sm:text-lg font-black text-white text-center mb-1'>
							Starfleet Telemetry Scan 🛸
						</h4>
						<p className='text-xs sm:text-sm text-slate-300 text-center mb-3 leading-relaxed'>
							{telemetryScanUsed ?
								'Deep-space sensors have analyzed electromagnetic signatures for all options!'
							:	'Deploy satellite radar sweep to detect the option with the highest probability match!'
							}
						</p>

						{/* Telemetry Progress Bars If Scanned */}
						{telemetryScan && (
							<div className='space-y-2 mb-4 bg-[#0A1029] p-3 rounded-xl border border-cyan-500/30'>
								{currentQuestion?.options?.map((opt) => {
									const percent = telemetryScan[opt.id] ?? 0;
									const isElim = eliminatedOptionIds.includes(opt.id);
									return (
										<div
											key={opt.id}
											className='flex items-center gap-2'>
											<span className='w-6 font-black text-xs text-cyan-300 flex-shrink-0'>
												[{opt.id}]
											</span>
											<div className='flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden border border-white/10'>
												<div
													style={{ width: `${percent}%` }}
													className={`h-full transition-all duration-700 rounded-full ${
														percent >= 50 ?
															'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
														:	'bg-gradient-to-r from-slate-600 to-slate-500'
													}`}
												/>
											</div>
											<span
												className={`text-xs font-black min-w-[42px] text-right ${
													isElim ? 'text-rose-400 line-through opacity-50'
													: percent >= 50 ? 'text-cyan-300 font-black'
													: 'text-slate-400'
												}`}>
												{isElim ? 'BLAST' : `${percent}%`}
											</span>
										</div>
									);
								})}
							</div>
						)}

						<button
							type='button'
							disabled={telemetryScanUsed || !canUseTelemetryScan}
							onClick={() => {
								if (onActivateTelemetryScan) {
									onActivateTelemetryScan();
								}
							}}
							className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
								telemetryScanUsed ?
									'bg-cyan-950/80 border-2 border-cyan-500 text-cyan-300 cursor-default'
								:	'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-cyan-400/50'
							}`}>
							<Radio className='w-4 h-4' />
							<span>
								{telemetryScanUsed ?
									'✓ Telemetry Radar Active!'
								:	'Deploy Telemetry Scan 🛸'}
							</span>
						</button>
					</div>
				)}

				{/* Tab 4: Chrono Freeze */}
				{activeTab === LIFELINE_TABS.FREEZE && (
					<div className='bg-gradient-to-b from-[#11382F] to-[#0A221C] border border-emerald-400/40 rounded-2xl p-4 sm:p-5 text-center my-3 animate-in fade-in duration-150'>
						<div className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 mx-auto mb-2 shadow'>
							<Clock className='w-6 h-6 animate-spin-slow' />
						</div>
						<h4 className='text-base sm:text-lg font-black text-white mb-1'>
							Chrono Freeze Time Warp ⏱️
						</h4>
						<p className='text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed'>
							{chronoFreezeUsed ?
								`+${CHRONO_FREEZE_SECONDS} bonus seconds were added to your challenge clock!`
							: timerEnabled ?
								`Summon a cosmic time distortion to add +${CHRONO_FREEZE_SECONDS} bonus seconds and freeze urgency colors!`
							:	'Activate the Cosmic Focus Shield for starlight protection and bonus XP!'
							}
						</p>

						<button
							type='button'
							disabled={chronoFreezeUsed || !canUseChronoFreeze}
							onClick={() => {
								if (onActivateChronoFreeze) {
									onActivateChronoFreeze();
								}
								onClose();
							}}
							className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
								chronoFreezeUsed ?
									'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 opacity-80 cursor-not-allowed'
								:	'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-emerald-400/50'
							}`}>
							<Clock className='w-4 h-4' />
							<span>
								{chronoFreezeUsed ?
									`✓ +${CHRONO_FREEZE_SECONDS}s Added!`
								:	`Activate Chrono Freeze (+${CHRONO_FREEZE_SECONDS}s) ⏱️`}
							</span>
						</button>
					</div>
				)}

				{/* Primary Action Button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Dismiss lifeline dialog and return to puzzle'
					className='w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm sm:text-base shadow-lg transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:outline-none mt-2'>
					Back to Challenge 🚀
				</button>
			</div>
		</div>
	);
});

export default HintModal;
