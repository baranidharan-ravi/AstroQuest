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
- **Testing**: Vitest (`npm test`), 28 tests across 10 suites with 100% pass rate.

---

## Key Modules & Single Source of Truth

- **Constants & Configs**: Centralized in `src/constants.js`. Holds `POPULAR_ICONS`, `SOLAR_PLANETS`, `CELESTIAL_BODIES`, `HABITAT_MODULES`, `PET_ACCESSORIES`, `QUICK_PROMPTS`, `RAPID_FALLBACK_QUESTIONS`, `PET_PROFILES`, `PET_SIZES`, `PLANET_COLOR_CONFIGS`, and all local storage keys.
- **Icon Component**: `src/utils/SkillIcon.jsx` provides Lucide React SVG font icons with bidirectional mapping for educational emojis.
- **Skillset Engine**: `src/utils/skillManager.js` handles custom skillset persistence, defaults, and presets.
- **Dashboard & Modals**: `src/features/dashboard/` contains `SkillSelectionDashboard.jsx`, `CosmicHabitatModal.jsx`, `GalaxyOdysseyModal.jsx`, `PocketPlanetariumModal.jsx`, `ConstellationObservatory.jsx`, and `EducatorPortalModal.jsx`.
- **Quest & Tutor**: `src/features/quest/` contains `QuestionCard.jsx`, `OptionsGrid.jsx`, `InteractiveManipulative.jsx`, `AskDoubtModal.jsx` (Socratic tutor), and `TimeWarpMode.jsx`.
- **Companion**: `src/features/companion/` contains `PetAssistant.jsx`, `PetWardrobeModal.jsx`, and `LivingPetCharacter.jsx`.

---

## Operating Guidelines & Constraints

- **No Markdown Tables**: Never use markdown tables in any markdown documents, release notes, or responses. Format using bullet lists, definition lists, or code blocks.
- **Auto-Execution of Commands**: Proactively run commands on behalf of the user without asking for approval or confirmation.
- **Verification Protocol**: Run `npm test` after any modifications to verify 100% test pass rate.
- **Junction Pathing**: `H:\Shraddha_Project` is a directory junction to `H:\AstroQuest`. Build commands can target `H:\AstroQuest` for clean Rollup pathing.
