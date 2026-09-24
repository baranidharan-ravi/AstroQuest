# 🚀 AstroQuest Release Notes

All notable changes, new capabilities, architectural enhancements, and pedagogical features across AstroQuest versions are documented here.

---

## 🌟 Version 1.4.0 — "Cosmic Space Habitat & Unobstructed Question Experience" (September 2026)

**AstroQuest v1.4.0** delivers the modular **Cosmic Space Habitat Base Builder**, while streamlining the learning experience by removing the floating Pet Assistant to guarantee a clean, completely unobstructed view for question cards and multiple-choice options.

---

### 1. Cosmic Space Habitat Base (`CosmicHabitatModal.jsx`)

- **Modular Off-World Colony Construction**:
  - Interactive 2.5D modular base builder accessible directly from the dashboard modes grid.
  - 8 distinct space modules: Bio-Hydroponic Dome, Helios Solar Matrix, Deep Space Comm Dish, Astro-Rover Hangar, Starlight Crystal Vault, Quantum Fusion Core, Cosmo AI Command Lab, and Interstellar Launch Pad.
  - Dynamic colony telemetry tracking life-support oxygen generation, solar/fusion energy grid output, pulsar science bandwidth, and surface explorer rovers.
  - Star milestone unlocking system where accumulated quest stars unlock blueprints and activate new sectors.
  - Interactive diagnostic tool allowing children to irrigate crops, align solar trackers, ping communication antennas, and test warp drive ignition with procedural audio and visual telemetry.
  - Full local persistence via `astroquest_habitat_modules_v1` with multi-component event sync.

---

### 2. Streamlined Learning & Unobstructed Option Selection

- **Pet Assistant Deprecated & Removed**:
  - Completely removed the floating Pet Assistant and companion wardrobe components.
  - Eliminates screen clutter between the question card and options grid, ensuring seamless tactile interaction and focus on cognitive challenges.
  - Cleaned up unused animations, CSS keyframes, and obsolete storage keys to reduce production bundle size.

---

### 3. Centralized Constants & Architecture

- **Centralized Constants (`src/constants.js`)**:
  - Added `HABITAT_STORAGE_KEY` and `HABITAT_MODULES` with comprehensive telemetry specs and thematic visual styles.
  - Removed legacy pet profile, sizing, and wardrobe constants.

---

### 4. Automated Testing & Verification

- **Comprehensive Test Suite (24 Tests Across 9 Test Files)**:
  - Added `tests/cosmicHabitat.test.jsx` testing habitat module specs, starter cost-free deployment, and storage persistence.
  - 100% test pass rate in Vitest (24 passed) and verified zero-error production build.

---

## 🌟 Version 1.3.0 — "Hands-On Tactile Learning & Cosmic Scratchpad" (September 2026)

**AstroQuest v1.3.0** introduces hands-on tactile problem-solving features, including a freehand calculation scratchpad directly on question cards and an interactive Fraction Energy Crystal manipulative.

---

### 1. Cosmic Drawing Scratchpad (`QuestScratchpad.jsx`)

- **Interactive Problem-Solving Canvas**:
  - Integrated high-performance HTML5/touch canvas directly on the question card for working out math steps, diagram annotations, and doodling.
  - Supports Retina and high-DPI screens via dynamic device pixel ratio scaling.
  - Features 5 space-themed colors (Laser Cyan, Star Gold, Nebula Pink, Aurora Green, Cosmic White) plus an active eraser tool.
  - Includes fine, medium, and bold stroke widths, 20-step undo history, clear button, and translucent glass mode so children can view the underlying question while sketching.

---

### 2. Fraction Energy Crystals Tactile Manipulative (`InteractiveManipulative.jsx`)

- **Tactile Fraction Learning**:
  - Added the `InteractiveFractionCrystals` manipulative (`diagramType: 'fraction-crystals'`).
  - Interactive SVG radial energy crystal with sliceable sectors (1/2, 1/3, 1/4, 1/6, 1/8).
  - Tappable glowing pie wedges that dynamically calculate active fraction and percentage telemetry.
  - Real-time spaceship fuel output meter with celebratory target detection and instant visual/sound feedback.

---

### 3. Automated Quality Assurance

- **Expanded Test Suite (20 Tests Across 8 Test Files)**:
  - Added dedicated unit tests for `QuestScratchpad` (`tests/questScratchpad.test.jsx`) and `FractionCrystals` (`tests/fractionCrystals.test.jsx`).
  - 100% test pass rate in Vitest and clean production build with Vite.

---

## 🌟 Version 1.2.1 — "Vector Font Icon Suite & Constants Centralization" (September 2026)

**AstroQuest v1.2.1** upgrades the skillset iconography architecture across the platform, replacing legacy browser emojis with high-resolution, responsive vector font icons powered by `lucide-react`. It also centralizes all component-level constants and storage keys into a single source of truth.

---

### 1. Vector Font Icon Suite (`SkillIcon.jsx`)

- **Crisp Vector SVG Font Icons**:
  - Replaced browser-dependent popular emojis with scalable, responsive SVG vector font icons from the `lucide-react` package.
  - Implemented the `SkillIcon` component (`src/utils/SkillIcon.jsx`) providing bidirectional mapping for both Lucide icon identifiers (`Rocket`, `Brain`, `Atom`, `Microscope`, etc.) and legacy emojis (`🚀`, `🧠`, `🔬`, etc.).
  - Preserves 100% backward compatibility for existing user custom skillsets and preset configurations stored in `localStorage`.

- **Modernized Icon Picker in Create Cosmic Skillset (`SkillSelectionDashboard.jsx`)**:
  - Replaced the emoji button row with an interactive 24-icon vector font picker (`POPULAR_ICONS`).
  - Added real-time active icon preview badge with clean text input supporting custom icon names or symbols.
  - Upgraded skill cards, preset inspiration buttons, info modal headers, and the Cosmic Quest Loader animation with crisp vector emblems.

---

### 2. Centralized Project Constants (`src/constants.js`)

- **Single Source of Truth**:
  - Extracted and centralized local component constants and storage keys across the dashboard, companion, quest, and loader modules.
  - Consolidated `POPULAR_ICONS`, `SOLAR_PLANETS`, `CELESTIAL_BODIES`, `QUICK_PROMPTS`, `RAPID_FALLBACK_QUESTIONS`, `PET_PROFILES`, `PET_SIZES`, `PLANET_COLOR_CONFIGS`, and 9 local storage keys.
  - Implemented backwards-compatible re-exports across components to prevent circular imports or breakage.

---

### 3. Automated Test Verification (`tests/skillIcon.test.jsx`)

- **Expanded Test Suite (18 Tests Across 6 Test Files)**:
  - Added dedicated unit tests verifying the `POPULAR_ICONS` catalog, Lucide icon component mappings, and emoji-to-vector fallback resolution.
  - 100% test pass rate across all test suites in Vitest.

---

## 🌟 Version 1.2.0 — "The Infinite Discovery & Random Skillset Engine" (September 2026)

**AstroQuest v1.2.0** introduces a dynamic, non-repeating skillset discovery engine and curated offline catalog, enabling learners and educators to effortlessly explore limitless STEM and logic adventures with a single click.

---

### 1. Dynamic Non-Repeating Random Skillset Generator

- **Dual "Surprise Me 🎲" Actions (`SkillSelectionDashboard.jsx`)**:
  - Added a dedicated purple gradient **`Surprise Me 🎲`** action button in the Create Skillset modal header banner.
  - Added an inline **`Surprise Me 🎲`** fast-tap button right beside the Skillset Name input label.
  - Automatically activates when clicking _Auto-Fill with AI_ with empty inputs, immediately generating an engaging, complete topic.
- **Strict Non-Repetition Memory Engine (`SkillSelectionDashboard.jsx`, `aiGenerator.js`)**:
  - Implemented session-level topic history buffer (`recentSuggestedTopics`) tracking up to 30 recently explored themes.
  - Feeds negative prompt constraints (`CRITICAL NON-REPETITION REQUIREMENT`) to Gemini, OpenAI, and Claude, instructing them never to repeat recent themes or synonyms.
  - Dynamically rotates across 24 multidisciplinary scientific domain seeds (Deep Sea, Kitchen Chemistry, Spy Ciphers, Dinosaur Paleontology, Robotics, Optical Illusions, Extreme Weather, Origami Geometry, and more).

---

### 2. Curated Offline Skillset Bank (30+ Themes) & Resilient Fallback

- **Expanded Offline Catalog (`CURATED_RANDOM_SKILLSETS`)**:
  - Built a curated catalog of 30+ complete, kid-calibrated skillsets with pedagogical descriptions, catchy taglines, custom emojis, and color themes.
  - Includes `getCuratedRandomSkillset(excludedTopics)` which samples without replacement to guarantee fresh topics on consecutive clicks.
  - Seamlessly activates when offline or when no AI API key is configured, so learners are never blocked by an error dialog when seeking inspiration.

---

### 3. Automated Verification & Quality Assurance

- **Full Suite Vitest Coverage (`tests/suggestSkillset.test.js`)**:
  - Added automated unit tests verifying schema integrity across all curated skillsets, non-repetition across multiple consecutive calls, and graceful offline fallback.
  - Full test suite passing with 15/15 tests across 5 test files with 100% success rate.

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
