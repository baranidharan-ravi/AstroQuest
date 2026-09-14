import { Award, CheckCircle2, Compass, Sparkles, Star, X } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import {
	awardStarCoordinate,
	CONSTELLATIONS,
	getStoredConstellationProgress,
} from '../../data/constellations';
import { playButtonPop, playCorrectSound } from '../../utils/audioSynthesis';
import { awardBadge, awardXP } from '../../utils/badgeManager';

const ConstellationObservatory = memo(function ConstellationObservatory({
	isOpen,
	onClose,
	soundEnabled = true,
}) {
	const [progress, setProgress] = useState(getStoredConstellationProgress);
	const [activeConstellationId, setActiveConstellationId] = useState('orion');
	const [selectedStar, setSelectedStar] = useState(null);
	const [isClaiming, setIsClaiming] = useState(false);

	const activeConstellation = useMemo(() => {
		return (
			CONSTELLATIONS.find((c) => c.id === activeConstellationId) ||
			CONSTELLATIONS[0]
		);
	}, [activeConstellationId]);

	const unlockedCount = progress.unlockedStars[activeConstellationId] || 0;
	const isFullyUnlocked = unlockedCount >= activeConstellation.stars.length;

	// Check if badge should be awarded
	useEffect(() => {
		if (progress.completedConstellations.length > 0) {
			awardBadge('stellar_astronomer');
			awardXP(30);
		}
	}, [progress.completedConstellations.length]);

	// ESC key handler
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleSelectConstellation = (id) => {
		playButtonPop(soundEnabled);
		setActiveConstellationId(id);
		setSelectedStar(null);
	};

	const handleClaimStar = () => {
		playButtonPop(soundEnabled);
		setIsClaiming(true);
		const res = awardStarCoordinate(activeConstellationId);
		setProgress(getStoredConstellationProgress());

		if (res.awarded) {
			playCorrectSound(soundEnabled);
			if (res.isComplete) {
				awardBadge('stellar_astronomer');
				awardXP(50);
			}
		}

		setTimeout(() => setIsClaiming(false), 400);
	};

	// Map star IDs to their star objects for line lookup
	const starMap = new Map(activeConstellation.stars.map((s) => [s.id, s]));

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='observatory-title'
			className='fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none'>
			<div className='relative w-full max-w-5xl max-h-[92vh] bg-gradient-to-b from-[#0B0F2A] via-[#12183A] to-[#080B1E] border-2 border-indigo-500/40 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.25)] flex flex-col overflow-hidden text-white'>
				{/* Header Bar */}
				<div className='flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-white/5 backdrop-blur-sm'>
					<div className='flex items-center gap-2.5'>
						<div className='w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner'>
							🌌
						</div>
						<div>
							<h2
								id='observatory-title'
								className='text-base sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-sky-200 to-teal-200'>
								Stellar Sky Observatory
							</h2>
							<p className='text-[11px] text-slate-300 font-semibold'>
								Connect Celestial Stars • Daily Stargazer Habit Tracker
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<div className='hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-bold text-indigo-300'>
							<Award className='w-3.5 h-3.5 text-amber-300' />
							<span>
								{progress.completedConstellations.length} /{' '}
								{CONSTELLATIONS.length} Completed
							</span>
						</div>

						<button
							type='button'
							onClick={onClose}
							className='p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer'
							title='Close Observatory'>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				{/* Constellation Selector Tabs */}
				<div className='flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-black/40 overflow-x-auto border-b border-white/5 scrollbar-thin'>
					{CONSTELLATIONS.map((c) => {
						const isSelected = c.id === activeConstellationId;
						const isDone = progress.completedConstellations.includes(c.id);
						const curStars = progress.unlockedStars[c.id] || 0;

						return (
							<button
								key={c.id}
								type='button'
								onClick={() => handleSelectConstellation(c.id)}
								className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
									isSelected ?
										'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105'
									:	'bg-white/5 text-slate-300 hover:bg-white/10'
								}`}>
								<span>{c.name.split(' ')[0]}</span>
								{isDone ?
									<CheckCircle2 className='w-3.5 h-3.5 text-teal-300' />
								:	<span className='text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300'>
										{curStars}/{c.stars.length}⭐
									</span>
								}
							</button>
						);
					})}
				</div>

				{/* Main Body: Star Map SVG & Lore Panel */}
				<div className='flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center'>
					{/* Left: Interactive SVG Sky Dome */}
					<div className='lg:col-span-7 flex flex-col items-center justify-center'>
						<div className='w-full aspect-[4/3] max-w-[500px] bg-radial from-[#1E1B4B]/80 via-[#0B0F2A] to-[#050714] border-2 border-indigo-500/30 rounded-3xl p-4 shadow-2xl relative overflow-hidden flex items-center justify-center'>
							{/* Background Starry Dust Pattern */}
							<div
								className='absolute inset-0 opacity-40 pointer-events-none'
								style={{
									backgroundImage:
										'radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 80px 120px, #93C5FD, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 70px, #FDE047, rgba(0,0,0,0)), radial-gradient(2px 2px at 220px 180px, #A78BFA, rgba(0,0,0,0)), radial-gradient(1px 1px at 300px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 380px 150px, #38BDF8, rgba(0,0,0,0))',
									backgroundSize: '400px 300px',
								}}
							/>

							{/* Celestial Coordinates Grid (Normalized 0-100) */}
							<svg
								viewBox='0 0 100 100'
								className='w-full h-full relative z-10 overflow-visible'>
								<defs>
									{/* Glowing line filter */}
									<filter
										id='glowLine'
										x='-20%'
										y='-20%'
										width='140%'
										height='140%'>
										<feGaussianBlur
											stdDeviation='1'
											result='blur'
										/>
										<feMerge>
											<feMergeNode in='blur' />
											<feMergeNode in='SourceGraphic' />
										</feMerge>
									</filter>

									{/* Star pulse filter */}
									<filter
										id='glowStar'
										x='-50%'
										y='-50%'
										width='200%'
										height='200%'>
										<feGaussianBlur
											stdDeviation='1.5'
											result='blur'
										/>
										<feMerge>
											<feMergeNode in='blur' />
											<feMergeNode in='SourceGraphic' />
										</feMerge>
									</filter>
								</defs>

								{/* Connecting Constellation Lines */}
								{activeConstellation.lines.map(([starAId, starBId], idx) => {
									const starA = starMap.get(starAId);
									const starB = starMap.get(starBId);
									if (!starA || !starB) return null;

									const starAIndex = activeConstellation.stars.findIndex(
										(s) => s.id === starAId,
									);
									const starBIndex = activeConstellation.stars.findIndex(
										(s) => s.id === starBId,
									);

									const isUnlocked =
										starAIndex < unlockedCount && starBIndex < unlockedCount;

									return (
										<line
											key={idx}
											x1={starA.x}
											y1={starA.y}
											x2={starB.x}
											y2={starB.y}
											stroke={
												isUnlocked ? activeConstellation.color : '#334155'
											}
											strokeWidth={isUnlocked ? '0.9' : '0.4'}
											strokeDasharray={isUnlocked ? 'none' : '1.5 1.5'}
											opacity={isUnlocked ? 0.85 : 0.25}
											filter={isUnlocked ? 'url(#glowLine)' : undefined}
											className='transition-all duration-700'
										/>
									);
								})}

								{/* Celestial Stars */}
								{activeConstellation.stars.map((star, idx) => {
									const isUnlocked = idx < unlockedCount;
									const isCurrentTarget = idx === unlockedCount;
									const isSelected = selectedStar?.id === star.id;

									return (
										<g
											key={star.id}
											onClick={() => setSelectedStar(star)}
											className='cursor-pointer group'>
											{/* Outer halo when unlocked */}
											{isUnlocked && (
												<circle
													cx={star.x}
													cy={star.y}
													r={star.size * 0.9}
													fill={star.color}
													opacity='0.25'
													className='animate-pulse'
												/>
											)}

											{/* Star Circle */}
											<circle
												cx={star.x}
												cy={star.y}
												r={isUnlocked ? star.size * 0.45 : star.size * 0.3}
												fill={isUnlocked ? star.color : '#475569'}
												filter={isUnlocked ? 'url(#glowStar)' : undefined}
												stroke={
													isSelected ? '#FFFFFF'
													: isCurrentTarget ?
														'#FDE047'
													:	'transparent'
												}
												strokeWidth={
													isSelected || isCurrentTarget ? '0.6' : '0'
												}
												className='transition-all duration-300'
											/>

											{/* Star Label */}
											<text
												x={star.x}
												y={star.y + 4.5}
												textAnchor='middle'
												fontSize='3'
												fontWeight={isUnlocked ? 'bold' : 'normal'}
												fill={
													isUnlocked ? '#F8FAFC'
													: isSelected ?
														'#E2E8F0'
													:	'#64748B'
												}
												className='pointer-events-none select-none font-sans'>
												{star.name.split(' ')[0]}
											</text>
										</g>
									);
								})}
							</svg>
						</div>

						{/* Quick Stargazer Status Pill */}
						<div className='mt-3 flex items-center gap-3 text-xs'>
							<span className='flex items-center gap-1.5 text-slate-300'>
								<span className='w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38BDF8]' />
								<span>Unlocked: {unlockedCount}</span>
							</span>
							<span className='opacity-40'>•</span>
							<span className='flex items-center gap-1.5 text-slate-400'>
								<span className='w-2.5 h-2.5 rounded-full bg-slate-600' />
								<span>
									Locked: {activeConstellation.stars.length - unlockedCount}
								</span>
							</span>
						</div>
					</div>

					{/* Right: Constellation Dossier & Daily Star Button */}
					<div className='lg:col-span-5 flex flex-col gap-4'>
						{/* Title & Lore */}
						<div>
							<div className='flex items-center gap-2'>
								<span className='px-2.5 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-black uppercase text-indigo-300 tracking-wider'>
									{activeConstellation.season} Sky
								</span>
								<span className='text-xs text-slate-400 font-semibold'>
									Latin: {activeConstellation.latinName}
								</span>
							</div>

							<h3 className='text-2xl sm:text-3xl font-black text-white mt-1'>
								{activeConstellation.name}
							</h3>
							<p className='text-xs sm:text-sm text-cyan-200 font-medium italic mt-0.5'>
								"{activeConstellation.tagline}"
							</p>
						</div>

						{/* Mythological Story */}
						<div className='bg-black/30 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-200 leading-relaxed font-medium'>
							<div className='flex items-center gap-1.5 text-indigo-300 font-bold mb-1'>
								<Compass className='w-3.5 h-3.5' />
								<span>Ancient Stargazer Lore</span>
							</div>
							<p>{activeConstellation.story}</p>
						</div>

						{/* Astronomy Factoid */}
						<div className='bg-gradient-to-r from-teal-950/60 to-indigo-950/60 border border-teal-500/30 rounded-2xl p-3.5 text-xs text-slate-200 leading-relaxed font-medium'>
							<div className='flex items-center gap-1.5 text-teal-300 font-bold mb-1'>
								<Sparkles className='w-3.5 h-3.5' />
								<span>Astronomical Science</span>
							</div>
							<p>{activeConstellation.funFact}</p>
						</div>

						{/* Selected Star Details or Unlocked Progress */}
						{selectedStar ?
							<div className='bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-3 text-xs'>
								<div className='font-black text-white flex items-center justify-between'>
									<span>⭐ {selectedStar.name}</span>
									<span className='text-[10px] text-indigo-300 px-2 py-0.5 rounded bg-indigo-900/60'>
										{selectedStar.type}
									</span>
								</div>
							</div>
						:	null}

						{/* Daily Star Mission Action Button */}
						<div className='mt-2'>
							{isFullyUnlocked ?
								<div className='p-3.5 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center gap-3 text-teal-200'>
									<CheckCircle2 className='w-6 h-6 text-teal-300 flex-shrink-0' />
									<div>
										<div className='font-black text-xs sm:text-sm text-white'>
											Constellation Fully Mapped!
										</div>
										<div className='text-[11px] text-teal-300 font-semibold'>
											All stars aligned. Stellar Astronomer badge earned! 🏆
										</div>
									</div>
								</div>
							:	<button
									type='button'
									onClick={handleClaimStar}
									disabled={isClaiming}
									className='w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer'>
									<Star className='w-4 h-4 fill-current' />
									<span>
										{isClaiming ?
											'Mapping Starlight...'
										:	`Unlock Next Star (#${unlockedCount + 1}) ⭐`}
									</span>
								</button>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default ConstellationObservatory;
