# 🚀 Contributing to AstroQuest & User Guide Hub

<table>
  <tr>
    <td align="center" bgcolor="#161b22"><a href="README.md"><b>📖 README</b></a><br/><sub><font color="#7d8590">Overview</font></sub></td>
    <td align="center" bgcolor="#161b22"><a href="USER_START_GUIDE.md"><b>🚀 User Quick Start Guide</b></a><br/><sub><font color="#7d8590">Parents & Educators</font></sub></td>
    <td align="center" bgcolor="#21262d"><b>🤝 Contributing</b><br/><sub><font color="#f78166">━━━━━━ <b>Active Tab</b> ━━━━━━</font></sub></td>
    <td align="center" bgcolor="#161b22"><a href="documentation/AstroQuest_Implementation_Documentation.md"><b>📘 Technical Architecture</b></a><br/><sub><font color="#7d8590">System Specs</font></sub></td>
  </tr>
</table>

<p>
  <a href="README.md"><img src="https://img.shields.io/badge/📖_README-Overview-1f6feb?style=for-the-badge" alt="README tab"/></a>
  <a href="USER_START_GUIDE.md"><img src="https://img.shields.io/badge/🚀_User_Guide-Quick_Start-2ea44f?style=for-the-badge" alt="User Quick Start Guide tab"/></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/🤝_Contributing-Active-f78166?style=for-the-badge" alt="Contributing tab"/></a>
  <a href="documentation/AstroQuest_Implementation_Documentation.md"><img src="https://img.shields.io/badge/📘_Docs-Technical_Architecture-8957e5?style=for-the-badge" alt="Technical Architecture tab"/></a>
</p>

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
