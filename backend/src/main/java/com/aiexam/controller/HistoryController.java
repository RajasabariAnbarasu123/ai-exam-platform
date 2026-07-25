package com.aiexam.controller;

import com.aiexam.dto.response.HistoryResponse;
import com.aiexam.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    public ResponseEntity<Page<HistoryResponse>> getExamHistory(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String questionType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        String userId = authentication.getName();
        Page<HistoryResponse> history = historyService.getExamHistory(userId, pageable, topic, difficulty, questionType, status, search);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoryResponse> getHistoryById(
            @PathVariable String id,
            Authentication authentication) {
        String userId = authentication.getName();
        HistoryResponse response = historyService.getHistoryById(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/topics")
    public ResponseEntity<List<String>> getUniqueTopics(Authentication authentication) {
        String userId = authentication.getName();
        List<String> topics = historyService.getUniqueTopics(userId);
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/difficulties")
    public ResponseEntity<List<String>> getUniqueDifficulties(Authentication authentication) {
        String userId = authentication.getName();
        List<String> difficulties = historyService.getUniqueDifficulties(userId);
        return ResponseEntity.ok(difficulties);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getHistoryStats(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> stats = historyService.getHistoryStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<HistoryResponse>> searchHistory(
            Authentication authentication,
            @RequestParam String query,
            @PageableDefault(size = 10) Pageable pageable) {
        String userId = authentication.getName();
        Page<HistoryResponse> results = historyService.searchHistory(userId, query, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/filter-options")
    public ResponseEntity<Map<String, Object>> getFilterOptions(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> options = historyService.getFilterOptions(userId);
        return ResponseEntity.ok(options);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        historyService.deleteHistory(id, userId);
        return ResponseEntity.ok().build();
    }
}