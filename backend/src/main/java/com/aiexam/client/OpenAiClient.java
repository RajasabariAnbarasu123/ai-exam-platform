package com.aiexam.client;

import com.aiexam.exception.AiGenerationException;
import com.aiexam.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OpenAiClient {

    private final RestTemplate restTemplate;
    private final SystemSettingService systemSettingService;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${openai.api.model:gemini-3.5-flash}")
    private String model;

    @Value("${openai.api.max-tokens:4000}")
    private int maxTokens;

    @Value("${openai.api.temperature:0.7}")
    private double temperature;

    public String generateQuestions(String prompt) {
        try {
            HttpHeaders headers = createHeaders();
            Map<String, Object> requestBody = buildChatRequest(prompt, 
                "You are an expert exam question generator. Generate questions in valid JSON format.");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return extractContentFromResponse(response);
            
        } catch (Exception e) {
            log.error("Error calling OpenAI API for question generation: {}", e.getMessage(), e);
            throw new AiGenerationException("Failed to generate questions: " + e.getMessage());
        }
    }

    public String evaluateAnswer(String prompt) {
        try {
            HttpHeaders headers = createHeaders();
            Map<String, Object> requestBody = buildChatRequest(prompt, 
                "You are an expert exam evaluator. Provide concise and constructive evaluation.");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return extractContentFromResponse(response);
            
        } catch (Exception e) {
            log.error("Error calling OpenAI API for evaluation: {}", e.getMessage(), e);
            return "Evaluation failed: " + e.getMessage();
        }
    }

    public String generateFeedback(String prompt) {
        try {
            HttpHeaders headers = createHeaders();
            Map<String, Object> requestBody = buildChatRequest(prompt, 
                "You are an expert educational coach. Provide detailed personalized feedback with actionable insights.");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return extractContentFromResponse(response);
            
        } catch (Exception e) {
            log.error("Error calling OpenAI API for feedback: {}", e.getMessage(), e);
            return "Feedback generation failed: " + e.getMessage();
        }
    }

    public String evaluateCoding(String prompt) {
        try {
            HttpHeaders headers = createHeaders();
            Map<String, Object> requestBody = buildChatRequest(prompt, 
                "You are an expert code reviewer. Evaluate code thoroughly for correctness, efficiency, and quality.");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return extractContentFromResponse(response);
            
        } catch (Exception e) {
            log.error("Error calling OpenAI API for coding evaluation: {}", e.getMessage(), e);
            return "Code evaluation failed: " + e.getMessage();
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    private Map<String, Object> buildChatRequest(String userPrompt, String systemPrompt) {
        String activeModel = systemSettingService != null ? systemSettingService.get("aiModel", model) : model;
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", activeModel);
        requestBody.put("messages", new Object[]{
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        });
        requestBody.put("temperature", temperature);
        requestBody.put("max_tokens", maxTokens);
        return requestBody;
    }

    private String extractContentFromResponse(ResponseEntity<Map> response) {
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            if (responseBody.containsKey("choices") && responseBody.get("choices") instanceof java.util.List) {
                java.util.List<Map<String, Object>> choices = (java.util.List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    if (choice.containsKey("message") && choice.get("message") instanceof Map) {
                        Map<String, Object> message = (Map<String, Object>) choice.get("message");
                        if (message.containsKey("content")) {
                            return (String) message.get("content");
                        }
                    }
                }
            }
        }
        throw new AiGenerationException("Invalid response from OpenAI API");
    }
}