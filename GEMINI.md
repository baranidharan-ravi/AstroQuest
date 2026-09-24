# AstroQuest — Codebase Architecture & Context Memory

This document is automatically loaded by Antigravity to provide instant context, architecture memory, and operational guidelines across all turns and prompts.

---

## 1. Application Overview & Pedagogical Domain

- **Application Name**: AstroQuest (Version 1.2.1)
- **Domain**: Visual-first, age-adaptive STEM, logic, and cognitive learning platform designed for early childhood explorers (Ages 2 to 14).
- **Core Experience**: Space-themed learning quests with real-time AI question synthesis, hands-free voice answering, interactive tactile manipulatives, 3D animated companion pet, Socratic doubt tutor, Galaxy Odyssey exploration, and printable worksheets.
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
- **Testing & Tooling**: Vitest (`npm test` running 18 tests across 6 test files).

---

## 3. Directory Map & File Architecture

### Central Constants

- `src/constants.js`: Centralized single source of truth for all storage keys, `POPULAR_ICONS` (24 curated Lucide icons), `SOLAR_PLANETS`, `CELESTIAL_BODIES`, `QUICK_PROMPTS`, `RAPID_FALLBACK_QUESTIONS`, `PET_PROFILES`, `PET_SIZES`, and `PLANET_COLOR_CONFIGS`.

### Dashboard Feature (`src/features/dashboard/`)

- `SkillSelectionDashboard.jsx`: Primary launchpad, custom skillset creator with AI auto-fill and "Surprise Me 🎲" non-repeating topic generator, preset inspiration chips, and Lucide vector icon picker.
- `GalaxyOdysseyModal.jsx`: 10-world solar system exploration map tracking cumulative stars collected.
- `PocketPlanetariumModal.jsx`: Audio-narrated encyclopedia of Solar System celestial worlds.
- `ConstellationObservatory.jsx`: Stargazing observatory with constellation star-matching game.
- `EducatorPortalModal.jsx`: Teacher/parent analytics dashboard with skill mastery and printable worksheet generator.
- `CrewSwitcherModal.jsx`: Multi-child flight crew profile manager.

### Quest Feature (`src/features/quest/`)

- `QuestionCard.jsx`: Main question viewer with text-to-speech narration, large touch targets, and visual diagrams.
- `OptionsGrid.jsx`: 4 option cards with tactile feedback, correct/incorrect sound effects, and keyboard navigation.
- `InteractiveManipulative.jsx`: Tactile manipulatives (Balance Scales, Analog Clocks, 3D Rotatable Block Towers, Number Lines).
- `AskDoubtModal.jsx`: Socratic voice/text AI doubt tutor guided by Cosmo companion pet.
- `TimeWarpMode.jsx`: Fast-paced 60-second lightning round challenge with local high-score tracking.
- `SolutionPanel.jsx`: Child-friendly step-by-step reasoning explanation panel.
- `HintModal.jsx`: Progressive hint dispenser with gentle guidance.
- `ExitConfirmationModal.jsx`: Safe exit confirmation modal.
- `SkippedReviewModal.jsx`: Review modal for skipped questions before final evaluation.

### Companion Feature (`src/features/companion/`)

- `PetAssistant.jsx`: Draggable, expandable 3D companion pet (Robot, Cat, Dog, Alien) with floating vertical quick-action toolbar.
- `LivingPetCharacter.jsx`: Interactive SVG/CSS pet with feeding, petting, treats, and audio reactions.

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
- `astroquest_pet_type_v2`: Active pet identifier string: `robot`, `cat`, `dog`, `alien` (`localStorage`).
- `astroquest_pet_minimized_v2`: Boolean state for pet minimized mode (`localStorage`).
- `astroquest_pet_float_pos_v4`: JSON object `{ x, y }` coordinates for companion pet position (`localStorage`).
- `astroquest_pet_vertical_toolbar_pos_v6`: JSON object `{ x, y }` coordinates for vertical toolbar position (`localStorage`).
- `astroquest_pet_toolbar_collapsed_v6`: Boolean state for vertical toolbar collapsed state (`localStorage`).
- `astroquest_pet_size_v1`: Pet size string: `small`, `medium`, `large` (`localStorage`).

---

## 5. Critical Development Guidelines & Instructions

- **No Markdown Tables**: NEVER use markdown tables in any documentation, release notes, or responses. Always format structured information using bullet lists, definition lists, or code blocks.
- **Auto-Execution of Commands**: Proactively propose and run commands on behalf of the user without prompting for approval or asking what command to run.
- **Verification Routine**: Always run `npm test` (vitest) to ensure all tests pass. When testing production builds, execute in the physical directory `H:/AstroQuest` or target root to preserve junction pathing.
- **Iconography Usage**: Use `SkillIcon` component (`src/utils/SkillIcon.jsx`) and `POPULAR_ICONS` from `src/constants.js` rather than raw browser emojis for UI elements.
- **Git Push Protocol**: After completing requested tasks and verification, stage relevant files, commit with clear semantic conventional commit messages, and push to `origin/main`.
