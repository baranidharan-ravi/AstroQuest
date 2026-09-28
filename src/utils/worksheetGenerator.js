import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { CURRICULUM_STANDARDS } from '../constants';
import { DEFAULT_OFFLINE_QUESTIONS } from '../services/offlinePackService';

function cleanPdfText(text) {
	if (!text) return '';
	return String(text)
		.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
		.replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Returns matching curriculum standards (NGSS and CCSS Math) for a given skill or topic.
 */
export function getMatchingStandardsForSkill(skillName = '') {
	const term = String(skillName).toLowerCase();
	const matches = [];
	const all = [
		...(CURRICULUM_STANDARDS.ngss || []),
		...(CURRICULUM_STANDARDS.ccssMath || []),
	];

	all.forEach((std) => {
		if (
			std.skills.some((s) => term.includes(s) || s.includes(term)) ||
			term.includes(std.domain.toLowerCase()) ||
			term.includes(std.label.toLowerCase())
		) {
			matches.push(std);
		}
	});

	if (matches.length === 0) {
		// Provide foundational standards fallback
		matches.push(CURRICULUM_STANDARDS.ngss[0]);
		matches.push(CURRICULUM_STANDARDS.ccssMath[0]);
	}
	return matches.slice(0, 3);
}

/**
 * Generates an SVG/PNG Data URL for the dynamic Scan-to-Play QR code.
 */
export async function generateQrDataUrl(url) {
	try {
		return await QRCode.toDataURL(url, {
			width: 140,
			margin: 1,
			color: {
				dark: '#0f172a',
				light: '#ffffff',
			},
		});
	} catch (err) {
		console.warn('QR code generation failed, proceeding without stamp:', err);
		return null;
	}
}

/**
 * Generates and downloads a clean, printer-friendly (black & white ink-saving)
 * cosmic worksheet with bubble-in answers, scan-to-play QR code launcher,
 * curriculum alignment tags, and answer key on the final page.
 */
export async function generatePrintableWorksheet({
	title = 'Cosmic Explorer Worksheet',
	skillName = 'Visual & Logic Quests',
	studentName = 'Captain Explorer',
	studentAge = 5,
	questions = [],
} = {}) {
	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4',
	});

	const questionsToPrint =
		questions.length > 0 ? questions : DEFAULT_OFFLINE_QUESTIONS.slice(0, 8);

	const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
	const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
	const margin = 18;
	const contentWidth = pageWidth - margin * 2;
	const matchingStandards = getMatchingStandardsForSkill(skillName);

	// Construct dynamic deep-link for scan-to-play launch
	const origin =
		typeof window !== 'undefined' && window.location?.origin ?
			window.location.origin
		:	'https://astroquest.app';
	const launchUrl = `${origin}/?skill=${encodeURIComponent(
		skillName,
	)}&age=${studentAge}&source=worksheet`;

	const qrDataUrl = await generateQrDataUrl(launchUrl);

	let y = margin;

	// Draw Header with Scan-to-Play QR Box
	const headerHeight = 30;
	doc.setLineWidth(0.8);
	doc.rect(margin, y, contentWidth, headerHeight);

	const qrSize = 21;
	const qrX = margin + contentWidth - qrSize - 3;
	const qrY = y + 2.5;

	if (qrDataUrl) {
		doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
		doc.setFontSize(6.5);
		doc.setFont('helvetica', 'bold');
		doc.text('Scan to Play Online', qrX - 1, qrY + qrSize + 3);
	}

	const textMaxWidth = qrDataUrl ? contentWidth - qrSize - 10 : contentWidth - 8;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	doc.text('ASTROQUEST: COSMIC MISSION WORKSHEET', margin + 5, y + 7);

	doc.setFontSize(9.5);
	doc.setFont('helvetica', 'normal');
	doc.text(
		`Mission: ${cleanPdfText(title)} (${cleanPdfText(skillName)})`,
		margin + 5,
		y + 13,
		{ maxWidth: textMaxWidth },
	);

	doc.text(
		`Explorer: ____________________ (Age ${studentAge})`,
		margin + 5,
		y + 19,
	);
	doc.text(
		`Date: ____________  Score: ___/${questionsToPrint.length}`,
		margin + 5,
		y + 25,
	);

	// Print curriculum tags
	const stdString = matchingStandards.map((s) => s.code).join(' | ');
	doc.setFont('helvetica', 'italic');
	doc.setFontSize(7.5);
	doc.text(`Standards: ${stdString}`, margin + 78, y + 25, {
		maxWidth: textMaxWidth - 74,
	});

	y += headerHeight + 8;

	// Loop through questions (3-4 questions per page)
	questionsToPrint.forEach((q, idx) => {
		// Check if need new page
		if (y > pageHeight - 55) {
			doc.addPage();
			y = margin;
		}

		// Question Box
		doc.setFillColor(248, 249, 250);
		doc.rect(margin, y, contentWidth, 8, 'F');
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(11);
		doc.text(`Challenge ${idx + 1}:`, margin + 3, y + 6);

		y += 12;

		// Question Text
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(10);
		const prompt = cleanPdfText(q.question || q.questionText || '');
		const splitPrompt = doc.splitTextToSize(prompt, contentWidth - 6);
		doc.text(splitPrompt, margin + 3, y);
		y += splitPrompt.length * 5 + 4;

		// Options Grid (bubble circles for kid to fill in)
		const options = q.options || [];
		doc.setFontSize(9);

		options.forEach((opt) => {
			const optText = cleanPdfText(opt.text || '');
			doc.circle(margin + 6, y - 1, 2.5);
			doc.setFont('helvetica', 'bold');
			doc.text(`(${opt.id})`, margin + 10, y);
			doc.setFont('helvetica', 'normal');
			doc.text(optText, margin + 18, y);
			y += 6;
		});

		y += 6; // Spacing before next question
	});

	// Final Page: Parent & Flight Director Answer Key & Curriculum Checklist
	doc.addPage();
	y = margin;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	doc.text('MISSION CONTROL: ANSWER KEY & CURRICULUM CHECKLIST', margin, y + 6);
	doc.setLineWidth(0.4);
	doc.line(margin, y + 9, margin + contentWidth, y + 9);
	y += 15;

	doc.setFontSize(9);
	questionsToPrint.forEach((q, idx) => {
		doc.setFont('helvetica', 'bold');
		doc.text(
			`Challenge ${idx + 1}: Correct Answer is (${q.correctAnswerId})`,
			margin,
			y,
		);
		y += 4.5;
		doc.setFont('helvetica', 'italic');
		const sol = cleanPdfText(q.solutionText || q.hint || 'Check visual clues.');
		const splitSol = doc.splitTextToSize(`Explanation: ${sol}`, contentWidth);
		doc.text(splitSol, margin, y);
		y += splitSol.length * 4.5 + 4;
	});

	// Standards Mastery Checklist Section
	if (y > pageHeight - 65) {
		doc.addPage();
		y = margin;
	}

	y += 4;
	doc.setFillColor(243, 244, 246);
	doc.rect(margin, y, contentWidth, 7, 'F');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10);
	doc.text('CURRICULUM STANDARDS & COMPETENCY MASTERY CHECKLIST', margin + 3, y + 5);
	y += 12;

	doc.setFontSize(8.5);
	matchingStandards.forEach((std) => {
		doc.rect(margin + 2, y - 3, 3.5, 3.5); // Checkbox
		doc.setFont('helvetica', 'bold');
		doc.text(`[   ] ${std.code} (${std.domain}): ${std.label}`, margin + 8, y);
		y += 4.5;
		doc.setFont('helvetica', 'normal');
		const splitDesc = doc.splitTextToSize(std.description, contentWidth - 10);
		doc.text(splitDesc, margin + 8, y);
		y += splitDesc.length * 4 + 3;
	});

	// Save the PDF
	const filename = `AstroQuest_Worksheet_${skillName.replace(/\s+/g, '_')}.pdf`;
	doc.save(filename);
}
