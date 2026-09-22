import {
	ChevronDown,
	ChevronUp,
	Footprints,
	GripVertical,
	Heart,
	LocateFixed,
	Moon,
	RotateCcw,
	Sparkles,
	Sun,
	Volume2,
	X,
} from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
	PET_PROFILES,
	PET_SIZES,
	STORAGE_MINIMIZED_KEY,
	STORAGE_PET_KEY,
	STORAGE_POS_KEY,
	STORAGE_SIZE_KEY,
	STORAGE_TOOLBAR_COLLAPSED_KEY,
	STORAGE_TOOLBAR_POS_KEY,
} from '../../constants';
import {
	playButtonPop,
	playCatMeow,
	playDogBark,
	playPetSlurp,
	playPetSound,
	playToyBoing,
	speakText,
} from '../../utils/audioSynthesis';
import {
	getStoredPetSize,
	saveStoredPetSize,
} from '../../utils/progressTracker';
import { LivingPetCharacter } from './LivingPetCharacter';

export {
	PET_PROFILES,
	PET_SIZES,
	STORAGE_MINIMIZED_KEY,
	STORAGE_PET_KEY,
	STORAGE_POS_KEY,
	STORAGE_SIZE_KEY,
	STORAGE_TOOLBAR_COLLAPSED_KEY,
	STORAGE_TOOLBAR_POS_KEY,
};

/**
 * Reusable Vertical Toolbar Button with floating hover tooltip
 */
const ToolbarButton = memo(function ToolbarButton({
	onClick,
	label,
	description,
	badge,
	isNearRight = true,
	className = '',
	children,
	ariaLabel,
}) {
	return (
		<div className='relative group flex items-center justify-center'>
			<button
				type='button'
				onClick={onClick}
				aria-label={ariaLabel || label}
				className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs shadow cursor-pointer hover:scale-110 active:scale-95 transition-all ${className}`}>
				{children}
			</button>

			{/* Floating Tooltip Bubble */}
			<div
				className={`absolute top-1/2 -translate-y-1/2 ${
					isNearRight ? 'right-full mr-2.5' : 'left-full ml-2.5'
				} pointer-events-none z-[70] hidden group-hover:flex group-focus-within:flex flex-col min-w-[140px] max-w-[210px] p-2.5 rounded-xl bg-[#090D2E]/98 border border-cyan-400/50 shadow-[0_8px_25px_rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150`}>
				<div className='flex items-center justify-between gap-1.5 mb-1'>
					<span className='font-bold text-xs text-white tracking-wide truncate'>
						{label}
					</span>
					{badge && (
						<span className='px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0'>
							{badge}
						</span>
					)}
				</div>
				{description && (
					<p className='text-[11px] leading-snug text-slate-300 font-normal'>
						{description}
					</p>
				)}

				{/* Arrow pointer */}
				<div
					className={`absolute top-1/2 -translate-y-1/2 ${
						isNearRight ?
							'-right-1 border-t border-r'
						:	'-left-1 border-b border-l'
					} w-2 h-2 bg-[#090D2E] border-cyan-400/50 rotate-45`}
				/>
			</div>
		</div>
	);
});

const PetAssistant = memo(function PetAssistant({
	currentScreen,
	currentQuestion,
	isSubmitted,
	isCorrect,
	isReviewMode,
	wasSkippedOnRevisit,
	kidName = 'Explorer',
	soundEnabled = true,
	speechEnabled = true,
	onTriggerHint,
}) {
	// Chosen living pet type (default to dog matching user's puppy image)
	const [petType, setPetType] = useState(() => {
		try {
			return localStorage.getItem(STORAGE_PET_KEY) || 'dog';
		} catch {
			return 'dog';
		}
	});

	// Chosen living pet size ('small' | 'medium' | 'large')
	const [petSize, setPetSize] = useState(() => {
		try {
			return getStoredPetSize() || 'medium';
		} catch {
			return 'medium';
		}
	});

	// Listen for size and pet changes across components/tabs
	useEffect(() => {
		const handleStorage = (e) => {
			if (e.key === STORAGE_SIZE_KEY && e.newValue) {
				setPetSize(e.newValue);
			} else if (e.key === STORAGE_PET_KEY && e.newValue) {
				setPetType(e.newValue);
			}
		};
		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, []);

	// Minimized or expanded
	const [isMinimized, setIsMinimized] = useState(() => {
		try {
			return localStorage.getItem(STORAGE_MINIMIZED_KEY) === 'true';
		} catch {
			return false;
		}
	});

	// Floating Position (Default placed at center seam between Question card and Options grid)
	const getDefaultPosition = useCallback(() => {
		if (typeof window === 'undefined') return { x: 480, y: 220 };
		if (window.innerWidth >= 1024) {
			return {
				x: Math.round(window.innerWidth * 0.46),
				y: Math.max(90, Math.round(window.innerHeight * 0.36)),
			};
		}
		return {
			x: Math.max(16, window.innerWidth - 130),
			y: Math.max(80, Math.round(window.innerHeight * 0.28)),
		};
	}, []);

	const [position, setPosition] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_POS_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
					return parsed;
				}
			}
		} catch {}
		return typeof window !== 'undefined' ?
				{
					x:
						window.innerWidth >= 1024 ?
							Math.round(window.innerWidth * 0.46)
						:	Math.max(16, window.innerWidth - 130),
					y:
						window.innerWidth >= 1024 ?
							Math.max(90, Math.round(window.innerHeight * 0.36))
						:	Math.max(80, Math.round(window.innerHeight * 0.28)),
				}
			:	{ x: 480, y: 220 };
	});

	// Living State: 'idle' | 'walking' | 'drinking' | 'eating' | 'playing' | 'cuddling' | 'napping' | 'spin' | 'squash'
	const [animState, setAnimState] = useState('idle');
	const [direction, setDirection] = useState(1); // 1 = right, -1 = left
	const [isBlinking, setIsBlinking] = useState(false);
	const [tiltAngle, setTiltAngle] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const [showControls, setShowControls] = useState(true);

	// Floating Particles (Hearts & Stars)
	const [particles, setParticles] = useState([]);
	const [customDialogue, setCustomDialogue] = useState(null);

	const activeProfile = PET_PROFILES[petType] || PET_PROFILES.dog;
	const petRef = useRef(null);
	const dragRef = useRef({
		isDown: false,
		startX: 0,
		startY: 0,
		origX: 0,
		origY: 0,
		hasMoved: false,
	});

	// Independent Draggable Vertical Toolbar State
	const getDefaultToolbarPosition = useCallback(() => {
		if (typeof window === 'undefined') return { x: 1000, y: 150 };
		return {
			x: Math.max(16, window.innerWidth - 64),
			y: Math.max(90, Math.round(window.innerHeight * 0.22)),
		};
	}, []);

	const [toolbarPos, setToolbarPos] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_TOOLBAR_POS_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
					return parsed;
				}
			}
		} catch {}
		return typeof window !== 'undefined' ?
				{
					x: Math.max(16, window.innerWidth - 64),
					y: Math.max(90, Math.round(window.innerHeight * 0.22)),
				}
			:	{ x: 1000, y: 150 };
	});

	const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(() => {
		try {
			return localStorage.getItem(STORAGE_TOOLBAR_COLLAPSED_KEY) === 'true';
		} catch {
			return false;
		}
	});

	const [isToolbarDragging, setIsToolbarDragging] = useState(false);
	const toolbarDragRef = useRef({
		isDown: false,
		startX: 0,
		startY: 0,
		origX: 0,
		origY: 0,
		hasMoved: false,
	});

	// Natural periodic blinking effect
	useEffect(() => {
		const blinkTimer = setInterval(() => {
			setIsBlinking(true);
			setTimeout(() => setIsBlinking(false), 200);
		}, 3800);
		return () => clearInterval(blinkTimer);
	}, []);

	// Walking Stroll Movement Effect: Physically steps across screen
	useEffect(() => {
		if (animState !== 'walking') return;
		let steps = 0;
		const walkInterval = setInterval(() => {
			setPosition((prev) => {
				const nextX = prev.x + direction * 5;
				const maxX = Math.max(10, window.innerWidth - 160);
				if (nextX >= maxX) {
					setDirection(-1);
					return { ...prev, x: maxX };
				}
				if (nextX <= 20) {
					setDirection(1);
					return { ...prev, x: 20 };
				}
				return { ...prev, x: nextX };
			});
			steps++;
			if (steps >= 36) {
				setAnimState('idle');
				setCustomDialogue(`What a nice walk, ${kidName}! 🐾`);
				setTimeout(() => setCustomDialogue(null), 3000);
			}
		}, 140);
		return () => clearInterval(walkInterval);
	}, [animState, direction, kidName]);

	// Autonomous living routines when idle (drink water, take short stroll, wag tail)
	useEffect(() => {
		if (isDragging || animState !== 'idle') return;
		const routineTimer = setInterval(() => {
			const roll = Math.random();
			if (roll < 0.3) {
				// Autonomous drinking water
				setAnimState('drinking');
				playPetSlurp(soundEnabled);
				setCustomDialogue(`*Slurp slurp* Cool refreshing water! 💧`);
				setTimeout(() => {
					setAnimState('idle');
					setCustomDialogue(null);
				}, 4000);
			} else if (roll < 0.6) {
				// Autonomous gentle walk
				setAnimState('walking');
				setDirection((d) => -d);
				setTimeout(() => setAnimState('idle'), 3500);
			}
		}, 32000);
		return () => clearInterval(routineTimer);
	}, [isDragging, animState, soundEnabled]);

	// Switch companion
	const handleSelectPet = (type) => {
		setPetType(type);
		try {
			localStorage.setItem(STORAGE_PET_KEY, type);
		} catch {}
		setIsPickerOpen(false);
		triggerAffection(type);
	};

	// Reset position to default center hero spot
	const handleResetPosition = () => {
		playButtonPop(soundEnabled);
		const def = getDefaultPosition();
		setPosition(def);
		setDirection(1);
		try {
			localStorage.setItem(STORAGE_POS_KEY, JSON.stringify(def));
		} catch {}
	};

	// Toggle minimize
	const toggleMinimize = () => {
		playButtonPop(soundEnabled);
		setIsMinimized((prev) => {
			const next = !prev;
			try {
				localStorage.setItem(STORAGE_MINIMIZED_KEY, String(next));
			} catch {}
			return next;
		});
	};

	// Trigger affectionate animation & vocal sound
	const triggerAffection = useCallback(
		(overrideType = petType) => {
			setAnimState('cuddling');

			if (overrideType === 'cat') {
				playCatMeow(soundEnabled);
			} else if (overrideType === 'dog') {
				playDogBark(soundEnabled);
			} else {
				playPetSound(overrideType, soundEnabled);
			}

			// Celebratory burst of hearts & stars
			const burst = Array.from({ length: 6 }).map((_, i) => ({
				id: Date.now() + Math.random() + i,
				emoji: i % 2 === 0 ? '💖' : '⭐',
				left: 10 + i * 16,
				driftX: (Math.random() - 0.5) * 30,
			}));
			setParticles((prev) => [...prev, ...burst]);

			setCustomDialogue(
				overrideType === 'dog' ?
					`*Wags tail happily* I love you, ${kidName}! Woof! 💖`
				:	`*Purrs with happiness* You're the best, ${kidName}! 💖`,
			);

			setTimeout(() => {
				setParticles((prev) =>
					prev.filter((p) => !burst.some((b) => b.id === p.id)),
				);
			}, 1800);

			setTimeout(() => {
				setAnimState((curr) => (curr === 'cuddling' ? 'idle' : curr));
				setCustomDialogue(null);
			}, 2800);
		},
		[petType, soundEnabled, kidName],
	);

	// Action: Take a Walk / Stroll
	const handleWalk = useCallback(() => {
		playButtonPop(soundEnabled);
		if (animState === 'walking') {
			setAnimState('idle');
			setCustomDialogue(null);
		} else {
			setAnimState('walking');
			setDirection(1);
			setCustomDialogue(
				petType === 'dog' ?
					`Let's go for a walk, ${kidName}! Woof! 🐾`
				:	`Strolling through the stars with you, ${kidName}! 🚀`,
			);
			if (petType === 'dog') {
				playDogBark(soundEnabled);
			} else if (petType === 'cat') {
				playCatMeow(soundEnabled);
			}
		}
	}, [animState, soundEnabled, petType, kidName]);

	// Action: Drink Milk or Fresh Water
	const handleDrink = useCallback(() => {
		playPetSlurp(soundEnabled);
		setAnimState('drinking');
		setCustomDialogue(
			petType === 'robot' ?
				`*Gulp gulp* Coolant oil replenished! 100% smooth, ${kidName}! ⚙️`
			: petType === 'cat' ?
				`*Lick lick* Creamy fresh milk! Purrfect, ${kidName}! 🥛`
			:	`*Slurp slurp* Cool fresh water! Thank you, ${kidName}! 💧`,
		);

		const burst = Array.from({ length: 4 }).map((_, i) => ({
			id: Date.now() + Math.random() + i,
			emoji: petType === 'cat' ? '🥛' : '💧',
			left: 20 + i * 18,
			driftX: (Math.random() - 0.5) * 20,
		}));
		setParticles((prev) => [...prev, ...burst]);

		setTimeout(() => {
			setAnimState('idle');
			setCustomDialogue(null);
			setParticles((prev) =>
				prev.filter((p) => !burst.some((b) => b.id === p.id)),
			);
		}, 4200);
	}, [soundEnabled, kidName, petType]);

	// Action: Eat Food / Crunchy Treats
	const handleFeed = useCallback(() => {
		playPetSlurp(soundEnabled);
		setAnimState('eating');
		setCustomDialogue(
			petType === 'robot' ?
				`*Bzzzt!* Energy battery recharged to 100%! Thank you, ${kidName}! ⚡`
			: petType === 'cat' ?
				`*Munch crunch* Delicious tuna snack! Thank you, ${kidName}! 🐟`
			:	`*Crunch crunch* Yummy crunchy bone treats! Thank you, ${kidName}! 🍖`,
		);

		const burst = Array.from({ length: 4 }).map((_, i) => ({
			id: Date.now() + Math.random() + i,
			emoji: activeProfile.treatEmoji,
			left: 20 + i * 18,
			driftX: (Math.random() - 0.5) * 20,
		}));
		setParticles((prev) => [...prev, ...burst]);

		setTimeout(() => {
			setAnimState('idle');
			setCustomDialogue(null);
			setParticles((prev) =>
				prev.filter((p) => !burst.some((b) => b.id === p.id)),
			);
		}, 4200);
	}, [soundEnabled, kidName, petType, activeProfile.treatEmoji]);

	// Action: Play Catch with Star Ball
	const handlePlay = useCallback(() => {
		playToyBoing(soundEnabled);
		setAnimState('playing');
		setCustomDialogue(`Catch the star! You're brilliant, ${kidName}! 🌟`);

		setTimeout(() => {
			setAnimState('idle');
			setCustomDialogue(null);
		}, 3800);
	}, [soundEnabled, kidName]);

	// Action: Toggle Sleep / Wake
	const handleToggleNap = useCallback(() => {
		playButtonPop(soundEnabled);
		if (animState === 'napping') {
			setAnimState('idle');
			triggerAffection();
		} else {
			setAnimState('napping');
			setCustomDialogue(`*Yawn* Taking a cozy zero-G snooze... Zzz 💤`);
		}
	}, [animState, soundEnabled, triggerAffection]);

	// Action: Cycle Pet Size (Small -> Medium -> Large)
	const handleCyclePetSize = useCallback(() => {
		const order = ['small', 'medium', 'large'];
		const nextIdx = (order.indexOf(petSize) + 1) % order.length;
		const nextSize = order[nextIdx];
		setPetSize(nextSize);
		saveStoredPetSize(nextSize);
		if (soundEnabled) playButtonPop();
		const sizeInfo = PET_SIZES[nextSize] || PET_SIZES.medium;
		setCustomDialogue(`Size: ${sizeInfo.label} (${sizeInfo.px}px)! 📏✨`);
		setTimeout(() => setCustomDialogue(null), 3200);
	}, [petSize, soundEnabled]);

	// Read question aloud
	const handleReadAloud = useCallback(() => {
		playButtonPop(soundEnabled);
		triggerAffection();
		if (currentQuestion) {
			const text =
				currentQuestion.promptAudio ||
				currentQuestion.question ||
				currentQuestion.questionText ||
				'';
			if (text) {
				speakText(text);
			}
		}
	}, [currentQuestion, soundEnabled, triggerAffection]);

	// Trigger clue
	const handleAskClue = useCallback(() => {
		playButtonPop(soundEnabled);
		triggerAffection();
		if (currentQuestion?.hint) {
			setCustomDialogue(`💡 Clue: ${currentQuestion.hint}`);
			setTimeout(() => setCustomDialogue(null), 5500);
		}
		if (onTriggerHint) {
			onTriggerHint();
		}
	}, [currentQuestion, onTriggerHint, soundEnabled, triggerAffection]);

	// Reactive Reactions to Quest Events
	useEffect(() => {
		if (isSubmitted) {
			if (isCorrect) {
				setAnimState('spin');
				triggerAffection();
				setCustomDialogue(`WOOHOO! Super thinking, ${kidName}! You got it! 🎉`);
				const timer = setTimeout(() => {
					setCustomDialogue(null);
					setAnimState('idle');
				}, 4000);
				return () => clearTimeout(timer);
			} else {
				setCustomDialogue(
					wasSkippedOnRevisit ?
						`Look at the solution below to discover the secret! 🌟`
					:	`Nice try, ${kidName}! Check out the solution to learn how! 💜`,
				);
				const timer = setTimeout(() => setCustomDialogue(null), 4500);
				return () => clearTimeout(timer);
			}
		}
	}, [isSubmitted, isCorrect, wasSkippedOnRevisit, kidName, triggerAffection]);

	// Dragging Event Handlers with Smooth Pointer Capture
	const handlePointerDown = (e) => {
		if (e.button !== undefined && e.button !== 0) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		dragRef.current = {
			isDown: true,
			startX: e.clientX,
			startY: e.clientY,
			origX: position.x,
			origY: position.y,
			hasMoved: false,
		};
		setIsDragging(true);
	};

	const handlePointerMove = (e) => {
		if (!dragRef.current.isDown) return;
		const dx = e.clientX - dragRef.current.startX;
		const dy = e.clientY - dragRef.current.startY;

		if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
			dragRef.current.hasMoved = true;
		}

		// Responsive tilt while dragging
		const tilt = Math.max(-15, Math.min(15, dx * 0.3));
		setTiltAngle(tilt);

		const maxX = Math.max(10, window.innerWidth - 140);
		const maxY = Math.max(10, window.innerHeight - 150);
		const newX = Math.max(10, Math.min(maxX, dragRef.current.origX + dx));
		const newY = Math.max(10, Math.min(maxY, dragRef.current.origY + dy));
		setPosition({ x: newX, y: newY });
	};

	const handlePointerUp = (e) => {
		if (!dragRef.current.isDown) return;
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {}

		if (dragRef.current.hasMoved) {
			try {
				localStorage.setItem(STORAGE_POS_KEY, JSON.stringify(position));
			} catch {}
		} else {
			// Simple tap/click without drag -> trigger affection!
			triggerAffection();
		}

		dragRef.current.isDown = false;
		setIsDragging(false);
		setTiltAngle(0);
	};

	// ─── Independent Toolbar Drag Handlers ───
	const handleToolbarPointerDown = (e) => {
		toolbarDragRef.current = {
			isDown: true,
			startX: e.clientX,
			startY: e.clientY,
			origX: toolbarPos.x,
			origY: toolbarPos.y,
			hasMoved: false,
		};
		setIsToolbarDragging(true);
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
	};

	const handleToolbarPointerMove = (e) => {
		if (!toolbarDragRef.current.isDown) return;
		const dx = e.clientX - toolbarDragRef.current.startX;
		const dy = e.clientY - toolbarDragRef.current.startY;
		if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
			toolbarDragRef.current.hasMoved = true;
		}
		const maxX = Math.max(10, window.innerWidth - 60);
		const maxY = Math.max(10, window.innerHeight - 80);
		const newX = Math.max(
			10,
			Math.min(maxX, toolbarDragRef.current.origX + dx),
		);
		const newY = Math.max(
			10,
			Math.min(maxY, toolbarDragRef.current.origY + dy),
		);
		setToolbarPos({ x: newX, y: newY });
	};

	const handleToolbarPointerUp = (e) => {
		if (!toolbarDragRef.current.isDown) return;
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {}
		if (toolbarDragRef.current.hasMoved) {
			try {
				localStorage.setItem(
					STORAGE_TOOLBAR_POS_KEY,
					JSON.stringify(toolbarPos),
				);
			} catch {}
		}
		toolbarDragRef.current.isDown = false;
		setIsToolbarDragging(false);
	};

	const toggleToolbarCollapsed = () => {
		setIsToolbarCollapsed((prev) => {
			const next = !prev;
			try {
				localStorage.setItem(STORAGE_TOOLBAR_COLLAPSED_KEY, String(next));
			} catch {}
			return next;
		});
	};

	// Context-sensitive speech bubble text (Matching User Image 1: "Let's figure it out!")
	const getSpeechBubbleText = () => {
		if (customDialogue) return customDialogue;
		if (animState === 'napping') return `Zzz... 💤`;
		if (animState === 'drinking')
			return petType === 'cat' ?
					`Creamy fresh milk! 🥛`
				:	`Refreshing water! 💧`;
		if (animState === 'eating')
			return petType === 'robot' ? `Charging! ⚡` : `Crunch crunch! 🍖`;
		if (animState === 'walking') return `Trotting along! 🐾`;
		if (animState === 'playing') return `Catch the star! 🌟`;
		if (animState === 'cuddling')
			return petType === 'dog' ? `Woof! Love you! 💖` : `Purr! Love you! 💖`;

		if (currentScreen === 'thinksheet') {
			if (isSubmitted) {
				if (isCorrect) return `Brilliant, ${kidName}! 🎉`;
				return `Let's check the solution! 💜`;
			}
			if (isReviewMode) return `Let's conquer this one! 🔄`;
			// Exact text from user's Image 1!
			return "Let's figure it out! 🚀";
		}

		return `Ready to explore, ${kidName}! ⭐`;
	};

	// Determine speech bubble placement: point towards center if near edge
	const isNearRight =
		typeof window !== 'undefined' ? position.x > window.innerWidth / 2 : false;

	return (
		<>
			{!isMinimized ?
				<>
					{/* ─── Living Articulated Pet Companion (Matching User Screenshots) ───── */}
					<div
						style={{
							left: `${position.x}px`,
							top: `${position.y}px`,
							transform: `rotate(${tiltAngle}deg)`,
							transition: isDragging ? 'none' : 'transform 0.25s ease-out',
						}}
						className='fixed z-40 select-none flex flex-col items-center pointer-events-auto'>
						{/* Floating Reaction Particles (Stars / Hearts) */}
						<div className='relative w-full h-0 pointer-events-none'>
							{particles.map((p) => (
								<span
									key={p.id}
									style={{
										left: `${p.left}%`,
										transform: `translateX(${p.driftX}px)`,
									}}
									className='absolute -top-10 text-2xl animate-pet-heart z-50'>
									{p.emoji}
								</span>
							))}

							{/* Zero-G Sleep Zzz Bubbles */}
							{animState === 'napping' && (
								<div className='absolute -top-12 left-16 flex flex-col text-cyan-300 font-black pointer-events-none'>
									<span className='text-sm animate-zzz-1'>Z</span>
									<span className='text-base animate-zzz-2'>z</span>
									<span className='text-xs animate-zzz-3'>z</span>
								</div>
							)}
						</div>

						{/* ─── Speech Bubble (Matching Image 1: "Let's figure it out!") ─── */}
						<div
							className={`absolute -top-8 ${isNearRight ? 'right-full mr-2' : 'left-full ml-2'} pointer-events-none z-50 whitespace-nowrap animate-in fade-in duration-200`}>
							<div className='px-3.5 py-1.5 rounded-full bg-[#1A1E4A]/95 backdrop-blur-md border-2 border-indigo-300/40 text-indigo-100 text-xs sm:text-[13px] font-black shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-1.5'>
								<span>{getSpeechBubbleText()}</span>
							</div>
						</div>

						{/* ─── Living Articulated Pet Character Display ─── */}
						<div
							ref={petRef}
							onPointerDown={handlePointerDown}
							onPointerMove={handlePointerMove}
							onPointerUp={handlePointerUp}
							onPointerCancel={handlePointerUp}
							title='Drag to move • Click to interact!'
							className={`relative cursor-grab active:cursor-grabbing touch-none ${
								animState === 'spin' ? 'animate-pet-spin'
								: animState === 'squash' ? 'animate-pet-squash'
								: animState === 'walking' ? ''
								: 'animate-pet-float'
							}`}>
							{/* Ambient Glow / Thruster Flame for Robot */}
							{petType === 'robot' && (
								<div className='absolute -bottom-3 inset-x-4 h-6 rounded-full bg-gradient-to-r from-pink-500/70 via-cyan-400/80 to-purple-500/70 blur-md animate-thruster-glow pointer-events-none' />
							)}

							{/* Ambient Stardust Glow for Cat / Pup / Alien */}
							{petType !== 'robot' && (
								<div
									style={{ backgroundColor: activeProfile.glowColor }}
									className='absolute inset-2 rounded-full blur-xl opacity-40 animate-pulse pointer-events-none'
								/>
							)}

							{/* Twinkling Zero-G Ambient Stars around Cat and Dog */}
							{(petType === 'cat' || petType === 'dog') && (
								<>
									<span className='absolute -top-2 -left-3 text-amber-300 text-sm animate-star-twinkle pointer-events-none'>
										⭐
									</span>
									<span
										style={{ animationDelay: '0.9s' }}
										className='absolute -bottom-2 -right-3 text-yellow-200 text-xs animate-star-twinkle pointer-events-none'>
										✨
									</span>
									<span
										style={{ animationDelay: '1.5s' }}
										className='absolute top-1/2 -right-4 text-amber-400 text-sm animate-star-twinkle pointer-events-none'>
										🌟
									</span>
								</>
							)}

							{/* ─── Living Articulated Animal (Walks, Drinks, Eats, Wags Tail, Barks) ─── */}
							<LivingPetCharacter
								petType={petType}
								livingState={animState}
								isBlinking={isBlinking}
								direction={direction}
								size={PET_SIZES[petSize]?.px || 148}
							/>
						</div>
					</div>

					{/* ─── Independent Vertical Control Toolbar (Free Floating & Draggable) ──── */}
					<div
						style={{
							left: `${toolbarPos.x}px`,
							top: `${toolbarPos.y}px`,
						}}
						className='fixed z-50 select-none pointer-events-auto flex flex-col items-center animate-in fade-in duration-200'>
						{isToolbarCollapsed ?
							/* Collapsed Minimal Pill with Tooltip */
							<div className='relative group flex items-center justify-center'>
								<button
									type='button'
									onClick={toggleToolbarCollapsed}
									aria-label='Expand Pet Controls'
									className='w-11 h-11 rounded-2xl bg-[#090D2E]/95 hover:bg-[#13194B] border-2 border-cyan-400/70 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:scale-105 active:scale-95 transition-all text-white'>
									<span className='text-base leading-none'>
										{activeProfile.emoji}
									</span>
									<ChevronDown className='w-3 h-3 text-cyan-300' />
								</button>

								{/* Tooltip on Collapsed Pill */}
								<div
									className={`absolute top-1/2 -translate-y-1/2 ${
										(
											typeof window !== 'undefined' ?
												toolbarPos.x > window.innerWidth / 2
											:	true
										) ?
											'right-full mr-2.5'
										:	'left-full ml-2.5'
									} pointer-events-none z-[70] hidden group-hover:flex flex-col min-w-[140px] max-w-[200px] p-2.5 rounded-xl bg-[#090D2E]/98 border border-cyan-400/50 shadow-[0_8px_25px_rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150`}>
									<div className='flex items-center justify-between gap-1 mb-1'>
										<span className='font-bold text-xs text-white'>
											Pet Controls
										</span>
										<span className='px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'>
											Expand
										</span>
									</div>
									<p className='text-[11px] leading-snug text-slate-300 font-normal'>
										Click to show pet actions, feeds, cuddles, and resizing.
									</p>
									<div
										className={`absolute top-1/2 -translate-y-1/2 ${
											(
												typeof window !== 'undefined' ?
													toolbarPos.x > window.innerWidth / 2
												:	true
											) ?
												'-right-1 border-t border-r'
											:	'-left-1 border-b border-l'
										} w-2 h-2 bg-[#090D2E] border-cyan-400/50 rotate-45`}
									/>
								</div>
							</div>
						:	/* Expanded Vertical Control Strip */
							<div className='w-11 bg-[#090D2E]/95 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.65)] flex flex-col items-center gap-1.5'>
								{/* Drag Handle with Tooltip */}
								<div className='relative group w-full flex items-center justify-center'>
									<div
										onPointerDown={handleToolbarPointerDown}
										onPointerMove={handleToolbarPointerMove}
										onPointerUp={handleToolbarPointerUp}
										onPointerCancel={handleToolbarPointerUp}
										title='Drag to reposition controls anywhere'
										className='w-full py-1 flex items-center justify-center cursor-grab active:cursor-grabbing text-cyan-400/70 hover:text-cyan-300 touch-none border-b border-white/10'>
										<GripVertical className='w-3.5 h-3.5' />
									</div>
									<div
										className={`absolute top-1/2 -translate-y-1/2 ${
											(
												typeof window !== 'undefined' ?
													toolbarPos.x > window.innerWidth / 2
												:	true
											) ?
												'right-full mr-2.5'
											:	'left-full ml-2.5'
										} pointer-events-none z-[70] hidden group-hover:flex flex-col min-w-[130px] max-w-[190px] p-2.5 rounded-xl bg-[#090D2E]/98 border border-cyan-400/50 shadow-[0_8px_25px_rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150`}>
										<span className='font-bold text-xs text-white mb-0.5'>
											Move Controls
										</span>
										<p className='text-[11px] leading-snug text-slate-300 font-normal'>
											Click & drag to reposition controls anywhere on your
											screen.
										</p>
										<div
											className={`absolute top-1/2 -translate-y-1/2 ${
												(
													typeof window !== 'undefined' ?
														toolbarPos.x > window.innerWidth / 2
													:	true
												) ?
													'-right-1 border-t border-r'
												:	'-left-1 border-b border-l'
											} w-2 h-2 bg-[#090D2E] border-cyan-400/50 rotate-45`}
										/>
									</div>
								</div>

								{/* 1. Clue Tool (in quiz) */}
								{currentScreen === 'thinksheet' && (
									<ToolbarButton
										onClick={handleAskClue}
										label='Ask for Clue'
										badge='Hint'
										description='Get a friendly hint from your companion for this question.'
										isNearRight={
											typeof window !== 'undefined' ?
												toolbarPos.x > window.innerWidth / 2
											:	true
										}
										className='bg-purple-500/20 hover:bg-purple-500/40 border-purple-400/40 text-purple-300'>
										<Sparkles className='w-4 h-4' />
									</ToolbarButton>
								)}

								{/* 2. Read Question Aloud */}
								{currentScreen === 'thinksheet' && (
									<ToolbarButton
										onClick={handleReadAloud}
										label='Read Aloud'
										badge='Voice'
										description='Listen to the companion read the question aloud.'
										isNearRight={
											typeof window !== 'undefined' ?
												toolbarPos.x > window.innerWidth / 2
											:	true
										}
										className='bg-blue-500/20 hover:bg-blue-500/40 border-blue-400/40 text-blue-300'>
										<Volume2 className='w-4 h-4' />
									</ToolbarButton>
								)}

								{/* 3. Walk / Stroll Action */}
								<ToolbarButton
									onClick={handleWalk}
									label={
										animState === 'walking' ? 'Stop Walking' : 'Take a Walk'
									}
									badge={animState === 'walking' ? 'Walking' : 'Motion'}
									description='Watch your pet stroll happily across the bottom of the screen.'
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className={
										animState === 'walking' ?
											'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
										:	'bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-400/40 text-emerald-300'
									}>
									<Footprints className='w-4 h-4' />
								</ToolbarButton>

								{/* 4. Drink Milk / Fresh Water Action */}
								<ToolbarButton
									onClick={handleDrink}
									label={
										petType === 'cat' ? 'Drink Fresh Milk' : 'Drink Fresh Water'
									}
									badge={petType === 'cat' ? 'Milk' : 'Water'}
									description={
										petType === 'cat' ?
											'Give Luna a tasty bowl of creamy milk.'
										:	'Give your companion fresh, refreshing water.'
									}
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='bg-cyan-500/20 hover:bg-cyan-500/40 border-cyan-400/40 text-cyan-300 text-sm'>
									<span>{petType === 'cat' ? '🥛' : '💧'}</span>
								</ToolbarButton>

								{/* 5. Eat Food / Crunchy Kibbles */}
								<ToolbarButton
									onClick={handleFeed}
									label={`Feed ${activeProfile.treatName}`}
									badge='Treat'
									description={`Feed your companion delicious ${activeProfile.treatName}.`}
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='bg-amber-500/20 hover:bg-amber-500/40 border-amber-400/40 text-sm'>
									<span>{activeProfile.treatEmoji}</span>
								</ToolbarButton>

								{/* 6. Play Star Ball */}
								<ToolbarButton
									onClick={handlePlay}
									label='Play Star Ball'
									badge='Catch'
									description='Toss a bouncy star ball for your pet to chase and catch.'
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='bg-yellow-500/20 hover:bg-yellow-500/40 border-yellow-400/40 text-sm'>
									<span>🎾</span>
								</ToolbarButton>

								{/* 7. Cuddle & Show Love */}
								<ToolbarButton
									onClick={() => triggerAffection()}
									label='Pet & Cuddle'
									badge='Love'
									description='Shower your companion with love, hears happy purrs or barks.'
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='bg-pink-500/20 hover:bg-pink-500/40 border-pink-400/40 text-pink-300'>
									<Heart className='w-4 h-4 fill-current' />
								</ToolbarButton>

								{/* 8. Nap / Wake Toggle */}
								<ToolbarButton
									onClick={handleToggleNap}
									label={animState === 'napping' ? 'Wake Up' : 'Nap Time'}
									badge={animState === 'napping' ? 'Sleeping' : 'Rest'}
									description={
										animState === 'napping' ?
											'Wake up your companion to continue exploring!'
										:	'Let your companion take a cozy zero-G snooze.'
									}
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='bg-slate-800 hover:bg-slate-700 border-slate-600'>
									{animState === 'napping' ?
										<Sun className='w-4 h-4 text-amber-400' />
									:	<Moon className='w-4 h-4 text-cyan-300' />}
								</ToolbarButton>

								{/* 9. Resize Pet Assistant (Small / Medium / Large) */}
								<ToolbarButton
									onClick={handleCyclePetSize}
									label='Resize Pet'
									badge={PET_SIZES[petSize]?.badge || 'Standard'}
									description={`Cycle size: Small (104px), Medium (148px), or Large (192px). Current: ${
										PET_SIZES[petSize]?.label || 'Medium'
									} (${PET_SIZES[petSize]?.px || 148}px).`}
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='bg-cyan-500/20 hover:bg-cyan-500/40 border-cyan-400/40 text-cyan-300'>
									<div className='flex flex-col items-center justify-center leading-none'>
										<span className='text-[10px] font-black text-cyan-300'>
											{PET_SIZES[petSize]?.iconText || 'M'}
										</span>
										<span className='text-[7px] text-cyan-400/80 font-bold uppercase'>
											size
										</span>
									</div>
								</ToolbarButton>

								{/* 10. Change Companion */}
								<ToolbarButton
									onClick={() => setIsPickerOpen((p) => !p)}
									label='Switch Companion'
									badge={activeProfile.name.split(' ')[0]}
									description='Choose between Rocket the Pup, Luna the Cat, Beep the Bot, or Zog.'
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className={
										isPickerOpen ?
											'bg-cyan-500 border-cyan-300 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
										:	'bg-slate-800 hover:bg-slate-700 border-slate-600 text-cyan-300'
									}>
									<RotateCcw className='w-3.5 h-3.5' />
								</ToolbarButton>

								{/* 11. Reset Pet to Center Spot */}
								<ToolbarButton
									onClick={handleResetPosition}
									label='Center Pet'
									badge='Reset'
									description='Snap companion back to the default center spot.'
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'>
									<LocateFixed className='w-3.5 h-3.5' />
								</ToolbarButton>

								{/* 12. Minimize / Hide Pet */}
								<ToolbarButton
									onClick={toggleMinimize}
									label='Minimize Pet'
									badge='Corner'
									description='Dock companion into a small circular badge in the screen corner.'
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='w-8 h-6 rounded-lg text-slate-400 hover:text-white border-transparent hover:bg-white/10 border-t !border-white/10 pt-1'>
									<ChevronDown className='w-3.5 h-3.5' />
								</ToolbarButton>

								{/* 13. Collapse Toolbar */}
								<ToolbarButton
									onClick={toggleToolbarCollapsed}
									label='Collapse Toolbar'
									badge='Dock'
									description='Minimize controls into a single floating button to save space.'
									isNearRight={
										typeof window !== 'undefined' ?
											toolbarPos.x > window.innerWidth / 2
										:	true
									}
									className='w-8 h-6 rounded-lg text-cyan-400/80 hover:text-cyan-300 border-transparent hover:bg-white/10'>
									<ChevronUp className='w-3.5 h-3.5' />
								</ToolbarButton>
							</div>
						}

						{/* ─── Companion Picker Flyout Popover (Adjacent to vertical strip) ──── */}
						{isPickerOpen && (
							<div
								className={`absolute top-0 ${
									(
										toolbarPos.x >
										(typeof window !== 'undefined' ?
											window.innerWidth / 2
										:	500)
									) ?
										'right-full mr-3'
									:	'left-full ml-3'
								} w-64 bg-gradient-to-b from-[#1C1F5E] to-[#0D1030] border-2 border-cyan-400/80 rounded-2xl p-3 text-white shadow-2xl animate-in zoom-in-95 duration-150 z-50`}>
								<div className='flex items-center justify-between pb-1.5 mb-2 border-b border-white/15'>
									<h4 className='font-black text-xs text-white uppercase tracking-wider'>
										Choose Companion
									</h4>
									<button
										type='button'
										onClick={() => setIsPickerOpen(false)}
										className='p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer'>
										<X className='w-3.5 h-3.5' />
									</button>
								</div>

								<div className='grid grid-cols-2 gap-2'>
									{Object.values(PET_PROFILES).map((pet) => {
										const isSelected = pet.id === petType;
										return (
											<button
												key={pet.id}
												type='button'
												onClick={() => handleSelectPet(pet.id)}
												className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
													isSelected ?
														`bg-gradient-to-b ${pet.themeColor} ${pet.borderColor} ring-2 ring-white/60 scale-105 shadow-md`
													:	'bg-white/5 hover:bg-white/15 border-white/20'
												}`}>
												<img
													src={pet.imageSrc}
													alt={pet.name}
													className='w-10 h-10 object-contain mb-1'
												/>
												<span
													className={`font-black text-[11px] leading-tight ${isSelected ? 'text-slate-950' : 'text-white'}`}>
													{pet.name}
												</span>
												<span
													className={`text-[9px] font-bold ${isSelected ? 'text-slate-900/80' : 'text-slate-400'}`}>
													{pet.badge}
												</span>
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</>
			:	/* Minimized Corner Button */
				<button
					type='button'
					onClick={toggleMinimize}
					aria-label={`Wake up ${activeProfile.name}`}
					className='fixed bottom-4 right-4 pointer-events-auto p-2 rounded-2xl bg-[#141846] border-2 border-cyan-400/80 shadow-2xl flex items-center gap-2 text-xs font-black text-white hover:scale-105 active:scale-95 cursor-pointer transition-transform z-40'>
					<img
						src={activeProfile.imageSrc}
						alt={activeProfile.name}
						className='w-6 h-6 object-contain'
					/>
					<span>{activeProfile.name}</span>
					<span className='px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]'>
						Wake Up ☀️
					</span>
				</button>
			}
		</>
	);
});

export default PetAssistant;
