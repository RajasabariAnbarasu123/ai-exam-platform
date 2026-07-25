package com.aiexam.controller;

import com.aiexam.dto.request.AnswerSubmitDto;
import com.aiexam.dto.request.ExamRequestDto;
import com.aiexam.dto.response.ApiResponse;
import com.aiexam.dto.response.ExamResponse;
import com.aiexam.dto.response.ResultResponse;
import com.aiexam.service.AdminService;
import com.aiexam.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final AdminService adminService;

    @PostMapping("/generate")
    public ResponseEntity<ExamResponse> generateExam(
            @Valid @RequestBody ExamRequestDto examRequest,
            Authentication authentication) {
        String userId = authentication.getName();
        ExamResponse response = examService.generateExam(examRequest, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<ResultResponse> submitExam(
            @RequestBody List<AnswerSubmitDto> answers,
            @RequestParam String examId,
            Authentication authentication) {
        String userId = authentication.getName();
        ResultResponse response = examService.submitExam(examId, answers, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit-single")
    public ResponseEntity<ApiResponse> submitSingleAnswer(
            @Valid @RequestBody AnswerSubmitDto answer,
            Authentication authentication) {
        String userId = authentication.getName();
        ApiResponse response = examService.submitSingleAnswer(answer, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/timer-settings")
    public ResponseEntity<Map<String, Object>> getTimerSettings(
            @RequestParam String difficulty,
            @RequestParam String questionType) {
        Map<String, Object> settings = new java.util.HashMap<>(examService.getTimerSettings(difficulty, questionType));
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/{examId}")
    public ResponseEntity<ExamResponse> getExam(
            @PathVariable String examId,
            Authentication authentication) {
        String userId = authentication.getName();
        ExamResponse response = examService.getExam(examId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{examId}")
    public ResponseEntity<Map<String, Object>> getExamStatus(
            @PathVariable String examId,
            Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> status = examService.getExamStatus(examId, userId);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/retry-generation")
    public ResponseEntity<ExamResponse> retryGeneration(
            @Valid @RequestBody ExamRequestDto examRequest,
            Authentication authentication) {
        String userId = authentication.getName();
        ExamResponse response = examService.retryGeneration(examRequest, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auto-submit/{examId}")
    public ResponseEntity<ResultResponse> autoSubmitExam(
            @PathVariable String examId,
            Authentication authentication) {
        String userId = authentication.getName();
        ResultResponse response = examService.autoSubmitExam(examId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Public endpoint: returns exam-related system settings so the user form
     * can respect admin-configured minQuestions, maxQuestions and defaultDifficulty.
     */
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getExamSettings() {
        Map<String, Object> all = adminService.getSettings();
        Map<String, Object> examSettings = new java.util.HashMap<>();
        examSettings.put("minQuestions", all.getOrDefault("minQuestions", 5));
        examSettings.put("maxQuestions", all.getOrDefault("maxQuestions", 30));
        examSettings.put("defaultDifficulty", all.getOrDefault("defaultDifficulty", "MEDIUM"));
        return ResponseEntity.ok(examSettings);
    }
}