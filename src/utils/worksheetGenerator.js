import { jsPDF } from 'jspdf';
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
 * Generates and downloads a clean, printer-friendly (black & white ink-saving)
 * cosmic worksheet with bubble-in answers and an answer key on the final page.
 */
export function generatePrintableWorksheet({
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

	let y = margin;

	// Draw Header
	doc.setLineWidth(0.8);
	doc.rect(margin, y, contentWidth, 26);

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(16);
	doc.text('ASTROQUEST: COSMIC MISSION WORKSHEET', margin + 6, y + 8);

	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.text(
		`Mission: ${cleanPdfText(title)} (${cleanPdfText(skillName)})`,
		margin + 6,
		y + 14,
	);

	doc.text(
		`Explorer: ____________________ (Age ${studentAge})`,
		margin + 6,
		y + 21,
	);
	doc.text(
		`Date: ____________   Score: _____ / ${questionsToPrint.length}`,
		margin + 115,
		y + 21,
	);

	y += 34;

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

		// Options Grid (2x2 or list)
		const options = q.options || [];
		doc.setFontSize(9);

		options.forEach((opt) => {
			const optText = cleanPdfText(opt.text || '');
			// Bubble circle for kid to fill in with pencil
			doc.circle(margin + 6, y - 1, 2.5);
			doc.setFont('helvetica', 'bold');
			doc.text(`(${opt.id})`, margin + 10, y);
			doc.setFont('helvetica', 'normal');
			doc.text(optText, margin + 18, y);
			y += 6;
		});

		y += 6; // Spacing before next question
	});

	// Final Page: Parent & Flight Director Answer Key
	doc.addPage();
	y = margin;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	doc.text('MISSION CONTROL: ANSWER KEY & HINTS', margin, y + 6);
	doc.setLineWidth(0.4);
	doc.line(margin, y + 9, margin + contentWidth, y + 9);
	y += 16;

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

	// Save the PDF
	const filename = `AstroQuest_Worksheet_${skillName.replace(/\s+/g, '_')}.pdf`;
	doc.save(filename);
}
