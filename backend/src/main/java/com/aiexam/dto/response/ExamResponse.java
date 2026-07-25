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
public class ExamResponse {
    
    private String examId;
    private String topic;
    private String difficulty;
    private String questionType;
    private Integer numberOfQuestions;
    private List<Map<String, Object>> questions;
    private Map<String, Integer> timerSettings;
    private Long generationTime;
    private String status;
}