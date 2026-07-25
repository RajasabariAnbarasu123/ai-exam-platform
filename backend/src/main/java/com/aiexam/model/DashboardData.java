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
public class DashboardData {
    
    private String userName;
    private Integer totalExamsTaken;
    private Double averageScore;
    private Integer bestScore;
    private Integer totalQuestionsAttempted;
    private Double accuracyPercentage;
    private Map<String, Object> weeklyPerformance;
    private Map<String, Object> difficultyAnalysis;
    private Map<String, Object> questionTypeAnalysis;
    private List<Map<String, Object>> recentExamHistory;
    private Map<String, Object> overallStats;
    private Map<String, Object> strengthAndWeakness;
    private Map<String, Object> subjectWisePerformance;
}