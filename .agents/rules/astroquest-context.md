---
trigger: always_on
description: Comprehensive architecture, file map, storage keys, and development rules for AstroQuest.
---

# AstroQuest — Workspace Rules & Context Memory

This rule is unconditionally active (`always_on`) to ensure immediate, zero-latency awareness of AstroQuest's architecture, dependencies, and operational rules.

---

## Technical Architecture Overview

- **App**: AstroQuest v1.4.0
- **Domain**: Space-themed early childhood cognitive & STEM learning platform (Ages 2 to 14).
- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide React (vector font icons via `SkillIcon.jsx`).
- **AI Engines**: Google Gemini (`@google/genai`), OpenAI ChatGPT, Anthropic Claude (`src/services/aiGenerator.js`).
- **Audio & Speech**: Web Audio API oscillator synthesis, Web Speech API speech synthesis & voice recognition.
- **Testing**: Vitest (`npm test`), 42 tests across 11 suites with 100% pass rate.

---

## Key Modules & Single Source of Truth

- **Constants & Configs**: Centralized in `src/constants.js`. Holds `POPULAR_ICONS`, `SOLAR_PLANETS`, `CELESTIAL_BODIES`, `HABITAT_MODULES`, `QUICK_PROMPTS`, `RAPID_FALLBACK_QUESTIONS`, `PLANET_COLOR_CONFIGS`, `DEFAULT_QUESTION_TIMER_SECONDS` (60s), and `isTimerMandatoryForAge` helper. All component-local constants must live here.
- **Icon Component**: `src/utils/SkillIcon.jsx` provides Lucide React SVG font icons with bidirectional mapping for educational emojis.
- **Skillset Engine**: `src/utils/skillManager.js` handles custom skillset persistence, defaults, and presets.
- **Dashboard & Modals**: `src/features/dashboard/` contains `SkillSelectionDashboard.jsx` (Surprise Me topic generator disables "Autofill with AI" button until input changes), `CosmicHabitatModal.jsx` (8-module space base colony builder with $\text{O}_2$, $\text{kW}$, $\text{TB}$ telemetry), `GalaxyOdysseyModal.jsx`, `PocketPlanetariumModal.jsx`, `ConstellationObservatory.jsx`, and `EducatorPortalModal.jsx`.
- **Quest & Tutor**: `src/features/quest/` contains `QuestionCard.jsx`, `OptionsGrid.jsx`, `CosmicLifelinesBar.jsx` (direct 1-click console for all 4 lifelines with 1-time per quest persistence and Pure Quest tracking), `InteractiveManipulative.jsx` (Balance scales, Analog clocks, 3D block towers, Fraction crystals), `QuestScratchpad.jsx` (5 space colors, eraser, undo, glass mode), `HintModal.jsx` (4 lifelines: Cosmic Clue, 50/50 Blast, Telemetry Scan radar, Chrono Freeze boost), `AskDoubtModal.jsx` (Socratic tutor guided by Cosmo), and `TimeWarpMode.jsx`.

---

## Operating Guidelines & Constraints

- **No Markdown Tables**: Never use markdown tables in any markdown documents, release notes, or responses. Format using bullet lists, definition lists, or code blocks.
- **Pet Assistant Deprecated**: NEVER implement, revive, or re-introduce the Pet Assistant, companion pet wardrobe, or draggable pet assistant features in future tasks or roadmap ideas (permanently removed per user directive as it obstructed option selection and is not important).
- **Mandatory Question Timer for Ages 8–14**: Question countdown timer is mandatory for Upper Elementary (ages 8–10) and Middle School (ages 11–14). The duration can be adjusted (30s, 45s, 60s default, 90s, 2m, 3m, or custom stepper), but unlimited time / turning the timer off is strictly locked. Ages 2–7 retain optional toggleable timers.
- **Centralized Constants Single Source of Truth**: All configs, storage keys, and constant definitions must live in `src/constants.js`.
- **Surprise Me Autofill Logic**: When a user clicks "Surprise Me 🎲", the "Autofill with AI" button must be disabled until the skillset name is manually edited.
- **Auto-Execution of Commands**: Proactively run commands on behalf of the user without asking for approval or confirmation.
- **Verification Protocol**: Run `npm test` after any modifications to verify 100% test pass rate.
- **Junction Pathing**: `H:\Shraddha_Project` is a directory junction to `H:\AstroQuest`. Build commands can target `H:\AstroQuest` for clean Rollup pathing.
