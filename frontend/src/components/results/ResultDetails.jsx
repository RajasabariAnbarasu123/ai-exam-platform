import React, { useState } from 'react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    ChevronDown,
    ChevronUp,
    Lightbulb,
    MinusCircle
} from 'lucide-react';

const ResultDetails = ({ result }) => {
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    const getOptionsArray = (options) => {
        if (!options) return [];
        if (Array.isArray(options)) return options;
        if (typeof options === 'string') {
            const trimmed = options.trim();
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {}
            }
            if (trimmed.includes('\n')) {
                return trimmed.split('\n').map(s => s.replace(/^[A-D][.)\s]+/, '').trim()).filter(Boolean);
            }
            if (trimmed.includes(',')) {
                return trimmed.split(',').map(s => s.replace(/^[A-D][.)\s]+/, '').trim()).filter(Boolean);
            }
            return [trimmed];
        }
        if (typeof options === 'object') {
            return Object.values(options);
        }
        return [];
    };

    // Resolve answer string to its option text (handles letter "A" -> option text)
    const resolveAnswerText = (answer, optionsList) => {
        if (!answer) return null;
        const raw = answer.toString().trim();
        if (optionsList.length > 0) {
            const directMatch = optionsList.find(opt => opt.toLowerCase() === raw.toLowerCase());
            if (directMatch) return directMatch;
            const clean = raw.replace(/^option\s+/i, '').replace(/\.+$/, '').trim();
            if (clean.length === 1) {
                const idx = clean.toUpperCase().charCodeAt(0) - 65;
                if (idx >= 0 && idx < optionsList.length) return optionsList[idx];
            }
        }
        return raw;
    };

    // Get letter label for an answer (e.g., "A", "B")
    const resolveAnswerLabel = (answer, optionsList) => {
        if (!answer) return null;
        const raw = answer.toString().trim();
        if (optionsList.length > 0) {
            const directIdx = optionsList.findIndex(opt => opt.toLowerCase() === raw.toLowerCase());
            if (directIdx >= 0) return String.fromCharCode(65 + directIdx);
            const clean = raw.replace(/^option\s+/i, '').replace(/\.+$/, '').trim();
            if (clean.length === 1 && /[A-D]/i.test(clean)) return clean.toUpperCase();
        }
        return null;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CORRECT':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'WRONG':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'SKIPPED':
                return <MinusCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CORRECT':
                return 'border-green-500 bg-green-50/30 dark:bg-green-950/10';
            case 'WRONG':
                return 'border-red-500 bg-red-50/30 dark:bg-red-950/10';
            case 'SKIPPED':
                return 'border-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/10';
            default:
                return 'border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question Breakdown
            </h3>

            {result.detailedResults?.map((item, index) => {
                const optionsList = getOptionsArray(item.options);
                const userAnswerText = resolveAnswerText(item.userAnswer, optionsList);
                const userAnswerLabel = resolveAnswerLabel(item.userAnswer, optionsList);
                const correctAnswerText = resolveAnswerText(item.correctAnswer, optionsList);
                const correctAnswerLabel = resolveAnswerLabel(item.correctAnswer, optionsList);

                return (
                    <div
                        key={index}
                        className={`glass-card border-l-4 ${getStatusColor(item.status)}`}
                    >
                        <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full text-left p-4 flex items-start justify-between"
                        >
                            <div className="flex items-start space-x-3 flex-1">
                                <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(item.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Q{index + 1}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                            item.status === 'CORRECT'
                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                                : item.status === 'WRONG'
                                                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                                        }`}>
                                            {item.status}
                                        </span>
                                        {item.timeTaken != null && (
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center space-x-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{item.timeTaken}s</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-900 dark:text-white mt-1 line-clamp-2">
                                        {item.question}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                                {expandedQuestion === index ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </button>

                        {expandedQuestion === index && (
                            <div className="px-4 pb-4 space-y-3 animate-fade-in">

                                {/* MCQ Options Grid */}
                                {optionsList.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Options
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {optionsList.map((option, optIdx) => {
                                                const optLetter = String.fromCharCode(65 + optIdx);
                                                const isSelected = option.toLowerCase() === (userAnswerText || '').toLowerCase();
                                                const isCorrect = option.toLowerCase() === (correctAnswerText || '').toLowerCase();

                                                return (
                                                    <div 
                                                        key={optIdx}
                                                        className={`p-3 rounded-lg border flex items-center space-x-2 text-sm transition-colors ${
                                                            isCorrect
                                                                ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-medium'
                                                                : isSelected
                                                                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                                                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                                            isCorrect
                                                                ? 'bg-green-500 text-white'
                                                                : isSelected
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                            {optLetter}
                                                        </span>
                                                        <span className="flex-1">{option}</span>
                                                        {isCorrect && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                                                        {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Your Answer vs Correct Answer side-by-side */}
                                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            ✏️ Your Answer
                                        </p>
                                        <div className={`text-sm p-3 rounded-lg border-2 min-h-[48px] ${
                                            item.status === 'CORRECT'
                                                ? 'border-green-400 bg-green-50/40 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-medium'
                                                : item.status === 'WRONG'
                                                ? 'border-red-400 bg-red-50/40 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                                                : 'border-yellow-400 bg-yellow-50/40 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 italic'
                                        }`}>
                                            {(item.status === 'SKIPPED' || !userAnswerText)
                                                ? '— Not answered'
                                                : <>
                                                    {userAnswerLabel && (
                                                        <span className="font-bold mr-1">{userAnswerLabel}.</span>
                                                    )}
                                                    {userAnswerText}
                                                  </>
                                            }
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            ✅ Correct Answer
                                        </p>
                                        <div className="text-sm p-3 rounded-lg border-2 border-green-400 bg-green-50/40 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-medium min-h-[48px]">
                                            {correctAnswerText
                                                ? <>
                                                    {correctAnswerLabel && (
                                                        <span className="font-bold mr-1">{correctAnswerLabel}.</span>
                                                    )}
                                                    {correctAnswerText}
                                                  </>
                                                : <span className="text-gray-400 italic">N/A</span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Explanation */}
                                {item.explanation && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center space-x-1 mb-1">
                                            <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                                            <span>Explanation</span>
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50/30 dark:bg-blue-950/10 rounded-lg leading-relaxed border border-blue-100 dark:border-blue-900/30">
                                            {item.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ResultDetails;