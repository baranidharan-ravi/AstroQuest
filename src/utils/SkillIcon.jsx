import {
	Atom,
	BookOpen,
	Bot,
	Brain,
	Calculator,
	Compass,
	Eye,
	Flame,
	FlaskConical,
	Footprints,
	Gem,
	Globe,
	Lightbulb,
	Microscope,
	Music,
	Orbit,
	Palette,
	PawPrint,
	Puzzle,
	Rocket,
	Ruler,
	Shield,
	Sprout,
	Star,
	Target,
	Telescope,
	Trophy,
	Wand2,
	Zap,
} from 'lucide-react';
import { memo } from 'react';

/**
 * Registry mapping icon names and popular educational emojis to Lucide SVG font icons.
 */
export const ICON_MAP = {
	// Lucide vector font icons
	Rocket,
	Orbit,
	Brain,
	Eye,
	Microscope,
	Atom,
	FlaskConical,
	Telescope,
	Calculator,
	Ruler,
	Puzzle,
	Target,
	Sprout,
	PawPrint,
	Globe,
	Compass,
	Palette,
	BookOpen,
	Zap,
	Lightbulb,
	Bot,
	Star,
	Trophy,
	Music,
	Flame,
	Gem,
	Wand2,
	Shield,
	Footprints,

	// Emoji backwards-compatibility mapping to Lucide SVG icons
	'🚀': Rocket,
	'🪐': Orbit,
	'🧠': Brain,
	'👁️': Eye,
	'👁': Eye,
	'🔬': Microscope,
	'📐': Ruler,
	'🌿': Sprout,
	'🌱': Sprout,
	'⭐': Star,
	'🌟': Star,
	'✨': Star,
	'🧩': Puzzle,
	'🎨': Palette,
	'📚': BookOpen,
	'⚡': Zap,
	'💡': Lightbulb,
	'🐾': PawPrint,
	'🎯': Target,
	'🔢': Calculator,
	'🦖': Footprints,
	'🤖': Bot,
	'🌍': Globe,
	'🌎': Globe,
	'🌏': Globe,
	'🧪': FlaskConical,
	'🐙': PawPrint,
	'🐠': PawPrint,
	'🐻‍❄️': PawPrint,
	'🐒': PawPrint,
	'🦅': PawPrint,
	'🐝': PawPrint,
	'🐪': PawPrint,
	'🕵️': Eye,
	'🌈': Palette,
	'🌪️': Flame,
	'🏛️': BookOpen,
	'🌋': Flame,
	'🎵': Music,
	'🌌': Orbit,
	'💎': Gem,
	'🎢': Zap,
	'🌉': Compass,
	'🌠': Star,
	'⏳': Telescope,
	'♻️': Sprout,
	'📡': Telescope,
};

/**
 * Normalizes input key to match standard PascalCase icon names if possible.
 */
function findIconComponent(icon) {
	if (!icon) return null;
	if (typeof icon !== 'string') return null;

	// Direct match
	if (ICON_MAP[icon]) return ICON_MAP[icon];

	// Trim and check
	const trimmed = icon.trim();
	if (ICON_MAP[trimmed]) return ICON_MAP[trimmed];

	// Capitalized case-insensitive lookup (e.g., 'rocket' -> 'Rocket')
	const normalizedKey =
		trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
	if (ICON_MAP[normalizedKey]) return ICON_MAP[normalizedKey];

	return null;
}

/**
 * Renders an SVG font icon from lucide-react with graceful fallback for arbitrary strings.
 */
export const SkillIcon = memo(function SkillIcon({
	icon = 'Rocket',
	className = 'w-5 h-5',
	style,
	...props
}) {
	const IconComp = findIconComponent(icon);

	if (IconComp) {
		return (
			<IconComp
				className={`inline-block shrink-0 ${className}`}
				style={style}
				aria-hidden='true'
				{...props}
			/>
		);
	}

	// Fallback for unmapped text / emoji symbols
	return (
		<span
			className={`inline-flex items-center justify-center select-none ${className}`}
			style={style}
			role='img'
			aria-label={typeof icon === 'string' ? icon : 'icon'}
			{...props}>
			{icon}
		</span>
	);
});

export default SkillIcon;
