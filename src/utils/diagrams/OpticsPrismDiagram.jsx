import { Sparkles } from 'lucide-react';
import React, { memo } from 'react';

/**
 * Optics Prism Diagram Component
 * 
 * Implements SOLID Single Responsibility:
 * Renders light dispersion and refraction physics through a glass prism in SVG.
 */
export const OpticsPrismDiagram = memo(function OpticsPrismDiagram({ isSolution = false }) {
	return (
		<div className='flex flex-col items-center justify-center p-3.5 sm:p-4 my-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border-2 border-indigo-400/50 shadow-xl max-w-xl w-full animate-in fade-in duration-300'>
			<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-cyan-300 tracking-wider mb-2 bg-cyan-950/80 px-3 py-0.5 rounded-full border border-cyan-500/40'>
				<Sparkles className='w-3.5 h-3.5 text-cyan-400' />
				<span>Optics: Light Dispersion & Refraction</span>
			</div>

			{/* SVG Optics Prism Diagram */}
			<div className='relative w-full flex items-center justify-center p-2'>
				<svg
					viewBox='0 0 340 160'
					className='w-full max-w-[340px] h-36'>
					<defs>
						{/* Glass Prism Gradient */}
						<linearGradient
							id='prismGrad'
							x1='0%'
							y1='0%'
							x2='100%'
							y2='100%'>
							<stop
								offset='0%'
								stopColor='#38BDF8'
								stopOpacity='0.45'
							/>
							<stop
								offset='50%'
								stopColor='#E0F2FE'
								stopOpacity='0.25'
							/>
							<stop
								offset='100%'
								stopColor='#818CF8'
								stopOpacity='0.45'
							/>
						</linearGradient>
						{/* White Incident Beam Gradient */}
						<linearGradient
							id='whiteBeam'
							x1='0%'
							y1='0%'
							x2='100%'
							y2='0%'>
							<stop
								offset='0%'
								stopColor='#FFFFFF'
								stopOpacity='0.2'
							/>
							<stop
								offset='100%'
								stopColor='#FFFFFF'
								stopOpacity='0.95'
							/>
						</linearGradient>
					</defs>

					{/* Glass Prism Triangle */}
					<polygon
						points='170,25 90,135 250,135'
						fill='url(#prismGrad)'
						stroke='#7DD3FC'
						strokeWidth='2.5'
					/>
					{/* Glass Internal Reflection Lines */}
					<line
						x1='170'
						y1='25'
						x2='170'
						y2='135'
						stroke='#BAE6FD'
						strokeWidth='0.8'
						strokeDasharray='2 2'
					/>

					{/* 1. Incident White Light Beam */}
					<polygon
						points='20,80 20,86 118,92 118,88'
						fill='url(#whiteBeam)'
					/>
					<line
						x1='20'
						y1='83'
						x2='120'
						y2='90'
						stroke='#FFFFFF'
						strokeWidth='3.5'
						strokeLinecap='round'
					/>
					<text
						x='55'
						y='68'
						fill='#F8FAFC'
						fontSize='10'
						fontWeight='900'
						textAnchor='middle'>
						White Light Beam ☀️
					</text>

					{/* 2. Refracted Beams Inside Prism */}
					<line
						x1='120'
						y1='90'
						x2='188'
						y2='88'
						stroke='#FDA4AF'
						strokeWidth='2'
					/>
					<line
						x1='120'
						y1='90'
						x2='192'
						y2='96'
						stroke='#86EFAC'
						strokeWidth='2'
					/>
					<line
						x1='120'
						y1='90'
						x2='196'
						y2='104'
						stroke='#93C5FD'
						strokeWidth='2'
					/>

					{/* 3. Dispersed Rainbow Spectrum Emerging */}
					{/* Red */}
					<line
						x1='188'
						y1='88'
						x2='310'
						y2='65'
						stroke='#EF4444'
						strokeWidth='3.5'
						strokeLinecap='round'
					/>
					{/* Orange */}
					<line
						x1='190'
						y1='92'
						x2='312'
						y2='74'
						stroke='#F97316'
						strokeWidth='3'
						strokeLinecap='round'
					/>
					{/* Yellow */}
					<line
						x1='192'
						y1='96'
						x2='314'
						y2='83'
						stroke='#FBBF24'
						strokeWidth='3'
						strokeLinecap='round'
					/>
					{/* Green */}
					<line
						x1='194'
						y1='100'
						x2='316'
						y2='92'
						stroke='#10B981'
						strokeWidth='3'
						strokeLinecap='round'
					/>
					{/* Cyan */}
					<line
						x1='195'
						y1='103'
						x2='318'
						y2='101'
						stroke='#06B6D4'
						strokeWidth='3'
						strokeLinecap='round'
					/>
					{/* Blue */}
					<line
						x1='196'
						y1='106'
						x2='320'
						y2='110'
						stroke='#3B82F6'
						strokeWidth='3'
						strokeLinecap='round'
					/>
					{/* Violet */}
					<line
						x1='197'
						y1='109'
						x2='322'
						y2='119'
						stroke='#8B5CF6'
						strokeWidth='3.5'
						strokeLinecap='round'
					/>

					{/* Label for Spectrum */}
					<text
						x='275'
						y='48'
						fill='#F472B6'
						fontSize='10'
						fontWeight='900'
						textAnchor='middle'>
						Rainbow Spectrum 🌈
					</text>
				</svg>
			</div>

			{/* Scientific Explanation Clue */}
			<div className='flex items-center justify-between gap-2 w-full mt-1 text-[10px] sm:text-[11px] font-bold flex-wrap sm:flex-nowrap'>
				<div className='bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-cyan-200'>
					1. Incident Ray enters glass
				</div>
				<span className='text-indigo-300 font-extrabold hidden sm:inline'>
					➔
				</span>
				<div className='bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-indigo-200'>
					2. Light Bends (Refraction)
				</div>
				<span className='text-indigo-300 font-extrabold hidden sm:inline'>
					➔
				</span>
				<div className='bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-pink-200'>
					3. Rainbow Colors Split
				</div>
			</div>

			{/* Solution Banner */}
			{isSolution && (
				<div className='mt-2.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black shadow-lg animate-bounce-short flex items-center gap-2'>
					<span>✨ Scientific Phenomenon:</span>
					<span className='underline decoration-wavy'>
						Refraction & Dispersion of Light
					</span>
				</div>
			)}
		</div>
	);
});

export default OpticsPrismDiagram;
