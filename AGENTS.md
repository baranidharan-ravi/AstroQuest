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
- **Testing**: Vitest (`npm test`), 28 unit tests across 10 files.
- **Rules & Constraints**:
  - Never use markdown tables in any docs, guides, or release notes. Use bulleted/definition lists instead.
  - Automatically execute commands without prompting the user for approval.
  - Run `npm test` and build checks before concluding tasks.
