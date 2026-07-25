package com.aiexam.model;

import com.aiexam.model.enums.PerformanceRating;
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
public class Result {
    
    private String id;
    private String examId;
    private String userId;
    private String topic;
    private String difficulty;
    private String questionType;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer skippedAnswers;
    private Integer score;
    private Double percentage;
    private Integer timeTaken;
    private PerformanceRating performanceRating;
    private List<Answer> answers;
    private String aiFeedback;
    private Map<String, Object> analytics;
    private LocalDateTime createdAt;
}