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
public class ExamStatusResponse {
    
    private String examId;
    private String status;
    private Integer totalQuestions;
    private Integer answeredQuestions;
    private Integer remainingQuestions;
    private Long timeElapsed;
    private Long timeRemaining;
    private Map<String, Object> questionStatus;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
}