import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const ExamTimer = ({ timeRemaining, totalTime, onTimeUp, inverted = false }) => {
    const [isWarning, setIsWarning] = useState(false);
    const [isCritical, setIsCritical] = useState(false);

    useEffect(() => {
        const criticalThreshold = 30;
        const warningThreshold = 60;

        if (timeRemaining <= criticalThreshold) {
            setIsCritical(true);
            setIsWarning(false);
        } else if (timeRemaining <= warningThreshold) {
            setIsWarning(true);
            setIsCritical(false);
        } else {
            setIsWarning(false);
            setIsCritical(false);
        }
    }, [timeRemaining, totalTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Inverted = used inside the dark gradient header; regular = standalone card
    if (inverted) {
        const color = isCritical ? '#ef4444' : isWarning ? '#fbbf24' : '#ffffff';
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    padding: '6px 14px',
                    border: isCritical ? '1.5px solid rgba(239,68,68,0.7)' : '1.5px solid rgba(255,255,255,0.2)',
                }}
            >
                <Clock size={16} style={{ color }} />
                <span
                    style={{
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        color,
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '0.02em',
                        animation: isCritical ? 'pulse 1s infinite' : 'none',
                    }}
                >
                    {formatTime(timeRemaining)}
                </span>
                {isCritical && <AlertCircle size={15} style={{ color: '#ef4444', animation: 'pulse 1s infinite' }} />}
            </div>
        );
    }

    // Standard card variant
    const getColor = () => {
        if (isCritical) return 'text-red-500';
        if (isWarning) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getBgColor = () => {
        if (isCritical) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        if (isWarning) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    };

    const progressPct = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 100;
    const progressColor = isCritical ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';

    return (
        <div className={`flex flex-col items-center px-4 py-2 rounded-xl border ${getBgColor()} min-w-[120px]`}>
            <div className="flex items-center space-x-2">
                <Clock className={`w-4 h-4 ${getColor()}`} />
                <div className={`text-xl font-bold tabular-nums ${getColor()} ${isCritical ? 'animate-pulse' : ''}`}>
                    {formatTime(timeRemaining)}
                </div>
                {isCritical && (
                    <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                )}
            </div>
            {totalTime && (
                <div className="w-full mt-1">
                    <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${progressPct}%`, backgroundColor: progressColor }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-0.5">
                        of {formatTime(totalTime)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamTimer;
