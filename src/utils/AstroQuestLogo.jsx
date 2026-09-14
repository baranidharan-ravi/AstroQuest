import React from 'react';

/**
 * AstroQuestLogo
 * Self-contained, responsive vector logo for AstroQuest.
 * Eliminates external file dependency or broken image icon issues across all environments.
 */
export const AstroQuestLogo = React.memo(function AstroQuestLogo({
	className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-lg shadow-sm flex-shrink-0',
	size = 512,
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 512 512'
			width={size}
			height={size}
			className={className}
			aria-label='AstroQuest Logo'
			role='img'>
			<defs>
				{/* Background Cosmic Gradient */}
				<radialGradient
					id='astroSpaceBg'
					cx='50%'
					cy='35%'
					r='65%'>
					<stop
						offset='0%'
						stopColor='#312E81'
					/>
					<stop
						offset='45%'
						stopColor='#1E1B4B'
					/>
					<stop
						offset='85%'
						stopColor='#0B0D28'
					/>
					<stop
						offset='100%'
						stopColor='#050614'
					/>
				</radialGradient>

				{/* Planet & Orbit Gradient */}
				<linearGradient
					id='astroRingGrad'
					x1='0%'
					y1='0%'
					x2='100%'
					y2='100%'>
					<stop
						offset='0%'
						stopColor='#38BDF8'
						stopOpacity='0.9'
					/>
					<stop
						offset='50%'
						stopColor='#A855F7'
						stopOpacity='0.6'
					/>
					<stop
						offset='100%'
						stopColor='#F43F5E'
						stopOpacity='0.2'
					/>
				</linearGradient>

				{/* Rocket Body Gradient */}
				<linearGradient
					id='astroRocketBody'
					x1='0%'
					y1='0%'
					x2='100%'
					y2='100%'>
					<stop
						offset='0%'
						stopColor='#FFFFFF'
					/>
					<stop
						offset='70%'
						stopColor='#F1F5F9'
					/>
					<stop
						offset='100%'
						stopColor='#CBD5E1'
					/>
				</linearGradient>

				{/* Rocket Wing / Nose Coral Gradient */}
				<linearGradient
					id='astroCoralGrad'
					x1='0%'
					y1='0%'
					x2='100%'
					y2='100%'>
					<stop
						offset='0%'
						stopColor='#FB7185'
					/>
					<stop
						offset='50%'
						stopColor='#F43F5E'
					/>
					<stop
						offset='100%'
						stopColor='#BE123C'
					/>
				</linearGradient>

				{/* Cockpit Glass Gradient */}
				<radialGradient
					id='astroCockpitGlass'
					cx='40%'
					cy='35%'
					r='65%'>
					<stop
						offset='0%'
						stopColor='#E0F2FE'
					/>
					<stop
						offset='40%'
						stopColor='#38BDF8'
					/>
					<stop
						offset='100%'
						stopColor='#0284C7'
					/>
				</radialGradient>

				{/* Rocket Boost Flame Gradient */}
				<linearGradient
					id='astroFlameOuter'
					x1='0%'
					y1='0%'
					x2='0%'
					y2='100%'>
					<stop
						offset='0%'
						stopColor='#FBBF24'
					/>
					<stop
						offset='45%'
						stopColor='#F97316'
					/>
					<stop
						offset='100%'
						stopColor='#EF4444'
						stopOpacity='0'
					/>
				</linearGradient>

				<linearGradient
					id='astroFlameInner'
					x1='0%'
					y1='0%'
					x2='0%'
					y2='100%'>
					<stop
						offset='0%'
						stopColor='#FFFFFF'
					/>
					<stop
						offset='50%'
						stopColor='#FEF08A'
					/>
					<stop
						offset='100%'
						stopColor='#F59E0B'
						stopOpacity='0'
					/>
				</linearGradient>

				{/* Glow Filter */}
				<filter
					id='astroGlow'
					x='-20%'
					y='-20%'
					width='140%'
					height='140%'>
					<feGaussianBlur
						stdDeviation='8'
						result='blur'
					/>
					<feComposite
						in='SourceGraphic'
						in2='blur'
						operator='over'
					/>
				</filter>
			</defs>

			{/* App Icon Squircle Base with Border */}
			<rect
				width='512'
				height='512'
				rx='112'
				fill='url(#astroSpaceBg)'
			/>
			<rect
				width='504'
				height='504'
				x='4'
				y='4'
				rx='108'
				fill='none'
				stroke='#4338CA'
				strokeWidth='4'
				strokeOpacity='0.6'
			/>

			{/* Glowing Stardust & Background Stars */}
			<circle
				cx='95'
				cy='115'
				r='3'
				fill='#38BDF8'
				opacity='0.8'
			/>
			<circle
				cx='140'
				cy='75'
				r='2'
				fill='#FFFFFF'
				opacity='0.6'
			/>
			<circle
				cx='410'
				cy='100'
				r='3.5'
				fill='#FBBF24'
				opacity='0.9'
			/>
			<circle
				cx='430'
				cy='380'
				r='2.5'
				fill='#38BDF8'
				opacity='0.7'
			/>
			<circle
				cx='80'
				cy='360'
				r='2'
				fill='#F43F5E'
				opacity='0.6'
			/>
			<circle
				cx='210'
				cy='430'
				r='2'
				fill='#FFFFFF'
				opacity='0.5'
			/>

			{/* Sparkling 4-Point Stars */}
			<path
				d='M 405 130 Q 405 150 425 150 Q 405 150 405 170 Q 405 150 385 150 Q 405 150 405 130 Z'
				fill='#FDE047'
				filter='url(#astroGlow)'
			/>
			<path
				d='M 125 180 Q 125 192 137 192 Q 125 192 125 204 Q 125 192 113 192 Q 125 192 125 180 Z'
				fill='#38BDF8'
			/>
			<path
				d='M 375 390 Q 375 400 385 400 Q 375 400 375 410 Q 375 400 365 400 Q 375 400 375 390 Z'
				fill='#F472B6'
			/>

			{/* Celestial Orbit Ring Behind Rocket */}
			<ellipse
				cx='256'
				cy='256'
				rx='200'
				ry='70'
				fill='none'
				stroke='url(#astroRingGrad)'
				strokeWidth='8'
				strokeDasharray='16 10'
				transform='rotate(-32 256 256)'
				opacity='0.7'
			/>

			{/* Distant Mini Moon/Planet */}
			<g transform='translate(100, 390)'>
				<circle
					cx='0'
					cy='0'
					r='28'
					fill='#4338CA'
					opacity='0.6'
				/>
				<ellipse
					cx='0'
					cy='0'
					rx='36'
					ry='10'
					fill='none'
					stroke='#6366F1'
					strokeWidth='3'
					transform='rotate(-20)'
				/>
			</g>

			{/* Rocket Ship (Centered & Soaring diagonally) */}
			<g transform='translate(256, 256) rotate(45) translate(-256, -256)'>
				{/* Thruster Exhaust Fire Trail */}
				<path
					d='M 230 360 C 215 425, 235 485, 256 505 C 277 485, 297 425, 282 360 Z'
					fill='url(#astroFlameOuter)'
					filter='url(#astroGlow)'
				/>
				<path
					d='M 240 360 C 232 410, 245 450, 256 465 C 267 450, 280 410, 272 360 Z'
					fill='url(#astroFlameInner)'
				/>

				{/* Thruster Metallic Nozzle */}
				<path
					d='M 234 350 L 278 350 L 284 366 L 228 366 Z'
					fill='#475569'
					stroke='#1E293B'
					strokeWidth='2'
				/>

				{/* Left Fin / Wing */}
				<path
					d='M 216 280 L 160 355 C 160 355, 185 375, 222 360 L 222 300 Z'
					fill='url(#astroCoralGrad)'
					stroke='#9F1239'
					strokeWidth='3'
					strokeLinejoin='round'
				/>

				{/* Right Fin / Wing */}
				<path
					d='M 296 280 L 352 355 C 352 355, 327 375, 290 360 L 290 300 Z'
					fill='url(#astroCoralGrad)'
					stroke='#9F1239'
					strokeWidth='3'
					strokeLinejoin='round'
				/>

				{/* Rocket Main Body */}
				<path
					d='M 256 80 C 295 140, 305 240, 290 355 C 275 362, 237 362, 222 355 C 207 240, 217 140, 256 80 Z'
					fill='url(#astroRocketBody)'
					stroke='#0F172A'
					strokeWidth='4'
				/>

				{/* Nose Cone Top Cap */}
				<path
					d='M 256 80 C 278 115, 285 155, 286 175 L 226 175 C 227 155, 234 115, 256 80 Z'
					fill='url(#astroCoralGrad)'
					stroke='#9F1239'
					strokeWidth='3'
				/>

				{/* Center Fin Ridge */}
				<path
					d='M 256 260 L 256 360'
					stroke='#CBD5E1'
					strokeWidth='4'
					strokeLinecap='round'
				/>

				{/* Porthole Cockpit */}
				<circle
					cx='256'
					cy='225'
					r='30'
					fill='#E2E8F0'
					stroke='#0F172A'
					strokeWidth='4'
				/>
				<circle
					cx='256'
					cy='225'
					r='23'
					fill='url(#astroCockpitGlass)'
				/>
				<ellipse
					cx='250'
					cy='217'
					rx='9'
					ry='5'
					fill='#FFFFFF'
					opacity='0.75'
					transform='rotate(-35 250 217)'
				/>

				{/* Body Stripe Accent */}
				<path
					d='M 224 320 C 240 326, 272 326, 288 320'
					fill='none'
					stroke='#F43F5E'
					strokeWidth='4'
					strokeLinecap='round'
				/>
			</g>

			{/* Golden Sparkle Trail behind Rocket */}
			<circle
				cx='170'
				cy='350'
				r='4'
				fill='#FDE047'
				opacity='0.9'
				filter='url(#astroGlow)'
			/>
			<circle
				cx='150'
				cy='385'
				r='6'
				fill='#F59E0B'
				opacity='0.8'
			/>
			<circle
				cx='120'
				cy='420'
				r='3'
				fill='#F97316'
				opacity='0.7'
			/>
		</svg>
	);
});

export default AstroQuestLogo;
