import { ArrowLeft, Key, RefreshCw, Sparkles } from 'lucide-react';
import React, { memo } from 'react';
import { AI_PROVIDER_INFO, getActiveAiProvider } from '../../../services/aiGenerator';
import { playButtonPop } from '../../../utils/audioSynthesis';

/**
 * QuestAiErrorCard Component
 *
 * Implements SOLID Single Responsibility:
 * Displays AI generation errors or missing API key notice with clear next actions.
 */
export const QuestAiErrorCard = memo(function QuestAiErrorCard({
	aiError,
	soundEnabled = true,
	onOpenSettings,
	onRetry,
	onBackToDashboard,
}) {
	const activeProviderName =
		AI_PROVIDER_INFO[getActiveAiProvider()]?.name || 'AI';

	return (
		<div className='w-full max-w-xl mx-auto p-6 sm:p-8 bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-amber-400/80 rounded-3xl shadow-2xl text-center animate-in fade-in'>
			<div className='w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-300'>
				<Key className='w-8 h-8' />
			</div>

			<h2 className='text-xl sm:text-2xl font-black text-white mb-2'>
				{aiError === 'MISSING_KEY' ?
					`${activeProviderName} API Key Required`
				:	'AI Generation Connection Error'}
			</h2>

			<p className='text-sm text-slate-300 font-semibold mb-6 leading-relaxed'>
				{aiError === 'MISSING_KEY' ?
					`All AstroQuest challenges are generated live by ${activeProviderName}. Please configure your API key to start generating customized questions.`
				: typeof aiError === 'string' && aiError !== 'API_ERROR' ?
					aiError
				:	`Unable to connect to the ${activeProviderName} API. Please check your internet connection or verify your API key in Settings.`
				}
			</p>

			<div className='flex flex-col sm:flex-row gap-3 justify-center'>
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						if (onOpenSettings) onOpenSettings();
					}}
					className='px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all cursor-pointer'>
					<Sparkles className='w-4 h-4' />
					<span>Open Settings & Key ⚙️</span>
				</button>

				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						if (onRetry) onRetry();
					}}
					className='px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer'>
					<RefreshCw className='w-4 h-4' />
					<span>Try Again</span>
				</button>

				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						if (onBackToDashboard) onBackToDashboard();
					}}
					className='px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer'>
					<ArrowLeft className='w-4 h-4' />
					<span>Skills Hub</span>
				</button>
			</div>
		</div>
	);
});

export default QuestAiErrorCard;
