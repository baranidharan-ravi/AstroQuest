import { describe, expect, it } from 'vitest';
import {
	analyzeBottlenecks,
	getFpsMetrics,
	getLongTasksMetrics,
	getMemoryMetrics,
	runAllBenchmarks,
	runAudioSynthesizerBenchmark,
	runQuestionParserBenchmark,
	runStateStoreBenchmark,
	runSvgShapesBenchmark,
} from '../src/utils/performanceMonitor';

describe('Performance Monitor & Benchmark Engine Suite', () => {
	it('exports valid FPS and frame budget metrics structure', () => {
		const fps = getFpsMetrics();
		expect(fps).toBeDefined();
		expect(typeof fps.currentFps).toBe('number');
		expect(typeof fps.minFps).toBe('number');
		expect(typeof fps.avgFps).toBe('number');
		expect(Array.isArray(fps.history)).toBe(true);
		expect(typeof fps.stabilityScore).toBe('number');
	});

	it('exports Long Tasks telemetry metrics', () => {
		const longTasks = getLongTasksMetrics();
		expect(longTasks).toBeDefined();
		expect(typeof longTasks.count).toBe('number');
		expect(typeof longTasks.totalBlockingTimeMs).toBe('number');
		expect(typeof longTasks.maxTaskDurationMs).toBe('number');
		expect(Array.isArray(longTasks.recentTasks)).toBe(true);
	});

	it('safely queries memory heap metrics without throwing', () => {
		const memory = getMemoryMetrics();
		expect(memory).toBeDefined();
		expect(typeof memory.supported).toBe('boolean');
		expect(typeof memory.usedMB).toBe('number');
		expect(typeof memory.totalMB).toBe('number');
	});

	it('executes SVG Geometric Shape benchmark with valid ops/sec', () => {
		const res = runSvgShapesBenchmark(20);
		expect(res.name).toBe('SVG Shape Engine');
		expect(res.iterations).toBe(20);
		expect(res.durationMs).toBeGreaterThanOrEqual(0);
		expect(res.opsPerSec).toBeGreaterThan(0);
		expect(['Optimal', 'Acceptable', 'Needs Optimization']).toContain(res.rating);
	});

	it('executes Question Parser & Sanitizer benchmark with valid parsing', () => {
		const res = runQuestionParserBenchmark(15);
		expect(res.name).toBe('Question Parser & Sanitizer');
		expect(res.iterations).toBe(15);
		expect(res.durationMs).toBeGreaterThanOrEqual(0);
		expect(res.opsPerSec).toBeGreaterThan(0);
		expect(['Optimal', 'Acceptable', 'Needs Optimization']).toContain(res.rating);
	});

	it('executes Web Audio Synth pipeline benchmark', () => {
		const res = runAudioSynthesizerBenchmark(25);
		expect(res.name).toBe('Web Audio Synth Pipeline');
		expect(res.iterations).toBe(25);
		expect(res.durationMs).toBeGreaterThanOrEqual(0);
		expect(res.opsPerSec).toBeGreaterThan(0);
	});

	it('executes State Store benchmark and dispatches immutably', () => {
		const res = runStateStoreBenchmark(100);
		expect(res.name).toBe('Memory Store & Action Dispatch');
		expect(res.iterations).toBe(100);
		expect(res.durationMs).toBeGreaterThanOrEqual(0);
		expect(res.opsPerSec).toBeGreaterThan(0);
	});

	it('runs complete benchmark suite and generates an aggregate Cosmic Performance Score', () => {
		const suite = runAllBenchmarks();
		expect(suite.score).toBeGreaterThan(0);
		expect(suite.score).toBeLessThanOrEqual(100);
		expect(suite.benchmarks.length).toBe(4);
		expect(suite.totalDurationMs).toBeGreaterThanOrEqual(0);
	});

	it('analyzes bottlenecks and returns structured actionable findings', () => {
		const findings = analyzeBottlenecks();
		expect(Array.isArray(findings)).toBe(true);
		expect(findings.length).toBeGreaterThan(0);
		findings.forEach((f) => {
			expect(f.id).toBeDefined();
			expect(f.title).toBeDefined();
			expect(f.category).toBeDefined();
			expect(['optimal', 'warning', 'critical']).toContain(f.status);
			expect(['High', 'Medium', 'Low']).toContain(f.impact);
			expect(f.recommendation).toBeDefined();
		});
	});
});
