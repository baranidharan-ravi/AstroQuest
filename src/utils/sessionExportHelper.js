/**
 * Session Export Helper Utility
 * Implements SOLID Single Responsibility: handles formatting and exporting session PDF summaries.
 */

export function formatFullDateTime(date = new Date()) {
	return date.toLocaleDateString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function generateSessionPdfFilename(
	kidName = 'Explorer',
	kidAge = 5,
	selectedSkill = 'Visual',
	sheetNumber = 1,
	date = new Date(),
) {
	const day = String(date.getDate()).padStart(2, '0');
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
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();
	let hours = date.getHours();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12 || 12;
	const formattedHours = String(hours).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const timeStampStr = `${day}${month}${year}_${formattedHours}-${minutes}${ampm}`;

	const safeKidName =
		(kidName || 'Explorer').trim().replace(/[^\w-]/g, '_') || 'Explorer';

	return `AstroQuest_${safeKidName}_Age${kidAge}_${selectedSkill}_Sheet${sheetNumber}_${timeStampStr}.pdf`;
}

export async function exportQuestSessionPdf(sessionData) {
	const {
		kidName = 'Explorer',
		kidAge = 5,
		selectedSkill = 'Visual',
		sheetNumber = 1,
		scorePercent = 0,
		correctCount = 0,
		questions = [],
		timerSeconds = 0,
		history = [],
	} = sessionData;

	const now = new Date();
	const fullDateTime = formatFullDateTime(now);
	const filename = generateSessionPdfFilename(
		kidName,
		kidAge,
		selectedSkill,
		sheetNumber,
		now,
	);

	const { exportSessionToPdf } = await import('./pdfGenerator');
	return exportSessionToPdf(
		{
			studentName: kidName || 'Explorer',
			studentAge: kidAge || 5,
			selectedSkill,
			sheetNumber,
			date: fullDateTime,
			scorePercent,
			correctCount,
			totalQuestions: questions.length,
			timerSeconds,
			questions,
			history,
		},
		filename,
	);
}
