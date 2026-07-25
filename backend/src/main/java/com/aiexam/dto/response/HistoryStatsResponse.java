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
public class HistoryStatsResponse {
    
    private Long totalExams;
    private Double averageScore;
    private Integer bestScore;
    private Double averagePercentage;
    private Map<String, Long> performanceDistribution;
    private Map<String, Long> statusDistribution;
    private Map<String, Double> topicAverages;
    private Map<String, Double> difficultyAverages;
}