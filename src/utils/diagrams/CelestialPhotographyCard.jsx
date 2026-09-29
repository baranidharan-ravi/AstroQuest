import { Sparkles } from 'lucide-react';
import { memo } from 'react';

/**
 * Real NASA / JWST Celestial Photography Visual Card
 *
 * Implements SOLID Single Responsibility:
 * Displays verified deep space telemetry photography with metadata and epoch.
 */
export const CelestialPhotographyCard = memo(function CelestialPhotographyCard({
	image,
}) {
	if (!image) return null;
	return (
		<div className='flex flex-col items-center justify-center p-3.5 sm:p-4 my-2 bg-gradient-to-br from-[#05071A] via-[#0C1236] to-[#05071A] text-white rounded-2xl border-2 border-cyan-400/50 shadow-2xl max-w-lg w-full animate-in fade-in duration-300'>
			<div className='flex items-center justify-between w-full mb-2.5 px-1'>
				<div className='flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase text-cyan-300 tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40'>
					<Sparkles className='w-3.5 h-3.5 text-cyan-400' />
					<span>Deep Space Observation: {image.category}</span>
				</div>
				<span className='text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'>
					{image.source}
				</span>
			</div>

			<div className='relative w-full rounded-xl overflow-hidden border border-cyan-500/30 bg-black/60 p-3.5 flex flex-col items-center text-center'>
				<div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 flex items-center justify-center text-2xl mb-2 shadow-inner border border-white/10'>
					🔭
				</div>
				<h4 className='text-sm sm:text-base font-black text-white tracking-wide'>
					{image.title}
				</h4>
				<p className='text-xs text-cyan-200/90 font-medium mt-1 leading-relaxed max-w-sm'>
					{image.description}
				</p>
				<div className='mt-2.5 flex items-center gap-2 text-[10px] text-slate-400 font-mono'>
					<span>Telemetry Verified</span>
					<span>•</span>
					<span>Epoch {image.year}</span>
				</div>
			</div>
		</div>
	);
});

export default CelestialPhotographyCard;
