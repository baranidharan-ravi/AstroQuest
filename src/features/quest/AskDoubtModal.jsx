import {
	Bot,
	HelpCircle,
	Loader2,
	Send,
	Sparkles,
	Volume2,
	X,
} from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { askSocraticTutor } from '../../services/aiGenerator';
import { playButtonPop, speakText } from '../../utils/audioSynthesis';

const QUICK_PROMPTS = [
	{ label: '💡 Secret Clue', text: 'Can you give me a secret clue?' },
	{ label: '🔍 Break it Down', text: 'Can we break down step 1 together?' },
	{
		label: '🤔 Why not another choice?',
		text: 'Why might someone get confused by this question?',
	},
	{
		label: '🚀 Explain simply',
		text: 'Can you explain this simply like a fun cosmic puzzle?',
	},
];

const AskDoubtModal = memo(function AskDoubtModal({
	question,
	isOpen,
	onClose,
	soundEnabled,
	kidAge = 5,
	kidName = 'Explorer',
	petName = 'Cosmo',
}) {
	const modalRef = useRef(null);
	const closeBtnRef = useRef(null);
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	const [messages, setMessages] = useState(() => [
		{
			id: 'init-1',
			role: 'assistant',
			text: `Greetings Captain ${kidName}! I'm ${petName}, your cosmic flight tutor. I won't give away the secret answer, but I can guide your eagle eyes! What part would you like help with?`,
		},
	]);
	const [inputText, setInputText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [activePlayingId, setActivePlayingId] = useState(null);

	// Reset conversation whenever a new question is opened
	useEffect(() => {
		if (isOpen && question) {
			setMessages([
				{
					id: 'init-1',
					role: 'assistant',
					text: `Greetings Captain ${kidName}! I'm ${petName}, your cosmic flight tutor. I won't give away the secret answer, but I can guide your eagle eyes! What part would you like help with?`,
				},
			]);
			setInputText('');
			setIsLoading(false);
		}
	}, [isOpen, question, kidName, petName]);

	// Auto-scroll to bottom of messages
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isLoading]);

	// WCAG AA: Escape key and focus trapping
	useEffect(() => {
		if (!isOpen || !question) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
				return;
			}

			if (e.key === 'Tab' && modalRef.current) {
				const focusables = modalRef.current.querySelectorAll(
					'button:not([disabled]), input:not([disabled]), [tabindex="0"]',
				);
				if (focusables.length === 0) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];

				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		const timer = setTimeout(() => {
			if (closeBtnRef.current) {
				closeBtnRef.current.focus();
			}
		}, 50);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(timer);
		};
	}, [isOpen, question, onClose]);

	if (!isOpen || !question) return null;

	const handleSend = async (customMessage = null) => {
		const textToSend = (customMessage || inputText).trim();
		if (!textToSend || isLoading) return;

		playButtonPop(soundEnabled);
		setInputText('');

		const userMsg = {
			id: `user-${Date.now()}`,
			role: 'user',
			text: textToSend,
		};

		const updatedHistory = [...messages, userMsg];
		setMessages(updatedHistory);
		setIsLoading(true);

		try {
			const tutorReply = await askSocraticTutor({
				question,
				userMessage: textToSend,
				chatHistory: updatedHistory,
				kidAge,
				petName,
			});

			const assistantMsg = {
				id: `assistant-${Date.now()}`,
				role: 'assistant',
				text: tutorReply,
			};

			setMessages((prev) => [...prev, assistantMsg]);

			if (soundEnabled) {
				speakText(tutorReply);
			}
		} catch (err) {
			console.error('Tutor error:', err);
			setMessages((prev) => [
				...prev,
				{
					id: `assistant-${Date.now()}`,
					role: 'assistant',
					text: `✨ Take another peek at the puzzle! Count each clue one by one. You have got this, Captain!`,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSpeakMessage = (msgId, text) => {
		playButtonPop(soundEnabled);
		setActivePlayingId(msgId);
		speakText(text);
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200'
			role='dialog'
			aria-modal='true'
			aria-labelledby='ask-doubt-modal-title'>
			<div
				ref={modalRef}
				className='bg-[#111438] border-2 border-[#38419D] text-white rounded-3xl max-w-xl w-full max-h-[90vh] p-4 sm:p-6 shadow-2xl relative flex flex-col gap-3.5'>
				{/* Close Button */}
				<button
					ref={closeBtnRef}
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='Close AI doubt helper dialog'
					className='absolute top-4 right-4 p-2 rounded-full bg-[#1e2463] text-gray-300 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none transition-colors'>
					<X className='w-4 h-4' />
				</button>

				{/* Header */}
				<div className='flex items-center gap-3 pr-10'>
					<div
						aria-hidden='true'
						className='w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0'>
						<Bot className='w-6 h-6 text-white' />
					</div>
					<div>
						<h3
							id='ask-doubt-modal-title'
							className='text-lg sm:text-xl font-black text-white flex items-center gap-2'>
							Socratic AI Tutor 🪐
						</h3>
						<span className='text-xs font-semibold text-pink-300'>
							{petName} guides your thinking without spoiling the answer!
						</span>
					</div>
				</div>

				{/* Question Snippet Reminder */}
				<div className='bg-[#1c225a]/90 border border-indigo-500/30 rounded-2xl p-3 text-xs text-indigo-200 flex items-start gap-2 shadow-inner'>
					<HelpCircle className='w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5' />
					<div className='line-clamp-2 font-medium'>
						<strong className='text-white'>Question:</strong>{' '}
						{question.question || question.questionText}
					</div>
				</div>

				{/* Interactive Chat Scroll Area */}
				<div
					tabIndex={0}
					role='region'
					aria-label='Chat messages with Socratic tutor'
					className='flex-1 min-h-[220px] max-h-[340px] overflow-y-auto bg-slate-950/70 border border-indigo-900/60 rounded-2xl p-3.5 space-y-3.5 custom-scrollbar'>
					{messages.map((m) => {
						const isAssistant = m.role === 'assistant';
						return (
							<div
								key={m.id}
								className={`flex gap-2.5 items-start ${
									isAssistant ? 'justify-start' : 'justify-end'
								}`}>
								{isAssistant && (
									<div
										aria-hidden='true'
										className='w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md flex-shrink-0 mt-1'>
										🤖
									</div>
								)}

								<div
									className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold shadow-md ${
										isAssistant ?
											'bg-gradient-to-r from-slate-900 to-[#192053] text-slate-100 border border-indigo-500/40'
										:	'bg-gradient-to-r from-pink-600 to-rose-500 text-white ml-auto'
									}`}>
									<p className='leading-relaxed whitespace-pre-wrap'>
										{m.text}
									</p>

									{isAssistant && (
										<div className='mt-2 pt-1 border-t border-indigo-800/40 flex items-center justify-between'>
											<span className='text-[10px] text-pink-300 font-bold'>
												{petName}
											</span>
											<button
												type='button'
												onClick={() => handleSpeakMessage(m.id, m.text)}
												aria-label='Listen to this response aloud'
												className='flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/10'>
												<Volume2 className='w-3 h-3' />
												<span>Listen</span>
											</button>
										</div>
									)}
								</div>
							</div>
						);
					})}

					{isLoading && (
						<div className='flex gap-2.5 items-center text-indigo-300 text-xs font-semibold'>
							<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs shadow-md'>
								🤖
							</div>
							<div className='bg-[#192053] border border-indigo-500/30 rounded-2xl px-3 py-2 flex items-center gap-2'>
								<Loader2 className='w-3.5 h-3.5 animate-spin text-pink-400' />
								<span>{petName} is thinking of a cosmic clue...</span>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Quick Starter Suggestions */}
				<div className='flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar'>
					<Sparkles className='w-3.5 h-3.5 text-amber-400 flex-shrink-0' />
					{QUICK_PROMPTS.map((qp, idx) => (
						<button
							key={idx}
							type='button'
							disabled={isLoading}
							onClick={() => handleSend(qp.text)}
							className='text-[11px] font-bold whitespace-nowrap bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-600/40 text-indigo-200 hover:text-white px-2.5 py-1 rounded-xl transition-colors cursor-pointer disabled:opacity-50'>
							{qp.label}
						</button>
					))}
				</div>

				{/* Chat Input & Action Bar */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSend();
					}}
					className='flex items-center gap-2'>
					<div className='relative flex-1'>
						<input
							ref={inputRef}
							type='text'
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder={`Ask ${petName} a question about the clues...`}
							disabled={isLoading}
							className='w-full bg-[#181e4d] border border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50'
						/>
					</div>
					<button
						type='submit'
						disabled={!inputText.trim() || isLoading}
						aria-label='Send message to AI Tutor'
						className='px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all'>
						<Send className='w-3.5 h-3.5' />
						<span className='hidden sm:inline'>Ask</span>
					</button>
				</form>

				{/* Ready to Answer Return Button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					aria-label='I understand now, return to quiz'
					className='w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:outline-none'>
					I Am Ready to Solve It! 🚀
				</button>
			</div>
		</div>
	);
});

export default AskDoubtModal;
