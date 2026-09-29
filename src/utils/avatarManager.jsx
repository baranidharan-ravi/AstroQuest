import React from 'react';
import { PRESET_AVATARS } from './avatars/presetAvatars';

export { PRESET_AVATARS };

/**
 * Returns the default avatar identifier for a given gender
 * @param {'boy'|'girl'|'neutral'|string} gender
 * @returns {string} avatarId
 */
export function getDefaultAvatarForGender(gender) {
	const normalized = (gender || '').toLowerCase().trim();
	if (normalized === 'girl') {
		return 'girl-astronaut-1';
	}
	if (
		normalized === 'neutral' ||
		normalized === 'explorer' ||
		normalized === 'space cadet'
	) {
		return 'explorer-rover';
	}
	// Default to boy-astronaut-1
	return 'boy-astronaut-1';
}

/**
 * Retrieves avatar definition by ID (falls back to default boy avatar if not found)
 */
export function getAvatarById(avatarId) {
	return PRESET_AVATARS.find((a) => a.id === avatarId) || PRESET_AVATARS[0];
}

/**
 * KidAvatar Component
 * Renders the chosen avatar as an SVG vector illustration with custom size & container styling
 */
export const KidAvatar = React.memo(function KidAvatar({
	avatarId,
	size = 'md',
	className = '',
	alt = 'Avatar',
	showRing = false,
}) {
	const avatar = getAvatarById(avatarId);

	// Size dimension mapping
	const sizeMap = {
		xs: 'w-5 h-5 sm:w-6 sm:h-6',
		sm: 'w-7 h-7 sm:w-8 sm:h-8',
		md: 'w-10 h-10 sm:w-11 sm:h-11',
		lg: 'w-14 h-14 sm:w-16 sm:h-16',
		xl: 'w-20 h-20 sm:w-24 sm:h-24',
	};

	const sizeClasses = sizeMap[size] || sizeMap.md;

	return (
		<div
			className={`relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center select-none shadow-md ${sizeClasses} ${
				showRing ?
					`ring-2 ring-offset-2 ring-offset-[#080924] ${avatar.borderColor}`
				:	''
			} ${className}`}
			title={alt || avatar.name}
			aria-label={alt || avatar.name}
			role='img'>
			{avatar.renderSvg('w-full h-full object-cover')}
		</div>
	);
});

export default KidAvatar;
