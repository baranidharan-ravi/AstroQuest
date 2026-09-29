import {
	AI_PROVIDERS,
	callClaudeApi,
	callGeminiApi,
	callOpenAiApi,
	decryptApiKey,
	getActiveAiProvider,
	getStoredApiKey,
} from './aiConfig';

/**
 * Intelligent local fallback guidance when offline or without an active API key
 */
export function generateLocalSocraticGuidance(
	question,
	userMessage,
	chatHistory,
	kidAge,
	petName,
) {
	const msg = (userMessage || '').toLowerCase();
	const hint = question?.hint || '';
	const explanation = question?.solutionText || '';

	if (
		msg.includes('clue') ||
		msg.includes('hint') ||
		chatHistory.length === 0
	) {
		if (hint) {
			return `🚀 Captain! Here is a secret clue: "${hint}" What do you notice when you look closely at that clue?`;
		}
		return `✨ Let's look at the puzzle together! Count or check each clue one by one. What shape, color, or number stands out to you first?`;
	}

	if (msg.includes('why') || msg.includes('not') || msg.includes('wrong')) {
		return `🤔 Great question! Double check the rules of our cosmic mission. Does that choice match every single clue, or is there a tiny difference?`;
	}

	if (msg.includes('step') || msg.includes('break') || msg.includes('how')) {
		if (explanation) {
			const sentences = explanation.split(/[.!?]+/).filter(Boolean);
			const firstStep = sentences[0] ? sentences[0].trim() + '.' : explanation;
			return `🐾 Step 1: ${firstStep} Can you try the next step from here? You've got this!`;
		}
		return `🔍 Let's break it down! First, what is the question asking us to find? Let's take it one step at a time!`;
	}

	return `🌟 You are so close! Remember: ${hint || 'Take your time and point to each option on the screen with your finger.'} Which one feels like the best match?`;
}

/**
 * Interactive Socratic AI Tutor for AstroQuest explorers.
 * Communicates with the active AI provider (Gemini, OpenAI, or Claude)
 * while strictly adhering to pedagogical Socratic rules (never giving away the answer).
 */
export async function askSocraticTutor({
	question,
	userMessage = '',
	chatHistory = [],
	kidAge = 5,
	petName = 'Cosmo',
	apiKey = null,
	preferredModel = null,
} = {}) {
	if (!question) {
		throw new Error('No question provided for Socratic Tutor');
	}

	const activeProvider = getActiveAiProvider();
	const realApiKey = decryptApiKey(apiKey || getStoredApiKey(activeProvider));

	// If no API key is available, generate smart local pedagogical guidance
	if (!realApiKey) {
		return generateLocalSocraticGuidance(
			question,
			userMessage,
			chatHistory,
			kidAge,
			petName,
		);
	}

	const systemInstructions = `You are ${petName}, a loving, enthusiastic, cosmic space pet and tutor for a ${kidAge}-year-old child in an educational web app called AstroQuest.
CRITICAL PEDAGOGICAL RULES:
1. NEVER reveal the direct correct answer, the correct option letter (A, B, C, or D), or exact answer text!
2. Be warm, supportive, and playful. Use child-friendly vocabulary suited for a ${kidAge}-year-old.
3. Keep responses short (2-3 sentences max) with 1 or 2 fun emojis.
4. Give a gentle Socratic clue: ask them to count a specific part, look at a specific color/shape, or think about what happens step by step.
5. If the child says "Give me a clue" or "I am stuck", give the first gentle observation step.
6. If the child asks "Why isn't it [X]?", guide them to compare [X] with the question's clues.`;

	const correctOpt = (question.options || []).find(
		(o) => o.id === question.correctAnswerId,
	);
	const contextPrompt = `QUESTION CONTEXT:
Question: "${question.question || question.questionText || ''}"
Options:
${(question.options || []).map((o) => `Option ${o.id}: ${o.text}`).join('\n')}
Correct Answer (DO NOT REVEAL): Option ${question.correctAnswerId} (${correctOpt?.text || ''})
Hint provided: "${question.hint || ''}"
Explanation breakdown: "${question.solutionText || ''}"

CONVERSATION HISTORY:
${chatHistory.map((m) => `${m.role === 'user' ? 'Child' : petName}: ${m.text}`).join('\n')}

CHILD'S CURRENT MESSAGE:
"${userMessage || 'I need help understanding this!'}"

Respond as ${petName} adhering strictly to the pedagogical rules:`;

	try {
		let replyText = '';
		if (activeProvider === AI_PROVIDERS.OPENAI) {
			replyText = await callOpenAiApi(
				`${systemInstructions}\n\n${contextPrompt}`,
				realApiKey,
				preferredModel,
			);
		} else if (activeProvider === AI_PROVIDERS.CLAUDE) {
			replyText = await callClaudeApi(
				`${systemInstructions}\n\n${contextPrompt}`,
				realApiKey,
				preferredModel,
			);
		} else {
			// Gemini
			const payload = {
				contents: [
					{
						parts: [
							{
								text: `${systemInstructions}\n\n${contextPrompt}`,
							},
						],
					},
				],
				generationConfig: {
					temperature: 0.7,
					topP: 0.9,
					maxOutputTokens: 250,
				},
			};
			const rawResponse = await callGeminiApi(
				payload,
				realApiKey,
				preferredModel,
			);
			replyText = rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
		}

		if (!replyText || !replyText.trim()) {
			return generateLocalSocraticGuidance(
				question,
				userMessage,
				chatHistory,
				kidAge,
				petName,
			);
		}

		return replyText.trim();
	} catch (err) {
		console.warn(
			'[Socratic Tutor] Online API failed, using fallback guidance:',
			err?.message || err,
		);
		return generateLocalSocraticGuidance(
			question,
			userMessage,
			chatHistory,
			kidAge,
			petName,
		);
	}
}
