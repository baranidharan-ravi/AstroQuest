/**
 * On-demand celebration confetti loader with zero initial bundle overhead.
 */
export const triggerConfetti = async () => {
	try {
		const confettiModule = await import('canvas-confetti');
		const confetti = confettiModule.default || confettiModule;
		confetti({
			particleCount: 90,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#00D166', '#FFD166', '#00E5FF', '#FF5B84', '#B845ED'],
			shapes: ['star', 'circle'],
			scalar: 1.2,
		});
	} catch (err) {
		console.warn('Confetti error', err);
	}
};
