import { memo } from 'react';

/**
 * LivingPetCharacter
 *
 * An articulated, living interactive vector companion featuring:
 * - Animated walking trot with alternating paw cycles and ear sways
 * - Drinking mode: milk/water bowl, head dip, pink tongue lapping, expanding ripples & water splashes
 * - Eating mode: kibble bowl with bone treats, chewing jaws, head bob & crunching crumbs
 * - Playing mode: jumping/batting paws with squash-and-stretch bouncing star ball
 * - Cuddle mode: rapid tail wagging, happy barking mouth, blush cheeks & heart particles
 * - Napping mode: tucked paws, closed happy eyes, slow rhythmic breathing & drifting Zzz
 */
export const LivingPetCharacter = memo(function LivingPetCharacter({
	petType = 'dog',
	livingState = 'idle', // 'idle' | 'walking' | 'drinking' | 'eating' | 'playing' | 'cuddling' | 'napping' | 'spin' | 'squash'
	isBlinking = false,
	direction = 1, // 1: facing right, -1: facing left
	size = 148,
}) {
	// Active state booleans for styling
	const isDrinking = livingState === 'drinking';
	const isEating = livingState === 'eating';
	const isWalking = livingState === 'walking';
	const isPlaying = livingState === 'playing';
	const isCuddling = livingState === 'cuddling';
	const isNapping = livingState === 'napping';
	const isHappy = isDrinking || isEating || isCuddling || isPlaying;

	return (
		<div
			style={{
				width: `${size}px`,
				height: `${size}px`,
				transform: `scaleX(${direction})`,
				transition: 'transform 0.3s ease-out',
			}}
			className={`relative select-none pointer-events-none ${
				isWalking ? 'animate-walk-trot'
				: isDrinking || isEating ? 'animate-pet-lap'
				: isPlaying ? 'animate-ball-bounce'
				: isNapping ? 'animate-pet-breathe'
				: 'animate-pet-breathe'
			}`}>
			<svg
				viewBox='0 0 160 160'
				className='w-full h-full filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.55)] overflow-visible'
				xmlns='http://www.w3.org/2000/svg'>
				<defs>
					{/* ─── Puppy Gradients & Filters ─── */}
					<radialGradient
						id='puppyFur'
						cx='40%'
						cy='35%'
						r='65%'>
						<stop
							offset='0%'
							stopColor='#FDE68A'
						/>
						<stop
							offset='50%'
							stopColor='#F59E0B'
						/>
						<stop
							offset='100%'
							stopColor='#D97706'
						/>
					</radialGradient>

					<linearGradient
						id='puppyEar'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='100%'>
						<stop
							offset='0%'
							stopColor='#F59E0B'
						/>
						<stop
							offset='100%'
							stopColor='#B45309'
						/>
					</linearGradient>

					<radialGradient
						id='puppyMuzzle'
						cx='50%'
						cy='35%'
						r='60%'>
						<stop
							offset='0%'
							stopColor='#FFFBEB'
						/>
						<stop
							offset='100%'
							stopColor='#FEF3C7'
						/>
					</radialGradient>

					<linearGradient
						id='helmetRim'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='100%'>
						<stop
							offset='0%'
							stopColor='#FFFFFF'
						/>
						<stop
							offset='60%'
							stopColor='#E2E8F0'
						/>
						<stop
							offset='100%'
							stopColor='#94A3B8'
						/>
					</linearGradient>

					<radialGradient
						id='helmetVisor'
						cx='35%'
						cy='30%'
						r='70%'>
						<stop
							offset='0%'
							stopColor='rgba(255, 255, 255, 0.65)'
						/>
						<stop
							offset='30%'
							stopColor='rgba(224, 242, 254, 0.25)'
						/>
						<stop
							offset='75%'
							stopColor='rgba(56, 189, 248, 0.12)'
						/>
						<stop
							offset='100%'
							stopColor='rgba(30, 27, 75, 0.45)'
						/>
					</radialGradient>

					<linearGradient
						id='spaceSuitGrad'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='100%'>
						<stop
							offset='0%'
							stopColor='#6366F1'
						/>
						<stop
							offset='50%'
							stopColor='#4338CA'
						/>
						<stop
							offset='100%'
							stopColor='#312E81'
						/>
					</linearGradient>

					<linearGradient
						id='milkLiquid'
						x1='0%'
						y1='0%'
						x2='0%'
						y2='100%'>
						<stop
							offset='0%'
							stopColor='#FFFFFF'
						/>
						<stop
							offset='60%'
							stopColor='#E0F2FE'
						/>
						<stop
							offset='100%'
							stopColor='#BAE6FD'
						/>
					</linearGradient>

					<linearGradient
						id='milkBowlGrad'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='100%'>
						<stop
							offset='0%'
							stopColor='#38BDF8'
						/>
						<stop
							offset='100%'
							stopColor='#0284C7'
						/>
					</linearGradient>

					<linearGradient
						id='kibbleBowlGrad'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='100%'>
						<stop
							offset='0%'
							stopColor='#FB923C'
						/>
						<stop
							offset='100%'
							stopColor='#EA580C'
						/>
					</linearGradient>

					<linearGradient
						id='kibbleBone'
						x1='0%'
						y1='0%'
						x2='100%'
						y2='100%'>
						<stop
							offset='0%'
							stopColor='#FEF08A'
						/>
						<stop
							offset='100%'
							stopColor='#CA8A04'
						/>
					</linearGradient>
				</defs>

				{/* ═══════════════════════════════════════════════════════════════ */}
				{/* 1. ROCKET THE LIVING PUPPY (Golden Retriever Astronaut)       */}
				{/* ═══════════════════════════════════════════════════════════════ */}
				{petType === 'dog' && (
					<g className='living-puppy'>
						{/* ─── Tail (Back layer) ─── */}
						<g
							className={`${
								isCuddling || isHappy ? 'animate-tail-swish'
								: isWalking ? 'animate-tail-swish'
								: isNapping ? ''
								: 'animate-tail-swish'
							}`}
							style={{ transformOrigin: '42px 96px' }}>
							<path
								d='M42 96 C28 92, 14 80, 16 64 C17 56, 26 58, 28 66 C30 76, 36 86, 44 92 Z'
								fill='url(#puppyFur)'
								stroke='#B45309'
								strokeWidth='1.5'
								strokeLinejoin='round'
							/>
							{/* Tail fur tufts */}
							<path
								d='M20 62 C22 72, 28 82, 38 88'
								stroke='#FEF3C7'
								strokeWidth='1.2'
								strokeLinecap='round'
								fill='none'
							/>
						</g>

						{/* ─── Hind Paws (Back Left & Right) ─── */}
						<g
							className={isWalking ? 'animate-paw-back' : ''}
							style={{ transformOrigin: '56px 104px' }}>
							<ellipse
								cx='56'
								cy={isNapping ? '110' : '116'}
								rx='10'
								ry='7'
								fill='url(#puppyFur)'
								stroke='#B45309'
								strokeWidth='1.2'
							/>
							{/* Pink paw pads */}
							<circle
								cx='56'
								cy={isNapping ? '110' : '116'}
								r='3'
								fill='#FB7185'
							/>
							<circle
								cx='52'
								cy={isNapping ? '108' : '113'}
								r='1.3'
								fill='#FB7185'
							/>
							<circle
								cx='56'
								cy={isNapping ? '106' : '111'}
								r='1.3'
								fill='#FB7185'
							/>
							<circle
								cx='60'
								cy={isNapping ? '108' : '113'}
								r='1.3'
								fill='#FB7185'
							/>
						</g>

						{/* ─── Space Suit Body & Backpack ─── */}
						<g className='puppy-body'>
							{/* Suit base with galaxy pattern */}
							<rect
								x='46'
								y='78'
								width='46'
								height='40'
								rx='18'
								fill='url(#spaceSuitGrad)'
								stroke='#312E81'
								strokeWidth='1.5'
							/>
							{/* Soft cream chest tummy */}
							<ellipse
								cx='69'
								cy='99'
								rx='14'
								ry='12'
								fill='url(#puppyMuzzle)'
								opacity='0.95'
							/>

							{/* Little golden space stars on suit (matching uploaded reference!) */}
							<path
								d='M52 87 L53 89 L55 89 L53.5 90.5 L54 92.5 L52 91 L50 92.5 L50.5 90.5 L49 89 L51 89 Z'
								fill='#FDE047'
							/>
							<path
								d='M83 91 L83.8 92.5 L85.5 92.5 L84.2 93.6 L84.7 95 L83 94 L81.3 95 L81.8 93.6 L80.5 92.5 L82.2 92.5 Z'
								fill='#FDE047'
							/>
							<circle
								cx='55'
								cy='98'
								r='1.2'
								fill='#38BDF8'
							/>
							<circle
								cx='80'
								cy='83'
								r='1.4'
								fill='#F472B6'
							/>

							{/* Collar with shiny golden star pendant */}
							<path
								d='M52 82 Q69 88 86 82'
								stroke='#EF4444'
								strokeWidth='3.5'
								strokeLinecap='round'
								fill='none'
							/>
							<circle
								cx='69'
								cy='87'
								r='4'
								fill='#FACC15'
								stroke='#CA8A04'
								strokeWidth='1'
							/>
							<path
								d='M69 84.5 L69.8 86.2 L71.5 86.2 L70.2 87.2 L70.7 89 L69 88 L67.3 89 L67.8 87.2 L66.5 86.2 L68.2 86.2 Z'
								fill='#FEF08A'
							/>
						</g>

						{/* ─── Front Paws (Left & Right) ─── */}
						<g
							className={
								isWalking ? 'animate-paw-front'
								: isPlaying ?
									'animate-ball-bounce'
								:	''
							}
							style={{ transformOrigin: '82px 104px' }}>
							<ellipse
								cx='82'
								cy={
									isDrinking || isEating ? '118'
									: isNapping ?
										'108'
									:	'116'
								}
								rx='10'
								ry='7'
								fill='url(#puppyFur)'
								stroke='#B45309'
								strokeWidth='1.2'
							/>
							{/* Pink paw pads */}
							<circle
								cx='82'
								cy={
									isDrinking || isEating ? '118'
									: isNapping ?
										'108'
									:	'116'
								}
								r='3'
								fill='#FB7185'
							/>
							<circle
								cx='78'
								cy={
									isDrinking || isEating ? '115'
									: isNapping ?
										'105'
									:	'113'
								}
								r='1.3'
								fill='#FB7185'
							/>
							<circle
								cx='82'
								cy={
									isDrinking || isEating ? '113'
									: isNapping ?
										'103'
									:	'111'
								}
								r='1.3'
								fill='#FB7185'
							/>
							<circle
								cx='86'
								cy={
									isDrinking || isEating ? '115'
									: isNapping ?
										'105'
									:	'113'
								}
								r='1.3'
								fill='#FB7185'
							/>
						</g>

						{/* ─── Head, Helmet & Face (Articulated Head Group) ─── */}
						<g
							className={`puppy-head ${
								isDrinking || isEating ? 'animate-jaw-chew'
								: isWalking ? 'animate-walk-trot'
								: ''
							}`}
							style={{
								transformOrigin: '78px 62px',
								transform:
									isDrinking || isEating ?
										'translateY(8px) rotate(6deg)'
									:	undefined,
								transition: 'transform 0.3s ease-out',
							}}>
							{/* Helmet Ring (Back Shadow) */}
							<circle
								cx='78'
								cy='58'
								r='37'
								fill='url(#helmetRim)'
								stroke='#64748B'
								strokeWidth='2'
							/>

							{/* Floppy Golden Ears (Framed outside/inside helmet) */}
							{/* Left Ear */}
							<g
								className='animate-ear-flop-1'
								style={{ transformOrigin: '52px 42px' }}>
								<path
									d='M52 42 C40 45, 34 60, 38 76 C41 84, 48 83, 50 74 C52 64, 53 52, 54 44 Z'
									fill='url(#puppyEar)'
									stroke='#92400E'
									strokeWidth='1.3'
								/>
							</g>
							{/* Right Ear */}
							<g
								className='animate-ear-flop-2'
								style={{ transformOrigin: '102px 42px' }}>
								<path
									d='M102 42 C114 45, 120 60, 116 76 C113 84, 106 83, 104 74 C102 64, 101 52, 100 44 Z'
									fill='url(#puppyEar)'
									stroke='#92400E'
									strokeWidth='1.3'
								/>
							</g>

							{/* Puppy Head Sphere */}
							<circle
								cx='78'
								cy='58'
								r='27'
								fill='url(#puppyFur)'
								stroke='#B45309'
								strokeWidth='1.2'
							/>

							{/* Forehead Golden Tuft */}
							<path
								d='M74 34 Q78 28 82 34 Q78 31 74 34 Z'
								fill='#FEF3C7'
								opacity='0.9'
							/>

							{/* Cream Muzzle */}
							<ellipse
								cx='78'
								cy='66'
								rx='14'
								ry='10'
								fill='url(#puppyMuzzle)'
								stroke='#FCD34D'
								strokeWidth='0.8'
							/>

							{/* Shiny Black Puppy Nose */}
							<path
								d='M74 61 C75 59, 81 59, 82 61 C83 63, 80 65, 78 66 C76 65, 73 63, 74 61 Z'
								fill='#0F172A'
							/>
							{/* Nose white shine reflection dot */}
							<circle
								cx='76'
								cy='61'
								r='0.9'
								fill='#FFFFFF'
							/>

							{/* ─── Living Eyes (Blinking / Closed / Heart / Sparkle) ─── */}
							{isBlinking || isNapping ?
								/* Closed Happy Eyelid Arcs (⌒ ⌒) */
								<g
									stroke='#451A03'
									strokeWidth='2.2'
									strokeLinecap='round'
									fill='none'>
									<path d='M65 54 Q69 49 73 54' />
									<path d='M83 54 Q87 49 91 54' />
								</g>
							: isDrinking || isEating ?
								/* Contented Smiling Eyes */
								<g
									stroke='#451A03'
									strokeWidth='2.2'
									strokeLinecap='round'
									fill='none'>
									<path d='M65 54 Q69 50 73 54' />
									<path d='M83 54 Q87 50 91 54' />
								</g>
							: isCuddling ?
								/* Loving Heart Eyes */
								<g fill='#EC4899'>
									<path d='M69 53 C67 50 64 50 64 53 C64 56 69 60 69 60 C69 60 74 56 74 53 C74 50 71 50 69 53 Z' />
									<path d='M87 53 C85 50 82 50 82 53 C82 56 87 60 87 60 C87 60 92 56 92 53 C92 50 89 50 87 53 Z' />
								</g>
							:	/* Normal Large Liquid Puppy Eyes with Double Sparkle Catchlights */
								<g className='puppy-eyes'>
									{/* Left Eye */}
									<ellipse
										cx='69'
										cy='53'
										rx='4.5'
										ry='5.5'
										fill='#0F172A'
									/>
									<circle
										cx='67.5'
										cy='51'
										r='1.8'
										fill='#FFFFFF'
									/>
									<circle
										cx='70.5'
										cy='54.5'
										r='0.9'
										fill='#FFFFFF'
									/>
									{/* Right Eye */}
									<ellipse
										cx='87'
										cy='53'
										rx='4.5'
										ry='5.5'
										fill='#0F172A'
									/>
									<circle
										cx='85.5'
										cy='51'
										r='1.8'
										fill='#FFFFFF'
									/>
									<circle
										cx='88.5'
										cy='54.5'
										r='0.9'
										fill='#FFFFFF'
									/>
								</g>
							}

							{/* Cute Pink Cheeks (Blush) */}
							<ellipse
								cx='62'
								cy='63'
								rx='3.5'
								ry='2'
								fill='#FDA4AF'
								opacity='0.75'
							/>
							<ellipse
								cx='94'
								cy='63'
								rx='3.5'
								ry='2'
								fill='#FDA4AF'
								opacity='0.75'
							/>

							{/* ─── Living Mouth & Animated Tongue ─── */}
							{isDrinking ?
								/* Drinking Mode: Mouth open with animated tongue lapping into bowl! */
								<g className='drinking-mouth'>
									<path
										d='M75 66 Q78 69 81 66'
										stroke='#78350F'
										strokeWidth='1.5'
										fill='none'
									/>
									{/* Lapping Pink Tongue dipping down into water */}
									<ellipse
										cx='78'
										cy='72'
										rx='3.8'
										ry='6'
										fill='#FB7185'
										stroke='#E11D48'
										strokeWidth='1'
										className='animate-tongue-lap'
									/>
								</g>
							: isEating ?
								/* Eating Mode: Chewing jaw moving up and down */
								<g className='chewing-mouth'>
									<path
										d='M74 66 Q78 72 82 66 Z'
										fill='#881337'
										stroke='#4C0519'
										strokeWidth='1'
									/>
									<ellipse
										cx='78'
										cy='69'
										rx='2.8'
										ry='2'
										fill='#FB7185'
									/>
								</g>
							: isCuddling || isHappy ?
								/* Happy Open Mouth with Pink Panting Tongue */
								<g className='happy-mouth'>
									<path
										d='M74 66 Q78 73 82 66 Z'
										fill='#881337'
										stroke='#4C0519'
										strokeWidth='1'
									/>
									<ellipse
										cx='78'
										cy='69.5'
										rx='3'
										ry='2.2'
										fill='#FB7185'
									/>
								</g>
							:	/* Gentle Smiling Puppy Mouth */
								<path
									d='M73 66 Q78 70 83 66'
									stroke='#78350F'
									strokeWidth='1.6'
									strokeLinecap='round'
									fill='none'
								/>
							}

							{/* ─── Glossy Helmet Visor Glass Dome & Highlights ─── */}
							<circle
								cx='78'
								cy='58'
								r='34'
								fill='url(#helmetVisor)'
								stroke='rgba(255, 255, 255, 0.4)'
								strokeWidth='1.2'
							/>
							{/* Curved Top-Left Arc Highlight */}
							<path
								d='M56 42 A28 28 0 0 1 92 34'
								stroke='rgba(255, 255, 255, 0.75)'
								strokeWidth='3.2'
								strokeLinecap='round'
								fill='none'
							/>
							{/* Secondary Subtle Gleam */}
							<path
								d='M98 40 A28 28 0 0 1 104 54'
								stroke='rgba(255, 255, 255, 0.45)'
								strokeWidth='2'
								strokeLinecap='round'
								fill='none'
							/>
						</g>

						{/* ═══════════════════════════════════════════════════════ */}
						{/* INTERACTIVE PROPS: Milk Bowl / Food Bowl / Star Ball    */}
						{/* ═══════════════════════════════════════════════════════ */}

						{/* ─── 1. Milk / Water Bowl (Drinking Mode) ─── */}
						{isDrinking && (
							<g className='milk-bowl-prop animate-in zoom-in-75 duration-200'>
								{/* Bowl Ceramic Body */}
								<ellipse
									cx='78'
									cy='134'
									rx='28'
									ry='12'
									fill='url(#milkBowlGrad)'
									stroke='#0369A1'
									strokeWidth='1.5'
								/>
								{/* Milk Liquid Surface */}
								<ellipse
									cx='78'
									cy='132'
									rx='23'
									ry='8'
									fill='url(#milkLiquid)'
								/>

								{/* Expanding Water Ripple Waves */}
								<ellipse
									cx='78'
									cy='132'
									rx='12'
									ry='4.5'
									fill='none'
									stroke='#38BDF8'
									strokeWidth='1.5'
									className='animate-water-ripple'
								/>
								<ellipse
									cx='78'
									cy='132'
									rx='18'
									ry='6.5'
									fill='none'
									stroke='rgba(255, 255, 255, 0.9)'
									strokeWidth='1'
									className='animate-water-ripple'
									style={{ animationDelay: '0.4s' }}
								/>

								{/* Animated Splash Droplets */}
								<circle
									cx='70'
									cy='128'
									r='2'
									fill='#E0F2FE'
									className='animate-splash-1'
								/>
								<circle
									cx='86'
									cy='127'
									r='2.2'
									fill='#BAE6FD'
									className='animate-splash-2'
								/>
								<circle
									cx='78'
									cy='124'
									r='1.8'
									fill='#FFFFFF'
									className='animate-splash-3'
								/>

								{/* Bowl Decorative Bone Emblem */}
								<path
									d='M74 136 Q78 138 82 136'
									stroke='#FFFFFF'
									strokeWidth='1.5'
									strokeLinecap='round'
									fill='none'
								/>
							</g>
						)}

						{/* ─── 2. Kibble / Food Bowl (Eating Mode) ─── */}
						{isEating && (
							<g className='kibble-bowl-prop animate-in zoom-in-75 duration-200'>
								{/* Bowl Ceramic Body */}
								<ellipse
									cx='78'
									cy='134'
									rx='28'
									ry='12'
									fill='url(#kibbleBowlGrad)'
									stroke='#C2410C'
									strokeWidth='1.5'
								/>
								{/* Interior Food Layer */}
								<ellipse
									cx='78'
									cy='132'
									rx='23'
									ry='8'
									fill='#7C2D12'
								/>

								{/* Golden Bone Treats in Bowl */}
								<rect
									x='64'
									y='128'
									width='10'
									height='4'
									rx='2'
									fill='url(#kibbleBone)'
									transform='rotate(-12 69 130)'
								/>
								<rect
									x='74'
									y='127'
									width='11'
									height='4.5'
									rx='2'
									fill='url(#kibbleBone)'
									transform='rotate(8 79 129)'
								/>
								<rect
									x='84'
									y='129'
									width='9'
									height='4'
									rx='2'
									fill='url(#kibbleBone)'
									transform='rotate(-20 88 131)'
								/>

								{/* Chewing Crumbs Popping Out */}
								<circle
									cx='72'
									cy='122'
									r='2'
									fill='#FDE047'
									className='animate-crumb-1'
								/>
								<circle
									cx='84'
									cy='120'
									r='2.3'
									fill='#F59E0B'
									className='animate-crumb-2'
								/>
								<circle
									cx='78'
									cy='117'
									r='1.6'
									fill='#FEF08A'
									className='animate-crumb-3'
								/>
							</g>
						)}

						{/* ─── 3. Bouncing Star Toy Ball (Playing Mode) ─── */}
						{isPlaying && (
							<g className='star-ball-prop animate-ball-bounce'>
								<circle
									cx='116'
									cy='108'
									r='12'
									fill='url(#puppyFur)'
									stroke='#CA8A04'
									strokeWidth='1.5'
								/>
								<path
									d='M116 100 L118.5 105 L124 105.5 L120 109 L121.2 114.5 L116 111.5 L110.8 114.5 L112 109 L108 105.5 L113.5 105 Z'
									fill='#FFFFFF'
								/>
								{/* Sparkle burst */}
								<circle
									cx='128'
									cy='96'
									r='2'
									fill='#FACC15'
								/>
								<circle
									cx='104'
									cy='98'
									r='1.6'
									fill='#FDE047'
								/>
							</g>
						)}
					</g>
				)}

				{/* ═══════════════════════════════════════════════════════════════ */}
				{/* 2. LUNA THE LIVING CAT (Tabby Astronaut Kitten)               */}
				{/* ═══════════════════════════════════════════════════════════════ */}
				{petType === 'cat' && (
					<g className='living-cat'>
						{/* Purring Tail */}
						<path
							d='M38 98 C22 96, 12 84, 14 70 C16 60, 24 64, 26 72 C28 82, 34 90, 42 94 Z'
							fill='#C084FC'
							stroke='#7E22CE'
							strokeWidth='1.5'
							className='animate-tail-swish'
							style={{ transformOrigin: '38px 98px' }}
						/>

						{/* Cat Body in Space Suit */}
						<rect
							x='48'
							y='80'
							width='44'
							height='38'
							rx='18'
							fill='url(#spaceSuitGrad)'
							stroke='#312E81'
							strokeWidth='1.5'
						/>
						<ellipse
							cx='70'
							cy='99'
							rx='13'
							ry='11'
							fill='#F3E8FF'
							opacity='0.95'
						/>
						{/* Bell Collar */}
						<path
							d='M54 83 Q70 89 86 83'
							stroke='#EC4899'
							strokeWidth='3.5'
							strokeLinecap='round'
							fill='none'
						/>
						<circle
							cx='70'
							cy='88'
							r='4'
							fill='#FACC15'
							stroke='#CA8A04'
							strokeWidth='1'
						/>

						{/* Back & Front Paws */}
						<ellipse
							cx='58'
							cy='116'
							rx='9'
							ry='6'
							fill='#E9D5FF'
							stroke='#7E22CE'
							strokeWidth='1.2'
							className={isWalking ? 'animate-paw-back' : ''}
						/>
						<ellipse
							cx='82'
							cy={isDrinking || isEating ? '118' : '116'}
							rx='9'
							ry='6'
							fill='#E9D5FF'
							stroke='#7E22CE'
							strokeWidth='1.2'
							className={isWalking ? 'animate-paw-front' : ''}
						/>

						{/* Head with Helmet */}
						<g
							style={{
								transformOrigin: '78px 60px',
								transform:
									isDrinking || isEating ?
										'translateY(8px) rotate(6deg)'
									:	undefined,
							}}>
							<circle
								cx='78'
								cy='58'
								r='36'
								fill='url(#helmetRim)'
								stroke='#64748B'
								strokeWidth='2'
							/>

							{/* Pointed Cat Ears */}
							<path
								d='M50 48 L62 28 L70 44 Z'
								fill='#C084FC'
								stroke='#7E22CE'
								strokeWidth='1.2'
							/>
							<path
								d='M54 44 L62 33 L67 43 Z'
								fill='#F472B6'
							/>
							<path
								d='M106 48 L94 28 L86 44 Z'
								fill='#C084FC'
								stroke='#7E22CE'
								strokeWidth='1.2'
							/>
							<path
								d='M102 44 L94 33 L89 43 Z'
								fill='#F472B6'
							/>

							{/* Cat Face */}
							<circle
								cx='78'
								cy='58'
								r='26'
								fill='#E9D5FF'
								stroke='#7E22CE'
								strokeWidth='1.2'
							/>

							{/* Whiskers */}
							<path
								d='M50 63 L64 64 M50 68 L64 67 M92 64 L106 63 M92 67 L106 68'
								stroke='#9333EA'
								strokeWidth='1.2'
								strokeLinecap='round'
							/>

							{/* Cute Pink Nose */}
							<polygon
								points='76,62 80,62 78,65'
								fill='#F472B6'
							/>

							{/* Feline Eyes */}
							{isBlinking || isNapping || isDrinking || isEating ?
								<g
									stroke='#581C87'
									strokeWidth='2.2'
									strokeLinecap='round'
									fill='none'>
									<path d='M65 54 Q69 49 73 54' />
									<path d='M83 54 Q87 49 91 54' />
								</g>
							:	<g>
									<ellipse
										cx='69'
										cy='53'
										rx='4.5'
										ry='5.5'
										fill='#065F46'
									/>
									<circle
										cx='67.5'
										cy='51'
										r='1.8'
										fill='#FFFFFF'
									/>
									<ellipse
										cx='87'
										cy='53'
										rx='4.5'
										ry='5.5'
										fill='#065F46'
									/>
									<circle
										cx='85.5'
										cy='51'
										r='1.8'
										fill='#FFFFFF'
									/>
								</g>
							}

							{/* Cat Mouth / Tongue */}
							{isDrinking ?
								<ellipse
									cx='78'
									cy='71'
									rx='3.5'
									ry='5.5'
									fill='#FB7185'
									stroke='#E11D48'
									strokeWidth='1'
									className='animate-tongue-lap'
								/>
							:	<path
									d='M75 66 Q78 69 81 66'
									stroke='#581C87'
									strokeWidth='1.5'
									fill='none'
								/>
							}

							{/* Helmet Visor */}
							<circle
								cx='78'
								cy='58'
								r='33'
								fill='url(#helmetVisor)'
								stroke='rgba(255, 255, 255, 0.4)'
								strokeWidth='1.2'
							/>
							<path
								d='M56 42 A28 28 0 0 1 92 34'
								stroke='rgba(255, 255, 255, 0.75)'
								strokeWidth='3.2'
								strokeLinecap='round'
								fill='none'
							/>
						</g>

						{/* Tuna / Milk Props */}
						{isDrinking && (
							<g className='milk-bowl-prop'>
								<ellipse
									cx='78'
									cy='134'
									rx='28'
									ry='12'
									fill='url(#milkBowlGrad)'
									stroke='#0369A1'
									strokeWidth='1.5'
								/>
								<ellipse
									cx='78'
									cy='132'
									rx='23'
									ry='8'
									fill='url(#milkLiquid)'
								/>
								<ellipse
									cx='78'
									cy='132'
									rx='14'
									ry='5'
									fill='none'
									stroke='#38BDF8'
									strokeWidth='1.5'
									className='animate-water-ripple'
								/>
								<circle
									cx='74'
									cy='126'
									r='2'
									fill='#E0F2FE'
									className='animate-splash-1'
								/>
								<circle
									cx='82'
									cy='125'
									r='2'
									fill='#BAE6FD'
									className='animate-splash-2'
								/>
							</g>
						)}
						{isEating && (
							<g className='fish-bowl-prop'>
								<ellipse
									cx='78'
									cy='134'
									rx='28'
									ry='12'
									fill='url(#kibbleBowlGrad)'
									stroke='#C2410C'
									strokeWidth='1.5'
								/>
								<ellipse
									cx='78'
									cy='132'
									rx='23'
									ry='8'
									fill='#7C2D12'
								/>
								<path
									d='M68 130 C74 126 82 126 88 130 L92 128 L92 134 L88 132 C82 136 74 136 68 132 Z'
									fill='#38BDF8'
								/>
								<circle
									cx='74'
									cy='122'
									r='2'
									fill='#38BDF8'
									className='animate-crumb-1'
								/>
								<circle
									cx='82'
									cy='120'
									r='2.2'
									fill='#FDE047'
									className='animate-crumb-2'
								/>
							</g>
						)}
						{isPlaying && (
							<g className='yarn-ball animate-ball-bounce'>
								<circle
									cx='116'
									cy='108'
									r='12'
									fill='#EC4899'
									stroke='#BE185D'
									strokeWidth='1.5'
								/>
								<path
									d='M108 104 Q116 112 124 104 M110 112 Q116 102 122 112'
									stroke='#FDF2F8'
									strokeWidth='1.2'
									fill='none'
								/>
							</g>
						)}
					</g>
				)}

				{/* ═══════════════════════════════════════════════════════════════ */}
				{/* 3. BEEP THE ROBOT (Living Cyber Companion)                     */}
				{/* ═══════════════════════════════════════════════════════════════ */}
				{petType === 'robot' && (
					<g className='living-robot'>
						{/* Overhead Loop Handle */}
						<path
							d='M64 26 Q78 12 92 26'
							stroke='#A855F7'
							strokeWidth='4.5'
							strokeLinecap='round'
							fill='none'
						/>

						{/* Antenna Radar */}
						<line
							x1='78'
							y1='22'
							x2='78'
							y2='10'
							stroke='#06B6D4'
							strokeWidth='3'
							strokeLinecap='round'
						/>
						<circle
							cx='78'
							cy='8'
							r='4'
							fill='#FACC15'
							className='animate-ping'
							opacity='0.75'
						/>
						<circle
							cx='78'
							cy='8'
							r='3.5'
							fill='#FACC15'
						/>

						{/* Cyber Body */}
						<rect
							x='48'
							y='74'
							width='60'
							height='46'
							rx='14'
							fill='#581C87'
							stroke='#A855F7'
							strokeWidth='2'
						/>
						{/* Glowing LED Chest Core */}
						<circle
							cx='78'
							cy='96'
							r='10'
							fill='#06B6D4'
							className='animate-pulse'
						/>
						<path
							d='M78 88 L74 96 L79 96 L76 104 L84 94 L79 94 Z'
							fill='#FFFFFF'
						/>

						{/* Motorized Treads / Feet */}
						<ellipse
							cx='58'
							cy='122'
							rx='12'
							ry='6'
							fill='#334155'
							stroke='#06B6D4'
							strokeWidth='1.5'
							className={isWalking ? 'animate-paw-front' : ''}
						/>
						<ellipse
							cx='98'
							cy='122'
							rx='12'
							ry='6'
							fill='#334155'
							stroke='#06B6D4'
							strokeWidth='1.5'
							className={isWalking ? 'animate-paw-back' : ''}
						/>

						{/* Robot Head Box with Glossy Visor */}
						<g
							style={{
								transformOrigin: '78px 50px',
								transform:
									isDrinking || isEating ? 'translateY(6px)' : undefined,
							}}>
							<rect
								x='46'
								y='28'
								width='64'
								height='46'
								rx='16'
								fill='#3B0764'
								stroke='#C084FC'
								strokeWidth='2'
							/>
							{/* Glossy Dark Visor Screen */}
							<rect
								x='52'
								y='34'
								width='52'
								height='34'
								rx='10'
								fill='#0F172A'
								stroke='#06B6D4'
								strokeWidth='1.2'
							/>

							{/* Glowing Cyan LED Eyes & Smiling Mouth (Matching Reference Image 1!) */}
							{isNapping ?
								<g
									stroke='#06B6D4'
									strokeWidth='2.5'
									strokeLinecap='round'
									fill='none'>
									<path d='M58 48 L68 48' />
									<path d='M88 48 L98 48' />
								</g>
							:	<g
									fill='#22D3EE'
									className='animate-pulse'>
									{/* LED Eye Left */}
									<circle
										cx='64'
										cy='46'
										r='4'
									/>
									{/* LED Eye Right */}
									<circle
										cx='92'
										cy='46'
										r='4'
									/>
									{/* Glowing Smiling LED Mouth */}
									<path
										d='M68 56 Q78 64 88 56'
										stroke='#22D3EE'
										strokeWidth='2.8'
										strokeLinecap='round'
										fill='none'
									/>
								</g>
							}

							{/* Visor Diagonal Gloss Highlight */}
							<path
								d='M54 36 L72 36 L58 54 L54 54 Z'
								fill='rgba(255, 255, 255, 0.2)'
							/>
						</g>

						{/* Hover Thrusters Glow */}
						<ellipse
							cx='78'
							cy='134'
							rx='24'
							ry='6'
							fill='url(#milkBowlGrad)'
							className='animate-thruster-glow'
							opacity='0.8'
						/>

						{/* Charging Spark / Battery Prop */}
						{(isDrinking || isEating) && (
							<g className='charging-prop'>
								<rect
									x='64'
									y='124'
									width='28'
									height='14'
									rx='4'
									fill='#0F172A'
									stroke='#22D3EE'
									strokeWidth='1.5'
								/>
								<rect
									x='92'
									y='127'
									width='3'
									height='8'
									rx='1'
									fill='#22D3EE'
								/>
								<rect
									x='67'
									y='127'
									width='22'
									height='8'
									rx='2'
									fill='#10B981'
									className='animate-pulse'
								/>
								<path
									d='M77 125 L74 131 L78 131 L75 137 L81 129 L77 129 Z'
									fill='#FDE047'
								/>
							</g>
						)}
					</g>
				)}

				{/* ═══════════════════════════════════════════════════════════════ */}
				{/* 4. ZOG THE ALIEN (Living Cosmic Buddy)                         */}
				{/* ═══════════════════════════════════════════════════════════════ */}
				{petType === 'alien' && (
					<g className='living-alien'>
						{/* Pulsing Antennae */}
						<g
							className='animate-ear-flop-1'
							style={{ transformOrigin: '64px 26px' }}>
							<path
								d='M64 34 Q58 18 54 14'
								stroke='#10B981'
								strokeWidth='3'
								strokeLinecap='round'
								fill='none'
							/>
							<circle
								cx='54'
								cy='12'
								r='5'
								fill='#34D399'
								className='animate-ping'
								opacity='0.7'
							/>
							<circle
								cx='54'
								cy='12'
								r='4'
								fill='#6EE7B7'
							/>
						</g>
						<g
							className='animate-ear-flop-2'
							style={{ transformOrigin: '92px 26px' }}>
							<path
								d='M92 34 Q98 18 102 14'
								stroke='#10B981'
								strokeWidth='3'
								strokeLinecap='round'
								fill='none'
							/>
							<circle
								cx='102'
								cy='12'
								r='5'
								fill='#34D399'
								className='animate-ping'
								opacity='0.7'
							/>
							<circle
								cx='102'
								cy='12'
								r='4'
								fill='#6EE7B7'
							/>
						</g>

						{/* Alien Body */}
						<ellipse
							cx='78'
							cy='96'
							rx='26'
							ry='22'
							fill='#059669'
							stroke='#34D399'
							strokeWidth='2'
						/>
						<ellipse
							cx='78'
							cy='98'
							rx='16'
							ry='12'
							fill='#6EE7B7'
							opacity='0.85'
						/>

						{/* Alien Walking Feet */}
						<ellipse
							cx='60'
							cy='120'
							rx='9'
							ry='5'
							fill='#10B981'
							stroke='#047857'
							strokeWidth='1.2'
							className={isWalking ? 'animate-paw-front' : ''}
						/>
						<ellipse
							cx='96'
							cy='120'
							rx='9'
							ry='5'
							fill='#10B981'
							stroke='#047857'
							strokeWidth='1.2'
							className={isWalking ? 'animate-paw-back' : ''}
						/>

						{/* Alien Head with 3 Expressive Living Eyes */}
						<g
							style={{
								transformOrigin: '78px 54px',
								transform:
									isDrinking || isEating ? 'translateY(6px)' : undefined,
							}}>
							<ellipse
								cx='78'
								cy='52'
								rx='28'
								ry='24'
								fill='#10B981'
								stroke='#059669'
								strokeWidth='1.5'
							/>

							{/* 3 Living Eyes */}
							{isBlinking || isNapping ?
								<g
									stroke='#064E3B'
									strokeWidth='2.2'
									strokeLinecap='round'
									fill='none'>
									<path d='M58 50 Q62 46 66 50' />
									<path d='M74 44 Q78 40 82 44' />
									<path d='M90 50 Q94 46 98 50' />
								</g>
							:	<g>
									{/* Eye 1 */}
									<circle
										cx='62'
										cy='48'
										r='4.5'
										fill='#064E3B'
									/>
									<circle
										cx='60.5'
										cy='46.5'
										r='1.5'
										fill='#FFFFFF'
									/>
									{/* Center Eye (Higher) */}
									<circle
										cx='78'
										cy='42'
										r='5'
										fill='#064E3B'
									/>
									<circle
										cx='76.5'
										cy='40.5'
										r='1.8'
										fill='#FFFFFF'
									/>
									{/* Eye 3 */}
									<circle
										cx='94'
										cy='48'
										r='4.5'
										fill='#064E3B'
									/>
									<circle
										cx='92.5'
										cy='46.5'
										r='1.5'
										fill='#FFFFFF'
									/>
								</g>
							}

							{/* Alien Smiling Mouth */}
							<path
								d='M71 62 Q78 68 85 62'
								stroke='#064E3B'
								strokeWidth='2'
								strokeLinecap='round'
								fill='none'
							/>
						</g>

						{/* Cosmic Gummy / Nectar Props */}
						{(isDrinking || isEating) && (
							<g className='cosmic-nectar-prop'>
								<ellipse
									cx='78'
									cy='134'
									rx='24'
									ry='10'
									fill='url(#spaceSuitGrad)'
									stroke='#34D399'
									strokeWidth='1.5'
								/>
								<ellipse
									cx='78'
									cy='132'
									rx='19'
									ry='6'
									fill='#A7F3D0'
								/>
								<circle
									cx='74'
									cy='126'
									r='2'
									fill='#6EE7B7'
									className='animate-splash-1'
								/>
								<circle
									cx='82'
									cy='125'
									r='2'
									fill='#34D399'
									className='animate-splash-2'
								/>
							</g>
						)}
					</g>
				)}
			</svg>
		</div>
	);
});
