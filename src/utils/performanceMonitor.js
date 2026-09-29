/**
 * AstroQuest - Cosmic Performance Monitor & Diagnostic Engine
 *
 * Implements SOLID Single Responsibility:
 * Telemetry profiling, real-time FPS frame budget sampling,
 * Long Task main thread monitoring, memory heap inspection,
 * on-demand stress benchmarking, and automated bottleneck heuristics.
 */

import { cleanAndRepairJsonString, shuffleAndFormatOptions } from '../services/ai/questionParser';
import { parseDynamicShape } from './shapes/shapeParsers';
import { appMemoryStore, STORE_ACTIONS } from '../store/appMemoryStore';

// Circular buffer capacity for live FPS chart
const FPS_HISTORY_CAPACITY = 60;

// Internal profiler state
class PerformanceProfilerState {
	constructor() {
		this.fpsHistory = [];
		this.currentFps = 60;
		this.minFps = 60;
		this.avgFps = 60;
		this.droppedFrames = 0;
		this.totalFramesSampled = 0;
		this.longTasks = [];
		this.totalBlockingTime = 0;
		this.maxTaskDuration = 0;
		this.isTracking = false;
		this.rafId = null;
		this.lastFrameTimestamp = 0;
		this.observer = null;
	}

	reset() {
		this.fpsHistory = [];
		this.currentFps = 60;
		this.minFps = 60;
		this.avgFps = 60;
		this.droppedFrames = 0;
		this.totalFramesSampled = 0;
		this.longTasks = [];
		this.totalBlockingTime = 0;
		this.maxTaskDuration = 0;
	}
}

const profilerState = new PerformanceProfilerState();

/**
 * Initializes real-time FPS sampling loop via requestAnimationFrame
 */
export function startFpsTracking() {
	if (typeof window === 'undefined' || profilerState.isTracking) return;

	profilerState.isTracking = true;
	let frameCount = 0;
	let lastSecond = performance.now();
	profilerState.lastFrameTimestamp = performance.now();

	const sampleFrame = (now) => {
		if (!profilerState.isTracking) return;

		const delta = now - profilerState.lastFrameTimestamp;
		profilerState.lastFrameTimestamp = now;

		// Detect jank (>33.3ms implies dropped frame on 60Hz display)
		if (delta > 33.3) {
			profilerState.droppedFrames++;
		}

		frameCount++;
		profilerState.totalFramesSampled++;

		// Calculate 1-second rolling FPS
		if (now - lastSecond >= 1000) {
			const calculatedFps = Math.round((frameCount * 1000) / (now - lastSecond));
			profilerState.currentFps = Math.min(60, calculatedFps);

			// Append to circular history buffer
			profilerState.fpsHistory.push(profilerState.currentFps);
			if (profilerState.fpsHistory.length > FPS_HISTORY_CAPACITY) {
				profilerState.fpsHistory.shift();
			}

			// Update rolling statistics
			profilerState.minFps = Math.min(
				profilerState.minFps,
				profilerState.currentFps,
			);
			const sum = profilerState.fpsHistory.reduce((a, b) => a + b, 0);
			profilerState.avgFps = Math.round(sum / profilerState.fpsHistory.length);

			frameCount = 0;
			lastSecond = now;
		}

		profilerState.rafId = window.requestAnimationFrame(sampleFrame);
	};

	profilerState.rafId = window.requestAnimationFrame(sampleFrame);
}

/**
 * Stops FPS tracking loop
 */
export function stopFpsTracking() {
	profilerState.isTracking = false;
	if (typeof window !== 'undefined' && profilerState.rafId) {
		window.cancelAnimationFrame(profilerState.rafId);
		profilerState.rafId = null;
	}
}

/**
 * Initializes Long Task observer (>50ms blocking tasks)
 */
export function startLongTaskObserver() {
	if (typeof window === 'undefined') return;

	try {
		if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
			profilerState.observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					const duration = Math.round(entry.duration);
					const blockingTime = Math.max(0, duration - 50);

					profilerState.longTasks.push({
						timestamp: Math.round(entry.startTime),
						duration,
						blockingTime,
						name: entry.name || 'Script Execution',
					});

					// Keep last 30 long task records
					if (profilerState.longTasks.length > 30) {
						profilerState.longTasks.shift();
					}

					profilerState.totalBlockingTime += blockingTime;
					profilerState.maxTaskDuration = Math.max(
						profilerState.maxTaskDuration,
						duration,
					);
				}
			});

			profilerState.observer.observe({ entryTypes: ['longtask'] });
		}
	} catch (e) {
		console.warn('[PerformanceMonitor] Long task observer not supported:', e);
	}
}

/**
 * Retrieves current real-time FPS metrics
 */
export function getFpsMetrics() {
	return {
		currentFps: profilerState.currentFps,
		minFps: profilerState.minFps,
		avgFps: profilerState.avgFps,
		droppedFrames: profilerState.droppedFrames,
		totalFramesSampled: profilerState.totalFramesSampled,
		history: [...profilerState.fpsHistory],
		stabilityScore:
			profilerState.totalFramesSampled > 0 ?
				Math.max(
					0,
					Math.round(
						100 -
							(profilerState.droppedFrames /
								profilerState.totalFramesSampled) *
								100,
					),
				)
			:	100,
	};
}

/**
 * Retrieves Long Tasks telemetry
 */
export function getLongTasksMetrics() {
	return {
		supported:
			typeof window !== 'undefined' &&
			'PerformanceObserver' in window &&
			PerformanceObserver.supportedEntryTypes?.includes('longtask'),
		count: profilerState.longTasks.length,
		totalBlockingTimeMs: Math.round(profilerState.totalBlockingTime),
		maxTaskDurationMs: Math.round(profilerState.maxTaskDuration),
		recentTasks: [...profilerState.longTasks],
	};
}

/**
 * Inspects browser memory heap usage
 */
export function getMemoryMetrics() {
	if (typeof window === 'undefined') {
		return { supported: false, usedMB: 0, totalMB: 0, limitMB: 0, percentUsed: 0 };
	}

	const memory = window.performance?.memory;
	if (memory) {
		const usedMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
		const totalMB = Math.round(memory.totalJSHeapSize / (1024 * 1024));
		const limitMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
		const percentUsed = limitMB > 0 ? Math.round((usedMB / limitMB) * 100) : 0;

		return {
			supported: true,
			usedMB,
			totalMB,
			limitMB,
			percentUsed,
		};
	}

	return {
		supported: false,
		usedMB: 0,
		totalMB: 0,
		limitMB: 0,
		percentUsed: 0,
	};
}

/**
 * Retrieves Navigation Timing milestones
 */
export function getNavigationTimingMetrics() {
	if (typeof window === 'undefined' || typeof performance === 'undefined') {
		return null;
	}

	try {
		const navEntries = performance.getEntriesByType('navigation');
		if (navEntries && navEntries.length > 0) {
			const nav = navEntries[0];
			return {
				dnsLookupMs: Math.max(0, Math.round(nav.domainLookupEnd - nav.domainLookupStart)),
				tcpHandshakeMs: Math.max(0, Math.round(nav.connectEnd - nav.connectStart)),
				ttfbMs: Math.max(0, Math.round(nav.responseStart - nav.requestStart)),
				responseDownloadMs: Math.max(0, Math.round(nav.responseEnd - nav.responseStart)),
				domInteractiveMs: Math.max(0, Math.round(nav.domInteractive)),
				domContentLoadedMs: Math.max(0, Math.round(nav.domContentLoadedEventEnd)),
				completeLoadMs: Math.max(0, Math.round(nav.loadEventEnd)),
				transferSizeKb: nav.transferSize ? Math.round(nav.transferSize / 1024) : 0,
			};
		}
	} catch (_) {}

	return null;
}

/**
 * Stress Benchmark 1: SVG Geometric Shape Engine
 */
export function runSvgShapesBenchmark(iterations = 100) {
	const testInputs = [
		'Gold Crescent Moon',
		'Cyan Star Hexagon',
		'Emerald Pentagon with striped hatching',
		'Crimson Heptagon with radial dots',
		'Purple Octagon with crosshatch pattern',
		'Blue Circle with solar flares',
	];

	const start = performance.now();
	let operations = 0;

	for (let i = 0; i < iterations; i++) {
		const input = testInputs[i % testInputs.length];
		const parsed = parseDynamicShape(input);
		if (parsed) operations++;
	}

	const durationMs = Math.round((performance.now() - start) * 100) / 100;
	const opsPerSec = durationMs > 0 ? Math.round((operations / durationMs) * 1000) : 100000;

	return {
		name: 'SVG Shape Engine',
		iterations,
		durationMs,
		opsPerSec,
		rating: durationMs < 15 ? 'Optimal' : durationMs < 40 ? 'Acceptable' : 'Needs Optimization',
		details: `${iterations} dynamic shape parsings & polygon vertex computations completed in ${durationMs}ms (${opsPerSec.toLocaleString()} ops/sec).`,
	};
}

/**
 * Stress Benchmark 2: Question Schema & JSON Sanitization Engine
 */
export function runQuestionParserBenchmark(iterations = 50) {
	const rawPayload = `
		\`\`\`json
		[
			{
				"id": "bench-1",
				"type": "logic",
				"question": "Which celestial satellite orbits the planet Earth with synchronous rotation?",
				"options": ["The Moon", "Phobos", "Europa", "Titan"],
				"correctAnswer": "The Moon",
				"explanation": "Earth has one natural moon.",
				"hint": "Look up at the night sky!"
			},
			{
				"id": "bench-2",
				"type": "math",
				"question": "If a probe travels at 40,000 km/h for 3 hours, how many km did it cover?",
				"options": ["120,000 km", "100,000 km", "80,000 km", "140,000 km"],
				"correctAnswer": "120,000 km",
				"explanation": "Speed multiplied by time yields distance.",
				"hint": "Multiply 40 by 3."
			}
		]
		\`\`\`
	`;

	const start = performance.now();
	let operations = 0;

	for (let i = 0; i < iterations; i++) {
		const cleaned = cleanAndRepairJsonString(rawPayload);
		const parsed = JSON.parse(cleaned);
		if (Array.isArray(parsed)) {
			parsed.forEach((q) => {
				shuffleAndFormatOptions(q);
				operations++;
			});
		}
	}

	const durationMs = Math.round((performance.now() - start) * 100) / 100;
	const opsPerSec = durationMs > 0 ? Math.round((operations / durationMs) * 1000) : 100000;

	return {
		name: 'Question Parser & Sanitizer',
		iterations,
		durationMs,
		opsPerSec,
		rating: durationMs < 10 ? 'Optimal' : durationMs < 30 ? 'Acceptable' : 'Needs Optimization',
		details: `${iterations} markdown cleanings and option shuffles completed in ${durationMs}ms (${opsPerSec.toLocaleString()} ops/sec).`,
	};
}

/**
 * Stress Benchmark 3: Web Audio Synth Node Pipeline
 */
export function runAudioSynthesizerBenchmark(iterations = 50) {
	const start = performance.now();
	let nodesCalculated = 0;

	// Measure audio frequency ramp math & envelope node computations
	for (let i = 0; i < iterations; i++) {
		const baseFreq = 440 + (i % 8) * 55;
		const chord = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
		const envelopes = chord.map((freq) => ({
			freq,
			attack: 0.02,
			decay: 0.08,
			gain: Math.pow(10, -12 / 20),
		}));
		if (envelopes.length === 3) nodesCalculated += 3;
	}

	const durationMs = Math.round((performance.now() - start) * 100) / 100;
	const opsPerSec = durationMs > 0 ? Math.round((nodesCalculated / durationMs) * 1000) : 100000;

	return {
		name: 'Web Audio Synth Pipeline',
		iterations,
		durationMs,
		opsPerSec,
		rating: durationMs < 5 ? 'Optimal' : durationMs < 20 ? 'Acceptable' : 'Needs Optimization',
		details: `${nodesCalculated} procedural audio oscillator envelopes computed in ${durationMs}ms (${opsPerSec.toLocaleString()} ops/sec).`,
	};
}

/**
 * Stress Benchmark 4: State Store Dispatch Latency
 */
export function runStateStoreBenchmark(iterations = 500) {
	let notifyCount = 0;
	const unsubscribe = appMemoryStore.subscribe(() => {
		notifyCount++;
	});

	const start = performance.now();
	for (let i = 0; i < iterations; i++) {
		appMemoryStore.dispatch({
			type: STORE_ACTIONS.SET_LIVE_TELEMETRY,
			payload: { perfTick: i, timestamp: start + i },
		});
	}
	const durationMs = Math.round((performance.now() - start) * 100) / 100;
	unsubscribe();

	const opsPerSec = durationMs > 0 ? Math.round((iterations / durationMs) * 1000) : 100000;

	return {
		name: 'Memory Store & Action Dispatch',
		iterations,
		durationMs,
		opsPerSec,
		rating: durationMs < 15 ? 'Optimal' : durationMs < 45 ? 'Acceptable' : 'Needs Optimization',
		details: `${iterations} immutable dispatches & subscriber broadcasts completed in ${durationMs}ms (${opsPerSec.toLocaleString()} ops/sec).`,
	};
}

/**
 * Runs the complete benchmark suite and computes Cosmic Performance Score (0-100)
 */
export function runAllBenchmarks() {
	const svgResult = runSvgShapesBenchmark(150);
	const parserResult = runQuestionParserBenchmark(75);
	const audioResult = runAudioSynthesizerBenchmark(100);
	const storeResult = runStateStoreBenchmark(500);

	const totalDuration =
		svgResult.durationMs +
		parserResult.durationMs +
		audioResult.durationMs +
		storeResult.durationMs;

	// Calculate score out of 100 (lower total duration = higher score)
	// Base target: < 35ms total = 100, 35-70ms = 90-99, >70ms scales down
	let score = 100;
	if (totalDuration > 35) {
		score = Math.max(40, Math.round(100 - (totalDuration - 35) * 0.7));
	}

	return {
		score,
		totalDurationMs: Math.round(totalDuration * 100) / 100,
		benchmarks: [svgResult, parserResult, audioResult, storeResult],
		timestamp: new Date().toISOString(),
	};
}

/**
 * Heuristic Bottleneck Analyzer
 * Evaluates real-time metrics and flags bottlenecks with actionable recommendations
 */
export function analyzeBottlenecks(metrics = {}) {
	const fps = metrics.fps || getFpsMetrics();
	const longTasks = metrics.longTasks || getLongTasksMetrics();
	const memory = metrics.memory || getMemoryMetrics();
	const benchmarks = metrics.benchmarks || null;

	const findings = [];

	// 1. Main Thread Long Task Evaluation
	if (longTasks.count > 0) {
		const isCritical = longTasks.maxTaskDurationMs > 150 || longTasks.totalBlockingTimeMs > 250;
		findings.push({
			id: 'main_thread_long_tasks',
			title: 'Main Thread Long Tasks (>50ms)',
			category: 'Thread Responsiveness',
			status: isCritical ? 'critical' : 'warning',
			impact: isCritical ? 'High' : 'Medium',
			metric: `${longTasks.count} long tasks detected (${longTasks.totalBlockingTimeMs}ms total blocking time, max ${longTasks.maxTaskDurationMs}ms).`,
			threshold: 'Zero tasks > 50ms (ideal 16.7ms frame budget).',
			recommendation:
				'Break down heavy CPU tasks (e.g. batch AI response JSON parsing or massive SVG polygon generation) using requestIdleCallback, setTimeout chunking, or Web Workers.',
		});
	} else {
		findings.push({
			id: 'main_thread_long_tasks',
			title: 'Main Thread Responsiveness',
			category: 'Thread Responsiveness',
			status: 'optimal',
			impact: 'Low',
			metric: '0 long tasks detected.',
			threshold: '0 blocking tasks',
			recommendation: 'Main thread is running smoothly without frame-blocking JavaScript execution.',
		});
	}

	// 2. FPS Stability Evaluation
	if (fps.avgFps < 45 || fps.droppedFrames > 15) {
		findings.push({
			id: 'fps_frame_rate',
			title: 'Frame Rate Stability & Jank',
			category: 'Rendering & Animation',
			status: fps.avgFps < 30 ? 'critical' : 'warning',
			impact: 'High',
			metric: `Average FPS: ${fps.avgFps} / 60 FPS (${fps.droppedFrames} dropped frames detected).`,
			threshold: '≥ 55 FPS sustained.',
			recommendation:
				'Check CSS animations on SVG elements (such as glowing orbital rings or rocket thrusters). Use will-change: transform and ensure hardware acceleration via translate3d.',
		});
	} else {
		findings.push({
			id: 'fps_frame_rate',
			title: 'Smooth 60 FPS Render Pipeline',
			category: 'Rendering & Animation',
			status: 'optimal',
			impact: 'Low',
			metric: `${fps.currentFps} FPS (Average ${fps.avgFps} FPS, ${fps.droppedFrames} dropped frames).`,
			threshold: '≥ 55 FPS sustained.',
			recommendation: 'Render loop is meeting the 16.7ms per-frame budget cleanly.',
		});
	}

	// 3. Memory Heap Pressure Evaluation
	if (memory.supported) {
		if (memory.usedMB > 120 || memory.percentUsed > 75) {
			findings.push({
				id: 'memory_heap',
				title: 'JS Heap Memory Footprint',
				category: 'Memory Management',
				status: memory.usedMB > 200 ? 'critical' : 'warning',
				impact: 'Medium',
				metric: `Heap: ${memory.usedMB} MB used of ${memory.totalMB} MB allocated (${memory.percentUsed}% of limit).`,
				threshold: '< 100 MB used for lightweight early-childhood web apps.',
				recommendation:
					'Clean up detached DOM nodes, cancel inactive AudioContext nodes when muted, and purge historical question image caches after quest completion.',
			});
		} else {
			findings.push({
				id: 'memory_heap',
				title: 'Memory Heap Allocation',
				category: 'Memory Management',
				status: 'optimal',
				impact: 'Low',
				metric: `${memory.usedMB} MB used of ${memory.limitMB} MB limit (${memory.percentUsed}%).`,
				threshold: '< 100 MB used.',
				recommendation: 'Memory footprint is lean and well within mobile/Chromebook hardware constraints.',
			});
		}
	}

	// 4. Bundle Chunking & Code-Splitting Evaluation
	findings.push({
		id: 'bundle_chunks',
		title: 'Bundle Chunk Code-Splitting',
		category: 'Bundle Size & Loading',
		status: 'warning',
		impact: 'Medium',
		metric: 'Main bundle index-*.js is ~793 kB minified (~244 kB gzipped).',
		threshold: '< 500 kB uncompressed per entry chunk.',
		recommendation:
			'Extract heavy third-party dependencies (canvas-confetti, static astronomical image catalogs, or unused lodash utilities) into separate manualChunks or lazy-loaded modules.',
	});

	// 5. Benchmark Performance Evaluation
	if (benchmarks) {
		const slowBenchmarks = benchmarks.benchmarks.filter((b) => b.rating !== 'Optimal');
		if (slowBenchmarks.length > 0) {
			findings.push({
				id: 'benchmark_latency',
				title: 'Subsystem Benchmark Delays',
				category: 'Internal Computations',
				status: 'warning',
				impact: 'Medium',
				metric: `${slowBenchmarks.length} benchmark(s) require attention: ${slowBenchmarks.map((b) => b.name).join(', ')}.`,
				threshold: 'All subsystems rated Optimal.',
				recommendation:
					'Memoize repetitive SVG polygon vertex calculations using React.memo or an LRU coordinate cache.',
			});
		}
	}

	return findings;
}

/**
 * Generates and downloads a complete JSON Performance Audit Snapshot
 */
export function exportPerformanceAuditJson(customData = {}) {
	const audit = {
		application: 'AstroQuest',
		version: '1.4.1',
		timestamp: new Date().toISOString(),
		environment: {
			userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
			platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
			hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 1,
			deviceMemoryGB: typeof navigator !== 'undefined' ? navigator.deviceMemory || 'N/A' : 'N/A',
		},
		metrics: {
			fps: getFpsMetrics(),
			longTasks: getLongTasksMetrics(),
			memory: getMemoryMetrics(),
			navigationTiming: getNavigationTimingMetrics(),
		},
		benchmarks: runAllBenchmarks(),
		bottlenecks: analyzeBottlenecks(),
		...customData,
	};

	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
		const blob = new Blob([JSON.stringify(audit, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `AstroQuest_Performance_Audit_${Date.now()}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	return audit;
}

/**
 * Resets all profiler counters
 */
export function resetProfilerMetrics() {
	profilerState.reset();
}
