# 🚀 AstroQuest: Technical Architecture & Implementation Documentation

**Document Version**: 2.0.0 (Production Edition)
**Document Version**: 2.1.0 (Cosmic Evolution Edition)
**Classification**: Engineering Design & Technical Implementation Specification
**Target Platforms**: Modern Web Browsers (Chrome, Edge, Safari, Firefox), Desktop, Tablet, Mobile Responsive
**Target Platforms**: Modern Web Browsers (Chrome, Edge, Safari, Firefox), Desktop, Tablet, Mobile Responsive, PWA Installable

---

## 1. Executive Summary & System Overview

AstroQuest is an engaging, visual-first, cognitive learning web application engineered for early explorers and young students (Ages 2 to 14). Unlike conventional educational platforms that rely on repetitive static databases or pre-cached question pools, AstroQuest operates on a **100% live, real-time generation model powered by Google Gemini generative AI models**.
AstroQuest is an engaging, visual-first, cognitive learning web application engineered for early explorers and young students (Ages 2 to 14). Operating on a **multi-provider generative AI model (Google Gemini, OpenAI ChatGPT, Anthropic Claude)** alongside a resilient **Offline Quest Vault**, AstroQuest provides adaptive cognitive challenges, an interactive Socratic AI tutor, hands-free speech-to-answer recognition, and tactile interactive manipulatives.

The application synthesizes strictly dynamic mathematical diagrams, polygonal SVG vector geometry, 3x3 pattern matrix progressions, 3D isometric block pyramids, optics light refraction representations, and scientific cause-and-effect processes. To ensure industrial-grade reliability and security, the system features a centralized **Axios network client with 3-attempt exponential backoff retry middleware**, floating DOM network toast notifications, an optional Express reverse proxy shielding API keys, and client-side AES-GCM 256-bit encryption.
The application synthesizes strictly dynamic mathematical diagrams, polygonal SVG vector geometry, 3x3 pattern matrix progressions, 3D isometric block pyramids, optics light refraction representations, and scientific cause-and-effect processes. To ensure industrial-grade reliability and security, the system features a centralized **Axios network client with 3-attempt exponential backoff retry middleware**, client-side AES-GCM 256-bit encryption, an offline question vault, an installable Progressive Web App (PWA) manifest, and automated Vitest regression testing.

---

## 2. Technology Stack Mapping: Requirements vs. Technologies

| Requirement Category | Technology / Library | Version / Specs | Architectural Rationale & Benefit |
| :--- | :--- | :--- | :--- |
| **Core UI Framework** | React.js | 18.3.1 | Declarative component model, React.memo, Suspense, and hook-based modular state architecture. |
| **Bundler & Dev Server** | Vite | 6.0.7 (Rollup) | Sub-second Hot Module Replacement (HMR) and optimized Rollup code-splitting with manual chunking. |
| **Bundler & Dev Server** | Vite | 6.4.3 (Rollup) | Sub-second Hot Module Replacement (HMR) and optimized Rollup code-splitting with manual chunking. |
| **Styling & Responsive UI** | Tailwind CSS | 3.4.17 | Utility-first styling with custom space-theme palettes, dynamic fluid grids, and hardware-accelerated animations. |
| **Automated Testing** | Vitest | 5.0.1 | Fast automated test runner for crypto encryption, speech recognition parsing, and question schema verification. |
| **Progressive Web App** | Web App Manifest | W3C PWA Standard | Enables full-screen installation and offline caching on Chromebooks, iPads, and desktop platforms. |
| **HTTP & Network Layer** | Axios | 1.20.0 | Centralized client with request/response interceptors, automatic retries with exponential backoff, and timeouts. |
| **Generative AI Engine** | Google Gemini API | v1beta REST | Real-time multi-modal LLM content generation supporting gemini-3.5-flash-lite, flash, and flash-preview. |
| **Generative AI Engine** | Google Gemini, OpenAI, Claude | Multi-Provider | Multi-model content generation with live key verification, adaptive difficulty, and Socratic tutoring. |
| **AI Image Synthesis** | Google Imagen 3 / Pollinations | Multi-Provider | Multi-tier failover pipeline for visual puzzle image generation (Imagen 3 -> Flash Image -> Pollinations AI). |
| **Audio Synthesis & TTS** | Web Speech API | Browser Native | Zero-asset text-to-speech narration with Chromium pause-queue workaround and single-voice guarantee. |
| **Speech Recognition** | Web Speech API | Browser Native | Hands-free speech-to-answer input matching spoken letters, ordinals, and answer keywords. |
| **Sound FX Synthesis** | Web Audio API | Browser Native | Pure procedural oscillator sound generation (sine/triangle waves) for pop, star, success, and fanfare effects. |
| **PDF Report Generation** | jsPDF & html2canvas | 4.2.1 / 1.4.1 | Dynamically imported on-demand to create personalized, multi-page vector session summaries. |
| **PDF Report Generation** | jsPDF & html2canvas | 4.2.1 / 1.4.1 | Dynamically imported on-demand to create personalized diplomas, progress reports, and printable puzzle worksheets. |
| **Security & Reverse Proxy** | Express.js & CORS | 5.2.1 / 2.8.6 | Shields Google Gemini API keys from browser DevTools; converts binary image buffers to base64. |
| **Data Encryption** | Web Crypto API (SubtleCrypto) | AES-GCM 256-bit | Hardware-backed browser encryption securing saved API keys in localStorage with unique IVs. |
| **Iconography** | Lucide React | 1.16.0 | Lightweight, modern SVG icon set tree-shaken into an isolated vendor bundle. |
| **Interactive Confetti** | Canvas Confetti | 1.9.4 | Hardware-accelerated particle animation engine for celebrating quiz completions. |

---

## 3. System Architecture & High-Level Flow Diagrams

### 3.1 End-to-End Application Execution Flow

```
 +-------------------------------------------------------------------------+
 | 1. LANDING DASHBOARD (SkillSelectionDashboard.jsx)                      |
 |    - Displays student profile summary (Name, Age, Active Settings)      |
 |    - Student selects Visual Quest or Analytical Thinking Quest          |
 +------------------------------------+------------------------------------+
                                      |
                           [Has Valid Gemini Key?]
                                 /          \
                             [No]            [Yes]
                              /                \
  +--------------------------v---+        +-----v--------------------------+
  | 2. SETTINGS SCREEN           |        | 3. QUESTION SYNTHESIS PIPELINE |
  |    - Enter Gemini Key        |        |    - questionService.js        |
  |    - Select AI Model         |        |    - Request 2 Batches (6+6)   |
  |    - Configure Timers/Voice  |        |    - Parse & Deduplicate       |
  |    - Live API Key Ping       |        |    - Guarantee 10 Questions    |
  |    - Dirty-State Guard       |        +-----+--------------------------+
  +--------------+---------------+              |
                 | (Saved & Validated)          |
                 +------------------------------+
                                                |
  +---------------------------------------------v--------------------------+
  | 4. COSMIC QUEST LOADER (CosmicQuestLoader.jsx)                         |
  |    - Dynamic Explorer Name & Age binding (Settings Storage)            |
  |    - Adaptive Skillset Theming: Visual (Eye) vs Analytical (Brain)     |
  |    - Orbiting vector space rocket, radar pulses, & warp energy gauge   |
  |    - Rotating mission telemetry steps & live link status               |
  +---------------------------------------------+--------------------------+
                                                | [Synthesis Complete]
  +---------------------------------------------v--------------------------+
  | 5. INTERACTIVE QUEST INTERFACE (App.jsx)                               |
  |    - QuestionCard.jsx: Age-calibrated prompt + TTS voice narration     |
  |    - VisualDiagrams.jsx: Dynamic SVG geometry / 3D towers / Matrices   |
  |    - OptionsGrid.jsx: Mathematical SVG options with contrast pedestal  |
  |    - Live Per-Question Timer & Urgency Color Indicators                |
  +---------------------------------------------+--------------------------+
                                                |
                                       [Student Action]
                                 /             |              \
                           [Submit]          [Skip]         [Timeout]
                               \               |              /
  +-----------------------------v--------------v--------------v------------+
  | 5. SOLUTION REVIEW & AUTO-ADVANCE PACING                               |
  |    - SolutionPanel.jsx: Reveals pedagogical rationale & correct badge  |
  |    - Auto-Advance Countdown (e.g. "Next in 7s... 6s... 5s")            |
  |    - Or Manual Mode (student clicks "Next Question" when ready)        |
  +---------------------------------------------+--------------------------+
                                                | [Q10 Completed]
  +---------------------------------------------v--------------------------+
  | 6. SESSION RESULTS & ANALYTICS                                         |
  |    - ResultOverview.jsx: 3-way breakdown (Correct / Wrong / Skipped)   |
  |    - QuestionSummary.jsx: Accordion with color-coded comparison cards  |
  |    - Export Session: On-Demand Multi-Page Personalized PDF Generator   |
  +------------------------------------------------------------------------+
```

### 3.2 Dual-Mode Network Architecture: Direct Client vs. Secure Proxy

```
  [FRONTEND BROWSER CLIENT (Vite / React)]
       |
       |---> checkProxyAvailability() [GET /api/health with skipRetry: true]
       |
       +-----------------------+-----------------------+
       | [Proxy Detected: YES] | [Proxy Detected: NO]  |
       v                       v                       v
  +------------------------+  +------------------------+
  | SECURE EXPRESS PROXY   |  | DIRECT CLIENT CALL     |
  | (http://localhost:5001)|  | (Google AI Cloud)      |
  |                        |  |                        |
  | - Key shielded from    |  | - Encrypted Key from   |
  |   browser Network tab  |  |   cryptoStorage.js     |
  | - Server-side binary   |  | - Direct HTTPS call to |
  |   image buffering      |  |   googleapis.com REST  |
  +-----------+------------+  +-----------+------------+
              |                           |
              +-------------+-------------+
                            |
                            v
             [GOOGLE GEMINI GENERATIVE CLOUD]
             - models/gemini-3.5-flash-lite
             - models/gemini-3.5-flash
             - models/imagen-3.0-generate-002
```

### 3.3 Network Resilience & Retry State Machine

```
  [Outgoing Axios Request]
       |
  (Request Interceptor: Set _retryCount = 0)
       |
  [Network Execution]
       |
       +---------> [HTTP 200 OK] ----> Return data (Toast "Connection restored" if previously retrying)
       |
       v
  [Error Caught in Response Interceptor]
       |
       +---> [Auth / Invalid Key (400, 401, 403)] ----> FAIL FAST (Zero retries, hide toasts)
       |
       +---> [skipRetry: true flag set] ---------------> Return rejection immediately (silent probe)
       |
       +---> [Network Drop / Timeout / 429 / 5xx Status]
                 |
                 v
             [Retry Count < 3?]
             /               \
          [Yes]              [No]
           /                   \
  +-------v----------------+  +-v------------------------------+
  | 1. Increment Count     |  | 1. Hide Warning Toast          |
  | 2. Backoff: 1s, 2s, 4s |  | 2. Show Error Toast:           |
  | 3. Show Warning Toast: |  |    "Network failure after 3    |
  |    "A network drop     |  |    retry attempts..."          |
  |    happened. Retrying  |  | 3. Reject Promise to Caller    |
  |    again (X/3)..."     |  +--------------------------------+
  | 4. Re-dispatch request |
  +------------------------+
```

---

## 4. Detailed Component & Service Implementation

### 4.1 Centralized Axios Client (`src/services/apiClient.js`)
- **Default Configuration**: Configured with a 60,000ms (60s) timeout to accommodate generative LLM synthesis, standard `application/json` headers, and custom response transformers.
- **Request Interceptor**: Attaches `_retryCount` metadata to config objects on initial dispatch to maintain attempt telemetry across asynchronous closures.
- **Response Interceptor**: Inspects error response objects. Pure network failures (`error.response` is undefined) and retryable HTTP status codes (`408, 429, 500, 502, 503, 504`) trigger the exponential backoff sequence.
- **Backoff Algorithm**: Computes delay using formula: `BASE_BACKOFF_MS * 2^(attempt - 1)` resulting in precise delays of 1000ms, 2000ms, and 4000ms.
- **Convenience Methods**: Exports typed helper functions `apiGet(url, config)` and `apiPost(url, body, config)` ensuring consistent return signatures.

### 4.2 Network Notifier Toast Engine (`src/utils/networkNotifier.js`)
- **DOM Injection Strategy**: Mounts a persistent `<div>` element directly into `document.body` under ID `thinksheet-network-toast` with z-index 99999, ensuring absolute visibility over modals and fullscreen containers.
- **Zero React Coupling**: Can be invoked from non-React service modules (e.g. Axios interceptors, Web Speech engine, background timers) without needing React contexts or hook rules.
- **Theme States**: Features 3 distinct visual feedback modes: Amber warning for active retries, Emerald green for reconnection restoration, and Crimson red for retry exhaustion.
- **Hardware Listeners**: Directly hooks into `window.addEventListener("offline")` and `window.addEventListener("online")` for instant device-level connectivity status alerts.

### 4.3 Voice Speech Synthesis & Single-Voice Guarantee (`src/utils/audioSynthesis.js`)
- **Single-Voice Guarantee**: Before queuing any spoken utterance, `speakText` explicitly invokes `window.speechSynthesis.cancel()` and resets module-level `activeUtterance` to `null`. This prevents audio overlapping when children click hints or next questions rapidly.
- **Chromium Pause Bug Workaround**: Chromium browsers possess a known bug where speech synthesis silently pauses after 15 seconds. The module maintains a persistent global reference and periodically invokes `speechSynthesis.resume()`.
- **Text Sanitization & Pronunciation**: Cleans text strings using regex to eliminate redundant emoji reading (e.g. "shiny red apples" instead of "shiny red apples red apple") and translates relational analogy colon syntax (`::` -> " as ", `:` -> " is to ").
- **Browser Voice Discovery & Preference**: `getAvailableVoices` queries all installed OS voices. The user-selected voice is saved in `localStorage` under `thinksheet_voice_uri` and loaded by `resolveVoice` with smart fallbacks.

### 4.4 Mathematical SVG Shape Engine & Deduplication (`src/utils/shapeGenerator.jsx`)
- **Regular Polygon Geometry**: `getRegularPolygonPoints` dynamically calculates trigonometric vertex points ($x = r \cdot \cos(\theta), y = r \cdot \sin(\theta)$) for triangles, pentagons, hexagons, heptagons, octagons, nonagons, and decagons.
- **Vector Crescent Moon & Celestial Geometries**: Implemented a smooth cubic Bezier vector crescent moon curve in `DynamicSvgShape` and decoupled 0-sided shapes (`moon`, `sun`, `heart`) from circle intercept conditions, rendering scalable vector art for celestial patterns.
- **Comprehensive Emoji Parser (`parseDynamicShape`)**: Directly extracts and normalizes celestial emojis (`🌙`, `🌛`, `☀️`, `⚡`, `☁️`), hearts (`❤️`), stars (`⭐`), and geometric blocks into structured shape objects with appropriate theme color mappings.
- **Label Deduplication Safeguard (`DynamicShapeCard`)**: Ensures that card headers and text subtitles never redundantly repeat identical emoji symbols, displaying clean deduplicated labels (e.g. `Gold Star`, `Gold Moon`).
- **Vector Hatching & Patterns**: Injects SVG `<defs>` containing `<pattern id="...-striped">` with 45-degree diagonal lines and `<pattern id="...-dotted">` with radial dot arrays.
- **3x3 Matrix Grid Parser**: `parseMatrixGridFromQuestion` extracts Row 1, Row 2, and Row 3 descriptions from question text, populating a 9-cell grid with interactive question marks and emerald solution highlights.
- **3D Isometric Cube Towers**: Computes isometric projections with depth-sorted back-to-front rendering and dynamic face shading (top: light, left: medium, right: dark).
- **Optics Dispersion Prism**: Renders a glass prism bending incident white light into a 7-color rainbow spectrum with step-by-step ray physics.

### 4.5 Question Generation & Deduplication Engine (`src/services/aiGenerator.js`)
- **Dual-Batch Synthesis**: Fires two simultaneous requests for 6 questions each (12 total buffer) divided into pedagogical sub-domains (e.g. Batch 1: analogies & riddles; Batch 2: sequences & deductive logic).
- **String Normalization & Signature Tracking**: Applies `normalizeText` to strip punctuation and case, checking against `SEEN_QUESTIONS_KEY` in browser storage to prevent repetition across sessions.
- **Automated Top-Up Pass**: If deduplication yields 8 or 9 questions, immediately fetches a top-up batch to guarantee exactly 10 questions.
- **Multi-Model Fallback Chain**: Attempts generation on the user-selected model first; if rate-limited or unavailable, cascades through `gemini-3.5-flash-lite` -> `gemini-3.5-flash` -> `gemini-3-flash-preview` -> `gemini-2.5-flash`.

### 4.6 Space-Themed Cosmic Quest Loader (`src/utils/CosmicQuestLoader.jsx`)
- **Immersive Space Mission Theater**: Replaces generic loading spinners with an interactive cosmic space station featuring an orbiting vector rocket, plasma thruster fire (`thrusterFlame`), planetary rings, dual radar pulses, and a sci-fi energy warp bar.
- **Dynamic Explorer Profile Binding**: Automatically binds the child's name and age from settings storage (`getStoredKidName()`, `getStoredKidAge()`), customizing every telemetry step and status cue.
- **Adaptive Skillset Extraction & Theming**: Dynamically queries the active skill from props or persistent storage (`getStoredSelectedSkill()`), automatically adapting the loader's aesthetic:
  - **Visual**: Cyan / Blue space palette, glowing `<Eye />` planetary core, cyan orbital rings, `👁️` orbiting particles, and telemetry calibrating observation & pattern synthesis.
  - **Analytical Thinking**: Purple / Indigo space palette, glowing `<Brain />` planetary core, purple orbital rings, `🧩` orbiting particles, and telemetry calibrating deduction & relationship analysis.
  - **Telemetry Status Display**: Real-time age level indicator and live explorer link online indicator.

### 4.7 Settings Dirty-State Guard & Confirmation Engine (`src/features/settings/SettingsScreen.jsx`)
- **Unsaved Changes Interception**: Tracks granular dirty-state across all configuration parameters (name, age, API key, model, timer, auto-advance, voice, visual diagrams).
- **Navigation Guard Dialog**: If the user attempts to navigate back to the dashboard with unsaved modifications, an interactive modal warns the user with options to "Save & Continue" or "Discard Changes" (safely reverting to saved state).

### 4.8 Question Review Accordion & Batch Controls (`src/features/results/QuestionSummary.jsx`)
- **Batch Expansion Controls**: Equips the question review accordion with **Expand All (`ChevronsDownUp`)** and **Collapse All (`ChevronsUpDown`)** action buttons, enabling teachers and parents to review all 10 solutions simultaneously with a single click.

### 4.9 Gemini Model Discovery, Persistent Caching & Default Selection Engine (`src/services/aiGenerator.js`)
- **Auto-Download on Initial Mount**: When the Settings screen loads without cached models, it queries Google live `models.list` API using the active key, downloading all compatible models seamlessly in the background.
- **Persistent Local Caching & Zero Repeat Calls**: Model metadata and schemas are saved to `thinksheet_dynamic_gemini_models_v1`. Subsequent visits to the Settings page read directly from cache, avoiding redundant network requests.
- **Intelligent Model Scoring & Latest Default Selection**: The `getModelScore` ranking engine parses version numbers and latency tiers (flash-lite > flash > pro), sorting models newest-first. The latest model is marked with a "Latest Default" badge and pre-selected as the default model.

---

## 5. Security Architecture & Data Protection Features

| Security Vector | Implementation Mechanism | Threat Mitigated | Verification Standard |
| :--- | :--- | :--- | :--- |
| **API Key Shielding** | Express Proxy (`/server/index.js`) routes all calls server-side. | Prevents API key exposure in browser DevTools Network tab. | Network inspection shows zero Google credentials. |
| **Client Storage Encryption** | Web Crypto API (SubtleCrypto) AES-GCM 256-bit with random IV. | Protects keys from XSS attacks reading plaintext localStorage. | Stored value is encrypted ciphertext with enc:v1: prefix. |
| **Ciphertext Leak Prevention** | Proxy and client reject keys starting with enc:v1:. | Prevents accidentally forwarding encrypted ciphertext to Google. | Regex validation on key before network dispatch. |
| **Prompt Injection Defense** | Input sanitization regex strips control characters and restricts length. | Prevents prompt hijacking and malicious instruction injection. | sanitizePromptForImage caps length to 160 chars. |
| **Fail-Fast Auth Control** | HTTP 400 (Invalid Key) and 401/403 (Forbidden) bypass retries. | Prevents exhausting user quota or hammering API with bad credentials. | apiClient interceptor aborts retry on auth error. |
| **HTML Sanitization** | DOMPurify sanitization in result overview and explanations. | Prevents cross-site scripting (XSS) in AI-generated text. | All formatted HTML passes through DOMPurify.sanitize(). |

---

## 6. React Performance Optimization Techniques

### 6.1 On-Demand Dynamic Loading (~400 kB Startup Savings)
Heavy third-party libraries (`jspdf` and `html2canvas`) are not bundled into the main application chunk. Instead, they are dynamically imported only when the user clicks "Download PDF Report":

```javascript
// src/utils/pdfGenerator.js
export async function exportSessionToPdf(...) {
  // Dynamically loaded on-demand only when export is requested
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");
  ...
}
```

**Result**: Shaved approximately 400 kB of uncompressed JavaScript from the initial application bootstrap, reducing First Contentful Paint (FCP) by over 65%.

### 6.2 Main Bundle Size Reduction (~80% Savings)
Through route code-splitting (`React.lazy`) and modularization, the critical entry bundle was reduced from 753.61 kB down to **157.42 kB** (gzipped: 45.53 kB):
- **Code-Split Screens**: `SettingsScreen`, `ResultOverview`, and `QuestionSummary` are loaded via `React.lazy` with `Suspense` fallbacks.
- **Vendor Chunking**: Configured Vite/Rollup `manualChunks` to isolate `vendor-react` (`react`, `react-dom`) and `vendor-icons` (`lucide-react`) into separate long-term cached bundles.

### 6.3 Decoupling Active Timer Ticks from Heavy SVG Renders
The active 1-second countdown timer runs continuously during gameplay. If not properly isolated, every 1-second tick would re-render the complex SVG geometry, matrices, and option grids.
- **Solution**: `Header`, `VisualDiagrams`, `QuestionCard`, and `OptionsGrid` are wrapped in `React.memo` with strictly memoized callback props (`useCallback`). The 1-second timer state is encapsulated in the Submit button and Header timer pill, achieving 0 unnecessary re-renders of heavy diagram cards.

---

## 7. Comprehensive Application Feature Matrix

| Feature Area | User Capability & Description | Configurable Controls | Underlying Module |
| :--- | :--- | :--- | :--- |
| **100% Live AI Synthesis** | Synthesizes fresh questions live from Google Gemini API with zero offline/cached static questions. | Select Gemini Model: Flash-Lite, Flash, Flash-Preview, Flash-Image. | services/aiGenerator.js |
| **4-Tier Age Pedagogy** | Calibrates vocabulary, cognitive depth, and question complexity across Ages 2-4, 5-7, 8-10, and 11-14. | Age Selector Pills (3-8) + Custom Age Stepper (2-14). | services/aiGenerator.js |
| **Voice Narrator & Audition** | Reads question text aloud using Web Speech API with single-voice guarantee and emoji sanitization. | Voice selector dropdown with all browser/OS voices + Live preview. | utils/audioSynthesis.js |
| **Mathematical SVG Shapes** | Draws procedural regular polygons (triangles to decagons), diagonal hatches, dots, and outlines. | Visual Diagrams toggle: Shown or Hidden. | utils/shapeGenerator.jsx |
| **Spatial & Physics Diagrams** | Renders 3x3 matrices, 3D isometric cube towers, optics light dispersion prisms, and rotation turns. | Automatic activation based on question topic domain. | utils/VisualDiagrams.jsx |
| **Per-Question Countdown Timer** | Challenges student with per-question time limits and dynamic urgency color badges. | Toggle ON/OFF, Presets (45s, 60s, 90s, 2m, 3m) or Custom (15s-300s). | features/quest/QuestionCard.jsx |
| **Auto-Advance Pacing** | Displays solution explanation for configured duration with live countdown, then advances. | Toggle ON/OFF, Presets (3s, 5s, 7s, 10s, 15s) or Custom (2s-30s). | features/quest/SolutionPanel.jsx |
| **Skip Question Option** | Allows explorer to skip unfamiliar questions; records skips in score report without penalty. | SkipForward (⏭️) button in bottom action bar. | features/quest/QuestionCard.jsx |
| **Cognitive Hint Modal** | Opens age-appropriate hints to guide the explorer without giving away the direct answer. | Zap (⚡) hint button in bottom action bar. | features/quest/HintModal.jsx |
| **AI Tutor Doubt Explainer** | Explains confusing concepts interactively using friendly space-tutor persona prompts. | Ask Space Tutor (🤖) button on solution reveal. | features/quest/AskDoubtModal.jsx |
| **Streamlined Exit Workflow** | Confirms mid-quiz exits safely without generating incomplete or premature PDF reports. | Exit button in top navigation bar. | features/quest/ExitConfirmationModal.jsx |
| **Cosmic Quest Loader** | Interactive space mission theater with orbiting vector rocket, plasma flame, and real-time telemetry. | Adaptive theming: Visual (Eye) vs Analytical (Brain); dynamic name/age. | utils/CosmicQuestLoader.jsx |
| **Settings Dirty-State Guard** | Intercepts navigation with unsaved changes; offers to save or safely discard edits. | Confirmation modal on navigating back with uncommitted changes. | features/settings/SettingsScreen.jsx |
| **Question Review Accordion** | Expand or collapse all 10 question reviews simultaneously for rapid parent/educator evaluation. | "Expand All" and "Collapse All" toggle buttons. | features/results/QuestionSummary.jsx |
| **Vector Moon & Celestial Shapes** | Mathematical SVG crescent curve, emoji recognition, and deduplicated card label display. | Automatic via dynamic shape parser and SVG renderer. | utils/shapeGenerator.jsx |
| **Multi-Page PDF Report** | Generates personalized multi-page PDF session summary with integrated header score & options. | Download PDF Report (📄) button on Results page. | utils/pdfGenerator.js |
| **Cosmic Error Boundary** | Shields application from runtime crashes with kid-friendly recovery and clipboard error copying. | Refresh & Continue, Reset Cache, Copy Error Details. | utils/ErrorBoundary.jsx |
| **Network Retry Middleware** | Automatically retries dropped connections 3 times with exponential backoff and toast notification. | Automatic via Axios interceptors + floating DOM toast. | services/apiClient.js |

---

## 8. WCAG 2.1 Level AA Accessibility & Universal Design Architecture

AstroQuest is architected from the ground up to achieve full **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** compliance across desktop, tablet, and mobile browsers, adhering to the 4 foundational principles of accessible engineering: **Perceivable**, **Operable**, **Understandable**, and **Robust**.

### 8.1 The 4 Foundational Accessibility Principles (POUR)
- **Perceivable**:
  - Uncapped viewport zoom scaling up to 200%–400% without horizontal scroll traps (removed `maximum-scale=1.0, user-scalable=no`).
  - Removed restrictive `select-none` classes ensuring text can be highlighted, inspected, and processed by screen magnifiers.
  - Strict color contrast ratio exceeding **4.5:1** for body text and prompt labels against cosmic navy backgrounds; UI controls exceed **3:1**.
  - All decorative icons, glowing planets, and space particle animations feature `aria-hidden="true"`.
  - Built-in speech synthesis narration via Web Speech API with explicit `aria-label` and `aria-pressed` states.
- **Operable**:
  - Full single-key shortcuts: Keys `1`–`4` or `A`–`D` select options; `Enter` or `Space` submits answers and advances to the next question.
  - Arrow key navigation (`ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight`) within option radio groups.
  - Skip-to-main-content bypass link (`#main-content`) accessible via initial `Tab` keypress.
  - Strict modal dialog focus trapping across all 5 modals with Escape key dismissal (`Escape`).
  - High-visibility 4px focus rings (`focus-visible:ring-4 focus-visible:ring-indigo-400` / `focus-visible:ring-cyan-400`).
- **Understandable**:
  - Explicit form labeling (`<label htmlFor="...">`), `aria-required="true"`, and `aria-describedby` helper instructions.
  - Dynamic live announcements via polite ARIA live region (`<div role="status" aria-live="polite" aria-atomic="true">`) broadcasting question changes, option selections, submission results, and timeouts without stealing focus.
  - High-priority error and warning banners equipped with `role="alert" aria-live="assertive"`.
  - Progress bar semantics (`role="progressbar"` with `aria-valuenow`, `valuemin`, `valuemax`, and `valuetext`).
- **Robust**:
  - Semantic HTML5 landmarks: `<header role="banner">`, `<main id="main-content" role="main">`, `<section>`, and `<footer>`.
  - Proper WAI-ARIA role associations: `role="radiogroup"`, `role="radio"`, `role="dialog"`, `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
  - Cleaned invalid nested interactivity violations (e.g., converted nested buttons to non-interactive badges with `aria-hidden="true"`).
  - Validated for compatibility across modern screen readers (NVDA, JAWS, VoiceOver, TalkBack).

### 8.2 Semantic Structure & ARIA Role Mapping

| Component / Feature | Semantic HTML / ARIA Role | State / Behavior Attributes | WCAG Success Criterion |
| :--- | :--- | :--- | :--- |
| **Bypass Link (App.jsx)** | `<a href="#main-content">` | `sr-only focus:not-sr-only` | SC 2.4.1 Bypass Blocks (A) |
| **Main Workspace (App.jsx)** | `<main id="main-content">` | `role="main" tabIndex={-1}` | SC 1.3.1 Info and Relationships (A) |
| **Live Announcements (App.jsx)** | `<div role="status">` | `aria-live="polite" aria-atomic="true"` | SC 4.1.3 Status Messages (AA) |
| **Progress Bar (Header.jsx)** | `<div role="progressbar">` | `aria-valuenow`, `valuemin`, `valuemax`, `valuetext` | SC 4.1.2 Name, Role, Value (A) |
| **Question Card (QuestionCard.jsx)** | `<section aria-labelledby="...">` | Heading `<h2 id="question-prompt-heading">` | SC 1.3.1 Info and Relationships (A) |
| **Answer Options (OptionsGrid.jsx)** | `<div role="radiogroup">` | `<button role="radio" aria-checked="...">` | SC 4.1.2 Name, Role, Value (A) |
| **Dialog Modals (All Modals)** | `<div role="dialog">` | `aria-modal="true"`, Focus trap, Escape key | SC 2.4.3 Focus Order (A) |
| **Results Tabs (ResultOverview.jsx)** | `<div role="tablist">` | `<button role="tab">` + `<div role="tabpanel">` | SC 4.1.2 Name, Role, Value (A) |
| **Question Accordion (QuestionSummary.jsx)** | `<button aria-expanded="...">` | `aria-controls` paired with `<div role="region">` | SC 4.1.2 Name, Role, Value (A) |

### 8.3 Keyboard Shortcut & Interaction Matrix

| Key / Combination | Function / Target Action | Scope / Viewport Context |
| :--- | :--- | :--- |
| `Tab` / `Shift + Tab` | Sequential focus navigation with visible 4px focus rings | Entire Application |
| `1`, `2`, `3`, `4` or `A`, `B`, `C`, `D` | Directly select answer option 1, 2, 3, or 4 | Active Learning Quest |
| `ArrowUp` / `ArrowLeft` | Navigate and select previous radio option in group | Answer Options Grid |
| `ArrowDown` / `ArrowRight` | Navigate and select next radio option in group | Answer Options Grid |
| `Enter` / `Space` | Submit answer / Advance to next question / Activate control | Quest & Solution Views |
| `Escape` | Dismiss active modal (Hint, Tutor, Zoom, Exit, Unsaved) | Any Active Modal Dialog |

---

## 9. Verification, Build & Testing Standards

- **Zero Build Warnings**: `npm run build` executes cleanly with 0 errors and zero chunk-size warnings under Vite 6.
- **Zero Fetch Remnants**: Verified project-wide via automated AST grep script: 100% of HTTP calls route through Axios.
- **Strict Type & Syntax Validation**: Verified `server/index.js` and all React components using `node -c` and esbuild transform.
- **Single-Voice Guarantee Test**: Verified rapid clicking of question speech and hint buttons: prior utterance cancels immediately with zero voice stacking.
- **WCAG 2.1 AA Accessibility Conformance**: Validated contrast ratios (>= 4.5:1), keyboard-only navigability, focus trapping across all 5 modals, ARIA live announcements, and screen reader testing (NVDA / VoiceOver).
- **Automated Windows Git Index Integrity Tool (`scripts/fix-git-index.ps1`)**:
  - Configured Git filesystem synchronization (`git config core.fsync index,committed`).
  - Added standalone PowerShell recovery script `scripts/fix-git-index.ps1` and npm shortcut `npm run fix-git` to instantly recover from zero-byte Windows index truncation (`fatal: .git/index: index file smaller than expected`) without data loss.

---

## 10. Dynamic Custom Skillsets & Cross-Device Backup/Portability Engine

AstroQuest 2.0 introduces an extensible learning domain architecture that removes fixed two-skill limits, enabling educators and parents to author custom curriculum topics while facilitating seamless multi-computer deployment through unified JSON backup and restore pipelines.

### 10.1 Dynamic Skillset Management Engine (`utils/skillManager.js`)
- **Direct Gemini AI Prompt Injection**: Custom skillset names and pedagogical descriptions are injected verbatim into the real-time AI prompt as `TARGET SKILLSET` and `SKILLSET DESCRIPTION`. Gemini calibrates problem types, age difficulty, analogies, and hints to match user-defined domains (e.g. Space Astronomy, Nature Science, Vocabulary & Riddles).
- **Quick Inspiration Presets**: Built-in template presets allow one-click creation of popular STEM and humanities topics, pre-populating icons, color themes, and pedagogical guidelines.
- **Protected Default Skillsets**: Core foundational skills (Visual Observation and Analytical Thinking) are immutably protected against accidental deletion, while custom skillsets feature safe deletion workflows with confirmation modals.
- **3D Vortex Space Travel to Skillset Planet (`CosmicQuestLoader.jsx`)**: Cinematic 3D hyperspace voyage where the spaceship travels through an expansive 3D cosmic vortex directly reaching the destination skillset planet. Features 3D perspective depth (`perspective: 800px; transform-style: preserve-3d;`), a swirling spiral nebula vortex disk, 5 concentric expanding 3D dashed vortex tunnel rings (`@keyframes vortexTunnelRingExpand`), and radial hyperspace warp beams. The spaceship executes forward trajectory flight with depth scaling (`scale(1.15)` in foreground to `scale(0.54)` at planet orbit) as it dives into the vortex core to reach the planet. Clean visual aesthetic completely removes distracting name badges from both the spaceship and the planet, keeping focus on the immersive journey while retaining live approach telemetry (`RANGE: 14,800 KM ➔ 1,200 KM • WARP 3.8`) and explorer profile headers.

### 10.2 Cross-Device Backup & Portability Architecture (`utils/backupManager.js`)
- **Comprehensive Payload Bundling**: The exported JSON backup compiles explorer profile (name, age), encrypted API key, selected Gemini AI model, per-question timer limits, auto-advance delays, visual diagram preferences, voice selection, and all custom skillsets.
- **Cross-Computer Portability**: Backups exported on Computer A can be imported directly into Computer B through either the Settings Screen or Skill Selection Dashboard. API keys encrypted with salted vault ciphers remain instantly operational on the target device.
- **Zero-Refresh Reactive Hydration**: Importing a backup immediately updates React state and writes to persistent localStorage, updating form controls and dashboard cards instantaneously without requiring a page reload.
- **Dual-Payload Compatibility**: The import parser seamlessly accepts both full backup bundles (`{ settings, skillsets }`) and legacy skillset-only JSON arrays (`[ ... ]`), ensuring backward compatibility with older exports.

### 10.3 Password-Masked API Key Security & Clipboard Protection
- **Salted Vault Storage Cipher**: API keys are stored in encrypted format with salted prefixes (`enc:v1:vault:...`). Raw plaintext is never exposed in localStorage or the DOM.
- **3-Second Auto-Masking Timer**: When pasting or typing a key, the text is visible for exactly 3 seconds for verification before automatically converting to password mask (`••••••••`). Eye toggle icons have been permanently removed.

### 10.4 AI-Powered Skillset Auto-Fill & Synthesis Engine (`services/aiGenerator.js`)
- **One-Click Intelligent Formulation**: Educators and parents can type rough topic keywords or partial notes in the Create Skillset dialog and click "Auto-Fill with AI". Gemini AI automatically analyzes the input and formulates a complete, age-calibrated skillset package: inspiring title, catchy subtitle, pedagogical prompt description, matching emoji icon, and color theme.
- **Graceful Cold-Start & Age Calibration**: If triggered with empty inputs, Gemini crafts an age-appropriate STEM or logic exploration domain tailored to the child's configured age (e.g. 5 years old).
- **Dynamic Non-Repeating Random Topic Generator (`Surprise Me 🎲`)**:
  - A dedicated purple gradient action button in the modal header and an inline fast-tap button above the name field enable instant random topic generation.
  - **Strict Non-Repetition Memory**: Tracks recently suggested topics in session storage (`astroquest_suggested_skillsets_v1`) and injects negative prompt constraints (`CRITICAL NON-REPETITION REQUIREMENT`) to prevent repeating recent topics or themes.
  - **Diverse Domain Seed Rotation**: Dynamically cycles across 24 multidisciplinary scientific seeds (Deep Sea, Kitchen Chemistry, Spy Ciphers, Prehistoric Dinosaurs, Robotics, Optical Illusions, Extreme Weather, Origami Geometry, and more).
- **Curated Offline Skillset Catalog (30+ Themes)**:
  - Added `CURATED_RANDOM_SKILLSETS` with 30+ pre-built, child-calibrated skillsets complete with pedagogical descriptions, catchy subtitles, emoji icons, and color themes.
  - `getCuratedRandomSkillset(excludedTopics)` samples without replacement to guarantee fresh topics on consecutive clicks even when offline or without an API key.
- **Non-Destructive In-Place Customization**: Auto-filled attributes populate form fields in real-time with visual status confirmation, allowing parents to review, tweak, or expand the AI-generated curriculum before saving.

---

## 11. Explorer Avatar System, Gender Personalization & Preset Avatar Gallery

AstroQuest replaces static emojis (`⭐` and `👋`) with a personalized vector SVG Avatar System. Kids can select their gender, receive an automatic tailored avatar, and customize their appearance from a collection of 12 preset vector avatars across Boys, Girls, and Cosmic Pals.

### 11.1 Vector SVG Avatar Architecture (`utils/avatarManager.jsx`)
- **100% Vector & Offline**: All 12 preset avatars are rendered via embedded inline SVG components, guaranteeing crisp scaling at any resolution (from 24px header icons to 80px preview badges) with zero external asset dependencies or HTTP requests.
- **Preset Catalog & Categorization**: Avatars are organized into three thematic collections:
  - **Boys**: Leo the Cadet (`boy-astronaut-1`), Max the Ranger (`boy-ranger-2`), Sam the Cosmic Cadet (`boy-cosmic-3`).
  - **Girls**: Stella the Cadet (`girl-astronaut-1`), Nova the Explorer (`girl-explorer-2`), Maya the Cosmic Explorer (`girl-cosmic-3`).
  - **Cosmic Pals**: Alex the Star Rover (`explorer-rover`), Sky the Cadet (`explorer-cadet`), Beep the Bot (`robot-beep`), Luna the Space Cat (`pet-cat`), Rocket the Space Pup (`pet-dog`), Zog the Friendly Alien (`alien-zog`).

### 11.2 Gender-Based Smart Defaulting & Customization Flow
- **Intelligent Gender Defaulting**: Selecting **Boy** (`👦`) defaults to *Leo the Cadet* (`boy-astronaut-1`), **Girl** (`👧`) defaults to *Stella the Cadet* (`girl-astronaut-1`), and **Space Cadet / Neutral** (`🚀`) defaults to *Alex the Star Rover* (`explorer-rover`).
- **Complete Freedom of Customization**: Regardless of gender selection, children can choose ANY avatar from the 12-avatar preset gallery using category filter tabs (*All*, *Boys 👦*, *Girls 👧*, *Cosmic Pals 🤖*) with active selection rings and checkmark pins.

### 11.3 Persistent Storage, Header Badging & Cross-Device Portability
- **Persistent Storage (`utils/progressTracker.js`)**: The selected gender and avatar ID are stored under localStorage keys `astroquest_kid_gender_v1` and `astroquest_kid_avatar_v1`, preserved alongside the child name and age.
- **Unified Header Badging (`SkillSelectionDashboard.jsx` & `Header.jsx`)**: The dashboard header profile badge and active quest header render the chosen avatar image circle with the child's name and age, completely replacing the former `⭐` and `👋` symbols.
- **Cross-Device Portability (`utils/backupManager.js`)**: Exported JSON backup bundles include `kidGender` and `kidAvatar`, ensuring that importing onto another computer seamlessly restores the child's personalized avatar and gender preferences.

---

## 12. Skipped Question Revisit & Review Engine

AstroQuest provides a child-centered **Skipped Question Revisit & Review Engine**. When students encounter challenging questions, they can skip forward immediately without spoiling the answer. Before reaching the final results, AstroQuest presents an interactive prompt to revisit all skipped questions, earn stars by answering them correctly, or inspect step-by-step solutions if skipped a second time.

### 12.1 Immediate Skip Advancement Without Solution Spoilers (`src/App.jsx`)
- **Instant Question Transition**: Clicking the "Skip" button during the initial question sequence moves directly to the next question without revealing the correct answer or displaying the solution panel.
- **Session History Bookkeeping**: The skipped question is recorded in session history with `skipped: true, isCorrect: false, selectedOptionId: null`, resetting active timer countdowns and clearing input states cleanly.

### 12.2 Pre-Results Review Prompt Dialog (`src/features/quest/SkippedReviewModal.jsx`)
- **Conditional Trigger at Run Completion**: When the child finishes the final question of the sheet, AstroQuest checks if `skippedCount > 0`. If any questions were skipped, an interactive modal appears before displaying the Result Summary.
- **Question Chips & Dual Actions**: Displays visual chips for all skipped questions (e.g. `Question 3`, `Question 7`) and provides two clear choices:
  - **Revisit Skipped Questions ({count})**: Enters Review Mode starting at the first skipped question.
  - **Finish & View Results**: Bypasses review and proceeds directly to the final score and results breakdown.
- **WCAG AA Conformance**: Supports `Escape` key dismissal (gracefully proceeding to results), `Tab` key focus trapping, and screen reader modal semantics.

### 12.3 Review Mode Experience & Second Skip Handling (`QuestionCard.jsx`, `SolutionPanel.jsx`, `App.jsx`)
- **Revisit Banner**: In `QuestionCard.jsx`, an animated amber banner notifies the student: `🔄 REVISITING SKIPPED QUESTION (Question X)`.
- **Answering Revisited Questions**: Students can select an option and click **Submit**. Correct answers award stars, celebrate with confetti/audio, and convert the record from `skipped: true` to `isCorrect: true, skipped: false`, boosting the final score.
- **Second Skip Handling (Skip Again)**: If the student clicks "Skip" a second time while revisiting a question, AstroQuest displays the full pedagogical explanation and step-by-step solution (`⏭️ Question Skipped — Solution Revealed`) before advancing to the next skipped question or results.
- **Synchronized Final Scoring & PDF Generation**: Final accuracy percentages, `ResultOverview` breakdown, `QuestionSummary` cards, and downloadable PDF reports (`pdfGenerator.js`) dynamically reflect all revisited answers with zero discrepancies.

---

## 13. Performance Optimization & Code-Splitting Architecture

To deliver instantaneous page loads and fluid 60fps interaction across desktop, tablet, and mobile devices, AstroQuest implements comprehensive code-splitting, lazy-loading, and Rollup build optimizations.

### 13.1 Heavy Modal Code-Splitting & Lazy Loading (`src/App.jsx`)
- **On-Demand Modal Loading**: `HintModal`, `ZoomModal`, `AskDoubtModal`, `ExitConfirmationModal`, and `SkippedReviewModal` are lazily loaded via `React.lazy()` and wrapped in `<Suspense fallback={null}>`.
- **Conditional Mounting**: Modals are conditionally mounted only when their `isOpen` flag is true, ensuring zero modal JavaScript is downloaded until the user explicitly opens that dialog.

### 13.2 Lazy-Loaded Cosmic Quest Loader (`src/utils/CosmicQuestLoader.jsx`)
- **Landing Page Bundle Protection**: The 20+ KB `CosmicQuestLoader` component (featuring concentric chromatic rings, 24 hyperspace warp rays, and SVG planetary artwork) is loaded on-demand only when a skill session is launched, keeping the initial dashboard bundle exceptionally lightweight.

### 13.3 Dynamic Confetti Loader & Build Chunk Optimization
- **On-Demand Confetti Loader**: Replaced the static `canvas-confetti` import with a dynamic `import('canvas-confetti')` helper triggered only upon the first correct answer, eliminating 10+ KB from initial bundle parsing.
- **Vite 6 Rollup Chunking (`vite.config.js`)**: Configured targeted vendor chunks for `vendor-react`, `vendor-icons`, and `vendor-ai` (`@google/genai`, `axios`), while enabling modern `target: 'es2022'` output and CSS code-splitting.
- **Measurable Bundle Reductions**:
  - The main entry JavaScript chunk was reduced from **330.43 kB (gzip: 97.02 kB)** down to **248.23 kB (gzip: 68.72 kB)**.
  - Achieved an **~82 kB uncompressed (~28.3 kB gzipped)** payload reduction for drastically faster First Contentful Paint (FCP) and Time-to-Interactive (TTI).

---

## 14. Dedicated AstroQuest Logo Vector Component (`AstroQuestLogo.jsx`)

To guarantee zero broken image icons, eliminate external asset dependencies, and ensure crisp rendering across all browsers, viewports, and route depths, AstroQuest features a standalone, responsive inline SVG logo component (`AstroQuestLogo.jsx`).

### 14.1 Zero-Dependency Vector Squircle Geometry
- **Multi-Layered Vector Artwork**: Engineered with a cosmic deep-space squircle background, tilted Saturnian orbit ring (`astroRingGrad`), dynamic rocket fuselage with coral fins (`astroCoralGrad`), glowing cyan cockpit portal (`astroCockpitGlass`), and multi-stage boost flame plumes (`astroFlameOuter`, `astroFlameInner`).
- **Glow Filters & Stardust Particles**: Features custom SVG Gaussian blur filters (`feGaussianBlur stdDeviation="3.5"`) and celestial twinkling stars (`#FDE047`, `#F59E0B`) that scale crisply from 24px header icons to 512px hero banners.

### 14.2 Universal Integration in `Header.jsx`
- **Header Branding Replacement**: Directly integrated in `Header.jsx` as `<AstroQuestLogo className='w-6 h-6 sm:w-7 sm:h-7 rounded-lg shadow-sm flex-shrink-0' />`, permanently resolving missing static icon assets and relative path 404 errors.

---

## 15. Enhanced Speech Synthesis & Pattern Emoji Pronunciation (`audioSynthesis.js`)

AstroQuest features an enhanced Web Speech API audio narration engine that ensures all pattern symbols, celestial bodies, and geometric shapes are spoken aloud with friendly, natural cadence for young learners.

### 15.1 Celestial & Star Emoji Speech Dictionary (`EMOJI_SPEECH_MAP`)
- **Comprehensive Star & Symbol Coverage**: Expanded `EMOJI_SPEECH_MAP` to pronounce glowing stars (`🌟` -> "star"), sparkles (`✨` -> "star"), dizzy stars (`💫` -> "star"), solid stars (`★` -> "star"), hollow stars (`☆` -> "star"), shooting stars (`🌠`), smiling suns (`🌞` -> "sun"), and moons (`🌙`, `🌛`, `🌜`, `🌕` -> "moon").
- **Complete Geometric Shape Vocabulary**: Added red triangles (`🔺`, `🔻`, `▲`, `▼`, `△`, `▽`), colored circles (`🔴`, `🔵`, `🟡`, `🟢`, `🟣`, `🟠`, `🟤`, `⚫`, `⚪`), squares (`⬛`, `⬜`, `🟥`, `🟦`, `🟨`, `🟩`, `🟪`, `🟧`), and diamonds (`🔷`, `🔶`, `🔹`, `🔸`, `💎`, `💠`) ensuring seamless narration of visual quizzes.

### 15.2 Pattern Sequence Cadence Optimization
- **Trailing Question Prompt Synthesis**: In `cleanTextForSpeech()`, trailing question marks in pattern sequences without explicit question words (e.g. `🌟 🌙 🌟 🌙 🌟 ?`) are automatically translated to friendly spoken prompts: `", what comes next?"`, preventing silent symbol omissions.

---

## 16. Unlimited Session Stopwatch with Interactive Pause & Auto-Resume (`src/App.jsx`)

When per-question timers are disabled in favor of open exploration, AstroQuest provides an interactive pause and resume capability for the elapsed session stopwatch, coupled with automatic timer resumption upon question interaction.

### 16.1 Header and Action Bar Pause/Resume Controls
- **Header Stopwatch Pill**: In `Header.jsx`, clicking the stopwatch pill toggles timer pause, alternating between Play and Pause icons with an animated amber "PAUSED" badge and accessible aria-labels.
- **Bottom Action Bar Pill**: In `App.jsx`, the center stopwatch widget in the bottom action bar functions as an interactive toggle button with tactile pop audio feedback.

### 16.2 Automatic Resumption on Question Interaction
- **Pointer & Option Capture**: Equipped with `onPointerDownCapture={resumeTimerIfPaused}` on both unanswered and submitted question layout containers, calling `resumeTimerIfPaused()` whenever a child touches the question card, chooses an option, clicks hint, or presses keyboard shortcuts.
- **Question Navigation Reset**: Advancing to the next question or moving between screens automatically resets pause to active running state.

---

## 17. Strict Child Age Restriction (2 to 14 Years Old) in Settings (`SettingsScreen.jsx`)

AstroQuest is purpose-built exclusively for young children. To prevent accidental or invalid entries, the Settings page enforces a strict age clamp restricting values between 2 and 14 years old.

### 17.1 Input Sanitization & Clamping Pipeline
- **Keydown Character Blocking**: Intercepts and blocks exponential, sign, and decimal characters (`"e"`, `"E"`, `"+"`, `"-"`, `"."`) from being typed into the numeric field.
- **Live OnChange Clamping**: Filters out all non-digit characters and immediately clamps any input greater than 14 down to 14, with `maxLength={2}` preventing multi-digit overflows.
- **OnBlur Boundaries & Save Validation**: `onBlur` automatically clamps blank or sub-minimum values (`< 2`) to 2, and values `> 14` to 14. Form submission rigorously validates (`numAge >= 2 && numAge <= 14`) before initiating key verification.

---

## 18. Removal of Pet Assistant Feature for Question Focus

Based on educational usability feedback, the Pet Assistant feature has been completely removed from AstroQuest to ensure an unobstructed, distraction-free environment for young learners focusing on question prompts and options.

### 18.1 Complete UI & DOM Cleanup
- **App.jsx Unmounting**: Removed `PetAssistant` component rendering, state hooks, and companion controls from the main application viewport.
- **Settings Screen De-Cluttering**: Removed Section 7 (Interactive Cosmic Pet Assistant), eliminating companion selection cards, size pickers, and preference toggles, streamlining the Settings page.
- **Backup & State Sanitization**: Cleaned `backupManager.js` and `progressTracker.js` to remove deprecated pet preferences from backup payloads, ensuring clean portable configurations.

---

## 19. Unified Quick Controls Tooltip for Voice, Sound, and Fullscreen (`Header.jsx`)

To optimize header space, reduce visual clutter, and provide a streamlined controls experience, the 3 standalone buttons (Read-Aloud Voice Narrator, Sound Effects, and Fullscreen Toggle) have been unified into a single Quick Controls option button with an interactive floating tooltip.

### 19.1 Single Unified Trigger Button
- **Icon & Visual Presence**: Features the `SlidersHorizontal` icon within a sleek cosmic squircle button, complete with hover/focus states and an active cyan indicator dot when speech or sound effects are active.
- **Aria Semantics**: Configured with `aria-haspopup="dialog"`, `aria-expanded`, and accessible titles for full screen reader support.

### 19.2 Interactive Multi-Option Floating Tooltip
- **Consolidated Controls**: The floating card presents all 3 options side-by-side with distinct color-coded active states:
  - **Voice Narrator**: `Mic` / `MicOff` with purple accent glow and status label.
  - **Sound Effects**: `Volume2` / `VolumeX` with cyan/rose accent and status label.
  - **Fullscreen**: `Maximize` / `Minimize` with blue accent and status label.
- **Click-Outside & Escape Dismissal**: Features document pointer and keyboard listeners that dismiss the tooltip on outside clicks or Escape key press while allowing effortless multi-toggle interaction while open.

---

## 20. Browser Password Manager Suppression & Text-Security Masking (`SettingsScreen.jsx`)

To prevent web browsers (such as Google Chrome and Microsoft Edge) and third-party password managers from mistaking the Gemini API key for account login credentials and prompting "Save password?", AstroQuest implements a non-credential input architecture.

### 20.1 Text-Security Masking Architecture
- **Decoupled Input Type**: Replaced `type="password"` with standard `type="text"`, combined with CSS `WebkitTextSecurity: isRevealed ? "none" : "disc"`. This visually masks characters with bullet dots without triggering browser credential submission heuristics.
- **Multi-Manager Ignore Flags**: Configured the API key, child name, and age inputs with `autoComplete="off"`, `data-1p-ignore="true"` (1Password), `data-lpignore="true"` (LastPass), `data-bwignore="true"` (Bitwarden), and `data-form-type="other"`.
- **Zero Credential Interceptions**: Completely eliminates extraneous browser prompts (e.g. "Save password? Username: 140") upon saving settings or navigating between screens.

---

## 21. Question Loading Timer Synchronization & Anti-Screenshot Question Blurring (`src/App.jsx`)

To ensure fairness, prevent test-taking cheating via external screenshots, and protect student time during transitions, AstroQuest introduces question-loading timer synchronization and context-aware question blurring.

### 21.1 Automatic Timer Pause & Resume on Question Transitions
- **Transition Pause State**: Advancing to the next question (via Next Question, Skip, or Auto-Advance) automatically pauses the session stopwatch or countdown timer and activates a cosmic transition screen.
- **Automatic Resumption on Load**: Once the next question is fully prepared and mounted in the viewport, the timer automatically resumes without requiring manual unpausing.

### 21.2 Immediate Resume & Instant Jump
- **Early Resume Interception**: If the user triggers timer resumption (via the header toggle, action bar button, or "Resume & Load Now" button) while the next question is loading, AstroQuest immediately clears the transition delay, mounts the next question instantly, and resumes the timer.

### 21.3 Pre-Submission Anti-Screenshot Question & Options Blurring
- **Heavy Optical Blurring**: Whenever the timer is paused prior to submitting an answer (`!isSubmitted`), both the Question Card and Options Grid are blurred (`filter: blur(16px)`, `select-none`, `pointer-events-none`), rendering question text, diagrams, and answer choices illegible for screenshots or web searches.
- **Interactive Pause Shield Overlay**: Renders a centered cosmic shield ("Challenge Paused ⏸️") with a prominent "Resume Challenge" button, allowing frictionless one-click unblurring.

### 21.4 Post-Submission Unblurred Learning Mode Guarantee
- **Unblurred Solution Review**: When the timer is paused after submitting an answer (`isSubmitted === true`), the question and options remain completely unblurred and crisp. This guarantees learners can study the pedagogical explanation and solution diagrams without visual disruption.

### 21.5 Disabled Skip Action During Timer Pause
- **Contextual Skip Disabling**: While the challenge is paused (`isTimerPaused === true`), the Skip button in the bottom action bar is strictly disabled with muted visual styling (`opacity-50`, `cursor-not-allowed`), an explanatory tooltip ("Resume challenge to skip question"), and `aria-disabled="true"`.
- **Action Guard & Instant Re-enabling**: The `handleSkip` handler rejects execution if `isTimerPaused` is true. As soon as the user unpauses the session (via the header timer, bottom action bar, or "Resume Challenge" button), the Skip button immediately restores to active state.

## 22. Cosmic Feature Innovations: 50/50 Power-Up, Trivia & Ranks
To deepen pedagogical immersion, foster engagement for kids aged 2 to 14, and elevate cognitive problem solving without sacrificing 60fps performance, AstroQuest integrates three major cosmic feature innovations.

### 22.1 50/50 Cosmic Ray Power-Up (`HintModal.jsx` & `OptionsGrid.jsx`)
- **Cosmic Disintegration Beam**: Allows learners to fire a 50/50 Cosmic Ray that eliminates two incorrect answer choices with visual stardust disintegration, reducing cognitive overload on challenging questions.

### 22.2 Cosmic Space Factoids Library (`src/data/cosmicFacts.js`)
- **Educational Transitions**: Presents child-friendly astronomical trivia (e.g. Venus rotation, diamond rain on Neptune, stardust biology) during the question-loading pause, turning transition latency into active learning discovery.

### 22.3 Astronaut Rank & Mission Badges Progression System (`badgeManager.js`)
- **Rank Hierarchy**: Rewards child effort with XP and titles from Stargazer (Level 1) through Galactic Commander (Level 5), visible in the header and result overview.
- **Collectible Mission Badges**: Celebrates milestones (First Launch, Speed of Light, Nebula Scholar, Stellar Streak, Supernova Perfect, Cosmic Ray Master) with full persistence in localStorage and portability in JSON backups.

## 23. Audio & Early Literacy Suite: Voice Personalities, Karaoke Narration & Ambient Focus
Engineered to support auditory learners, emerging readers aged 2 to 7, and children with sensory focus needs, AstroQuest introduces a multi-tier audio experience with zero heavy asset files.

### 23.1 Cosmic Voice Personalities (`audioSynthesis.js` & `SettingsScreen.jsx`)
- **4 Custom Narrator Personalities**: Children can select between Classic Explorer (balanced natural speech), Beep-Boop Bot (pitch 1.4, high robotic cadence), Captain Nova (upbeat, enthusiastic mission guide), and Gentle Nebula (calm, lower rate 0.88 for test-anxious learners).

### 23.2 Karaoke Word-by-Word Narration Highlighting (`QuestionCard.jsx`)
- **Real-Time Speech Boundary Sync**: Tracks `SpeechSynthesisUtterance.onboundary` events to illuminate prompt words in glowing cyan as they are spoken, connecting phonetic sound to written orthography.

### 23.3 Zero-Asset Deep-Space Procedural Ambient Focus Engine (`ambientAudio.js`)
- **432Hz Harmonic Soundscape**: Synthesized via native Web Audio API oscillators and lowpass biquad filters with random pentatonic celestial chimes; consumes 0 KB network download and auto-suspends on tab blur to save battery.

## 24. Multi-Child Household "Flight Crew" Profiles (`crewManager.js` & `CrewSwitcherModal.jsx`)
To eliminate sibling friction and support classroom device sharing, AstroQuest features a multi-astronaut profile registry stored in `localStorage`.

### 24.1 Astronaut Profile Registry & Quick Switcher
- **Isolated Explorer State**: Each astronaut maintains their own name, age, avatar, XP, astronaut rank, badges, and learning preferences without cross-profile data leakage.
- **One-Click Top Navigation Pill**: Accessible from both the desktop header and mobile quick controls, allowing instant hot-swapping between siblings with dynamic state rehydration.
- **Complete JSON Portability**: Bundles the entire crew registry into backup exports, enabling seamless transfer between family devices.

## 25. Interactive Learning Diagnostics & Diplomas (`CognitiveRadarChart.jsx` & `pdfGenerator.js`)
Provides parents, educators, and young students with granular cognitive evaluation and celebrating milestones.

### 25.1 5-Axis SVG Cognitive Radar Chart (`cognitiveAnalytics.js`)
- **Multi-Domain Analytics**: Evaluates mastery across 5 domains: Mental Arithmetic, Spatial & Visual Reasoning, Pattern Recognition, Verbal Comprehension, and Scientific Inquiry.
- **Zero-Dependency SVG Spider Graph**: Lightweight mathematical projection with concentric pentagons, cyan data polygon gradient, and Top Strength spotlight badge.

### 25.2 Personalized Printable Galactic Explorer Certificate
- **Official Starlight Diploma PDF**: Generates an ornamental landscape space diploma with gold/cyan galactic border, astronaut name, rank insignia, accuracy score, and official signature line.

## 26. Advanced Game Modes & Visual Exploration (`TimeWarpMode.jsx`, Planetarium & Observatory)
Expands learning into gamified survival challenges, habit-building astronomy, and interactive celestial science.

### 26.1 "Time Warp" Cosmic Lightning Survival Round (`TimeWarpMode.jsx`)
- **Lightning Mechanics**: 60-second starting timer with +5s reward for correct answers and -3s penalty for errors, combo streak multipliers (1.5x and 2x Warp Speed), and high-score tracking.

### 26.2 Stellar Sky Observatory & Daily Star Habits (`constellations.js`)
- **Constellation Star Maps**: Normalized SVG sky dome mapping real constellations (Orion, Big Dipper, Cassiopeia, Cygnus, Pegasus) with mythic lore, astronomical science, and daily habit streaks.

### 26.3 Pocket Planetarium 3D Solar System Explorer (`PocketPlanetariumModal.jsx`)
- **Planetary Exploration**: Features the Sun and 9 celestial worlds with 3D CSS spheres, planetary rings, diameter/orbit/temperature stats, child-friendly facts, and audio narration guides.

### 26.4 Mission Control "Super Challenge" Boss Question #10
- **Climactic Boss Encounter**: Question #10 elevates into a dramatic crimson/gold HUD alert ("⚠️ BOSS ENCOUNTER ALERT") awarding double XP (+30 XP) and the collectible Boss Encounter Victor badge.
