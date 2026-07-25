import React from 'react';
import { Check, X, Code2, AlignLeft, ToggleLeft, List } from 'lucide-react';

const ExamQuestion = ({ 
    question, 
    index, 
    total, 
    selectedAnswer, 
    onAnswerSelect,
    timeRemaining,
    examType,
    showResults = false,
    isCorrect = null,
    explanation = null
}) => {
    if (!question) return null;

    // Normalize type — backend may send lowercase, mixed case, spaces, hyphens etc.
    // Fall back to the exam-level type (passed as examType prop) if per-question field is missing.
    const rawType = (
        question.type ||
        question.questionType ||
        examType ||
        'MCQ'
    ).toString();
    const questionType = rawType
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/TRUE[_\-\s]?FALSE/g, 'TRUE_FALSE')
        .replace('TRUEFALSE', 'TRUE_FALSE')
        .replace('TRUE-FALSE', 'TRUE_FALSE')
        .replace('FILL_BLANK', 'FILL_IN_THE_BLANK')
        .replace('FILLBLANK', 'FILL_IN_THE_BLANK')
        .replace('FILL_IN_BLANK', 'FILL_IN_THE_BLANK')
        .replace('FILLINTHEBLANK', 'FILL_IN_THE_BLANK')
        .replace('SHORT_ANSWER', 'SHORT_ANSWER')
        .replace('SHORTANSWER', 'SHORT_ANSWER');

    // 200-word limit for short answer
    const MAX_SHORT_ANSWER_WORDS = 200;

    const countWords = (text) => {
        if (!text || !text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    };

    // Human-friendly label map
    const TYPE_LABELS = {
        MCQ: 'Multiple Choice',
        TRUE_FALSE: 'True / False',
        FILL_IN_THE_BLANK: 'Fill in the Blank',
        SHORT_ANSWER: 'Short Answer',
        CODING: 'Coding',
    };

    const TYPE_ICONS = {
        MCQ: List,
        TRUE_FALSE: ToggleLeft,
        FILL_IN_THE_BLANK: AlignLeft,
        SHORT_ANSWER: AlignLeft,
        CODING: Code2,
    };

    const typeLabel = TYPE_LABELS[questionType] || questionType.replace(/_/g, ' ');
    const TypeIcon = TYPE_ICONS[questionType] || List;

    const getOptionsArray = () => {
        let opts = question.options;
        if (!opts) return [];
        if (Array.isArray(opts)) return opts;
        if (typeof opts === 'string') {
            const trimmed = opts.trim();
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {}
            }
            if (trimmed.includes('\n')) {
                return trimmed.split('\n').map(s => s.replace(/^[A-D][\.\)]\s*/, '').trim()).filter(Boolean);
            }
            if (trimmed.includes(',')) {
                return trimmed.split(',').map(s => s.replace(/^[A-D][\.\)]\s*/, '').trim()).filter(Boolean);
            }
            return [trimmed];
        }
        if (typeof opts === 'object') {
            return Object.values(opts);
        }
        return [];
    };

    const renderQuestionContent = () => {
        switch (questionType) {
            case 'MCQ':
                return renderMCQ();
            case 'TRUE_FALSE':
                return renderTrueFalse();
            case 'FILL_IN_THE_BLANK':
                return renderFillBlank();
            case 'SHORT_ANSWER':
                return renderShortAnswer();
            case 'CODING':
                return renderCoding();
            default:
                // If options available, render as MCQ; else short answer
                if (getOptionsArray().length > 0) {
                    return renderMCQ();
                }
                return renderShortAnswer();
        }
    };

    const renderMCQ = () => {
        const optionsList = getOptionsArray();
        return (
            <div className="space-y-3">
                {optionsList.map((option, optIndex) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = showResults && option === question.correctAnswer;
                    const isWrongAnswer = showResults && isSelected && option !== question.correctAnswer;

                    return (
                        <button
                            key={optIndex}
                            onClick={() => !showResults && onAnswerSelect(question.questionId, option)}
                            disabled={showResults}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                isSelected && !showResults
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : isCorrectAnswer
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : isWrongAnswer
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                    isSelected && !showResults
                                        ? 'bg-indigo-500 text-white'
                                        : isCorrectAnswer
                                        ? 'bg-green-500 text-white'
                                        : isWrongAnswer
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                    {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className="text-gray-900 dark:text-white">{option}</span>
                                {isCorrectAnswer && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                                {isWrongAnswer && <X className="w-5 h-5 text-red-500 ml-auto" />}
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderTrueFalse = () => {
        const normalizeAnswer = (val) => {
            if (!val) return '';
            const v = val.toString().toLowerCase().trim();
            if (v === 'true') return 'True';
            if (v === 'false') return 'False';
            return val;
        };
        const options = ['True', 'False'];
        return (
            <div className="grid grid-cols-2 gap-4">
                {options.map(option => {
                    const normSelected = normalizeAnswer(selectedAnswer);
                    const normCorrect = normalizeAnswer(question.correctAnswer);
                    const isSelected = normSelected === option;
                    const isCorrectAnswer = showResults && normCorrect === option;
                    const isWrongAnswer = showResults && isSelected && normCorrect !== option;

                    const baseStyle = `p-6 rounded-xl border-2 transition-all duration-200 font-semibold text-lg cursor-pointer flex items-center justify-center gap-2`;

                    return (
                        <button
                            key={option}
                            onClick={() => !showResults && onAnswerSelect(question.questionId, option)}
                            disabled={showResults}
                            className={`${baseStyle} ${
                                isCorrectAnswer
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                    : isWrongAnswer
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                    : isSelected
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 text-gray-800 dark:text-gray-200'
                            }`}
                        >
                            {isCorrectAnswer && <Check className="w-5 h-5" />}
                            {isWrongAnswer && <X className="w-5 h-5" />}
                            {!showResults && isSelected && (
                                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                            )}
                            <span>{option}</span>
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderFillBlank = () => {
        const currentVal = selectedAnswer || '';
        return (
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Type your answer in the field below:
                </p>
                <div className="relative mt-2">
                    <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => !showResults && onAnswerSelect(question.questionId, e.target.value)}
                        disabled={showResults}
                        className="w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                        placeholder="Write your answer here..."
                        autoComplete="off"
                    />
                </div>
                {showResults && (
                    <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            ✅ Correct Answer: <span className="font-semibold">{question.correctAnswer}</span>
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderShortAnswer = () => {
        const currentVal = selectedAnswer || '';
        const wordCount = countWords(currentVal);
        const isOverLimit = wordCount > MAX_SHORT_ANSWER_WORDS;

        return (
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Write your answer below <span className="font-medium">(max {MAX_SHORT_ANSWER_WORDS} words)</span>:
                </p>
                <div className="relative mt-2">
                    <textarea
                        value={currentVal}
                        onChange={(e) => {
                            if (!showResults) {
                                const newVal = e.target.value;
                                const wc = countWords(newVal);
                                if (wc <= MAX_SHORT_ANSWER_WORDS) {
                                    onAnswerSelect(question.questionId, newVal);
                                }
                            }
                        }}
                        disabled={showResults}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 resize-none"
                        placeholder={`Write your answer here (maximum ${MAX_SHORT_ANSWER_WORDS} words)...`}
                    />
                    <div className={`text-xs text-right mt-1 font-medium ${
                        isOverLimit ? 'text-red-500' : wordCount > MAX_SHORT_ANSWER_WORDS * 0.85 ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                        {wordCount} / {MAX_SHORT_ANSWER_WORDS} words
                    </div>
                </div>
                {showResults && (
                    <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">📖 Model Answer:</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{question.correctAnswer}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            ℹ️ Your answer will be evaluated based on content relevance, not exact match.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderCoding = () => {
        const currentVal = selectedAnswer || '';
        return (
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Write your code solution below:
                </p>
                <textarea
                    value={currentVal}
                    onChange={(e) => !showResults && onAnswerSelect(question.questionId, e.target.value)}
                    disabled={showResults}
                    rows={10}
                    spellCheck={false}
                    className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-sm bg-gray-900 text-green-300 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${
                        showResults && currentVal === question.correctAnswer
                            ? 'border-green-500'
                            : showResults
                            ? 'border-yellow-500'
                            : 'border-gray-600'
                    }`}
                    placeholder="// Write your code here..."
                />
                {showResults && (
                    <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                            <strong>Solution Approach:</strong>
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{question.correctAnswer}</p>
                        <p className={`text-sm mt-2 font-medium ${currentVal === question.correctAnswer ? 'text-green-500' : 'text-yellow-500'}`}>
                            {currentVal === question.correctAnswer ? '✓ Correct solution!' : 'ℹ️ Review the solution approach above'}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        Question {index + 1} of {total}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {question.question}
                    </h3>
                </div>
                {/* Correct question type badge */}
                <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full whitespace-nowrap border border-indigo-200 dark:border-indigo-700">
                    <TypeIcon size={11} />
                    {typeLabel}
                </span>
            </div>

            {renderQuestionContent()}

            {showResults && explanation && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Explanation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExamQuestion;