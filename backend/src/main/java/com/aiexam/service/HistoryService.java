package com.aiexam.service;

import com.aiexam.dto.response.HistoryResponse;
import com.aiexam.exception.ResourceNotFoundException;
import com.aiexam.model.ExamHistory;
import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.QuestionType;
import com.aiexam.model.enums.Status;
import com.aiexam.repository.ExamHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HistoryService {

    private final ExamHistoryRepository historyRepository;

    public Page<HistoryResponse> getExamHistory(String userId, Pageable pageable, 
                                                String topic, String difficulty, 
                                                String questionType, String status,
                                                String search) {
        Boolean passed = null;
        Status stat = null;
        if (status != null && !status.trim().isEmpty()) {
            String upper = status.trim().toUpperCase();
            if (upper.equals("PASSED")) {
                passed = true;
            } else if (upper.equals("FAILED")) {
                passed = false;
            } else {
                try {
                    stat = Status.valueOf(upper);
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid status filter value: {}", upper);
                }
            }
        }
        Difficulty diff = (difficulty != null && !difficulty.trim().isEmpty()) ? Difficulty.valueOf(difficulty.toUpperCase().trim()) : null;
        QuestionType qType = (questionType != null && !questionType.trim().isEmpty()) ? QuestionType.valueOf(questionType.toUpperCase().trim()) : null;
        String cleanTopic = (topic != null && !topic.trim().isEmpty()) ? topic.trim() : null;
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        Page<ExamHistory> historyPage = historyRepository.findWithFiltersAndSearch(
                userId, cleanTopic, diff, qType, stat, passed, cleanSearch, pageable);

        return historyPage.map(this::convertToHistoryResponse);
    }

    public HistoryResponse getHistoryById(String id, String userId) {
        ExamHistory history = historyRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("History record not found"));
        return convertToHistoryResponse(history);
    }

    public List<String> getUniqueTopics(String userId) {
        return historyRepository.findDistinctTopics(userId);
    }

    public List<String> getUniqueDifficulties(String userId) {
        return historyRepository.findDistinctDifficulties(userId)
                .stream()
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getHistoryStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalExams = historyRepository.countExamsByUser(userId);
        Double averageScore = historyRepository.getAverageScore(userId);
        Integer bestScore = historyRepository.getMaxScore(userId);
        Double averagePercentage = historyRepository.getAveragePercentage(userId);
        
        stats.put("totalExams", totalExams);
        stats.put("averageScore", averageScore != null ? averageScore : 0);
        stats.put("bestScore", bestScore != null ? bestScore : 0);
        stats.put("averagePercentage", averagePercentage != null ? averagePercentage : 0);
        
        // Performance distribution
        List<Object[]> distribution = historyRepository.getPerformanceDistribution(userId);
        Map<String, Long> performanceDistribution = distribution.stream()
                .collect(Collectors.toMap(
                        obj -> obj[0] != null ? obj[0].toString() : "UNKNOWN",
                        obj -> (Long) obj[1]
                ));
        stats.put("performanceDistribution", performanceDistribution);
        
        // Status counts
        List<Object[]> statusCounts = historyRepository.getStatusCounts(userId);
        Map<String, Long> statusDistribution = statusCounts.stream()
                .collect(Collectors.toMap(
                        obj -> obj[0] != null ? obj[0].toString() : "UNKNOWN",
                        obj -> (Long) obj[1]
                ));
        stats.put("statusDistribution", statusDistribution);
        
        return stats;
    }

    public Page<HistoryResponse> searchHistory(String userId, String query, Pageable pageable) {
        Page<ExamHistory> results = historyRepository.searchHistory(userId, query, pageable);
        return results.map(this::convertToHistoryResponse);
    }

    public Map<String, Object> getFilterOptions(String userId) {
        Map<String, Object> options = new HashMap<>();
        options.put("topics", getUniqueTopics(userId));
        options.put("difficulties", getUniqueDifficulties(userId));
        options.put("questionTypes", getUniqueQuestionTypes(userId));
        options.put("statuses", getUniqueStatuses(userId));
        return options;
    }

    private List<String> getUniqueQuestionTypes(String userId) {
        return historyRepository.findDistinctQuestionTypes(userId)
                .stream()
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    private List<String> getUniqueStatuses(String userId) {
        return Arrays.stream(Status.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    public void deleteHistory(String id, String userId) {
        ExamHistory history = historyRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("History record not found"));
        historyRepository.delete(history);
        log.info("Deleted history record: {} for user: {}", id, userId);
    }

    private HistoryResponse convertToHistoryResponse(ExamHistory history) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("score", history.getScore());
        summary.put("percentage", history.getPercentage());
        summary.put("performanceRating", history.getPerformanceRating());
        
        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("correct", history.getCorrectAnswers());
        breakdown.put("wrong", history.getWrongAnswers());
        breakdown.put("skipped", history.getSkippedAnswers());
        summary.put("answerBreakdown", breakdown);

        return HistoryResponse.builder()
                .id(history.getId())
                .topic(history.getTopic())
                .difficulty(history.getDifficulty().name())
                .questionType(history.getQuestionType().name())
                .numberOfQuestions(history.getNumberOfQuestions())
                .correctAnswers(history.getCorrectAnswers())
                .wrongAnswers(history.getWrongAnswers())
                .skippedAnswers(history.getSkippedAnswers())
                .score(history.getScore())
                .percentage(history.getPercentage())
                .timeTaken(history.getTimeTaken())
                .performanceRating(history.getPerformanceRating() != null ? history.getPerformanceRating().name() : "N/A")
                .status(history.getStatus().name())
                .createdAt(history.getCreatedAt())
                .summary(summary)
                .build();
    }
}