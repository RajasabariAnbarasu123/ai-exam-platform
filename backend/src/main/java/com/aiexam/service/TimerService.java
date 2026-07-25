package com.aiexam.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TimerService {

    private static final Map<String, Map<String, Integer>> TIMER_CONFIG = new HashMap<>();

    static {
        // Easy difficulty timers
        Map<String, Integer> easyTimers = new HashMap<>();
        easyTimers.put("MCQ", 30);
        easyTimers.put("TRUE_FALSE", 20);
        easyTimers.put("FILL_IN_THE_BLANK", 30);
        easyTimers.put("SHORT_ANSWER", 60);
        easyTimers.put("CODING", 300);

        // Medium difficulty timers
        Map<String, Integer> mediumTimers = new HashMap<>();
        mediumTimers.put("MCQ", 45);
        mediumTimers.put("TRUE_FALSE", 30);
        mediumTimers.put("FILL_IN_THE_BLANK", 45);
        mediumTimers.put("SHORT_ANSWER", 90);
        mediumTimers.put("CODING", 600);

        // Hard difficulty timers
        Map<String, Integer> hardTimers = new HashMap<>();
        hardTimers.put("MCQ", 60);
        hardTimers.put("TRUE_FALSE", 45);
        hardTimers.put("FILL_IN_THE_BLANK", 60);
        hardTimers.put("SHORT_ANSWER", 120);
        hardTimers.put("CODING", 900);

        TIMER_CONFIG.put("EASY", easyTimers);
        TIMER_CONFIG.put("MEDIUM", mediumTimers);
        TIMER_CONFIG.put("HARD", hardTimers);
    }

    public Map<String, Integer> getTimerSettings(String difficulty, String questionType) {
        Map<String, Integer> timers = TIMER_CONFIG.get(difficulty.toUpperCase());
        if (timers == null) {
            throw new IllegalArgumentException("Invalid difficulty: " + difficulty);
        }

        Integer timer = timers.get(questionType.toUpperCase());
        if (timer == null) {
            throw new IllegalArgumentException("Invalid question type: " + questionType);
        }

        Map<String, Integer> settings = new HashMap<>();
        settings.put("timeLimit", timer);
        settings.put("warningThreshold", timer / 2);
        settings.put("criticalThreshold", timer / 5);
        
        return settings;
    }

    public int getTimeLimit(String difficulty, String questionType) {
        Map<String, Integer> timers = TIMER_CONFIG.get(difficulty.toUpperCase());
        if (timers == null) {
            throw new IllegalArgumentException("Invalid difficulty: " + difficulty);
        }

        Integer timer = timers.get(questionType.toUpperCase());
        if (timer == null) {
            throw new IllegalArgumentException("Invalid question type: " + questionType);
        }

        return timer;
    }

    public boolean isTimeExpired(String difficulty, String questionType, int timeTaken) {
        int timeLimit = getTimeLimit(difficulty, questionType);
        return timeTaken >= timeLimit;
    }

    public int getRemainingTime(String difficulty, String questionType, int timeTaken) {
        int timeLimit = getTimeLimit(difficulty, questionType);
        return Math.max(0, timeLimit - timeTaken);
    }

    public String getTimeStatus(String difficulty, String questionType, int timeTaken) {
        int timeLimit = getTimeLimit(difficulty, questionType);
        int remaining = timeLimit - timeTaken;
        
        if (remaining <= 0) {
            return "EXPIRED";
        } else if (remaining <= timeLimit / 5) {
            return "CRITICAL";
        } else if (remaining <= timeLimit / 2) {
            return "WARNING";
        } else {
            return "OK";
        }
    }
}