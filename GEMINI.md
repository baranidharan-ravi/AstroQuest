# AstroQuest — Codebase Architecture & Context Memory

This document is automatically loaded by Antigravity to provide instant context, architecture memory, and operational guidelines across all turns and prompts.

---

## 1. Application Overview & Pedagogical Domain

- **Application Name**: AstroQuest (Version 1.4.1)
- **Domain**: Visual-first, age-adaptive STEM, logic, and cognitive learning platform designed for early childhood explorers (Ages 2 to 14).
- **Core Experience**: Space-themed learning quests with real-time AI question synthesis, hands-free voice answering, interactive tactile manipulatives, Socratic doubt tutor, Galaxy Odyssey exploration, Cosmic Space Habitat modular colony builder, and printable worksheets.
- **Repository Location**: `H:/Shraddha_Project` (NTFS Junction to `H:/AstroQuest`). Remote: `https://github.com/baranidharan-ravi/AstroQuest.git` (branch: `main`).

---

## 2. Core Tech Stack & Dependencies

- **Frontend Core**: React 18 (`react`, `react-dom`), Vite 6 (`vite`), Tailwind CSS 3 (`tailwindcss`, `autoprefixer`, `postcss`).
- **Iconography**: `lucide-react` (Vector SVG font icons via `SkillIcon.jsx`).
- **Backend / Proxy**: Express 5 (`server/index.js`) on port 5001 with automatic client-direct fallback when server is offline.
- **AI Providers**: Multi-provider support via `src/services/ai/`:
  - Google Gemini (`@google/genai`)
  - OpenAI ChatGPT (`axios` REST API)
  - Anthropic Claude (`axios` REST API)
- **Audio & Speech**:
  - Web Audio API synthesizer (`audioSynthesis.js` with retro pops, chimes, boings, hums).
  - Web Speech API TTS (`speechSynthesis`) with pitch/rate adaptation for young children.
  - Web Speech API STT (`webkitSpeechRecognition` / `SpeechRecognition`) with phonetic matching for hands-free voice answers.
- **Utilities**: `canvas-confetti` (celebrations), `jspdf` (printables), `clsx`, `tailwind-merge`.
- **Testing & Tooling**: Vitest (`npm test` running 70 tests across 15 test files, 100% pass rate).

---

## 3. Directory Map & File Architecture

### Central Constants & Static Data

- `src/constants.js`: Centralized single source of truth for all storage keys, `POPULAR_ICONS` (24 curated Lucide icons), `DEFAULT_QUESTION_TIMER_SECONDS` (60s), and `isTimerMandatoryForAge` helper. All component-local constants must be placed here.
- `src/data/`: Modular data stores re-exported through `constants.js`:
  - `celestialData.js`: Curated NASA/JWST celestial image catalogs and planetary facts.
  - `cosmicFeatureModes.js`: Definitions for special game modes and exploration hubs.
  - `curriculumStandards.js`: Age-bracket pedagogical standards and difficulty curves.
  - `habitatModules.js`: Base builder module definitions and telemetry requirements.
  - `popularIcons.js`: Vector icon catalog and educational emoji mappings.
  - `rapidFallbackQuestions.js`: Offline emergency fallback question repository.

### Dashboard Feature (`src/features/dashboard/`)

- `SkillSelectionDashboard.jsx`: Primary launchpad with consolidated "Mission Parameters & Quest Controls" card, custom skillset creator with AI auto-fill and "Surprise Me 🎲" non-repeating topic generator, preset inspiration chips, and Lucide vector icon picker.
- `components/`: Modular subcomponents:
  - `MissionParametersCard.jsx`: AI Question Engine status, Visual Diagrams 1-click toggle, question countdown challenge timer, and auto-advance pacing.
  - `PredefinedFeaturesGrid.jsx`: 2.5D space base, observatory, and planetarium hubs.
  - `SkillsetsGrid.jsx`: Custom and preset skillset cards with progress meters.
  - `CreateSkillsetModal.jsx`: Custom skillset creation modal.
  - `SkillDeleteModal.jsx`: Skillset deletion confirmation modal.
  - `SkillInfoModal.jsx`: Skill pedagogical info and curriculum modal.
- `CosmicHabitatModal.jsx`: Interactive 2.5D modular space base colony builder with 8 unlockable pods tracking life-support ($\text{O}_2$), power grid ($\text{kW}$), and research ($\text{TB}$) telemetry.
- `GalaxyOdysseyModal.jsx`: 10-world solar system exploration map tracking cumulative stars collected.
- `PocketPlanetariumModal.jsx`: Audio-narrated encyclopedia of Solar System celestial worlds.
- `ConstellationObservatory.jsx`: Stargazing observatory with constellation star-matching game.
- `EducatorPortalModal.jsx`: Teacher/parent analytics dashboard with skill mastery and printable worksheet generator.
- `PerformanceObservatoryModal.jsx`: High-performance diagnostic observatory with live FPS sparkline, main-thread Long Tasks profiler, memory telemetry, and automated stress benchmarks.
- `CrewSwitcherModal.jsx`: Multi-child flight crew profile manager.

### Quest Feature (`src/features/quest/`)

- `QuestionCard.jsx`: Main question viewer with text-to-speech narration, large touch targets, visual diagrams, and embedded scratchpad launcher.
- `QuestScratchpad.jsx`: Interactive touch/canvas drawing scratchpad with High-DPI support, 5 space colors, eraser, undo, and translucent glass mode.
- `OptionsGrid.jsx`: 4 option cards with tactile feedback, correct/incorrect sound effects, and keyboard navigation.
- `InteractiveManipulative.jsx`: Tactile manipulatives (Balance Scales, Analog Clocks, 3D Rotatable Block Towers, Fraction Energy Crystals via `FractionCrystalManipulative.jsx`).
- `CosmicLifelinesBar.jsx`: Quick-access direct lifeline console mounted outside question sections for 1-click activation of all 4 lifelines (Cosmic Clue, 50/50 Blast, Telemetry Radar, Chrono Freeze). Enforces strict single-use per quest on all lifelines with inline clue banner and Pure Quest Navigator bonus tracking.
- `AskDoubtModal.jsx`: Socratic voice/text AI doubt tutor guided by Cosmo the cosmic guide.
- `TimeWarpMode.jsx`: Fast-paced 60-second lightning round challenge with local high-score tracking.
- `SolutionPanel.jsx`: Child-friendly step-by-step reasoning explanation panel.
- `HintModal.jsx`: 4 strategic in-quest lifelines modal backup with single-use per quest locking.
- `ExitConfirmationModal.jsx`: Safe exit confirmation modal.
- `SkippedReviewModal.jsx`: Review modal for skipped questions before final evaluation.

### Results Feature (`src/features/results/`)

- `ResultOverview.jsx`: Mission completion summary, XP calculation, star rewards, rank promotions, and confetti animations.
- `QuestionSummary.jsx`: Complete question-by-question review screen with correct answers and explanations.
- `CognitiveRadarChart.jsx`: 5-axis cognitive radar chart depicting child's strengths.

### Settings Feature (`src/features/settings/`)

- `SettingsScreen.jsx`: Explorer profile configuration orchestrator with dirty-state guard and unsaved changes modal.
- `hooks/useSettingsState.js`: Encapsulated settings form logic, dirty detection, and validation handlers.
- `components/`: Modular tabs:
  - `ProfileSettingsTab.jsx`: Child name, age selection, and astronaut avatar customization.
  - `SecuritySettingsTab.jsx`: Encrypted AI API credentials vault (Gemini, OpenAI, Claude).
  - `MissionSettingsTab.jsx`: Question countdown timer preferences and auto-advance controls.
  - `AudioAccessibilityTab.jsx`: Text-to-speech voice selector, rate/pitch sliders, and sound FX volumes.
  - `SettingsResetModal.jsx`: Reset confirmation modal.

### Services (`src/services/`)

- `aiGenerator.js`: Facade re-exporting the modular AI architecture under `src/services/ai/`.
- `ai/`: Modular AI subsystem:
  - `aiConfig.js`: Provider credentials, storage keys, dynamic model scoring, and rate-limiting tracking.
  - `aiClientCallers.js`: Direct HTTP API callers for Gemini, OpenAI, and Claude with retry logic and error sanitization.
  - `questionSynthesizer.js`: Parallel batch question synthesis, retry orchestration, and space expedition campaigns.
  - `questionParser.js`: Resilient JSON cleaning, options shuffling, and age-calibrated pedagogical prompts.
  - `aiImageGenerator.js`: Multi-provider image synthesis and prompt sanitization.
  - `curatedSkillsets.js`: Non-repeating random skillset topic banks & AI topic suggestion.
  - `socraticTutor.js`: Socratic AI doubt resolution engine guided by Cosmo.
  - `skillDefinitions.js`: Skill pedagogical descriptions and core learning objectives.
  - `diagramSynchronizer.js`: Geometric synchronization & visual diagram validation.
  - `index.js`: Barrel export providing all AI symbols with 100% backwards compatibility.
- `questionService.js`: Dynamic question batch fetcher, age-level cognitive difficulty calibration, offline quest vault caching.
- `cryptoStorage.js`: AES-like obfuscated client storage for API keys.
- `apiClient.js`: Centralized Axios client with exponential backoff retry interceptors.

### Core Utilities (`src/utils/`)

- `VisualDiagrams.jsx`: Facade orchestrator delegating to specialized SVG subcomponents under `src/utils/diagrams/`:
  - `CognitiveDiagrams.jsx`: Analogy maps, odd-one-out, cause-effect, sequence ladders, matrix grids, apple counters, scale balance.
  - `SpatialRotationDiagram.jsx`: 2D/3D angular rotations, symmetry axes, and quadrant steps.
  - `ShapePatternDiagram.jsx`: Geometric sequence progression and shape cluster cards.
  - `IsometricTowerDiagram.jsx`: 3D isometric cube rendering and tower layers.
  - `OpticsPrismDiagram.jsx`: Refraction and light dispersion diagrams.
  - `LazyVisualImage.jsx`: Safe image loader with placeholder fallback.
  - `conceptVisualDictionary.js`: Keyword concept visual matcher.
  - `diagramMatcher.js`: Diagram type validator ensuring questions get appropriate visuals.
  - `CelestialPhotographyCard.jsx`: NASA/JWST telemetry cards and deep-space photo visualizer.
  - `index.js`: Barrel export for all diagram renderers and helpers.
- `shapeGenerator.jsx`: Facade delegating to modular SVG generators under `src/utils/shapes/` (`shapeParsers.js`, `DynamicSvgShape.jsx`, `DynamicShapeCard.jsx`, `ShapeClusterCard.jsx`).
- `avatarManager.jsx`: Modular astronaut avatar selector leveraging catalog in `src/utils/avatars/presetAvatars.jsx`.
- `SkillIcon.jsx`: Universal vector SVG font icon renderer supporting all Lucide icons and bidirectional emoji mapping.
- `skillManager.js`: Custom skillset manager, preset definitions, color themes, import/export helpers.
- `CosmicQuestLoader.jsx`: 3D planetary orbit spaceship launch animation during AI synthesis.
- `audioSynthesis.js`: Procedural sound effects and voice synthesis controller.
- `badgeManager.js`: XP rewards, achievement badges, and cosmic rank progression.
- `progressTracker.js`: Explorer profile storage accessors and performance history.
- `backupManager.js`: JSON backup and restore for all explorer profiles and skillsets.
- `worksheetGenerator.js`: Printable PDF/HTML study sheets for home or classroom learning.
- `performanceMonitor.js`: Web Vitals sampling, real-time FPS budget tracker, Long Tasks observer, and stress benchmarks.

---

## 4. Key Storage Keys & Persistence Schema

- `astroquest_custom_skillsets_v1`: JSON array of custom user-created skillsets (`localStorage`).
- `astroquest_suggested_skillsets_v1`: JSON array of up to 30 recently explored topic names to prevent repetition (`sessionStorage`).
- `astroquest_timewarp_highscore`: Integer high score for Time-Warp speed mode (`localStorage`).
- `astroquest_total_stars_collected_v1`: Integer total cosmic stars accumulated for Galaxy Odyssey (`localStorage`).
- `astroquest_habitat_modules_v1`: JSON array of unlocked space base module IDs (`localStorage`).

---

## 5. Critical Development Guidelines & Instructions

- **No Markdown Tables**: NEVER use markdown tables in any documentation, release notes, or responses. Always format structured information using bullet lists, definition lists, or code blocks.
- **Pet Assistant Deprecated**: NEVER implement, revive, or re-introduce the Pet Assistant, companion pet wardrobe, or draggable pet assistant features in future tasks or ideas (permanently removed per user directive as it obstructed options selection and is not important).
- **Centralized Constants Single Source of Truth**: NEVER declare local configuration constants or storage keys inside components; always import or define them in `src/constants.js`.
- **Surprise Me Button Logic**: When a user fills the skillset name by clicking "Surprise Me 🎲", the "Autofill with AI" button must be disabled until the user edits the skillset name text.
- **Iconography Usage**: Use `SkillIcon` component (`src/utils/SkillIcon.jsx`) and `POPULAR_ICONS` from `src/constants.js` rather than raw browser emojis for UI elements.
- **Mandatory Question Timer for Ages 8–14**: Question countdown timer is mandatory for Upper Elementary (ages 8–10) and Middle School (ages 11–14) to maintain cognitive challenge. For these ages, the timer cannot be disabled (unlimited time locked), though explorers can adjust the duration (presets: 30s, 45s, 60s default, 90s, 2m, 3m, or custom stepper). Explorers aged 2–7 retain optional/toggleable timers. Default timer across the app is 60 seconds.
- **Auto-Execution of Commands**: Proactively propose and run commands on behalf of the user without prompting for approval or asking what command to run.
- **Verification Routine**: Always run `npm test` (vitest) to ensure all 70 tests across 15 test files pass. When testing production builds, execute in the physical directory `H:/AstroQuest` or target root to preserve junction pathing.
- **Git Push Protocol**: After completing requested tasks and verification, stage relevant files, commit with clear semantic conventional commit messages, and push to `origin/main`.
