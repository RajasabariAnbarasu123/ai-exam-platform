package com.aiexam.model;

import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.QuestionType;
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
public class Question {
    
    private String id;
    private String questionText;
    private QuestionType type;
    private Difficulty difficulty;
    private List<String> options;
    private String correctAnswer;
    private String explanation;
    private String concept;
    private Integer timeLimit;
    private Map<String, Object> metadata;
}