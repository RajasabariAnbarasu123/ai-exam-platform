package com.aiexam.controller;

import com.aiexam.dto.response.DashboardResponse;
import com.aiexam.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData(Authentication authentication) {
        String userId = authentication.getName();
        DashboardResponse response = dashboardService.getDashboardData(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/weekly-performance")
    public ResponseEntity<Map<String, Object>> getWeeklyPerformance(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> performance = dashboardService.getWeeklyPerformance(userId);
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/difficulty-analysis")
    public ResponseEntity<Map<String, Object>> getDifficultyAnalysis(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> analysis = dashboardService.getDifficultyAnalysis(userId);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/question-type-analysis")
    public ResponseEntity<Map<String, Object>> getQuestionTypeAnalysis(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> analysis = dashboardService.getQuestionTypeAnalysis(userId);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/recent-exams")
    public ResponseEntity<Map<String, Object>> getRecentExams(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> recentExams = dashboardService.getRecentExams(userId);
        return ResponseEntity.ok(recentExams);
    }

    @GetMapping("/overall-stats")
    public ResponseEntity<Map<String, Object>> getOverallStats(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> stats = dashboardService.getOverallStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/strength-weakness")
    public ResponseEntity<Map<String, Object>> getStrengthWeakness(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> analysis = dashboardService.getStrengthWeakness(userId);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/subject-wise-performance")
    public ResponseEntity<Map<String, Object>> getSubjectWisePerformance(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> performance = dashboardService.getSubjectWisePerformance(userId);
        return ResponseEntity.ok(performance);
    }
}