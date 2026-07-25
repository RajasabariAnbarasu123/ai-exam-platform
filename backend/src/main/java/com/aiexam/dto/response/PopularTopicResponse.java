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
public class PopularTopicResponse {
    
    private String topic;
    private Integer examCount;
    private Double averageScore;
    private Integer totalQuestions;
    private Map<String, Object> statistics;
}