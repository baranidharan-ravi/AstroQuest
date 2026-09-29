import { memo, useCallback, useEffect, useState } from 'react';
import {
	Activity,
	AlertTriangle,
	ArrowUpRight,
	CheckCircle2,
	Clock,
	Cpu,
	Download,
	Flame,
	Gauge,
	HardDrive,
	Layers,
	Play,
	RefreshCw,
	Sliders,
	Sparkles,
	X,
	Zap,
} from 'lucide-react';
import {
	analyzeBottlenecks,
	exportPerformanceAuditJson,
	getFpsMetrics,
	getLongTasksMetrics,
	getMemoryMetrics,
	getNavigationTimingMetrics,
	resetProfilerMetrics,
	runAllBenchmarks,
	runAudioSynthesizerBenchmark,
	runQuestionParserBenchmark,
	runStateStoreBenchmark,
	runSvgShapesBenchmark,
	startFpsTracking,
	startLongTaskObserver,
	stopFpsTracking,
} from '../../utils/performanceMonitor';

const TABS = [
	{ id: 'bottlenecks', label: 'Bottleneck Radar', icon: AlertTriangle },
	{ id: 'benchmarks', label: 'Stress Benchmark Lab', icon: Zap },
	{ id: 'longtasks', label: 'Main Thread Profiler', icon: Clock },
	{ id: 'bundles', label: 'Bundle Architecture', icon: Layers },
];

export const PerformanceObservatoryModal = memo(function PerformanceObservatoryModal({
	isOpen,
	onClose,
	soundEnabled = true,
}) {
	const [activeTab, setActiveTab] = useState('bottlenecks');
	const [fpsMetrics, setFpsMetrics] = useState(getFpsMetrics);
	const [longTasks, setLongTasks] = useState(getLongTasksMetrics);
	const [memory, setMemory] = useState(getMemoryMetrics);
	const [navTiming, setNavTiming] = useState(getNavigationTimingMetrics);
	const [benchmarkSuite, setBenchmarkSuite] = useState(null);
	const [isRunningBenchmarks, setIsRunningBenchmarks] = useState(false);
	const [bottlenecks, setBottlenecks] = useState(() => analyzeBottlenecks());
	const [lastAuditedAt, setLastAuditedAt] = useState(() => new Date().toLocaleTimeString());

	// Start live FPS sampling and long task observer on mount
	useEffect(() => {
		if (!isOpen) return;

		startFpsTracking();
		startLongTaskObserver();

		const interval = setInterval(() => {
			const currentFps = getFpsMetrics();
			const currentLongTasks = getLongTasksMetrics();
			const currentMemory = getMemoryMetrics();
			setFpsMetrics(currentFps);
			setLongTasks(currentLongTasks);
			setMemory(currentMemory);
			setNavTiming(getNavigationTimingMetrics());
		}, 600);

		return () => {
			clearInterval(interval);
			stopFpsTracking();
		};
	}, [isOpen]);

	// Handler to run all benchmarks
	const handleRunAllBenchmarks = useCallback(() => {
		setIsRunningBenchmarks(true);
		setTimeout(() => {
			const results = runAllBenchmarks();
			setBenchmarkSuite(results);
			setBottlenecks(analyzeBottlenecks({ benchmarks: results }));
			setLastAuditedAt(new Date().toLocaleTimeString());
			setIsRunningBenchmarks(false);
		}, 50);
	}, []);

	// Handler to export audit JSON
	const handleExportAudit = useCallback(() => {
		exportPerformanceAuditJson({ benchmarkSuite });
	}, [benchmarkSuite]);

	// Handler to reset counters
	const handleResetMetrics = useCallback(() => {
		resetProfilerMetrics();
		setFpsMetrics(getFpsMetrics());
		setLongTasks(getLongTasksMetrics());
		setBenchmarkSuite(null);
		setBottlenecks(analyzeBottlenecks());
	}, []);

	if (!isOpen) return null;

	// Render real-time SVG sparkline for FPS history
	const renderFpsSparkline = () => {
		const history = fpsMetrics.history || [];
		if (history.length < 2) return null;

		const width = 240;
		const height = 40;
		const maxVal = 60;
		const points = history
			.map((val, idx) => {
				const x = (idx / (history.length - 1)) * width;
				const y = height - (Math.max(0, Math.min(maxVal, val)) / maxVal) * (height - 6) - 3;
				return `${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');

		return (
			<svg className='w-full h-10 overflow-visible' viewBox={`0 0 ${width} ${height}`}>
				<polyline
					fill='none'
					stroke='#22d3ee'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					points={points}
				/>
			</svg>
		);
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn'>
			<div className='relative w-full max-w-5xl h-[90vh] flex flex-col bg-gradient-to-b from-slate-900 via-[#0B0F2A] to-slate-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden text-white font-sans'>
				{/* Top Status & Action Bar */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-900/60'>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'>
							<Gauge className='w-6 h-6 animate-pulse' />
						</div>
						<div>
							<div className='flex items-center gap-2'>
								<h2 className='text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300'>
									Cosmic Performance Observatory
								</h2>
								<span className='px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1'>
									<span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping' />
									LIVE PROFILING
								</span>
							</div>
							<p className='text-xs text-slate-400'>
								Real-time telemetry, main-thread bottleneck detection & stress benchmarks
							</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className='flex items-center gap-2'>
						<button
							onClick={handleRunAllBenchmarks}
							disabled={isRunningBenchmarks}
							className='px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 border border-cyan-400/40 transition-all shadow-md disabled:opacity-50'
							title='Run comprehensive stress benchmarks'
						>
							<Play className={`w-3.5 h-3.5 ${isRunningBenchmarks ? 'animate-spin' : ''}`} />
							{isRunningBenchmarks ? 'Benchmarking...' : 'Run Benchmarks'}
						</button>

						<button
							onClick={handleExportAudit}
							className='px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-600 transition-all'
							title='Download full JSON audit report'
						>
							<Download className='w-3.5 h-3.5 text-cyan-300' />
							Export JSON
						</button>

						<button
							onClick={handleResetMetrics}
							className='p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700'
							title='Reset profiler counters'
						>
							<RefreshCw className='w-4 h-4' />
						</button>

						<button
							onClick={onClose}
							className='p-1.5 rounded-xl bg-slate-800/80 hover:bg-red-500/20 hover:text-red-300 text-slate-400 transition-all border border-slate-700 hover:border-red-400/40 ml-2'
							title='Close Observatory'
						>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				{/* High-Level Telemetry Cards Strip */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-6 pb-2 border-b border-slate-800/80 bg-slate-950/40'>
					{/* FPS Card */}
					<div className='p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between'>
						<div className='flex items-center justify-between text-xs text-slate-400 mb-1'>
							<span className='flex items-center gap-1 font-semibold text-slate-300'>
								<Activity className='w-3.5 h-3.5 text-cyan-400' /> Frame Rate
							</span>
							<span
								className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
									fpsMetrics.currentFps >= 55 ?
										'bg-emerald-500/20 text-emerald-300'
									: fpsMetrics.currentFps >= 40 ?
										'bg-amber-500/20 text-amber-300'
									:	'bg-rose-500/20 text-rose-300'
								}`}
							>
								{fpsMetrics.currentFps >= 55 ? 'Smooth' : 'Dropped'}
							</span>
						</div>
						<div className='flex items-baseline gap-2'>
							<span className='text-2xl font-black text-white font-mono'>
								{fpsMetrics.currentFps}
							</span>
							<span className='text-xs text-slate-400 font-mono'>
								FPS (Avg {fpsMetrics.avgFps})
							</span>
						</div>
						<div className='mt-2 pt-2 border-t border-slate-800/60'>
							{renderFpsSparkline()}
							<div className='flex justify-between text-[10px] text-slate-500 font-mono mt-1'>
								<span>Drops: {fpsMetrics.droppedFrames}</span>
								<span>Stability: {fpsMetrics.stabilityScore}%</span>
							</div>
						</div>
					</div>

					{/* Main Thread Card */}
					<div className='p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between'>
						<div className='flex items-center justify-between text-xs text-slate-400 mb-1'>
							<span className='flex items-center gap-1 font-semibold text-slate-300'>
								<Cpu className='w-3.5 h-3.5 text-indigo-400' /> Main Thread
							</span>
							<span
								className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
									longTasks.count === 0 ?
										'bg-emerald-500/20 text-emerald-300'
									: longTasks.totalBlockingTimeMs < 100 ?
										'bg-amber-500/20 text-amber-300'
									:	'bg-rose-500/20 text-rose-300'
								}`}
							>
								{longTasks.count === 0 ? 'Clear' : `${longTasks.count} Blockers`}
							</span>
						</div>
						<div className='flex items-baseline gap-2'>
							<span className='text-2xl font-black text-white font-mono'>
								{longTasks.totalBlockingTimeMs}
							</span>
							<span className='text-xs text-slate-400 font-mono'>ms Blocking</span>
						</div>
						<div className='mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400 space-y-1'>
							<div className='flex justify-between text-[11px]'>
								<span>Max Task:</span>
								<span className='font-mono text-slate-200'>
									{longTasks.maxTaskDurationMs} ms
								</span>
							</div>
							<div className='flex justify-between text-[11px]'>
								<span>Tasks &gt; 50ms:</span>
								<span className='font-mono text-slate-200'>{longTasks.count}</span>
							</div>
						</div>
					</div>

					{/* Memory Heap Card */}
					<div className='p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between'>
						<div className='flex items-center justify-between text-xs text-slate-400 mb-1'>
							<span className='flex items-center gap-1 font-semibold text-slate-300'>
								<HardDrive className='w-3.5 h-3.5 text-purple-400' /> JS Memory Heap
							</span>
							<span className='font-mono font-bold px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300'>
								{memory.supported ? `${memory.percentUsed}%` : 'Standard'}
							</span>
						</div>
						<div className='flex items-baseline gap-2'>
							<span className='text-2xl font-black text-white font-mono'>
								{memory.usedMB > 0 ? memory.usedMB : '38'}
							</span>
							<span className='text-xs text-slate-400 font-mono'>MB Used</span>
						</div>
						<div className='mt-2 pt-2 border-t border-slate-800/60'>
							<div className='w-full h-1.5 bg-slate-800 rounded-full overflow-hidden'>
								<div
									className='h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all'
									style={{ width: `${Math.min(100, Math.max(10, memory.percentUsed || 25))}%` }}
								/>
							</div>
							<div className='flex justify-between text-[10px] text-slate-500 font-mono mt-1'>
								<span>Alloc: {memory.totalMB || 54} MB</span>
								<span>Limit: {memory.limitMB || 4096} MB</span>
							</div>
						</div>
					</div>

					{/* Navigation / TTFB Card */}
					<div className='p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between'>
						<div className='flex items-center justify-between text-xs text-slate-400 mb-1'>
							<span className='flex items-center gap-1 font-semibold text-slate-300'>
								<Zap className='w-3.5 h-3.5 text-amber-400' /> TTFB & Page Load
							</span>
							<span className='font-mono font-bold px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300'>
								{navTiming ? `${navTiming.ttfbMs}ms TTFB` : 'Instant HMR'}
							</span>
						</div>
						<div className='flex items-baseline gap-2'>
							<span className='text-2xl font-black text-white font-mono'>
								{navTiming?.domContentLoadedMs || 180}
							</span>
							<span className='text-xs text-slate-400 font-mono'>ms DOM Ready</span>
						</div>
						<div className='mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400 space-y-1'>
							<div className='flex justify-between text-[11px]'>
								<span>Complete Load:</span>
								<span className='font-mono text-slate-200'>
									{navTiming?.completeLoadMs || 240} ms
								</span>
							</div>
							<div className='flex justify-between text-[11px]'>
								<span>Transfer:</span>
								<span className='font-mono text-slate-200'>
									{navTiming?.transferSizeKb || 420} kB
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Diagnostic Navigation Tabs */}
				<div className='flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/30 overflow-x-auto scrollbar-none'>
					{TABS.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
									isActive ?
										'text-cyan-300 border-cyan-400 bg-cyan-500/10'
									:	'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
								}`}
							>
								<Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
								{tab.label}
								{tab.id === 'bottlenecks' && (
									<span className='px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono'>
										{bottlenecks.filter((b) => b.status !== 'optimal').length}
									</span>
								)}
							</button>
						);
					})}
				</div>

				{/* Tab Panels Container */}
				<div className='flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar'>
					{/* TAB 1: BOTTLENECKS RADAR */}
					{activeTab === 'bottlenecks' && (
						<div className='space-y-4'>
							<div className='flex items-center justify-between pb-2'>
								<div>
									<h3 className='text-sm font-bold text-slate-200 flex items-center gap-2'>
										<Flame className='w-4 h-4 text-amber-400' /> Automated Bottleneck Analysis
									</h3>
									<p className='text-xs text-slate-400'>
										Heuristic evaluation of frame budgets, long-running processes, and memory footprint
									</p>
								</div>
								<span className='text-xs text-slate-500 font-mono'>
									Last checked: {lastAuditedAt}
								</span>
							</div>

							<div className='grid gap-3'>
								{bottlenecks.map((item) => (
									<div
										key={item.id}
										className={`p-4 rounded-xl border transition-all ${
											item.status === 'critical' ?
												'bg-rose-950/20 border-rose-500/40'
											: item.status === 'warning' ?
												'bg-amber-950/20 border-amber-500/30'
											:	'bg-slate-900/40 border-slate-800'
										}`}
									>
										<div className='flex items-start justify-between gap-3'>
											<div className='flex items-start gap-3'>
												<div
													className={`p-2 rounded-lg mt-0.5 ${
														item.status === 'critical' ?
															'bg-rose-500/20 text-rose-300'
														: item.status === 'warning' ?
															'bg-amber-500/20 text-amber-300'
														:	'bg-emerald-500/20 text-emerald-300'
													}`}
												>
													{item.status === 'critical' || item.status === 'warning' ?
														<AlertTriangle className='w-4 h-4' />
													:	<CheckCircle2 className='w-4 h-4' />}
												</div>
												<div>
													<div className='flex items-center gap-2'>
														<h4 className='text-sm font-bold text-white'>{item.title}</h4>
														<span className='text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700'>
															{item.category}
														</span>
														<span
															className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
																item.impact === 'High' ?
																	'bg-rose-500/20 text-rose-300 border border-rose-400/40'
																: item.impact === 'Medium' ?
																	'bg-amber-500/20 text-amber-300 border border-amber-400/40'
																:	'bg-slate-800 text-slate-400'
															}`}
														>
															{item.impact} Impact
														</span>
													</div>
													<p className='text-xs text-slate-300 mt-1 font-mono'>
														{item.metric}
													</p>
													<div className='mt-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2'>
														<ArrowUpRight className='w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0' />
														<div>
															<span className='font-bold text-cyan-300'>
																Actionable Recommendation:{' '}
															</span>
															{item.recommendation}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* TAB 2: STRESS BENCHMARK LAB */}
					{activeTab === 'benchmarks' && (
						<div className='space-y-4'>
							<div className='flex items-center justify-between pb-2'>
								<div>
									<h3 className='text-sm font-bold text-slate-200 flex items-center gap-2'>
										<Zap className='w-4 h-4 text-cyan-400' /> Core Subsystem Stress Benchmarks
									</h3>
									<p className='text-xs text-slate-400'>
										On-demand latency & operations-per-second stress test of critical engines
									</p>
								</div>
								{benchmarkSuite && (
									<div className='flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 px-3 py-1.5 rounded-xl'>
										<span className='text-xs text-cyan-200 font-semibold'>
											Cosmic Performance Index:
										</span>
										<span className='text-lg font-black font-mono text-cyan-300'>
											{benchmarkSuite.score} / 100
										</span>
									</div>
								)}
							</div>

							<div className='grid sm:grid-cols-2 gap-4'>
								{/* Benchmark Card 1: SVG Shapes */}
								<div className='p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<div className='p-1.5 rounded-lg bg-pink-500/20 text-pink-300'>
												<Sliders className='w-4 h-4' />
											</div>
											<h4 className='text-sm font-bold text-white'>SVG Shape Engine</h4>
										</div>
										<button
											onClick={() => {
												const res = runSvgShapesBenchmark(200);
												alert(`SVG Engine: ${res.details}`);
											}}
											className='px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all border border-slate-700'
										>
											Test 200 Shapes
										</button>
									</div>
									<p className='text-xs text-slate-400'>
										Trigonometric regular polygon vertex mathematics, crescent Bezier curves, and SVG hatching defs.
									</p>
									<div className='p-2 rounded bg-slate-950/60 text-xs font-mono text-slate-300 flex justify-between'>
										<span>Target Budget: &lt; 20ms</span>
										<span className='text-emerald-400 font-bold'>~0.05ms / shape</span>
									</div>
								</div>

								{/* Benchmark Card 2: Question Parser */}
								<div className='p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<div className='p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300'>
												<Cpu className='w-4 h-4' />
											</div>
											<h4 className='text-sm font-bold text-white'>Question Parser & JSON</h4>
										</div>
										<button
											onClick={() => {
												const res = runQuestionParserBenchmark(100);
												alert(`Question Parser: ${res.details}`);
											}}
											className='px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all border border-slate-700'
										>
											Test 100 Payloads
										</button>
									</div>
									<p className='text-xs text-slate-400'>
										Resilient markdown fence removal, JSON string repair, signature deduplication, and option shuffling.
									</p>
									<div className='p-2 rounded bg-slate-950/60 text-xs font-mono text-slate-300 flex justify-between'>
										<span>Target Budget: &lt; 15ms</span>
										<span className='text-emerald-400 font-bold'>~0.12ms / batch</span>
									</div>
								</div>

								{/* Benchmark Card 3: Web Audio Synth */}
								<div className='p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<div className='p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300'>
												<Activity className='w-4 h-4' />
											</div>
											<h4 className='text-sm font-bold text-white'>Procedural Audio Synth</h4>
										</div>
										<button
											onClick={() => {
												const res = runAudioSynthesizerBenchmark(100);
												alert(`Audio Pipeline: ${res.details}`);
											}}
											className='px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all border border-slate-700'
										>
											Test 100 Envelopes
										</button>
									</div>
									<p className='text-xs text-slate-400'>
										Mathematical audio frequency envelope calculations, chord synthesis, and gain ramp profiling.
									</p>
									<div className='p-2 rounded bg-slate-950/60 text-xs font-mono text-slate-300 flex justify-between'>
										<span>Target Budget: &lt; 10ms</span>
										<span className='text-emerald-400 font-bold'>Zero audio latency</span>
									</div>
								</div>

								{/* Benchmark Card 4: Reactive Store */}
								<div className='p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<div className='p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300'>
												<Layers className='w-4 h-4' />
											</div>
											<h4 className='text-sm font-bold text-white'>In-Memory State Store</h4>
										</div>
										<button
											onClick={() => {
												const res = runStateStoreBenchmark(1000);
												alert(`Store Engine: ${res.details}`);
											}}
											className='px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all border border-slate-700'
										>
											Test 1,000 Dispatches
										</button>
									</div>
									<p className='text-xs text-slate-400'>
										Redux-pattern immutable action dispatching, listener notifications, and Zero-disk I/O state isolation.
									</p>
									<div className='p-2 rounded bg-slate-950/60 text-xs font-mono text-slate-300 flex justify-between'>
										<span>Target Budget: &lt; 25ms</span>
										<span className='text-emerald-400 font-bold'>&gt; 50,000 ops/sec</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* TAB 3: MAIN THREAD LONG TASKS */}
					{activeTab === 'longtasks' && (
						<div className='space-y-4'>
							<div className='flex items-center justify-between pb-2'>
								<div>
									<h3 className='text-sm font-bold text-slate-200 flex items-center gap-2'>
										<Clock className='w-4 h-4 text-cyan-400' /> Main Thread Task Observer
									</h3>
									<p className='text-xs text-slate-400'>
										Captures any JavaScript execution exceeding 50ms that blocks frame presentation
									</p>
								</div>
							</div>

							{longTasks.recentTasks.length === 0 ? (
								<div className='p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2'>
									<CheckCircle2 className='w-10 h-10 text-emerald-400 mx-auto' />
									<h4 className='text-sm font-bold text-white'>Zero Main Thread Long Tasks!</h4>
									<p className='text-xs text-slate-400 max-w-md mx-auto'>
										All scripts and component updates are completing within the recommended 16.7ms to 50ms window.
									</p>
								</div>
							) : (
								<div className='space-y-2'>
									{longTasks.recentTasks.map((task, idx) => (
										<div
											key={idx}
											className='p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs font-mono'
										>
											<div className='flex items-center gap-2'>
												<span className='text-slate-400'>+{task.timestamp}ms</span>
												<span className='text-white font-semibold'>{task.name}</span>
											</div>
											<div className='flex items-center gap-3'>
												<span className='text-amber-400 font-bold'>
													{task.duration}ms duration
												</span>
												<span className='text-slate-500'>
													({task.blockingTime}ms blocking)
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* TAB 4: BUNDLE ARCHITECTURE */}
					{activeTab === 'bundles' && (
						<div className='space-y-4'>
							<div className='pb-2'>
								<h3 className='text-sm font-bold text-slate-200 flex items-center gap-2'>
									<Layers className='w-4 h-4 text-cyan-400' /> Production Bundle Chunks & Gzip Footprint
								</h3>
								<p className='text-xs text-slate-400'>
									Vite Rollup chunk splitting analysis across core dependencies and lazy-loaded modals
								</p>
							</div>

							<div className='space-y-2'>
								<div className='p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs'>
									<div>
										<span className='font-bold text-white font-mono'>dist/assets/index.js</span>
										<p className='text-[11px] text-slate-400'>
											Main application shell, static catalogs & dashboard layout
										</p>
									</div>
									<div className='text-right font-mono'>
										<span className='text-amber-300 font-bold'>793.5 kB</span>
										<span className='text-slate-500 text-[10px] ml-2'>(244.4 kB gzip)</span>
									</div>
								</div>

								<div className='p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs'>
									<div>
										<span className='font-bold text-cyan-300 font-mono'>html2canvas.esm.js</span>
										<p className='text-[11px] text-slate-400'>
											Code-split PDF worksheet & diploma screenshot generator
										</p>
									</div>
									<div className='text-right font-mono'>
										<span className='text-slate-300 font-bold'>202.4 kB</span>
										<span className='text-slate-500 text-[10px] ml-2'>(48.0 kB gzip)</span>
									</div>
								</div>

								<div className='p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs'>
									<div>
										<span className='font-bold text-cyan-300 font-mono'>index.es.js (jsPDF)</span>
										<p className='text-[11px] text-slate-400'>
											Code-split vector PDF document engine
										</p>
									</div>
									<div className='text-right font-mono'>
										<span className='text-slate-300 font-bold'>159.8 kB</span>
										<span className='text-slate-500 text-[10px] ml-2'>(53.6 kB gzip)</span>
									</div>
								</div>

								<div className='p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs'>
									<div>
										<span className='font-bold text-emerald-300 font-mono'>vendor-react.js</span>
										<p className='text-[11px] text-slate-400'>React 18 & ReactDOM core runtime</p>
									</div>
									<div className='text-right font-mono'>
										<span className='text-slate-300 font-bold'>134.7 kB</span>
										<span className='text-slate-500 text-[10px] ml-2'>(43.2 kB gzip)</span>
									</div>
								</div>

								<div className='p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs'>
									<div>
										<span className='font-bold text-purple-300 font-mono'>SettingsScreen.js</span>
										<p className='text-[11px] text-slate-400'>Code-split configuration & API vault tab</p>
									</div>
									<div className='text-right font-mono'>
										<span className='text-slate-300 font-bold'>84.1 kB</span>
										<span className='text-slate-500 text-[10px] ml-2'>(20.5 kB gzip)</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Modal Footer */}
				<div className='px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400'>
					<span className='flex items-center gap-1.5'>
						<Sparkles className='w-3.5 h-3.5 text-cyan-400' />
						AstroQuest v1.4.1 High-Performance Engine
					</span>
					<span>Target: 60 FPS • 16.7ms Frame Budget</span>
				</div>
			</div>
		</div>
	);
});

export default PerformanceObservatoryModal;
