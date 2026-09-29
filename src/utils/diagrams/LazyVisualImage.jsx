import { Image as ImageIcon } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

/**
 * Lazy-loaded visual image component with skeleton placeholder
 *
 * Implements SOLID Single Responsibility:
 * Safe image loader with fallback and placeholder skeleton.
 */
export const LazyVisualImage = memo(function LazyVisualImage({
	src,
	alt,
	caption = '',
	onError = null,
}) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const imgRef = useRef(null);

	useEffect(() => {
		setLoaded(false);
		setError(false);
	}, [src]);

	// After resetting loaded, check if browser already has the image decoded
	// (common for base64 data URIs — onLoad won't re-fire for cached images)
	useEffect(() => {
		if (
			!loaded &&
			imgRef.current?.complete &&
			imgRef.current?.naturalWidth > 0
		) {
			setLoaded(true);
		}
	});

	const handleImgError = () => {
		setError(true);
		if (onError) onError();
	};

	if (!src || error) {
		return (
			<div className='flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 my-2'>
				<ImageIcon className='w-6 h-6 text-slate-400 mb-1' />
				<span className='text-xs font-semibold'>Visual Diagram</span>
			</div>
		);
	}

	return (
		<div className='relative flex flex-col items-center justify-center my-2 max-w-md w-full'>
			{!loaded && (
				<div className='w-full h-40 sm:h-48 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center border border-slate-200'>
					<div className='flex items-center gap-2 text-slate-400 text-xs font-bold'>
						<div className='w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin' />
						<span>Loading visual clue...</span>
					</div>
				</div>
			)}
			<img
				ref={imgRef}
				src={src}
				alt={alt || 'Question Visual Clue'}
				onLoad={() => setLoaded(true)}
				onError={handleImgError}
				className={`max-h-52 w-auto max-w-full rounded-2xl object-contain shadow-md border-2 border-slate-200 transition-opacity duration-300 ${
					loaded ? 'opacity-100 block' : (
						'opacity-0 absolute -z-10 pointer-events-none'
					)
				}`}
			/>
			{caption && loaded && (
				<span className='text-[11px] font-bold text-slate-500 mt-1.5 text-center'>
					{caption}
				</span>
			)}
		</div>
	);
});

export default LazyVisualImage;
