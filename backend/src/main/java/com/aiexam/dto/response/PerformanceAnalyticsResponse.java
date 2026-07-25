package com.aiexam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceAnalyticsResponse {
    
    private Double accuracy;
    private Double completionRate;
    private Double averageTimePerQuestion;
    private Map<String, Double> topicPerformance;
    private Map<String, Double> difficultyPerformance;
    private Map<String, Integer> questionTypeCount;
    private Map<String, Double> weeklyTrend;
    private String performanceRating;
    private String recommendation;
}