import { useCallback, useState } from 'react';

/**
 * Custom hook managing active quest session state, score, streak, and answer tracking.
 */
export function useQuestSession({ initialQuestions = [], onComplete } = {}) {
	const [questions, setQuestions] = useState(initialQuestions);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedOptionId, setSelectedOptionId] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [score, setScore] = useState(0);
	const [streak, setStreak] = useState(0);
	const [maxStreak, setMaxStreak] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [eliminatedOptionIds, setEliminatedOptionIds] = useState([]);

	const currentQuestion = questions[currentIndex] || null;
	const isLastQuestion = currentIndex >= questions.length - 1;

	const selectOption = useCallback(
		(optionId) => {
			if (isSubmitted) return;
			setSelectedOptionId(optionId);
		},
		[isSubmitted],
	);

	const submitAnswer = useCallback(() => {
		if (isSubmitted || !selectedOptionId || !currentQuestion) return null;

		const isCorrect = selectedOptionId === currentQuestion.correctAnswerId;
		setIsSubmitted(true);

		const nextScore = isCorrect ? score + 1 : score;
		const nextStreak = isCorrect ? streak + 1 : 0;
		const nextMaxStreak = Math.max(maxStreak, nextStreak);

		setScore(nextScore);
		setStreak(nextStreak);
		setMaxStreak(nextMaxStreak);

		const recordedAnswer = {
			questionId: currentQuestion.id || currentIndex,
			questionText: currentQuestion.question || currentQuestion.questionText,
			selectedOptionId,
			correctAnswerId: currentQuestion.correctAnswerId,
			isCorrect,
			domain: currentQuestion.domain || currentQuestion.category || 'General',
		};

		setAnswers((prev) => [...prev, recordedAnswer]);
		return { isCorrect, nextScore, nextStreak };
	}, [
		isSubmitted,
		selectedOptionId,
		currentQuestion,
		score,
		streak,
		maxStreak,
		currentIndex,
	]);

	const nextQuestion = useCallback(() => {
		if (!isLastQuestion) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedOptionId(null);
			setIsSubmitted(false);
			setEliminatedOptionIds([]);
		} else if (onComplete) {
			onComplete({ score, answers, maxStreak, total: questions.length });
		}
	}, [isLastQuestion, onComplete, score, answers, maxStreak, questions.length]);

	const eliminate5050 = useCallback(() => {
		if (!currentQuestion || eliminatedOptionIds.length > 0 || isSubmitted)
			return;
		const wrongOpts = (currentQuestion.options || [])
			.filter((opt) => opt.id !== currentQuestion.correctAnswerId)
			.map((opt) => opt.id);

		// Randomly pick 2 wrong options to eliminate
		const shuffled = [...wrongOpts].sort(() => 0.5 - Math.random());
		setEliminatedOptionIds(shuffled.slice(0, 2));
	}, [currentQuestion, eliminatedOptionIds, isSubmitted]);

	const resetSession = useCallback((newQuestions = []) => {
		setQuestions(newQuestions);
		setCurrentIndex(0);
		setSelectedOptionId(null);
		setIsSubmitted(false);
		setScore(0);
		setStreak(0);
		setMaxStreak(0);
		setAnswers([]);
		setEliminatedOptionIds([]);
	}, []);

	return {
		questions,
		currentIndex,
		currentQuestion,
		isLastQuestion,
		selectedOptionId,
		isSubmitted,
		score,
		streak,
		maxStreak,
		answers,
		eliminatedOptionIds,
		selectOption,
		submitAnswer,
		nextQuestion,
		eliminate5050,
		resetSession,
		setQuestions,
	};
}
