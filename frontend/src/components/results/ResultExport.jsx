import React, { useState } from 'react';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { showToast } from '../common/ToastNotifications';
import { useResults } from '../../hooks/useResults';

const ResultExport = ({ resultId, result }) => {
    const { exportResult } = useResults();
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const handleExport = async (format) => {
        setIsExporting(true);
        setExportSuccess(false);
        
        try {
            if (format === 'json') {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result || { resultId }, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `exam-result-${resultId}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                
                setExportSuccess(true);
                showToast.success('Report exported successfully as JSON');
                setTimeout(() => setExportSuccess(false), 3000);
            } else {
                const blob = await exportResult(resultId, format);
                
                // Create download link
                const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.download = `exam-result-${resultId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                setExportSuccess(true);
                showToast.success('Report exported successfully as PDF');
                setTimeout(() => setExportSuccess(false), 3000);
            }
        } catch (error) {
            showToast.error(`Failed to export as ${format.toUpperCase()}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
            >
                {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : exportSuccess ? (
                    <CheckCircle className="w-4 h-4" />
                ) : (
                    <FileText className="w-4 h-4" />
                )}
                <span>Export PDF</span>
            </button>
            
            <button
                onClick={() => handleExport('json')}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
            >
                <Download className="w-4 h-4" />
                <span>JSON</span>
            </button>
        </div>
    );
};

export default ResultExport;