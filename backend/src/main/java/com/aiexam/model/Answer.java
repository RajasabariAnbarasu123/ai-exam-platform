package com.aiexam.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Answer {
    
    private String questionId;
    private Object answer;
    private Integer timeTaken;
    private Boolean isSkipped;
    private Boolean isCorrect;
    private String explanation;
    private String correctAnswer;
}