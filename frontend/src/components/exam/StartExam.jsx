import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../hooks/useExam';
import { examService } from '../../services/examService';
import { showToast } from '../common/ToastNotifications';
import { 
    BookOpen, 
    Clock, 
    Layers, 
    ListChecks, 
    Sparkles,
    Loader2,
    ChevronRight,
    Zap
} from 'lucide-react';

const StartExam = () => {
    const navigate = useNavigate();
    const { generateExam, loading } = useExam();

    const [examSettings, setExamSettings] = useState({
        minQuestions: 5,
        maxQuestions: 30,
        defaultDifficulty: 'MEDIUM'
    });

    const [formData, setFormData] = useState({
        topic: '',
        difficulty: 'MEDIUM',
        questionType: 'MCQ',
        numberOfQuestions: 10,
        customTopic: ''
    });

    const [isGenerating, setIsGenerating] = useState(false);

    // Load admin-configured settings and apply them
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await examService.getExamSettings();
                setExamSettings(data);
                // Apply defaultDifficulty and clamp numberOfQuestions
                setFormData(prev => ({
                    ...prev,
                    difficulty: data.defaultDifficulty || prev.difficulty,
                    numberOfQuestions: Math.min(
                        Math.max(prev.numberOfQuestions, data.minQuestions || 5),
                        data.maxQuestions || 30
                    )
                }));
            } catch {
                // Non-fatal: use hardcoded defaults
            }
        };
        loadSettings();
    }, []);

    const topics = [
        'Java', 'Spring Boot', 'React', 'SQL', 'Python',
        'Data Structures', 'Operating Systems', 'Networking',
        'Machine Learning', 'Cloud Computing', 'DevOps'
    ];

    const difficulties = [
        { value: 'EASY', label: 'Easy', color: 'text-green-500', icon: '😊' },
        { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-500', icon: '🤔' },
        { value: 'HARD', label: 'Hard', color: 'text-red-500', icon: '🔥' }
    ];

    const questionTypes = [
        { value: 'MCQ', label: 'Multiple Choice', icon: '📝' },
        { value: 'TRUE_FALSE', label: 'True / False', icon: '✅' },
        { value: 'FILL_IN_THE_BLANK', label: 'Fill in the Blank', icon: '📖' },
        { value: 'SHORT_ANSWER', label: 'Short Answer', icon: '✍️' },
        { value: 'CODING', label: 'Coding', icon: '💻' }
    ];

    // Dynamically generate question count options based on admin settings
    const buildQuestionCounts = () => {
        const min = examSettings.minQuestions || 5;
        const max = examSettings.maxQuestions || 30;
        const counts = [];
        // Add sensible step values within the admin-configured range
        const steps = [5, 10, 15, 20, 25, 30, 40, 50];
        steps.forEach(s => { if (s >= min && s <= max) counts.push(s); });
        // Always include min and max if not already present
        if (!counts.includes(min)) counts.unshift(min);
        if (!counts.includes(max)) counts.push(max);
        return [...new Set(counts)].sort((a, b) => a - b);
    };
    const questionCounts = buildQuestionCounts();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'topic' && value !== 'custom') {
            setFormData(prev => ({
                ...prev,
                customTopic: ''
            }));
        }
    };

    const handleCustomTopicChange = (e) => {
        setFormData(prev => ({
            ...prev,
            customTopic: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const topic = formData.topic === 'custom' ? formData.customTopic : formData.topic;
        if (!topic.trim()) {
            showToast.error('Please select or enter a topic');
            return;
        }

        setIsGenerating(true);
        try {
            const examData = {
                topic: topic,
                difficulty: formData.difficulty,
                questionType: formData.questionType,
                numberOfQuestions: formData.numberOfQuestions
            };
            
            const response = await generateExam(examData);
            showToast.success('Exam generated successfully!');
            navigate('/exam/taking', { state: { examId: response.examId } });
        } catch (error) {
            showToast.error(error.message || 'Failed to generate exam');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold gradient-text mb-2">
                    Start New Exam
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Customize your exam and let AI generate questions for you
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="glass-card p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Topic Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Select Topic
                                </label>
                                <select
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="">Choose a topic...</option>
                                    {topics.map(topic => (
                                        <option key={topic} value={topic}>{topic}</option>
                                    ))}
                                    <option value="custom">Custom Topic</option>
                                </select>
                                {formData.topic === 'custom' && (
                                    <input
                                        type="text"
                                        placeholder="Enter your custom topic"
                                        value={formData.customTopic}
                                        onChange={handleCustomTopicChange}
                                        className="form-input mt-2"
                                    />
                                )}
                            </div>

                            {/* Difficulty Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Difficulty Level
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {difficulties.map(diff => (
                                        <button
                                            key={diff.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, difficulty: diff.value }))}
                                            className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                                formData.difficulty === diff.value
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            <div className="text-2xl">{diff.icon}</div>
                                            <div className={`font-semibold ${diff.color}`}>{diff.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Question Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Question Type
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {questionTypes.map(type => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, questionType: type.value }))}
                                            className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                                formData.questionType === type.value
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            <div className="text-2xl">{type.icon}</div>
                                            <div className="text-sm font-medium mt-1">{type.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Number of Questions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Number of Questions
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {questionCounts.map(count => (
                                        <button
                                            key={count}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, numberOfQuestions: count }))}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                                                formData.numberOfQuestions === count
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                type="submit"
                                disabled={isGenerating}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Generating Exam...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Generate Exam</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Quick Info
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        AI Generated
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Questions are generated by AI in real-time
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Timed Questions
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Each question has a time limit based on difficulty
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <Layers className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Multiple Types
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Choose from 5 different question types
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <ListChecks className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Instant Results
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Get results and AI feedback immediately
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl">
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                    💡 Tip: Choose a topic you're comfortable with to start your exam journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartExam;