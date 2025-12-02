import { useState, useEffect } from 'react';
import { BrainCircuit, Timer, CheckCircle2, XCircle, RefreshCw, ChevronRight, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { QUIZZES } from '../data/mockData';

const Quiz = () => {
    const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);

    const quiz = activeQuiz ? QUIZZES.find(q => q.id === activeQuiz) : null;
    const currentQuestion = quiz ? quiz.questions[currentQuestionIndex] : null;

    useEffect(() => {
        if (activeQuiz && !showResult && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !showResult) {
            handleNext();
        }
    }, [timeLeft, activeQuiz, showResult]);

    const handleStartQuiz = (quizId: string) => {
        setActiveQuiz(quizId);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setTimeLeft(30);
        setSelectedAnswer(null);
    };

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return; // Prevent multiple clicks
        setSelectedAnswer(index);

        if (index === currentQuestion?.correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (!quiz) return;

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setTimeLeft(30);
        } else {
            setShowResult(true);
        }
    };

    const handleRetry = () => {
        if (activeQuiz) handleStartQuiz(activeQuiz);
    };

    // 1. Quiz Selection Screen
    if (!activeQuiz) {
        return (
            <div className="p-6 pb-24">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Select Quiz</h2>
                <div className="space-y-4">
                    {QUIZZES.map((q) => (
                        <button
                            key={q.id}
                            onClick={() => handleStartQuiz(q.id)}
                            className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/50 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <BrainCircuit size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-lg text-text-primary">{q.title}</h3>
                                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                                        {q.level}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // 2. Result Screen
    if (showResult) {
        const percentage = quiz ? (score / quiz.questions.length) * 100 : 0;

        return (
            <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm mb-8 animate-fade-in">
                    <Trophy size={64} className="text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Quiz Completed!</h2>
                    <p className="text-text-secondary mb-6">You scored</p>

                    <div className="text-5xl font-bold text-primary mb-2">{score}/{quiz?.questions.length}</div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-6">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-text-secondary mb-8">
                        {percentage >= 70 ? "Great job! Keep it up!" : "Good effort! Try again to improve."}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleRetry}
                            className="flex-1 btn btn-secondary"
                        >
                            <RefreshCw size={20} /> Retry
                        </button>
                        <button
                            onClick={() => setActiveQuiz(null)}
                            className="flex-1 btn bg-gray-100 text-text-primary hover:bg-gray-200"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Question Screen
    return (
        <div className="min-h-screen bg-background flex flex-col p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-primary font-bold">
                    <BrainCircuit size={24} />
                    <span>{quiz?.title}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    <Timer size={18} className={timeLeft < 10 ? "text-red-500" : "text-text-secondary"} />
                    <span className={clsx("font-mono font-bold", timeLeft < 10 ? "text-red-500" : "text-text-primary")}>
                        {timeLeft}s
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
                <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / (quiz?.questions.length || 1)) * 100}%` }}
                ></div>
            </div>

            {/* Question */}
            <div className="flex-1">
                <h3 className="text-xl font-bold text-text-primary mb-6">
                    <span className="text-gray-400 mr-2">{currentQuestionIndex + 1}.</span>
                    {currentQuestion?.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion?.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion?.correctAnswer;
                        const showCorrectness = selectedAnswer !== null;

                        let buttonClass = "bg-white border-gray-200 hover:border-primary/50";
                        if (showCorrectness) {
                            if (isCorrect) buttonClass = "bg-green-50 border-green-500 text-green-700";
                            else if (isSelected) buttonClass = "bg-red-50 border-red-500 text-red-700";
                        } else if (isSelected) {
                            buttonClass = "border-primary bg-primary/5 text-primary";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={selectedAnswer !== null}
                                className={clsx(
                                    "w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center",
                                    buttonClass
                                )}
                            >
                                <span>{option}</span>
                                {showCorrectness && isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                                {showCorrectness && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {selectedAnswer !== null && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 animate-fade-in">
                        <h4 className="font-bold text-blue-800 mb-1">Explanation:</h4>
                        <p className="text-blue-900/80 text-sm">{currentQuestion?.explanation}</p>
                    </div>
                )}
            </div>

            {/* Next Button */}
            {selectedAnswer !== null && (
                <button
                    onClick={handleNext}
                    className="btn btn-primary w-full mt-6 animate-slide-up"
                >
                    {currentQuestionIndex === (quiz?.questions.length || 0) - 1 ? "Finish Quiz" : "Next Question"}
                </button>
            )}
        </div>
    );
};

export default Quiz;
