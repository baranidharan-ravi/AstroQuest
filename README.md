# 🚀 AstroQuest — Live AI-Powered Cosmic Learning for Young Explorers

<p>
  <a href="README.md"><img src="https://img.shields.io/badge/⚡_Quick_Overview-Active-f78166?style=for-the-badge" alt="Quick Overview tab"/></a>
  <a href="README_DETAILED.md"><img src="https://img.shields.io/badge/📖_Detailed_Docs-Deep_Dive-ffd33d?style=for-the-badge&logoColor=000" alt="Detailed Docs tab"/></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/🚀_User_Guide_&_Contributing-Quick_Start-2ea44f?style=for-the-badge" alt="User Guide and Contributing tab"/></a>
  <a href="RELEASE_NOTES.md"><img src="https://img.shields.io/badge/🏷️_Release_Notes-v1.4.0-blue?style=for-the-badge" alt="Release Notes tab"/></a>
  <a href="documentation/AstroQuest_Implementation_Documentation.md"><img src="https://img.shields.io/badge/📘_Docs-Technical_Architecture-8957e5?style=for-the-badge" alt="Technical Architecture tab"/></a>
</p>

An engaging, visual-first educational web application engineered for early childhood and young learners (Ages 2 to 14). AstroQuest turns STEM, logic, and cognitive problem-solving into a space-themed cosmic exploration powered by live generative AI, hands-free voice answering, and tactile physical manipulatives.

> 📖 **Need the full comprehensive documentation?**
> For in-depth architectural specifications, mathematical formulas, SVG polygon rendering algorithms, and exhaustive feature breakdowns, see the **[Detailed AstroQuest Reference Guide (README_DETAILED.md)](./README_DETAILED.md)**.

---

## ✨ Core Feature Highlights

- **⚡ Multi-Provider Real-Time AI Generation**:
  - Synthesizes 100% fresh, non-repeating learning challenges live using **Google Gemini** (`@google/genai`), **OpenAI ChatGPT**, or **Anthropic Claude**.
  - Strict 4-tier age-calibrated pedagogy (Ages 2–4 Preschool, 5–7 Early Elementary, 8–10 Upper Elementary, 11–14 Middle School).
  - Resilient **Offline Quest Vault** with 30+ curated fallback topics for instant play without an internet connection or API keys.

- **🛰️ Cosmic Space Habitat Modular Space Base (`CosmicHabitatModal.jsx`)**:
  - Construct and expand an interactive 2.5D modular space base colony using cosmic stars earned across quests.
  - 8 unlockable modules: Solar Array, Hydroponic Greenhouse, Oxygen Scrubber, Deep Space Telescope, Bio-Dome Crew Quarters, Fusion Reactor, Rover Garage, and Quantum Supercomputer.
  - Live base telemetry tracking Oxygen production ($\text{O}_2\text{/day}$), Power Grid energy ($\text{kW}$), and Scientific Research ($\text{TB}$).

- **⚖️ Tactile Interactive Manipulatives (`InteractiveManipulative.jsx`)**:
  - **Balance Scale**: Real-time torque physics ($-18^\circ$ to $+18^\circ$) with draggable weights and equilibrium indicators.
  - **Analog Clock**: Interactive hour/minute hand controls with synchronized digital readouts.
  - **3D Block Towers**: Multi-angle isometric perspective controls (Left, Center, Right) to count hidden blocks in 3D space.
  - **Fraction Crystals (`FractionCrystalManipulative.jsx`)**: Energy crystal segmenting to visualize fractional values tactilely.

- **🎨 Interactive Canvas Scratchpad (`QuestScratchpad.jsx`)**:
  - High-DPI canvas overlay with 5 space-neon colors, adjustable stroke widths, eraser, undo stack, and translucent glass mode for solving problems directly on screen.

- **🪐 Socratic AI Doubt Tutor (`AskDoubtModal.jsx`)**:
  - Interactive voice-enabled dialogue led by Cosmo the cosmic guide. Bound by Socratic pedagogical guardrails to lead explorers toward answers with observation questions without giving away solutions.

- **🎙️ Hands-Free Voice Answering (`useSpeechRecognition.js`)**:
  - Web Speech API speech-to-answer system recognizing spoken letters (_"Option B"_), ordinals (_"the first one"_), and keywords (_"Blue Triangle"_).

- **🌌 Galaxy Odyssey, Observatory & Pocket Planetarium**:
  - **Galaxy Odyssey**: 10-world solar system exploration map unlocking planetary stations with mission stars.
  - **Stellar Observatory**: Connect stars into real constellations (Orion, Big Dipper, Cassiopeia) with daily habit loops.
  - **Pocket Planetarium**: 3D CSS planetary worlds with audio narration and scientific trivia.

- **📊 Educator Analytics & Printable Worksheets**:
  - **5-Axis Cognitive Radar Chart**: Visualizes aptitude across Mental Arithmetic, Spatial Reasoning, Pattern Recognition, Verbal Logic, and Scientific Inquiry.
  - **Printable PDF Diplomas & Worksheets**: 1-click export of landscape galactic explorer certificates and ink-saving classroom puzzle worksheets.

- **♿ WCAG 2.1 Level AA Accessibility**:
  - Complete single-key keyboard shortcuts (`1`–`4`, `A`–`D`, `Enter`, `Space`, `Escape`), high-contrast 4px focus rings, ARIA live region announcements, anti-screenshot question blurring, and a clean, unobstructed viewport.

---

## 🚀 Quick Setup in 3 Easy Steps

1. **Obtain an AI API Key**:
   - **Google Gemini (Recommended Free Tier)**: Generate an API key from [Google AI Studio](https://aistudio.google.com/app/apikey). No credit card required!
   - **OpenAI**: Get an API key from the [OpenAI Platform](https://platform.openai.com/api-keys).
   - **Anthropic**: Get an API key from the [Anthropic Console](https://console.anthropic.com/settings/keys).

2. **Configure Explorer Profile**:
   - Click **"Settings ⚙️"** in the top navigation bar.
   - Enter your **Child's Name**, select their **Age** (strictly clamped 2–14), and choose an **Astronaut Avatar**.

3. **Save & Launch**:
   - Select your AI Provider and paste your key into the secure vault (AES-GCM encrypted with 3-second auto-masking).
   - Click **"Save & Launch 🚀"** to run an instant live verification ping and start exploring!

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18, Vite 6, Tailwind CSS 3
- **Vector Iconography**: Lucide React via `SkillIcon.jsx` with bidirectional emoji mapping
- **AI Synthesis**: Google Gemini (`@google/genai`), OpenAI ChatGPT, Anthropic Claude (`src/services/aiGenerator.js`)
- **Audio & Speech**: Web Audio API procedural oscillator synthesis, Web Speech API TTS & STT
- **Security & Privacy**: Client-side AES-GCM 256-bit encryption with salted XOR fallback, DOM inspection defense, and optional Express 5 proxy server (`server/index.js`)
- **Testing**: Vitest (`npm test` — 24 unit tests across 9 test files, 100% pass rate)

---

## 💻 Developer Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/baranidharan-ravi/AstroQuest.git
cd AstroQuest

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev

# 4. Run automated unit tests
npm test

# 5. Build for production
npm run build

# 6. (Optional) Start the Express proxy server
npm run server
```

---

## 📚 Documentation Index

- **[Detailed Reference Guide (README_DETAILED.md)](./README_DETAILED.md)**: Full architecture specs, complete feature explanations, and mathematical diagrams.
- **[User Guide & Contributing Hub (CONTRIBUTING.md)](./CONTRIBUTING.md)**: Quick start guide, flight crew profiles, game mode rules, and open-source contribution guidelines.
- **[Technical Architecture & Specs (AstroQuest_Implementation_Documentation.md)](./documentation/AstroQuest_Implementation_Documentation.md)**: Deep engineering design document, WCAG accessibility audit, and security threat mitigations.
- **[Release Notes (RELEASE_NOTES.md)](./RELEASE_NOTES.md)**: Changelog and version history for all releases up to v1.4.0.
