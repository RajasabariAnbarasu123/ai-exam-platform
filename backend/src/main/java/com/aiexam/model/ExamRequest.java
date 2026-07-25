package com.aiexam.model;

import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamRequest {
    
    @NotBlank(message = "Topic is required")
    private String topic;
    
    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;
    
    @NotNull(message = "Question type is required")
    private QuestionType questionType;
    
    @NotNull(message = "Number of questions is required")
    @Min(value = 5, message = "Minimum 5 questions")
    @Max(value = 30, message = "Maximum 30 questions")
    private Integer numberOfQuestions;
    
    private String customTopic;
}