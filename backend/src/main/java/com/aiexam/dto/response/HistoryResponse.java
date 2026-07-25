package com.aiexam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoryResponse {
    
    private String id;
    private String topic;
    private String difficulty;
    private String questionType;
    private Integer numberOfQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer skippedAnswers;
    private Integer score;
    private Double percentage;
    private Integer timeTaken;
    private String performanceRating;
    private String status;
    private LocalDateTime createdAt;
    private Map<String, Object> summary;
}