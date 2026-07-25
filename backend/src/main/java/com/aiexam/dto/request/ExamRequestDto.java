package com.aiexam.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamRequestDto {
    
    @NotBlank(message = "Topic is required")
    private String topic;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotBlank(message = "Question type is required")
    private String questionType;

    @NotNull(message = "Number of questions is required")
    private Integer numberOfQuestions;

    private String customTopic;
}