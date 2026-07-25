package com.aiexam.controller;

import com.aiexam.dto.response.FeedbackResponse;
import com.aiexam.dto.response.ResultResponse;
import com.aiexam.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> getResult(
            @PathVariable String id,
            Authentication authentication) {
        String userId = authentication.getName();
        ResultResponse response = resultService.getResult(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/feedback/{resultId}")
    public ResponseEntity<FeedbackResponse> getAIFeedback(
            @PathVariable String resultId,
            Authentication authentication) {
        String userId = authentication.getName();
        FeedbackResponse response = resultService.getAIFeedback(resultId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/{resultId}")
    public ResponseEntity<Map<String, Object>> getResultAnalytics(
            @PathVariable String resultId,
            Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> analytics = resultService.getResultAnalytics(resultId, userId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/performance-rating")
    public ResponseEntity<Map<String, String>> getPerformanceRating(
            @RequestParam double percentage) {
        Map<String, String> rating = resultService.getPerformanceRating(percentage);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/summary/{resultId}")
    public ResponseEntity<Map<String, Object>> getResultSummary(
            @PathVariable String resultId,
            Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> summary = resultService.getResultSummary(resultId, userId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/export-pdf/{resultId}")
    public ResponseEntity<byte[]> exportResultPDF(
            @PathVariable String resultId,
            Authentication authentication) {
        String userId = authentication.getName();
        byte[] pdf = resultService.exportResultPDF(resultId, userId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=exam-report.pdf")
                .body(pdf);
    }
}