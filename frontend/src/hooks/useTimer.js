import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = ({ initialTime = 30, onExpire = null, autoStart = true }) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [isExpired, setIsExpired] = useState(false);
    const timerRef = useRef(null);

    const start = useCallback(() => {
        setIsRunning(true);
        setIsExpired(false);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback((newTime = initialTime) => {
        setTimeRemaining(newTime);
        setIsExpired(false);
        setIsRunning(autoStart);
    }, [initialTime, autoStart]);

    const stop = useCallback(() => {
        setIsRunning(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setIsExpired(true);
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isRunning, timeRemaining]);

    useEffect(() => {
        if (timeRemaining === 0 && isExpired) {
            if (onExpire) {
                onExpire();
            }
        }
    }, [timeRemaining, isExpired, onExpire]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    return {
        timeRemaining,
        isRunning,
        isExpired,
        start,
        pause,
        reset,
        stop,
        setTimeRemaining
    };
};