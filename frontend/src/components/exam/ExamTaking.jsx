import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useExam } from '../../hooks/useExam';
import { useTimer } from '../../hooks/useTimer';
import ExamQuestion from './ExamQuestion';
import ExamProgress from './ExamProgress';
import ExamTimer from './ExamTimer';
import ExamNavigation from './ExamNavigation';
import ExamSubmit from './ExamSubmit';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import { showToast } from '../common/ToastNotifications';
import { AlertTriangle, BookOpen, BarChart2, Clock, Layers } from 'lucide-react';

const ExamTaking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { examId } = location.state || {};
    const { getExam, submitExam, loading } = useExam();
    
    const [exam, setExam] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const questionStartTimeRef = useRef(Date.now());

    const handleTimeExpireRef = useRef();
    const handleTimeExpire = useCallback(() => {
        if (handleTimeExpireRef.current) {
            handleTimeExpireRef.current();
        }
    }, []);

    const { timeRemaining, isExpired, reset: resetTimer } = useTimer({
        initialTime: 30,
        onExpire: handleTimeExpire
    });

    useEffect(() => {
        if (!examId) {
            showToast.error('No exam found');
            navigate('/exam/start');
            return;
        }
        fetchExam();
    }, [examId]);

    const fetchExam = async () => {
        try {
            const response = await getExam(examId);
            setExam(response);
            const timeLimit = response.timerSettings?.timeLimit || 30;
            const totalQuestions = response.questions?.length || 0;
            resetTimer(timeLimit * totalQuestions);
            questionStartTimeRef.current = Date.now();
        } catch (error) {
            showToast.error('Failed to load exam');
            navigate('/exam/start');
        }
    };

    const perQuestionTime = exam?.timerSettings?.timeLimit || 30;
    const totalQuestions = exam?.questions?.length || 0;
    const totalExamTime = perQuestionTime * totalQuestions;

    handleTimeExpireRef.current = () => {
        showToast.warning('Exam time is up! Auto-submitting...');
        handleAutoSubmit();
    };

    const recordTimeSpent = (questionId) => {
        const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
        setTimeSpentPerQuestion(prev => ({
            ...prev,
            [questionId]: (prev[questionId] || 0) + elapsed
        }));
    };

    const navigateToQuestion = (index) => {
        const currentQ = exam?.questions?.[currentQuestion];
        if (currentQ) {
            recordTimeSpent(currentQ.questionId);
        }
        setCurrentQuestion(index);
        questionStartTimeRef.current = Date.now();
    };

    const handleAnswerSelect = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            navigateToQuestion(currentQuestion + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            navigateToQuestion(currentQuestion - 1);
        }
    };

    const handleQuestionClick = (index) => {
        if (index !== currentQuestion) {
            navigateToQuestion(index);
        }
    };

    const handleSubmitExam = async () => {
        setIsSubmitting(true);
        try {
            const currentQ = exam?.questions?.[currentQuestion];
            let finalTimeSpent = { ...timeSpentPerQuestion };
            if (currentQ) {
                const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
                finalTimeSpent[currentQ.questionId] = (finalTimeSpent[currentQ.questionId] || 0) + elapsed;
            }

            const answersList = exam.questions.map(q => {
                const questionId = q.questionId;
                const answer = answers[questionId];
                return {
                    questionId,
                    answer: answer !== undefined ? answer : null,
                    timeTaken: finalTimeSpent[questionId] || 0,
                    isSkipped: answer === undefined
                };
            });
            
            const result = await submitExam(examId, answersList);
            showToast.success('Exam submitted successfully!');
            navigate('/results', { state: { resultId: result.resultId, resultData: result } });
        } catch (error) {
            showToast.error('Failed to submit exam');
        } finally {
            setIsSubmitting(false);
            setShowSubmitModal(false);
        }
    };

    const handleAutoSubmit = async () => {
        try {
            const currentQ = exam?.questions?.[currentQuestion];
            let finalTimeSpent = { ...timeSpentPerQuestion };
            if (currentQ) {
                const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
                finalTimeSpent[currentQ.questionId] = (finalTimeSpent[currentQ.questionId] || 0) + elapsed;
            }

            const answersList = exam.questions.map(q => {
                const questionId = q.questionId;
                const answer = answers[questionId];
                return {
                    questionId,
                    answer: answer !== undefined ? answer : null,
                    timeTaken: finalTimeSpent[questionId] || 0,
                    isSkipped: answer === undefined
                };
            });

            const result = await submitExam(examId, answersList);
            showToast.info('Exam auto-submitted due to timeout');
            navigate('/results', { state: { resultId: result.resultId, resultData: result } });
        } catch (error) {
            showToast.error('Failed to auto-submit exam');
        }
    };

    if (loading || !exam) {
        return <LoadingSpinner fullScreen />;
    }

    const question = exam.questions?.[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    // Human-friendly question type label
    const rawType = (exam.questionType || 'MCQ').toString().toUpperCase().replace(/\s+/g, '_').replace('TRUEFALSE', 'TRUE_FALSE').replace('TRUE-FALSE', 'TRUE_FALSE');
    const questionTypeLabels = {
        MCQ: 'Multiple Choice',
        TRUE_FALSE: 'True / False',
        FILL_IN_THE_BLANK: 'Fill in the Blank',
        SHORT_ANSWER: 'Short Answer',
        CODING: 'Coding',
    };
    const questionTypeLabel = questionTypeLabels[rawType] || rawType.replace(/_/g, ' ');

    return (
        <div className="exam-taking-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-primary, #f8fafc)' }}>
            {/* ===== STICKY FULL-WIDTH EXAM HEADER ===== */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    zIndex: 100,
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    boxShadow: '0 2px 16px rgba(79,70,229,0.25)',
                }}
            >
                <div
                    style={{
                        maxWidth: '100%',
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        height: '68px',
                    }}
                >
                    {/* LEFT: Exam info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flex: 1 }}>
                        <div style={{ minWidth: 0 }}>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '280px',
                                }}
                            >
                                {exam.topic}
                            </h1>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            {/* Difficulty */}
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '20px',
                                    padding: '3px 10px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <BarChart2 size={12} />
                                {exam.difficulty}
                            </span>

                            {/* Question Type */}
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '20px',
                                    padding: '3px 10px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Layers size={12} />
                                {questionTypeLabel}
                            </span>

                            {/* Answered */}
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '20px',
                                    padding: '3px 10px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <BookOpen size={12} />
                                {answeredCount}/{totalQuestions} Answered
                            </span>

                            {/* Total Time */}
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '20px',
                                    padding: '3px 10px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Clock size={12} />
                                {Math.floor(totalExamTime / 60)}m {totalExamTime % 60}s total
                            </span>
                        </div>
                    </div>

                    {/* RIGHT: Timer & Theme Toggle */}
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <ExamTimer
                            timeRemaining={timeRemaining}
                            totalTime={totalExamTime}
                            inverted
                        />
                        <div className="flex items-center">
                            <ThemeToggle inverted />
                        </div>
                    </div>
                </div>

                {/* Timer progress bar at very bottom of header */}
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', width: '100%' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${totalExamTime > 0 ? (timeRemaining / totalExamTime) * 100 : 100}%`,
                            background: timeRemaining <= 30 ? '#ef4444' : timeRemaining <= 60 ? '#f59e0b' : 'rgba(255,255,255,0.8)',
                            transition: 'width 1s linear',
                        }}
                    />
                </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <ExamProgress
                    current={currentQuestion + 1}
                    total={totalQuestions}
                    answered={answeredCount}
                    answers={answers}
                    questions={exam.questions}
                    onQuestionClick={handleQuestionClick}
                />

                <div className="mt-6">
                    <ExamQuestion
                        question={question}
                        index={currentQuestion}
                        total={totalQuestions}
                        selectedAnswer={answers[question?.questionId]}
                        onAnswerSelect={handleAnswerSelect}
                        timeRemaining={timeRemaining}
                        examType={exam.questionType}
                    />
                </div>

                <ExamNavigation
                    current={currentQuestion}
                    total={totalQuestions}
                    onPrevious={handlePreviousQuestion}
                    onNext={handleNextQuestion}
                    onSubmit={() => setShowSubmitModal(true)}
                    isLast={currentQuestion === totalQuestions - 1}
                />

                {showSubmitModal && (
                    <ExamSubmit
                        onClose={() => setShowSubmitModal(false)}
                        onSubmit={handleSubmitExam}
                        answeredCount={answeredCount}
                        totalQuestions={totalQuestions}
                        isSubmitting={isSubmitting}
                    />
                )}

                {answeredCount < totalQuestions && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                You have {totalQuestions - answeredCount} unanswered questions
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Make sure to answer all questions before submitting.
                            </p>
                        </div>
                    </div>
                )}

                {isExpired && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                Question time has expired!
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-400">
                                Navigate to the next question or submit your exam.
                            </p>
                            <button
                                onClick={handleAutoSubmit}
                                className="mt-2 px-4 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Submit Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamTaking;