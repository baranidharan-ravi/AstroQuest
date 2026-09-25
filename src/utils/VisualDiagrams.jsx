import {
	ArrowRight,
	Box,
	Image as ImageIcon,
	Link2,
	RotateCcw,
	RotateCw,
	Scale,
	Shapes,
	Sparkles,
	Zap,
} from 'lucide-react';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import {
	DynamicShapeCard,
	DynamicSvgShape,
	extractShapeSequenceTerms,
	ShapeClusterCard,
} from './shapeGenerator';

/**
 * Intelligent Concept Visual Mapper for STEM & Analogy Words
 */
export function getConceptVisual(text) {
	if (!text) return { icon: '💡', label: '' };
	const str = String(text).trim();

	// Extract existing emoji if present
	const existingEmoji = str.match(
		/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u,
	);

	const cleanLabel = str
		.replace(
			/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
			'',
		)
		.replace(/^\((.+)\)$/, '$1')
		.trim();

	const lower = cleanLabel.toLowerCase();

	if (existingEmoji) {
		return { icon: existingEmoji[0], label: cleanLabel };
	}

	// Comprehensive Concept Visual Dictionary
	if (lower.includes('photosynthesis'))
		return { icon: '☀️🍃', label: cleanLabel };
	if (lower.includes('respiration')) return { icon: '⚡🫁', label: cleanLabel };
	if (
		lower.includes('plant') ||
		lower.includes('flora') ||
		lower.includes('tree') ||
		lower.includes('leaf')
	)
		return { icon: '🌱', label: cleanLabel };
	if (
		lower.includes('animal') ||
		lower.includes('cell') ||
		lower.includes('fauna') ||
		lower.includes('organism')
	)
		return { icon: '🐾', label: cleanLabel };
	if (
		lower.includes('sun') ||
		lower.includes('solar') ||
		lower.includes('light') ||
		lower.includes('prism') ||
		lower.includes('refract') ||
		lower.includes('rainbow')
	)
		return { icon: '☀️🌈', label: cleanLabel };
	if (
		lower.includes('ice') ||
		lower.includes('cold') ||
		lower.includes('freeze')
	)
		return { icon: '🧊', label: cleanLabel };
	if (
		lower.includes('water') ||
		lower.includes('liquid') ||
		lower.includes('melt') ||
		lower.includes('rain')
	)
		return { icon: '💧', label: cleanLabel };
	if (lower.includes('microscope')) return { icon: '🔬', label: cleanLabel };
	if (lower.includes('telescope')) return { icon: '🔭', label: cleanLabel };
	if (
		lower.includes('galaxy') ||
		lower.includes('star') ||
		lower.includes('space') ||
		lower.includes('planet')
	)
		return { icon: '🌌', label: cleanLabel };
	if (
		lower.includes('microorganism') ||
		lower.includes('bacteria') ||
		lower.includes('microbe') ||
		lower.includes('virus')
	)
		return { icon: '🦠', label: cleanLabel };
	if (
		lower.includes('author') ||
		lower.includes('writer') ||
		lower.includes('novel') ||
		lower.includes('book')
	)
		return { icon: '📖', label: cleanLabel };
	if (lower.includes('architect') || lower.includes('blueprint'))
		return { icon: '📐', label: cleanLabel };
	if (
		lower.includes('building') ||
		lower.includes('house') ||
		lower.includes('monument')
	)
		return { icon: '🏛️', label: cleanLabel };
	if (
		lower.includes('sculptor') ||
		lower.includes('statue') ||
		lower.includes('art')
	)
		return { icon: '🗿', label: cleanLabel };
	if (
		lower.includes('thermometer') ||
		lower.includes('temperature') ||
		lower.includes('heat')
	)
		return { icon: '🌡️', label: cleanLabel };
	if (
		lower.includes('speedometer') ||
		lower.includes('speed') ||
		lower.includes('fast')
	)
		return { icon: '🏎️', label: cleanLabel };
	if (
		lower.includes('catalyst') ||
		lower.includes('chemical') ||
		lower.includes('reaction')
	)
		return { icon: '🧪', label: cleanLabel };
	if (
		lower.includes('mentor') ||
		lower.includes('teacher') ||
		lower.includes('coach')
	)
		return { icon: '🧑‍🏫', label: cleanLabel };
	if (
		lower.includes('growth') ||
		lower.includes('develop') ||
		lower.includes('learn')
	)
		return { icon: '🚀', label: cleanLabel };
	if (lower.includes('bird') || lower.includes('fly'))
		return { icon: '🐦', label: cleanLabel };
	if (lower.includes('nest')) return { icon: '🪺', label: cleanLabel };
	if (lower.includes('bee')) return { icon: '🐝', label: cleanLabel };
	if (lower.includes('hive') || lower.includes('honey'))
		return { icon: '🍯', label: cleanLabel };
	if (lower.includes('dog') || lower.includes('puppy'))
		return { icon: '🐶', label: cleanLabel };
	if (lower.includes('cat') || lower.includes('kitten'))
		return { icon: '🐱', label: cleanLabel };
	if (
		lower.includes('fish') ||
		lower.includes('swim') ||
		lower.includes('ocean')
	)
		return { icon: '🐟', label: cleanLabel };
	if (lower.includes('cloud') || lower.includes('sky'))
		return { icon: '☁️', label: cleanLabel };
	if (lower.includes('rock') || lower.includes('stone'))
		return { icon: '🪨', label: cleanLabel };
	if (lower.includes('glass') || lower.includes('window'))
		return { icon: '🪟', label: cleanLabel };
	if (lower.includes('battery') || lower.includes('power'))
		return { icon: '🔋', label: cleanLabel };
	if (
		lower.includes('bulb') ||
		lower.includes('lamp') ||
		lower.includes('glow')
	)
		return { icon: '💡', label: cleanLabel };
	if (
		lower.includes('car') ||
		lower.includes('vehicle') ||
		lower.includes('wheel')
	)
		return { icon: '🚗', label: cleanLabel };
	if (
		lower.includes('heart') ||
		lower.includes('blood') ||
		lower.includes('pulse')
	)
		return { icon: '❤️', label: cleanLabel };
	if (lower.includes('caterpillar') || lower.includes('cocoon'))
		return { icon: '🐛', label: cleanLabel };
	if (lower.includes('butterfly')) return { icon: '🦋', label: cleanLabel };
	if (lower.includes('tadpole')) return { icon: '🫧', label: cleanLabel };
	if (lower.includes('frog')) return { icon: '🐸', label: cleanLabel };
	if (lower.includes('seed')) return { icon: '🌰', label: cleanLabel };
	if (lower.includes('flower')) return { icon: '🌸', label: cleanLabel };
	if (lower.includes('apple')) return { icon: '🍎', label: cleanLabel };
	if (lower.includes('banana')) return { icon: '🍌', label: cleanLabel };
	if (lower.includes('circle')) return { icon: '🔴', label: cleanLabel };
	if (lower.includes('triangle')) return { icon: '🔺', label: cleanLabel };
	if (lower.includes('square')) return { icon: '🟦', label: cleanLabel };

	return { icon: '💡', label: cleanLabel };
}

/**
 * Lazy-loaded visual image component with skeleton placeholder
 */
export function LazyVisualImage({ src, alt, caption = '', onError = null }) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const imgRef = useRef(null);

	useEffect(() => {
		setLoaded(false);
		setError(false);
	}, [src]);

	// After resetting loaded, check if browser already has the image decoded
	// (common for base64 data URIs — onLoad won't re-fire for cached images)
	useEffect(() => {
		if (
			!loaded &&
			imgRef.current?.complete &&
			imgRef.current?.naturalWidth > 0
		) {
			setLoaded(true);
		}
	});

	const handleImgError = () => {
		setError(true);
		if (onError) onError();
	};

	if (!src || error) {
		return (
			<div className='flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 my-2'>
				<ImageIcon className='w-6 h-6 text-slate-400 mb-1' />
				<span className='text-xs font-semibold'>Visual Diagram</span>
			</div>
		);
	}

	return (
		<div className='relative flex flex-col items-center justify-center my-2 max-w-md w-full'>
			{!loaded && (
				<div className='w-full h-40 sm:h-48 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center border border-slate-200'>
					<div className='flex items-center gap-2 text-slate-400 text-xs font-bold'>
						<div className='w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin' />
						<span>Loading visual clue...</span>
					</div>
				</div>
			)}
			<img
				ref={imgRef}
				src={src}
				alt={alt || 'Question Visual Clue'}
				onLoad={() => setLoaded(true)}
				onError={handleImgError}
				className={`max-h-52 w-auto max-w-full rounded-2xl object-contain shadow-md border-2 border-slate-200 transition-opacity duration-300 ${
					loaded ? 'opacity-100 block' : (
						'opacity-0 absolute -z-10 pointer-events-none'
					)
				}`}
			/>
			{caption && loaded && (
				<span className='text-[11px] font-bold text-slate-500 mt-1.5 text-center'>
					{caption}
				</span>
			)}
		</div>
	);
}

/**
 * Renders a single 3D Isometric Cube in SVG with light, medium, and dark shaded faces
 */
function render3DIsoCube({ gx, gy, gz, size = 20, color = 'blue', key = '' }) {
	const originX = 140;
	const originY = 145;

	const dx = size * 0.866;
	const dy = size * 0.5;
	const h = size * 0.95;

	const isoX = originX + (gx - gy) * dx;
	const isoY = originY + (gx + gy) * dy - gz * h;

	// Top Face
	const topPts = `${isoX},${isoY - h} ${isoX + dx},${isoY - h + dy} ${isoX},${isoY - h + 2 * dy} ${isoX - dx},${isoY - h + dy}`;
	// Left Face
	const leftPts = `${isoX - dx},${isoY - h + dy} ${isoX},${isoY - h + 2 * dy} ${isoX},${isoY + 2 * dy} ${isoX - dx},${isoY + dy}`;
	// Right Face
	const rightPts = `${isoX},${isoY - h + 2 * dy} ${isoX + dx},${isoY - h + dy} ${isoX + dx},${isoY + dy} ${isoX},${isoY + 2 * dy}`;

	let topFill = '#93C5FD';
	let leftFill = '#3B82F6';
	let rightFill = '#1D4ED8';

	if (color === 'amber') {
		topFill = '#FDE68A';
		leftFill = '#F59E0B';
		rightFill = '#B45309';
	} else if (color === 'pink') {
		topFill = '#FBCFE8';
		leftFill = '#EC4899';
		rightFill = '#BE185D';
	} else if (color === 'emerald') {
		topFill = '#A7F3D0';
		leftFill = '#10B981';
		rightFill = '#047857';
	}

	return (
		<g key={key}>
			<polygon
				points={topPts}
				fill={topFill}
				stroke='#0F172A'
				strokeWidth='1.2'
			/>
			<polygon
				points={leftPts}
				fill={leftFill}
				stroke='#0F172A'
				strokeWidth='1.2'
			/>
			<polygon
				points={rightPts}
				fill={rightFill}
				stroke='#0F172A'
				strokeWidth='1.2'
			/>
		</g>
	);
}

/**
 * Strict validity & relevance gatekeeper.
 * Returns false if the diagram cannot be authentically and accurately generated for this question,
 * preventing any misleading, fabricated, or nonsense imagery from ever reaching the student.
 */
export function isDiagramAppropriateForQuestion(
	type,
	data = {},
	questionText = '',
) {
	if (!type || !data) return false;

	const qText = String(
		questionText || data.questionText || data.question || '',
	).toLowerCase();

	switch (type) {
		case 'apple-counting': {
			// Never show apple counting for balance scales, math equations, sequences, or spatial problems
			const forbiddenKeywords = [
				'balance',
				'scale',
				'weigh',
				'pattern',
				'sequence',
				'prism',
				'cube',
				'tower',
				'rotation',
				'clockwise',
				'quadrant',
				'matrix',
				'analogy',
				'ratio',
				'fraction',
				'degree',
				'odd one out',
			];
			if (forbiddenKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}

			// Inappropriate if the question does not explicitly ask to count tangible items
			const countingDirectives = [
				'how many',
				'count',
				'total number of',
				'in the basket',
				'on the tree',
				'in the box',
				'are shown',
			];
			if (!countingDirectives.some((cd) => qText.includes(cd))) {
				return false;
			}

			const count = Number(data.count);
			if (isNaN(count) || count < 1 || count > 20) {
				return false;
			}

			// If emoji is default apple '🍎', verify question actually mentions apples or fruit
			const emoji = data.emoji;
			if (
				(!emoji || emoji === '🍎') &&
				!qText.includes('apple') &&
				!qText.includes('fruit')
			) {
				return false;
			}

			return true;
		}

		case 'scale-balance': {
			// Inappropriate if question does not mention balance, scales, or weights
			if (
				!qText.includes('balance') &&
				!qText.includes('scale') &&
				!qText.includes('weigh') &&
				!qText.includes('heavier') &&
				!qText.includes('lighter')
			) {
				return false;
			}

			// Inappropriate if question is a multi-step algebraic word problem
			// (e.g. "2 blocks and 1 marble balance 5 weights... If 1 marble weighs the same as 3 weights...")
			// A single static scale diagram cannot depict multi-clause algebra accurately without misleading!
			const isMultiClauseAlgebra =
				(qText.match(/\bbalance\b/gi) || []).length >= 2 ||
				(qText.includes('and') &&
					(qText.includes('weighs the same as') ||
						qText.includes('equal to'))) ||
				(qText.includes('if') &&
					qText.includes('then') &&
					qText.includes('balance'));

			if (isMultiClauseAlgebra && !data.isCustomMultiScale) {
				return false;
			}

			return true;
		}

		case 'pattern-shapes':
		case 'shape-sequence': {
			const items =
				Array.isArray(data.sequence) ? data.sequence
				: Array.isArray(data.steps) ? data.steps
				: [];
			if (items.length < 2) return false;
			// If it's the fallback placeholder "Triangle (white)", ensure it wasn't fabricated
			if (
				items.length === 4 &&
				items[0] === 'Triangle (white)' &&
				items[1] === 'Square (shaded)' &&
				!qText.includes('triangle') &&
				!qText.includes('square')
			) {
				return false;
			}
			return true;
		}

		case 'sequence-ladder': {
			const steps = Array.isArray(data.steps) ? data.steps : [];
			if (steps.length < 2) return false;
			if (steps.every((s) => /^\d+(st|nd|rd|th)$/i.test(String(s).trim()))) {
				return false;
			}
			return true;
		}

		case 'block-tower':
		case 'isometric-tower': {
			const towerKeywords = [
				'cube',
				'tower',
				'layer',
				'pyramid',
				'isometric',
				'block structure',
				'unit cube',
			];
			if (qText && !towerKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'optics-prism': {
			const prismKeywords = [
				'prism',
				'refract',
				'rainbow',
				'dispersion',
				'white light',
				'bending of light',
			];
			if (qText && !prismKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'analogy-map': {
			if (
				!data.itemA ||
				data.itemA === 'Concept A' ||
				!data.itemB ||
				data.itemB === 'Concept B' ||
				!data.itemC ||
				data.itemC === 'Concept C'
			) {
				return false;
			}
			return true;
		}

		case 'cause-effect': {
			if (
				!data.cause ||
				data.cause === 'Event / Condition' ||
				data.cause === '...' ||
				!data.action ||
				!data.effect
			) {
				return false;
			}
			return true;
		}

		case 'shape-rotation': {
			const rotationKeywords = [
				'rotat',
				'degree',
				'clockwise',
				'counter-clockwise',
				'turn',
				'quadrant',
			];
			if (qText && !rotationKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'grid-tiles':
		case 'matrix-grid': {
			const gridKeywords = ['grid', 'tile', 'matrix', '3x3'];
			if (qText && !gridKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'odd-one-out': {
			const oddKeywords = [
				'odd',
				'not belong',
				'different group',
				'different state',
			];
			if (qText && !oddKeywords.some((kw) => qText.includes(kw))) {
				return false;
			}
			return true;
		}

		case 'image': {
			return Boolean(data.imageUrl || data.src);
		}

		default:
			return true;
	}
}

const VisualDiagram = memo(function VisualDiagram({
	type,
	data = {},
	isSolution = false,
}) {
	if (!type || !data) return null;

	const qText = data.questionText || data.question || '';
	if (!isDiagramAppropriateForQuestion(type, data, qText)) {
		return null;
	}

	if (type === 'image' || data?.imageUrl || data?.src) {
		const imgSrc = data?.imageUrl || data?.src || '';
		return (
			<LazyVisualImage
				src={imgSrc}
				alt={data?.alt || 'Question Diagram'}
				caption={data?.caption}
				onError={data?.onError}
			/>
		);
	}

	// 1. Dedicated Physics & Optics: Light Dispersion through Glass Prism
	if (type === 'optics-prism') {
		return (
			<div className='flex flex-col items-center justify-center p-3.5 sm:p-4 my-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border-2 border-indigo-400/50 shadow-xl max-w-xl w-full animate-in fade-in duration-300'>
				<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-cyan-300 tracking-wider mb-2 bg-cyan-950/80 px-3 py-0.5 rounded-full border border-cyan-500/40'>
					<Sparkles className='w-3.5 h-3.5 text-cyan-400' />
					<span>Optics: Light Dispersion & Refraction</span>
				</div>

				{/* SVG Optics Prism Diagram */}
				<div className='relative w-full flex items-center justify-center p-2'>
					<svg
						viewBox='0 0 340 160'
						className='w-full max-w-[340px] h-36'>
						<defs>
							{/* Glass Prism Gradient */}
							<linearGradient
								id='prismGrad'
								x1='0%'
								y1='0%'
								x2='100%'
								y2='100%'>
								<stop
									offset='0%'
									stopColor='#38BDF8'
									stopOpacity='0.45'
								/>
								<stop
									offset='50%'
									stopColor='#E0F2FE'
									stopOpacity='0.25'
								/>
								<stop
									offset='100%'
									stopColor='#818CF8'
									stopOpacity='0.45'
								/>
							</linearGradient>
							{/* White Incident Beam Gradient */}
							<linearGradient
								id='whiteBeam'
								x1='0%'
								y1='0%'
								x2='100%'
								y2='0%'>
								<stop
									offset='0%'
									stopColor='#FFFFFF'
									stopOpacity='0.2'
								/>
								<stop
									offset='100%'
									stopColor='#FFFFFF'
									stopOpacity='0.95'
								/>
							</linearGradient>
						</defs>

						{/* Glass Prism Triangle */}
						<polygon
							points='170,25 90,135 250,135'
							fill='url(#prismGrad)'
							stroke='#7DD3FC'
							strokeWidth='2.5'
						/>
						{/* Glass Internal Reflection Lines */}
						<line
							x1='170'
							y1='25'
							x2='170'
							y2='135'
							stroke='#BAE6FD'
							strokeWidth='0.8'
							strokeDasharray='2 2'
						/>

						{/* 1. Incident White Light Beam */}
						<polygon
							points='20,80 20,86 118,92 118,88'
							fill='url(#whiteBeam)'
						/>
						<line
							x1='20'
							y1='83'
							x2='120'
							y2='90'
							stroke='#FFFFFF'
							strokeWidth='3.5'
							strokeLinecap='round'
						/>
						<text
							x='55'
							y='68'
							fill='#F8FAFC'
							fontSize='10'
							fontWeight='900'
							textAnchor='middle'>
							White Light Beam ☀️
						</text>

						{/* 2. Refracted Beams Inside Prism */}
						<line
							x1='120'
							y1='90'
							x2='188'
							y2='88'
							stroke='#FDA4AF'
							strokeWidth='2'
						/>
						<line
							x1='120'
							y1='90'
							x2='192'
							y2='96'
							stroke='#86EFAC'
							strokeWidth='2'
						/>
						<line
							x1='120'
							y1='90'
							x2='196'
							y2='104'
							stroke='#93C5FD'
							strokeWidth='2'
						/>

						{/* 3. Dispersed Rainbow Spectrum Emerging */}
						{/* Red */}
						<line
							x1='188'
							y1='88'
							x2='310'
							y2='65'
							stroke='#EF4444'
							strokeWidth='3.5'
							strokeLinecap='round'
						/>
						{/* Orange */}
						<line
							x1='190'
							y1='92'
							x2='312'
							y2='74'
							stroke='#F97316'
							strokeWidth='3'
							strokeLinecap='round'
						/>
						{/* Yellow */}
						<line
							x1='192'
							y1='96'
							x2='314'
							y2='83'
							stroke='#FBBF24'
							strokeWidth='3'
							strokeLinecap='round'
						/>
						{/* Green */}
						<line
							x1='194'
							y1='100'
							x2='316'
							y2='92'
							stroke='#10B981'
							strokeWidth='3'
							strokeLinecap='round'
						/>
						{/* Cyan */}
						<line
							x1='195'
							y1='103'
							x2='318'
							y2='101'
							stroke='#06B6D4'
							strokeWidth='3'
							strokeLinecap='round'
						/>
						{/* Blue */}
						<line
							x1='196'
							y1='106'
							x2='320'
							y2='110'
							stroke='#3B82F6'
							strokeWidth='3'
							strokeLinecap='round'
						/>
						{/* Violet */}
						<line
							x1='197'
							y1='109'
							x2='322'
							y2='119'
							stroke='#8B5CF6'
							strokeWidth='3.5'
							strokeLinecap='round'
						/>

						{/* Label for Spectrum */}
						<text
							x='275'
							y='48'
							fill='#F472B6'
							fontSize='10'
							fontWeight='900'
							textAnchor='middle'>
							Rainbow Spectrum 🌈
						</text>
					</svg>
				</div>

				{/* Scientific Explanation Clue */}
				<div className='flex items-center justify-between gap-2 w-full mt-1 text-[10px] sm:text-[11px] font-bold flex-wrap sm:flex-nowrap'>
					<div className='bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-cyan-200'>
						1. Incident Ray enters glass
					</div>
					<span className='text-indigo-300 font-extrabold hidden sm:inline'>
						➔
					</span>
					<div className='bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-indigo-200'>
						2. Light Bends (Refraction)
					</div>
					<span className='text-indigo-300 font-extrabold hidden sm:inline'>
						➔
					</span>
					<div className='bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-pink-200'>
						3. Rainbow Colors Split
					</div>
				</div>

				{/* Solution Banner */}
				{isSolution && (
					<div className='mt-2.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black shadow-lg animate-bounce-short flex items-center gap-2'>
						<span>✨ Scientific Phenomenon:</span>
						<span className='underline decoration-wavy'>
							Refraction & Dispersion of Light
						</span>
					</div>
				)}
			</div>
		);
	}

	// 2. Growing Multi-Shape Cluster / Triangular Number Progression (e.g. Step 1 has 1 square, Step 2 has 3 squares...)
	if (
		type === 'shape-pattern-grid' ||
		data.isShapeCluster ||
		(Array.isArray(data.steps) && data.steps[0]?.count !== undefined)
	) {
		const steps = data.steps || [
			{ step: 1, count: 1, shape: 'square', isShaded: true },
			{ step: 2, count: 3, shape: 'square', isShaded: true },
			{ step: 3, count: 6, shape: 'square', isShaded: true },
			{ step: 4, count: 10, shape: 'square', isShaded: true },
		];
		const targetStep =
			data.targetStep ||
			(steps.length > 0 ? steps[steps.length - 1].step + 2 : 6);
		const targetCount = data.targetCount || 21;
		const shape = data.shape || steps[0]?.shape || 'square';
		const isShaded = data.isShaded !== undefined ? data.isShaded : true;
		const color = data.color || '#3B82F6';

		return (
			<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-purple-50/90 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
				<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2.5 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
					<Shapes className='w-3.5 h-3.5 text-indigo-600' />
					<span>Growing Shape Count Progression</span>
				</div>

				<div className='flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 w-full'>
					{steps.map((st, idx) => (
						<div
							key={idx}
							className='flex items-center gap-1 sm:gap-1.5'>
							<ShapeClusterCard
								step={st.step}
								count={st.count}
								shape={st.shape || shape}
								isShaded={st.isShaded !== undefined ? st.isShaded : isShaded}
								color={st.color || color}
								patternId={`cluster-pat-${idx}`}
							/>
							{idx < steps.length - 1 && (
								<span className='text-xs font-black text-indigo-400'>➔</span>
							)}
						</div>
					))}

					<span className='text-xs font-black text-indigo-400'>➔</span>

					{/* Target Step Card */}
					<ShapeClusterCard
						step={targetStep}
						count={targetCount}
						shape={shape}
						isShaded={isShaded}
						color={color}
						isTarget={true}
						isSolution={isSolution}
						patternId={`cluster-pat-sol`}
					/>
				</div>

				{/* Solution Calculation Banner */}
				{isSolution && (
					<div className='mt-2.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black shadow-lg animate-bounce-short flex items-center gap-2'>
						<span>✨ Step {targetStep} Target Count:</span>
						<span>{targetCount} Shaded Squares</span>
					</div>
				)}
			</div>
		);
	}

	// 3. Spatial Rotation & Quadrant Progression (e.g. 90° Clockwise Rotation with Quadrants or Shapes)
	if (type === 'shape-rotation' || data.isRotationSequence || data.isQuadrant) {
		const steps = data.steps || [
			{
				step: 1,
				quadrant: 'top-right',
				deg: 0,
				isQuadrant: true,
				isShaded: true,
			},
			{
				step: 2,
				quadrant: 'bottom-right',
				deg: 90,
				isQuadrant: true,
				isShaded: true,
			},
			{
				step: 3,
				quadrant: 'bottom-left',
				deg: 180,
				isQuadrant: true,
				isShaded: true,
			},
		];
		const target = data.target || {
			step: 4,
			quadrant: 'top-left',
			deg: 270,
			isQuadrant: true,
			isShaded: true,
		};
		const angle = data.angle || 90;
		const direction = data.direction || 'CW';
		const isCCW = String(direction).toUpperCase() === 'CCW';

		return (
			<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border-2 border-indigo-400/50 shadow-xl max-w-xl w-full animate-in fade-in duration-300'>
				<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-cyan-300 tracking-wider mb-3 bg-cyan-950/80 px-3 py-0.5 rounded-full border border-cyan-500/40'>
					{isCCW ?
						<RotateCcw className='w-3.5 h-3.5 text-cyan-400 animate-spin-slow' />
					:	<RotateCw className='w-3.5 h-3.5 text-cyan-400 animate-spin-slow' />}
					<span>
						Spatial Geometry: {angle}°{' '}
						{isCCW ? 'Counter-Clockwise' : 'Clockwise'} Rotation
					</span>
				</div>

				<div className='flex items-center justify-center flex-wrap gap-2 sm:gap-3 w-full'>
					{steps.map((st, idx) => (
						<Fragment key={idx}>
							<div className='flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white text-slate-900 border-2 border-slate-200 shadow-md min-w-[85px] sm:min-w-[95px]'>
								<span className='text-[10px] font-black uppercase text-indigo-700 mb-1 tracking-wider bg-indigo-50 px-2 py-0.2 rounded'>
									Step {st.step || idx + 1}
								</span>
								<DynamicSvgShape
									parsed={st}
									size={60}
									patternId={`rot-hatch-${idx}`}
									rotation={st.deg || 0}
								/>
								<span className='text-[10px] font-extrabold text-slate-700 mt-1 capitalize'>
									{st.quadrant ?
										st.quadrant.replace('-', ' ')
									:	`${st.deg || 0}°`}
								</span>
							</div>

							{/* Rotation Arrow Indicator between steps */}
							<div className='flex flex-col items-center justify-center px-0.5 sm:px-1'>
								<div className='w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30 shadow-xs'>
									{isCCW ?
										<RotateCcw className='w-3.5 h-3.5 text-cyan-300' />
									:	<RotateCw className='w-3.5 h-3.5 text-cyan-300' />}
								</div>
								<span className='text-[9px] font-black text-cyan-300 mt-0.5 whitespace-nowrap bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30'>
									+{angle}° {direction}
								</span>
							</div>
						</Fragment>
					))}

					{/* Target Step Card */}
					{!isSolution ?
						<div className='flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white/10 border-2 border-dashed border-cyan-400 min-w-[85px] sm:min-w-[95px] shadow-sm animate-pulse'>
							<span className='text-[10px] font-black uppercase text-cyan-300 mb-1 tracking-wider'>
								Next Step
							</span>
							<div className='w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-300 font-black text-2xl'>
								❓
							</div>
							<span className='text-[10px] font-extrabold text-cyan-200 mt-1'>
								Position?
							</span>
						</div>
					:	<div className='flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 text-slate-900 border-2 border-emerald-400 ring-2 ring-emerald-300 shadow-xl min-w-[85px] sm:min-w-[95px] animate-bounce-short'>
							<span className='text-[10px] font-black uppercase text-emerald-800 mb-1 tracking-wider bg-emerald-100 px-2 py-0.2 rounded'>
								Next Step
							</span>
							<DynamicSvgShape
								parsed={target}
								size={60}
								patternId='rot-hatch-target'
								rotation={target.deg || 0}
							/>
							<span className='text-[10px] font-extrabold text-emerald-800 mt-1 capitalize font-mono'>
								{target.quadrant ?
									target.quadrant.replace('-', ' ')
								:	`${target.deg}°`}
							</span>
						</div>
					}
				</div>

				{/* Solution Banner */}
				{isSolution && (
					<div className='mt-3 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black shadow-lg animate-bounce-short flex items-center gap-2'>
						<span>
							✨ Next {angle}° {isCCW ? 'Counter-Clockwise' : 'Clockwise'}{' '}
							Position:
						</span>
						<span className='underline decoration-wavy capitalize'>
							{target.quadrant ?
								target.quadrant.replace('-', ' ')
							:	`${target.deg}°`}
						</span>
					</div>
				)}
			</div>
		);
	}

	// 4. True 3D Isometric Block Pyramid & Cube Structure
	if (type === 'block-tower' || type === 'isometric-tower') {
		const layers = data.layers || [
			{ size: 3, count: 9, color: 'blue', label: 'Layer 1 (Base 3x3)' },
			{ size: 2, count: 4, color: 'amber', label: 'Layer 2 (Middle 2x2)' },
			{ size: 1, count: 1, color: 'pink', label: 'Layer 3 (Top 1x1)' },
		];

		const totalCubes =
			data.totalCubes ||
			layers.reduce((acc, l) => acc + (l.count || l.size * l.size), 0);

		// Build and depth-sort 3D cubes from back to front
		const cubesToRender = [];
		layers.forEach((layer, layerIdx) => {
			const sz = layer.size || 1;
			const col =
				layer.color ||
				(layerIdx === 0 ? 'blue'
				: layerIdx === 1 ? 'amber'
				: 'pink');
			const offset = (3 - sz) / 2; // Center smaller layers on top

			for (let x = 0; x < sz; x++) {
				for (let y = 0; y < sz; y++) {
					cubesToRender.push({
						gx: offset + x,
						gy: offset + y,
						gz: layerIdx,
						color: col,
						key: `cube-${layerIdx}-${x}-${y}`,
						depth: layerIdx * 100 + (offset + x + (offset + y)),
					});
				}
			}
		});

		// Back to front render order
		cubesToRender.sort((a, b) => a.depth - b.depth);

		return (
			<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-purple-50/90 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
				<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
					<Box className='w-3.5 h-3.5 text-indigo-600' />
					<span>3D Isometric Cube Tower Structure</span>
				</div>

				{/* 3D Isometric Viewport */}
				<div className='bg-white rounded-2xl p-2 border-2 border-indigo-100 shadow-inner flex items-center justify-center'>
					<svg
						viewBox='0 0 280 200'
						className='w-56 h-40 sm:w-64 sm:h-48 drop-shadow-lg'>
						{cubesToRender.map((c) =>
							render3DIsoCube({
								gx: c.gx,
								gy: c.gy,
								gz: c.gz,
								size: 20,
								color: c.color,
								key: c.key,
							}),
						)}
					</svg>
				</div>

				{/* Layer Volume Breakdown */}
				<div className='flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-3 w-full'>
					{layers.map((l, idx) => (
						<div
							key={idx}
							className='flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-xs'>
							<div
								className={`w-3 h-3 rounded-full ${
									l.color === 'blue' || idx === 0 ? 'bg-blue-500'
									: l.color === 'amber' || idx === 1 ? 'bg-amber-500'
									: 'bg-pink-500'
								}`}
							/>
							<span className='text-[10px] sm:text-[11px] font-bold text-slate-800'>
								{l.label || `L${idx + 1}`}:{' '}
								<b className='text-indigo-600'>{l.count || l.size * l.size}</b>{' '}
								cubes
							</span>
						</div>
					))}
				</div>

				{/* Total Calculation Banner in Solution Mode */}
				{isSolution && (
					<div className='mt-2.5 px-3.5 py-1 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md animate-bounce-short flex items-center gap-1.5'>
						<span>✨ Total Volume:</span>
						<span>
							{layers.map((l) => l.count || l.size * l.size).join(' + ')} ={' '}
							{totalCubes} Unit Cubes
						</span>
					</div>
				)}
			</div>
		);
	}

	// 3. Shape & Color Sequence Progressions
	if (type === 'shape-sequence' || type === 'pattern-shapes') {
		let rawItems =
			Array.isArray(data.sequence) ? data.sequence
			: Array.isArray(data.steps) ? data.steps
			: [];

		const qSource = data.question || data.questionText || data.raw || '';
		if (qSource) {
			const extracted = extractShapeSequenceTerms(qSource);
			if (extracted && extracted.length >= 2) {
				// If extracted has items and either rawItems is empty or extracted has more terms
				// or rawItems does not match the full question sequence, use extracted directly from question:
				if (
					rawItems.length === 0 ||
					extracted.length > rawItems.length ||
					!rawItems.every((it, idx) => it === extracted[idx]) ||
					rawItems.every((it) => /^\d+(st|nd|rd|th)$/i.test(String(it).trim()))
				) {
					rawItems = extracted;
				}
			}
		}

		// Filter out any trailing question sentences, question marks, placeholders, or empty/invisible tokens
		let items = rawItems
			.map((item) =>
				typeof item === 'string' ?
					item.replace(/[\uFE0E\uFE0F\u200B-\u200D\uFEFF]/g, '').trim()
				:	item,
			)
			.filter((item) => {
				if (!item) return false;
				if (typeof item === 'string') {
					if (!item.trim()) return false;
					if (item === '?' || item.includes('?')) return false;
					if (/^(_+|\.\.\.+)$/.test(item)) return false;
					if (
						/^(what|which|how|find|comes|pattern|sequence|look)\b/i.test(item)
					)
						return false;
				}
				return true;
			});

		if (items.length === 0) {
			items = [
				'Triangle (white)',
				'Square (shaded)',
				'Triangle (white)',
				'Square (shaded)',
			];
		}

		const nextItem =
			data.correctAnswer ||
			data.correctAnswerText ||
			data.nextItem ||
			data.nextVal ||
			items[0] ||
			'?';

		const isCompact = items.length >= 5;

		return (
			<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-purple-50/90 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
				<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2.5 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
					<Shapes className='w-3.5 h-3.5 text-indigo-600' />
					<span>Geometric Shape & Color Progression</span>
				</div>

				{/* Geometric Shape Cards Row */}
				<div className='flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 w-full'>
					{items.map((item, idx) => (
						<div
							key={idx}
							className='flex items-center gap-1 sm:gap-1.5'>
							<DynamicShapeCard
								item={item}
								index={idx}
								isCompact={isCompact}
							/>
							{idx < items.length - 1 && (
								<span className='text-[10px] sm:text-xs font-black text-indigo-400'>
									➔
								</span>
							)}
						</div>
					))}

					<span className='text-[10px] sm:text-xs font-black text-indigo-400'>
						➔
					</span>

					{/* Target Next Term Card */}
					<DynamicShapeCard
						item={nextItem}
						index={items.length}
						isTarget={true}
						isSolution={isSolution}
						isCompact={isCompact}
					/>
				</div>
			</div>
		);
	}

	switch (type) {
		case 'analogy-map': {
			const visA = getConceptVisual(data.itemA || 'Concept A');
			const visB = getConceptVisual(data.itemB || 'Concept B');
			const visC = getConceptVisual(data.itemC || 'Concept C');
			const visD = getConceptVisual(data.itemD || data.target || '?');

			return (
				<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-[#1A1D54]/10 via-[#312B63]/10 to-[#141846]/10 rounded-2xl border-2 border-indigo-200/90 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
					<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-700 tracking-wider mb-2.5 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80'>
						<Link2 className='w-3.5 h-3.5 text-indigo-600' />
						<span>Concept Relationship Analogy</span>
					</div>

					{/* Pair 1 (Given Relationship) */}
					<div className='w-full grid grid-cols-11 items-center gap-1.5 sm:gap-2 mb-2'>
						<div className='col-span-5 bg-white border-2 border-indigo-300/80 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.02]'>
							<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
								{visA.icon}
							</div>
							<div className='flex-1 min-w-0'>
								<span className='text-[10px] font-bold text-indigo-500 uppercase block tracking-wider'>
									Source
								</span>
								<h4 className='text-xs sm:text-sm font-black text-slate-900 leading-snug break-words'>
									{visA.label || 'Concept A'}
								</h4>
							</div>
						</div>

						<div className='col-span-1 flex items-center justify-center'>
							<div className='w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm'>
								<ArrowRight className='w-3.5 h-3.5 stroke-[3]' />
							</div>
						</div>

						<div className='col-span-5 bg-gradient-to-tr from-indigo-600 to-purple-700 border-2 border-indigo-400 text-white rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.02]'>
							<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
								{visB.icon}
							</div>
							<div className='flex-1 min-w-0'>
								<span className='text-[10px] font-bold text-indigo-200 uppercase block tracking-wider'>
									Relates to
								</span>
								<h4 className='text-xs sm:text-sm font-black text-white leading-snug break-words'>
									{visB.label || 'Concept B'}
								</h4>
							</div>
						</div>
					</div>

					{/* Center Parallel Divider */}
					<div className='flex items-center gap-3 w-full my-1'>
						<div className='flex-1 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent' />
						<span className='text-[10px] font-black uppercase text-purple-700 bg-purple-100/90 px-3 py-0.5 rounded-full border border-purple-300/80 tracking-widest shadow-xs'>
							✨ in the same way as ✨
						</span>
						<div className='flex-1 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent' />
					</div>

					{/* Pair 2 (Target Relationship) */}
					<div className='w-full grid grid-cols-11 items-center gap-1.5 sm:gap-2 mt-2'>
						<div className='col-span-5 bg-white border-2 border-pink-300/80 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.02]'>
							<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
								{visC.icon}
							</div>
							<div className='flex-1 min-w-0'>
								<span className='text-[10px] font-bold text-pink-500 uppercase block tracking-wider'>
									Target
								</span>
								<h4 className='text-xs sm:text-sm font-black text-slate-900 leading-snug break-words'>
									{visC.label || 'Concept C'}
								</h4>
							</div>
						</div>

						<div className='col-span-1 flex items-center justify-center'>
							<div className='w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm'>
								<ArrowRight className='w-3.5 h-3.5 stroke-[3]' />
							</div>
						</div>

						<div
							className={`col-span-5 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-all ${
								isSolution ?
									'bg-gradient-to-tr from-emerald-600 to-teal-600 border-2 border-emerald-400 text-white ring-2 ring-emerald-300 animate-bounce-short'
								:	'bg-gradient-to-tr from-pink-50 to-purple-50 border-2 border-dashed border-pink-400 text-pink-900'
							}`}>
							<div
								className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0 ${
									isSolution ? 'bg-white/20' : 'bg-pink-200 text-pink-700'
								}`}>
								{isSolution ? visD.icon : '❓'}
							</div>
							<div className='flex-1 min-w-0'>
								<span
									className={`text-[10px] font-bold uppercase block tracking-wider ${
										isSolution ? 'text-emerald-100' : 'text-pink-500'
									}`}>
									{isSolution ? 'Correct Solution' : 'What belongs here?'}
								</span>
								<h4
									className={`text-xs sm:text-sm font-black leading-snug break-words ${
										isSolution ? 'text-white' : 'text-pink-800'
									}`}>
									{isSolution ?
										visD.label || 'Answer'
									:	'Choose option on right ➔'}
								</h4>
							</div>
						</div>
					</div>
				</div>
			);
		}

		case 'odd-one-out': {
			const target = data.target || data.answer || 'Odd-One-Out Item';
			const visTarget = getConceptVisual(target);

			return (
				<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90 rounded-2xl border-2 border-amber-300 shadow-sm max-w-xl w-full animate-in fade-in duration-300 overflow-hidden'>
					<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-amber-900 tracking-wider mb-2.5 bg-amber-200/80 px-3 py-0.5 rounded-full border border-amber-300'>
						<Sparkles className='w-3.5 h-3.5 text-amber-600' />
						<span>Classification & Odd-One-Out Analysis</span>
					</div>

					<div className='w-full bg-white rounded-2xl p-3 sm:p-4 border border-amber-200 shadow-xs flex flex-col items-center text-center gap-2.5'>
						<span className='text-[11px] sm:text-xs font-bold text-amber-900'>
							🎯 Clue: Three items share the exact same state of matter or
							property. One belongs to a different group!
						</span>

						{isSolution ?
							<div className='w-full p-3 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md flex items-center justify-center gap-3 animate-bounce-short border-2 border-emerald-400'>
								<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl shadow-inner flex-shrink-0'>
									{visTarget.icon}
								</div>
								<div className='text-left'>
									<span className='text-[10px] font-black uppercase text-emerald-100 block tracking-wider'>
										✓ Odd-One-Out Identified
									</span>
									<h4 className='text-sm sm:text-base font-black text-white leading-tight'>
										{target}
									</h4>
								</div>
							</div>
						:	<div className='w-full p-2.5 rounded-xl bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 flex items-center justify-center gap-2 font-black text-xs sm:text-sm'>
								<span>🔍 Compare: Solid 🧊 vs Liquid 💧 vs Gas 💨</span>
							</div>
						}
					</div>
				</div>
			);
		}

		case 'cause-effect': {
			const visCause = getConceptVisual(data.cause || 'Initial Event');
			const visEffect = getConceptVisual(data.effect || 'Outcome');
			const action = data.action || 'leads to';
			const cleanAction =
				action.length > 25 ? action.slice(0, 22) + '...' : action;

			return (
				<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-yellow-50/90 rounded-2xl border-2 border-amber-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300 overflow-hidden'>
					<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-amber-800 tracking-wider mb-2.5 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300'>
						<Zap className='w-3.5 h-3.5 text-amber-600' />
						<span>Process & Cause-and-Effect Chain</span>
					</div>

					<div
						className={`w-full flex ${
							isSolution ? 'flex-col' : 'flex-col sm:flex-row'
						} items-stretch sm:items-center justify-between gap-2 sm:gap-2.5`}>
						<div className='flex-1 min-w-[135px] bg-white border-2 border-amber-300 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3'>
							<div className='w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0'>
								{visCause.icon}
							</div>
							<div className='flex-1 min-w-0'>
								<span className='text-[10px] font-bold text-amber-600 uppercase block tracking-wider truncate'>
									Initial Setup
								</span>
								<h4
									className='text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug'
									title={visCause.label}>
									{visCause.label || 'Setup'}
								</h4>
							</div>
						</div>

						<div className='flex items-center justify-center gap-1 px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[10px] sm:text-[11px] shadow-xs max-w-[170px] sm:max-w-[200px] mx-auto flex-shrink-0'>
							<span className='truncate'>
								{isSolution ? '⬇ ' : '➔ '}
								{cleanAction}
								{isSolution ? ' ⬇' : ' ➔'}
							</span>
						</div>

						<div
							className={`flex-1 min-w-[135px] rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-2.5 sm:gap-3 transition-all ${
								isSolution ?
									'bg-gradient-to-tr from-emerald-600 to-teal-600 border-2 border-emerald-400 text-white ring-2 ring-emerald-300 animate-bounce-short'
								:	'bg-white border-2 border-dashed border-orange-400 text-orange-950'
							}`}>
							<div
								className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner flex-shrink-0 ${
									isSolution ? 'bg-white/20' : 'bg-orange-100 text-orange-600'
								}`}>
								{isSolution ? visEffect.icon : '❓'}
							</div>
							<div className='flex-1 min-w-0'>
								<span
									className={`text-[10px] font-bold uppercase block tracking-wider truncate ${
										isSolution ? 'text-emerald-100' : 'text-orange-500'
									}`}>
									{isSolution ? 'Resulting Phenomenon' : 'Result / Outcome'}
								</span>
								<h4
									className={`text-xs sm:text-sm font-black line-clamp-2 leading-snug ${
										isSolution ? 'text-white' : 'text-orange-900'
									}`}
									title={isSolution ? visEffect.label : 'What happens?'}>
									{isSolution ? visEffect.label || 'Outcome' : 'What happens?'}
								</h4>
							</div>
						</div>
					</div>
				</div>
			);
		}

		case 'sequence-ladder': {
			const rawSteps = Array.isArray(data.steps) ? data.steps : [];
			const nextVal = data.nextVal || '?';
			const rule = data.rule || '';

			return (
				<div className='flex flex-col items-center justify-center p-3.5 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl border-2 border-cyan-200 shadow-sm my-2 max-w-xl w-full animate-in fade-in duration-300'>
					<div className='text-[10px] sm:text-xs font-black uppercase text-cyan-800 tracking-wider mb-2.5 bg-cyan-100 px-3 py-0.5 rounded-full border border-cyan-300'>
						🔢 Number & Sequence Rule Progression
					</div>

					<div className='flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 w-full'>
						{rawSteps.map((step, idx) => (
							<div
								key={idx}
								className='flex items-center gap-1.5'>
								<div className='min-w-[48px] px-3.5 py-2 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-md border border-cyan-400'>
									{step}
								</div>
								{idx < rawSteps.length - 1 && (
									<span className='text-xs font-black text-cyan-500'>➔</span>
								)}
							</div>
						))}
						<span className='text-xs font-black text-cyan-500'>➔</span>
						<div
							className={`min-w-[48px] px-3.5 py-2 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center shadow-md transition-all ${
								isSolution ?
									'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white ring-2 ring-emerald-300 animate-bounce-short border border-emerald-400'
								:	'bg-white border-2 border-dashed border-cyan-500 text-cyan-700'
							}`}>
							{isSolution ? nextVal : '?'}
						</div>
					</div>

					{rule && (
						<div className='mt-2.5 px-3 py-1 bg-white/80 rounded-xl border border-cyan-200 text-[11px] font-bold text-cyan-900'>
							Rule: {rule}
						</div>
					)}
				</div>
			);
		}

		case 'matrix-grid': {
			const rawGrid = data.grid || [
				['Square (Gray)', 'Circle (White)', 'Triangle (White)'],
				['Square (White)', 'Circle (Gray)', 'Triangle (White)'],
				['Square (Gray)', 'Circle (White)', '?'],
			];
			const answer = data.answer || data.correctAnswer || 'Triangle (Gray)';

			return (
				<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-purple-50 via-indigo-50 to-slate-50 rounded-2xl border-2 border-purple-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
					<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-purple-800 tracking-wider mb-2.5 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-300'>
						<Shapes className='w-3.5 h-3.5 text-purple-600' />
						<span>3x3 Matrix Grid Shape & Shading Progression</span>
					</div>

					<div className='grid grid-cols-3 gap-2.5 bg-white p-3 rounded-2xl border-2 border-purple-200 shadow-md'>
						{rawGrid.flat().map((cell, idx) => {
							const isTarget =
								cell === '?' || idx === rawGrid.flat().length - 1;

							return (
								<div
									key={idx}
									className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all shadow-xs min-w-[70px] sm:min-w-[80px] min-h-[70px] ${
										isTarget ?
											isSolution ?
												'bg-gradient-to-tr from-emerald-50 to-teal-50 border-2 border-emerald-500 ring-2 ring-emerald-300 shadow-md animate-bounce-short'
											:	'bg-purple-50 border-2 border-dashed border-purple-400 text-purple-600'
										:	'bg-slate-50 border border-slate-200 hover:scale-105'
									}`}>
									{isTarget && !isSolution ?
										<div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-black text-xl'>
											❓
										</div>
									:	<DynamicShapeCard
											item={isTarget ? answer : cell}
											isTarget={isTarget}
											isSolution={isSolution}
											index={idx}
										/>
									}
								</div>
							);
						})}
					</div>
				</div>
			);
		}

		case 'grid-tiles': {
			const rows = data.rows || 6;
			const cols = data.cols || 6;
			const holeRow = data.holeRow ?? 1;
			const holeCol = data.holeCol ?? 2;
			const holeW = data.holeW ?? 3;
			const holeH = data.holeH ?? 3;
			const totalHoleTiles = holeW * holeH;

			const size = 200;
			const cellW = size / cols;
			const cellH = size / rows;
			const startX = 20;
			const startY = 20;

			const holeX = startX + holeCol * cellW;
			const holeY = startY + holeRow * cellH;
			const holeWidth = holeW * cellW;
			const holeHeight = holeH * cellH;

			return (
				<div className='flex flex-col items-center justify-center p-3'>
					<svg
						viewBox='0 0 240 240'
						className='w-48 h-48 sm:w-56 sm:h-56'>
						<rect
							x={startX}
							y={startY}
							width={size}
							height={size}
							fill='#F8FAFC'
							stroke='#94A3B8'
							strokeWidth='2'
							rx='4'
						/>
						{Array.from({ length: cols + 1 }).map((_, i) => (
							<line
								key={`v-${i}`}
								x1={startX + i * cellW}
								y1={startY}
								x2={startX + i * cellW}
								y2={startY + size}
								stroke='#CBD5E1'
								strokeWidth='1.5'
							/>
						))}
						{Array.from({ length: rows + 1 }).map((_, i) => (
							<line
								key={`h-${i}`}
								x1={startX}
								y1={startY + i * cellH}
								x2={startX + size}
								y2={startY + i * cellH}
								stroke='#CBD5E1'
								strokeWidth='1.5'
							/>
						))}
						<rect
							x={holeX}
							y={holeY}
							width={holeWidth}
							height={holeHeight}
							fill='#FFFFFF'
						/>
						{isSolution ?
							<g>
								<rect
									x={holeX}
									y={holeY}
									width={holeWidth}
									height={holeHeight}
									fill='#FFE4E6'
									stroke='#EF4444'
									strokeWidth='3'
									rx='2'
								/>
								{Array.from({ length: holeW - 1 }).map((_, i) => (
									<line
										key={`sol-v-${i}`}
										x1={holeX + (i + 1) * cellW}
										y1={holeY}
										x2={holeX + (i + 1) * cellW}
										y2={holeY + holeHeight}
										stroke='#EF4444'
										strokeWidth='2'
									/>
								))}
								{Array.from({ length: holeH - 1 }).map((_, i) => (
									<line
										key={`sol-h-${i}`}
										x1={holeX}
										y1={holeY + (i + 1) * cellH}
										x2={holeX + holeWidth}
										y2={holeY + (i + 1) * cellH}
										stroke='#EF4444'
										strokeWidth='2'
									/>
								))}
								{Array.from({ length: totalHoleTiles }).map((_, i) => {
									const r = Math.floor(i / holeW);
									const c = i % holeW;
									const tx = holeX + (c + 0.5) * cellW;
									const ty = holeY + (r + 0.5) * cellH + 2;
									return (
										<text
											key={`num-${i}`}
											x={tx}
											y={ty}
											fill='#DC2626'
											fontSize={holeW > 3 ? '16' : '20'}
											fontWeight='bold'
											textAnchor='middle'
											dominantBaseline='middle'
											fontFamily='Nunito, sans-serif'>
											{i + 1}
										</text>
									);
								})}
							</g>
						:	null}
					</svg>
				</div>
			);
		}

		case 'apple-counting': {
			const count = Number(data.count) > 0 ? Number(data.count) : 4;
			const emoji = data.emoji || '🍎';
			return (
				<div className='flex flex-col items-center justify-center p-2'>
					<div className='bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-center gap-3 max-w-sm shadow-inner'>
						{Array.from({ length: count }).map((_, idx) => (
							<div
								key={idx}
								className='relative flex items-center justify-center w-11 h-11 bg-white rounded-2xl shadow-sm border border-emerald-100 transform hover:scale-110 transition-transform'>
								<span className='text-2xl'>{emoji}</span>
								{isSolution && (
									<span className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow'>
										{idx + 1}
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			);
		}

		case 'scale-balance': {
			const qText = data.questionText || data.question || '';
			const qLower = qText.toLowerCase();

			let leftEmoji = data.leftEmoji;
			let rightEmoji = data.rightEmoji;
			let leftLabel = data.leftLabel;
			let rightLabel = data.rightLabel;

			if (!leftEmoji) {
				if (qLower.includes('car')) leftEmoji = '🚗';
				else if (qLower.includes('apple')) leftEmoji = '🍎';
				else if (qLower.includes('ball')) leftEmoji = '⚽';
				else if (qLower.includes('book')) leftEmoji = '📚';
				else if (qLower.includes('coin')) leftEmoji = '🪙';
				else if (qLower.includes('star')) leftEmoji = '⭐';
				else leftEmoji = '🚗';
			}

			if (!rightEmoji) {
				if (qLower.includes('block') || qLower.includes('brick'))
					rightEmoji = '🧱';
				else if (qLower.includes('cube')) rightEmoji = '🧊';
				else if (qLower.includes('marble')) rightEmoji = '⚪';
				else if (qLower.includes('weight')) rightEmoji = '⚖️';
				else rightEmoji = '🧱';
			}

			if (!leftLabel && qText) {
				const carMatch = qText.match(
					/(\d+)\s*(?:identical\s*)?(?:toy\s*)?car/i,
				);
				if (carMatch) {
					leftLabel = `${carMatch[1]} Car${parseInt(carMatch[1], 10) > 1 ? 's' : ''}`;
				} else {
					leftLabel = '1 Toy Car';
				}
			}

			if (!rightLabel && qText) {
				if (data.correctAnswerText || data.correctAnswer) {
					rightLabel = String(data.correctAnswerText || data.correctAnswer);
				} else {
					const blockMatch = qText.match(/(\d+)\s*(?:wooden\s*)?block/i);
					if (blockMatch) rightLabel = `${blockMatch[1]} Blocks`;
					else rightLabel = 'Blocks';
				}
			}

			const heavySide = data.heavySide || 'balanced';
			const isRightHeavy = heavySide === 'right';
			const isLeftHeavy = heavySide === 'left';
			const isBalanced =
				heavySide === 'balanced' || (!isRightHeavy && !isLeftHeavy);

			const beamY1 =
				isBalanced ? 100
				: isRightHeavy ? 80
				: 120;
			const beamY2 =
				isBalanced ? 100
				: isRightHeavy ? 120
				: 80;

			const leftPanY =
				isBalanced ? 122
				: isRightHeavy ? 102
				: 142;
			const rightPanY =
				isBalanced ? 122
				: isRightHeavy ? 142
				: 102;

			return (
				<div className='flex flex-col items-center justify-center p-3 sm:p-4 my-2 bg-gradient-to-br from-indigo-50/80 via-sky-50/70 to-purple-50/80 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-xl w-full animate-in fade-in duration-300'>
					<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-indigo-800 tracking-wider mb-2 bg-indigo-100 px-3 py-0.5 rounded-full border border-indigo-300'>
						<Scale className='w-3.5 h-3.5 text-indigo-600' />
						<span>Balance Scale Reasoning</span>
					</div>

					<svg
						viewBox='0 0 280 160'
						className='w-64 sm:w-72 h-36 drop-shadow-sm'>
						{/* Fulcrum base */}
						<polygon
							points='140,105 120,150 160,150'
							fill='#475569'
							stroke='#334155'
							strokeWidth='1.5'
						/>
						<circle
							cx='140'
							cy='105'
							r='5'
							fill='#0EA5E9'
						/>

						{/* Scale Beam */}
						<line
							x1='30'
							y1={beamY1}
							x2='250'
							y2={beamY2}
							stroke='#1E293B'
							strokeWidth='5'
							strokeLinecap='round'
						/>

						{/* Left Hanging Strings */}
						<line
							x1='50'
							y1={beamY1 + 2}
							x2='35'
							y2={leftPanY}
							stroke='#94A3B8'
							strokeWidth='1.5'
						/>
						<line
							x1='50'
							y1={beamY1 + 2}
							x2='65'
							y2={leftPanY}
							stroke='#94A3B8'
							strokeWidth='1.5'
						/>

						{/* Left Pan */}
						<path
							d={`M 25 ${leftPanY} Q 50 ${leftPanY + 12} 75 ${leftPanY}`}
							fill='none'
							stroke='#334155'
							strokeWidth='3.5'
							strokeLinecap='round'
						/>
						<text
							x='50'
							y={leftPanY - 5}
							fontSize='22'
							textAnchor='middle'>
							{leftEmoji}
						</text>
						<text
							x='50'
							y={leftPanY + 22}
							fontSize='10'
							fontWeight='900'
							fill='#1E293B'
							textAnchor='middle'>
							{leftLabel || 'Left Pan'}
						</text>

						{/* Right Hanging Strings */}
						<line
							x1='230'
							y1={beamY2 + 2}
							x2='215'
							y2={rightPanY}
							stroke='#94A3B8'
							strokeWidth='1.5'
						/>
						<line
							x1='230'
							y1={beamY2 + 2}
							x2='245'
							y2={rightPanY}
							stroke='#94A3B8'
							strokeWidth='1.5'
						/>

						{/* Right Pan */}
						<path
							d={`M 205 ${rightPanY} Q 230 ${rightPanY + 12} 255 ${rightPanY}`}
							fill='none'
							stroke='#334155'
							strokeWidth='3.5'
							strokeLinecap='round'
						/>
						<text
							x='230'
							y={rightPanY - 5}
							fontSize='22'
							textAnchor='middle'>
							{isSolution ? rightEmoji : '❓'}
						</text>
						<text
							x='230'
							y={rightPanY + 22}
							fontSize='10'
							fontWeight='900'
							fill={isSolution ? '#059669' : '#6366F1'}
							textAnchor='middle'>
							{isSolution ? rightLabel || '3 Blocks' : 'How many blocks?'}
						</text>

						{/* Center Balance Indicator */}
						{isBalanced && (
							<g>
								<rect
									x='105'
									y='68'
									width='70'
									height='18'
									rx='9'
									fill='#ECFDF5'
									stroke='#10B981'
									strokeWidth='1.2'
								/>
								<text
									x='140'
									y='81'
									fontSize='9'
									fontWeight='900'
									fill='#047857'
									textAnchor='middle'>
									⚖️ BALANCED
								</text>
							</g>
						)}
					</svg>
				</div>
			);
		}

		default:
			return null;
	}
});

export default VisualDiagram;
