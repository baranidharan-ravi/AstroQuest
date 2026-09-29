/**
 * shapeGenerator.jsx
 * 
 * Implements SOLID Single Responsibility:
 * Central facade re-exporting procedural SVG shapes, sequence extractors,
 * and pattern card components from modular domain files in src/utils/shapes/.
 */

export { default as DynamicShapeCard } from './shapes/DynamicShapeCard';
export { default as DynamicSvgShape } from './shapes/DynamicSvgShape';
export { default as ShapeClusterCard } from './shapes/ShapeClusterCard';
export {
	extractShapeSequenceTerms,
	getRegularPolygonPoints,
	hasShapeOrVisualConcept,
	parseDynamicShape,
	parseMatrixGridFromQuestion,
	parseRotationSequence,
	parseStepShapeCountSequence,
} from './shapes/shapeParsers';
