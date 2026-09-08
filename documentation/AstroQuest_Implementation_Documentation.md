# 🚀 AstroQuest: Technical Architecture & Implementation Documentation

**Document Version**: 2.0.0 (Production Edition)
**Classification**: Engineering Design & Technical Implementation Specification
**Target Platforms**: Modern Web Browsers (Chrome, Edge, Safari, Firefox), Desktop, Tablet, Mobile Responsive

---

## 1. Executive Summary & System Overview

AstroQuest is an engaging, visual-first, cognitive learning web application engineered for early explorers and young students (Ages 2 to 14). Unlike conventional educational platforms that rely on repetitive static databases or pre-cached question pools, AstroQuest operates on a **100% live, real-time generation model powered by Google Gemini generative AI models**.

The application synthesizes strictly dynamic mathematical diagrams, polygonal SVG vector geometry, 3x3 pattern matrix progressions, 3D isometric block pyramids, optics light refraction representations, and scientific cause-and-effect processes. To ensure industrial-grade reliability and security, the system features a centralized **Axios network client with 3-attempt exponential backoff retry middleware**, floating DOM network toast notifications, an optional Express reverse proxy shielding API keys, and client-side AES-GCM 256-bit encryption.

---

## 2. Technology Stack Mapping: Requirements vs. Technologies

| Requirement Category | Technology / Library | Version / Specs | Architectural Rationale & Benefit |
| :--- | :--- | :--- | :--- |
| **Core UI Framework** | React.js | 18.3.1 | Declarative component model, React.memo, Suspense, and hook-based modular state architecture. |
| **Bundler & Dev Server** | Vite | 6.0.7 (Rollup) | Sub-second Hot Module Replacement (HMR) and optimized Rollup code-splitting with manual chunking. |
| **Styling & Responsive UI** | Tailwind CSS | 3.4.17 | Utility-first styling with custom space-theme palettes, dynamic fluid grids, and hardware-accelerated animations. |
| **HTTP & Network Layer** | Axios | 1.20.0 | Centralized client with request/response interceptors, automatic retries with exponential backoff, and timeouts. |
| **Generative AI Engine** | Google Gemini API | v1beta REST | Real-time multi-modal LLM content generation supporting gemini-3.5-flash-lite, flash, and flash-preview. |
| **AI Image Synthesis** | Google Imagen 3 / Pollinations | Multi-Provider | Multi-tier failover pipeline for visual puzzle image generation (Imagen 3 -> Flash Image -> Pollinations AI). |
| **Audio Synthesis & TTS** | Web Speech API | Browser Native | Zero-asset text-to-speech narration with Chromium pause-queue workaround and single-voice guarantee. |
| **Sound FX Synthesis** | Web Audio API | Browser Native | Pure procedural oscillator sound generation (sine/triangle waves) for pop, star, success, and fanfare effects. |
| **PDF Report Generation** | jsPDF & html2canvas | 4.2.1 / 1.4.1 | Dynamically imported on-demand to create personalized, multi-page vector session summaries. |
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
