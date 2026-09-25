# AstroQuest — Codebase Architecture & Context Memory

This document is automatically loaded by Antigravity to provide instant context, architecture memory, and operational guidelines across all turns and prompts.

---

## 1. Application Overview & Pedagogical Domain

- **Application Name**: AstroQuest (Version 1.4.0)
- **Domain**: Visual-first, age-adaptive STEM, logic, and cognitive learning platform designed for early childhood explorers (Ages 2 to 14).
- **Core Experience**: Space-themed learning quests with real-time AI question synthesis, hands-free voice answering, interactive tactile manipulatives, Socratic doubt tutor, Galaxy Odyssey exploration, Cosmic Space Habitat modular colony builder, and printable worksheets.
- **Repository Location**: `H:/Shraddha_Project` (NTFS Junction to `H:/AstroQuest`). Remote: `https://github.com/baranidharan-ravi/AstroQuest.git` (branch: `main`).

---

## 2. Core Tech Stack & Dependencies

- **Frontend Core**: React 18 (`react`, `react-dom`), Vite 6 (`vite`), Tailwind CSS 3 (`tailwindcss`, `autoprefixer`, `postcss`).
- **Iconography**: `lucide-react` (Vector SVG font icons via `SkillIcon.jsx`).
- **Backend / Proxy**: Express 5 (`server/index.js`) on port 5001 with automatic client-direct fallback when server is offline.
- **AI Providers**: Multi-provider support via `src/services/aiGenerator.js`:
  - Google Gemini (`@google/genai`)
  - OpenAI ChatGPT (`axios` REST API)
  - Anthropic Claude (`axios` REST API)
- **Audio & Speech**:
  - Web Audio API synthesizer (`audioSynthesis.js` with retro pops, chimes, boings, hums).
  - Web Speech API TTS (`speechSynthesis`) with pitch/rate adaptation for young children.
  - Web Speech API STT (`webkitSpeechRecognition` / `SpeechRecognition`) with phonetic matching for hands-free voice answers.
- **Utilities**: `canvas-confetti` (celebrations), `jspdf` (printables), `clsx`, `tailwind-merge`.
- **Testing & Tooling**: Vitest (`npm test` running 43 tests across 11 test files).

---

## 3. Directory Map & File Architecture

### Central Constants

- `src/constants.js`: Centralized single source of truth for all storage keys, `POPULAR_ICONS` (24 curated Lucide icons), `SOLAR_PLANETS`, `CELESTIAL_BODIES`, `HABITAT_MODULES`, `QUICK_PROMPTS`, `RAPID_FALLBACK_QUESTIONS`, `PLANET_COLOR_CONFIGS`, `DEFAULT_QUESTION_TIMER_SECONDS` (60s), and `isTimerMandatoryForAge` helper. All component-local constants must be placed here.

### Dashboard Feature (`src/features/dashboard/`)

- `SkillSelectionDashboard.jsx`: Primary launchpad with consolidated "Mission Parameters & Quest Controls" card (AI Question Engine status, Visual Diagrams 1-click toggle, question countdown challenge timer, and auto-advance pacing), custom skillset creator with AI auto-fill and "Surprise Me 🎲" non-repeating topic generator (disables "Autofill with AI" button upon clicking "Surprise Me" until text is manually edited), preset inspiration chips, and Lucide vector icon picker.
- `CosmicHabitatModal.jsx`: Interactive 2.5D modular space base colony builder with 8 unlockable pods (Solar Array, Greenhouse, Oxygen Scrubber, Radio Telescope, Crew Quarters, Fusion Reactor, Rover Garage, Quantum Supercomputer) tracking life-support ($\text{O}_2$), power grid ($\text{kW}$), and research ($\text{TB}$) telemetry.
- `GalaxyOdysseyModal.jsx`: 10-world solar system exploration map tracking cumulative stars collected.
- `PocketPlanetariumModal.jsx`: Audio-narrated encyclopedia of Solar System celestial worlds.
- `ConstellationObservatory.jsx`: Stargazing observatory with constellation star-matching game.
- `EducatorPortalModal.jsx`: Teacher/parent analytics dashboard with skill mastery and printable worksheet generator.
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

- `SettingsScreen.jsx`: Explorer profile configuration, AI provider credentials vault, timer toggles, audio controls.

### Services (`src/services/`)

- `aiGenerator.js`: Unified Gemini, OpenAI, and Claude API caller with strict JSON parsing, retry logic, non-repeating random skillset generator, Socratic tutor, and 30+ curated offline fallback themes.
- `questionService.js`: Dynamic question batch fetcher, age-level cognitive difficulty calibration, offline quest vault caching.
- `cryptoStorage.js`: AES-like obfuscated client storage for API keys.

### Core Utilities (`src/utils/`)

- `SkillIcon.jsx`: Universal vector SVG font icon renderer supporting all Lucide icons and bidirectional emoji mapping.
- `skillManager.js`: Custom skillset manager, preset definitions, color themes, import/export helpers.
- `CosmicQuestLoader.jsx`: 3D planetary orbit spaceship launch animation during AI synthesis.
- `audioSynthesis.js`: Procedural sound effects and voice synthesis controller.
- `badgeManager.js`: XP rewards, achievement badges, and cosmic rank progression.
- `progressTracker.js`: Explorer profile storage accessors and performance history.
- `backupManager.js`: JSON backup and restore for all explorer profiles and skillsets.
- `worksheetGenerator.js`: Printable PDF/HTML study sheets for home or classroom learning.

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
- **Verification Routine**: Always run `npm test` (vitest) to ensure all 43 tests across 11 test files pass. When testing production builds, execute in the physical directory `H:/AstroQuest` or target root to preserve junction pathing.
- **Git Push Protocol**: After completing requested tasks and verification, stage relevant files, commit with clear semantic conventional commit messages, and push to `origin/main`.
