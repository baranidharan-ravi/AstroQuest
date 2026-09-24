import {
	Activity,
	CheckCircle2,
	Compass,
	Cpu,
	Globe,
	Hammer,
	Layers,
	Lock,
	Rocket,
	ShieldAlert,
	Sparkles,
	Star,
	Wrench,
	X,
	Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HABITAT_MODULES, HABITAT_STORAGE_KEY } from '../../constants';
import { playButtonPop, playCorrectSound } from '../../utils/audioSynthesis';
import SkillIcon from '../../utils/SkillIcon';
import { getTotalOdysseyStars } from './GalaxyOdysseyModal';

export { HABITAT_MODULES, HABITAT_STORAGE_KEY };

/**
 * Retrieve unlocked module IDs from localStorage
 */
export function getStoredHabitatModules() {
	try {
		if (typeof localStorage !== 'undefined') {
			const raw = localStorage.getItem(HABITAT_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed) && parsed.length > 0) {
					return parsed;
				}
			}
		}
	} catch (_) {
		// Ignore storage errors
	}
	return ['hydroponic_dome']; // Starter colony module always deployed
}

/**
 * Save unlocked module IDs to localStorage and broadcast event
 */
export function saveStoredHabitatModules(modules) {
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(HABITAT_STORAGE_KEY, JSON.stringify(modules));
		}
		if (
			typeof window !== 'undefined' &&
			typeof window.dispatchEvent === 'function' &&
			typeof CustomEvent !== 'undefined'
		) {
			window.dispatchEvent(
				new CustomEvent('astroquest_habitat_update', { detail: modules }),
			);
		}
	} catch (_) {
		// Ignore storage errors
	}
}

/**
 * CosmicHabitatModal
 *
 * Interactive modular space base colony builder where young astronauts
 * spend quest stars to construct life-support domes, solar arrays,
 * comm dishes, rover hangars, and interstellar warp pads.
 */
const CosmicHabitatModal = memo(function CosmicHabitatModal({
	isOpen,
	onClose,
	soundEnabled = true,
	kidName = 'Explorer',
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);

	const [unlockedModules, setUnlockedModules] = useState(
		getStoredHabitatModules,
	);
	const [selectedModuleId, setSelectedModuleId] =
		useState('hydroponic_dome');
	const [totalStars, setTotalStars] = useState(getTotalOdysseyStars);
	const [actionMessage, setActionMessage] = useState(null);

	// Sync when opened
	useEffect(() => {
		if (isOpen) {
			setUnlockedModules(getStoredHabitatModules());
			setTotalStars(getTotalOdysseyStars());
			setSelectedModuleId('hydroponic_dome');
			setActionMessage(null);
		}
	}, [isOpen]);

	// Listen for updates across components
	useEffect(() => {
		const handleUpdate = (e) => {
			if (Array.isArray(e?.detail)) {
				setUnlockedModules(e.detail);
			}
		};
		window.addEventListener('astroquest_habitat_update', handleUpdate);
		return () =>
			window.removeEventListener('astroquest_habitat_update', handleUpdate);
	}, []);

	// Keyboard accessibility: Escape to close and focus trap
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

	// Active selected module object
	const activeModule = useMemo(() => {
		return (
			HABITAT_MODULES.find((m) => m.id === selectedModuleId) ||
			HABITAT_MODULES[0]
		);
	}, [selectedModuleId]);

	// Colony Telemetry Aggregations
	const colonyStats = useMemo(() => {
		let totalOxygen = 0;
		let totalPower = 0;
		let totalResearch = 0;
		let totalExplorers = 0;

		HABITAT_MODULES.forEach((mod) => {
			if (unlockedModules.includes(mod.id)) {
				if (mod.statType === 'oxygen') totalOxygen += mod.statValue;
				if (mod.statType === 'power') totalPower += mod.statValue;
				if (mod.statType === 'research') totalResearch += mod.statValue;
				if (mod.statType === 'exploration') totalExplorers += mod.statValue;
			}
		});

		const colonyLevel = Math.max(
			1,
			Math.floor(unlockedModules.length * 1.25),
		);
		return {
			oxygen: totalOxygen,
			power: totalPower,
			research: totalResearch,
			explorers: totalExplorers,
			level: colonyLevel,
			builtCount: unlockedModules.length,
			totalCount: HABITAT_MODULES.length,
		};
	}, [unlockedModules]);

	// Construct / Deploy a new module
	const handleConstructModule = useCallback(
		(mod) => {
			playButtonPop(soundEnabled);
			if (unlockedModules.includes(mod.id)) return;

			if (totalStars < mod.starsCost) return;

			const next = [...unlockedModules, mod.id];
			setUnlockedModules(next);
			saveStoredHabitatModules(next);
			playCorrectSound(soundEnabled);
			setActionMessage(`🎉 Built ${mod.name}! Base power expanded!`);
			setTimeout(() => setActionMessage(null), 3500);
		},
		[unlockedModules, totalStars, soundEnabled],
	);

	// Interactive Diagnostic action on built module
	const handleRunDiagnostic = useCallback(
		(mod) => {
			playButtonPop(soundEnabled);
			const actions = {
				hydroponic_dome: '🌿 Oxygen vents refreshed! Cosmic berries flourishing!',
				solar_matrix: '⚡ Photovoltaic tracking aligned with solar corona!',
				comm_dish: '📡 Deep space beacon pinged! Telemetry sent to Earth!',
				rover_hangar: '🚜 All-Terrain Rover diagnostics green! Samples analyzed!',
				crystal_vault: '💎 Crystal resonance stable! Starlight fuel at 100%!',
				fusion_core: '⚛️ Magnetic confinement nominal! Colony shield at maximum!',
				ai_command_lab: '🧠 Cosmo AI calculated new stellar flight paths!',
				launch_pad: '🚀 Warp ignition sequence tested! Ready for blastoff!',
			};
			setActionMessage(actions[mod.id] || '✨ Module systems functioning smoothly!');
			setTimeout(() => setActionMessage(null), 3000);
		},
		[soundEnabled],
	);

	if (!isOpen) return null;

	const isSelectedUnlocked = unlockedModules.includes(activeModule.id);
	const canConstructSelected =
		!isSelectedUnlocked && totalStars >= activeModule.starsCost;

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='cosmic-habitat-title'
			className='fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none'>
			<div
				ref={modalRef}
				className='relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-gradient-to-b from-[#141A4E] via-[#0D1238] to-[#070A24] border-2 border-cyan-400/70 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden text-white'>
				{/* Top Modal Header */}
				<div className='flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/15 bg-white/5'>
					<div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
						<div className='w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner shrink-0'>
							<Globe className='w-5 h-5 text-cyan-300 animate-spin-slow' />
						</div>
						<div className='min-w-0'>
							<h2
								id='cosmic-habitat-title'
								className='text-base sm:text-lg font-black text-white tracking-wide truncate flex items-center gap-2'>
								<span>Cosmic Colony Habitat</span>
								<span className='text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'>
									Frontier Level {colonyStats.level}
								</span>
							</h2>
							<p className='text-[11px] sm:text-xs text-slate-300 font-semibold truncate'>
								Construct off-world domes, power matrices & warp gantries with
								quest stars!
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2.5 shrink-0'>
						{/* Star Balance Chip */}
						<div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black shadow-inner'>
							<Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
							<span>{totalStars} Stars</span>
						</div>

						{/* Close Button */}
						<button
							ref={closeBtnRef}
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								onClose();
							}}
							aria-label='Close Cosmic Habitat'
							className='w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer'>
							<X className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Colony Live Telemetry Ribbon */}
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-6 py-2.5 bg-black/35 border-b border-white/10 text-xs font-bold'>
					<div className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'>
						<span className='text-base'>🌿</span>
						<div>
							<div className='text-[10px] text-emerald-400 uppercase tracking-wider font-black'>
								Life Support
							</div>
							<div className='font-black'>{colonyStats.oxygen} O₂ / Sol</div>
						</div>
					</div>

					<div className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300'>
						<span className='text-base'>⚡</span>
						<div>
							<div className='text-[10px] text-amber-400 uppercase tracking-wider font-black'>
								Energy Grid
							</div>
							<div className='font-black'>{colonyStats.power} kW Generated</div>
						</div>
					</div>

					<div className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300'>
						<span className='text-base'>📡</span>
						<div>
							<div className='text-[10px] text-blue-400 uppercase tracking-wider font-black'>
								Science Uplink
							</div>
							<div className='font-black'>
								{colonyStats.research} Bandwidth
							</div>
						</div>
					</div>

					<div className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300'>
						<span className='text-base'>🏰</span>
						<div>
							<div className='text-[10px] text-purple-400 uppercase tracking-wider font-black'>
								Base Modules
							</div>
							<div className='font-black'>
								{colonyStats.builtCount} / {colonyStats.totalCount} Active
							</div>
						</div>
					</div>
				</div>

				{/* Temporary Action Toast Notification */}
				{actionMessage && (
					<div className='px-4 py-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-b border-cyan-400/40 text-center text-xs font-black text-cyan-200 animate-in slide-in-from-top-1'>
						{actionMessage}
					</div>
				)}

				{/* Main Split Body: Left = 2.5D Colony Grid; Right = Module Detail & Operations */}
				<div className='flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden'>
					{/* Left Column: Interactive Colony Base Grid */}
					<div className='lg:col-span-7 p-3 sm:p-5 flex flex-col min-h-0 overflow-y-auto bg-gradient-to-b from-[#0F143D]/60 to-[#090C28]/80 border-b lg:border-b-0 lg:border-r border-white/10'>
						<div className='flex items-center justify-between mb-3'>
							<span className='text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5'>
								<Layers className='w-4 h-4 text-cyan-400' />
								<span>Modular Base Sectors</span>
							</span>
							<span className='text-[11px] font-bold text-cyan-300'>
								Tap a module to inspect & manage
							</span>
						</div>

						{/* 2.5D Modular Colony Base Map */}
						<div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-auto'>
							{HABITAT_MODULES.map((mod) => {
								const isUnlocked = unlockedModules.includes(mod.id);
								const isSelected = mod.id === selectedModuleId;
								const canBuild = !isUnlocked && totalStars >= mod.starsCost;

								return (
									<button
										key={mod.id}
										type='button'
										onClick={() => {
											playButtonPop(soundEnabled);
											setSelectedModuleId(mod.id);
										}}
										className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer relative group ${
											isSelected ?
												`bg-gradient-to-b ${mod.color} ${mod.borderColor} ring-2 ring-white/60 shadow-lg scale-105 z-10`
											: isUnlocked ?
												'bg-white/5 hover:bg-white/15 border-white/20 hover:scale-102'
											:	'bg-black/40 border-white/10 opacity-70 hover:opacity-90'
										}`}>
										{/* Active Status Beacon / Lock Badge */}
										<div className='w-full flex items-center justify-between text-[10px] font-bold mb-1.5'>
											{isUnlocked ?
												<span className='flex items-center gap-1 text-emerald-400 font-black'>
													<span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
													Active
												</span>
											: canBuild ?
												<span className='flex items-center gap-1 text-amber-400 font-black'>
													<Sparkles className='w-3 h-3 text-amber-300' />
													Ready
												</span>
											:	<span className='flex items-center gap-1 text-slate-400'>
													<Lock className='w-3 h-3 text-slate-500' />
													{mod.starsCost}⭐
												</span>
											}
											<span className='text-[9px] uppercase px-1 rounded bg-black/40 text-slate-300 font-extrabold'>
												{mod.category.slice(0, 4)}
											</span>
										</div>

										{/* Module Icon Pod */}
										<div
											className={`w-12 h-12 rounded-2xl flex items-center justify-center my-1.5 shadow-inner transition-transform group-hover:rotate-6 ${
												isUnlocked ?
													'bg-white/15 text-white border border-white/30'
												:	'bg-slate-900/80 text-slate-500 border border-white/5'
											}`}>
											<SkillIcon
												icon={mod.icon}
												className='w-6 h-6'
											/>
										</div>

										{/* Name & Perk */}
										<div className='w-full mt-1 min-w-0'>
											<h4 className='text-xs font-black text-white truncate'>
												{mod.name.replace('Dome', '').replace('Matrix', '')}
											</h4>
											<p className='text-[10px] text-cyan-300 font-bold truncate mt-0.5'>
												{mod.perk}
											</p>
										</div>
									</button>
								);
							})}
						</div>

						{/* Base Foundation Energy Conduits Footer */}
						<div className='mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400'>
							<span className='flex items-center gap-1.5'>
								<Zap className='w-3.5 h-3.5 text-amber-400' />
								<span>Quantum Conduits: Synchronized</span>
							</span>
							<span className='text-cyan-300 font-bold'>
								Commander {kidName}
							</span>
						</div>
					</div>

					{/* Right Column: Module Blueprint, Telemetry & Construction Panel */}
					<div className='lg:col-span-5 flex flex-col min-h-0 bg-[#0A0D26]/90 p-4 sm:p-6 justify-between'>
						<div className='space-y-4'>
							{/* Blueprint Header */}
							<div className='flex items-start justify-between gap-3 pb-3 border-b border-white/10'>
								<div className='flex items-center gap-3'>
									<div
										className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeModule.color} border-2 ${activeModule.borderColor} flex items-center justify-center text-white shadow-xl shrink-0`}>
										<SkillIcon
											icon={activeModule.icon}
											className='w-7 h-7'
										/>
									</div>
									<div className='min-w-0'>
										<div className='flex items-center gap-2'>
											<h3 className='text-base sm:text-lg font-black text-white leading-tight'>
												{activeModule.name}
											</h3>
										</div>
										<span
											className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${activeModule.badgeColor}`}>
											{activeModule.category}
										</span>
									</div>
								</div>

								{isSelectedUnlocked ?
									<div className='px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center gap-1 shrink-0'>
										<CheckCircle2 className='w-4 h-4 text-emerald-400' />
										<span>Online</span>
									</div>
								:	<div className='px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-black flex items-center gap-1 shrink-0'>
										<Lock className='w-3.5 h-3.5 text-slate-400' />
										<span>{activeModule.starsCost}⭐ Cost</span>
									</div>
								}
							</div>

							{/* Lore & Technical Description */}
							<div>
								<h4 className='text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1'>
									Operational Blueprint
								</h4>
								<p className='text-xs sm:text-sm text-slate-200 font-medium leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-3'>
									{activeModule.description}
								</p>
							</div>

							{/* Output Telemetry Card */}
							<div className='p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border border-cyan-400/30 flex items-center justify-between'>
								<div className='flex items-center gap-2.5'>
									<Activity className='w-5 h-5 text-cyan-300' />
									<div>
										<div className='text-[10px] font-bold text-slate-400 uppercase'>
											Colony Benefit
										</div>
										<div className='text-xs font-black text-white'>
											{activeModule.perk}
										</div>
									</div>
								</div>
								<span className='text-xs font-bold text-cyan-300'>
									{activeModule.tagline}
								</span>
							</div>
						</div>

						{/* Bottom Construction / Operational Actions */}
						<div className='mt-6 pt-4 border-t border-white/10'>
							{isSelectedUnlocked ?
								<button
									type='button'
									onClick={() => handleRunDiagnostic(activeModule)}
									className='w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm tracking-wide uppercase shadow-lg hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer'>
									<Cpu className='w-4 h-4' />
									<span>Run System Diagnostic ➔</span>
								</button>
							: canConstructSelected ?
								<button
									type='button'
									onClick={() => handleConstructModule(activeModule)}
									className='w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer'>
									<Hammer className='w-4 h-4 fill-slate-950' />
									<span>
										Construct Module (⭐ {activeModule.starsCost} Stars)
									</span>
								</button>
							:	<div className='p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center flex flex-col items-center gap-1.5'>
									<div className='flex items-center gap-2 text-xs font-black text-slate-300'>
										<Lock className='w-4 h-4 text-amber-400' />
										<span>
											Requires {activeModule.starsCost} Stars to Build
										</span>
									</div>
									<p className='text-[11px] text-slate-400 font-medium'>
										You currently have {totalStars} stars. Complete more quests
										to earn stars!
									</p>
									<div className='w-full bg-slate-950/80 rounded-full h-2 mt-1 overflow-hidden border border-white/10'>
										<div
											className='h-full bg-amber-400 transition-all duration-300'
											style={{
												width: `${Math.min(
													100,
													Math.round((totalStars / activeModule.starsCost) * 100),
												)}%`,
											}}
										/>
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default CosmicHabitatModal;
