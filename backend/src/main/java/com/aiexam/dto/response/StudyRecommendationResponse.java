package com.aiexam.dto.response;

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
public class StudyRecommendationResponse {
    
    private Integer hoursPerWeek;
    private Integer codingQuestions;
    private Integer mcqs;
    private List<String> topicsToReview;
    private List<String> recommendedResources;
    private Map<String, String> dailyPlan;
    private String overallStrategy;
}