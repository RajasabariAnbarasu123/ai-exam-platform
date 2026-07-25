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
public class Feedback {
    
    private String overallFeedback;
    private Double score;
    private String performanceRating;
    private List<String> strengths;
    private List<String> weaknesses;
    private Map<String, String> topicAnalysis;
    private List<Map<String, Object>> wrongAnswerExplanations;
    private Map<String, Object> studyRecommendation;
    private String improvementTip;
    private Map<String, Object> detailedAnalysis;
}