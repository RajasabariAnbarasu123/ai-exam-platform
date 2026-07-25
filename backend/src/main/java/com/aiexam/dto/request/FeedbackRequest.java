package com.aiexam.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {
    
    private String examId;
    private String userId;
    private Integer score;
    private Double percentage;
    private String performanceRating;
    private String topic;
    private String difficulty;
    private String questionType;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer skippedAnswers;
    private Integer totalQuestions;
    private Integer timeTaken;
}