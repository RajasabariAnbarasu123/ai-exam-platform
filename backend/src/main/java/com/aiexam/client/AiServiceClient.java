package com.aiexam.client;

import com.aiexam.exception.AiGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AiServiceClient {

    private final OpenAiClient openAiClient;

    public List<Map<String, Object>> generateQuestions(String prompt) {
        String response = openAiClient.generateQuestions(prompt);
        return parseQuestionsFromResponse(response);
    }

    public String evaluateAnswer(String question, String userAnswer, String correctAnswer, String questionType) {
        String evaluationPrompt = String.format(
                "Question: %s\nUser Answer: %s\nCorrect Answer: %s\nQuestion Type: %s\n\nEvaluate the answer.",
                question, userAnswer, correctAnswer, questionType
        );
        return openAiClient.evaluateAnswer(evaluationPrompt);
    }

    public String generateFeedback(Map<String, Object> examData) {
        String feedbackPrompt = buildFeedbackPrompt(examData);
        return openAiClient.generateFeedback(feedbackPrompt);
    }

    public String evaluateCodingQuestion(String question, String userCode, String testCases) {
        String codingPrompt = String.format(
                "Question: %s\nCode: %s\nTest Cases: %s\n\nEvaluate the code.",
                question, userCode, testCases
        );
        return openAiClient.evaluateCoding(codingPrompt);
    }

    private List<Map<String, Object>> parseQuestionsFromResponse(String response) {
        try {
            // Simple parsing logic - in production, use proper JSON parsing
            List<Map<String, Object>> questions = new ArrayList<>();
            // Parse the response and convert to list of question maps
            // This is a simplified version
            return questions;
        } catch (Exception e) {
            log.error("Error parsing questions: {}", e.getMessage(), e);
            throw new AiGenerationException("Failed to parse generated questions");
        }
    }

    private String buildFeedbackPrompt(Map<String, Object> examData) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate feedback for exam:\n");
        prompt.append("Topic: ").append(examData.get("topic")).append("\n");
        prompt.append("Score: ").append(examData.get("score")).append("%\n");
        prompt.append("Performance Rating: ").append(examData.get("performanceRating")).append("\n");
        return prompt.toString();
    }
}