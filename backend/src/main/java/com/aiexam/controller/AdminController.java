package com.aiexam.controller;

import com.aiexam.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> dashboard = adminService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Map<String, Object>> users = adminService.getAllUsers(filter, search, page, size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/exams")
    public ResponseEntity<List<Map<String, Object>>> getAllExams(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Map<String, Object>> exams = adminService.getAllExams(filter, search, page, size);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = adminService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/popular-topics")
    public ResponseEntity<Map<String, Integer>> getPopularTopics() {
        Map<String, Integer> topics = adminService.getPopularTopics();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/popular-difficulties")
    public ResponseEntity<Map<String, Integer>> getPopularDifficulties() {
        Map<String, Integer> difficulties = adminService.getPopularDifficulties();
        return ResponseEntity.ok(difficulties);
    }

    @GetMapping("/popular-question-types")
    public ResponseEntity<Map<String, Integer>> getPopularQuestionTypes() {
        Map<String, Integer> types = adminService.getPopularQuestionTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/ai-usage-stats")
    public ResponseEntity<Map<String, Object>> getAIUsageStats() {
        Map<String, Object> stats = adminService.getAIUsageStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/daily-active-users")
    public ResponseEntity<Map<String, Integer>> getDailyActiveUsers() {
        Map<String, Integer> users = adminService.getDailyActiveUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable String userId,
            @RequestParam String role) {
        Map<String, Object> response = adminService.updateUserRole(userId, role);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/exams/{examId}")
    public ResponseEntity<Void> deleteExam(@PathVariable String examId) {
        adminService.deleteExam(examId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = adminService.getSystemHealth();
        return ResponseEntity.ok(health);
    }

    @GetMapping("/performance-metrics")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics() {
        Map<String, Object> metrics = adminService.getPerformanceMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        Map<String, Object> settings = adminService.getSettings();
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> settings) {
        Map<String, Object> updated = adminService.updateSettings(settings);
        return ResponseEntity.ok(updated);
    }
}