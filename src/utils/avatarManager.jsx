import React from 'react';

/**
 * avatarManager.jsx
 * Preset avatar images, gender-based default assignment, and KidAvatar component.
 * 100% vector SVG illustrations — crisp, responsive, and completely offline.
 */

export const PRESET_AVATARS = [
	// ─── Boys Collection ───────────────────────────────────────────────
	{
		id: 'boy-astronaut-1',
		name: 'Leo the Cadet',
		gender: 'boy',
		category: 'Boys',
		label: 'Astronaut Boy',
		bgGradient: 'from-blue-600 to-cyan-500',
		borderColor: 'border-cyan-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				{/* Background Circle */}
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#0E1E45'
				/>
				{/* Stars */}
				<circle
					cx='20'
					cy='25'
					r='1.5'
					fill='#67E8F9'
					opacity='0.8'
				/>
				<circle
					cx='80'
					cy='30'
					r='2'
					fill='#FDE047'
					opacity='0.8'
				/>
				<circle
					cx='82'
					cy='72'
					r='1.5'
					fill='#67E8F9'
					opacity='0.7'
				/>
				<circle
					cx='18'
					cy='68'
					r='1.5'
					fill='#FDE047'
					opacity='0.6'
				/>
				{/* Suit Neck */}
				<path
					d='M30 88 C30 76, 70 76, 70 88 Z'
					fill='#E2E8F0'
				/>
				<path
					d='M36 88 L64 88 L62 96 L38 96 Z'
					fill='#0284C7'
				/>
				{/* Helmet Outer */}
				<circle
					cx='50'
					cy='48'
					r='32'
					fill='#F8FAFC'
					stroke='#CBD5E1'
					strokeWidth='2.5'
				/>
				{/* Visor / Face Area */}
				<rect
					x='25'
					y='28'
					width='50'
					height='38'
					rx='19'
					fill='#0C4A6E'
				/>
				{/* Cosmic Visor Reflection Glow */}
				<path
					d='M28 38 C32 30, 44 29, 52 30 C40 33, 31 40, 28 48 Z'
					fill='#38BDF8'
					opacity='0.7'
				/>
				{/* Boy Face inside Visor */}
				<circle
					cx='50'
					cy='48'
					r='16'
					fill='#FCD34D'
				/>
				{/* Boy Hair (brown swoosh) */}
				<path
					d='M37 43 C37 36, 45 34, 56 35 C62 36, 63 39, 63 42 C61 40, 56 39, 52 40 C46 41, 41 44, 37 43 Z'
					fill='#78350F'
				/>
				{/* Eyes */}
				<circle
					cx='44'
					cy='48'
					r='2.2'
					fill='#1E293B'
				/>
				<circle
					cx='56'
					cy='48'
					r='2.2'
					fill='#1E293B'
				/>
				<circle
					cx='45'
					cy='47'
					r='0.8'
					fill='#FFFFFF'
				/>
				<circle
					cx='57'
					cy='47'
					r='0.8'
					fill='#FFFFFF'
				/>
				{/* Cheeks */}
				<circle
					cx='40'
					cy='52'
					r='2'
					fill='#F87171'
					opacity='0.6'
				/>
				<circle
					cx='60'
					cy='52'
					r='2'
					fill='#F87171'
					opacity='0.6'
				/>
				{/* Smile */}
				<path
					d='M46 53 Q50 58 54 53'
					stroke='#92400E'
					strokeWidth='1.8'
					strokeLinecap='round'
					fill='none'
				/>
				{/* Helmet Ear Badges */}
				<rect
					x='15'
					y='42'
					width='6'
					height='12'
					rx='3'
					fill='#0284C7'
				/>
				<rect
					x='79'
					y='42'
					width='6'
					height='12'
					rx='3'
					fill='#0284C7'
				/>
				<circle
					cx='18'
					cy='48'
					r='1.5'
					fill='#38BDF8'
				/>
				<circle
					cx='82'
					cy='48'
					r='1.5'
					fill='#38BDF8'
				/>
			</svg>
		),
	},
	{
		id: 'boy-ranger-2',
		name: 'Max the Ranger',
		gender: 'boy',
		category: 'Boys',
		label: 'Space Ranger Boy',
		bgGradient: 'from-amber-600 to-orange-500',
		borderColor: 'border-orange-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#311302'
				/>
				{/* Stars */}
				<circle
					cx='22'
					cy='22'
					r='1.8'
					fill='#FDBA74'
					opacity='0.8'
				/>
				<circle
					cx='84'
					cy='26'
					r='2'
					fill='#FDBA74'
					opacity='0.7'
				/>
				<circle
					cx='78'
					cy='76'
					r='1.5'
					fill='#FDBA74'
					opacity='0.8'
				/>
				{/* Suit Neck */}
				<path
					d='M28 86 C28 74, 72 74, 72 86 Z'
					fill='#EA580C'
				/>
				<path
					d='M38 86 L62 86 L60 94 L40 94 Z'
					fill='#7C2D12'
				/>
				{/* Head / Face */}
				<circle
					cx='50'
					cy='50'
					r='26'
					fill='#FDE047'
				/>
				{/* Boy Short Spiky Hair */}
				<path
					d='M30 44 C28 32, 38 24, 50 24 C62 24, 72 32, 70 44 C67 36, 62 34, 56 34 C50 34, 46 32, 42 34 C36 36, 32 38, 30 44 Z'
					fill='#451A03'
				/>
				<path
					d='M38 26 L42 18 L46 25 L52 16 L56 25 L62 20 L62 28 Z'
					fill='#451A03'
				/>
				{/* Ranger Comm Headset */}
				<path
					d='M26 48 C26 34, 74 34, 74 48'
					stroke='#EA580C'
					strokeWidth='4'
					strokeLinecap='round'
					fill='none'
				/>
				<rect
					x='22'
					y='44'
					width='7'
					height='14'
					rx='3.5'
					fill='#F97316'
					stroke='#9A3412'
					strokeWidth='1'
				/>
				<rect
					x='71'
					y='44'
					width='7'
					height='14'
					rx='3.5'
					fill='#F97316'
					stroke='#9A3412'
					strokeWidth='1'
				/>
				{/* Headset Mic */}
				<path
					d='M72 54 L64 64'
					stroke='#F97316'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
				<circle
					cx='63'
					cy='65'
					r='3'
					fill='#FB923C'
				/>
				{/* Eyes */}
				<circle
					cx='42'
					cy='49'
					r='2.5'
					fill='#1E293B'
				/>
				<circle
					cx='58'
					cy='49'
					r='2.5'
					fill='#1E293B'
				/>
				<circle
					cx='43'
					cy='48'
					r='1'
					fill='#FFFFFF'
				/>
				<circle
					cx='59'
					cy='48'
					r='1'
					fill='#FFFFFF'
				/>
				{/* Cheeks */}
				<circle
					cx='37'
					cy='54'
					r='2.5'
					fill='#FB923C'
					opacity='0.6'
				/>
				<circle
					cx='63'
					cy='54'
					r='2.5'
					fill='#FB923C'
					opacity='0.6'
				/>
				{/* Big Ranger Grin */}
				<path
					d='M43 55 Q50 63 57 55'
					stroke='#9A3412'
					strokeWidth='2.2'
					strokeLinecap='round'
					fill='none'
				/>
			</svg>
		),
	},
	{
		id: 'boy-cosmic-3',
		name: 'Sam the Star-Chaser',
		gender: 'boy',
		category: 'Boys',
		label: 'Star Chaser Boy',
		bgGradient: 'from-emerald-600 to-teal-500',
		borderColor: 'border-emerald-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#062C24'
				/>
				{/* Starlight */}
				<circle
					cx='20'
					cy='28'
					r='2'
					fill='#34D399'
					opacity='0.8'
				/>
				<circle
					cx='80'
					cy='24'
					r='1.5'
					fill='#A7F3D0'
					opacity='0.8'
				/>
				{/* Suit Neck */}
				<path
					d='M30 88 C30 76, 70 76, 70 88 Z'
					fill='#059669'
				/>
				<circle
					cx='50'
					cy='85'
					r='4'
					fill='#34D399'
				/>
				{/* Face */}
				<circle
					cx='50'
					cy='50'
					r='26'
					fill='#FED7AA'
				/>
				{/* Hair (messy curl) */}
				<path
					d='M28 42 C28 28, 42 22, 52 22 C64 22, 72 30, 72 42 C68 34, 60 32, 54 32 C48 32, 42 34, 38 32 C33 34, 30 38, 28 42 Z'
					fill='#18181B'
				/>
				{/* Star-Chaser Cosmic Goggles */}
				<rect
					x='30'
					y='40'
					width='18'
					height='15'
					rx='5'
					fill='#065F46'
					stroke='#10B981'
					strokeWidth='2'
				/>
				<rect
					x='52'
					y='40'
					width='18'
					height='15'
					rx='5'
					fill='#065F46'
					stroke='#10B981'
					strokeWidth='2'
				/>
				<rect
					x='47'
					y='45'
					width='6'
					height='3'
					fill='#10B981'
				/>
				<path
					d='M33 44 C36 42, 42 42, 44 44'
					stroke='#6EE7B7'
					strokeWidth='1.5'
					strokeLinecap='round'
				/>
				<path
					d='M55 44 C58 42, 64 42, 66 44'
					stroke='#6EE7B7'
					strokeWidth='1.5'
					strokeLinecap='round'
				/>
				{/* Nose & Cheerful Smile */}
				<circle
					cx='50'
					cy='58'
					r='1.5'
					fill='#F97316'
					opacity='0.7'
				/>
				<path
					d='M44 62 Q50 68 56 62'
					stroke='#7C2D12'
					strokeWidth='2'
					strokeLinecap='round'
					fill='none'
				/>
			</svg>
		),
	},

	// ─── Girls Collection ───────────────────────────────────────────────
	{
		id: 'girl-astronaut-1',
		name: 'Stella the Cadet',
		gender: 'girl',
		category: 'Girls',
		label: 'Astronaut Girl',
		bgGradient: 'from-fuchsia-600 to-pink-500',
		borderColor: 'border-pink-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				{/* Background Circle */}
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#380932'
				/>
				{/* Stars */}
				<circle
					cx='18'
					cy='24'
					r='1.8'
					fill='#F472B6'
					opacity='0.8'
				/>
				<circle
					cx='82'
					cy='28'
					r='2'
					fill='#FDF4FF'
					opacity='0.9'
				/>
				<circle
					cx='78'
					cy='74'
					r='1.5'
					fill='#F472B6'
					opacity='0.7'
				/>
				{/* Suit Neck */}
				<path
					d='M30 88 C30 76, 70 76, 70 88 Z'
					fill='#F8FAFC'
				/>
				<path
					d='M36 88 L64 88 L62 96 L38 96 Z'
					fill='#DB2777'
				/>
				{/* Helmet Outer */}
				<circle
					cx='50'
					cy='48'
					r='32'
					fill='#FFFFFF'
					stroke='#FBCFE8'
					strokeWidth='2.5'
				/>
				{/* Visor Area */}
				<rect
					x='25'
					y='28'
					width='50'
					height='38'
					rx='19'
					fill='#500724'
				/>
				{/* Starlight Visor Reflection */}
				<path
					d='M28 38 C32 30, 44 29, 52 30 C40 33, 31 40, 28 48 Z'
					fill='#F472B6'
					opacity='0.7'
				/>
				{/* Girl Face inside Visor */}
				<circle
					cx='50'
					cy='48'
					r='16'
					fill='#FED7AA'
				/>
				{/* Girl Hair (Cute side bangs) */}
				<path
					d='M36 43 C37 35, 46 33, 56 34 C63 35, 64 39, 64 42 C60 39, 54 38, 48 40 C42 42, 38 45, 36 43 Z'
					fill='#92400E'
				/>
				{/* Cute Hair Star Pin */}
				<path
					d='M60 38 L61.5 41 L64.5 41.5 L62 43.5 L63 46.5 L60.5 45 L58 46.5 L59 43.5 L56.5 41.5 L59.5 41 Z'
					fill='#FDE047'
				/>
				{/* Eyes with friendly eyelashes */}
				<circle
					cx='44'
					cy='48'
					r='2.2'
					fill='#1E293B'
				/>
				<circle
					cx='56'
					cy='48'
					r='2.2'
					fill='#1E293B'
				/>
				<circle
					cx='45'
					cy='47'
					r='0.8'
					fill='#FFFFFF'
				/>
				<circle
					cx='57'
					cy='47'
					r='0.8'
					fill='#FFFFFF'
				/>
				<path
					d='M42 45 L40 43'
					stroke='#1E293B'
					strokeWidth='1'
					strokeLinecap='round'
				/>
				<path
					d='M58 45 L60 43'
					stroke='#1E293B'
					strokeWidth='1'
					strokeLinecap='round'
				/>
				{/* Cheeks */}
				<circle
					cx='40'
					cy='52'
					r='2.2'
					fill='#F43F5E'
					opacity='0.6'
				/>
				<circle
					cx='60'
					cy='52'
					r='2.2'
					fill='#F43F5E'
					opacity='0.6'
				/>
				{/* Sweet Smile */}
				<path
					d='M46 53 Q50 58 54 53'
					stroke='#9A3412'
					strokeWidth='1.8'
					strokeLinecap='round'
					fill='none'
				/>
				{/* Helmet Pink Ear Badges */}
				<rect
					x='15'
					y='42'
					width='6'
					height='12'
					rx='3'
					fill='#EC4899'
				/>
				<rect
					x='79'
					y='42'
					width='6'
					height='12'
					rx='3'
					fill='#EC4899'
				/>
				<circle
					cx='18'
					cy='48'
					r='1.5'
					fill='#FDF2F8'
				/>
				<circle
					cx='82'
					cy='48'
					r='1.5'
					fill='#FDF2F8'
				/>
			</svg>
		),
	},
	{
		id: 'girl-explorer-2',
		name: 'Nova the Voyager',
		gender: 'girl',
		category: 'Girls',
		label: 'Star Voyager Girl',
		bgGradient: 'from-purple-600 to-indigo-500',
		borderColor: 'border-purple-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#1E0B36'
				/>
				{/* Distant Stars */}
				<circle
					cx='20'
					cy='20'
					r='2'
					fill='#DDD6FE'
					opacity='0.8'
				/>
				<circle
					cx='84'
					cy='22'
					r='1.5'
					fill='#DDD6FE'
					opacity='0.8'
				/>
				{/* Space Suit */}
				<path
					d='M28 86 C28 74, 72 74, 72 86 Z'
					fill='#7C3AED'
				/>
				<path
					d='M38 86 L62 86 L60 94 L40 94 Z'
					fill='#C4B5FD'
				/>
				{/* Head / Face */}
				<circle
					cx='50'
					cy='50'
					r='26'
					fill='#FCD34D'
				/>
				{/* Hair: Dual Space Puffs / Ponytails */}
				<circle
					cx='22'
					cy='38'
					r='10'
					fill='#451A03'
				/>
				<circle
					cx='78'
					cy='38'
					r='10'
					fill='#451A03'
				/>
				<circle
					cx='23'
					cy='38'
					r='4'
					fill='#8B5CF6'
				/>
				<circle
					cx='77'
					cy='38'
					r='4'
					fill='#8B5CF6'
				/>
				{/* Main Hair Volume */}
				<path
					d='M28 42 C28 28, 42 22, 52 22 C64 22, 72 28, 72 42 C66 34, 60 32, 52 32 C44 32, 34 34, 28 42 Z'
					fill='#451A03'
				/>
				{/* Cosmic Starlight Headband */}
				<path
					d='M28 36 C34 30, 66 30, 72 36'
					stroke='#A78BFA'
					strokeWidth='3'
					strokeLinecap='round'
					fill='none'
				/>
				<polygon
					points='50,27 52,31 56,31 53,33 54,37 50,34 46,37 47,33 44,31 48,31'
					fill='#FDE047'
				/>
				{/* Big Curious Eyes */}
				<circle
					cx='43'
					cy='50'
					r='2.8'
					fill='#1E1B4B'
				/>
				<circle
					cx='57'
					cy='50'
					r='2.8'
					fill='#1E1B4B'
				/>
				<circle
					cx='44.5'
					cy='48.5'
					r='1.1'
					fill='#FFFFFF'
				/>
				<circle
					cx='58.5'
					cy='48.5'
					r='1.1'
					fill='#FFFFFF'
				/>
				{/* Rosy Cheeks */}
				<circle
					cx='37'
					cy='55'
					r='2.5'
					fill='#F472B6'
					opacity='0.6'
				/>
				<circle
					cx='63'
					cy='55'
					r='2.5'
					fill='#F472B6'
					opacity='0.6'
				/>
				{/* Cheerful Smile */}
				<path
					d='M45 56 Q50 63 55 56'
					stroke='#831843'
					strokeWidth='2'
					strokeLinecap='round'
					fill='none'
				/>
			</svg>
		),
	},
	{
		id: 'girl-cosmic-3',
		name: 'Maya the Scientist',
		gender: 'girl',
		category: 'Girls',
		label: 'Astro-Scientist Girl',
		bgGradient: 'from-teal-600 to-cyan-500',
		borderColor: 'border-teal-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#042F2E'
				/>
				{/* Stars */}
				<circle
					cx='22'
					cy='26'
					r='2'
					fill='#5EEAD4'
					opacity='0.8'
				/>
				<circle
					cx='82'
					cy='22'
					r='1.5'
					fill='#A7F3D0'
					opacity='0.8'
				/>
				{/* Suit Neck */}
				<path
					d='M30 88 C30 76, 70 76, 70 88 Z'
					fill='#0D9488'
				/>
				<path
					d='M40 88 L60 88 L58 96 L42 96 Z'
					fill='#CCFBF1'
				/>
				{/* Face */}
				<circle
					cx='50'
					cy='50'
					r='26'
					fill='#FED7AA'
				/>
				{/* Hair (Short bob with dark waves) */}
				<path
					d='M26 44 C26 28, 40 22, 50 22 C62 22, 74 28, 74 44 C74 54, 71 58, 68 58 C68 44, 64 34, 52 34 C42 34, 32 44, 32 58 C29 58, 26 54, 26 44 Z'
					fill='#172554'
				/>
				{/* Round Science Goggles */}
				<circle
					cx='41'
					cy='48'
					r='9'
					fill='#134E4A'
					stroke='#2DD4BF'
					strokeWidth='2'
				/>
				<circle
					cx='59'
					cy='48'
					r='9'
					fill='#134E4A'
					stroke='#2DD4BF'
					strokeWidth='2'
				/>
				<line
					x1='50'
					y1='48'
					x2='50'
					y2='48'
					stroke='#2DD4BF'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
				{/* Eyes inside goggles */}
				<circle
					cx='41'
					cy='48'
					r='3'
					fill='#FFFFFF'
				/>
				<circle
					cx='59'
					cy='48'
					r='3'
					fill='#FFFFFF'
				/>
				<circle
					cx='42'
					cy='48'
					r='1.5'
					fill='#0F172A'
				/>
				<circle
					cx='60'
					cy='48'
					r='1.5'
					fill='#0F172A'
				/>
				{/* Sparkle Glint */}
				<circle
					cx='39'
					cy='45'
					r='1'
					fill='#99F6E4'
				/>
				<circle
					cx='57'
					cy='45'
					r='1'
					fill='#99F6E4'
				/>
				{/* Warm Confident Smile */}
				<path
					d='M44 61 Q50 67 56 61'
					stroke='#9A3412'
					strokeWidth='2'
					strokeLinecap='round'
					fill='none'
				/>
			</svg>
		),
	},

	// ─── Cosmic Pals & Explorers ────────────────────────────────────────
	{
		id: 'explorer-rover',
		name: 'Alex the Star Rover',
		gender: 'neutral',
		category: 'Cosmic Pals',
		label: 'Cosmic Star Rover',
		bgGradient: 'from-amber-500 to-yellow-400',
		borderColor: 'border-yellow-300',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#1C1917'
				/>
				{/* Nebula Glow */}
				<circle
					cx='50'
					cy='50'
					r='38'
					fill='#451A03'
					opacity='0.6'
				/>
				{/* Stars */}
				<circle
					cx='20'
					cy='24'
					r='2'
					fill='#FDE047'
				/>
				<circle
					cx='80'
					cy='26'
					r='1.5'
					fill='#FDE047'
				/>
				{/* Suit Neck */}
				<path
					d='M30 88 C30 76, 70 76, 70 88 Z'
					fill='#E2E8F0'
				/>
				<path
					d='M36 88 L64 88 L62 96 L38 96 Z'
					fill='#F59E0B'
				/>
				{/* Deep Space Gold Visor Helmet */}
				<circle
					cx='50'
					cy='48'
					r='32'
					fill='#F8FAFC'
					stroke='#E2E8F0'
					strokeWidth='2'
				/>
				{/* Giant Golden Mirror Visor */}
				<rect
					x='24'
					y='26'
					width='52'
					height='42'
					rx='21'
					fill='#B45309'
					stroke='#FDE047'
					strokeWidth='2'
				/>
				<path
					d='M26 36 C34 26, 52 26, 68 34 C52 30, 36 36, 28 48 Z'
					fill='#FDE047'
					opacity='0.8'
				/>
				<path
					d='M30 52 C42 46, 58 48, 70 56 C56 50, 42 52, 34 60 Z'
					fill='#F59E0B'
					opacity='0.6'
				/>
				{/* Astronaut Antenna */}
				<line
					x1='50'
					y1='16'
					x2='50'
					y2='8'
					stroke='#CBD5E1'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
				<circle
					cx='50'
					cy='7'
					r='3'
					fill='#F59E0B'
				/>
			</svg>
		),
	},
	{
		id: 'explorer-cadet',
		name: 'Sky the Cosmic Pilot',
		gender: 'neutral',
		category: 'Cosmic Pals',
		label: 'Cosmic Jet Pilot',
		bgGradient: 'from-sky-600 to-indigo-600',
		borderColor: 'border-sky-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#0A0F2C'
				/>
				<circle
					cx='24'
					cy='22'
					r='1.5'
					fill='#38BDF8'
				/>
				<circle
					cx='82'
					cy='24'
					r='2'
					fill='#818CF8'
				/>
				{/* Futuristic Pilot Suit */}
				<path
					d='M26 88 C26 72, 74 72, 74 88 Z'
					fill='#1E293B'
					stroke='#0284C7'
					strokeWidth='2'
				/>
				<polygon
					points='50,78 44,88 56,88'
					fill='#38BDF8'
				/>
				{/* Pilot Helmet */}
				<circle
					cx='50'
					cy='48'
					r='30'
					fill='#0F172A'
					stroke='#0284C7'
					strokeWidth='2.5'
				/>
				{/* Neon Cyan Winged Visor */}
				<path
					d='M24 44 Q50 36 76 44 Q50 62 24 44 Z'
					fill='#0284C7'
					stroke='#38BDF8'
					strokeWidth='2'
				/>
				<path
					d='M32 43 Q50 39 68 43'
					stroke='#E0F2FE'
					strokeWidth='2'
					strokeLinecap='round'
				/>
				<circle
					cx='50'
					cy='22'
					r='3'
					fill='#38BDF8'
				/>
			</svg>
		),
	},
	{
		id: 'robot-beep',
		name: 'Beep the Astro-Bot',
		gender: 'neutral',
		category: 'Cosmic Pals',
		label: 'Friendly Astro-Bot',
		bgGradient: 'from-blue-500 to-indigo-500',
		borderColor: 'border-blue-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#0B132B'
				/>
				{/* Robot Antenna */}
				<line
					x1='50'
					y1='24'
					x2='50'
					y2='12'
					stroke='#60A5FA'
					strokeWidth='3'
					strokeLinecap='round'
				/>
				<circle
					cx='50'
					cy='10'
					r='4'
					fill='#38BDF8'
					className='animate-pulse'
				/>
				{/* Robot Ears/Bolts */}
				<rect
					x='18'
					y='42'
					width='6'
					height='16'
					rx='2'
					fill='#3B82F6'
				/>
				<rect
					x='76'
					y='42'
					width='6'
					height='16'
					rx='2'
					fill='#3B82F6'
				/>
				{/* Robot Head */}
				<rect
					x='24'
					y='24'
					width='52'
					height='48'
					rx='14'
					fill='#1E293B'
					stroke='#60A5FA'
					strokeWidth='2.5'
				/>
				{/* Screen / Visor */}
				<rect
					x='30'
					y='32'
					width='40'
					height='24'
					rx='8'
					fill='#0F172A'
					stroke='#38BDF8'
					strokeWidth='1.5'
				/>
				{/* Glowing Pixel Eyes */}
				<rect
					x='36'
					y='38'
					width='8'
					height='8'
					rx='3'
					fill='#38BDF8'
				/>
				<rect
					x='56'
					y='38'
					width='8'
					height='8'
					rx='3'
					fill='#38BDF8'
				/>
				<circle
					cx='39'
					cy='41'
					r='1'
					fill='#FFFFFF'
				/>
				<circle
					cx='59'
					cy='41'
					r='1'
					fill='#FFFFFF'
				/>
				{/* Cute Digital Smile */}
				<path
					d='M42 62 H58'
					stroke='#38BDF8'
					strokeWidth='3'
					strokeLinecap='round'
				/>
				<circle
					cx='42'
					cy='62'
					r='1'
					fill='#60A5FA'
				/>
				<circle
					cx='58'
					cy='62'
					r='1'
					fill='#60A5FA'
				/>
				{/* Neck & Body */}
				<rect
					x='42'
					y='72'
					width='16'
					height='8'
					fill='#475569'
				/>
				<path
					d='M30 88 C30 80, 70 80, 70 88 Z'
					fill='#334155'
					stroke='#60A5FA'
					strokeWidth='1.5'
				/>
			</svg>
		),
	},
	{
		id: 'pet-cat',
		name: 'Luna the Space Kitty',
		gender: 'neutral',
		category: 'Cosmic Pals',
		label: 'Cosmic Space Cat',
		bgGradient: 'from-pink-500 to-rose-400',
		borderColor: 'border-pink-300',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#2A0B20'
				/>
				<circle
					cx='20'
					cy='22'
					r='1.5'
					fill='#F472B6'
				/>
				<circle
					cx='82'
					cy='26'
					r='2'
					fill='#FDE047'
				/>
				{/* Bubble Helmet Outer */}
				<circle
					cx='50'
					cy='48'
					r='34'
					fill='#F472B6'
					fillOpacity='0.15'
					stroke='#F472B6'
					strokeWidth='2.5'
				/>
				{/* Helmet Sheen */}
				<path
					d='M26 34 C34 22, 54 20, 68 28 C52 24, 36 28, 28 40 Z'
					fill='#FFFFFF'
					opacity='0.6'
				/>
				{/* Cat Ears */}
				<polygon
					points='32,36 38,18 48,30'
					fill='#FB923C'
					stroke='#EA580C'
					strokeWidth='1.5'
				/>
				<polygon
					points='36,33 40,22 46,29'
					fill='#FBCFE8'
				/>
				<polygon
					points='68,36 62,18 52,30'
					fill='#FB923C'
					stroke='#EA580C'
					strokeWidth='1.5'
				/>
				<polygon
					points='64,33 60,22 54,29'
					fill='#FBCFE8'
				/>
				{/* Cat Face */}
				<circle
					cx='50'
					cy='50'
					r='20'
					fill='#FDBA74'
				/>
				{/* Cat Eyes */}
				<ellipse
					cx='43'
					cy='48'
					rx='2.5'
					ry='3.5'
					fill='#065F46'
				/>
				<ellipse
					cx='57'
					cy='48'
					rx='2.5'
					ry='3.5'
					fill='#065F46'
				/>
				<circle
					cx='44'
					cy='47'
					r='1'
					fill='#FFFFFF'
				/>
				<circle
					cx='58'
					cy='47'
					r='1'
					fill='#FFFFFF'
				/>
				{/* Tiny Pink Nose & Whiskers */}
				<polygon
					points='50,53 48,56 52,56'
					fill='#F43F5E'
				/>
				<path
					d='M48 56 Q50 59 52 56'
					stroke='#9A3412'
					strokeWidth='1.2'
					fill='none'
				/>
				<line
					x1='36'
					y1='53'
					x2='28'
					y2='51'
					stroke='#EA580C'
					strokeWidth='1.2'
					strokeLinecap='round'
				/>
				<line
					x1='36'
					y1='56'
					x2='28'
					y2='57'
					stroke='#EA580C'
					strokeWidth='1.2'
					strokeLinecap='round'
				/>
				<line
					x1='64'
					y1='53'
					x2='72'
					y2='51'
					stroke='#EA580C'
					strokeWidth='1.2'
					strokeLinecap='round'
				/>
				<line
					x1='64'
					y1='56'
					x2='72'
					y2='57'
					stroke='#EA580C'
					strokeWidth='1.2'
					strokeLinecap='round'
				/>
				{/* Collar */}
				<path
					d='M38 82 C38 74, 62 74, 62 82 Z'
					fill='#EC4899'
				/>
				<circle
					cx='50'
					cy='80'
					r='3'
					fill='#FDE047'
				/>
			</svg>
		),
	},
	{
		id: 'pet-dog',
		name: 'Rocket the Star Pup',
		gender: 'neutral',
		category: 'Cosmic Pals',
		label: 'Cosmic Space Pup',
		bgGradient: 'from-amber-600 to-yellow-500',
		borderColor: 'border-yellow-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#1C1004'
				/>
				<circle
					cx='20'
					cy='24'
					r='2'
					fill='#FDE047'
				/>
				<circle
					cx='80'
					cy='24'
					r='1.5'
					fill='#FDE047'
				/>
				{/* Bubble Helmet */}
				<circle
					cx='50'
					cy='48'
					r='34'
					fill='#FDE047'
					fillOpacity='0.12'
					stroke='#F59E0B'
					strokeWidth='2.5'
				/>
				<path
					d='M26 34 C34 22, 54 20, 68 28 C52 24, 36 28, 28 40 Z'
					fill='#FFFFFF'
					opacity='0.6'
				/>
				{/* Floppy Ears */}
				<path
					d='M28 36 C24 36, 20 48, 24 58 C28 58, 32 50, 32 42 Z'
					fill='#78350F'
				/>
				<path
					d='M72 36 C76 36, 80 48, 76 58 C72 58, 68 50, 68 42 Z'
					fill='#78350F'
				/>
				{/* Dog Face */}
				<circle
					cx='50'
					cy='50'
					r='21'
					fill='#FED7AA'
				/>
				{/* Brown Patch over left eye */}
				<circle
					cx='42'
					cy='46'
					r='8'
					fill='#B45309'
					opacity='0.6'
				/>
				{/* Big Friendly Eyes */}
				<circle
					cx='43'
					cy='47'
					r='3'
					fill='#1E293B'
				/>
				<circle
					cx='57'
					cy='47'
					r='3'
					fill='#1E293B'
				/>
				<circle
					cx='44'
					cy='46'
					r='1.2'
					fill='#FFFFFF'
				/>
				<circle
					cx='58'
					cy='46'
					r='1.2'
					fill='#FFFFFF'
				/>
				{/* Dog Snout & Nose */}
				<ellipse
					cx='50'
					cy='56'
					rx='7'
					ry='5'
					fill='#FDBA74'
				/>
				<ellipse
					cx='50'
					cy='54'
					rx='3'
					ry='2.2'
					fill='#1E293B'
				/>
				<path
					d='M50 56 L50 59 M47 59 Q50 62 53 59'
					stroke='#1E293B'
					strokeWidth='1.5'
					strokeLinecap='round'
				/>
				{/* Tongue out */}
				<path
					d='M49 60 Q50 65 52 63'
					stroke='#F43F5E'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
			</svg>
		),
	},
	{
		id: 'alien-zog',
		name: 'Zog the Friendly Martian',
		gender: 'neutral',
		category: 'Cosmic Pals',
		label: 'Friendly Martian Alien',
		bgGradient: 'from-emerald-500 to-lime-500',
		borderColor: 'border-lime-400',
		renderSvg: (className) => (
			<svg
				viewBox='0 0 100 100'
				className={className}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx='50'
					cy='50'
					r='48'
					fill='#062412'
				/>
				<circle
					cx='18'
					cy='22'
					r='2'
					fill='#A3E635'
				/>
				<circle
					cx='82'
					cy='24'
					r='1.5'
					fill='#86EFAC'
				/>
				{/* Martian Antennae with glowing orbs */}
				<path
					d='M38 30 Q32 16 30 12'
					stroke='#84CC16'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
				<circle
					cx='29'
					cy='11'
					r='3.5'
					fill='#FACC15'
				/>
				<path
					d='M62 30 Q68 16 70 12'
					stroke='#84CC16'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
				<circle
					cx='71'
					cy='11'
					r='3.5'
					fill='#FACC15'
				/>
				{/* Alien Head */}
				<ellipse
					cx='50'
					cy='48'
					rx='26'
					ry='24'
					fill='#84CC16'
				/>
				{/* Big 3 Cosmic Eyes */}
				<circle
					cx='36'
					cy='44'
					r='6'
					fill='#FFFFFF'
					stroke='#4D7C0F'
					strokeWidth='1.5'
				/>
				<circle
					cx='50'
					cy='38'
					r='7'
					fill='#FFFFFF'
					stroke='#4D7C0F'
					strokeWidth='1.5'
				/>
				<circle
					cx='64'
					cy='44'
					r='6'
					fill='#FFFFFF'
					stroke='#4D7C0F'
					strokeWidth='1.5'
				/>
				<circle
					cx='36'
					cy='44'
					r='3'
					fill='#15803D'
				/>
				<circle
					cx='50'
					cy='38'
					r='3.5'
					fill='#15803D'
				/>
				<circle
					cx='64'
					cy='44'
					r='3'
					fill='#15803D'
				/>
				<circle
					cx='35'
					cy='43'
					r='1'
					fill='#FFFFFF'
				/>
				<circle
					cx='49'
					cy='37'
					r='1.2'
					fill='#FFFFFF'
				/>
				<circle
					cx='63'
					cy='43'
					r='1'
					fill='#FFFFFF'
				/>
				{/* Wide Friendly Smile with 1 cute little tooth */}
				<path
					d='M40 58 Q50 66 60 58'
					stroke='#365314'
					strokeWidth='2.5'
					strokeLinecap='round'
					fill='#1E3A18'
				/>
				<polygon
					points='48,58 52,58 50,61'
					fill='#FFFFFF'
				/>
				{/* Suit Neck */}
				<path
					d='M32 86 C32 74, 68 74, 68 86 Z'
					fill='#65A30D'
				/>
				<circle
					cx='50'
					cy='82'
					r='3'
					fill='#FACC15'
				/>
			</svg>
		),
	},
];

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
