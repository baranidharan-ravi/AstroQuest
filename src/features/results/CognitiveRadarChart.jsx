import { memo } from 'react';
import { COGNITIVE_DOMAINS } from '../../utils/cognitiveAnalytics';

const CognitiveRadarChart = memo(function CognitiveRadarChart({
	scores = {},
	title = 'Cognitive Aptitude Radar',
	subtitle = '5-Domain STEM & Logic Analysis',
	className = '',
}) {
	const size = 320;
	const cx = size / 2;
	const cy = size / 2;
	const radius = 105;
	const totalSides = COGNITIVE_DOMAINS.length;

	// Calculate polygon coordinates for concentric rings
	const getPolygonPoints = (r) => {
		return COGNITIVE_DOMAINS.map((_, i) => {
			const angle = (2 * Math.PI * i) / totalSides - Math.PI / 2;
			const x = cx + r * Math.cos(angle);
			const y = cy + r * Math.sin(angle);
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		}).join(' ');
	};

	// Calculate coordinates for data points
	const dataPoints = COGNITIVE_DOMAINS.map((domain, i) => {
		const score = Math.max(15, Math.min(100, scores[domain.id] || 75));
		const currentRadius = (radius * score) / 100;
		const angle = (2 * Math.PI * i) / totalSides - Math.PI / 2;
		const x = cx + currentRadius * Math.cos(angle);
		const y = cy + currentRadius * Math.sin(angle);

		// Label position slightly outside outer ring
		const labelRadius = radius + 28;
		const lx = cx + labelRadius * Math.cos(angle);
		const ly = cy + labelRadius * Math.sin(angle);

		return {
			...domain,
			score,
			x,
			y,
			lx,
			ly,
		};
	});

	const dataPolygonString = dataPoints
		.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
		.join(' ');

	// Find the child's strongest domain
	const topDomain = [...dataPoints].sort((a, b) => b.score - a.score)[0];

	return (
		<div
			className={`bg-[#0A0D2A]/90 border-2 border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col justify-between items-center select-none ${className}`}>
			{/* Header */}
			<div className='w-full text-center mb-1'>
				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm sm:text-base'>📊</span>
					<h3 className='text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider'>
						{title}
					</h3>
				</div>
				<p className='text-[10px] sm:text-[11px] text-slate-400 font-semibold'>
					{subtitle}
				</p>
			</div>

			{/* SVG Radar Visualization */}
			<div className='relative w-full max-w-[280px] sm:max-w-[320px] aspect-square my-1'>
				<svg
					viewBox={`0 0 ${size} ${size}`}
					className='w-full h-full overflow-visible drop-shadow-md'>
					<defs>
						{/* Cosmic Gradient for Data Polygon */}
						<linearGradient
							id='radarCosmicGradient'
							x1='0%'
							y1='0%'
							x2='100%'
							y2='100%'>
							<stop
								offset='0%'
								stopColor='#22D3EE'
								stopOpacity='0.45'
							/>
							<stop
								offset='50%'
								stopColor='#818CF8'
								stopOpacity='0.35'
							/>
							<stop
								offset='100%'
								stopColor='#EC4899'
								stopOpacity='0.45'
							/>
						</linearGradient>

						{/* Glow Filter */}
						<filter
							id='radarGlow'
							x='-20%'
							y='-20%'
							width='140%'
							height='140%'>
							<feGaussianBlur
								stdDeviation='3'
								result='blur'
							/>
							<feComposite
								in='SourceGraphic'
								in2='blur'
								operator='over'
							/>
						</filter>
					</defs>

					{/* Concentric Reference Rings (20%, 40%, 60%, 80%, 100%) */}
					{[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, ringIdx) => (
						<polygon
							key={ringIdx}
							points={getPolygonPoints(radius * scale)}
							fill='none'
							stroke='#1E265A'
							strokeWidth='1.2'
							strokeDasharray={scale === 1.0 ? 'none' : '3 3'}
						/>
					))}

					{/* Radial Axis Spokes */}
					{dataPoints.map((p, idx) => {
						const angle = (2 * Math.PI * idx) / totalSides - Math.PI / 2;
						const ox = cx + radius * Math.cos(angle);
						const oy = cy + radius * Math.sin(angle);
						return (
							<line
								key={idx}
								x1={cx}
								y1={cy}
								x2={ox}
								y2={oy}
								stroke='#2D377A'
								strokeWidth='1.2'
							/>
						);
					})}

					{/* Filled Data Polygon */}
					<polygon
						points={dataPolygonString}
						fill='url(#radarCosmicGradient)'
						stroke='#22D3EE'
						strokeWidth='2.5'
						filter='url(#radarGlow)'
						className='transition-all duration-700 ease-out'
					/>

					{/* Vertices & Score Markers */}
					{dataPoints.map((p, idx) => (
						<g key={idx}>
							{/* Outer ring on point */}
							<circle
								cx={p.x}
								cy={p.y}
								r='5'
								fill='#0D1137'
								stroke='#22D3EE'
								strokeWidth='2.5'
								className='transition-all duration-700 ease-out'
							/>
							{/* Center glowing dot */}
							<circle
								cx={p.x}
								cy={p.y}
								r='2.5'
								fill='#FFFFFF'
								className='transition-all duration-700 ease-out'
							/>
						</g>
					))}

					{/* Outer Domain Labels */}
					{dataPoints.map((p, idx) => {
						// Text anchor alignment based on x coordinate
						const textAnchor =
							Math.abs(p.lx - cx) < 15 ? 'middle'
							: p.lx > cx ? 'start'
							: 'end';

						return (
							<g
								key={idx}
								className='select-none'>
								<text
									x={p.lx}
									y={p.ly - 6}
									textAnchor={textAnchor}
									fill='#E2E8F0'
									fontSize='11'
									fontWeight='bold'
									className='drop-shadow-sm'>
									{p.icon} {p.shortName}
								</text>
								<text
									x={p.lx}
									y={p.ly + 7}
									textAnchor={textAnchor}
									fill='#22D3EE'
									fontSize='10'
									fontWeight='900'
									fontFamily='monospace'>
									{p.score}%
								</text>
							</g>
						);
					})}
				</svg>
			</div>

			{/* Top Aptitude Highlight Pill */}
			{topDomain && (
				<div className='w-full mt-2 bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-400/30 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs'>
					<div className='flex items-center gap-2'>
						<span className='text-base'>{topDomain.icon}</span>
						<div>
							<span className='font-bold text-slate-300'>Top Strength: </span>
							<strong className='text-cyan-300 font-black'>
								{topDomain.name} ({topDomain.score}%)
							</strong>
						</div>
					</div>
					<span className='text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/40'>
						Star Mastery ⭐
					</span>
				</div>
			)}
		</div>
	);
});

export default CognitiveRadarChart;
