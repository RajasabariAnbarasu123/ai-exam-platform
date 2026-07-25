package com.aiexam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultResponse {
    
    private String resultId;
    private String examId;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer skippedAnswers;
    private Integer score;
    private Double percentage;
    private Double accuracy;
    private Integer timeTaken;
    private String performanceRating;
    private String difficulty;
    private String questionType;
    private String topic;
    private String status;
    private LocalDateTime createdAt;
    private List<Map<String, Object>> detailedResults;
    private Map<String, Object> strengthAndWeakness;
    private String aiFeedback;
    private Map<String, Object> analytics;
}