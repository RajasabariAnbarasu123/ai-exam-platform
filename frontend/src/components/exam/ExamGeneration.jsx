import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { showToast } from '../common/ToastNotifications';

const ExamGeneration = ({ examId, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('generating');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const generateQuestions = async () => {
            try {
                // Simulate generation progress
                const steps = [
                    { progress: 20, message: 'Analyzing topic...' },
                    { progress: 40, message: 'Generating questions...' },
                    { progress: 60, message: 'Validating questions...' },
                    { progress: 80, message: 'Formatting exam...' },
                    { progress: 100, message: 'Ready!' }
                ];

                for (const step of steps) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setProgress(step.progress);
                    setStatus(step.message);
                }

                // Complete generation
                setStatus('complete');
                showToast.success('Exam generated successfully!');
                setTimeout(() => {
                    if (onComplete) onComplete();
                    navigate('/exam/taking', { state: { examId } });
                }, 1000);

            } catch (err) {
                setError(err.message || 'Failed to generate exam');
                setStatus('error');
                showToast.error('Failed to generate exam');
            }
        };

        generateQuestions();
    }, [examId, navigate, onComplete]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Generation Failed
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="glass-card p-8 max-w-md w-full text-center">
                {status === 'complete' ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                    </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {status === 'complete' ? 'Ready!' : 'Generating Your Exam'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {status === 'complete' ? 'Your exam is ready to start!' : status}
                </p>

                {status !== 'complete' && (
                    <div className="space-y-2">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {progress}% complete
                        </p>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="flex items-center space-x-2 justify-center text-green-500">
                        <CheckCircle className="w-5 h-5" />
                        <span>Redirecting to exam...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamGeneration;