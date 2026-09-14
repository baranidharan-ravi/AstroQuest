import { jsPDF } from 'jspdf';

/**
 * Strips unsupported emojis or complex unicode surrogates so PDF text renders cleanly
 */
function cleanPdfText(text) {
	if (!text) return '';
	return String(text)
		.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // Remove 4-byte emojis
		.replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, '') // Keep standard printable Latin-1
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Generates and downloads a complete, fully expanded PDF report of the Thinksheet session.
 * The layout matches the Question Summary page with all 10 questions and answers fully expanded.
 */
export function exportSessionToPdf(sessionData, customFilename) {
	const {
		studentName = 'Explorer',
		studentAge = 5,
		selectedSkill = 'Visual',
		sheetNumber = 1,
		date = new Date().toLocaleDateString(),
		scorePercent = 0,
		correctCount = 0,
		totalQuestions = 10,
		questions = [],
		history = [],
	} = sessionData || {};

	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4',
	});

	const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
	const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
	const marginX = 14;
	const contentWidth = pageWidth - marginX * 2; // 182mm
	let currentY = 14;

	// Calculate counts
	const skippedCount = history.filter((h) => h && h.skipped).length;
	const incorrectCount = totalQuestions - correctCount - skippedCount;

	// Helper to check space & auto-add page
	const ensureSpace = (neededHeight) => {
		if (currentY + neededHeight > pageHeight - 16) {
			doc.addPage();
			currentY = 16;
			return true;
		}
		return false;
	};

	// ==========================================
	// 1. UNIFIED HEADER BANNER WITH INTEGRATED SCORE & PERFORMANCE STATS
	// ==========================================
	const headerHeight = 36;
	doc.setFillColor(21, 24, 76); // Dark Cosmic Navy (#15184C)
	doc.roundedRect(marginX, currentY, contentWidth, headerHeight, 3, 3, 'F');

	// Row 1: Title & Score
	doc.setTextColor(255, 255, 255);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(13.5);
	doc.text('ASTROQUEST - SESSION REPORT', marginX + 6, currentY + 7.5);

	// Score in top right of header
	doc.setFontSize(11);
	doc.setFont('helvetica', 'bold');
	doc.setTextColor(254, 240, 138); // Soft Gold (#FEF08A)
	doc.text(
		`Score: ${correctCount}/${totalQuestions} (${scorePercent}%)`,
		pageWidth - marginX - 6,
		currentY + 7.5,
		{ align: 'right' },
	);

	// Row 2: Student & Skill Details
	doc.setFontSize(9);
	doc.setFont('helvetica', 'bold');
	doc.setTextColor(147, 197, 253); // Light Blue (#93C5FD)
	doc.text(
		`Student: ${cleanPdfText(studentName)} (Age ${studentAge})`,
		marginX + 6,
		currentY + 14.5,
	);

	doc.setFont('helvetica', 'normal');
	doc.setTextColor(203, 213, 225); // Slate 300
	doc.text(
		`Skill: ${cleanPdfText(selectedSkill)}   |   Sheet #${sheetNumber}`,
		pageWidth - marginX - 6,
		currentY + 14.5,
		{ align: 'right' },
	);

	// Row 3: Date & Time Taken
	doc.setFontSize(8);
	doc.setFont('helvetica', 'normal');
	doc.setTextColor(148, 163, 184); // Slate 400
	doc.text(
		`Date & Time Taken: ${cleanPdfText(date)}`,
		marginX + 6,
		currentY + 20.5,
	);

	// Row 4: Performance Badges (Correct, Wrong, Skipped)
	let badgeX = marginX + 6;
	const badgeY = currentY + 24.5;
	const badgeHeight = 7.5;

	// 1. Correct Pill (Green color alone)
	doc.setFillColor(220, 252, 231); // #DCFCE7
	doc.setDrawColor(34, 197, 94); // #22C55E
	doc.roundedRect(badgeX, badgeY, 26, badgeHeight, 1.8, 1.8, 'FD');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8);
	doc.setTextColor(21, 128, 61); // #15803D
	doc.text(`${correctCount} Correct`, badgeX + 13, badgeY + 5, {
		align: 'center',
	});
	badgeX += 29;

	// 2. Wrong Pill (Red color alone)
	const safeWrongCount = Math.max(0, incorrectCount);
	doc.setFillColor(254, 226, 226); // #FEE2E2
	doc.setDrawColor(244, 63, 94); // #F43F5E
	doc.roundedRect(badgeX, badgeY, 26, badgeHeight, 1.8, 1.8, 'FD');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8);
	doc.setTextColor(190, 18, 60); // #BE123C
	doc.text(`${safeWrongCount} Wrong`, badgeX + 13, badgeY + 5, {
		align: 'center',
	});
	badgeX += 29;

	// 3. Skipped Pill (Amber color alone)
	doc.setFillColor(254, 243, 199); // #FEF3C7
	doc.setDrawColor(245, 158, 11); // #F59E0B
	doc.roundedRect(badgeX, badgeY, 26, badgeHeight, 1.8, 1.8, 'FD');
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8);
	doc.setTextColor(180, 83, 9); // #B45309
	doc.text(`${skippedCount} Skipped`, badgeX + 13, badgeY + 5, {
		align: 'center',
	});

	currentY += headerHeight + 6;

	// ==========================================
	// 3. FULLY EXPANDED QUESTIONS LIST
	// ==========================================
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(11);
	doc.setTextColor(30, 41, 59);
	doc.text('QUESTIONS & ANSWERS BREAKDOWN', marginX, currentY);
	currentY += 4;

	questions.forEach((q, idx) => {
		const userResult = history[idx] || {};
		const isCorrect = userResult.isCorrect;
		const isSkipped = userResult.skipped;
		const isTimedOut = userResult.timedOut;

		const userOption = (q.options || []).find(
			(o) => o.id === userResult.selectedOptionId,
		);
		const correctOption = (q.options || []).find(
			(o) => o.id === q.correctAnswerId,
		);

		// Determine status styling
		let statusBg = [255, 241, 242]; // Rose 50
		let statusBorder = [244, 63, 94]; // Rose 500
		let statusText = [159, 18, 57]; // Rose 900

		if (isCorrect) {
			statusBg = [236, 253, 245]; // Emerald 50
			statusBorder = [16, 185, 129]; // Emerald 500
			statusText = [6, 95, 70]; // Emerald 800
		} else if (isSkipped) {
			statusBg = [254, 243, 199]; // Amber 50
			statusBorder = [245, 158, 11]; // Amber 500
			statusText = [146, 64, 14]; // Amber 800
		} else if (isTimedOut) {
			statusBg = [254, 242, 242];
			statusBorder = [239, 68, 68];
			statusText = [153, 27, 27];
		}

		// Prepare question text and options lines
		const questionPrompt = cleanPdfText(q.question || q.questionText || '');
		doc.setFontSize(10);
		doc.setFont('helvetica', 'bold');
		const promptLines = doc.splitTextToSize(questionPrompt, contentWidth - 12);
		const promptHeight = promptLines.length * 4.8;

		// Options list lines (with selection and correctness state)
		const optionItems = (q.options || []).map((opt) => {
			const isUserPick = opt.id === userResult.selectedOptionId;
			const isRight = opt.id === q.correctAnswerId;
			return {
				id: opt.id,
				text: `${opt.id}. ${cleanPdfText(opt.text)}`,
				isUserPick,
				isRight,
			};
		});

		doc.setFontSize(8.5);
		doc.setFont('helvetica', 'normal');
		const optionsHeight = optionItems.length * 6.2;

		// Solution text lines
		const explanationText = cleanPdfText(q.solutionText || q.solution || '');
		const explanationLines =
			explanationText ?
				doc.splitTextToSize(explanationText, contentWidth - 14)
			:	[];
		const explanationHeight =
			explanationLines.length > 0 ? explanationLines.length * 4.2 + 10 : 0;

		// Total required height for this question card
		const cardPadding = 26;
		const totalCardHeight =
			promptHeight + optionsHeight + 14 + explanationHeight + cardPadding;

		// Ensure space on page
		ensureSpace(totalCardHeight);

		// Draw Outer Card Container
		doc.setFillColor(255, 255, 255);
		doc.setDrawColor(226, 232, 240); // Slate 200
		doc.roundedRect(
			marginX,
			currentY,
			contentWidth,
			totalCardHeight,
			3,
			3,
			'FD',
		);

		// Top Card Status Header Bar (Color alone, no status label before question)
		doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
		doc.setDrawColor(statusBorder[0], statusBorder[1], statusBorder[2]);
		doc.roundedRect(
			marginX + 2,
			currentY + 2,
			contentWidth - 4,
			8.5,
			2,
			2,
			'FD',
		);

		doc.setFont('helvetica', 'bold');
		doc.setFontSize(9);
		doc.setTextColor(statusText[0], statusText[1], statusText[2]);
		doc.text(
			`Question ${idx + 1} of ${totalQuestions}   |   Category: ${cleanPdfText(q.category || selectedSkill)}`,
			marginX + 6,
			currentY + 7.5,
		);

		let innerY = currentY + 16;

		// Draw Question Text
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(9.5);
		doc.setTextColor(15, 23, 42); // Dark slate
		doc.text(promptLines, marginX + 6, innerY);
		innerY += promptHeight + 2.5;

		// Draw Options List with Color Highlights for User Pick & Correct Answer
		optionItems.forEach((opt) => {
			if (opt.isUserPick && opt.isRight) {
				// User picked correctly: Emerald Green
				doc.setFillColor(236, 253, 245); // Emerald 50
				doc.setDrawColor(34, 197, 94); // Emerald 500
				doc.roundedRect(
					marginX + 6,
					innerY - 3.4,
					contentWidth - 12,
					5.4,
					1.2,
					1.2,
					'FD',
				);
				doc.setTextColor(21, 128, 61); // Emerald 700
				doc.setFont('helvetica', 'bold');
			} else if (opt.isUserPick && !opt.isRight) {
				// User picked wrong: Rose/Red
				doc.setFillColor(255, 241, 242); // Rose 50
				doc.setDrawColor(244, 63, 94); // Rose 500
				doc.roundedRect(
					marginX + 6,
					innerY - 3.4,
					contentWidth - 12,
					5.4,
					1.2,
					1.2,
					'FD',
				);
				doc.setTextColor(190, 24, 93); // Rose 700
				doc.setFont('helvetica', 'bold');
			} else if (opt.isRight) {
				// Correct Answer (not picked by user): Emerald Green
				doc.setFillColor(240, 253, 244); // Green 50
				doc.setDrawColor(74, 222, 128); // Green 400
				doc.roundedRect(
					marginX + 6,
					innerY - 3.4,
					contentWidth - 12,
					5.4,
					1.2,
					1.2,
					'FD',
				);
				doc.setTextColor(22, 101, 52); // Green 800
				doc.setFont('helvetica', 'bold');
			} else {
				// Other choices: Neutral slate
				doc.setFillColor(248, 250, 252); // Slate 50
				doc.setDrawColor(226, 232, 240); // Slate 200
				doc.roundedRect(
					marginX + 6,
					innerY - 3.4,
					contentWidth - 12,
					5.4,
					1.2,
					1.2,
					'FD',
				);
				doc.setTextColor(71, 85, 105); // Slate 600
				doc.setFont('helvetica', 'normal');
			}
			doc.setFontSize(8.2);
			doc.text(opt.text, marginX + 9, innerY + 0.3);
			innerY += 6.2;
		});

		innerY += 2;

		// Answer Comparison Sub-boxes (Side by Side)
		const boxW = (contentWidth - 16) / 2;
		const boxH = 11;

		// Your Answer Box
		doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
		doc.setDrawColor(statusBorder[0], statusBorder[1], statusBorder[2]);
		doc.roundedRect(marginX + 6, innerY, boxW, boxH, 2, 2, 'FD');

		doc.setFontSize(7.5);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(statusText[0], statusText[1], statusText[2]);
		doc.text('YOUR ANSWER:', marginX + 8, innerY + 4);

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8.5);
		let yourAnswerStr = 'Not Answered';
		if (userOption) yourAnswerStr = `${userOption.id}. ${userOption.text}`;
		else if (isSkipped) yourAnswerStr = 'Skipped Question';
		else if (isTimedOut) yourAnswerStr = 'Timed Out';

		doc.text(
			cleanPdfText(yourAnswerStr).substring(0, 36),
			marginX + 8,
			innerY + 8.5,
		);

		// Correct Answer Box
		doc.setFillColor(236, 253, 245); // Emerald 50
		doc.setDrawColor(16, 185, 129); // Emerald 500
		doc.roundedRect(marginX + 10 + boxW, innerY, boxW, boxH, 2, 2, 'FD');

		doc.setFontSize(7.5);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(6, 95, 70);
		doc.text('CORRECT ANSWER:', marginX + 12 + boxW, innerY + 4);

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8.5);
		const rightAnswerStr =
			correctOption ? `${correctOption.id}. ${correctOption.text}` : '';
		doc.text(
			cleanPdfText(rightAnswerStr).substring(0, 36),
			marginX + 12 + boxW,
			innerY + 8.5,
		);

		innerY += boxH + 3;

		// Solution Explanation Box
		if (explanationLines.length > 0) {
			doc.setFillColor(250, 245, 255); // Purple 50
			doc.setDrawColor(216, 180, 254); // Purple 300
			doc.roundedRect(
				marginX + 6,
				innerY,
				contentWidth - 12,
				explanationHeight - 2,
				2,
				2,
				'FD',
			);

			doc.setFontSize(7.5);
			doc.setFont('helvetica', 'bold');
			doc.setTextColor(107, 33, 168); // Purple 800
			doc.text('SOLUTION & EXPLANATION:', marginX + 8, innerY + 4);

			doc.setFont('helvetica', 'normal');
			doc.setFontSize(8.2);
			doc.setTextColor(51, 65, 85);
			doc.text(explanationLines, marginX + 8, innerY + 8);
		}

		currentY += totalCardHeight + 5;
	});

	// ==========================================
	// 4. RUNNING FOOTERS (Page X of Y)
	// ==========================================
	const totalPages = doc.getNumberOfPages();
	for (let i = 1; i <= totalPages; i++) {
		doc.setPage(i);
		doc.setDrawColor(226, 232, 240);
		doc.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);

		doc.setFontSize(8);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(148, 163, 184); // Slate 400
		doc.text(
			'AstroQuest | 100% AI-Generated Adaptive Learning for Kids',
			marginX,
			pageHeight - 6,
		);

		doc.text(
			`Page ${i} of ${totalPages}`,
			pageWidth - marginX - 18,
			pageHeight - 6,
		);
	}

	// Format date and time for filename
	const now = new Date();
	const day = String(now.getDate()).padStart(2, '0');
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	const month = monthNames[now.getMonth()];
	const year = now.getFullYear();
	let hours = now.getHours();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12 || 12;
	const formattedHours = String(hours).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const timeStampStr = `${day}${month}${year}_${formattedHours}-${minutes}${ampm}`;

	const safeStudentName =
		cleanPdfText(studentName).replace(/[^\w-]/g, '_') || 'Explorer';
	const safeFileName =
		customFilename ||
		`AstroQuest_${safeStudentName}_Age${studentAge}_${selectedSkill}_Sheet${sheetNumber}_${timeStampStr}.pdf`;

	doc.save(safeFileName);
}

/**
 * Generates an official, printable landscape Galactic Explorer Certificate of Excellence.
 * Designed for parents to print and hang up on the wall or refrigerator!
 */
export function exportGalacticCertificateToPdf({
	studentName = 'Explorer',
	studentAge = 6,
	rankTitle = 'Stargazer',
	rankLevel = 1,
	scorePercent = 100,
	skillName = 'Space STEM',
	date = new Date().toLocaleDateString(),
}) {
	const doc = new jsPDF({
		orientation: 'landscape',
		unit: 'mm',
		format: 'a4',
	});

	const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
	const pageHeight = doc.internal.pageSize.getHeight(); // 210mm

	// 1. Deep Space Background
	doc.setFillColor(10, 13, 40); // Deep Cosmic Navy
	doc.rect(0, 0, pageWidth, pageHeight, 'F');

	// 2. Double Ornamental Border
	doc.setDrawColor(245, 158, 11); // Gold outer border
	doc.setLineWidth(2.5);
	doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 4, 4, 'S');

	doc.setDrawColor(34, 211, 238); // Cyan inner border
	doc.setLineWidth(1.0);
	doc.roundedRect(13, 13, pageWidth - 26, pageHeight - 26, 3, 3, 'S');

	// Corner star accents
	doc.setTextColor(251, 191, 36);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	doc.text('+', 16, 19);
	doc.text('+', pageWidth - 19, 19);
	doc.text('+', 16, pageHeight - 16);
	doc.text('+', pageWidth - 19, pageHeight - 16);

	// 3. Institution Header
	doc.setTextColor(147, 197, 253);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(11);
	doc.text('ASTROQUEST SPACE ACADEMY - MISSION CONTROL', pageWidth / 2, 28, {
		align: 'center',
	});

	// 4. Main Certificate Title
	doc.setTextColor(255, 255, 255);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(26);
	doc.text('GALACTIC EXPLORER DIPLOMA', pageWidth / 2, 42, {
		align: 'center',
	});

	doc.setTextColor(251, 191, 36);
	doc.setFontSize(13);
	doc.text('OFFICIAL CERTIFICATE OF COSMIC EXCELLENCE', pageWidth / 2, 50, {
		align: 'center',
	});

	// 5. Presentation Line
	doc.setTextColor(203, 213, 225);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(12);
	doc.text(
		'This official space diploma is proudly awarded to',
		pageWidth / 2,
		65,
		{
			align: 'center',
		},
	);

	// 6. Child's Name (Prominent Gold Banner)
	const cleanName = cleanPdfText(studentName).toUpperCase() || 'CADET EXPLORER';
	doc.setFillColor(18, 24, 75);
	doc.roundedRect(40, 72, pageWidth - 80, 18, 3, 3, 'F');
	doc.setDrawColor(245, 158, 11);
	doc.setLineWidth(0.8);
	doc.roundedRect(40, 72, pageWidth - 80, 18, 3, 3, 'S');

	doc.setTextColor(255, 255, 255);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(22);
	doc.text(cleanName, pageWidth / 2, 84, {
		align: 'center',
	});

	// 7. Citation Body
	doc.setTextColor(226, 232, 240);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(11.5);
	const citation = `For extraordinary problem-solving, cognitive bravery, and stellar performance in ${cleanPdfText(skillName)}. By completing this cosmic mission with ${scorePercent}% accuracy, this cadet is hereby honored as:`;
	const splitCitation = doc.splitTextToSize(citation, 210);
	doc.text(splitCitation, pageWidth / 2, 103, { align: 'center' });

	// 8. Astronaut Rank Insignia Box
	doc.setFillColor(13, 20, 60);
	doc.roundedRect(65, 120, pageWidth - 130, 24, 3, 3, 'F');
	doc.setDrawColor(34, 211, 238);
	doc.setLineWidth(1.2);
	doc.roundedRect(65, 120, pageWidth - 130, 24, 3, 3, 'S');

	doc.setTextColor(34, 211, 238);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(16);
	doc.text(
		`RANK: ${cleanPdfText(rankTitle).toUpperCase()}  -  LEVEL ${rankLevel}`,
		pageWidth / 2,
		131,
		{ align: 'center' },
	);

	doc.setTextColor(251, 191, 36);
	doc.setFontSize(10);
	doc.text(
		`MISSION STATUS: VERIFIED STEM CADET  -  AGE ${studentAge}`,
		pageWidth / 2,
		139,
		{ align: 'center' },
	);

	// 9. Seal & Signatures
	// Date on Left
	doc.setTextColor(148, 163, 184);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.text('Date of Launch:', 45, 172);
	doc.setTextColor(255, 255, 255);
	doc.setFont('helvetica', 'bold');
	doc.text(String(date), 45, 178);

	// Golden Star Seal in Center
	doc.setFillColor(245, 158, 11);
	doc.circle(pageWidth / 2, 175, 14, 'F');
	doc.setFillColor(10, 13, 40);
	doc.circle(pageWidth / 2, 175, 11.5, 'F');
	doc.setTextColor(251, 191, 36);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(8);
	doc.text('OFFICIAL', pageWidth / 2, 173, { align: 'center' });
	doc.text('SEAL', pageWidth / 2, 178, { align: 'center' });

	// Signature on Right
	doc.setDrawColor(148, 163, 184);
	doc.setLineWidth(0.6);
	doc.line(pageWidth - 95, 176, pageWidth - 45, 176);
	doc.setTextColor(148, 163, 184);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.text('Chief Flight Director / Educator', pageWidth - 70, 181, {
		align: 'center',
	});

	// 10. Footer Security Verification
	doc.setTextColor(71, 85, 105);
	doc.setFontSize(8);
	const certId = `AQ-CERT-${Math.abs(cleanName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))}-${Date.now().toString().slice(-4)}`;
	doc.text(
		`Official Document ID: ${certId}  -  Generated by AstroQuest`,
		pageWidth / 2,
		198,
		{
			align: 'center',
		},
	);

	const safeFilename = `${cleanName.replace(/[^\w-]/g, '_')}_AstroQuest_Certificate.pdf`;
	doc.save(safeFilename);
}
