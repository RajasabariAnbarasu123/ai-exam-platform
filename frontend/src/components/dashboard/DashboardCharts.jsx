import React from 'react';
import {
    LineChart,
    Line,
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
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

const DashboardCharts = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const chartTheme = {
        text: isDark ? '#9CA3AF' : '#6B7280',
        grid: isDark ? '#374151' : '#E5E7EB',
    };

    // Weekly Performance Data
    const weeklyData = data?.weeklyPerformance?.dates?.map((date, index) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        score: data.weeklyPerformance.scores[index] || 0,
        exams: data.weeklyPerformance.examCounts[index] || 0,
    })) || [];

    // Difficulty Analysis Data
    const difficultyData = data?.difficultyAnalysis?.difficulties?.map((diff, index) => ({
        name: diff,
        value: data.difficultyAnalysis.counts[index] || 0,
        score: data.difficultyAnalysis.avgScores[index] || 0,
    })) || [];

    // Question Type Analysis Data
    const questionTypeData = data?.questionTypeAnalysis?.questionTypes?.map((type, index) => ({
        name: type,
        value: data.questionTypeAnalysis.counts[index] || 0,
        score: data.questionTypeAnalysis.avgScores[index] || 0,
    })) || [];

    return (
        <div className="space-y-6">
            {/* Weekly Performance Chart */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Weekly Performance
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                            <XAxis 
                                dataKey="date" 
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
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={{ fill: '#4F46E5' }}
                                name="Average Score %"
                            />
                            <Line
                                type="monotone"
                                dataKey="exams"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ fill: '#10B981' }}
                                name="Exams Taken"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Difficulty Analysis Chart */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Difficulty Analysis
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
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    color: isDark ? '#F9FAFB' : '#111827',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#4F46E5" name="Number of Exams" />
                            <Bar dataKey="score" fill="#7C3AED" name="Average Score %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Question Type Analysis - Pie Chart */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Question Type Distribution
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={questionTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {questionTypeData.map((entry, index) => (
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
        </div>
    );
};

export default DashboardCharts;