# AstroQuest — Agent Instructions & Codebase Memory

This file serves as the workspace-level memory and operational guide for all AI agents working on the AstroQuest codebase.

For complete architectural details, file maps, storage schemas, and developer directives, refer to:

- [`GEMINI.md`](./GEMINI.md)

---

## Quick Reference Summary

- **App Name & Version**: AstroQuest v1.4.0
- **Domain**: Space-themed early childhood STEM & cognitive challenge platform (Ages 2–14).
- **Core Stack**: React 18, Vite 6, Tailwind CSS 3, Lucide React (`SkillIcon`), Express 5 proxy server.
- **Central Constants**: All constants, configs, and storage keys are consolidated in [`src/constants.js`](./src/constants.js). Component-local constants are forbidden.
- **Icon System**: Vector SVG font icons via [`src/utils/SkillIcon.jsx`](./src/utils/SkillIcon.jsx) and `POPULAR_ICONS` with backwards-compatible emoji mapping.
- **Key Modules**:
  - Cosmic Space Habitat modular colony builder with 8 pods and live telemetry (`src/features/dashboard/CosmicHabitatModal.jsx`).
  - Tactile manipulatives: Balance scales, Analog clocks, 3D block towers, and Fraction crystals (`src/features/quest/InteractiveManipulative.jsx`).
  - Interactive canvas scratchpad with 5 space colors, eraser, undo, and glass mode (`src/features/quest/QuestScratchpad.jsx`).
  - 4 Strategic In-Quest Lifelines: Quick-access console (`src/features/quest/CosmicLifelinesBar.jsx`) and modal (`src/features/quest/HintModal.jsx`) providing Cosmic Clue, 50/50 Cosmic Ray, Starfleet Telemetry Scan, and Chrono Freeze (+30s). All 4 lifelines are strictly 1-time use per quest. Completing without lifelines awards the Pure Quest Navigator bonus (+50 XP).
- **Dashboard Logic**: When a user clicks "Surprise Me 🎲", the "Autofill with AI" button is automatically disabled until the skillset name is manually edited.
- **Mandatory Timer Rules**: Question countdown timer is mandatory for Upper Elementary (ages 8–10) and Middle School (ages 11–14). The duration can be changed (30s, 45s, 60s default, 90s, 2m, 3m, custom stepper), but unlimited time / disabling timer is locked. Early childhood explorers (ages 2–7) retain optional timers.
- **Testing**: Vitest (`npm test`), 42 unit tests across 11 files (100% pass rate).
- **Rules & Constraints**:
  - Never use markdown tables in any docs, guides, or release notes. Use bulleted/definition lists instead.
  - Never implement, revive, or re-introduce the Pet Assistant feature in future tasks or roadmap ideas (permanently removed per user directive as it obstructed option selection and is not important).
  - Automatically execute commands without prompting the user for approval.
  - Run `npm test` and build checks before concluding tasks.
