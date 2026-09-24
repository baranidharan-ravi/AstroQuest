import {
	Check,
	Lock,
	RotateCcw,
	Shirt,
	Sparkles,
	Star,
	X,
	Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	PET_ACCESSORIES,
	PET_PROFILES,
	PET_WARDROBE_STORAGE_KEY,
} from '../../constants';
import { playButtonPop, playCorrectSound } from '../../utils/audioSynthesis';
import SkillIcon from '../../utils/SkillIcon';
import { getTotalOdysseyStars } from '../dashboard/GalaxyOdysseyModal';
import { LivingPetCharacter } from './LivingPetCharacter';

export { PET_ACCESSORIES, PET_WARDROBE_STORAGE_KEY };

/**
 * Retrieve saved wardrobe state from localStorage
 */
export function getStoredWardrobeState() {
	try {
		if (typeof localStorage !== 'undefined') {
			const raw = localStorage.getItem(PET_WARDROBE_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				return {
					equipped: {
						visor: parsed?.equipped?.visor || 'none',
						suit: parsed?.equipped?.suit || 'standard',
						trail: parsed?.equipped?.trail || 'none',
					},
					unlocked:
						Array.isArray(parsed?.unlocked) ? parsed.unlocked
						: ['none', 'standard'],
				};
			}
		}
	} catch (_) {
		// Fallback to default
	}
	return {
		equipped: { visor: 'none', suit: 'standard', trail: 'none' },
		unlocked: ['none', 'standard'],
	};
}

/**
 * Save wardrobe state to localStorage and dispatch custom event for instant multi-tab/component sync
 */
export function saveStoredWardrobeState(state) {
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(PET_WARDROBE_STORAGE_KEY, JSON.stringify(state));
		}
		if (
			typeof window !== 'undefined' &&
			typeof window.dispatchEvent === 'function' &&
			typeof CustomEvent !== 'undefined'
		) {
			window.dispatchEvent(
				new CustomEvent('astroquest_wardrobe_update', { detail: state }),
			);
		}
	} catch (_) {
		// Ignore storage errors
	}
}

/**
 * PetWardrobeModal
 *
 * Allows young explorers to dress up their companion pets (Robot, Cat, Dog, Alien)
 * with futuristic visors, armored spacesuits, and sparkling jetpack trails
 * unlocked through quest stars and cosmic milestones.
 */
const PetWardrobeModal = memo(function PetWardrobeModal({
	isOpen,
	onClose,
	activePet = 'dog',
	onSelectPet,
	soundEnabled = true,
	kidName = 'Explorer',
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);

	const [activeCategory, setActiveCategory] = useState('visor'); // 'visor' | 'suit' | 'trail'
	const [wardrobeState, setWardrobeState] = useState(getStoredWardrobeState);
	const [previewPet, setPreviewPet] = useState(activePet);
	const [livingState, setLivingState] = useState('idle');
	const [totalStars, setTotalStars] = useState(getTotalOdysseyStars);

	// Sync when opened or externally updated
	useEffect(() => {
		if (isOpen) {
			setWardrobeState(getStoredWardrobeState());
			setPreviewPet(activePet);
			setTotalStars(getTotalOdysseyStars());
		}
	}, [isOpen, activePet]);

	// Listen for wardrobe updates across components
	useEffect(() => {
		const handleWardrobeUpdate = (e) => {
			if (e?.detail) {
				setWardrobeState(e.detail);
			}
		};
		window.addEventListener('astroquest_wardrobe_update', handleWardrobeUpdate);
		return () => {
			window.removeEventListener(
				'astroquest_wardrobe_update',
				handleWardrobeUpdate,
			);
		};
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

	// Current active profile
	const currentProfile = useMemo(() => {
		return PET_PROFILES[previewPet] || PET_PROFILES.dog;
	}, [previewPet]);

	// Equip or unlock item
	const handleSelectAccessory = useCallback(
		(category, item) => {
			playButtonPop(soundEnabled);

			const isUnlocked =
				item.starsCost === 0 ||
				wardrobeState.unlocked.includes(item.id) ||
				totalStars >= item.starsCost;

			if (!isUnlocked) {
				return;
			}

			// Add to unlocked list if not already there
			const nextUnlocked =
				wardrobeState.unlocked.includes(item.id) ?
					wardrobeState.unlocked
				:	[...wardrobeState.unlocked, item.id];

			const nextEquipped = {
				...wardrobeState.equipped,
				[category]: item.id,
			};

			const nextState = {
				equipped: nextEquipped,
				unlocked: nextUnlocked,
			};

			setWardrobeState(nextState);
			saveStoredWardrobeState(nextState);

			// Trigger happy celebratory hop
			setLivingState('celebrating');
			playCorrectSound(soundEnabled);
			setTimeout(() => {
				setLivingState('idle');
			}, 900);
		},
		[wardrobeState, totalStars, soundEnabled],
	);

	// Switch companion pet
	const handleSwitchPet = useCallback(
		(petId) => {
			playButtonPop(soundEnabled);
			setPreviewPet(petId);
			if (onSelectPet) {
				onSelectPet(petId);
			}
		},
		[onSelectPet, soundEnabled],
	);

	if (!isOpen) return null;

	const itemsList = PET_ACCESSORIES[activeCategory] || [];

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='pet-wardrobe-title'
			className='fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none'>
			<div
				ref={modalRef}
				className='relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#161B48] via-[#0E1236] to-[#080B22] border-2 border-cyan-400/70 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden text-white'>
				{/* Top Modal Header */}
				<div className='flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/15 bg-white/5'>
					<div className='flex items-center gap-2.5 sm:gap-3 min-w-0'>
						<div className='w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner shrink-0'>
							<Sparkles className='w-5 h-5 text-cyan-300' />
						</div>
						<div className='min-w-0'>
							<h2
								id='pet-wardrobe-title'
								className='text-base sm:text-lg font-black text-white tracking-wide truncate flex items-center gap-2'>
								<span>Cosmo Pet Wardrobe</span>
								<span className='text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'>
									{currentProfile.name}
								</span>
							</h2>
							<p className='text-[11px] sm:text-xs text-slate-300 font-semibold truncate'>
								Equip futuristic visors, flight suits, and jetpack trails!
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
							aria-label='Close Pet Wardrobe'
							className='w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer'>
							<X className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Companion Pet Quick-Switcher Tabs */}
				<div className='flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-black/25 border-b border-white/10 overflow-x-auto no-scrollbar'>
					<span className='text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0'>
						Companion:
					</span>
					{Object.values(PET_PROFILES).map((pet) => {
						const isSelected = pet.id === previewPet;
						return (
							<button
								key={pet.id}
								type='button'
								onClick={() => handleSwitchPet(pet.id)}
								className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-black transition-all cursor-pointer shrink-0 ${
									isSelected ?
										`bg-gradient-to-r ${pet.themeColor} text-slate-950 ${pet.borderColor} shadow-md scale-105`
									:	'bg-white/5 hover:bg-white/10 border-white/15 text-slate-300 hover:text-white'
								}`}>
								<span>{pet.emoji}</span>
								<span>{pet.name.split(' ')[0]}</span>
							</button>
						);
					})}
				</div>

				{/* Main Split Grid: Left = Interactive Pet Preview; Right = Wardrobe Catalog */}
				<div className='flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden'>
					{/* Left Column: Live Pet Character Fitting Stage */}
					<div className='md:col-span-5 flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#11163E]/80 to-[#0A0D26]/90 border-b md:border-b-0 md:border-r border-white/10 relative'>
						{/* Ambient Glow Backdrop */}
						<div
							className='absolute w-44 h-44 rounded-full blur-3xl pointer-events-none'
							style={{ backgroundColor: currentProfile.glowColor }}
						/>

						{/* Character Fitting Stage */}
						<div className='relative z-10 flex flex-col items-center justify-center'>
							<div className='mb-2 transform transition-transform hover:scale-105'>
								<LivingPetCharacter
									petType={previewPet}
									livingState={livingState}
									size={168}
									accessories={wardrobeState.equipped}
									aura={totalStars >= 50 ? 'cosmic' : 'gold'}
								/>
							</div>

							{/* Active Outfit Badges Summary */}
							<div className='w-full mt-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col gap-1'>
								<span className='text-[10px] font-black uppercase tracking-wider text-cyan-300'>
									Equipped Gear Telemetry
								</span>
								<div className='flex items-center justify-center gap-2 flex-wrap text-[11px] font-bold text-slate-300'>
									<span className='px-2 py-0.5 rounded-md bg-white/10'>
										🥽{' '}
										{PET_ACCESSORIES.visor.find(
											(v) => v.id === wardrobeState.equipped.visor,
										)?.name || 'Default'}
									</span>
									<span className='px-2 py-0.5 rounded-md bg-white/10'>
										🥋{' '}
										{PET_ACCESSORIES.suit.find(
											(s) => s.id === wardrobeState.equipped.suit,
										)?.name || 'Default'}
									</span>
									<span className='px-2 py-0.5 rounded-md bg-white/10'>
										✨{' '}
										{PET_ACCESSORIES.trail.find(
											(t) => t.id === wardrobeState.equipped.trail,
										)?.name || 'None'}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Wardrobe Accessory Selector */}
					<div className='md:col-span-7 flex flex-col min-h-0 bg-[#0C1033]/60'>
						{/* Wardrobe Category Tabs */}
						<div className='grid grid-cols-3 p-2.5 gap-2 border-b border-white/10 bg-white/5'>
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setActiveCategory('visor');
								}}
								className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
									activeCategory === 'visor' ?
										'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
									:	'bg-white/5 hover:bg-white/10 text-slate-300'
								}`}>
								<span>🥽</span>
								<span>Visors</span>
							</button>

							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setActiveCategory('suit');
								}}
								className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
									activeCategory === 'suit' ?
										'bg-pink-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
									:	'bg-white/5 hover:bg-white/10 text-slate-300'
								}`}>
								<span>🥋</span>
								<span>Spacesuits</span>
							</button>

							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setActiveCategory('trail');
								}}
								className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
									activeCategory === 'trail' ?
										'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
									:	'bg-white/5 hover:bg-white/10 text-slate-300'
								}`}>
								<span>✨</span>
								<span>Jetpack Trails</span>
							</button>
						</div>

						{/* Catalog Cards Grid */}
						<div className='flex-1 p-3 sm:p-4 overflow-y-auto space-y-2.5'>
							{itemsList.map((item) => {
								const isEquipped =
									wardrobeState.equipped[activeCategory] === item.id;
								const isUnlocked =
									item.starsCost === 0 ||
									wardrobeState.unlocked.includes(item.id) ||
									totalStars >= item.starsCost;
								const canUnlockNow =
									!isUnlocked && totalStars >= item.starsCost;

								return (
									<div
										key={item.id}
										className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
											isEquipped ?
												'bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-purple-900/40 border-cyan-400 ring-2 ring-cyan-400/30'
											: isUnlocked ?
												'bg-white/5 hover:bg-white/10 border-white/15'
											:	'bg-black/40 border-white/5 opacity-80'
										}`}>
										{/* Item Info */}
										<div className='flex items-center gap-3 min-w-0'>
											<div
												className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${
													isEquipped ?
														'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
													: isUnlocked ?
														'bg-white/10 border-white/20 text-slate-200'
													:	'bg-slate-900 border-white/10 text-slate-500'
												}`}>
												<SkillIcon
													icon={item.icon}
													className='w-5 h-5'
												/>
											</div>

											<div className='min-w-0'>
												<div className='flex items-center gap-1.5 flex-wrap'>
													<h4 className='text-xs sm:text-sm font-black text-white truncate'>
														{item.name}
													</h4>
													<span className='px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10'>
														{item.badge}
													</span>
												</div>
												<p className='text-[11px] text-slate-300 font-medium leading-snug line-clamp-1'>
													{item.description}
												</p>
												<span className='text-[10px] text-cyan-300 font-semibold'>
													{item.tagline}
												</span>
											</div>
										</div>

										{/* Action / Equip Button */}
										<div className='shrink-0'>
											{isEquipped ?
												<div className='px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-black text-xs flex items-center gap-1.5'>
													<Check className='w-3.5 h-3.5 stroke-[3]' />
													<span>Equipped</span>
												</div>
											: isUnlocked ?
												<button
													type='button'
													onClick={() =>
														handleSelectAccessory(activeCategory, item)
													}
													className='px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer'>
													Equip
												</button>
											: canUnlockNow ?
												<button
													type='button'
													onClick={() =>
														handleSelectAccessory(activeCategory, item)
													}
													className='px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1'>
													<Star className='w-3 h-3 fill-slate-950' />
													<span>Unlock ({item.starsCost}⭐)</span>
												</button>
											:	<div className='px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 font-bold text-[11px] flex items-center gap-1.5'>
													<Lock className='w-3 h-3 text-slate-400' />
													<span>Needs {item.starsCost}⭐</span>
												</div>
											}
										</div>
									</div>
								);
							})}
						</div>

						{/* Bottom Encouragement Note */}
						<div className='px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-slate-300'>
							<span>Complete Quests & Time Warp challenges to earn stars!</span>
							<span className='font-bold text-cyan-300'>
								AstroQuest Fashion Studio 🚀
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default PetWardrobeModal;
