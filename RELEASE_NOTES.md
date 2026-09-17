# 🚀 AstroQuest Release Notes

All notable changes, new capabilities, architectural enhancements, and pedagogical features across AstroQuest versions are documented here.

---

## 🌟 Version 1.1.0 — "The Cosmic Evolution Release" (September 2026)

**AstroQuest v1.1.0** represents a comprehensive leap forward, delivering multi-sensory learning, tactile interactivity, offline resilience, and automated testing across four fundamental pillars.

---

### 1. Pillar 1: Next-Gen AI & Pedagogical Scaffolding

- **Interactive Conversational Socratic AI Tutor (`AskDoubtModal.jsx`)**:
  - Upgraded the static explanation modal into an interactive, multi-turn conversational dialogue with the child's pet companion.
  - Implemented strict pedagogical guardrails (`askSocraticTutor` in `aiGenerator.js`) preventing direct answer reveals while offering gentle observational hints, step-by-step breakdowns, and child-friendly analogies.
  - Added quick-tap starter prompt pills: _💡 Secret Clue_, _🔍 Break it Down_, _🤔 Why not another choice?_, and _🚀 Explain simply_.
  - Added Text-to-Speech playback for every tutor response with synchronized companion reactions.
- **Hands-Free Speech-to-Text Answer Input (`useSpeechRecognition.js`, `QuestionCard.jsx`)**:
  - Built-in Web Speech API recognition enabling young learners (Ages 2–6) and pre-writers to answer hands-free.
  - Intelligently recognizes spoken letters (_"Option B"_, _"Letter C"_), ordinals (_"first one"_, _"second"_), and descriptive content keywords (_"Blue Square"_, _"Golden Star"_).
  - Features real-time microphone status indicator, pulsing audio wave feedback, and live transcript confirmation.
- **Adaptive Dynamic Difficulty Engine (`adaptiveEngine.js`)**:
  - Automatically assesses real-time session accuracy, streak velocity, and response times across 5 distinct tiers (_Cadet_ to _Cosmic Legend_).
  - Dynamically activates supportive visual scaffolding and hints upon repeated errors, while elevating complexity on fast correct answer streaks.

---

### 2. Pillar 2: Interactive Visuals & Tactile Manipulatives

- **Tactile Interactive Manipulatives (`InteractiveManipulative.jsx`)**:
  - **Interactive Balance Scale**: Draggable weight tokens (+1kg, -1kg) allow children to physically test weights on left and right pans; the SVG scale beam tilts dynamically with real-time torque physics and displays equilibrium status.
  - **Interactive Analog Clock**: Touch-and-drag minute and hour hand adjustments (+15m, -15m, +1hr) with instant digital readout for time-telling mastery.
  - **Rotatable 3D Block Tower**: Perspective switching (Left / Center / Right) allowing children to view hidden cubes behind pillars and physically count block towers in 3D.
- **Print-and-Play Cosmic Worksheets (`worksheetGenerator.js`)**:
  - One-click export of black-and-white, ink-saving printable PDF puzzle worksheets for screen-free classroom learning, travel, or homework practice.
  - Features personalized explorer headers, large handwriting-friendly answer bubbles, and an upside-down Mission Control Answer Key on the final page.

---

### 3. Pillar 3: Gamification, Lore & Motivation

- **Galaxy Odyssey Solar System Map (`GalaxyOdysseyModal.jsx`)**:
  - Interactive celestial roadmap spanning 10 destinations from Mercury to the Kuiper Belt.
  - Cosmic star energy collected from completed missions fuels spacecraft warp jumps to unlock new planetary stations, astronomical lore, and mission badges.
- **Educator & Parent Analytics Portal (`EducatorPortalModal.jsx`)**:
  - Protected behind a parent arithmetic security gate to prevent accidental child access.
  - Longitudinal performance tracking: 30-day cognitive domain mastery bars (Mental Arithmetic, Spatial Reasoning, Pattern Recognition, Language Reasoning, and Scientific Inquiry).
  - Generates personalized curriculum recommendations with 1-click PDF progress report export.
- **Living Pet Moods & Radiant Cosmic Aura (`LivingPetCharacter.jsx`)**:
  - Integrated dynamic mood states (`thinking` during hint requests, `celebrating` on correct answer streaks).
  - Added radiant golden and rainbow cosmic aura halos reflecting cumulative quest achievements.
- **Expanded 6-Card Cosmic Exploration Suite (`SkillSelectionDashboard.jsx`)**:
  - Dashboards now feature _Galaxy Odyssey_, _Time Warp Lightning_, _Stellar Observatory_, _Pocket Planetarium_, _Printable Worksheets_, and _Educator Analytics_.

---

### 4. Pillar 4: Architecture, Offline Resilience & Testing

- **Offline Quest Vault (`offlinePackService.js`, `questionService.js`)**:
  - Integrated a curated bank of verified questions across all 5 cognitive domains with complete diagrams, hints, and explanations.
  - Automatic offline detection: when internet drops or no API keys are entered, AstroQuest loads seamlessly from the offline vault with zero network latency or token costs.
- **Progressive Web App (PWA) (`manifest.json`, `index.html`)**:
  - Configured installable standalone PWA manifest for full-screen play on iPads, Android tablets, Chromebooks, and desktops.
- **Modular Custom State Hooks (`src/hooks/`)**:
  - Extracted monolithic logic into modular custom hooks: `useQuestSession.js`, `useCosmicAudio.js`, and `useSpeechRecognition.js`.
- **Vitest Automated Testing Suite**:
  - Added Vitest testing infrastructure with **11/11 tests passing**:
    - `tests/cryptoStorage.test.js`: AES-GCM / XOR key encryption & decryption integrity.
    - `tests/speechRecognition.test.js`: Spoken natural language answer parser.
    - `tests/adaptiveEngine.test.js`: Tier promotion & supportive scaffolding triggers.
    - `tests/offlinePackService.test.js`: Curated question schema, distractor, and solution validation.

---

## 🚀 Version 1.0.0 — Initial Release (September 2026)

- Multi-AI Provider architecture supporting Google Gemini, OpenAI ChatGPT, and Anthropic Claude with live zero-token key validation.
- Procedural SVG diagrams: clock faces, Venn diagrams, sequence ladders, isometric cube pyramids, and optics prisms.
- Web Audio procedural sound synthesis with 4 companion voice personalities.
- Pocket Planetarium (3D celestial bodies) & Stellar Sky Observatory (constellations).
- Time Warp Lightning Survival Mode with dynamic bonus seconds.
- Client-side AES-GCM encrypted API key vault with 3-second auto-masking.
- Cross-device JSON backup and restore with backward compatibility.
