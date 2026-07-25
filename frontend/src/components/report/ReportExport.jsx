import React, { useState } from 'react';
import { resultService } from '../../services/resultService';
import { showToast } from '../common/ToastNotifications';
import {
    FileText,
    FileJson,
    Printer,
    Loader2,
    CheckCircle,
    FileSpreadsheet
} from 'lucide-react';

const ReportExport = ({ report }) => {
    const [exportingFormat, setExportingFormat] = useState('');
    const [successFormat, setSuccessFormat] = useState('');

    const triggerDownload = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const exportPDF = async () => {
        setExportingFormat('pdf');
        try {
            const blob = await resultService.exportResult(report.resultId || report.id, 'pdf');
            triggerDownload(blob, `exam-report-${report.resultId || report.id}.pdf`);
            markSuccess('pdf');
        } catch (error) {
            showToast.error('Failed to export as PDF');
        } finally {
            setExportingFormat('');
        }
    };

    const exportJSON = () => {
        setExportingFormat('json');
        try {
            const jsonData = {
                reportId: report.resultId || report.id,
                topic: report.topic,
                difficulty: report.difficulty,
                questionType: report.questionType,
                date: report.createdAt,
                totalQuestions: report.totalQuestions,
                score: report.score,
                percentage: report.percentage,
                performanceRating: report.performanceRating,
                correctAnswers: report.correctAnswers,
                wrongAnswers: report.wrongAnswers,
                skippedAnswers: report.skippedAnswers,
                timeTaken: report.timeTaken,
                aiFeedback: report.aiFeedback
            };
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            triggerDownload(blob, `exam-report-${report.resultId || report.id}.json`);
            markSuccess('json');
        } catch (error) {
            showToast.error('Failed to export as JSON');
        } finally {
            setExportingFormat('');
        }
    };

    const exportCSV = () => {
        setExportingFormat('csv');
        try {
            const headers = [
                'Report ID', 'Topic', 'Difficulty', 'Question Type', 'Date',
                'Total Questions', 'Score', 'Percentage', 'Performance Rating',
                'Correct', 'Wrong', 'Skipped', 'Time Taken (s)'
            ];
            const values = [
                report.resultId || report.id,
                report.topic,
                report.difficulty,
                report.questionType,
                new Date(report.createdAt).toLocaleDateString(),
                report.totalQuestions,
                report.score,
                `${report.percentage?.toFixed(2)}%`,
                report.performanceRating,
                report.correctAnswers,
                report.wrongAnswers,
                report.skippedAnswers,
                report.timeTaken
            ];

            const csvContent = [
                headers.join(','),
                values.map(v => `"${v ?? ''}"`).join(',')
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            triggerDownload(blob, `exam-report-${report.resultId || report.id}.csv`);
            markSuccess('csv');
        } catch (error) {
            showToast.error('Failed to export as CSV');
        } finally {
            setExportingFormat('');
        }
    };

    const markSuccess = (format) => {
        setSuccessFormat(format);
        showToast.success(`Report exported as ${format.toUpperCase()}`);
        setTimeout(() => setSuccessFormat(''), 3000);
    };

    const handlePrint = () => {
        // Build a clean printable HTML page from report data
        const printContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Exam Report – ${report.topic}</title>
    <style>
        body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; padding: 32px; color: #111; }
        h1 { font-size: 26px; margin-bottom: 4px; }
        .subtitle { color: #555; margin-bottom: 24px; font-size: 14px; }
        .section { margin-bottom: 28px; }
        h2 { font-size: 16px; border-bottom: 2px solid #4F46E5; padding-bottom: 6px; margin-bottom: 14px; color: #4F46E5; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 10px 12px; border: 1px solid #e5e7eb; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 600; }
        .green { background: #d1fae5; color: #065f46; }
        .yellow { background: #fef3c7; color: #92400e; }
        .red { background: #fee2e2; color: #991b1b; }
        .score-block { font-size: 40px; font-weight: bold; color: ${report.percentage >= 75 ? '#065f46' : report.percentage >= 50 ? '#92400e' : '#991b1b'}; }
        .feedback { background: #f9fafb; border-left: 4px solid #4F46E5; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.7; }
        @media print { body { padding: 16px; } }
    </style>
</head>
<body>
    <h1>📋 Exam Report</h1>
    <p class="subtitle">Generated on ${new Date().toLocaleString()}</p>

    <div class="section">
        <h2>Score</h2>
        <div class="score-block">${report.percentage?.toFixed(1)}%</div>
        <span class="badge ${report.percentage >= 75 ? 'green' : report.percentage >= 50 ? 'yellow' : 'red'}">
            ${report.performanceRating?.replace('_', ' ')}
        </span>
    </div>

    <div class="section">
        <h2>Exam Details</h2>
        <table>
            <tr><th>Topic</th><td>${report.topic ?? '—'}</td></tr>
            <tr><th>Difficulty</th><td>${report.difficulty ?? '—'}</td></tr>
            <tr><th>Question Type</th><td>${(report.questionType ?? '—').replace(/_/g, ' ')}</td></tr>
            <tr><th>Date</th><td>${report.createdAt ? new Date(report.createdAt).toLocaleString() : '—'}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Results</h2>
        <table>
            <tr><th>Total Questions</th><td>${report.totalQuestions ?? '—'}</td></tr>
            <tr><th>Correct Answers</th><td>${report.correctAnswers ?? 0}</td></tr>
            <tr><th>Wrong Answers</th><td>${report.wrongAnswers ?? 0}</td></tr>
            <tr><th>Skipped Answers</th><td>${report.skippedAnswers ?? 0}</td></tr>
            <tr><th>Score</th><td>${report.score ?? '—'}</td></tr>
            <tr><th>Percentage</th><td>${report.percentage?.toFixed(2)}%</td></tr>
            <tr><th>Time Taken</th><td>${report.timeTaken ?? '—'} seconds</td></tr>
        </table>
    </div>

    ${report.aiFeedback ? `
    <div class="section">
        <h2>AI Feedback</h2>
        <div class="feedback">${report.aiFeedback}</div>
    </div>` : ''}
</body>
</html>`;

        const printWindow = window.open('', '_blank', 'width=900,height=700');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        // Let content load then trigger print
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };

    const exportOptions = [
        {
            id: 'pdf',
            label: 'PDF Report',
            description: 'Full formatted report',
            icon: FileText,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'hover:border-red-300',
            action: exportPDF
        },
        {
            id: 'json',
            label: 'JSON Data',
            description: 'Raw data export',
            icon: FileJson,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'hover:border-yellow-300',
            action: exportJSON
        },
        {
            id: 'csv',
            label: 'CSV Export',
            description: 'Spreadsheet compatible',
            icon: FileSpreadsheet,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'hover:border-green-300',
            action: exportCSV
        },
    ];

    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Export Report
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Download your exam report in your preferred format
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {exportOptions.map((option) => {
                        const Icon = option.icon;
                        const isExportingThis = exportingFormat === option.id;
                        const isSuccess = successFormat === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={option.action}
                                disabled={!!exportingFormat}
                                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                                    isSuccess
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : `border-gray-200 dark:border-gray-700 ${option.border} hover:shadow-lg`
                                } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                                <div className="flex flex-col items-center space-y-3">
                                    <div className={`p-3 rounded-full ${isSuccess ? 'bg-green-50 dark:bg-green-900/20' : option.bg}`}>
                                        {isSuccess ? (
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        ) : isExportingThis ? (
                                            <Loader2 className={`w-8 h-8 ${option.color} animate-spin`} />
                                        ) : (
                                            <Icon className={`w-8 h-8 ${option.color}`} />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {option.label}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {isSuccess ? '✓ Downloaded!' : isExportingThis ? 'Exporting…' : option.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Printer className="w-5 h-5" />
                        <span>Print Report</span>
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Report Preview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Topic</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{report.topic ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{report.percentage?.toFixed(1)}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Difficulty</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{report.difficulty ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Correct / Wrong / Skipped</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {report.correctAnswers} / {report.wrongAnswers} / {report.skippedAnswers}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Performance</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {report.performanceRating?.replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportExport;