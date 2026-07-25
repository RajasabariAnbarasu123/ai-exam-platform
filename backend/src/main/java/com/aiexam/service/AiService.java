package com.aiexam.service;

import com.aiexam.client.OpenAiClient;
import com.aiexam.exception.AiGenerationException;
import com.aiexam.util.AiPromptBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final OpenAiClient openAiClient;
    private final AiPromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    public List<Map<String, Object>> generateQuestions(String prompt) {
        try {
            log.debug("Generating questions with prompt: {}", prompt);
            
            String response = openAiClient.generateQuestions(prompt);
            log.info("Raw AI response (first 500 chars): {}",
                    response != null && response.length() > 500 ? response.substring(0, 500) + "..." : response);
            
            // Parse the response
            return parseAIResponse(response);
            
        } catch (Exception e) {
            log.error("Error generating questions: {}", e.getMessage(), e);
            throw new AiGenerationException("Failed to generate questions: " + e.getMessage());
        }
    }

    public String evaluateAnswer(String question, String userAnswer, String correctAnswer, String questionType) {
        try {
            String prompt = promptBuilder.buildEvaluationPrompt(question, userAnswer, correctAnswer, questionType);
            return openAiClient.evaluateAnswer(prompt);
        } catch (Exception e) {
            log.error("Error evaluating answer: {}", e.getMessage(), e);
            return "Evaluation failed: " + e.getMessage();
        }
    }

    public String generateFeedback(Map<String, Object> examData) {
        try {
            String prompt = promptBuilder.buildFeedbackPrompt(examData);
            return openAiClient.generateFeedback(prompt);
        } catch (Exception e) {
            log.error("Error generating feedback: {}", e.getMessage(), e);
            return "Feedback generation failed: " + e.getMessage();
        }
    }

    public String evaluateCodingQuestion(String question, String userCode, String testCases) {
        try {
            String prompt = promptBuilder.buildCodingEvaluationPrompt(question, userCode, testCases);
            return openAiClient.evaluateCoding(prompt);
        } catch (Exception e) {
            log.error("Error evaluating coding question: {}", e.getMessage(), e);
            return "Coding evaluation failed: " + e.getMessage();
        }
    }

    private List<Map<String, Object>> parseAIResponse(String response) {
        try {
            // Step 1: Strip markdown code fences that Gemini wraps JSON in.
            // e.g.  ```json\n[...]\n```  or  ```\n[...]\n```
            String cleaned = response.trim();
            if (cleaned.startsWith("```")) {
                // Remove the opening fence (```json or just ```)
                int newlineIdx = cleaned.indexOf('\n');
                if (newlineIdx != -1) {
                    cleaned = cleaned.substring(newlineIdx + 1).trim();
                }
                // Remove the closing fence
                if (cleaned.endsWith("```")) {
                    cleaned = cleaned.substring(0, cleaned.lastIndexOf("```")).trim();
                }
            }

            log.debug("Cleaned AI response for parsing: {}", cleaned.length() > 500 ? cleaned.substring(0, 500) + "..." : cleaned);

            // Step 2: Try to parse as a JSON array directly
            if (cleaned.startsWith("[")) {
                return objectMapper.readValue(cleaned, List.class);
            }

            // Step 3: Try to extract the first JSON array anywhere in the text
            int startIdx = cleaned.indexOf('[');
            int endIdx   = cleaned.lastIndexOf(']');
            if (startIdx != -1 && endIdx != -1 && startIdx < endIdx) {
                String jsonStr = cleaned.substring(startIdx, endIdx + 1);
                return objectMapper.readValue(jsonStr, List.class);
            }

            // Step 4: Fallback — try plain-text parsing
            log.warn("Could not find JSON array in AI response. Attempting plain-text parse.");
            return parsePlainTextResponse(response);

        } catch (Exception e) {
            log.error("Error parsing AI response: {} | Response snippet: {}",
                    e.getMessage(),
                    response.length() > 300 ? response.substring(0, 300) : response);
            return parsePlainTextResponse(response);
        }
    }


    private List<Map<String, Object>> parsePlainTextResponse(String response) {
        List<Map<String, Object>> questions = new ArrayList<>();
        String[] lines = response.split("\n");
        
        Map<String, Object> currentQuestion = null;
        List<String> options = new ArrayList<>();
        
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            
            if (line.matches("^\\d+\\..*") || line.matches("^Q\\d+.*")) {
                if (currentQuestion != null) {
                    if (!options.isEmpty()) {
                        currentQuestion.put("options", new ArrayList<>(options));
                        options.clear();
                    }
                    questions.add(currentQuestion);
                }
                currentQuestion = new java.util.HashMap<>();
                currentQuestion.put("question", line.replaceFirst("^\\d+\\.\\s*", "").replaceFirst("^Q\\d+\\s*", ""));
            } else if (line.matches("^[A-D]\\.\\s*.*") || line.matches("^[A-D]\\)\\s*.*")) {
                options.add(line.replaceFirst("^[A-D][\\.\\)]\\s*", ""));
            } else if (currentQuestion != null) {
                if (line.toLowerCase().contains("answer:")) {
                    String answer = line.split(":")[1].trim();
                    currentQuestion.put("correctAnswer", answer);
                } else if (line.toLowerCase().contains("explanation:")) {
                    String explanation = line.split(":")[1].trim();
                    currentQuestion.put("explanation", explanation);
                }
            }
        }
        
        if (currentQuestion != null) {
            if (!options.isEmpty()) {
                currentQuestion.put("options", new ArrayList<>(options));
            }
            questions.add(currentQuestion);
        }
        
        return questions;
    }

    public List<Map<String, Object>> retryGeneration(String prompt) {
        int maxRetries = 3;
        int retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                return generateQuestions(prompt);
            } catch (AiGenerationException e) {
                retryCount++;
                log.warn("AI generation failed (attempt {}): {}", retryCount, e.getMessage());
                if (retryCount == maxRetries) {
                    throw new AiGenerationException("Failed to generate questions after " + maxRetries + " attempts");
                }
                // Wait before retrying
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new AiGenerationException("Retry interrupted");
                }
            }
        }
        throw new AiGenerationException("Failed to generate questions");
    }
}