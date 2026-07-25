import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { historyService } from '../../services/historyService';

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

const ReportAnalytics = ({ report }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [pastHistory, setPastHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch the user's exam history (unfiltered or paged)
                const response = await historyService.getHistory({ size: 100 });
                const list = response.content || response || [];
                setPastHistory(list);
            } catch (e) {
                console.error('Failed to load past history for analytics', e);
            }
        };
        fetchHistory();
    }, []);

    const chartTheme = {
        text: isDark ? '#9CA3AF' : '#6B7280',
        grid: isDark ? '#374151' : '#E5E7EB',
    };

    // Performance breakdown data
    const breakdownData = [
        { name: 'Correct', value: report.correctAnswers },
        { name: 'Wrong', value: report.wrongAnswers },
        { name: 'Skipped', value: report.skippedAnswers },
    ];

    const getDifficultyData = () => {
        const targetTopic = (report.topic || '').trim().toLowerCase();
        
        // Filter history by the same topic
        const topicExams = pastHistory.filter(
            h => (h.topic || '').trim().toLowerCase() === targetTopic
        );

        // Include current report if not already present
        const alreadyPresent = topicExams.some(h => h.id === report.resultId || h.resultId === report.resultId);
        if (!alreadyPresent) {
            topicExams.push({
                difficulty: report.difficulty,
                percentage: report.percentage
            });
        }

        const getAvgForDifficulty = (diff) => {
            const exams = topicExams.filter(e => (e.difficulty || '').toString().toUpperCase() === diff.toUpperCase());
            if (exams.length === 0) return 0;
            const sum = exams.reduce((acc, e) => acc + (e.percentage || 0), 0);
            return Math.round(sum / exams.length);
        };

        return [
            { name: 'Easy', score: getAvgForDifficulty('EASY') },
            { name: 'Medium', score: getAvgForDifficulty('MEDIUM') },
            { name: 'Hard', score: getAvgForDifficulty('HARD') },
        ];
    };

    const getQuestionTypeData = () => {
        const targetTopic = (report.topic || '').trim().toLowerCase();
        
        // Filter history by the same topic
        const topicExams = pastHistory.filter(
            h => (h.topic || '').trim().toLowerCase() === targetTopic
        );

        // Include current report if not already present
        const alreadyPresent = topicExams.some(h => h.id === report.resultId || h.resultId === report.resultId);
        if (!alreadyPresent) {
            topicExams.push({
                questionType: report.questionType,
                percentage: report.percentage
            });
        }

        const getAvgForType = (typeKey) => {
            const exams = topicExams.filter(e => (e.questionType || '').toString().toUpperCase() === typeKey.toUpperCase());
            if (exams.length === 0) return 0;
            const sum = exams.reduce((acc, e) => acc + (e.percentage || 0), 0);
            return Math.round(sum / exams.length);
        };

        return [
            { name: 'MCQ', score: getAvgForType('MCQ') },
            { name: 'True/False', score: getAvgForType('TRUE_FALSE') },
            { name: 'Fill Blank', score: getAvgForType('FILL_IN_THE_BLANK') },
            { name: 'Short Answer', score: getAvgForType('SHORT_ANSWER') },
            { name: 'Coding', score: getAvgForType('CODING') },
        ];
    };

    const difficultyData = getDifficultyData();
    const questionTypeData = getQuestionTypeData();

    return (
        <div className="space-y-6">
            {/* Performance Breakdown */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance Breakdown
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={breakdownData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {breakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    color: isDark ? '#F9FAFB' : '#111827',
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance by Difficulty */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance by Difficulty on {report.topic}
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={difficultyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                            <XAxis 
                                dataKey="name" 
                                stroke={chartTheme.text}
                                tick={{ fill: chartTheme.text }}
                            />
                            <YAxis 
                                stroke={chartTheme.text}
                                tick={{ fill: chartTheme.text }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    color: isDark ? '#F9FAFB' : '#111827',
                                }}
                            />
                            <Bar dataKey="score" fill="#4F46E5" name="Score %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance by Question Type */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance by Question Type on {report.topic}
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={questionTypeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                            <XAxis 
                                dataKey="name" 
                                stroke={chartTheme.text}
                                tick={{ fill: chartTheme.text }}
                            />
                            <YAxis 
                                stroke={chartTheme.text}
                                tick={{ fill: chartTheme.text }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    color: isDark ? '#F9FAFB' : '#111827',
                                }}
                            />
                            <Bar dataKey="score" fill="#7C3AED" name="Score %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ReportAnalytics;