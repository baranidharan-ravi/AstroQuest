/**
 * AstroQuest AI Generator Facade
 * 
 * Implements SOLID Interface Segregation & Facade Pattern:
 * Decomposed into specialized services under `src/services/ai/`:
 * - `aiConfig.js`: Provider credentials, models, dynamic caching, rate-limit scoring.
 * - `skillDefinitions.js`: Skill pedagogical descriptions and core learning objectives.
 * - `curatedSkillsets.js`: Non-repeating random skillset topic banks & AI topic suggestion.
 * - `socraticTutor.js`: Socratic AI tutor guided by Cosmo without giving away answers.
 * - `diagramSynchronizer.js`: Geometric synchronization & visual diagram validation.
 * - `questionParser.js`: Resilient JSON cleaning, options formatting, age-calibrated pedagogy.
 * - `aiImageGenerator.js`: Multi-provider image synthesis and prompt sanitization.
 * - `questionSynthesizer.js`: Parallel batch question synthesis & space expedition campaigns.
 * 
 * All exports are preserved 100% backwards-compatible for all existing consumers.
 */

export * from './ai';
export { default } from './ai';
