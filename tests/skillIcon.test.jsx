import { describe, expect, it } from 'vitest';
import { POPULAR_ICONS } from '../src/constants';
import { ICON_MAP, SkillIcon } from '../src/utils/SkillIcon';

describe('SkillIcon Component & Constants', () => {
	it('defines at least 20 curated vector font icons in POPULAR_ICONS', () => {
		expect(POPULAR_ICONS.length).toBeGreaterThanOrEqual(20);
		POPULAR_ICONS.forEach((item) => {
			expect(item.id).toBeTruthy();
			expect(item.label).toBeTruthy();
			// Each item id should resolve to a valid Lucide icon component in ICON_MAP
			expect(ICON_MAP[item.id]).toBeDefined();
		});
	});

	it('maps legacy educational emojis to corresponding Lucide vector icons', () => {
		const emojis = [
			'🚀',
			'🪐',
			'🧠',
			'👁️',
			'🔬',
			'📐',
			'🌿',
			'⭐',
			'🧩',
			'🎨',
			'📚',
			'⚡',
			'💡',
			'🐾',
			'🎯',
			'🔢',
			'🤖',
			'🌍',
			'🧪',
		];
		emojis.forEach((emoji) => {
			expect(ICON_MAP[emoji]).toBeDefined();
		});
	});

	it('renders as a valid React component function', () => {
		expect(typeof SkillIcon).toBe('object'); // React.memo component
	});

	it('renders valid VisualDiagram with moon and star pattern matching question', async () => {
		const VisualDiagram = (await import('../src/utils/VisualDiagrams')).default;
		const ReactDOMServer = (await import('react-dom/server')).default;
		const React = (await import('react')).default;

		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(VisualDiagram, {
				type: 'pattern-shapes',
				data: {
					sequence: ['🌙', '⭐', '🌙', '⭐'],
					nextItem: '🌙',
					questionText:
						'What shape comes next in the pattern? ⭐\n🌙 ⭐ 🌙 ⭐ ?',
				},
			}),
		);
		expect(html).toContain('Moon');
		expect(html).toContain('Star');
		// Ensure crescent SVG arc path is rendered
		expect(html).toMatch(/M\s*[\d.]+\s+[\d.]+\s+A/i);
	});

	it('renders ZoomModal with responsive max-w-4xl width, fit controls, and zero scrollbars', async () => {
		const ZoomModal = (await import('../src/utils/ZoomModal')).default;
		const ReactDOMServer = (await import('react-dom/server')).default;
		const React = (await import('react')).default;

		const html = ReactDOMServer.renderToStaticMarkup(
			React.createElement(ZoomModal, {
				isOpen: true,
				diagramType: 'pattern-shapes',
				diagramData: {
					sequence: ['🌙', '⭐', '🌙', '⭐'],
					nextItem: '🌙',
					questionText: 'What shape comes next in the pattern? ⭐\n🌙 ⭐ 🌙 ⭐ ?',
				},
				onClose: () => {},
				soundEnabled: false,
			})
		);

		expect(html).toContain('Close-up Diagram View');
		expect(html).toContain('max-w-4xl');
		expect(html).toContain('overflow-hidden');
		expect(html).toContain('Fit');
		expect(html).toContain('Done Looking ✨');
	});
});
