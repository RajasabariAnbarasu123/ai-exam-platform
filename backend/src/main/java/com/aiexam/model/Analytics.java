package com.aiexam.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Analytics {
    
    private Integer totalExams;
    private Double averageScore;
    private Double averagePercentage;
    private Integer bestScore;
    private Double overallAccuracy;
    private Map<String, Object> difficultyDistribution;
    private Map<String, Object> questionTypeDistribution;
    private Map<String, Object> topicPerformance;
    private Map<String, Object> weeklyTrends;
    private Map<String, Object> monthlyTrends;
    private Map<String, Object> performanceMetrics;
    private List<Map<String, Object>> recentActivities;
}