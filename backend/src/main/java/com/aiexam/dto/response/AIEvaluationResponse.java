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
public class AIEvaluationResponse {
    
    private Boolean isCorrect;
    private Double score;
    private String feedback;
    private String explanation;
    private Map<String, Object> details;
    private String improvementTip;
    private String concept;
}