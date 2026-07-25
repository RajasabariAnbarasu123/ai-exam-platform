package com.aiexam.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Calculates scores where each question is worth 100/totalQuestions marks,
 * so the maximum total score is always 100 regardless of question count.
 */
@Component
public class ScoreCalculator {

    /**
     * Calculate marks for a single correct answer.
     * Each question is worth (100 / totalQuestions) marks.
     * Falls back to 10 marks if totalQuestions is 0 or not provided.
     */
    public int calculateScore(String questionType, String difficulty) {
        // Legacy fallback (called without totalQuestions context)
        return 10;
    }

    /**
     * Primary method: marks per question = 100.0 / totalQuestions.
     */
    public double calculateScorePerQuestion(int totalQuestions) {
        if (totalQuestions <= 0) return 10.0;
        return 100.0 / totalQuestions;
    }

    public int calculateTotalScore(Map<String, String> questionTypes, Map<String, String> difficulties) {
        int totalScore = 0;
        for (Map.Entry<String, String> entry : questionTypes.entrySet()) {
            totalScore += calculateScore(entry.getValue(), difficulties.get(entry.getKey()));
        }
        return totalScore;
    }

    public double calculateAccuracy(int correct, int total) {
        if (total == 0) return 0.0;
        return (correct * 100.0) / total;
    }

    public double calculateCompletionRate(int answered, int total) {
        if (total == 0) return 0.0;
        return (answered * 100.0) / total;
    }

    public double calculateScorePercentage(int score, int maxScore) {
        if (maxScore == 0) return 0.0;
        return (score * 100.0) / maxScore;
    }

    public String getPerformanceRating(double percentage) {
        if (percentage >= 90) {
            return "EXCELLENT";
        } else if (percentage >= 75) {
            return "GOOD";
        } else if (percentage >= 60) {
            return "AVERAGE";
        } else {
            return "NEEDS_IMPROVEMENT";
        }
    }

    public Map<String, Double> calculateDetailedMetrics(int correct, int wrong, int skipped, int total) {
        Map<String, Double> metrics = new HashMap<>();
        metrics.put("accuracy", calculateAccuracy(correct, correct + wrong));
        metrics.put("completionRate", calculateCompletionRate(correct + wrong, total));
        metrics.put("correctRate", calculateAccuracy(correct, total));
        metrics.put("wrongRate", calculateAccuracy(wrong, total));
        metrics.put("skipRate", calculateAccuracy(skipped, total));
        return metrics;
    }

    public double calculateWeightedScore(Map<String, Integer> scores, Map<String, Double> weights) {
        double totalWeightedScore = 0;
        double totalWeight = 0;
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            Double weight = weights.get(entry.getKey());
            if (weight != null) {
                totalWeightedScore += entry.getValue() * weight;
                totalWeight += weight;
            }
        }
        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    }
}