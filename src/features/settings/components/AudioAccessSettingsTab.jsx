import { Search, Sparkles, Volume2, X } from 'lucide-react';
import React, { memo } from 'react';
import { COSMIC_LANGUAGES } from '../../../constants';
import { COSMIC_VOICE_PERSONALITIES, playButtonPop } from '../../../utils/audioSynthesis';

/**
 * AudioAccessSettingsTab Component
 *
 * Implements SOLID Single Responsibility Principle:
 * Responsible purely for Voice narrator personality selection, 432Hz ambient soundscape,
 * Browser synthesizer voice overrides (with search/filter), and neuro-inclusive accessibility.
 */
export const AudioAccessSettingsTab = memo(function AudioAccessSettingsTab({
	selectedPersonality,
	setSelectedPersonality,
	soundEnabled,
	speakText,
	ambientAudioEnabled,
	setAmbientAudioEnabled,
	ambientAudioVolume,
	setAmbientAudioVolume,
	startAmbientSound,
	stopAmbientSound,
	setAmbientVolume,
	isAmbientSoundPlaying,
	selectedVoiceURI,
	setSelectedVoiceURI,
	availableVoices,
	voiceSearchQuery,
	setVoiceSearchQuery,
	filteredVoices,
	accessibility,
	handleLanguageSelect,
	handleToggleDyslexic,
	handleToggleOled,
	handleToggleSensoryAudio,
}) {
	return (
		<div className='space-y-3.5 sm:space-y-6 animate-in fade-in duration-200'>
			{/* Section 7: Cosmic Audio & Sensory Focus Suite */}
			<div className='bg-[#090B24]/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-purple-500/40 shadow-inner space-y-4'>
				{/* Header */}
				<div className='flex items-center justify-between gap-2 border-b border-purple-500/20 pb-2.5'>
					<div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
						<Volume2 className='w-4 h-4 text-purple-400 flex-shrink-0' />
						<span className='text-xs sm:text-sm font-bold text-white'>
							Cosmic Voice & Audio Focus Suite
						</span>
					</div>
					<span className='text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
						Real-Time Audio
					</span>
				</div>

				{/* 7.1 Cosmic Voice Personalities */}
				<div>
					<div className='text-xs font-black text-purple-200 mb-1 flex items-center gap-1.5'>
						<span>🎙️ Narrator Personality</span>
					</div>
					<p className='text-[11px] sm:text-xs text-slate-300 mb-2.5'>
						Select the personality and vocal pace of your cosmic flight instructor:
					</p>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
						{COSMIC_VOICE_PERSONALITIES.map((p) => {
							const isSelected = selectedPersonality === p.id;
							return (
								<button
									key={p.id}
									type='button'
									onClick={() => {
										playButtonPop(soundEnabled);
										setSelectedPersonality(p.id);
										const phrases = {
											classic: 'Hello! I am ready to read questions for you.',
											bot: 'Beep-boop! All circuits operational. Ready for mission!',
											nova: 'Commander Nova here! Prepare for stellar navigation!',
											nebula: 'Welcome, young star traveler. Take a gentle breath.',
										};
										speakText(phrases[p.id] || phrases.classic);
									}}
									className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
										isSelected ?
											'bg-purple-500/25 border-purple-400 ring-2 ring-purple-400/50 shadow-md'
										:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500'
									}`}>
									<span className='text-xl sm:text-2xl leading-none flex-shrink-0'>
										{p.emoji}
									</span>
									<div className='min-w-0 flex-1'>
										<div className='flex items-center justify-between gap-1'>
											<span
												className={`text-xs font-black ${
													isSelected ? 'text-purple-200' : 'text-white'
												}`}>
												{p.name}
											</span>
											{isSelected && (
												<span className='text-[9px] font-black text-purple-300 bg-purple-500/30 px-1.5 py-0.2 rounded-full border border-purple-400/50'>
													ACTIVE
												</span>
											)}
										</div>
										<div className='text-[10px] text-slate-400 leading-tight mt-0.5'>
											{p.description}
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* 7.2 Ambient Deep-Space Focus Lo-Fi Soundscape */}
				<div className='pt-3 border-t border-purple-500/20'>
					<div className='flex items-center justify-between gap-2 mb-1.5'>
						<div className='flex items-center gap-1.5'>
							<span className='text-sm'>🎧</span>
							<span className='text-xs font-black text-cyan-200'>
								Deep-Space Focus Ambient Sound
							</span>
						</div>
						<button
							type='button'
							onClick={() => {
								playButtonPop(soundEnabled);
								const next = !ambientAudioEnabled;
								setAmbientAudioEnabled(next);
								if (next) {
									startAmbientSound(ambientAudioVolume);
								} else {
									stopAmbientSound();
								}
							}}
							className={`px-3 py-1 rounded-full text-xs font-black transition-all border cursor-pointer ${
								ambientAudioEnabled ?
									'bg-cyan-500 text-cyan-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{ambientAudioEnabled ? '✨ Active' : 'Off'}
						</button>
					</div>
					<p className='text-[11px] text-slate-300 mb-2 leading-relaxed'>
						Gentle 432Hz harmonic space drone &amp; soothing star chimes. Scientifically designed to calm test anxiety and improve focus.
					</p>

					{ambientAudioEnabled && (
						<div className='bg-[#080B1E] p-2.5 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn'>
							<div className='flex items-center gap-2 w-full sm:w-auto'>
								<span className='text-xs text-slate-400 font-bold'>
									Soundscape Volume:
								</span>
								<input
									type='range'
									min='0.05'
									max='0.8'
									step='0.05'
									value={ambientAudioVolume}
									onChange={(e) => {
										const val = parseFloat(e.target.value);
										setAmbientAudioVolume(val);
										setAmbientVolume(val);
									}}
									className='w-28 sm:w-36 accent-cyan-400 cursor-pointer'
								/>
								<span className='text-xs font-mono font-bold text-cyan-300'>
									{Math.round(ambientAudioVolume * 100)}%
								</span>
							</div>
							<button
								type='button'
								onClick={() => {
									if (isAmbientSoundPlaying()) {
										stopAmbientSound();
									} else {
										startAmbientSound(ambientAudioVolume);
									}
								}}
								className='text-[11px] font-bold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 transition-all cursor-pointer'>
								{isAmbientSoundPlaying() ?
									'⏸ Pause Preview'
								:	'▶ Test Audio'}
							</button>
						</div>
					)}
				</div>

				{/* 7.3 Specific Browser Voice Picker */}
				<div className='pt-3 border-t border-purple-500/20'>
					<div className='flex items-center justify-between gap-2 mb-2'>
						<span className='text-xs font-bold text-slate-300'>
							Specific Synthesizer Voice Override
						</span>
						{selectedVoiceURI && (
							<span className='text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/40 truncate max-w-[150px]'>
								{availableVoices.find(
									(v) => v.voiceURI === selectedVoiceURI,
								)?.name || 'Custom'}
							</span>
						)}
					</div>

					{availableVoices.length === 0 ?
						<div className='text-xs text-slate-400 font-semibold p-2.5 rounded-xl bg-slate-800/60 border border-slate-700'>
							⚠️ No voices loaded yet. Click speaker icon on a question to pre-warm voices.
						</div>
					:	<>
							{/* Voice Search & Filter Toolbar */}
							<div className='flex items-center gap-2 mb-2'>
								<div className='relative flex-1'>
									<Search className='w-3.5 h-3.5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
									<input
										type='text'
										value={voiceSearchQuery}
										onChange={(e) => setVoiceSearchQuery(e.target.value)}
										placeholder='Search voices or languages (e.g. David, Zira, English, India)...'
										className='w-full bg-[#080B22] border border-purple-500/30 focus:border-purple-400 text-white font-medium text-xs rounded-xl pl-8.5 pr-7 py-2 placeholder:text-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 transition-all'
									/>
									{voiceSearchQuery && (
										<button
											type='button'
											onClick={() => setVoiceSearchQuery('')}
											className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer'
											title='Clear search'>
											<X className='w-3.5 h-3.5' />
										</button>
									)}
								</div>
								<span className='text-[10px] font-bold text-slate-400 px-2.5 py-1.5 bg-[#080B22] rounded-xl border border-slate-700/80 flex-shrink-0'>
									{filteredVoices.length +
										((
											!voiceSearchQuery ||
											'auto recommended'.includes(
												voiceSearchQuery.toLowerCase(),
											)
										) ?
											1
										:	0)}{' '}
									voices
								</span>
							</div>

							{/* Compact Voice Cards Grid */}
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin'>
								{/* Default / Auto option */}
								{(!voiceSearchQuery ||
									'auto recommended'.includes(
										voiceSearchQuery.toLowerCase(),
									)) && (
									<button
										type='button'
										onClick={() => {
											playButtonPop(soundEnabled);
											setSelectedVoiceURI('');
										}}
										className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
											!selectedVoiceURI ?
												'bg-purple-500/20 border-purple-400 ring-1 ring-purple-400/40 shadow-sm'
											:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
										}`}>
										<div
											className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 ${
												!selectedVoiceURI ?
													'bg-purple-400 border-purple-300'
												:	'bg-transparent border-slate-500'
											}`}
										/>
										<div className='min-w-0 flex-1'>
											<div className='text-xs font-bold text-white truncate'>
												Auto (Recommended)
											</div>
											<div className='text-[9.5px] text-slate-400 truncate'>
												Matches personality
											</div>
										</div>
									</button>
								)}

								{filteredVoices.map((voice) => {
									const isSelected = selectedVoiceURI === voice.voiceURI;
									return (
										<button
											key={voice.voiceURI}
											type='button'
											onClick={() => {
												playButtonPop(soundEnabled);
												setSelectedVoiceURI(voice.voiceURI);
												speakText('Voice calibrated for mission.');
											}}
											className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
												isSelected ?
													'bg-purple-500/20 border-purple-400 ring-1 ring-purple-400/40 shadow-sm'
												:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
											}`}>
											<div
												className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 ${
													isSelected ?
														'bg-purple-400 border-purple-300'
													:	'bg-transparent border-slate-500'
												}`}
											/>
											<div className='min-w-0 flex-1'>
												<div
													className={`text-xs font-bold truncate ${
														isSelected ? 'text-purple-200' : 'text-white'
													}`}
													title={voice.name}>
													{voice.name}
												</div>
												<div className='text-[9.5px] text-slate-400 truncate flex items-center gap-1'>
													<span className='font-mono font-bold text-purple-300/90'>
														{voice.lang}
													</span>
													<span>·</span>
													<span>
														{voice.localService ? 'Local' : 'Network'}
													</span>
												</div>
											</div>
										</button>
									);
								})}

								{filteredVoices.length === 0 &&
									voiceSearchQuery &&
									!'auto recommended'.includes(
										voiceSearchQuery.toLowerCase(),
									) && (
										<div className='col-span-full p-3.5 rounded-xl bg-[#080B22] border border-slate-700/80 text-center'>
											<p className='text-xs text-slate-300'>
												No voices match "
												<strong>{voiceSearchQuery}</strong>"
											</p>
											<button
												type='button'
												onClick={() => setVoiceSearchQuery('')}
												className='mt-2 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-400/40 text-xs font-bold transition-all cursor-pointer'>
												Clear Search ✕
											</button>
										</div>
									)}
							</div>
						</>
					}
				</div>
			</div>

			{/* 8. Neuro-Inclusive Accessibility & Multilingual Speech Card */}
			<div className='bg-[#0c1033]/80 border border-teal-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-md'>
				<div className='flex items-center gap-2.5'>
					<div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 flex-shrink-0'>
						<Sparkles className='w-4 h-4 sm:w-5 sm:h-5 text-teal-300' />
					</div>
					<div>
						<h2 className='text-xs sm:text-base font-extrabold text-white flex items-center gap-2'>
							<span>
								Neuro-Inclusive Accessibility & Multilingual Voice
							</span>
							<span className='text-[9px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40'>
								Universal Flight
							</span>
						</h2>
						<p className='text-[11px] text-slate-300'>
							Sensory-friendly soundscapes, hyper-legible dyslexia reading modes, and multilingual audio narration.
						</p>
					</div>
				</div>

				{/* 8.1 Multilingual Voice Narration */}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-xs font-bold text-slate-300'>
							Cosmic Voice Language:
						</span>
						<span className='text-[10px] font-black text-teal-300'>
							{COSMIC_LANGUAGES.find(
								(l) => l.code === accessibility.language,
							)?.nativeName || 'English'}
						</span>
					</div>
					<div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
						{COSMIC_LANGUAGES.map((lang) => {
							const isSelected = accessibility.language === lang.code;
							return (
								<button
									key={lang.code}
									type='button'
									onClick={() => handleLanguageSelect(lang.code)}
									className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
										isSelected ?
											'bg-teal-500/20 border-teal-400 ring-2 ring-teal-400/40 text-teal-200 shadow-sm'
										:	'bg-[#080B1E] border-slate-700/70 text-slate-300 hover:border-slate-500'
									}`}>
									<span className='text-base'>{lang.flag}</span>
									<div className='min-w-0'>
										<div className='text-xs font-bold truncate'>
											{lang.label}
										</div>
										<div className='text-[9px] text-slate-400 truncate'>
											{lang.nativeName}
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* 8.2 Inclusive Accessibility Toggles */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-teal-500/20'>
					{/* Toggle: Dyslexia-Friendly Font */}
					<div
						role='button'
						tabIndex={0}
						onClick={handleToggleDyslexic}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleToggleDyslexic();
							}
						}}
						className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
							accessibility.dyslexicFont ?
								'bg-teal-500/15 border-teal-400 text-teal-200'
							:	'bg-[#080B1E] border-slate-700/70 text-slate-300 hover:border-slate-500'
						}`}>
						<div className='flex items-center justify-between'>
							<span className='text-xs font-bold'>
								Dyslexia Reading Mode
							</span>
							<span
								className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
									accessibility.dyslexicFont ?
										'bg-teal-400 text-slate-950'
									:	'bg-slate-800 text-slate-400'
								}`}>
								{accessibility.dyslexicFont ? 'Active' : 'Off'}
							</span>
						</div>
						<p className='text-[10px] text-slate-400 leading-snug'>
							Wide letter spacing and bottom-weighted hyper-legible letterforms.
						</p>
					</div>

					{/* Toggle: OLED High-Contrast Mode */}
					<div
						role='button'
						tabIndex={0}
						onClick={handleToggleOled}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleToggleOled();
							}
						}}
						className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
							accessibility.highContrastOled ?
								'bg-cyan-500/15 border-cyan-400 text-cyan-200'
							:	'bg-[#080B1E] border-slate-700/70 text-slate-300 hover:border-slate-500'
						}`}>
						<div className='flex items-center justify-between'>
							<span className='text-xs font-bold'>
								OLED Midnight Contrast
							</span>
							<span
								className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
									accessibility.highContrastOled ?
										'bg-cyan-400 text-slate-950'
									:	'bg-slate-800 text-slate-400'
								}`}>
								{accessibility.highContrastOled ? 'Active' : 'Off'}
							</span>
						</div>
						<p className='text-[10px] text-slate-400 leading-snug'>
							Pitch-black cosmic backdrop with reduced glare for low-light environments.
						</p>
					</div>

					{/* Toggle: Sensory Audio Frequency */}
					<div
						role='button'
						tabIndex={0}
						onClick={handleToggleSensoryAudio}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleToggleSensoryAudio();
							}
						}}
						className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
							accessibility.sensoryAudio ?
								'bg-purple-500/15 border-purple-400 text-purple-200'
							:	'bg-[#080B1E] border-slate-700/70 text-slate-300 hover:border-slate-500'
						}`}>
						<div className='flex items-center justify-between'>
							<span className='text-xs font-bold'>
								Soothing Sensory Audio
							</span>
							<span
								className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
									accessibility.sensoryAudio ?
										'bg-purple-400 text-slate-950'
									:	'bg-slate-800 text-slate-400'
								}`}>
								{accessibility.sensoryAudio ? 'Active' : 'Off'}
							</span>
						</div>
						<p className='text-[10px] text-slate-400 leading-snug'>
							Low-stimulation, warmer harmonic tones for children sensitive to sharp chimes.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
});

export default AudioAccessSettingsTab;
