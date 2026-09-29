/**
 * Explicit Skillset Definitions, Pedagogical Descriptions, and Distinct Batch Domains
 * 
 * Implements SOLID Single Responsibility:
 * Central pedagogical definitions and curriculum objectives for core skills.
 */
export const SKILL_DEFINITIONS = {
	Visual: {
		title: 'Visual Observation & Spatial Reasoning',
		description:
			'Visual observation, recognizing geometric and color pattern progressions, spatial rotations, object counting and arithmetic groupings, missing grid tiles, 3D isometric block projections, and balance scale weight logic.',
		coreObjective:
			'The student must observe, count, compare, or deduce patterns and spatial relationships from visual descriptions or diagram representations.',
		batch1Domain:
			'Batch 1 Focus: (1) Shape & color pattern progressions (e.g. AB, AAB, ABC sequences or number progressions), (2) Missing grid tile matrix deduction, (3) Balance scale weight logic.',
		batch2Domain:
			'Batch 2 Focus: (1) Object counting & arithmetic grouping puzzles, (2) 3D isometric block tower heights & volumes, (3) Spatial reflections, symmetry, or rotations.',
	},
	'Analytical Thinking': {
		title: 'Analytical Thinking & Logical Deduction',
		description:
			'Logical deduction, relational analogies (A : B :: C : D), everyday cause-and-effect science & nature riddles, categorical classification (odd-one-out), deductive logic clues, syllogisms, and multi-step critical thinking.',
		coreObjective:
			'The student must analyze relationships, deduce outcomes from logical rules, connect concepts through analogies, or classify items based on defined properties.',
		batch1Domain:
			'Batch 1 Focus: (1) Relational & functional analogies (A : B :: C : D), (2) Everyday cause-and-effect science & nature riddles.',
		batch2Domain:
			'Batch 2 Focus: (1) Multi-step deductive logic clues & riddles, (2) Categorical classification (odd-one-out), (3) Sequence rules and conditional reasoning.',
	},
};

export default SKILL_DEFINITIONS;
