import {
	CheckCircle2,
	Clock,
	Gem,
	Minus,
	Plus,
	RefreshCw,
	Rotate3D,
	Scale,
	Sparkles,
	Zap,
} from 'lucide-react';
import { memo, useState } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';

/**
 * Interactive Tactile Manipulative Component.
 * Allows children to physically manipulate balance scales, clock hands, rotatable 3D blocks, and fraction crystals.
 */
const InteractiveManipulative = memo(function InteractiveManipulative({
	type,
	data = {},
	soundEnabled = true,
}) {
	if (!type) return null;

	if (type === 'balance-scale') {
		return (
			<InteractiveBalanceScale
				data={data}
				soundEnabled={soundEnabled}
			/>
		);
	}

	if (type === 'analog-clock') {
		return (
			<InteractiveAnalogClock
				data={data}
				soundEnabled={soundEnabled}
			/>
		);
	}

	if (type === 'block-tower') {
		return (
			<InteractiveRotatableBlockTower
				data={data}
				soundEnabled={soundEnabled}
			/>
		);
	}

	if (type === 'fraction-crystals') {
		return (
			<InteractiveFractionCrystals
				data={data}
				soundEnabled={soundEnabled}
			/>
		);
	}

	return null;
});

/**
 * 1. Interactive Balance Scale with draggable/tappable weights
 */
function InteractiveBalanceScale({ data = {}, soundEnabled = true }) {
	const initialLeft = Number(data.leftWeight || 6);
	const initialRight = Number(data.rightWeight || 4);

	const [leftWeight, setLeftWeight] = useState(initialLeft);
	const [rightWeight, setRightWeight] = useState(initialRight);

	const diff = rightWeight - leftWeight;
	// Max tilt angle: -18 deg to +18 deg
	const tiltAngle = Math.max(-18, Math.min(18, diff * 3));
	const isBalanced = leftWeight === rightWeight;

	const handleAddWeight = (side, amount) => {
		playButtonPop(soundEnabled);
		if (side === 'left') {
			setLeftWeight((prev) => Math.max(0, Math.min(30, prev + amount)));
		} else {
			setRightWeight((prev) => Math.max(0, Math.min(30, prev + amount)));
		}
	};

	const handleReset = () => {
		playButtonPop(soundEnabled);
		setLeftWeight(initialLeft);
		setRightWeight(initialRight);
	};

	return (
		<div className='bg-slate-50 border-2 border-indigo-100 rounded-2xl p-3 flex flex-col items-center gap-2 w-full my-2 shadow-inner'>
			<div className='flex items-center justify-between w-full px-2'>
				<div className='flex items-center gap-1.5 text-xs font-bold text-indigo-900'>
					<Scale className='w-4 h-4 text-indigo-600' />
					<span>Interactive Balance Lab</span>
				</div>
				<button
					type='button'
					onClick={handleReset}
					aria-label='Reset weights to default'
					className='flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 px-2 py-0.5 rounded-md hover:bg-slate-200 transition-colors'>
					<RefreshCw className='w-3 h-3' />
					<span>Reset</span>
				</button>
			</div>

			{/* SVG Balance Scale */}
			<div className='w-full max-w-[280px] h-[120px] relative flex items-center justify-center'>
				<svg
					viewBox='0 0 280 120'
					className='w-full h-full overflow-visible'>
					{/* Fulcrum Base */}
					<polygon
						points='140,55 125,115 155,115'
						fill='#475569'
					/>
					<rect
						x='110'
						y='112'
						width='60'
						height='6'
						rx='3'
						fill='#334155'
					/>

					{/* Tilting Beam & Pans */}
					<g
						transform={`rotate(${tiltAngle}, 140, 55)`}
						className='transition-transform duration-300 ease-out'>
						{/* Main Beam */}
						<line
							x1='35'
							y1='55'
							x2='245'
							y2='55'
							stroke='#1E293B'
							strokeWidth='5'
							strokeLinecap='round'
						/>
						{/* Pivot Dot */}
						<circle
							cx='140'
							cy='55'
							r='5'
							fill='#F59E0B'
						/>

						{/* Left Pan Strings & Tray */}
						<line
							x1='45'
							y1='55'
							x2='30'
							y2='90'
							stroke='#94A3B8'
							strokeWidth='2'
						/>
						<line
							x1='45'
							y1='55'
							x2='60'
							y2='90'
							stroke='#94A3B8'
							strokeWidth='2'
						/>
						<path
							d='M 20,90 Q 45,100 70,90 Z'
							fill='#3B82F6'
						/>
						{/* Left Weight Indicator */}
						<text
							x='45'
							y='85'
							textAnchor='middle'
							fontSize='11'
							fontWeight='900'
							fill='#1E3A8A'>
							{leftWeight}kg
						</text>

						{/* Right Pan Strings & Tray */}
						<line
							x1='235'
							y1='55'
							x2='220'
							y2='90'
							stroke='#94A3B8'
							strokeWidth='2'
						/>
						<line
							x1='235'
							y1='55'
							x2='250'
							y2='90'
							stroke='#94A3B8'
							strokeWidth='2'
						/>
						<path
							d='M 210,90 Q 235,100 260,90 Z'
							fill='#EC4899'
						/>
						{/* Right Weight Indicator */}
						<text
							x='235'
							y='85'
							textAnchor='middle'
							fontSize='11'
							fontWeight='900'
							fill='#831843'>
							{rightWeight}kg
						</text>
					</g>
				</svg>
			</div>

			{/* Status Pill */}
			<div
				className={`text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 ${
					isBalanced ?
						'bg-emerald-100 text-emerald-800 border border-emerald-300'
					:	'bg-amber-100 text-amber-800 border border-amber-300'
				}`}>
				{isBalanced ?
					<>
						<Sparkles className='w-3.5 h-3.5 text-emerald-600' />
						<span>
							Perfect Equilibrium! Both sides are equal ({leftWeight}kg).
						</span>
					</>
				:	<span>
						{leftWeight > rightWeight ?
							`Left side is heavier by ${leftWeight - rightWeight}kg!`
						:	`Right side is heavier by ${rightWeight - leftWeight}kg!`}
					</span>
				}
			</div>

			{/* Interactive Add/Remove Controls */}
			<div className='flex items-center justify-between w-full px-4 text-xs font-bold'>
				<div className='flex items-center gap-1'>
					<span className='text-blue-700 mr-1'>Left:</span>
					<button
						type='button'
						onClick={() => handleAddWeight('left', -1)}
						className='w-6 h-6 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 flex items-center justify-center cursor-pointer'>
						<Minus className='w-3 h-3' />
					</button>
					<button
						type='button'
						onClick={() => handleAddWeight('left', 1)}
						className='w-6 h-6 rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center cursor-pointer'>
						<Plus className='w-3 h-3' />
					</button>
				</div>

				<div className='flex items-center gap-1'>
					<span className='text-pink-700 mr-1'>Right:</span>
					<button
						type='button'
						onClick={() => handleAddWeight('right', -1)}
						className='w-6 h-6 rounded-md bg-pink-100 hover:bg-pink-200 text-pink-800 flex items-center justify-center cursor-pointer'>
						<Minus className='w-3 h-3' />
					</button>
					<button
						type='button'
						onClick={() => handleAddWeight('right', 1)}
						className='w-6 h-6 rounded-md bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center cursor-pointer'>
						<Plus className='w-3 h-3' />
					</button>
				</div>
			</div>
		</div>
	);
}

/**
 * 2. Interactive Analog Clock with adjustable hands
 */
function InteractiveAnalogClock({ data = {}, soundEnabled = true }) {
	const initialHour = Number(data.hour || 3);
	const initialMinute = Number(data.minute || 0);

	const [hour, setHour] = useState(initialHour);
	const [minute, setMinute] = useState(initialMinute);

	const minuteAngle = minute * 6; // 360 / 60
	const hourAngle = (hour % 12) * 30 + minute * 0.5;

	const handleAdvanceMinutes = (mins) => {
		playButtonPop(soundEnabled);
		let nextMin = minute + mins;
		let nextHour = hour;
		while (nextMin >= 60) {
			nextMin -= 60;
			nextHour = (nextHour + 1) % 12 || 12;
		}
		while (nextMin < 0) {
			nextMin += 60;
			nextHour = nextHour - 1 || 12;
		}
		setMinute(nextMin);
		setHour(nextHour);
	};

	const formattedTime = `${hour}:${minute < 10 ? '0' + minute : minute}`;

	return (
		<div className='bg-slate-50 border-2 border-indigo-100 rounded-2xl p-3 flex flex-col items-center gap-2 w-full my-2 shadow-inner'>
			<div className='flex items-center justify-between w-full px-2'>
				<div className='flex items-center gap-1.5 text-xs font-bold text-indigo-900'>
					<Clock className='w-4 h-4 text-indigo-600' />
					<span>Interactive Clock Hands</span>
				</div>
				<div className='text-xs font-black bg-indigo-900 text-white px-2 py-0.5 rounded-md'>
					{formattedTime}
				</div>
			</div>

			{/* SVG Clock Face */}
			<div className='w-[130px] h-[130px] relative flex items-center justify-center'>
				<svg
					viewBox='0 0 140 140'
					className='w-full h-full'>
					{/* Outer Rim */}
					<circle
						cx='70'
						cy='70'
						r='64'
						fill='#FFFFFF'
						stroke='#334155'
						strokeWidth='4'
					/>
					{/* Hour Numbers 12, 3, 6, 9 */}
					<text
						x='70'
						y='24'
						textAnchor='middle'
						fontSize='12'
						fontWeight='900'
						fill='#1E293B'>
						12
					</text>
					<text
						x='122'
						y='74'
						textAnchor='middle'
						fontSize='12'
						fontWeight='900'
						fill='#1E293B'>
						3
					</text>
					<text
						x='70'
						y='124'
						textAnchor='middle'
						fontSize='12'
						fontWeight='900'
						fill='#1E293B'>
						6
					</text>
					<text
						x='18'
						y='74'
						textAnchor='middle'
						fontSize='12'
						fontWeight='900'
						fill='#1E293B'>
						9
					</text>

					{/* Hour Hand (Thick, Purple) */}
					<line
						x1='70'
						y1='70'
						x2='70'
						y2='38'
						stroke='#7C3AED'
						strokeWidth='4.5'
						strokeLinecap='round'
						transform={`rotate(${hourAngle}, 70, 70)`}
					/>

					{/* Minute Hand (Long, Cyan) */}
					<line
						x1='70'
						y1='70'
						x2='70'
						y2='22'
						stroke='#0284C7'
						strokeWidth='3'
						strokeLinecap='round'
						transform={`rotate(${minuteAngle}, 70, 70)`}
					/>

					{/* Center Pin */}
					<circle
						cx='70'
						cy='70'
						r='4'
						fill='#F59E0B'
					/>
				</svg>
			</div>

			{/* Interactive Time Controls */}
			<div className='flex items-center gap-1.5'>
				<button
					type='button'
					onClick={() => handleAdvanceMinutes(-15)}
					className='text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded cursor-pointer'>
					-15m
				</button>
				<button
					type='button'
					onClick={() => handleAdvanceMinutes(15)}
					className='text-[10px] font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-2 py-1 rounded cursor-pointer'>
					+15m
				</button>
				<button
					type='button'
					onClick={() => handleAdvanceMinutes(60)}
					className='text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded cursor-pointer'>
					+1 Hour
				</button>
			</div>
		</div>
	);
}

/**
 * 3. Interactive Rotatable 3D Isometric Block Tower
 */
function InteractiveRotatableBlockTower({ data = {}, soundEnabled = true }) {
	const [perspectiveAngle, setPerspectiveAngle] = useState(0); // -45, 0, 45
	const totalCubes = data.totalCubes || 5;

	const handleRotate = (deg) => {
		playButtonPop(soundEnabled);
		setPerspectiveAngle(deg);
	};

	return (
		<div className='bg-slate-50 border-2 border-indigo-100 rounded-2xl p-3 flex flex-col items-center gap-2 w-full my-2 shadow-inner'>
			<div className='flex items-center justify-between w-full px-2'>
				<div className='flex items-center gap-1.5 text-xs font-bold text-indigo-900'>
					<Rotate3D className='w-4 h-4 text-indigo-600' />
					<span>Rotatable 3D Perspective</span>
				</div>
				<span className='text-[11px] font-black text-slate-500'>
					Total: {totalCubes} Cubes
				</span>
			</div>

			{/* 3D Cube Canvas with CSS perspective rotation */}
			<div className='w-[140px] h-[100px] flex items-center justify-center perspective-[500px]'>
				<div
					style={{
						transform: `rotateY(${perspectiveAngle}deg)`,
						transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
						transformStyle: 'preserve-3d',
					}}
					className='flex flex-col items-center justify-center'>
					{/* Front Rendered Cube Stack */}
					<div className='relative w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg shadow-xl border-2 border-white flex items-center justify-center text-white font-black text-xs'>
						Front
					</div>
					{perspectiveAngle !== 0 && (
						<div className='text-[10px] font-black text-purple-700 mt-1 animate-pulse'>
							👀 Hidden blocks revealed!
						</div>
					)}
				</div>
			</div>

			{/* Angle Selector Buttons */}
			<div className='flex items-center gap-1.5'>
				<button
					type='button'
					onClick={() => handleRotate(-35)}
					className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors ${
						perspectiveAngle === -35 ?
							'bg-indigo-600 text-white'
						:	'bg-slate-200 text-slate-700 hover:bg-slate-300'
					}`}>
					Left View
				</button>
				<button
					type='button'
					onClick={() => handleRotate(0)}
					className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors ${
						perspectiveAngle === 0 ?
							'bg-indigo-600 text-white'
						:	'bg-slate-200 text-slate-700 hover:bg-slate-300'
					}`}>
					Center
				</button>
				<button
					type='button'
					onClick={() => handleRotate(35)}
					className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors ${
						perspectiveAngle === 35 ?
							'bg-indigo-600 text-white'
						:	'bg-slate-200 text-slate-700 hover:bg-slate-300'
					}`}>
					Right View
				</button>
			</div>
		</div>
	);
}

/**
 * 4. Interactive Fraction Energy Crystal with sliceable glowing sectors
 */
function InteractiveFractionCrystals({ data = {}, soundEnabled = true }) {
	const initialDenominator = Number(data.denominator || 4);
	const initialActiveCount = Number(data.activeCount || 1);
	const targetFraction = data.targetFraction || '3/4';

	const [denominator, setDenominator] = useState(initialDenominator);
	const [activeSlices, setActiveSlices] = useState(() => {
		const set = new Set();
		for (let i = 0; i < Math.min(initialActiveCount, initialDenominator); i++) {
			set.add(i);
		}
		return set;
	});

	const activeCount = activeSlices.size;
	const percentage = Math.round((activeCount / denominator) * 100);

	// Parse target
	const [targetNum, targetDen] = targetFraction
		.split('/')
		.map((n) => parseInt(n.trim(), 10));
	const isTargetMatched =
		targetNum !== undefined &&
		targetDen !== undefined &&
		activeCount === targetNum &&
		denominator === targetDen;

	const handleToggleSlice = (index) => {
		playButtonPop(soundEnabled);
		setActiveSlices((prev) => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	};

	const handleChangeDenominator = (newDen) => {
		playButtonPop(soundEnabled);
		setDenominator(newDen);
		setActiveSlices(new Set());
	};

	const handleReset = () => {
		playButtonPop(soundEnabled);
		setActiveSlices(new Set());
	};

	const handleFillAll = () => {
		playButtonPop(soundEnabled);
		const all = new Set();
		for (let i = 0; i < denominator; i++) all.add(i);
		setActiveSlices(all);
	};

	// SVG Pie Slice generator helper
	const radius = 64;
	const cx = 80;
	const cy = 80;

	const renderSlices = () => {
		const anglePerSlice = 360 / denominator;
		const slices = [];

		for (let i = 0; i < denominator; i++) {
			const startAngle = i * anglePerSlice - 90;
			const endAngle = (i + 1) * anglePerSlice - 90;
			const rad = Math.PI / 180;

			const x1 = cx + radius * Math.cos(startAngle * rad);
			const y1 = cy + radius * Math.sin(startAngle * rad);
			const x2 = cx + radius * Math.cos(endAngle * rad);
			const y2 = cy + radius * Math.sin(endAngle * rad);

			const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
			const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
			const isActive = activeSlices.has(i);

			slices.push(
				<path
					key={i}
					d={pathData}
					onClick={() => handleToggleSlice(i)}
					aria-label={`Crystal sector ${i + 1} of ${denominator}, ${isActive ? 'Active' : 'Empty'}`}
					className={`cursor-pointer transition-all duration-200 ${
						isActive ?
							'fill-cyan-400 hover:fill-cyan-300 stroke-cyan-100 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
						:	'fill-slate-700/60 hover:fill-slate-600/80 stroke-slate-500'
					}`}
					strokeWidth='1.5'
				/>,
			);
		}
		return slices;
	};

	return (
		<div className='bg-slate-900/90 text-white border-2 border-cyan-500/40 rounded-2xl p-3 flex flex-col items-center gap-2.5 w-full my-2 shadow-xl'>
			{/* Top Header */}
			<div className='flex items-center justify-between w-full px-1'>
				<div className='flex items-center gap-1.5 text-xs font-black text-cyan-300'>
					<Gem className='w-4 h-4 text-cyan-400' />
					<span>Fraction Energy Crystal</span>
				</div>
				<div className='flex items-center gap-1.5'>
					<button
						type='button'
						onClick={handleReset}
						className='text-[10px] font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1'>
						<RefreshCw className='w-2.5 h-2.5' />
						<span>Clear</span>
					</button>
					<button
						type='button'
						onClick={handleFillAll}
						className='text-[10px] font-bold text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 transition-all cursor-pointer flex items-center gap-1'>
						<Sparkles className='w-2.5 h-2.5' />
						<span>Full</span>
					</button>
				</div>
			</div>

			{/* Main Interactive Stage: SVG Pie + Telemetry */}
			<div className='flex items-center justify-center gap-4 sm:gap-6 w-full py-1'>
				{/* SVG Interactive Crystal */}
				<div className='relative w-[160px] h-[160px] shrink-0 flex items-center justify-center'>
					<svg
						viewBox='0 0 160 160'
						className='w-full h-full overflow-visible select-none'>
						{/* Background glow ring */}
						<circle
							cx={cx}
							cy={cy}
							r={radius + 4}
							fill='none'
							stroke='rgba(6,182,212,0.3)'
							strokeWidth='2'
							strokeDasharray='4 3'
						/>
						{/* Render interactive slices */}
						{renderSlices()}
						{/* Center reactor core */}
						<circle
							cx={cx}
							cy={cy}
							r='16'
							fill='#0f172a'
							stroke='#38bdf8'
							strokeWidth='2'
						/>
						<circle
							cx={cx}
							cy={cy}
							r='7'
							fill='#38bdf8'
							className='animate-pulse'
						/>
					</svg>
				</div>

				{/* Telemetry Readout & Fuel Gauge */}
				<div className='flex flex-col gap-1.5 min-w-[130px]'>
					<span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
						Active Fraction:
					</span>
					<div className='flex items-baseline gap-1'>
						<span className='text-3xl font-black text-cyan-300'>
							{activeCount}
						</span>
						<span className='text-xl font-bold text-slate-400'>/</span>
						<span className='text-2xl font-black text-white'>
							{denominator}
						</span>
					</div>

					{/* Fuel Progress Bar */}
					<div className='w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700 mt-0.5'>
						<div
							className='h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300'
							style={{ width: `${percentage}%` }}
						/>
					</div>
					<span className='text-[10px] font-semibold text-slate-300'>
						Fuel Output: <strong className='text-cyan-300'>{percentage}%</strong>
					</span>

					{/* Target Match Banner */}
					{isTargetMatched ?
						<div className='flex items-center gap-1 text-[11px] font-black text-emerald-300 bg-emerald-950/70 border border-emerald-400/50 px-2 py-0.5 rounded-lg animate-pulse mt-1'>
							<CheckCircle2 className='w-3.5 h-3.5 shrink-0' />
							<span>Target Reached!</span>
						</div>
					: targetFraction ?
						<div className='text-[10px] font-semibold text-amber-300 bg-amber-950/40 border border-amber-400/30 px-2 py-0.5 rounded mt-1'>
							Goal: <strong>{targetFraction}</strong>
						</div>
					:	null}
				</div>
			</div>

			{/* Denominator Selector Chips */}
			<div className='flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10'>
				<span className='text-[10px] font-bold text-slate-400 px-1'>
					Divide:
				</span>
				{[2, 3, 4, 6, 8].map((d) => (
					<button
						key={d}
						type='button'
						onClick={() => handleChangeDenominator(d)}
						className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
							denominator === d ?
								'bg-cyan-500 text-slate-950 shadow-md'
							:	'text-slate-300 hover:text-white hover:bg-white/10'
						}`}>
						1/{d}
					</button>
				))}
			</div>
		</div>
	);
}

export default InteractiveManipulative;
