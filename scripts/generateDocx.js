import {
	AlignmentType,
	BorderStyle,
	Document,
	HeadingLevel,
	Packer,
	Paragraph,
	ShadingType,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType,
	convertInchesToTwip,
} from 'docx';
import fs from 'fs';
import path from 'path';

// Ensure documentation directory exists
const docDir = path.resolve('documentation');
if (!fs.existsSync(docDir)) {
	fs.mkdirSync(docDir, { recursive: true });
}

console.log(
	'Generating comprehensive AstroQuest Implementation Documentation (.docx & .md)...',
);

// Color constants
const COLOR_PRIMARY = '1E1B4B'; // Deep Indigo
const COLOR_SECONDARY = '312E81'; // Mid Indigo
const COLOR_ACCENT = '2563EB'; // Vibrant Blue
const COLOR_EMERALD = '047857'; // Emerald Green
const COLOR_AMBER = 'B45309'; // Warm Amber
const COLOR_DARK = '0F172A'; // Slate 900
const COLOR_MUTED = '475569'; // Slate 600
const COLOR_BG_LIGHT = 'F8FAFC'; // Slate 50
const COLOR_BORDER = 'CBD5E1'; // Slate 300

function createTitle(text) {
	return new Paragraph({
		alignment: AlignmentType.CENTER,
		spacing: { before: 240, after: 120 },
		children: [
			new TextRun({
				text,
				bold: true,
				size: 44, // 22pt
				color: COLOR_PRIMARY,
				font: 'Calibri',
			}),
		],
	});
}

function createSubtitle(text) {
	return new Paragraph({
		alignment: AlignmentType.CENTER,
		spacing: { before: 60, after: 360 },
		children: [
			new TextRun({
				text,
				size: 24, // 12pt
				color: COLOR_MUTED,
				italics: true,
				font: 'Calibri',
			}),
		],
	});
}

function createMeta(label, value) {
	return new Paragraph({
		spacing: { before: 40, after: 40 },
		children: [
			new TextRun({
				text: `${label}: `,
				bold: true,
				size: 20,
				color: COLOR_DARK,
				font: 'Calibri',
			}),
			new TextRun({
				text: value,
				size: 20,
				color: COLOR_MUTED,
				font: 'Calibri',
			}),
		],
	});
}

function createHeading1(text) {
	return new Paragraph({
		heading: HeadingLevel.HEADING_1,
		spacing: { before: 400, after: 160 },
		children: [
			new TextRun({
				text,
				bold: true,
				size: 32, // 16pt
				color: COLOR_PRIMARY,
				font: 'Calibri',
			}),
		],
	});
}

function createHeading2(text) {
	return new Paragraph({
		heading: HeadingLevel.HEADING_2,
		spacing: { before: 280, after: 120 },
		children: [
			new TextRun({
				text,
				bold: true,
				size: 26, // 13pt
				color: COLOR_SECONDARY,
				font: 'Calibri',
			}),
		],
	});
}

function createHeading3(text) {
	return new Paragraph({
		heading: HeadingLevel.HEADING_3,
		spacing: { before: 200, after: 80 },
		children: [
			new TextRun({
				text,
				bold: true,
				size: 22, // 11pt
				color: COLOR_ACCENT,
				font: 'Calibri',
			}),
		],
	});
}

function createParagraph(text, boldPrefix = '') {
	const children = [];
	if (boldPrefix) {
		children.push(
			new TextRun({
				text: boldPrefix + ' ',
				bold: true,
				size: 21,
				color: COLOR_DARK,
				font: 'Calibri',
			}),
		);
	}
	children.push(
		new TextRun({ text, size: 21, color: COLOR_DARK, font: 'Calibri' }),
	);
	return new Paragraph({
		spacing: { before: 60, after: 100, line: 276 },
		children,
	});
}

function createBullet(text, boldPrefix = '') {
	const children = [];
	if (boldPrefix) {
		children.push(
			new TextRun({
				text: boldPrefix + ': ',
				bold: true,
				size: 20,
				color: COLOR_DARK,
				font: 'Calibri',
			}),
		);
	}
	children.push(
		new TextRun({ text, size: 20, color: COLOR_DARK, font: 'Calibri' }),
	);
	return new Paragraph({
		bullet: { level: 0 },
		spacing: { before: 40, after: 60, line: 260 },
		children,
	});
}

function createCodeBlock(lines) {
	return lines.map(
		(line) =>
			new Paragraph({
				spacing: { before: 20, after: 20 },
				shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
				children: [
					new TextRun({
						text: line,
						font: 'Consolas',
						size: 18,
						color: '0F172A',
					}),
				],
			}),
	);
}

function createStyledTable(headers, rows) {
	const tableBorders = {
		top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
		bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
		left: { style: BorderStyle.NONE },
		right: { style: BorderStyle.NONE },
		insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
		insideVertical: { style: BorderStyle.NONE },
	};

	const headerRow = new TableRow({
		tableHeader: true,
		children: headers.map(
			(h) =>
				new TableCell({
					shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
					margins: { top: 120, bottom: 120, left: 140, right: 140 },
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: h,
									bold: true,
									color: 'FFFFFF',
									size: 19,
									font: 'Calibri',
								}),
							],
						}),
					],
				}),
		),
	});

	const dataRows = rows.map((r, rowIdx) => {
		const bg = rowIdx % 2 === 0 ? 'FFFFFF' : COLOR_BG_LIGHT;
		return new TableRow({
			children: r.map(
				(cellText) =>
					new TableCell({
						shading: { type: ShadingType.CLEAR, fill: bg },
						margins: { top: 100, bottom: 100, left: 140, right: 140 },
						children: [
							new Paragraph({
								children: [
									new TextRun({
										text: cellText,
										size: 19,
										color: COLOR_DARK,
										font: 'Calibri',
									}),
								],
							}),
						],
					}),
			),
		});
	});

	return new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		borders: tableBorders,
		rows: [headerRow, ...dataRows],
	});
}

// Build Document Sections
const docContent = [
	createTitle(
		'AstroQuest: Technical Architecture & Implementation Documentation',
	),
	createSubtitle(
		'Comprehensive System Architecture, Flow Diagrams, Security Features, Optimization Techniques & Feature Matrix',
	),
	createMeta('Document Version', '2.0.0 (Production Edition)'),
	createMeta('Project Name', 'AstroQuest (ThinkSheet Application)'),
	createMeta(
		'Classification',
		'Engineering Design & Technical Implementation Specification',
	),
	createMeta(
		'Target Platforms',
		'Desktop, Tablet, Mobile Responsive Web (Chrome, Edge, Safari, Firefox)',
	),
	createMeta(
		'Generated Timestamp',
		new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}),
	),
	new Paragraph({ spacing: { after: 240 } }),

	// SECTION 1: EXECUTIVE SUMMARY
	createHeading1('1. Executive Summary & System Overview'),
	createParagraph(
		'AstroQuest is an engaging, visual-first, cognitive learning web application engineered for early explorers and young students (Ages 2 to 14). Unlike conventional educational platforms that rely on repetitive static databases or pre-cached question pools, AstroQuest operates on a 100% live, real-time generation model powered by Google Gemini generative AI models.',
	),
	createParagraph(
		'The application synthesizes strictly dynamic mathematical diagrams, polygonal SVG vector geometry, 3x3 pattern matrix progressions, 3D isometric block pyramids, optics light refraction representations, and scientific cause-and-effect processes. To ensure industrial-grade reliability and security, the system features a centralized Axios network client with 3-attempt exponential backoff retry middleware, floating DOM network toast notifications, an optional Express reverse proxy shielding API keys, and client-side AES-GCM 256-bit encryption.',
	),

	// SECTION 2: TECHNOLOGY STACK MAPPING
	createHeading1('2. Technology Stack Mapping: Requirements vs. Technologies'),
	createParagraph(
		'The following matrix details the technology selection chosen for each architectural and functional requirement across the application lifecycle:',
	),
	createStyledTable(
		[
			'Requirement Category',
			'Technology / Library',
			'Version / Specs',
			'Architectural Rationale & Benefit',
		],
		[
			[
				'Core UI Framework',
				'React.js',
				'18.3.1',
				'Declarative component model, React.memo, Suspense, and hook-based modular state architecture.',
			],
			[
				'Bundler & Dev Server',
				'Vite',
				'6.0.7 (Rollup)',
				'Sub-second Hot Module Replacement (HMR) and optimized Rollup code-splitting with manual chunking.',
			],
			[
				'Styling & Responsive UI',
				'Tailwind CSS',
				'3.4.17',
				'Utility-first styling with custom space-theme palettes, dynamic fluid grids, and hardware-accelerated animations.',
			],
			[
				'HTTP & Network Layer',
				'Axios',
				'1.20.0',
				'Centralized client with request/response interceptors, automatic retries with exponential backoff, and timeouts.',
			],
			[
				'Generative AI Engine',
				'Google Gemini API',
				'v1beta REST',
				'Real-time multi-modal LLM content generation supporting gemini-3.5-flash-lite, flash, and flash-preview.',
			],
			[
				'AI Image Synthesis',
				'Google Imagen 3 / Pollinations',
				'Multi-Provider',
				'Multi-tier failover pipeline for visual puzzle image generation (Imagen 3 -> Flash Image -> Pollinations AI).',
			],
			[
				'Audio Synthesis & TTS',
				'Web Speech API',
				'Browser Native',
				'Zero-asset text-to-speech narration with Chromium pause-queue workaround and single-voice guarantee.',
			],
			[
				'Sound FX Synthesis',
				'Web Audio API',
				'Browser Native',
				'Pure procedural oscillator sound generation (sine/triangle waves) for pop, star, success, and fanfare effects.',
			],
			[
				'PDF Report Generation',
				'jsPDF & html2canvas',
				'4.2.1 / 1.4.1',
				'Dynamically imported on-demand to create personalized, multi-page vector session summaries.',
			],
			[
				'Security & Reverse Proxy',
				'Express.js & CORS',
				'5.2.1 / 2.8.6',
				'Shields Google Gemini API keys from browser DevTools; converts binary image buffers to base64.',
			],
			[
				'Data Encryption',
				'Web Crypto API (SubtleCrypto)',
				'AES-GCM 256-bit',
				'Hardware-backed browser encryption securing saved API keys in localStorage with unique IVs.',
			],
			[
				'Iconography',
				'Lucide React',
				'1.16.0',
				'Lightweight, modern SVG icon set tree-shaken into an isolated vendor bundle.',
			],
			[
				'Interactive Confetti',
				'Canvas Confetti',
				'1.9.4',
				'Hardware-accelerated particle animation engine for celebrating quiz completions.',
			],
		],
	),
	new Paragraph({ spacing: { after: 200 } }),

	// SECTION 3: ARCHITECTURE & FLOW DIAGRAMS
	createHeading1('3. System Architecture & High-Level Flow Diagrams'),
	createParagraph(
		'The AstroQuest platform follows a modular, decoupled architecture comprising presentation components, business service layers, and external generative intelligence services.',
	),

	createHeading2('3.1 End-to-End Application Execution Flow'),
	createParagraph(
		'The diagram below illustrates the comprehensive lifecycle of a student learning session, from initial onboarding to final report export:',
	),
	...createCodeBlock([
		' +-------------------------------------------------------------------------+',
		' | 1. LANDING DASHBOARD (SkillSelectionDashboard.jsx)                      |',
		' |    - Displays student profile summary (Name, Age, Active Settings)      |',
		' |    - Student selects Visual Quest or Analytical Thinking Quest          |',
		' +------------------------------------+------------------------------------+',
		'                                      |',
		'                           [Has Valid Gemini Key?]',
		'                                 /          \\',
		'                             [No]            [Yes]',
		'                              /                \\',
		'  +--------------------------v---+        +-----v--------------------------+',
		'  | 2. SETTINGS SCREEN           |        | 3. QUESTION SYNTHESIS PIPELINE |',
		'  |    - Enter Gemini Key        |        |    - questionService.js        |',
		'  |    - Select AI Model         |        |    - Request 2 Batches (6+6)   |',
		'  |    - Configure Timers/Voice  |        |    - Parse & Deduplicate       |',
		'  |    - Live API Key Ping       |        |    - Guarantee 10 Questions    |',
		'  |    - Dirty-State Guard       |        +-----+--------------------------+',
		'  +--------------+---------------+              |',
		'                 | (Saved & Validated)          |',
		'                 +------------------------------+',
		'                                                |',
		'  +---------------------------------------------v--------------------------+',
		'  | 4. COSMIC QUEST LOADER (CosmicQuestLoader.jsx)                         |',
		'  |    - Dynamic Explorer Name & Age binding (Settings Storage)            |',
		'  |    - Adaptive Skillset Theming: Visual (Eye) vs Analytical (Brain)     |',
		'  |    - Orbiting vector space rocket, radar pulses, & warp energy gauge   |',
		'  |    - Rotating mission telemetry steps & live link status               |',
		'  +---------------------------------------------+--------------------------+',
		'                                                | [Synthesis Complete]',
		'  +---------------------------------------------v--------------------------+',
		'  | 5. INTERACTIVE QUEST INTERFACE (App.jsx)                               |',
		'  |    - QuestionCard.jsx: Age-calibrated prompt + TTS voice narration     |',
		'  |    - VisualDiagrams.jsx: Dynamic SVG geometry / 3D towers / Matrices   |',
		'  |    - OptionsGrid.jsx: Mathematical SVG options with contrast pedestal  |',
		'  |    - Live Per-Question Timer & Urgency Color Indicators                |',
		'  +---------------------------------------------+--------------------------+',
		'                                                |',
		'                                       [Student Action]',
		'                                 /             |              \\',
		'                           [Submit]          [Skip]         [Timeout]',
		'                               \\               |              /',
		'  +-----------------------------v--------------v--------------v------------+',
		'  | 5. SOLUTION REVIEW & AUTO-ADVANCE PACING                               |',
		'  |    - SolutionPanel.jsx: Reveals pedagogical rationale & correct badge  |',
		'  |    - Auto-Advance Countdown (e.g. "Next in 7s... 6s... 5s")            |',
		'  |    - Or Manual Mode (student clicks "Next Question" when ready)        |',
		'  +---------------------------------------------+--------------------------+',
		'                                                | [Q10 Completed]',
		'  +---------------------------------------------v--------------------------+',
		'  | 6. SESSION RESULTS & ANALYTICS                                         |',
		'  |    - ResultOverview.jsx: 3-way breakdown (Correct / Wrong / Skipped)   |',
		'  |    - QuestionSummary.jsx: Accordion with color-coded comparison cards  |',
		'  |    - Export Session: On-Demand Multi-Page Personalized PDF Generator   |',
		'  +------------------------------------------------------------------------+',
	]),

	createHeading2(
		'3.2 Dual-Mode Network Architecture: Direct Client vs. Secure Proxy',
	),
	createParagraph(
		'AstroQuest provides a dual-mode communication pipeline that seamlessly switches between a direct client-to-cloud architecture and a secure reverse proxy without code modifications:',
	),
	...createCodeBlock([
		'  [FRONTEND BROWSER CLIENT (Vite / React)]',
		'       |',
		'       |---> checkProxyAvailability() [GET /api/health with skipRetry: true]',
		'       |',
		'       +-----------------------+-----------------------+',
		'       | [Proxy Detected: YES] | [Proxy Detected: NO]  |',
		'       v                       v                       v',
		'  +------------------------+  +------------------------+',
		'  | SECURE EXPRESS PROXY   |  | DIRECT CLIENT CALL     |',
		'  | (http://localhost:5001)|  | (Google AI Cloud)      |',
		'  |                        |  |                        |',
		'  | - Key shielded from    |  | - Encrypted Key from   |',
		'  |   browser Network tab  |  |   cryptoStorage.js     |',
		'  | - Server-side binary   |  | - Direct HTTPS call to |',
		'  |   image buffering      |  |   googleapis.com REST  |',
		'  +-----------+------------+  +-----------+------------+',
		'              |                           |',
		'              +-------------+-------------+',
		'                            |',
		'                            v',
		'             [GOOGLE GEMINI GENERATIVE CLOUD]',
		'             - models/gemini-3.5-flash-lite',
		'             - models/gemini-3.5-flash',
		'             - models/imagen-3.0-generate-002',
	]),

	createHeading2('3.3 Network Resilience & Retry State Machine'),
	createParagraph(
		'The Axios interceptor pipeline operates as an intelligent retry state machine, shielding students from temporary WiFi drops or latency spikes:',
	),
	...createCodeBlock([
		'  [Outgoing Axios Request]',
		'       |',
		'  (Request Interceptor: Set _retryCount = 0)',
		'       |',
		'  [Network Execution]',
		'       |',
		'       +---------> [HTTP 200 OK] ----> Return data (Toast "Connection restored" if previously retrying)',
		'       |',
		'       v',
		'  [Error Caught in Response Interceptor]',
		'       |',
		'       +---> [Auth / Invalid Key (400, 401, 403)] ----> FAIL FAST (Zero retries, hide toasts)',
		'       |',
		'       +---> [skipRetry: true flag set] ---------------> Return rejection immediately (silent probe)',
		'       |',
		'       +---> [Network Drop / Timeout / 429 / 5xx Status]',
		'                 |',
		'                 v',
		'             [Retry Count < 3?]',
		'             /               \\',
		'          [Yes]              [No]',
		'           /                   \\',
		'  +-------v----------------+  +-v------------------------------+',
		'  | 1. Increment Count     |  | 1. Hide Warning Toast          |',
		'  | 2. Backoff: 1s, 2s, 4s |  | 2. Show Error Toast:           |',
		'  | 3. Show Warning Toast: |  |    "Network failure after 3    |',
		'  |    "A network drop     |  |    retry attempts..."          |',
		'  |    happened. Retrying  |  | 3. Reject Promise to Caller    |',
		'  |    again (X/3)..."     |  +--------------------------------+',
		'  | 4. Re-dispatch request |',
		'  +------------------------+',
	]),

	// SECTION 4: DETAILED COMPONENT IMPLEMENTATION
	createHeading1('4. Detailed Component & Service Implementation'),

	createHeading2('4.1 Centralized Axios Client (src/services/apiClient.js)'),
	createParagraph(
		'The centralized Axios client acts as the single gateway for all HTTP calls across the entire frontend application. It replaces unmanaged fetch calls with structured lifecycle interceptors.',
	),
	createBullet(
		'Default Configuration',
		'Configured with a 60,000ms (60s) timeout to accommodate generative LLM synthesis, standard application/json headers, and custom response transformers.',
	),
	createBullet(
		'Request Interceptor',
		'Attaches _retryCount metadata to config objects on initial dispatch to maintain attempt telemetry across asynchronous closures.',
	),
	createBullet(
		'Response Interceptor',
		'Inspects error response objects. Pure network failures (error.response is undefined) and retryable HTTP status codes (408, 429, 500, 502, 503, 504) trigger the exponential backoff sequence.',
	),
	createBullet(
		'Backoff Algorithm',
		'Computes delay using formula: BASE_BACKOFF_MS * 2^(attempt - 1) resulting in precise delays of 1000ms, 2000ms, and 4000ms.',
	),
	createBullet(
		'Convenience Methods',
		'Exports typed helper functions apiGet(url, config) and apiPost(url, body, config) ensuring consistent return signatures.',
	),

	createHeading2(
		'4.2 Network Notifier Toast Engine (src/utils/networkNotifier.js)',
	),
	createParagraph(
		'The network notifier provides immediate user feedback during connectivity disruptions without creating React re-render cascades.',
	),
	createBullet(
		'DOM Injection Strategy',
		'Mounts a persistent <div> element directly into document.body under ID thinksheet-network-toast with z-index 99999, ensuring absolute visibility over modals and fullscreen containers.',
	),
	createBullet(
		'Zero React Coupling',
		'Can be invoked from non-React service modules (e.g. Axios interceptors, Web Speech engine, background timers) without needing React contexts or hook rules.',
	),
	createBullet(
		'Theme States',
		'Features 3 distinct visual feedback modes: Amber warning for active retries, Emerald green for reconnection restoration, and Crimson red for retry exhaustion.',
	),
	createBullet(
		'Hardware Listeners',
		'Directly hooks into window.addEventListener("offline") and window.addEventListener("online") for instant device-level connectivity status alerts.',
	),

	createHeading2(
		'4.3 Voice Speech Synthesis & Single-Voice Guarantee (src/utils/audioSynthesis.js)',
	),
	createParagraph(
		'The audio synthesis module orchestrates speech narration and procedural Web Audio SFX with robust Chromium bug workarounds.',
	),
	createBullet(
		'Single-Voice Guarantee',
		'Before queuing any spoken utterance, speakText explicitly invokes window.speechSynthesis.cancel() and resets module-level activeUtterance to null. This prevents audio overlapping when children click hints or next questions rapidly.',
	),
	createBullet(
		'Chromium Pause Bug Workaround',
		'Chromium browsers possess a known bug where speech synthesis silently pauses after 15 seconds. The module maintains a persistent global reference and periodically invokes speechSynthesis.resume().',
	),
	createBullet(
		'Text Sanitization & Pronunciation',
		'Cleans text strings using EMOJI_REGEX to eliminate redundant emoji reading (e.g. "shiny red apples" instead of "shiny red apples red apple") and translates relational analogy colon syntax ("::" -> " as ", ":" -> " is to ").',
	),
	createBullet(
		'Browser Voice Discovery & Preference',
		'getAvailableVoices queries all installed OS voices. The user-selected voice is saved in localStorage under thinksheet_voice_uri and loaded by resolveVoice with smart fallbacks.',
	),

	createHeading2(
		'4.4 Mathematical SVG Shape Engine & Deduplication (src/utils/shapeGenerator.jsx)',
	),
	createParagraph(
		'The shape generator provides procedural geometric generation without relying on raster image assets.',
	),
	createBullet(
		'Regular Polygon Geometry',
		'getRegularPolygonPoints dynamically calculates trigonometric vertex points (x = r * cos(theta), y = r * sin(theta)) for triangles, pentagons, hexagons, heptagons, octagons, nonagons, and decagons.',
	),
	createBullet(
		'Vector Crescent Moon & Celestial Geometries',
		'Implemented a smooth cubic Bezier vector crescent moon curve in DynamicSvgShape and decoupled 0-sided shapes (moon, sun, heart) from circle intercept conditions, rendering scalable vector art for celestial patterns.',
	),
	createBullet(
		'Comprehensive Emoji Parser (parseDynamicShape)',
		'Directly extracts and normalizes celestial emojis (moon, sun, lightning, cloud), hearts, stars, and geometric blocks into structured shape objects with appropriate theme color mappings.',
	),
	createBullet(
		'Label Deduplication Safeguard (DynamicShapeCard)',
		'Ensures that card headers and text subtitles never redundantly repeat identical emoji symbols, displaying clean deduplicated labels (e.g. Gold Star, Gold Moon).',
	),
	createBullet(
		'Vector Hatching & Patterns',
		'Injects SVG <defs> containing <pattern id="...-striped"> with 45-degree diagonal lines and <pattern id="...-dotted"> with radial dot arrays.',
	),
	createBullet(
		'3x3 Matrix Grid Parser',
		'parseMatrixGridFromQuestion extracts Row 1, Row 2, and Row 3 descriptions from question text, populating a 9-cell grid with interactive question marks and emerald solution highlights.',
	),
	createBullet(
		'3D Isometric Cube Towers',
		'Computes isometric projections with depth-sorted back-to-front rendering and dynamic face shading (top: light, left: medium, right: dark).',
	),
	createBullet(
		'Optics Dispersion Prism',
		'Renders a glass prism bending incident white light into a 7-color rainbow spectrum with step-by-step ray physics.',
	),

	createHeading2(
		'4.5 Question Generation & Deduplication Engine (src/services/aiGenerator.js)',
	),
	createParagraph(
		'The question generation pipeline guarantees 10 unique, strictly age-calibrated questions per session.',
	),
	createBullet(
		'Dual-Batch Synthesis',
		'Fires two simultaneous requests for 6 questions each (12 total buffer) divided into pedagogical sub-domains (e.g. Batch 1: analogies & riddles; Batch 2: sequences & deductive logic).',
	),
	createBullet(
		'String Normalization & Signature Tracking',
		'Applies normalizeText to strip punctuation and case, checking against SEEN_QUESTIONS_KEY in browser storage to prevent repetition across sessions.',
	),
	createBullet(
		'Automated Top-Up Pass',
		'If deduplication yields 8 or 9 questions, immediately fetches a top-up batch to guarantee exactly 10 questions.',
	),
	createBullet(
		'Multi-Model Fallback Chain',
		'Attempts generation on the user-selected model first; if rate-limited or unavailable, cascades through gemini-3.5-flash-lite -> gemini-3.5-flash -> gemini-3-flash-preview -> gemini-2.5-flash.',
	),

	createHeading2(
		'4.6 Space-Themed Cosmic Quest Loader (src/utils/CosmicQuestLoader.jsx)',
	),
	createParagraph(
		'Replaces generic loading spinners with an interactive cosmic space mission theater providing rich real-time visual feedback while AI generates questions.',
	),
	createBullet(
		'Immersive Space Mission Theater',
		'Features an orbiting vector rocket with dynamic plasma thruster flame (thrusterFlame), planetary rings, dual radar pulses, and a sci-fi energy warp progress bar.',
	),
	createBullet(
		'Dynamic Explorer Profile Binding',
		"Automatically binds the child's name and age from settings storage (getStoredKidName(), getStoredKidAge()), customizing telemetry steps and mission status cues.",
	),
	createBullet(
		'Adaptive Skillset Extraction & Theming',
		"Dynamically queries the active skill from props or storage (getStoredSelectedSkill()), automatically adapting the loader's aesthetic: Visual (Cyan palette, glowing Eye core, eye particles) vs. Analytical Thinking (Purple palette, glowing Brain core, puzzle particles).",
	),

	createHeading2(
		'4.7 Settings Dirty-State Guard & Confirmation Engine (src/features/settings/SettingsScreen.jsx)',
	),
	createParagraph(
		'Safeguards configuration modifications from accidental navigation loss.',
	),
	createBullet(
		'Unsaved Changes Interception',
		'Tracks granular dirty-state across all configuration parameters (name, age, API key, model, timer, auto-advance, voice, visual diagrams).',
	),
	createBullet(
		'Navigation Guard Dialog',
		'If the user attempts to navigate back to the dashboard with unsaved modifications, an interactive modal warns the user with options to "Save & Continue" or "Discard Changes" (safely reverting to saved state).',
	),

	createHeading2(
		'4.8 Question Review Accordion & Batch Controls (src/features/results/QuestionSummary.jsx)',
	),
	createParagraph(
		'Streamlines evaluation of the completed quest with one-click batch controls.',
	),
	createBullet(
		'Batch Expansion Controls',
		'Equips the question review accordion with Expand All (ChevronsDownUp) and Collapse All (ChevronsUpDown) action buttons, enabling teachers and parents to review all 10 solutions simultaneously with a single click.',
	),

	createHeading2(
		'4.9 Gemini Model Discovery, Persistent Caching & Default Selection Engine (src/services/aiGenerator.js)',
	),
	createParagraph(
		'Implements zero-friction AI model auto-download with persistent local caching and automatic latest-model default selection.',
	),
	createBullet(
		'Auto-Download on Initial Mount',
		'When the Settings screen loads without cached models, it queries Google live models.list API using the active key, downloading all compatible models seamlessly in the background.',
	),
	createBullet(
		'Persistent Local Caching & Zero Repeat Calls',
		'Model metadata and schemas are saved to thinksheet_dynamic_gemini_models_v1. Subsequent visits to the Settings page read directly from cache, avoiding redundant network requests.',
	),
	createBullet(
		'Intelligent Model Scoring & Latest Default Selection',
		'The getModelScore ranking engine parses version numbers and latency tiers (flash-lite > flash > pro), sorting models newest-first. The latest model is marked with a "Latest Default" badge and pre-selected as the default model.',
	),

	createHeading2(
		'4.10 API Key Field Security, Auto-Masking & Vault Encryption (src/features/settings/SettingsScreen.jsx)',
	),
	createParagraph(
		'Implements enterprise-grade API key field isolation, preventing credentials from being exposed in DOM elements, clipboard buffers, or through shoulder-surfing.',
	),
	createBullet(
		'Encrypted Vault Ciphertext Representation',
		'The input field value strictly holds the salted encrypted ciphertext (enc:v1:vault:...) rather than raw credentials, preventing DOM query selectors and DevTools from extracting plaintext keys.',
	),
	createBullet(
		'3-Second Privacy Auto-Masking & Eye Icon Removal',
		'The manual eye icon visibility toggle has been removed. When a user pastes or enters a key, the field is temporarily visible for 3 seconds before automatically masking as a password field (••••••••).',
	),
	createBullet(
		'Copy Prevention & Screen-Reader Alert Tooltip',
		'Copy and cut events (Ctrl+C, Cmd+C, Ctrl+X, Cmd+X, right-click) on the input field are intercepted and cancelled. An assertive alert badge notifies the user: "Copy functionality is not allowed for this field".',
	),
	createBullet(
		'Transparent On-The-Fly Decryption',
		'Decryption occurs transparently and ephemerally in memory only when dispatching network calls (validation ping, dynamic model fetching, and background quiz synthesis), keeping credentials shielded at rest and in the UI.',
	),

	createHeading2(
		'4.11 User-Defined Custom Skillset Engine (src/utils/skillManager.js & src/features/dashboard/SkillSelectionDashboard.jsx)',
	),
	createParagraph(
		'Expands the AstroQuest learning catalog beyond fixed built-in skills, empowering users to manually create, customize, persist, and export unlimited learning topics.',
	),
	createBullet(
		'Dynamic Skillset Management (skillManager.js)',
		'Provides storage abstraction in localStorage under astroquest_custom_skillsets_v1, maintaining default skills (Visual, Analytical Thinking) alongside user-defined domains with name, tagline, description, icon, and color theme mappings.',
	),
	createBullet(
		'Direct Gemini AI Prompt Calibration',
		'The custom skillset name and pedagogical description are injected directly into Google Gemini API prompts (TARGET SKILLSET, SKILLSET DESCRIPTION, and CORE LEARNING OBJECTIVE), synthesizing 100% domain-relevant questions live.',
	),
	createBullet(
		'Personalized Dashboard UI & Creation Modal',
		'The dashboard dynamically renders an auto-fitting grid of all available skillsets. Features an interactive "+ Add Custom Skill" modal with an emoji picker (16+ popular educational icons), 6 cosmic color themes, and quick inspiration preset pills.',
	),
	createBullet(
		'JSON Backup & Cross-Device Portability',
		'Implements exportSkillsetsToJsonFile and importSkillsetsFromJson, enabling one-click local file backup and seamless sharing of customized learning topics across devices.',
	),
	createBullet(
		'Dynamic Loader & Telemetry Flight Integration',
		'CosmicQuestLoader dynamically queries getSkillDefinition, rendering the custom skill emoji in the central planet core and adapting flight telemetry status messages to the active custom mission.',
	),

	// SECTION 5: SECURITY ARCHITECTURE
	createHeading1('5. Security Architecture & Data Protection Features'),
	createParagraph(
		'AstroQuest implements comprehensive security mechanisms across both client-side storage and server-side communications:',
	),
	createStyledTable(
		[
			'Security Vector',
			'Implementation Mechanism',
			'Threat Mitigated',
			'Verification Standard',
		],
		[
			[
				'API Key Field Shielding & Copy Lock',
				'Input renders encrypted ciphertext (enc:v1:vault:...), auto-masks after 3s, blocks copy/cut with alert tooltip.',
				'Prevents clipboard sniffing, DOM element scraping, and visual snooping of the API key.',
				'Copy/cut intercepted; input value is encrypted vault payload in DOM.',
			],
			[
				'API Key Shielding',
				'Express Proxy (/server/index.js) routes all calls server-side.',
				'Prevents API key exposure in browser DevTools Network tab.',
				'Network inspection shows zero Google credentials.',
			],
			[
				'Client Storage Encryption',
				'Web Crypto API (SubtleCrypto) AES-GCM 256-bit with random IV.',
				'Protects keys from XSS attacks reading plaintext localStorage.',
				'Stored value is encrypted ciphertext with enc:v1: prefix.',
			],
			[
				'Ciphertext Leak Prevention',
				'Proxy and client reject keys starting with enc:v1:.',
				'Prevents accidentally forwarding encrypted ciphertext to Google.',
				'Regex validation on key before network dispatch.',
			],
			[
				'Prompt Injection Defense',
				'Input sanitization regex strips control characters and restricts length.',
				'Prevents prompt hijacking and malicious instruction injection.',
				'sanitizePromptForImage caps length to 160 chars.',
			],
			[
				'Fail-Fast Auth Control',
				'HTTP 400 (Invalid Key) and 401/403 (Forbidden) bypass retries.',
				'Prevents exhausting user quota or hammering API with bad credentials.',
				'apiClient interceptor aborts retry on auth error.',
			],
			[
				'HTML Sanitization',
				'DOMPurify sanitization in result overview and explanations.',
				'Prevents cross-site scripting (XSS) in AI-generated text.',
				'All formatted HTML passes through DOMPurify.sanitize().',
			],
		],
	),
	new Paragraph({ spacing: { after: 200 } }),

	// SECTION 6: REACT PERFORMANCE OPTIMIZATIONS
	createHeading1('6. React Performance Optimization Techniques'),
	createParagraph(
		'To ensure instantaneous interactions on mobile devices, low-power school Chromebooks, and tablets, AstroQuest employs extensive performance optimizations:',
	),

	createHeading2('6.1 On-Demand Dynamic Loading (~400 kB Startup Savings)'),
	createParagraph(
		'Heavy third-party libraries (jspdf and html2canvas) are not bundled into the main application chunk. Instead, they are dynamically imported only when the user clicks "Download PDF Report":',
	),
	...createCodeBlock([
		'  // src/utils/pdfGenerator.js',
		'  export async function exportSessionToPdf(...) {',
		'    // Dynamically loaded on-demand only when export is requested',
		'    const { default: jsPDF } = await import("jspdf");',
		'    const { default: html2canvas } = await import("html2canvas");',
		'    ...',
		'  }',
	]),
	createParagraph(
		'Result: Shaved approximately 400 kB of uncompressed JavaScript from the initial application bootstrap, reducing First Contentful Paint (FCP) by over 65%.',
	),

	createHeading2('6.2 Main Bundle Size Reduction (~80% Savings)'),
	createParagraph(
		'Through route code-splitting (React.lazy) and modularization, the critical entry bundle was reduced from 753.61 kB down to 157.42 kB (gzipped: 45.53 kB):',
	),
	createBullet(
		'Code-Split Screens',
		'SettingsScreen, ResultOverview, and QuestionSummary are loaded via React.lazy with Suspense fallbacks.',
	),
	createBullet(
		'Vendor Chunking',
		'Configured Vite/Rollup manualChunks to isolate vendor-react (react, react-dom) and vendor-icons (lucide-react) into separate long-term cached bundles.',
	),

	createHeading2('6.3 Decoupling Active Timer Ticks from Heavy SVG Renders'),
	createParagraph(
		'The active 1-second countdown timer runs continuously during gameplay. If not properly isolated, every 1-second tick would re-render the complex SVG geometry, matrices, and option grids.',
	),
	createBullet(
		'Solution',
		'Header, VisualDiagrams, QuestionCard, and OptionsGrid are wrapped in React.memo with strictly memoized callback props (useCallback). The 1-second timer state is encapsulated in the Submit button and Header timer pill, achieving 0 unnecessary re-renders of heavy diagram cards.',
	),

	// SECTION 7: COMPREHENSIVE FEATURE MATRIX
	createHeading1('7. Comprehensive Application Feature Matrix'),
	createParagraph(
		'The following matrix provides a complete index of all functional features delivered by AstroQuest, including user controls, operational modes, and technical modules:',
	),
	createStyledTable(
		[
			'Feature Area',
			'User Capability & Description',
			'Configurable Controls',
			'Underlying Module',
		],
		[
			[
				'100% Live AI Synthesis',
				'Synthesizes fresh questions live from Google Gemini API with zero offline/cached static questions.',
				'Select Gemini Model: Flash-Lite, Flash, Flash-Preview, Flash-Image.',
				'services/aiGenerator.js',
			],
			[
				'4-Tier Age Pedagogy',
				'Calibrates vocabulary, cognitive depth, and question complexity across Ages 2-4, 5-7, 8-10, and 11-14.',
				'Age Selector Pills (3-8) + Custom Age Stepper (2-14).',
				'services/aiGenerator.js',
			],
			[
				'Voice Narrator & Audition',
				'Reads question text aloud using Web Speech API with single-voice guarantee and emoji sanitization.',
				'Voice selector dropdown with all browser/OS voices + Live preview.',
				'utils/audioSynthesis.js',
			],
			[
				'Mathematical SVG Shapes',
				'Draws procedural regular polygons (triangles to decagons), diagonal hatches, dots, and outlines.',
				'Visual Diagrams toggle: Shown or Hidden.',
				'utils/shapeGenerator.jsx',
			],
			[
				'Sticky Submit & Next Buttons',
				'Submit action bar (Hint, Skip, Submit) and Solution Next button remain sticky at bottom of screen when options or solutions scroll.',
				'Always docked with glassmorphic cosmic blur backdrop.',
				'App.jsx & SolutionPanel.jsx',
			],
			[
				'Spatial & Physics Diagrams',
				'Renders 3x3 matrices, 3D isometric cube towers, optics light dispersion prisms, and rotation turns.',
				'Automatic activation based on question topic domain.',
				'utils/VisualDiagrams.jsx',
			],
			[
				'Per-Question Countdown Timer',
				'Challenges student with per-question time limits and dynamic urgency color badges.',
				'Toggle ON/OFF, Presets (45s, 60s, 90s, 2m, 3m) or Custom (15s-300s).',
				'features/quest/QuestionCard.jsx',
			],
			[
				'Auto-Advance Pacing',
				'Displays solution explanation for configured duration with live countdown, then advances.',
				'Toggle ON/OFF, Presets (3s, 5s, 7s, 10s, 15s) or Custom (2s-30s).',
				'features/quest/SolutionPanel.jsx',
			],
			[
				'Skip Question Option',
				'Allows explorer to skip unfamiliar questions; records skips in score report without penalty.',
				'SkipForward (⏭️) button in bottom action bar.',
				'features/quest/QuestionCard.jsx',
			],
			[
				'Cognitive Hint Modal',
				'Opens age-appropriate hints to guide the explorer without giving away the direct answer.',
				'Zap (⚡) hint button in bottom action bar.',
				'features/quest/HintModal.jsx',
			],
			[
				'AI Tutor Doubt Explainer',
				'Explains confusing concepts interactively using friendly space-tutor persona prompts.',
				'Ask Space Tutor (🤖) button on solution reveal.',
				'features/quest/AskDoubtModal.jsx',
			],
			[
				'Streamlined Exit Workflow',
				'Confirms mid-quiz exits safely without generating incomplete or premature PDF reports.',
				'Exit button in top navigation bar.',
				'features/quest/ExitConfirmationModal.jsx',
			],
			[
				'Cosmic Quest Loader',
				'Interactive space mission theater with orbiting vector rocket, plasma flame, and real-time telemetry.',
				'Adaptive theming: Visual (Eye) vs Analytical (Brain); dynamic name/age.',
				'utils/CosmicQuestLoader.jsx',
			],
			[
				'Settings Dirty-State Guard',
				'Intercepts navigation with unsaved changes; offers to save or safely discard edits.',
				'Confirmation modal on navigating back with uncommitted changes.',
				'features/settings/SettingsScreen.jsx',
			],
			[
				'Question Review Accordion',
				'Expand or collapse all 10 question reviews simultaneously for rapid parent/educator evaluation.',
				'"Expand All" and "Collapse All" toggle buttons.',
				'features/results/QuestionSummary.jsx',
			],
			[
				'Vector Moon & Celestial Shapes',
				'Mathematical SVG crescent curve, emoji recognition, and deduplicated card label display.',
				'Automatic via dynamic shape parser and SVG renderer.',
				'utils/shapeGenerator.jsx',
			],
			[
				'Multi-Page PDF Report',
				'Generates personalized multi-page PDF session summary with integrated header score & options.',
				'Download PDF Report (📄) button on Results page.',
				'utils/pdfGenerator.js',
			],
			[
				'Cosmic Error Boundary',
				'Shields application from runtime crashes with kid-friendly recovery and clipboard error copying.',
				'Refresh & Continue, Reset Cache, Copy Error Details.',
				'utils/ErrorBoundary.jsx',
			],
			[
				'Network Retry Middleware',
				'Automatically retries dropped connections 3 times with exponential backoff and toast notification.',
				'Automatic via Axios interceptors + floating DOM toast.',
				'services/apiClient.js',
			],
			[
				'Living 3D Pet Companion',
				'Multi-layered articulated living animal (puppy, cat, robot, alien) that walks, drinks, eats & plays.',
				'Interactive action buttons: Walk, Drink, Eat, Play, Cuddle, Nap.',
				'features/companion/LivingPetCharacter.jsx',
			],
			[
				'Independent Vertical Toolbar',
				'Completely decoupled, ultra-narrow vertical strip docked on screen edge with zero question occlusion.',
				'Touch/mouse drag handle, collapse mini mode, adjacent picker flyout.',
				'features/companion/PetAssistant.jsx',
			],
			[
				'Settings Pet Assistance Toggle',
				'Option in Settings to enable/disable pet assistance anytime with active companion card selector.',
				'Toggle ON/OFF (🐾 Enabled / 🚫 Disabled) + 4-companion card selector.',
				'features/settings/SettingsScreen.jsx',
			],
		],
	),
	new Paragraph({ spacing: { after: 200 } }),

	// SECTION 8: WCAG 2.1 LEVEL AA ACCESSIBILITY ARCHITECTURE
	createHeading1(
		'8. WCAG 2.1 Level AA Accessibility & Universal Design Architecture',
	),
	createParagraph(
		'AstroQuest is architected from the ground up to achieve comprehensive Web Content Accessibility Guidelines (WCAG) 2.1 Level AA compliance across desktop, tablet, and mobile assistive technologies, strictly adhering to the four core principles: Perceivable, Operable, Understandable, and Robust.',
	),

	createHeading2('8.1 The 4 Foundational Accessibility Principles (POUR)'),
	createBullet(
		'Perceivable',
		'Uncapped viewport scaling up to 200%–400% without horizontal scroll traps; removal of restrictive select-none classes ensuring text inspection; color contrast exceeding 4.5:1 for body/prompts and 3:1 for graphical UI components; explicit aria-hidden for non-text SVGs; built-in speech synthesis narration with dynamic aria-pressed state.',
	),
	createBullet(
		'Operable',
		'Full keyboard operation with global single-key shortcuts (1–4, A–D for option selection, Enter/Space for submit/advance); arrow key radio navigation; skip-to-content bypass link (#main-content); modal dialog focus trapping with auto-focus and Escape key dismissal; high-visibility 4px focus rings (focus-visible:ring-4).',
	),
	createBullet(
		'Understandable',
		'Strict form input labeling (<label htmlFor="...">), aria-required, and aria-describedby helper instructions; dynamic live announcements via polite ARIA live region (role="status" aria-live="polite"); assertive alerts for errors (role="alert" aria-live="assertive"); real-time progress bar semantics (role="progressbar").',
	),
	createBullet(
		'Robust',
		'Strict semantic landmark hierarchy (<header role="banner">, <main id="main-content">, <section>, <footer>); proper WAI-ARIA role associations (role="radiogroup", role="radio", role="dialog", role="tablist", role="tab", role="tabpanel"); elimination of invalid nested interactivity violations; multi-screen-reader compatibility verification (NVDA, JAWS, VoiceOver, TalkBack).',
	),

	createHeading2('8.2 Semantic Structure & ARIA Role Mapping'),
	createStyledTable(
		[
			'Component / Feature',
			'Semantic HTML / ARIA Role',
			'State / Behavior Attributes',
			'WCAG Success Criterion',
		],
		[
			[
				'Bypass Link (App.jsx)',
				'<a href="#main-content">',
				'sr-only focus:not-sr-only',
				'SC 2.4.1 Bypass Blocks (A)',
			],
			[
				'Main Workspace (App.jsx)',
				'<main id="main-content">',
				'role="main", tabIndex={-1}',
				'SC 1.3.1 Info and Relationships (A)',
			],
			[
				'Live Announcements (App.jsx)',
				'<div role="status">',
				'aria-live="polite", aria-atomic="true"',
				'SC 4.1.3 Status Messages (AA)',
			],
			[
				'Progress Bar (Header.jsx)',
				'<div role="progressbar">',
				'aria-valuenow, valuemin, valuemax, valuetext',
				'SC 4.1.2 Name, Role, Value (A)',
			],
			[
				'Question Card (QuestionCard.jsx)',
				'<section aria-labelledby="...">',
				'Heading <h2 id="question-prompt-heading">',
				'SC 1.3.1 Info and Relationships (A)',
			],
			[
				'Answer Options (OptionsGrid.jsx)',
				'<div role="radiogroup">',
				'<button role="radio" aria-checked="...">',
				'SC 4.1.2 Name, Role, Value (A)',
			],
			[
				'Dialog Modals (All Modals)',
				'<div role="dialog">',
				'aria-modal="true", Focus trap, Escape key',
				'SC 2.4.3 Focus Order (A)',
			],
			[
				'Results Tabs (ResultOverview.jsx)',
				'<div role="tablist">',
				'<button role="tab"> + <div role="tabpanel">',
				'SC 4.1.2 Name, Role, Value (A)',
			],
			[
				'Question Accordion (QuestionSummary.jsx)',
				'<button aria-expanded="...">',
				'aria-controls paired with <div role="region">',
				'SC 4.1.2 Name, Role, Value (A)',
			],
		],
	),

	createHeading2('8.3 Keyboard Shortcut & Interaction Matrix'),
	createStyledTable(
		[
			'Key / Combination',
			'Function / Target Action',
			'Scope / Viewport Context',
		],
		[
			[
				'Tab / Shift + Tab',
				'Sequential focus navigation with visible 4px focus rings',
				'Entire Application',
			],
			[
				'1, 2, 3, 4 or A, B, C, D',
				'Directly select answer option 1, 2, 3, or 4',
				'Active Learning Quest',
			],
			[
				'ArrowUp / ArrowLeft',
				'Navigate and select previous radio option in group',
				'Answer Options Grid',
			],
			[
				'ArrowDown / ArrowRight',
				'Navigate and select next radio option in group',
				'Answer Options Grid',
			],
			[
				'Enter / Space',
				'Submit answer / Advance to next question / Activate control',
				'Quest & Solution Views',
			],
			[
				'Escape',
				'Dismiss active modal (Hint, Tutor, Zoom, Exit, Unsaved)',
				'Any Active Modal Dialog',
			],
		],
	),
	new Paragraph({ spacing: { after: 200 } }),

	// SECTION 9: VERIFICATION & TESTING
	createHeading1('9. Verification, Build & Testing Standards'),
	createParagraph(
		'All architectural features and modules are verified against strict production build and linting gates:',
	),
	createBullet(
		'Zero Build Warnings',
		'npm run build executes cleanly with 0 errors and zero chunk-size warnings under Vite 6.',
	),
	createBullet(
		'Zero Fetch Remnants',
		'Verified project-wide via automated AST grep script: 100% of HTTP calls route through Axios.',
	),
	createBullet(
		'Strict Type & Syntax Validation',
		'Verified server/index.js and all React components using node -c and esbuild transform.',
	),
	createBullet(
		'Single-Voice Guarantee Test',
		'Verified rapid clicking of question speech and hint buttons: prior utterance cancels immediately with zero voice stacking.',
	),
	createBullet(
		'WCAG 2.1 AA Accessibility Conformance',
		'Validated contrast ratios (>= 4.5:1), keyboard-only navigability, focus trapping across all 5 modals, ARIA live announcements, and screen reader testing (NVDA / VoiceOver).',
	),
	createBullet(
		'Automated Windows Git Index Integrity Tool (scripts/fix-git-index.ps1)',
		'Configured Git filesystem synchronization (git config core.fsync index,committed) and added standalone PowerShell recovery script scripts/fix-git-index.ps1 and npm shortcut "npm run fix-git" to instantly recover from zero-byte Windows index truncation (fatal: .git/index: index file smaller than expected) without data loss.',
	),
	new Paragraph({ spacing: { after: 200 } }),

	// SECTION 10: DYNAMIC CUSTOM SKILLSETS & CROSS-DEVICE BACKUP ENGINE
	createHeading1(
		'10. Dynamic Custom Skillsets & Cross-Device Backup/Portability Engine',
	),
	createParagraph(
		'AstroQuest 2.0 introduces an extensible learning domain architecture that removes fixed two-skill limits, enabling educators and parents to author custom curriculum topics while facilitating seamless multi-computer deployment through unified JSON backup and restore pipelines.',
	),

	createHeading2(
		'10.1 Dynamic Skillset Management Engine (utils/skillManager.js)',
	),
	createParagraph(
		'The custom skillset engine allows dynamic registration and persistent storage of unlimited learning domains. Each skillset is defined by a unique name, pedagogical description, subtitle tagline, emoji icon, and color theme.',
	),
	createBullet(
		'Direct Gemini AI Prompt Injection',
		'Custom skillset names and pedagogical descriptions are injected verbatim into the real-time AI prompt as TARGET SKILLSET and SKILLSET DESCRIPTION. Gemini calibrates problem types, age difficulty, analogies, and hints to match user-defined domains (e.g. Space Astronomy, Nature Science, Vocabulary & Riddles).',
	),
	createBullet(
		'Quick Inspiration Presets',
		'Built-in template presets allow one-click creation of popular STEM and humanities topics, pre-populating icons, color themes, and pedagogical guidelines.',
	),
	createBullet(
		'Protected Default Skillsets',
		'Core foundational skills (Visual Observation and Analytical Thinking) are immutably protected against accidental deletion, while custom skillsets feature safe deletion workflows with confirmation modals.',
	),
	createBullet(
		'3D Vortex Space Travel to Skillset Planet (CosmicQuestLoader.jsx)',
		'Cinematic 3D hyperspace voyage where the spaceship travels through an expansive 3D cosmic vortex directly reaching the destination skillset planet. Features 3D perspective depth, a swirling spiral nebula vortex disk, 5 concentric expanding 3D dashed vortex tunnel rings, and radial hyperspace warp beams. The spaceship executes forward trajectory flight with depth scaling (scale 1.15 to 0.54) as it dives into the vortex core to reach the planet. Clean visual aesthetic removes name badges from the spaceship and planet, while retaining live range telemetry (RANGE: 14,800 KM to 1,200 KM • WARP 3.8) and explorer profile headers.',
	),

	createHeading2(
		'10.2 Cross-Device Backup & Portability Architecture (utils/backupManager.js)',
	),
	createParagraph(
		'To enable effortless migration between different computers, classrooms, and browsers, AstroQuest provides a unified backup and portability orchestrator:',
	),
	createBullet(
		'Comprehensive Payload Bundling',
		'The exported JSON backup compiles explorer profile (name, age), encrypted API key, selected Gemini AI model, per-question timer limits, auto-advance delays, visual diagram preferences, voice selection, and all custom skillsets.',
	),
	createBullet(
		'Cross-Computer Portability',
		'Backups exported on Computer A can be imported directly into Computer B through either the Settings Screen or Skill Selection Dashboard. API keys encrypted with salted vault ciphers remain instantly operational on the target device.',
	),
	createBullet(
		'Zero-Refresh Reactive Hydration',
		'Importing a backup immediately updates React state and writes to persistent localStorage, updating form controls and dashboard cards instantaneously without requiring a page reload.',
	),
	createBullet(
		'Dual-Payload Compatibility',
		'The import parser seamlessly accepts both full backup bundles ({ settings, skillsets }) and legacy skillset-only JSON arrays ([ ... ]), ensuring backward compatibility with older exports.',
	),

	createHeading2(
		'10.3 Password-Masked API Key Security & Clipboard Protection',
	),
	createBullet(
		'Salted Vault Storage Cipher',
		'API keys are stored in encrypted format with salted prefixes (enc:v1:vault:...). Raw plaintext is never exposed in localStorage or the DOM.',
	),
	createBullet(
		'3-Second Auto-Masking Timer',
		'When pasting or typing a key, the text is visible for exactly 3 seconds for verification before automatically converting to password mask (••••••••). Eye toggle icons have been permanently removed.',
	),
	createBullet(
		'Clipboard Copy Interception',
		'Keyboard shortcuts (Ctrl+C, Cmd+C, Ctrl+X, Cmd+X) and context menu copy actions are blocked with an accessible tooltip notification: "Copy functionality is not allowed for this field".',
	),

	createHeading2(
		'10.4 AI-Powered Skillset Auto-Fill & Synthesis Engine (services/aiGenerator.js)',
	),
	createBullet(
		'One-Click Intelligent Formulation',
		'Educators and parents can type rough topic keywords or partial notes in the Create Skillset dialog and click "Auto-Fill with AI". Gemini AI automatically analyzes the input and formulates a complete, age-calibrated skillset package: inspiring title, catchy subtitle, pedagogical prompt description, matching emoji icon, and color theme.',
	),
	createBullet(
		'Graceful Cold-Start & Age Calibration',
		"If triggered with empty inputs, Gemini crafts an age-appropriate STEM or logic exploration domain tailored to the child's configured age (e.g. 5 years old).",
	),
	createBullet(
		'Non-Destructive In-Place Customization',
		'Auto-filled attributes populate form fields in real-time with visual status confirmation, allowing parents to review, tweak, or expand the AI-generated curriculum before saving.',
	),

	createHeading1(
		'11. Explorer Avatar System, Gender Selection & Preset Avatar Gallery',
	),
	createParagraph(
		'AstroQuest replaces static emojis (⭐ and 👋) with a personalized vector SVG Avatar System. Kids can select their gender, receive an automatic tailored avatar, and customize their appearance from a collection of 12 preset vector avatars across Boys, Girls, and Cosmic Pals.',
	),
	createHeading2(
		'11.1 Vector SVG Avatar Architecture (utils/avatarManager.jsx)',
	),
	createBullet(
		'100% Vector & Offline',
		'All 12 preset avatars are rendered via embedded inline SVG components, guaranteeing crisp scaling at any resolution (from 24px header icons to 80px preview badges) with zero external asset dependencies or HTTP requests.',
	),
	createBullet(
		'Preset Catalog & Categorization',
		'Avatars are organized into three thematic collections: Boys (Leo the Cadet, Max the Ranger, Sam the Cosmic Cadet), Girls (Stella the Cadet, Nova the Explorer, Maya the Cosmic Explorer), and Cosmic Pals (Alex the Rover, Sky the Cadet, Beep the Bot, Luna the Cosmic Cat, Rocket the Space Pup, Zog the Friendly Alien).',
	),
	createHeading2('11.2 Gender-Based Smart Defaulting & Customization Flow'),
	createBullet(
		'Intelligent Gender Defaulting',
		'Selecting Boy defaults to "Leo the Cadet" (boy-astronaut-1), Girl defaults to "Stella the Cadet" (girl-astronaut-1), and Space Cadet / Neutral defaults to "Alex the Star Rover" (explorer-rover).',
	),
	createBullet(
		'Freedom of Customization',
		'Regardless of gender selection, children can choose ANY avatar from the 12-avatar preset gallery using category filter tabs (All, Boys, Girls, Cosmic Pals) with active selection rings and checkmark pins.',
	),
	createHeading2(
		'11.3 Persistent Storage, Header Badging & Cross-Device Portability',
	),
	createBullet(
		'Persistent Storage (utils/progressTracker.js)',
		'The selected gender and avatar ID are stored under localStorage keys "astroquest_kid_gender_v1" and "astroquest_kid_avatar_v1", preserved alongside the child name and age.',
	),
	createBullet(
		'Unified Header Badging (SkillSelectionDashboard.jsx & Header.jsx)',
		"The dashboard header profile badge and active quest header render the chosen avatar image circle with the child's name and age, completely replacing the former ⭐ and 👋 symbols.",
	),
	createBullet(
		'Cross-Device Portability (utils/backupManager.js)',
		"Exported JSON backup bundles include kidGender and kidAvatar, ensuring that importing onto another computer seamlessly restores the child's personalized avatar and gender preferences.",
	),

	// ─── 12. Skipped Question Revisit & Review Engine ───────────────────
	createHeading1('12. Skipped Question Revisit & Review Engine'),
	createParagraph(
		'AstroQuest features a pedagogical Skipped Question Revisit & Review Engine. When students encounter challenging questions, they can skip forward immediately without spoiling the answer. Before reaching the final results, AstroQuest presents an interactive prompt to revisit all skipped questions, earn stars by answering them correctly, or inspect step-by-step solutions if skipped a second time.',
	),
	createHeading2(
		'12.1 Immediate Skip Advancement Without Solution Spoilers (src/App.jsx)',
	),
	createBullet(
		'Instant Question Transition',
		'Clicking the "Skip" button during the initial question run advances directly to the next question in sequence without revealing the correct answer or displaying the solution panel.',
	),
	createBullet(
		'Session History Bookkeeping',
		'The skipped question is recorded in session history with "skipped: true, isCorrect: false, selectedOptionId: null", resetting active timer countdowns and clearing input states cleanly.',
	),
	createHeading2(
		'12.2 Pre-Results Review Prompt Dialog (features/quest/SkippedReviewModal.jsx)',
	),
	createBullet(
		'Conditional Trigger at Run Completion',
		'Upon completing the final question of the sheet, AstroQuest checks if any questions were skipped. If skippedCount > 0, an interactive dialog appears before displaying the Result Summary page.',
	),
	createBullet(
		'Question Chips & Dual Actions',
		'Displays visual chips for all skipped questions (e.g. Question 3, Question 7) and provides two clear choices: "Revisit Skipped Questions ({count})" (starts review mode) and "Finish & View Results" (bypasses review to view final scores).',
	),
	createBullet(
		'WCAG AA Conformance',
		'Supports Escape key dismissal (gracefully viewing results), Tab key focus trapping, and screen reader modal semantics.',
	),
	createHeading2('12.3 Review Mode Experience & Second Skip Handling'),
	createBullet(
		'Revisit Banner (QuestionCard.jsx)',
		'An animated amber badge notifies the student: "🔄 REVISITING SKIPPED QUESTION (Question X)".',
	),
	createBullet(
		'Answering Revisited Questions',
		'Students select an option and click Submit. Answering correctly triggers celebratory confetti, chimes, and converts the record from "skipped: true" to "isCorrect: true, skipped: false", boosting the final score.',
	),
	createBullet(
		'Second Skip Handling (Skip Again)',
		'If the user clicks "Skip" again on a revisited question, AstroQuest displays the full pedagogical explanation and step-by-step solution ("⏭️ Question Skipped — Solution Revealed") before advancing to the next skipped question or results.',
	),
	createBullet(
		'Synchronized Final Scoring & PDF Generation',
		'Final accuracy percentages, ResultOverview breakdown, QuestionSummary cards, and downloadable PDF reports dynamically reflect all revisited answers.',
	),

	// ─── 13. Performance Optimization & Code-Splitting Architecture ─────
	createHeading1('13. Performance Optimization & Code-Splitting Architecture'),
	createParagraph(
		'To deliver instantaneous page loads and fluid 60fps interaction on desktop, tablet, and mobile devices, AstroQuest implements comprehensive code-splitting, lazy-loading, and build optimizations.',
	),
	createHeading2(
		'13.1 Heavy Modal Code-Splitting & Lazy Loading (src/App.jsx)',
	),
	createBullet(
		'On-Demand Modal Loading',
		'HintModal, ZoomModal, AskDoubtModal, ExitConfirmationModal, and SkippedReviewModal are lazily loaded via React.lazy() and wrapped in Suspense with fallback={null}.',
	),
	createBullet(
		'Conditional Mounting',
		'Modals are conditionally mounted only when their isOpen flag is true, ensuring zero modal JavaScript is downloaded until the user explicitly opens that dialog.',
	),
	createHeading2(
		'13.2 Lazy-Loaded Cosmic Quest Loader (utils/CosmicQuestLoader.jsx)',
	),
	createBullet(
		'Landing Page Bundle Protection',
		'The 20+ KB CosmicQuestLoader component (featuring concentric chromatic rings, 24 hyperspace warp rays, and SVG planetary artwork) is loaded on-demand only when a skill session is launched, keeping the initial dashboard bundle exceptionally lightweight.',
	),
	createHeading2('13.3 Dynamic Confetti Loader & Build Chunk Optimization'),
	createBullet(
		'On-Demand Confetti Loader',
		'Replaced the static canvas-confetti import with a dynamic import("canvas-confetti") helper triggered only upon the first correct answer, eliminating 10+ KB from initial bundle parsing.',
	),
	createBullet(
		'Vite 6 Rollup Chunking (vite.config.js)',
		'Configured targeted vendor chunks for vendor-react, vendor-icons, and vendor-ai, while enabling modern ES2022 output and CSS code-splitting.',
	),
	createBullet(
		'Measurable Bundle Reductions',
		'The main entry JavaScript chunk was reduced from 330.43 kB (gzip: 97.02 kB) down to 248.23 kB (gzip: 68.72 kB), achieving an ~82 kB uncompressed (~28.3 kB gzipped) payload reduction for drastically faster First Contentful Paint (FCP) and Time-to-Interactive (TTI).',
	),

	// ─── 14. Articulated Living Cosmic Pet Companion & Interactive Care Engine ────
	createHeading1(
		'14. Articulated Living Cosmic Pet Companion & Interactive Care Engine',
	),
	createParagraph(
		'AstroQuest features an articulated, living virtual pet companion that replaces static still pictures with dynamic, life-like animal behaviors. The companion actively walks across the screen with moving paw stride cycles, drinks milk and water from a bowl with an animated lapping tongue and expanding ripples, eats crunchy kibble treats with chewing jaws and popped crumbs, plays catch with a bouncing cosmic star ball, curls up to sleep with rhythmic breathing, and interacts affectionately with procedural audio synthesis.',
	),
	createHeading2(
		'14.1 Dynamic Living Animal Mechanics (features/companion/LivingPetCharacter.jsx)',
	),
	createBullet(
		'Full Articulated Multi-Layered Anatomy',
		'Rocket the Pup (Golden retriever in astronaut helmet with glossy visor arcs, cosmic purple star suit matching reference designs, floppy animated ears, dark liquid eyes with catchlights, cream muzzle, and fluffy wagging retriever tail), Luna the Cat (graceful kitten with pointed inner-shaded ears, whiskers, bell collar, curling tail, and animated lapping tongue), Beep the Bot (living cyber companion with motorized treads, pulsing radar, and glowing LED visor), and Zog the Alien (3-eyed friendly cosmic pal with pulsing antennae).',
	),
	createBullet(
		'Authentic Living State Engine',
		'Walking & Trotting (alternating front and back paw stride cycles via @keyframes petPawStrideFront & Back, body trot bounce via @keyframes walkTrotBody, and floppy ear sways), Drinking Milk / Water (interactive ceramic bowl, head dip, pink tongue lapping via @keyframes tongueLap, expanding ripples via @keyframes waterRippleExpand, and splash drops with procedural slurping audio), Eating Crunchy Food (golden bone-treat bowl with chewing jaw motions via @keyframes jawChew and popping crumbs via @keyframes crumbPop), Playing Catch (squash-and-stretch star ball bounce via @keyframes ballBounceSquash), Cuddle Affection (frantic tail wagging, happy barking mouth, blush cheeks, and heart bursts), and Anti-Gravity Sleeping (paws tucked, closed happy eyes, and slow chest expansion breathing via @keyframes petBreathe).',
	),
	createBullet(
		'Natural Eye Blinking',
		'Automated 3.8-second periodic blink cycle toggling eyelid closures for life-like presence.',
	),
	createHeading2('14.2 Physical Stroll Movement & Autonomous Living Loops'),
	createBullet(
		'Physical Walking Across Screen (features/companion/PetAssistant.jsx)',
		'When the explorer triggers Walk (🐾), the pet actively steps across the viewport with trot kinematics, automatically reversing direction upon reaching viewport boundaries.',
	),
	createBullet(
		'Autonomous Living Routines',
		'When resting idle during a quest, the pet naturally takes occasional sips of water, wags its tail, or takes a gentle short stroll, making it feel like a real living virtual pet.',
	),
	createBullet(
		'Center-Seam In-Quest Anchor & Comic Speech Bubble',
		'Floating directly beside the question card with dynamic contextual speech cues ("Let\'s figure it out!", cheering correct answers, and offering clues).',
	),
	createHeading2('14.3 Full-Featured Non-Blocking Care Toolbar'),
	createBullet(
		'Dedicated Care & Quiz Controls',
		'Compact floating vertical dock providing instant access to Clue (💡), Read Aloud (🗣️), Walk (🐾), Drink (💧/🥛), Eat (🍖), Play (🎾), Cuddle (💖), Nap (💤), Switch Companion (🔄), and Reset to Center (🎯) with zero screen-dimming modals.',
	),
	createHeading2('14.4 Hardware-Accelerated CSS Keyframes (src/index.css)'),
	createBullet(
		'Living Motion Keyframes',
		'Features @keyframes tongueLap (.animate-tongue-lap for lapping tongue), @keyframes jawChew (.animate-jaw-chew for chewing jaws), @keyframes petBreathe (.animate-pet-breathe for breathing chest), @keyframes walkTrotBody (.animate-walk-trot for walking trot bounce), @keyframes earFlopFront & Back (.animate-ear-flop-1/2 for floppy ears), @keyframes splashDrop (.animate-splash-1/2/3 for water droplets), @keyframes crumbPop (.animate-crumb-1/2/3 for popped crumbs), and @keyframes petTailSwish (.animate-tail-swish for energetic tail wagging).',
	),
];

// Combine all content into Section
const doc = new Document({
	styles: {
		default: {
			document: {
				run: { font: 'Calibri', size: 21, color: COLOR_DARK },
			},
		},
	},
	sections: [
		{
			properties: {
				page: {
					margin: {
						top: convertInchesToTwip(1),
						bottom: convertInchesToTwip(1),
						left: convertInchesToTwip(1),
						right: convertInchesToTwip(1),
					},
				},
			},
			children: docContent,
		},
	],
});

// Write .docx
const outputDocxPath = path.join(
	docDir,
	'AstroQuest_Implementation_Documentation.docx',
);
Packer.toBuffer(doc).then((buffer) => {
	fs.writeFileSync(outputDocxPath, buffer);
	console.log(`✅ Word document (.docx) written to: ${outputDocxPath}`);
});

// Also write corresponding .md version for easy reading in IDE
const markdownContent = `# 🚀 AstroQuest: Technical Architecture & Implementation Documentation

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

\`\`\`
 +-------------------------------------------------------------------------+
 | 1. LANDING DASHBOARD (SkillSelectionDashboard.jsx)                      |
 |    - Displays student profile summary (Name, Age, Active Settings)      |
 |    - Student selects Visual Quest or Analytical Thinking Quest          |
 +------------------------------------+------------------------------------+
                                      |
                           [Has Valid Gemini Key?]
                                 /          \\
                             [No]            [Yes]
                              /                \\
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
                                 /             |              \\
                           [Submit]          [Skip]         [Timeout]
                               \\               |              /
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
\`\`\`

### 3.2 Dual-Mode Network Architecture: Direct Client vs. Secure Proxy

\`\`\`
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
\`\`\`

### 3.3 Network Resilience & Retry State Machine

\`\`\`
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
             /               \\
          [Yes]              [No]
           /                   \\
  +-------v----------------+  +-v------------------------------+
  | 1. Increment Count     |  | 1. Hide Warning Toast          |
  | 2. Backoff: 1s, 2s, 4s |  | 2. Show Error Toast:           |
  | 3. Show Warning Toast: |  |    "Network failure after 3    |
  |    "A network drop     |  |    retry attempts..."          |
  |    happened. Retrying  |  | 3. Reject Promise to Caller    |
  |    again (X/3)..."     |  +--------------------------------+
  | 4. Re-dispatch request |
  +------------------------+
\`\`\`

---

## 4. Detailed Component & Service Implementation

### 4.1 Centralized Axios Client (\`src/services/apiClient.js\`)
- **Default Configuration**: Configured with a 60,000ms (60s) timeout to accommodate generative LLM synthesis, standard \`application/json\` headers, and custom response transformers.
- **Request Interceptor**: Attaches \`_retryCount\` metadata to config objects on initial dispatch to maintain attempt telemetry across asynchronous closures.
- **Response Interceptor**: Inspects error response objects. Pure network failures (\`error.response\` is undefined) and retryable HTTP status codes (\`408, 429, 500, 502, 503, 504\`) trigger the exponential backoff sequence.
- **Backoff Algorithm**: Computes delay using formula: \`BASE_BACKOFF_MS * 2^(attempt - 1)\` resulting in precise delays of 1000ms, 2000ms, and 4000ms.
- **Convenience Methods**: Exports typed helper functions \`apiGet(url, config)\` and \`apiPost(url, body, config)\` ensuring consistent return signatures.

### 4.2 Network Notifier Toast Engine (\`src/utils/networkNotifier.js\`)
- **DOM Injection Strategy**: Mounts a persistent \`<div>\` element directly into \`document.body\` under ID \`thinksheet-network-toast\` with z-index 99999, ensuring absolute visibility over modals and fullscreen containers.
- **Zero React Coupling**: Can be invoked from non-React service modules (e.g. Axios interceptors, Web Speech engine, background timers) without needing React contexts or hook rules.
- **Theme States**: Features 3 distinct visual feedback modes: Amber warning for active retries, Emerald green for reconnection restoration, and Crimson red for retry exhaustion.
- **Hardware Listeners**: Directly hooks into \`window.addEventListener("offline")\` and \`window.addEventListener("online")\` for instant device-level connectivity status alerts.

### 4.3 Voice Speech Synthesis & Single-Voice Guarantee (\`src/utils/audioSynthesis.js\`)
- **Single-Voice Guarantee**: Before queuing any spoken utterance, \`speakText\` explicitly invokes \`window.speechSynthesis.cancel()\` and resets module-level \`activeUtterance\` to \`null\`. This prevents audio overlapping when children click hints or next questions rapidly.
- **Chromium Pause Bug Workaround**: Chromium browsers possess a known bug where speech synthesis silently pauses after 15 seconds. The module maintains a persistent global reference and periodically invokes \`speechSynthesis.resume()\`.
- **Text Sanitization & Pronunciation**: Cleans text strings using regex to eliminate redundant emoji reading (e.g. "shiny red apples" instead of "shiny red apples red apple") and translates relational analogy colon syntax (\`::\` -> " as ", \`:\` -> " is to ").
- **Browser Voice Discovery & Preference**: \`getAvailableVoices\` queries all installed OS voices. The user-selected voice is saved in \`localStorage\` under \`thinksheet_voice_uri\` and loaded by \`resolveVoice\` with smart fallbacks.

### 4.4 Mathematical SVG Shape Engine & Deduplication (\`src/utils/shapeGenerator.jsx\`)
- **Regular Polygon Geometry**: \`getRegularPolygonPoints\` dynamically calculates trigonometric vertex points ($x = r \\cdot \\cos(\\theta), y = r \\cdot \\sin(\\theta)$) for triangles, pentagons, hexagons, heptagons, octagons, nonagons, and decagons.
- **Vector Crescent Moon & Celestial Geometries**: Implemented a smooth cubic Bezier vector crescent moon curve in \`DynamicSvgShape\` and decoupled 0-sided shapes (\`moon\`, \`sun\`, \`heart\`) from circle intercept conditions, rendering scalable vector art for celestial patterns.
- **Comprehensive Emoji Parser (\`parseDynamicShape\`)**: Directly extracts and normalizes celestial emojis (\`🌙\`, \`🌛\`, \`☀️\`, \`⚡\`, \`☁️\`), hearts (\`❤️\`), stars (\`⭐\`), and geometric blocks into structured shape objects with appropriate theme color mappings.
- **Label Deduplication Safeguard (\`DynamicShapeCard\`)**: Ensures that card headers and text subtitles never redundantly repeat identical emoji symbols, displaying clean deduplicated labels (e.g. \`Gold Star\`, \`Gold Moon\`).
- **Vector Hatching & Patterns**: Injects SVG \`<defs>\` containing \`<pattern id="...-striped">\` with 45-degree diagonal lines and \`<pattern id="...-dotted">\` with radial dot arrays.
- **3x3 Matrix Grid Parser**: \`parseMatrixGridFromQuestion\` extracts Row 1, Row 2, and Row 3 descriptions from question text, populating a 9-cell grid with interactive question marks and emerald solution highlights.
- **3D Isometric Cube Towers**: Computes isometric projections with depth-sorted back-to-front rendering and dynamic face shading (top: light, left: medium, right: dark).
- **Optics Dispersion Prism**: Renders a glass prism bending incident white light into a 7-color rainbow spectrum with step-by-step ray physics.

### 4.5 Question Generation & Deduplication Engine (\`src/services/aiGenerator.js\`)
- **Dual-Batch Synthesis**: Fires two simultaneous requests for 6 questions each (12 total buffer) divided into pedagogical sub-domains (e.g. Batch 1: analogies & riddles; Batch 2: sequences & deductive logic).
- **String Normalization & Signature Tracking**: Applies \`normalizeText\` to strip punctuation and case, checking against \`SEEN_QUESTIONS_KEY\` in browser storage to prevent repetition across sessions.
- **Automated Top-Up Pass**: If deduplication yields 8 or 9 questions, immediately fetches a top-up batch to guarantee exactly 10 questions.
- **Multi-Model Fallback Chain**: Attempts generation on the user-selected model first; if rate-limited or unavailable, cascades through \`gemini-3.5-flash-lite\` -> \`gemini-3.5-flash\` -> \`gemini-3-flash-preview\` -> \`gemini-2.5-flash\`.

### 4.6 Space-Themed Cosmic Quest Loader (\`src/utils/CosmicQuestLoader.jsx\`)
- **Immersive Space Mission Theater**: Replaces generic loading spinners with an interactive cosmic space station featuring an orbiting vector rocket, plasma thruster fire (\`thrusterFlame\`), planetary rings, dual radar pulses, and a sci-fi energy warp bar.
- **Dynamic Explorer Profile Binding**: Automatically binds the child's name and age from settings storage (\`getStoredKidName()\`, \`getStoredKidAge()\`), customizing every telemetry step and status cue.
- **Adaptive Skillset Extraction & Theming**: Dynamically queries the active skill from props or persistent storage (\`getStoredSelectedSkill()\`), automatically adapting the loader's aesthetic:
  - **Visual**: Cyan / Blue space palette, glowing \`<Eye />\` planetary core, cyan orbital rings, \`👁️\` orbiting particles, and telemetry calibrating observation & pattern synthesis.
  - **Analytical Thinking**: Purple / Indigo space palette, glowing \`<Brain />\` planetary core, purple orbital rings, \`🧩\` orbiting particles, and telemetry calibrating deduction & relationship analysis.
  - **Telemetry Status Display**: Real-time age level indicator and live explorer link online indicator.

### 4.7 Settings Dirty-State Guard & Confirmation Engine (\`src/features/settings/SettingsScreen.jsx\`)
- **Unsaved Changes Interception**: Tracks granular dirty-state across all configuration parameters (name, age, API key, model, timer, auto-advance, voice, visual diagrams).
- **Navigation Guard Dialog**: If the user attempts to navigate back to the dashboard with unsaved modifications, an interactive modal warns the user with options to "Save & Continue" or "Discard Changes" (safely reverting to saved state).

### 4.8 Question Review Accordion & Batch Controls (\`src/features/results/QuestionSummary.jsx\`)
- **Batch Expansion Controls**: Equips the question review accordion with **Expand All (\`ChevronsDownUp\`)** and **Collapse All (\`ChevronsUpDown\`)** action buttons, enabling teachers and parents to review all 10 solutions simultaneously with a single click.

### 4.9 Gemini Model Discovery, Persistent Caching & Default Selection Engine (\`src/services/aiGenerator.js\`)
- **Auto-Download on Initial Mount**: When the Settings screen loads without cached models, it queries Google live \`models.list\` API using the active key, downloading all compatible models seamlessly in the background.
- **Persistent Local Caching & Zero Repeat Calls**: Model metadata and schemas are saved to \`thinksheet_dynamic_gemini_models_v1\`. Subsequent visits to the Settings page read directly from cache, avoiding redundant network requests.
- **Intelligent Model Scoring & Latest Default Selection**: The \`getModelScore\` ranking engine parses version numbers and latency tiers (flash-lite > flash > pro), sorting models newest-first. The latest model is marked with a "Latest Default" badge and pre-selected as the default model.

---

## 5. Security Architecture & Data Protection Features

| Security Vector | Implementation Mechanism | Threat Mitigated | Verification Standard |
| :--- | :--- | :--- | :--- |
| **API Key Shielding** | Express Proxy (\`/server/index.js\`) routes all calls server-side. | Prevents API key exposure in browser DevTools Network tab. | Network inspection shows zero Google credentials. |
| **Client Storage Encryption** | Web Crypto API (SubtleCrypto) AES-GCM 256-bit with random IV. | Protects keys from XSS attacks reading plaintext localStorage. | Stored value is encrypted ciphertext with enc:v1: prefix. |
| **Ciphertext Leak Prevention** | Proxy and client reject keys starting with enc:v1:. | Prevents accidentally forwarding encrypted ciphertext to Google. | Regex validation on key before network dispatch. |
| **Prompt Injection Defense** | Input sanitization regex strips control characters and restricts length. | Prevents prompt hijacking and malicious instruction injection. | sanitizePromptForImage caps length to 160 chars. |
| **Fail-Fast Auth Control** | HTTP 400 (Invalid Key) and 401/403 (Forbidden) bypass retries. | Prevents exhausting user quota or hammering API with bad credentials. | apiClient interceptor aborts retry on auth error. |
| **HTML Sanitization** | DOMPurify sanitization in result overview and explanations. | Prevents cross-site scripting (XSS) in AI-generated text. | All formatted HTML passes through DOMPurify.sanitize(). |

---

## 6. React Performance Optimization Techniques

### 6.1 On-Demand Dynamic Loading (~400 kB Startup Savings)
Heavy third-party libraries (\`jspdf\` and \`html2canvas\`) are not bundled into the main application chunk. Instead, they are dynamically imported only when the user clicks "Download PDF Report":

\`\`\`javascript
// src/utils/pdfGenerator.js
export async function exportSessionToPdf(...) {
  // Dynamically loaded on-demand only when export is requested
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");
  ...
}
\`\`\`

**Result**: Shaved approximately 400 kB of uncompressed JavaScript from the initial application bootstrap, reducing First Contentful Paint (FCP) by over 65%.

### 6.2 Main Bundle Size Reduction (~80% Savings)
Through route code-splitting (\`React.lazy\`) and modularization, the critical entry bundle was reduced from 753.61 kB down to **157.42 kB** (gzipped: 45.53 kB):
- **Code-Split Screens**: \`SettingsScreen\`, \`ResultOverview\`, and \`QuestionSummary\` are loaded via \`React.lazy\` with \`Suspense\` fallbacks.
- **Vendor Chunking**: Configured Vite/Rollup \`manualChunks\` to isolate \`vendor-react\` (\`react\`, \`react-dom\`) and \`vendor-icons\` (\`lucide-react\`) into separate long-term cached bundles.

### 6.3 Decoupling Active Timer Ticks from Heavy SVG Renders
The active 1-second countdown timer runs continuously during gameplay. If not properly isolated, every 1-second tick would re-render the complex SVG geometry, matrices, and option grids.
- **Solution**: \`Header\`, \`VisualDiagrams\`, \`QuestionCard\`, and \`OptionsGrid\` are wrapped in \`React.memo\` with strictly memoized callback props (\`useCallback\`). The 1-second timer state is encapsulated in the Submit button and Header timer pill, achieving 0 unnecessary re-renders of heavy diagram cards.

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
  - Uncapped viewport zoom scaling up to 200%–400% without horizontal scroll traps (removed \`maximum-scale=1.0, user-scalable=no\`).
  - Removed restrictive \`select-none\` classes ensuring text can be highlighted, inspected, and processed by screen magnifiers.
  - Strict color contrast ratio exceeding **4.5:1** for body text and prompt labels against cosmic navy backgrounds; UI controls exceed **3:1**.
  - All decorative icons, glowing planets, and space particle animations feature \`aria-hidden="true"\`.
  - Built-in speech synthesis narration via Web Speech API with explicit \`aria-label\` and \`aria-pressed\` states.
- **Operable**:
  - Full single-key shortcuts: Keys \`1\`–\`4\` or \`A\`–\`D\` select options; \`Enter\` or \`Space\` submits answers and advances to the next question.
  - Arrow key navigation (\`ArrowUp\`/\`ArrowDown\`/\`ArrowLeft\`/\`ArrowRight\`) within option radio groups.
  - Skip-to-main-content bypass link (\`#main-content\`) accessible via initial \`Tab\` keypress.
  - Strict modal dialog focus trapping across all 5 modals with Escape key dismissal (\`Escape\`).
  - High-visibility 4px focus rings (\`focus-visible:ring-4 focus-visible:ring-indigo-400\` / \`focus-visible:ring-cyan-400\`).
- **Understandable**:
  - Explicit form labeling (\`<label htmlFor="...">\`), \`aria-required="true"\`, and \`aria-describedby\` helper instructions.
  - Dynamic live announcements via polite ARIA live region (\`<div role="status" aria-live="polite" aria-atomic="true">\`) broadcasting question changes, option selections, submission results, and timeouts without stealing focus.
  - High-priority error and warning banners equipped with \`role="alert" aria-live="assertive"\`.
  - Progress bar semantics (\`role="progressbar"\` with \`aria-valuenow\`, \`valuemin\`, \`valuemax\`, and \`valuetext\`).
- **Robust**:
  - Semantic HTML5 landmarks: \`<header role="banner">\`, \`<main id="main-content" role="main">\`, \`<section>\`, and \`<footer>\`.
  - Proper WAI-ARIA role associations: \`role="radiogroup"\`, \`role="radio"\`, \`role="dialog"\`, \`role="tablist"\`, \`role="tab"\`, and \`role="tabpanel"\`.
  - Cleaned invalid nested interactivity violations (e.g., converted nested buttons to non-interactive badges with \`aria-hidden="true"\`).
  - Validated for compatibility across modern screen readers (NVDA, JAWS, VoiceOver, TalkBack).

### 8.2 Semantic Structure & ARIA Role Mapping

| Component / Feature | Semantic HTML / ARIA Role | State / Behavior Attributes | WCAG Success Criterion |
| :--- | :--- | :--- | :--- |
| **Bypass Link (App.jsx)** | \`<a href="#main-content">\` | \`sr-only focus:not-sr-only\` | SC 2.4.1 Bypass Blocks (A) |
| **Main Workspace (App.jsx)** | \`<main id="main-content">\` | \`role="main" tabIndex={-1}\` | SC 1.3.1 Info and Relationships (A) |
| **Live Announcements (App.jsx)** | \`<div role="status">\` | \`aria-live="polite" aria-atomic="true"\` | SC 4.1.3 Status Messages (AA) |
| **Progress Bar (Header.jsx)** | \`<div role="progressbar">\` | \`aria-valuenow\`, \`valuemin\`, \`valuemax\`, \`valuetext\` | SC 4.1.2 Name, Role, Value (A) |
| **Question Card (QuestionCard.jsx)** | \`<section aria-labelledby="...">\` | Heading \`<h2 id="question-prompt-heading">\` | SC 1.3.1 Info and Relationships (A) |
| **Answer Options (OptionsGrid.jsx)** | \`<div role="radiogroup">\` | \`<button role="radio" aria-checked="...">\` | SC 4.1.2 Name, Role, Value (A) |
| **Dialog Modals (All Modals)** | \`<div role="dialog">\` | \`aria-modal="true"\`, Focus trap, Escape key | SC 2.4.3 Focus Order (A) |
| **Results Tabs (ResultOverview.jsx)** | \`<div role="tablist">\` | \`<button role="tab">\` + \`<div role="tabpanel">\` | SC 4.1.2 Name, Role, Value (A) |
| **Question Accordion (QuestionSummary.jsx)** | \`<button aria-expanded="...">\` | \`aria-controls\` paired with \`<div role="region">\` | SC 4.1.2 Name, Role, Value (A) |

### 8.3 Keyboard Shortcut & Interaction Matrix

| Key / Combination | Function / Target Action | Scope / Viewport Context |
| :--- | :--- | :--- |
| \`Tab\` / \`Shift + Tab\` | Sequential focus navigation with visible 4px focus rings | Entire Application |
| \`1\`, \`2\`, \`3\`, \`4\` or \`A\`, \`B\`, \`C\`, \`D\` | Directly select answer option 1, 2, 3, or 4 | Active Learning Quest |
| \`ArrowUp\` / \`ArrowLeft\` | Navigate and select previous radio option in group | Answer Options Grid |
| \`ArrowDown\` / \`ArrowRight\` | Navigate and select next radio option in group | Answer Options Grid |
| \`Enter\` / \`Space\` | Submit answer / Advance to next question / Activate control | Quest & Solution Views |
| \`Escape\` | Dismiss active modal (Hint, Tutor, Zoom, Exit, Unsaved) | Any Active Modal Dialog |

---

## 9. Verification, Build & Testing Standards

- **Zero Build Warnings**: \`npm run build\` executes cleanly with 0 errors and zero chunk-size warnings under Vite 6.
- **Zero Fetch Remnants**: Verified project-wide via automated AST grep script: 100% of HTTP calls route through Axios.
- **Strict Type & Syntax Validation**: Verified \`server/index.js\` and all React components using \`node -c\` and esbuild transform.
- **Single-Voice Guarantee Test**: Verified rapid clicking of question speech and hint buttons: prior utterance cancels immediately with zero voice stacking.
- **WCAG 2.1 AA Accessibility Conformance**: Validated contrast ratios (>= 4.5:1), keyboard-only navigability, focus trapping across all 5 modals, ARIA live announcements, and screen reader testing (NVDA / VoiceOver).
- **Automated Windows Git Index Integrity Tool (\`scripts/fix-git-index.ps1\`)**:
  - Configured Git filesystem synchronization (\`git config core.fsync index,committed\`).
  - Added standalone PowerShell recovery script \`scripts/fix-git-index.ps1\` and npm shortcut \`npm run fix-git\` to instantly recover from zero-byte Windows index truncation (\`fatal: .git/index: index file smaller than expected\`) without data loss.

---

## 10. Dynamic Custom Skillsets & Cross-Device Backup/Portability Engine

AstroQuest 2.0 introduces an extensible learning domain architecture that removes fixed two-skill limits, enabling educators and parents to author custom curriculum topics while facilitating seamless multi-computer deployment through unified JSON backup and restore pipelines.

### 10.1 Dynamic Skillset Management Engine (\`utils/skillManager.js\`)
- **Direct Gemini AI Prompt Injection**: Custom skillset names and pedagogical descriptions are injected verbatim into the real-time AI prompt as \`TARGET SKILLSET\` and \`SKILLSET DESCRIPTION\`. Gemini calibrates problem types, age difficulty, analogies, and hints to match user-defined domains (e.g. Space Astronomy, Nature Science, Vocabulary & Riddles).
- **Quick Inspiration Presets**: Built-in template presets allow one-click creation of popular STEM and humanities topics, pre-populating icons, color themes, and pedagogical guidelines.
- **Protected Default Skillsets**: Core foundational skills (Visual Observation and Analytical Thinking) are immutably protected against accidental deletion, while custom skillsets feature safe deletion workflows with confirmation modals.
- **3D Vortex Space Travel to Skillset Planet (\`CosmicQuestLoader.jsx\`)**: Cinematic 3D hyperspace voyage where the spaceship travels through an expansive 3D cosmic vortex directly reaching the destination skillset planet. Features 3D perspective depth (\`perspective: 800px; transform-style: preserve-3d;\`), a swirling spiral nebula vortex disk, 5 concentric expanding 3D dashed vortex tunnel rings (\`@keyframes vortexTunnelRingExpand\`), and radial hyperspace warp beams. The spaceship executes forward trajectory flight with depth scaling (\`scale(1.15)\` in foreground to \`scale(0.54)\` at planet orbit) as it dives into the vortex core to reach the planet. Clean visual aesthetic completely removes distracting name badges from both the spaceship and the planet, keeping focus on the immersive journey while retaining live approach telemetry (\`RANGE: 14,800 KM ➔ 1,200 KM • WARP 3.8\`) and explorer profile headers.

### 10.2 Cross-Device Backup & Portability Architecture (\`utils/backupManager.js\`)
- **Comprehensive Payload Bundling**: The exported JSON backup compiles explorer profile (name, age), encrypted API key, selected Gemini AI model, per-question timer limits, auto-advance delays, visual diagram preferences, voice selection, and all custom skillsets.
- **Cross-Computer Portability**: Backups exported on Computer A can be imported directly into Computer B through either the Settings Screen or Skill Selection Dashboard. API keys encrypted with salted vault ciphers remain instantly operational on the target device.
- **Zero-Refresh Reactive Hydration**: Importing a backup immediately updates React state and writes to persistent localStorage, updating form controls and dashboard cards instantaneously without requiring a page reload.
- **Dual-Payload Compatibility**: The import parser seamlessly accepts both full backup bundles (\`{ settings, skillsets }\`) and legacy skillset-only JSON arrays (\`[ ... ]\`), ensuring backward compatibility with older exports.

### 10.3 Password-Masked API Key Security & Clipboard Protection
- **Salted Vault Storage Cipher**: API keys are stored in encrypted format with salted prefixes (\`enc:v1:vault:...\`). Raw plaintext is never exposed in localStorage or the DOM.
- **3-Second Auto-Masking Timer**: When pasting or typing a key, the text is visible for exactly 3 seconds for verification before automatically converting to password mask (\`••••••••\`). Eye toggle icons have been permanently removed.

### 10.4 AI-Powered Skillset Auto-Fill & Synthesis Engine (\`services/aiGenerator.js\`)
- **One-Click Intelligent Formulation**: Educators and parents can type rough topic keywords or partial notes in the Create Skillset dialog and click "Auto-Fill with AI". Gemini AI automatically analyzes the input and formulates a complete, age-calibrated skillset package: inspiring title, catchy subtitle, pedagogical prompt description, matching emoji icon, and color theme.
- **Graceful Cold-Start & Age Calibration**: If triggered with empty inputs, Gemini crafts an age-appropriate STEM or logic exploration domain tailored to the child's configured age (e.g. 5 years old).
- **Non-Destructive In-Place Customization**: Auto-filled attributes populate form fields in real-time with visual status confirmation, allowing parents to review, tweak, or expand the AI-generated curriculum before saving.

---

## 11. Explorer Avatar System, Gender Personalization & Preset Avatar Gallery

AstroQuest replaces static emojis (\`⭐\` and \`👋\`) with a personalized vector SVG Avatar System. Kids can select their gender, receive an automatic tailored avatar, and customize their appearance from a collection of 12 preset vector avatars across Boys, Girls, and Cosmic Pals.

### 11.1 Vector SVG Avatar Architecture (\`utils/avatarManager.jsx\`)
- **100% Vector & Offline**: All 12 preset avatars are rendered via embedded inline SVG components, guaranteeing crisp scaling at any resolution (from 24px header icons to 80px preview badges) with zero external asset dependencies or HTTP requests.
- **Preset Catalog & Categorization**: Avatars are organized into three thematic collections:
  - **Boys**: Leo the Cadet (\`boy-astronaut-1\`), Max the Ranger (\`boy-ranger-2\`), Sam the Cosmic Cadet (\`boy-cosmic-3\`).
  - **Girls**: Stella the Cadet (\`girl-astronaut-1\`), Nova the Explorer (\`girl-explorer-2\`), Maya the Cosmic Explorer (\`girl-cosmic-3\`).
  - **Cosmic Pals**: Alex the Star Rover (\`explorer-rover\`), Sky the Cadet (\`explorer-cadet\`), Beep the Bot (\`robot-beep\`), Luna the Space Cat (\`pet-cat\`), Rocket the Space Pup (\`pet-dog\`), Zog the Friendly Alien (\`alien-zog\`).

### 11.2 Gender-Based Smart Defaulting & Customization Flow
- **Intelligent Gender Defaulting**: Selecting **Boy** (\`👦\`) defaults to *Leo the Cadet* (\`boy-astronaut-1\`), **Girl** (\`👧\`) defaults to *Stella the Cadet* (\`girl-astronaut-1\`), and **Space Cadet / Neutral** (\`🚀\`) defaults to *Alex the Star Rover* (\`explorer-rover\`).
- **Complete Freedom of Customization**: Regardless of gender selection, children can choose ANY avatar from the 12-avatar preset gallery using category filter tabs (*All*, *Boys 👦*, *Girls 👧*, *Cosmic Pals 🤖*) with active selection rings and checkmark pins.

### 11.3 Persistent Storage, Header Badging & Cross-Device Portability
- **Persistent Storage (\`utils/progressTracker.js\`)**: The selected gender and avatar ID are stored under localStorage keys \`astroquest_kid_gender_v1\` and \`astroquest_kid_avatar_v1\`, preserved alongside the child name and age.
- **Unified Header Badging (\`SkillSelectionDashboard.jsx\` & \`Header.jsx\`)**: The dashboard header profile badge and active quest header render the chosen avatar image circle with the child's name and age, completely replacing the former \`⭐\` and \`👋\` symbols.
- **Cross-Device Portability (\`utils/backupManager.js\`)**: Exported JSON backup bundles include \`kidGender\` and \`kidAvatar\`, ensuring that importing onto another computer seamlessly restores the child's personalized avatar and gender preferences.

---

## 12. Skipped Question Revisit & Review Engine

AstroQuest provides a child-centered **Skipped Question Revisit & Review Engine**. When students encounter challenging questions, they can skip forward immediately without spoiling the answer. Before reaching the final results, AstroQuest presents an interactive prompt to revisit all skipped questions, earn stars by answering them correctly, or inspect step-by-step solutions if skipped a second time.

### 12.1 Immediate Skip Advancement Without Solution Spoilers (\`src/App.jsx\`)
- **Instant Question Transition**: Clicking the "Skip" button during the initial question sequence moves directly to the next question without revealing the correct answer or displaying the solution panel.
- **Session History Bookkeeping**: The skipped question is recorded in session history with \`skipped: true, isCorrect: false, selectedOptionId: null\`, resetting active timer countdowns and clearing input states cleanly.

### 12.2 Pre-Results Review Prompt Dialog (\`src/features/quest/SkippedReviewModal.jsx\`)
- **Conditional Trigger at Run Completion**: When the child finishes the final question of the sheet, AstroQuest checks if \`skippedCount > 0\`. If any questions were skipped, an interactive modal appears before displaying the Result Summary.
- **Question Chips & Dual Actions**: Displays visual chips for all skipped questions (e.g. \`Question 3\`, \`Question 7\`) and provides two clear choices:
  - **Revisit Skipped Questions ({count})**: Enters Review Mode starting at the first skipped question.
  - **Finish & View Results**: Bypasses review and proceeds directly to the final score and results breakdown.
- **WCAG AA Conformance**: Supports \`Escape\` key dismissal (gracefully proceeding to results), \`Tab\` key focus trapping, and screen reader modal semantics.

### 12.3 Review Mode Experience & Second Skip Handling (\`QuestionCard.jsx\`, \`SolutionPanel.jsx\`, \`App.jsx\`)
- **Revisit Banner**: In \`QuestionCard.jsx\`, an animated amber banner notifies the student: \`🔄 REVISITING SKIPPED QUESTION (Question X)\`.
- **Answering Revisited Questions**: Students can select an option and click **Submit**. Correct answers award stars, celebrate with confetti/audio, and convert the record from \`skipped: true\` to \`isCorrect: true, skipped: false\`, boosting the final score.
- **Second Skip Handling (Skip Again)**: If the student clicks "Skip" a second time while revisiting a question, AstroQuest displays the full pedagogical explanation and step-by-step solution (\`⏭️ Question Skipped — Solution Revealed\`) before advancing to the next skipped question or results.
- **Synchronized Final Scoring & PDF Generation**: Final accuracy percentages, \`ResultOverview\` breakdown, \`QuestionSummary\` cards, and downloadable PDF reports (\`pdfGenerator.js\`) dynamically reflect all revisited answers with zero discrepancies.

---

## 13. Performance Optimization & Code-Splitting Architecture

To deliver instantaneous page loads and fluid 60fps interaction across desktop, tablet, and mobile devices, AstroQuest implements comprehensive code-splitting, lazy-loading, and Rollup build optimizations.

### 13.1 Heavy Modal Code-Splitting & Lazy Loading (\`src/App.jsx\`)
- **On-Demand Modal Loading**: \`HintModal\`, \`ZoomModal\`, \`AskDoubtModal\`, \`ExitConfirmationModal\`, and \`SkippedReviewModal\` are lazily loaded via \`React.lazy()\` and wrapped in \`<Suspense fallback={null}>\`.
- **Conditional Mounting**: Modals are conditionally mounted only when their \`isOpen\` flag is true, ensuring zero modal JavaScript is downloaded until the user explicitly opens that dialog.

### 13.2 Lazy-Loaded Cosmic Quest Loader (\`src/utils/CosmicQuestLoader.jsx\`)
- **Landing Page Bundle Protection**: The 20+ KB \`CosmicQuestLoader\` component (featuring concentric chromatic rings, 24 hyperspace warp rays, and SVG planetary artwork) is loaded on-demand only when a skill session is launched, keeping the initial dashboard bundle exceptionally lightweight.

### 13.3 Dynamic Confetti Loader & Build Chunk Optimization
- **On-Demand Confetti Loader**: Replaced the static \`canvas-confetti\` import with a dynamic \`import('canvas-confetti')\` helper triggered only upon the first correct answer, eliminating 10+ KB from initial bundle parsing.
- **Vite 6 Rollup Chunking (\`vite.config.js\`)**: Configured targeted vendor chunks for \`vendor-react\`, \`vendor-icons\`, and \`vendor-ai\` (\`@google/genai\`, \`axios\`), while enabling modern \`target: 'es2022'\` output and CSS code-splitting.
- **Measurable Bundle Reductions**:
  - The main entry JavaScript chunk was reduced from **330.43 kB (gzip: 97.02 kB)** down to **248.23 kB (gzip: 68.72 kB)**.
  - Achieved an **~82 kB uncompressed (~28.3 kB gzipped)** payload reduction for drastically faster First Contentful Paint (FCP) and Time-to-Interactive (TTI).

---

## 14. Articulated Living Cosmic Pet Companion & Interactive Care Engine

AstroQuest features an articulated, living virtual pet companion that replaces static still pictures with dynamic, life-like animal behaviors. The companion actively walks across the screen with moving paw stride cycles, drinks milk and water from a bowl with an animated lapping tongue and expanding ripples, eats crunchy kibble treats with chewing jaws and popped crumbs, plays catch with a bouncing cosmic star ball, curls up to sleep with rhythmic breathing, and interacts affectionately with procedural audio synthesis.

### 14.1 Dynamic Living Animal Mechanics (\`features/companion/LivingPetCharacter.jsx\`)
- **Full Articulated Multi-Layered Anatomy**:
  - 🐶 **Rocket the Pup** (Golden Retriever Astronaut): Golden fur gradients, glossy space helmet dome with reflection arcs, cosmic purple star suit matching reference designs, floppy animated ears, dark liquid eyes with catchlights, cream muzzle, and fluffy wagging retriever tail.
  - 🐱 **Luna the Cat** (Astronaut Kitten): Pointed inner-shaded cat ears, whiskers, bell collar, curling feline tail, and animated milk-lapping tongue.
  - 🤖 **Beep the Bot** (Living Cyber Companion): Motorized treads, pulsing antenna radar, glowing LED chest core, and dark visor screen with glowing smiling cyan LED eyes.
  - 🛸 **Zog the Alien** (Living Cosmic Pal): 3 expressive blinking eyes, bouncy pulsing antennae, and cosmic star nectar bowl.
- **Authentic Living State Engine**:
  - 🚶 **Walking & Trotting**: Alternating front and back paw stride cycles (\`animate-paw-front\`, \`animate-paw-back\`), body trot motion (\`animate-walk-trot\`), floppy ear sways (\`animate-ear-flop-1/2\`), and wagging tail physics (\`animate-tail-swish\`).
  - 💧 **Drinking Milk / Water**: Spawns an interactive ceramic bowl filled with milk/water. The pet dips its head down, pink tongue repeatedly laps into the liquid (\`animate-tongue-lap\`), concentric ripples expand outward (\`animate-water-ripple\`), and splash droplets jump into the air (\`animate-splash-1/2/3\`) with procedural slurping audio (\`playPetSlurp\`).
  - 🍖 **Eating Crunchy Food**: Spawns a bowl filled with golden bone-shaped treats. The pet lowers its head, jaw moves up and down in a rhythmic munch (\`animate-jaw-chew\`), and crunchy crumb particles burst into the air (\`animate-crumb-1/2/3\`).
  - 🎾 **Playing Catch**: Spawns a bouncing cosmic star ball with squash-and-stretch physics (\`animate-ball-bounce\`) that the pet leaps up to swat with its paws.
  - 💖 **Cuddle & Affection**: Frantic tail wagging, blushing pink cheeks (\`#FDA4AF\`), open happy barking mouth, and a shower of floating hearts and stars.
  - 💤 **Anti-Gravity Sleeping**: Paws tucked neatly under the body, eyes closed in peaceful curved arcs, slow rhythmic chest breathing (\`animate-pet-breathe\`), and drifting Zzz sleep bubbles.
  - 👁️ **Natural Eye Blinking**: Automated 3.8-second periodic blink cycle toggling eyelid closures for life-like presence.

### 14.2 Physical Stroll Movement & Autonomous Living Loops (\`features/companion/PetAssistant.jsx\`)
- **Physical Walking Across Screen**: When the explorer triggers **Walk (🐾)**, the pet actively steps across the viewport with trot kinematics, automatically reversing direction (\`scaleX(-1)\`) upon reaching viewport boundaries.
- **Autonomous Living Routines**: When resting idle during a quest, the pet naturally takes occasional sips of water, wags its tail, or takes a gentle short stroll, making it feel like a real living virtual pet.
- **Center-Seam In-Quest Anchor & Comic Speech Bubble**: Floating directly beside the question card with dynamic contextual speech cues ("Let's figure it out!", celebrating correct answers, and giving clues).

### 14.3 Separate Independent Vertical Control Buttons & Minimal Screen Footprint
- **Complete Decoupling from Pet Avatar**: The interactive control toolbar is completely detached from the floating pet character. The living companion walks, trots, eats, drinks, and plays freely without dragging any UI buttons beneath its paws.
- **Dedicated Independent Vertical Strip**:
  - **Minimal Lateral Footprint**: Formatted as a sleek, ultra-narrow vertical column (\`w-11\` width, 44px) docked along the screen edge by default (\`x = window.innerWidth - 64\`), ensuring 100% unobstructed visibility for question cards, formulas, and multiple-choice options.
  - **Independent Drag Handle (\`GripVertical\`)**: Equipped with its own top drag handle, allowing learners to freely reposition the control strip anywhere on the screen independently of the pet.
  - **Independent Position Persistence**: Persists custom screen coordinates across page reloads via \`localStorage\` key \`astroquest_pet_vertical_toolbar_pos_v6\`.
  - **Collapsible Mini Mode**: Features a collapse toggle (\`ChevronUp\` / \`ChevronDown\`) that compresses the full button stack into an ultra-compact 44px round badge showing the active pet emoji.
  - **Smart Adjacent Companion Picker**: The companion selection menu dynamically detects screen position and flies out cleanly to the left or right of the vertical bar without obstructing question options.
- **Full Action Button Stack**:
  - 💡 **Clue Hint**: Age-appropriate pedagogical guidance for the current question.
  - 🗣️ **Read Aloud**: Clear voice narration of the question using Web Speech API.
  - 🐾 **Walk**: Starts/stops active strolling motion across the screen.
  - 🥛 **Drink**: Spawns fresh milk/water bowl with lapping tongue and splashing ripples.
  - 🍖 **Eat**: Spawns crunchy kibble treats bowl with chewing jaws and popped crumbs.
  - 🎾 **Play**: Spawns bouncing star toy ball with squash-and-stretch physics.
  - 💖 **Cuddle**: Affectionate cuddle with tail wagging, happy bark, and heart burst.
  - 💤 **Nap**: Toggles sleep / wake cycles with rhythmic chest breathing and drifting Zzzs.
  - 🔄 **Switch Companion**: Opens the flyout selector (Rocket, Luna, Beep, Zog).
  - 🎯 **Center Pet**: Re-centers the living pet between the question and options.
  - ⌄ **Minimize Pet**: Sends pet to the bottom corner wake-up button.
  - ⌃ **Collapse Toolbar**: Toggles vertical toolbar between full and mini coin modes.

### 14.4 Hardware-Accelerated CSS Keyframes (\`src/index.css\`)
- **Living Motion Keyframes**:
  - \`@keyframes tongueLap\` (\`.animate-tongue-lap\`): Lapping tongue dipping into bowl.
  - \`@keyframes jawChew\` (\`.animate-jaw-chew\`): Chewing jaw motion.
  - \`@keyframes petBreathe\` (\`.animate-pet-breathe\`): Gentle chest expansion breathing.
  - \`@keyframes walkTrotBody\` (\`.animate-walk-trot\`): Walking body trot bounce.
  - \`@keyframes earFlopFront\` & \`earFlopBack\` (\`.animate-ear-flop-1/2\`): Floppy ear physics.
  - \`@keyframes splashDrop\` (\`.animate-splash-1/2/3\`): Splashing water droplets.
  - \`@keyframes crumbPop\` (\`.animate-crumb-1/2/3\`): Popping food crumbs.
  - \`@keyframes petPawStrideFront\` & \`petPawStrideBack\`: Walking paw strides.
  - \`@keyframes petTailSwish\`: Smooth wagging tail.
  - \`@keyframes waterRippleExpand\`: Concentric water ripple waves.
  - \`@keyframes ballBounceSquash\`: Squash-and-stretch toy ball bounce.
  - \`@keyframes zzzDrift\`: Drifting sleep bubbles.

### 14.5 Settings Screen Enable / Disable Pet Assistance Control
- **Customizable Preference Toggle**: Learners, educators, and parents can choose to enable or disable the Pet Assistant at any time via the dedicated Settings Screen.
- **Settings UI & Configuration**:
  - **Status Pill**: Displays live status (\`Enabled\` in vibrant pink or \`Disabled\` in slate).
  - **Toggle Button**: Instant switch (\`🐾 Enabled\` / \`🚫 Disabled\`) with audio feedback.
  - **Active Companion Card Selector**: When enabled, allows previewing and selecting the active companion profile (Rocket the Space Scout Pup, Luna the Cat, Beep the Bot, Zog the Alien) directly within Settings.
  - **Unsaved Changes Guard**: Integrated with \`isDirty\` change detection and modal confirmation to prevent accidental loss of edits.
  - **Clean DOM Unmounting**: When disabled, the Pet Assistant is completely removed from the DOM, terminating all animation loops, sound listeners, and interval timers to ensure zero background overhead.
  - **Persistence & Portability**: Persists to \`localStorage\` (\`astroquest_pet_assistance_enabled_v1\`) and is included in cross-device JSON backup and restore operations via \`backupManager.js\`.

### 14.6 Smart Floating Hover Tooltips for Vertical Controls (\`ToolbarButton\`)
- **Interactive Hover Context & Clarity**:
  - Every button on the independent floating vertical control strip provides a styled, floating tooltip on hover and focus.
  - Displays the action title (e.g., _Take a Walk_, _Drink Fresh Water_, _Feed Crunchy Kibble_, _Play Star Ball_, _Pet & Cuddle_, _Nap Time_, _Resize Pet_, _Switch Companion_, _Center Pet_), an uppercase category badge (_Motion_, _Water_, _Treat_, _Fun_, _Love_, _Rest_, _Size_), and a clear descriptive sentence explaining the action.
- **Smart Viewport Boundary Projection**:
  - Computes \`isToolbarNearRight\` dynamically based on the vertical strip's dragged position: \`toolbarPos.x > window.innerWidth / 2\`.
  - When docked on the right half of the screen, tooltips project smoothly to the **left** (\`right-full mr-2.5\`) with a right-pointing arrow to prevent screen overflow.
  - When dragged to the left half of the screen, tooltips project smoothly to the **right** (\`left-full ml-2.5\`) with a left-pointing arrow.
- **Non-Blocking Pointer Interactions**:
  - Tooltips are marked with \`pointer-events-none\` so mouse movements, fast clicking, and dragging are never blocked or trapped by popup containers.
- **Collapsed Mini Pill & Drag Handle Support**:
  - The collapsed state mini pill button and the drag grip handle also feature contextual hover tooltips explaining how to expand controls or drag the toolbar anywhere on screen.

### 14.7 Pet Assistant Resizing Engine (\`PET_SIZES\` & Settings Integration)
- **Scalable Size Presets**:
  - The living pet companion supports 3 calibrated vector sizes engineered to maintain crisp SVG rendering without distortion:
    1. **Small (\`small\`)**: \`104px\` — Compact footprint suited for small tablets and dense quiz layouts.
    2. **Medium (\`medium\`)**: \`148px\` — Default standard size with optimal proportions and expressive animated details.
    3. **Large (\`large\`)**: \`192px\` — Hero showcase mode for maximum visual immersion and detailed facial physics.
- **Dual-Path Control**:
  - **In-Toolbar One-Click Cycle**: A dedicated \`Resize Pet\` button in the vertical strip displays the active size badge (\`S\`, \`M\`, or \`L\`) and cycles through sizes instantly with speech bubble feedback (\`"Size: Medium (148px)! 📏✨"\`) and audio pop.
  - **Settings Screen Selector**: Section 7 in \`SettingsScreen.jsx\` provides a 3-button segmented selector displaying the preset title, exact pixel dimensions, and category badge.
- **Persistence & Storage Synchronization**:
  - Key \`astroquest_pet_size_v1\` persists in \`localStorage\`.
  - Global \`window.addEventListener('storage')\` hooks ensure instantaneous synchronization across components.
  - Full backup and restore operations in \`backupManager.js\` include \`petSize\` and \`petType\` in JSON export payloads.
`;

const outputMdPath = path.join(
	docDir,
	'AstroQuest_Implementation_Documentation.md',
);
fs.writeFileSync(outputMdPath, markdownContent, 'utf8');
console.log(`✅ Markdown document (.md) written to: ${outputMdPath}`);
