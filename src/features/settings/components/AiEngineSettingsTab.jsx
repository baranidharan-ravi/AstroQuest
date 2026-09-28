import {
	Check,
	Cpu,
	ExternalLink,
	Key,
	Lock,
	RefreshCw,
	Search,
	ShieldAlert,
	Sparkles,
	X,
} from 'lucide-react';
import { memo } from 'react';
import { AI_PROVIDER_INFO, AI_PROVIDERS } from '../../../services/aiGenerator';
import { playButtonPop } from '../../../utils/audioSynthesis';

/**
 * AiEngineSettingsTab Component
 *
 * Implements SOLID Single Responsibility Principle:
 * Responsible purely for AI Provider selection, API Key security vault,
 * and Model Engine selection/filtering.
 */
export const AiEngineSettingsTab = memo(function AiEngineSettingsTab({
	selectedProvider,
	handleSelectProvider,
	providerKeys,
	isValidating,
	isKeyError,
	copyBlockedMessage,
	apiKeyInput,
	isRevealed,
	handlePasteKey,
	handleKeyChange,
	handleKeyBlur,
	handleBlockCopy,
	handleKeyDownKey,
	hasCachedGeminiModels,
	isFetchingModels,
	handleFetchLiveModels,
	modelsList,
	selectedModel,
	fetchModelStatus,
	setFetchModelStatus,
	modelSearchQuery,
	setModelSearchQuery,
	filteredModels,
	soundEnabled,
	setSelectedModel,
	setProviderModels,
	error,
	setError,
	isModelRateLimited,
}) {
	return (
		<div className='space-y-3.5 sm:space-y-6 animate-in fade-in duration-200'>
			{/* Section 2: AI Intelligence Provider Selection */}
			<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-indigo-500/40 shadow-inner flex flex-col gap-3'>
				<div className='flex items-center justify-between gap-2 flex-wrap'>
					<div className='flex items-center gap-2'>
						<Sparkles className='w-4 h-4 text-amber-400 flex-shrink-0' />
						<span className='text-xs sm:text-sm font-bold text-white'>
							Select AI Intelligence Provider
						</span>
					</div>
					<span className='text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 uppercase'>
						{AI_PROVIDER_INFO[selectedProvider]?.name || 'Gemini'} Active
					</span>
				</div>

				<p className='text-[11px] sm:text-xs text-slate-300'>
					Choose your preferred AI to generate 100% real-time, adaptive
					AstroQuest questions:
				</p>

				<div
					className='grid grid-cols-1 sm:grid-cols-3 gap-2.5'
					role='radiogroup'
					aria-label='Select AI Provider'>
					{Object.values(AI_PROVIDERS).map((provId) => {
						const info = AI_PROVIDER_INFO[provId];
						const isSelected = selectedProvider === provId;
						const hasKey = Boolean(providerKeys[provId]);

						return (
							<button
								key={provId}
								type='button'
								role='radio'
								aria-checked={isSelected}
								disabled={isValidating}
								onClick={() => handleSelectProvider(provId)}
								className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col justify-between gap-2.5 ${
									isSelected ?
										'bg-gradient-to-b from-indigo-950/80 via-[#161c4e] to-purple-950/80 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
									:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
								}`}>
								<div className='flex items-start justify-between gap-1.5'>
									<div className='flex items-center gap-2'>
										<span
											className='text-xl flex-shrink-0'
											role='img'
											aria-label={info.name}>
											{provId === AI_PROVIDERS.GEMINI ?
												'✨'
											: provId === AI_PROVIDERS.OPENAI ?
												'🟢'
											:	'🎭'}
										</span>
										<div>
											<h3
												className={`text-xs sm:text-sm font-black leading-tight ${
													isSelected ? 'text-amber-300' : 'text-white'
												}`}>
												{info.name}
											</h3>
											<p className='text-[10px] text-slate-400 font-medium'>
												{provId === AI_PROVIDERS.GEMINI ?
													'Google AI Studio'
												: provId === AI_PROVIDERS.OPENAI ?
													'OpenAI Platform'
												:	'Anthropic Console'}
											</p>
										</div>
									</div>

									{isSelected && (
										<div className='w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow flex-shrink-0'>
											<Check className='w-3 h-3 stroke-[3]' />
										</div>
									)}
								</div>

								<div className='flex items-center justify-between gap-1 mt-0.5 flex-wrap'>
									<span
										className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${info.badgeColor}`}>
										{info.badge}
									</span>
									{hasKey && (
										<span className='text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5'>
											<Check className='w-2.5 h-2.5' /> Key Stored
										</span>
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Section 2B: Provider API Key (Mandatory with Live Validation) */}
			<div
				className={`bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all shadow-inner ${
					isKeyError ?
						'border-rose-500 ring-2 ring-rose-400/40 animate-shake'
					:	'border-amber-400/60'
				}`}>
				<div className='flex flex-wrap items-center justify-between gap-1.5 mb-2'>
					<label
						htmlFor='active-api-key-input'
						className='text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5'>
						<Key className='w-4 h-4 text-amber-400 flex-shrink-0' />
						<span>{AI_PROVIDER_INFO[selectedProvider]?.name} API Key</span>
						<span className='text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase'>
							Mandatory
						</span>
					</label>
					<a
						href={AI_PROVIDER_INFO[selectedProvider]?.portalUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='text-[11px] sm:text-xs font-bold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded'>
						<span>
							{selectedProvider === AI_PROVIDERS.GEMINI ?
								'Get Free Key'
							:	`Get ${AI_PROVIDER_INFO[selectedProvider]?.name} Key`}
						</span>
						<ExternalLink className='w-3 h-3' />
					</a>
				</div>

				<div className='relative flex items-center'>
					{/* Copy-blocked tooltip notification */}
					{copyBlockedMessage && (
						<div
							role='alert'
							aria-live='assertive'
							className='absolute -top-10 left-0 sm:left-auto right-0 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xl border border-rose-400'>
							<ShieldAlert className='w-4 h-4 text-amber-200 flex-shrink-0' />
							<span>Copy functionality is not allowed for this field</span>
						</div>
					)}

					<input
						id='active-api-key-input'
						name='active_api_key_field'
						aria-required='true'
						aria-describedby='api-key-desc'
						type='text'
						style={{
							WebkitTextSecurity: isRevealed ? 'none' : 'disc',
							textSecurity: isRevealed ? 'none' : 'disc',
						}}
						autoComplete='off'
						autoCorrect='off'
						autoCapitalize='off'
						spellCheck='false'
						data-1p-ignore='true'
						data-lpignore='true'
						data-form-type='other'
						data-bwignore='true'
						disabled={isValidating}
						value={apiKeyInput}
						onPaste={handlePasteKey}
						onChange={handleKeyChange}
						onBlur={handleKeyBlur}
						onCopy={handleBlockCopy}
						onCut={handleBlockCopy}
						onKeyDown={handleKeyDownKey}
						placeholder={AI_PROVIDER_INFO[selectedProvider]?.keyPlaceholder}
						className={`w-full bg-[#0D1030] border text-white font-mono text-xs sm:text-sm rounded-xl pl-4 pr-12 py-3 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all ${
							isKeyError ?
								'border-rose-400 focus:border-rose-500'
							:	'border-amber-400/50 focus:border-amber-400'
						}`}
					/>

					{/* Encrypted Vault indicator */}
					<div
						className='absolute right-3 p-1.5 rounded-lg text-emerald-400/80 flex items-center justify-center'
						title={
							isRevealed ?
								'Revealed (auto-masking in 3 seconds)'
							:	'Secure Encrypted Field'
						}
						aria-hidden='true'>
						<Lock
							className={`w-4 h-4 ${
								isRevealed ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
							}`}
						/>
					</div>
				</div>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1.5'>
					<span
						id='api-key-desc'
						className='text-[11px] text-slate-400 block'>
						{isRevealed ?
							<span className='text-amber-300 font-semibold'>
								⚠️ Key visible — auto-masking in 3 seconds.
							</span>
						:	`Required for 100% real-time AI generation via ${AI_PROVIDER_INFO[selectedProvider]?.name}. Value is encrypted in the field.`
						}
					</span>
					<span className='text-[10px] text-emerald-400/90 font-mono flex items-center gap-1'>
						<Lock className='w-3 h-3 inline' />
						<span>Encrypted Vault (Copy Disabled)</span>
					</span>
				</div>
			</div>

			{/* Section 3: AI Model Engine Selection */}
			<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-cyan-500/40 shadow-inner'>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2'>
					<div className='flex items-center gap-2 flex-wrap'>
						<Cpu className='w-4 h-4 text-cyan-400 flex-shrink-0' />
						<span className='text-xs sm:text-sm font-bold text-white'>
							{AI_PROVIDER_INFO[selectedProvider]?.name} Model Engine
						</span>
						{selectedProvider === AI_PROVIDERS.GEMINI &&
							hasCachedGeminiModels() &&
							!isFetchingModels && (
								<span
									className='text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-1'
									title='Models are cached locally and loaded instantly without re-fetching'>
									⚡ Cached
								</span>
							)}
					</div>
					<div className='flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap'>
						{selectedProvider === AI_PROVIDERS.GEMINI && (
							<button
								type='button'
								disabled={isFetchingModels || isValidating}
								onClick={handleFetchLiveModels}
								className='flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-[11px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50'>
								<RefreshCw
									className={`w-3.5 h-3.5 ${
										isFetchingModels ? 'animate-spin text-cyan-200' : ''
									}`}
								/>
								<span>
									{isFetchingModels ? 'Downloading...' : 'Fetch Latest 🔄'}
								</span>
							</button>
						)}
						<span className='text-[10px] font-black px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 truncate max-w-[130px] sm:max-w-none'>
							{modelsList.find((m) => m.id === selectedModel)?.name ||
								selectedModel}
						</span>
					</div>
				</div>

				<p className='text-[11px] sm:text-xs text-slate-300 mb-2'>
					Select which {AI_PROVIDER_INFO[selectedProvider]?.name} model
					generates questions in real time:
				</p>

				{fetchModelStatus && (
					<div
						className={`mb-3 p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between gap-2 ${
							fetchModelStatus.type === 'success' ?
								'bg-emerald-500/20 border-emerald-400 text-emerald-200'
							:	'bg-rose-500/20 border-rose-400 text-rose-200'
						}`}>
						<span>{fetchModelStatus.text}</span>
						<button
							type='button'
							onClick={() => setFetchModelStatus(null)}
							className='text-slate-400 hover:text-white text-xs font-black cursor-pointer px-1'>
							✕
						</button>
					</div>
				)}

				{/* AI Model Search & Filter Toolbar */}
				<div className='flex items-center gap-2 mb-2.5'>
					<div className='relative flex-1'>
						<Search className='w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
						<input
							type='text'
							value={modelSearchQuery}
							onChange={(e) => setModelSearchQuery(e.target.value)}
							placeholder={`Search ${AI_PROVIDER_INFO[selectedProvider]?.name || 'AI'} models (e.g. Flash, 2.5, Lite, Pro)...`}
							className='w-full bg-[#080B22] border border-cyan-500/30 focus:border-cyan-400 text-white font-medium text-xs rounded-xl pl-8.5 pr-7 py-2 placeholder:text-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 transition-all'
						/>
						{modelSearchQuery && (
							<button
								type='button'
								onClick={() => setModelSearchQuery('')}
								className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer'
								title='Clear search'>
								<X className='w-3.5 h-3.5' />
							</button>
						)}
					</div>
					<span className='text-[10px] font-bold text-slate-400 px-2.5 py-1.5 bg-[#080B22] rounded-xl border border-slate-700/80 flex-shrink-0'>
						{filteredModels.length} of {modelsList.length}
					</span>
				</div>

				{/* Compact Model Cards Grid */}
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin'>
					{filteredModels.map((model) => {
						const isSelected = selectedModel === model.id;
						return (
							<button
								key={model.id}
								type='button'
								disabled={isValidating || isFetchingModels}
								onClick={() => {
									playButtonPop(soundEnabled);
									setSelectedModel(model.id);
									setProviderModels((prev) => ({
										...prev,
										[selectedProvider]: model.id,
									}));
									if (error) setError('');
								}}
								className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer flex flex-col justify-between gap-1.5 ${
									isSelected ?
										'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
									:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
								}`}>
								<div className='flex items-start justify-between gap-1.5'>
									<span
										className={`text-xs font-black leading-snug truncate ${
											isSelected ? 'text-cyan-300' : 'text-white'
										}`}
										title={model.name}>
										{model.name}
									</span>
									<div className='flex items-center gap-1 flex-shrink-0'>
										{isSelected && (
											<div className='w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow'>
												<Check className='w-2.5 h-2.5 stroke-[3]' />
											</div>
										)}
									</div>
								</div>

								<div className='flex items-center justify-between gap-1'>
									<span className='text-[10px] font-bold text-slate-300 truncate'>
										{model.tag}
									</span>
									{(
										selectedProvider === AI_PROVIDERS.GEMINI &&
										isModelRateLimited(model.id)
									) ?
										<span className='text-[8.5px] font-black px-1.5 py-0.2 rounded-full border bg-rose-500/20 text-rose-300 border-rose-400/40'>
											⚠️ 429 Limit
										</span>
									:	<span
											className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-full border truncate max-w-[90px] ${model.badgeColor}`}>
											{model.badge}
										</span>
									}
								</div>

								<p
									className='text-[9.5px] text-slate-400 leading-tight line-clamp-1'
									title={model.description}>
									{model.description}
								</p>
							</button>
						);
					})}

					{filteredModels.length === 0 && (
						<div className='col-span-full p-4 rounded-xl bg-[#080B22] border border-slate-700/80 text-center'>
							<p className='text-xs text-slate-300'>
								No AI models found matching "<strong>{modelSearchQuery}</strong>
								"
							</p>
							<button
								type='button'
								onClick={() => setModelSearchQuery('')}
								className='mt-2 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-bold transition-all cursor-pointer'>
								Clear Search ✕
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
});

export default AiEngineSettingsTab;
