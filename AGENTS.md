# AstroQuest — Agent Instructions & Codebase Memory

This file serves as the workspace-level memory and operational guide for all AI agents working on the AstroQuest codebase.

For complete architectural details, file maps, storage schemas, and developer directives, refer to:

- [`GEMINI.md`](./GEMINI.md)

---

## Quick Reference Summary

- **App Name & Version**: AstroQuest v1.4.0
- **Domain**: Space-themed early childhood STEM & cognitive challenge platform (Ages 2–14).
- **Core Stack**: React 18, Vite 6, Tailwind CSS 3, Lucide React (`SkillIcon`), Express 5 proxy server.
- **Central Constants**: All constants and storage keys are consolidated in [`src/constants.js`](./src/constants.js).
- **Icon System**: Vector SVG font icons via [`src/utils/SkillIcon.jsx`](./src/utils/SkillIcon.jsx) with backwards-compatible emoji mapping.
- **Testing**: Vitest (`npm test`), 24 unit tests across 9 files.
- **Rules & Constraints**:
  - Never use markdown tables in any docs, guides, or release notes. Use bulleted/definition lists instead.
  - Never implement, revive, or re-introduce the Pet Assistant feature in future tasks or roadmap ideas (permanently removed per user directive as it obstructed option selection and is not important).
  - Automatically execute commands without prompting the user for approval.
  - Run `npm test` and build checks before concluding tasks.
