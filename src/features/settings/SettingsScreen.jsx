import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { memo } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';
import CrewSwitcherModal from '../dashboard/CrewSwitcherModal';
import {
	AiEngineSettingsTab,
	AudioAccessSettingsTab,
	PacingSettingsTab,
	ProfileSettingsTab,
	SettingsStickyDock,
	SettingsTabBar,
	UnsavedChangesModal,
} from './components';
import { useSettingsState } from './hooks/useSettingsState';

/**
 * SettingsScreen Component (Refactored)
 *
 * Implements SOLID Single Responsibility:
 * Pure presentation orchestrator that delegates all state management,
 * validation, and persistence logic to the useSettingsState custom hook.
 */
const SettingsScreen = memo(function SettingsScreen({
	onSaveAndReturn,
	onBack,
	soundEnabled = true,
	pendingSkill = null,
}) {
	const {
		hasProfile,
		handleAttemptLeave,
		saveSuccess,
		setSaveSuccess,
		activeTab,
		setActiveTab,
		isFormLocked,
		isValidating,
		handleSave,
		showUnsavedModal,
		setShowUnsavedModal,
		handleSaveAndLeave,
		handleRevertAndLeave,
		isCrewModalOpen,
		setIsCrewModalOpen,
		crewMembers,
		handleTriggerImportBackup,
		handleExportBackup,
		backupStatus,
		backupFileInputRef,
		handleBackupFileChange,
		setBackupStatus,
		nameInput,
		setNameInput,
		error,
		setError,
		ageInput,
		setAgeInput,
		isMandatoryTimer,
		setTimerEnabled,
		genderInput,
		avatarInput,
		handleGenderSelect,
		avatarCategoryFilter,
		setAvatarCategoryFilter,
		filteredAvatars,
		handleAvatarSelect,
		selectedProvider,
		handleSelectProvider,
		providerKeys,
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
		setSelectedModel,
		setProviderModels,
		isModelRateLimited,
		timerEnabled,
		timerSeconds,
		setTimerSeconds,
		isCustomTimer,
		setIsCustomTimer,
		handleStepTimer,
		autoAdvanceEnabled,
		setAutoAdvanceEnabled,
		autoAdvanceSeconds,
		setAutoAdvanceSeconds,
		isCustomAutoAdvance,
		setIsCustomAutoAdvance,
		handleStepAutoAdvance,
		showVisualDiagrams,
		setShowVisualDiagrams,
		selectedPersonality,
		setSelectedPersonality,
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
		speakText,
	} = useSettingsState({
		onSaveAndReturn,
		onBack,
		soundEnabled,
		pendingSkill,
	});

	return (
		<div className='min-h-screen space-background flex flex-col text-white font-sans overflow-x-hidden select-none py-3 sm:py-6 px-2 sm:px-6'>
			{/* Top Bar Header */}
			<div className='max-w-3xl w-full mx-auto flex items-center justify-between gap-3 mb-4 sm:mb-6'>
				<div className='flex items-center gap-2.5 sm:gap-3'>
					{hasProfile && onBack && (
						<button
							onClick={handleAttemptLeave}
							className='p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition-all shadow-md cursor-pointer flex-shrink-0'
							title='Back to Dashboard'>
							<ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
						</button>
					)}
					<div>
						<h1 className='text-lg sm:text-2xl font-black text-white flex items-center gap-1.5 sm:gap-2'>
							<span>Explorer Profile & Settings</span>
							<Sparkles className='w-4 h-4 sm:w-5 sm:h-5 text-amber-300 flex-shrink-0' />
						</h1>
						<p className='text-[11px] sm:text-xs text-slate-300 font-semibold'>
							Configure child profile, Gemini API Key, AI model, and question
							pacing.
						</p>
					</div>
				</div>

				{pendingSkill && (
					<div className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black shadow flex-shrink-0'>
						<span>Ready to launch:</span>
						<span className='text-white'>{pendingSkill}</span>
					</div>
				)}
			</div>

			{/* Hidden file input for importing backup */}
			<input
				type='file'
				ref={backupFileInputRef}
				accept='.json,application/json'
				className='hidden'
				onChange={handleBackupFileChange}
			/>

			{/* Main Settings Form */}
			<div className='max-w-3xl w-full mx-auto bg-gradient-to-b from-[#1C1F5E]/90 via-[#141846]/95 to-[#0D1030] border-2 sm:border-4 border-amber-400/80 rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.25)] flex flex-col gap-3.5 sm:gap-6 backdrop-blur-md'>
				{/* Saved Settings Success Banner */}
				{saveSuccess && (
					<div
						role='status'
						aria-live='polite'
						className='bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-emerald-950/90 border-2 border-emerald-400 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(52,211,153,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-3 duration-300'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-inner flex-shrink-0'>
								<Check className='w-6 h-6 stroke-[3]' />
							</div>
							<div>
								<h3 className='text-sm sm:text-base font-black text-white flex items-center gap-2 flex-wrap'>
									<span>Settings Saved Successfully!</span>
									<span className='text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'>
										Locked & Active
									</span>
								</h3>
								<p className='text-xs text-emerald-200/90 font-medium mt-0.5'>
									All explorer parameters, API credentials, and pacing options
									are updated. Form values are locked.
								</p>
							</div>
						</div>
						<div className='flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0'>
							<button
								type='button'
								onClick={() => {
									playButtonPop(soundEnabled);
									setSaveSuccess(false);
								}}
								className='flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm'
								title='Unlock settings to edit values'>
								<span>Edit Settings ✏️</span>
							</button>
							{hasProfile && onBack && (
								<button
									type='button'
									onClick={() => {
										playButtonPop(soundEnabled);
										onBack();
									}}
									className='flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95'>
									<span>Return to Dashboard</span>
									<ArrowLeft className='w-3.5 h-3.5 rotate-180' />
								</button>
							)}
						</div>
					</div>
				)}

				{/* Settings Navigation Tabs */}
				<SettingsTabBar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					soundEnabled={soundEnabled}
				/>

				{/* Form Fields Locked Container when Validating or Saved */}
				<fieldset
					disabled={isFormLocked}
					className={`border-0 p-0 m-0 space-y-3.5 sm:space-y-6 transition-all ${
						isFormLocked ? 'opacity-85 pointer-events-none' : ''
					}`}>
					{/* Tab 1: Explorer Profile (Name, Age, Avatar, Flight Crew & Portability) */}
					{activeTab === 'profile' && (
						<ProfileSettingsTab
							crewMembers={crewMembers}
							isFormLocked={isFormLocked}
							handleTriggerImportBackup={handleTriggerImportBackup}
							handleExportBackup={handleExportBackup}
							soundEnabled={soundEnabled}
							setIsCrewModalOpen={setIsCrewModalOpen}
							backupStatus={backupStatus}
							setBackupStatus={setBackupStatus}
							nameInput={nameInput}
							setNameInput={setNameInput}
							error={error}
							setError={setError}
							ageInput={ageInput}
							setAgeInput={setAgeInput}
							isMandatoryTimer={isMandatoryTimer}
							setTimerEnabled={setTimerEnabled}
							genderInput={genderInput}
							avatarInput={avatarInput}
							handleGenderSelect={handleGenderSelect}
							avatarCategoryFilter={avatarCategoryFilter}
							setAvatarCategoryFilter={setAvatarCategoryFilter}
							filteredAvatars={filteredAvatars}
							handleAvatarSelect={handleAvatarSelect}
						/>
					)}

					{/* Tab 2: AI Intelligence Provider & Engine */}
					{activeTab === 'ai' && (
						<AiEngineSettingsTab
							selectedProvider={selectedProvider}
							handleSelectProvider={handleSelectProvider}
							providerKeys={providerKeys}
							isValidating={isValidating}
							isKeyError={isKeyError}
							copyBlockedMessage={copyBlockedMessage}
							apiKeyInput={apiKeyInput}
							isRevealed={isRevealed}
							handlePasteKey={handlePasteKey}
							handleKeyChange={handleKeyChange}
							handleKeyBlur={handleKeyBlur}
							handleBlockCopy={handleBlockCopy}
							handleKeyDownKey={handleKeyDownKey}
							hasCachedGeminiModels={hasCachedGeminiModels}
							isFetchingModels={isFetchingModels}
							handleFetchLiveModels={handleFetchLiveModels}
							modelsList={modelsList}
							selectedModel={selectedModel}
							fetchModelStatus={fetchModelStatus}
							setFetchModelStatus={setFetchModelStatus}
							modelSearchQuery={modelSearchQuery}
							setModelSearchQuery={setModelSearchQuery}
							filteredModels={filteredModels}
							soundEnabled={soundEnabled}
							setSelectedModel={setSelectedModel}
							setProviderModels={setProviderModels}
							error={error}
							setError={setError}
							isModelRateLimited={isModelRateLimited}
						/>
					)}

					{/* Tab 3: Timer, Auto-Advance & Visual Pacing */}
					{activeTab === 'pacing' && (
						<PacingSettingsTab
							isMandatoryTimer={isMandatoryTimer}
							timerEnabled={timerEnabled}
							setTimerEnabled={setTimerEnabled}
							isValidating={isValidating}
							soundEnabled={soundEnabled}
							timerSeconds={timerSeconds}
							setTimerSeconds={setTimerSeconds}
							isCustomTimer={isCustomTimer}
							setIsCustomTimer={setIsCustomTimer}
							handleStepTimer={handleStepTimer}
							autoAdvanceEnabled={autoAdvanceEnabled}
							setAutoAdvanceEnabled={setAutoAdvanceEnabled}
							autoAdvanceSeconds={autoAdvanceSeconds}
							setAutoAdvanceSeconds={setAutoAdvanceSeconds}
							isCustomAutoAdvance={isCustomAutoAdvance}
							setIsCustomAutoAdvance={setIsCustomAutoAdvance}
							handleStepAutoAdvance={handleStepAutoAdvance}
							showVisualDiagrams={showVisualDiagrams}
							setShowVisualDiagrams={setShowVisualDiagrams}
						/>
					)}

					{/* Tab 4: Audio, Voice & Neuro-Inclusive Accessibility */}
					{activeTab === 'audio' && (
						<AudioAccessSettingsTab
							selectedPersonality={selectedPersonality}
							setSelectedPersonality={setSelectedPersonality}
							soundEnabled={soundEnabled}
							speakText={speakText}
							ambientAudioEnabled={ambientAudioEnabled}
							setAmbientAudioEnabled={setAmbientAudioEnabled}
							ambientAudioVolume={ambientAudioVolume}
							setAmbientAudioVolume={setAmbientAudioVolume}
							startAmbientSound={startAmbientSound}
							stopAmbientSound={stopAmbientSound}
							setAmbientVolume={setAmbientVolume}
							isAmbientSoundPlaying={isAmbientSoundPlaying}
							selectedVoiceURI={selectedVoiceURI}
							setSelectedVoiceURI={setSelectedVoiceURI}
							availableVoices={availableVoices}
							voiceSearchQuery={voiceSearchQuery}
							setVoiceSearchQuery={setVoiceSearchQuery}
							filteredVoices={filteredVoices}
							accessibility={accessibility}
							handleLanguageSelect={handleLanguageSelect}
							handleToggleDyslexic={handleToggleDyslexic}
							handleToggleOled={handleToggleOled}
							handleToggleSensoryAudio={handleToggleSensoryAudio}
						/>
					)}
				</fieldset>

				{/* Error Alert */}
				{error && (
					<div
						role='alert'
						aria-live='assertive'
						className='bg-rose-500/20 border border-rose-500/50 rounded-2xl p-4 text-xs sm:text-sm font-bold text-rose-200 text-center animate-shake shadow-lg'>
						⚠️ {error}
					</div>
				)}

				{/* Sticky Save / Launch Action Bar */}
				<SettingsStickyDock
					nameInput={nameInput}
					activeTab={activeTab}
					saveSuccess={saveSuccess}
					hasProfile={hasProfile}
					onBack={onBack}
					soundEnabled={soundEnabled}
					setSaveSuccess={setSaveSuccess}
					isValidating={isValidating}
					handleAttemptLeave={handleAttemptLeave}
					handleSave={handleSave}
					pendingSkill={pendingSkill}
				/>
			</div>

			{/* Unsaved Changes Confirmation Modal */}
			<UnsavedChangesModal
				isOpen={showUnsavedModal}
				onClose={() => setShowUnsavedModal(false)}
				onSaveAndLeave={handleSaveAndLeave}
				onRevertAndLeave={handleRevertAndLeave}
				soundEnabled={soundEnabled}
			/>

			{/* Crew Switcher Modal */}
			{isCrewModalOpen && (
				<CrewSwitcherModal
					isOpen={isCrewModalOpen}
					onClose={() => setIsCrewModalOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}
		</div>
	);
});

export default SettingsScreen;
