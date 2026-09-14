# 🚀 Contributing to AstroQuest & User Guide Hub

| 📖 [**README**](README.md) | 🚀 [**User Quick Start Guide**](USER_START_GUIDE.md) | 📘 [**Technical Architecture**](documentation/AstroQuest_Implementation_Documentation.md) |
| :------------------------: | :--------------------------------------------------: | :---------------------------------------------------------------------------------------: |

Welcome to **AstroQuest**! Whether you are a parent, educator, explorer, or developer, we welcome your feedback, ideas, and contributions.

---

## 🧭 Project Documentation Hub

- 🚀 **[User Quick Start Guide (USER_START_GUIDE.md)](USER_START_GUIDE.md)**: A complete, step-by-step guide for parents and educators covering quick setup, Gemini API key configuration, flight crew profiles, audio focus tools, and exploration modes.
- 📖 **[Main Project Overview (README.md)](README.md)**: Complete feature breakdown, core architecture, anti-screenshot protection, and system capabilities.
- 📘 **[Technical Architecture Documentation (AstroQuest_Implementation_Documentation.md)](documentation/AstroQuest_Implementation_Documentation.md)**: Full engineering documentation covering audio synthesis, Web Speech API recovery, cognitive analytics, and vector PDF diploma generation.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs & Suggesting Features

- If you find a bug or have a suggestion for improving AstroQuest, please open an Issue on GitHub with:
  - A clear description of the problem or feature idea.
  - Steps to reproduce (if reporting a bug).
  - Your browser and device type (e.g., Chrome on Windows, Safari on iPad, Chromebook).

### 2. Submitting Pull Requests (PRs)

1. Fork the repository and create a descriptive branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Follow existing project conventions:
   - Zero runtime chart or external audio dependencies (pure SVG and procedural Web Audio API).
   - Maintain 60fps performance and WCAG AA accessibility.
   - Code-split heavy modals and views using `React.lazy` and `Suspense`.
3. Verify your changes compile cleanly:
   ```bash
   npm run build
   ```
4. Commit your changes with clear semantic messages and submit a Pull Request.

Thank you for helping make cosmic learning accessible, engaging, and joyful for young explorers! 🌟
