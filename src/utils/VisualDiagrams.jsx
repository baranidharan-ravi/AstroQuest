import React, { memo } from 'react';
import { CELESTIAL_IMAGE_CATALOG } from '../constants';
import {
	AnalogyMapDiagram,
	AppleCountingDiagram,
	CauseEffectDiagram,
	CelestialPhotographyCard,
	getConceptVisual,
	GridTilesDiagram,
	isDiagramAppropriateForQuestion,
	IsometricTowerDiagram,
	LazyVisualImage,
	MatrixGridDiagram,
	OddOneOutDiagram,
	OpticsPrismDiagram,
	render3DIsoCube,
	ScaleBalanceDiagram,
	SequenceLadderDiagram,
	ShapeClusterProgressionDiagram,
	ShapeSequenceDiagram,
	SpatialRotationDiagram,
} from './diagrams';

// Re-export all utility functions and subcomponents for 100% backwards-compatibility
export {
	CelestialPhotographyCard,
	getConceptVisual,
	isDiagramAppropriateForQuestion,
	LazyVisualImage,
	render3DIsoCube,
};

/**
 * VisualDiagram Orchestrator Component
 * 
 * Implements SOLID Open/Closed & Single Responsibility Principles:
 * Dispatches question diagram specifications to their specialized renderers.
 */
export const VisualDiagram = memo(function VisualDiagram({
	type,
	data = {},
	isSolution = false,
}) {
	if (!type || !data) return null;

	const qText = data.questionText || data.question || '';
	if (!isDiagramAppropriateForQuestion(type, data, qText)) {
		return null;
	}

	// 0. Curated Real NASA / JWST Deep Space Celestial Imagery
	if (type === 'celestial_photo' || data?.celestialImage) {
		const photoData =
			data?.celestialImage ||
			CELESTIAL_IMAGE_CATALOG.find((item) =>
				item.keywords.some((kw) => qText.toLowerCase().includes(kw)),
			);
		if (photoData) {
			return <CelestialPhotographyCard image={photoData} />;
		}
	}

	if (type === 'image' || data?.imageUrl || data?.src) {
		const imgSrc = data?.imageUrl || data?.src || '';
		return (
			<LazyVisualImage
				src={imgSrc}
				alt={data?.alt || 'Question Diagram'}
				caption={data?.caption}
				onError={data?.onError}
			/>
		);
	}

	// 1. Dedicated Physics & Optics: Light Dispersion through Glass Prism
	if (type === 'optics-prism') {
		return <OpticsPrismDiagram isSolution={isSolution} />;
	}

	// 2. Growing Multi-Shape Cluster / Triangular Number Progression
	if (
		type === 'shape-pattern-grid' ||
		data.isShapeCluster ||
		(Array.isArray(data.steps) && data.steps[0]?.count !== undefined)
	) {
		return (
			<ShapeClusterProgressionDiagram
				data={data}
				isSolution={isSolution}
			/>
		);
	}

	// 3. Spatial Rotation & Quadrant Progression
	if (type === 'shape-rotation' || data.isRotationSequence || data.isQuadrant) {
		return (
			<SpatialRotationDiagram
				data={data}
				isSolution={isSolution}
			/>
		);
	}

	// 4. True 3D Isometric Block Pyramid & Cube Structure
	if (type === 'block-tower' || type === 'isometric-tower') {
		return (
			<IsometricTowerDiagram
				data={data}
				isSolution={isSolution}
			/>
		);
	}

	// 5. Shape & Color Sequence Progressions
	if (type === 'shape-sequence' || type === 'pattern-shapes') {
		return (
			<ShapeSequenceDiagram
				data={data}
				isSolution={isSolution}
			/>
		);
	}

	// 6. Cognitive & Concept Diagrams
	switch (type) {
		case 'analogy-map':
			return (
				<AnalogyMapDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		case 'odd-one-out':
			return (
				<OddOneOutDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		case 'cause-effect':
			return (
				<CauseEffectDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		case 'sequence-ladder':
			return (
				<SequenceLadderDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		case 'matrix-grid':
			return (
				<MatrixGridDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		case 'grid-tiles':
			return (
				<GridTilesDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		case 'apple-counting':
			return (
				<AppleCountingDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		case 'scale-balance':
			return (
				<ScaleBalanceDiagram
					data={data}
					isSolution={isSolution}
				/>
			);

		default:
			return null;
	}
});

export default VisualDiagram;
