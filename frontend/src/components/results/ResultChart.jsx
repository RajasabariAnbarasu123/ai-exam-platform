import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { historyService } from '../../services/historyService';
import { CheckCircle, XCircle } from 'lucide-react';

// Color palette
const COLORS_BREAKDOWN = ['#10B981', '#EF4444', '#F59E0B']; // correct, wrong, skipped
const COLORS_DIFF = ['#4F46E5', '#7C3AED', '#EC4899'];

const ResultChart = ({ result }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [pastHistory, setPastHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await historyService.getHistory();
                const list = response.content || response || [];
                setPastHistory(list);
            } catch (e) {
                console.error('Failed to load past history', e);
            }
        };
        fetchHistory();
    }, []);

    const chartTheme = {
        text: isDark ? '#9CA3AF' : '#6B7280',
        grid: isDark ? '#374151' : '#E5E7EB',
    };

    /* ---- 1. Current exam question breakdown (Correct / Wrong / Skipped) ---- */
    const breakdownData = [
        { name: 'Correct', value: result.correctAnswers || 0 },
        { name: 'Wrong', value: result.wrongAnswers || 0 },
        { name: 'Skipped', value: result.skippedAnswers || 0 },
    ].filter(d => d.value > 0); // only show non-zero slices

    /* ---- 2. Pass / Fail — filtered to the SAME topic as this result ---- */
    const currentTopic = (result.topic || '').trim().toLowerCase();

    const getTopicPassFailData = () => {
        // Build a pool that includes past history for the same topic + current result
        const allExams = pastHistory.filter(
            h => (h.topic || '').trim().toLowerCase() === currentTopic
        );
        // Include current result if it's not already in history
        const alreadyPresent = allExams.some(h => h.id === result.resultId);
        if (!alreadyPresent) {
            allExams.push({ topic: result.topic, percentage: result.percentage });
        }

        let passed = 0;
        let failed = 0;
        allExams.forEach(exam => {
            const pct = parseFloat(exam.percentage || 0);
            if (pct >= 50) passed++;
            else failed++;
        });

        return {
            barData: [
                { name: 'Passed', value: passed, fill: '#10B981' },
                { name: 'Failed', value: failed, fill: '#EF4444' },
            ],
            passed,
            failed,
            total: allExams.length,
        };
    };

    const topicPassFail = getTopicPassFailData();

    const isPassed = (result.percentage || 0) >= 50;

    /* ---- 3. Average time per question status ---- */
    const detailed = result.detailedResults || [];
    let correctTime = 0, correctCount = 0;
    let wrongTime = 0, wrongCount = 0;
    let skippedTime = 0, skippedCount = 0;

    detailed.forEach(item => {
        const time = parseInt(item.timeTaken || 0, 10);
        if (item.status === 'CORRECT') {
            correctTime += time; correctCount++;
        } else if (item.status === 'WRONG') {
            wrongTime += time; wrongCount++;
        } else {
            skippedTime += time; skippedCount++;
        }
    });

    const timeData = [
        { name: 'Correct', time: correctCount > 0 ? Math.round(correctTime / correctCount) : 0 },
        { name: 'Wrong',   time: wrongCount > 0   ? Math.round(wrongTime / wrongCount) : 0 },
        { name: 'Skipped', time: skippedCount > 0 ? Math.round(skippedTime / skippedCount) : 0 },
    ];

    /* ---- 4. Performance by difficulty (past history) ---- */
    const getDifficultyData = () => {
        const allExams = [...pastHistory];
        const isCurrentInHistory = pastHistory.some(h => h.id === result.resultId);
        if (!isCurrentInHistory) {
            allExams.push({ difficulty: result.difficulty, percentage: result.percentage });
        }
        const groups = {
            EASY:   { total: 0, count: 0 },
            MEDIUM: { total: 0, count: 0 },
            HARD:   { total: 0, count: 0 },
        };
        allExams.forEach(exam => {
            const diff = (exam.difficulty || '').toString().toUpperCase();
            const pct = parseFloat(exam.percentage || 0);
            if (groups[diff]) {
                groups[diff].total += pct;
                groups[diff].count += 1;
            }
        });
        return [
            { name: 'Easy',   score: groups.EASY.count   > 0 ? Math.round(groups.EASY.total / groups.EASY.count) : 0 },
            { name: 'Medium', score: groups.MEDIUM.count > 0 ? Math.round(groups.MEDIUM.total / groups.MEDIUM.count) : 0 },
            { name: 'Hard',   score: groups.HARD.count   > 0 ? Math.round(groups.HARD.total / groups.HARD.count) : 0 },
        ];
    };

    const difficultyData = getDifficultyData();

    const tooltipStyle = {
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        borderColor: isDark ? '#374151' : '#E5E7EB',
        color: isDark ? '#F9FAFB' : '#111827',
    };

    return (
        <div className="space-y-6">

            {/* ===== Current Exam Result Status Banner ===== */}
            <div className={`glass-card p-5 flex items-center gap-4 border-l-4 ${isPassed ? 'border-green-500' : 'border-red-500'}`}>
                {isPassed
                    ? <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
                    : <XCircle className="w-10 h-10 text-red-500 flex-shrink-0" />
                }
                <div>
                    <p className={`text-xl font-bold ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPassed ? '✅ Exam Passed' : '❌ Exam Failed'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        You scored <strong>{(result.percentage || 0).toFixed(1)}%</strong>.
                        {isPassed
                            ? ' Well done! You cleared the 50% passing threshold.'
                            : ' You need ≥ 50% to pass. Review and try again!'}
                    </p>
                </div>
            </div>

            {/* ===== Row 1: Question Breakdown + Pass/Fail History ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Pie: Correct / Wrong / Skipped */}
                <div className="glass-card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Question Breakdown
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
                                    dataKey="value"
                                >
                                    {breakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_BREAKDOWN[index % COLORS_BREAKDOWN.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar chart: Passed / Failed for THIS topic */}
                <div className="glass-card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-0.5">
                        Pass / Fail in <span className="text-indigo-600 dark:text-indigo-400">{result.topic || 'This Topic'}</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {topicPassFail.total} exam{topicPassFail.total !== 1 ? 's' : ''} on this topic &nbsp;·&nbsp;
                        <span className="text-green-600 dark:text-green-400 font-medium">{topicPassFail.passed} Passed</span>
                        {' / '}
                        <span className="text-red-600 dark:text-red-400 font-medium">{topicPassFail.failed} Failed</span>
                    </p>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topicPassFail.barData}
                                barCategoryGap="40%"
                                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke={chartTheme.text}
                                    tick={{ fill: chartTheme.text, fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke={chartTheme.text}
                                    tick={{ fill: chartTheme.text }}
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    width={28}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(value, name) => [`${value} exam${value !== 1 ? 's' : ''}`, name]}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Exams">
                                    {topicPassFail.barData.map((entry, index) => (
                                        <Cell key={`pf-bar-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* ===== Bar Chart: Time Distribution ===== */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Avg Time per Question Status (seconds)
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                            <XAxis dataKey="name" stroke={chartTheme.text} tick={{ fill: chartTheme.text }} />
                            <YAxis stroke={chartTheme.text} tick={{ fill: chartTheme.text }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Bar dataKey="time" name="Avg Time (s)" radius={[4, 4, 0, 0]}>
                                {timeData.map((entry, index) => (
                                    <Cell key={`cell-t-${index}`} fill={COLORS_BREAKDOWN[index % COLORS_BREAKDOWN.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ===== Line Chart: Performance by Difficulty ===== */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Avg Score by Difficulty (All Exams)
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={difficultyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                            <XAxis dataKey="name" stroke={chartTheme.text} tick={{ fill: chartTheme.text }} />
                            <YAxis stroke={chartTheme.text} tick={{ fill: chartTheme.text }} domain={[0, 100]} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#4F46E5"
                                strokeWidth={3}
                                dot={{ fill: '#4F46E5', r: 6 }}
                                name="Avg Score %"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ResultChart;