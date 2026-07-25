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
public class UserExamStatsResponse {
    
    private Long totalExams;
    private Double avgPercentage;
    private Double accuracy;
    private Integer bestScore;
    private String bestTopic;
    private String weakTopic;
    private Map<String, Double> topicAverages;
    private Map<String, Long> difficultyCounts;
    private Map<String, Long> questionTypeCounts;
}