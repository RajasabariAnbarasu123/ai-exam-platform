package com.aiexam.service;

import com.aiexam.dto.response.FeedbackResponse;
import com.aiexam.dto.response.ResultResponse;
import com.aiexam.exception.ResourceNotFoundException;
import com.aiexam.model.ExamHistory;
import com.aiexam.model.enums.PerformanceRating;
import com.aiexam.repository.ExamHistoryRepository;
import com.aiexam.util.ScoreCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResultService {

    private final ExamHistoryRepository historyRepository;
    private final ScoreCalculator scoreCalculator;
    private final FeedbackService feedbackService;
    private final PdfExportService pdfExportService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public ResultResponse getResult(String resultId, String userId) {
        ExamHistory history = historyRepository.findByIdAndUserId(resultId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));

        return buildResultResponse(history);
    }

    public FeedbackResponse getAIFeedback(String resultId, String userId) {
        ExamHistory history = historyRepository.findByIdAndUserId(resultId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));

        return feedbackService.generateFeedback(history);
    }

    public Map<String, Object> getResultAnalytics(String resultId, String userId) {
        ExamHistory history = historyRepository.findByIdAndUserId(resultId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));

        Map<String, Object> analytics = new HashMap<>();
        
        // Performance metrics
        analytics.put("score", history.getScore());
        analytics.put("percentage", history.getPercentage());
        analytics.put("performanceRating", history.getPerformanceRating());
        
        // Answer breakdown
        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("correct", history.getCorrectAnswers());
        breakdown.put("wrong", history.getWrongAnswers());
        breakdown.put("skipped", history.getSkippedAnswers());
        analytics.put("answerBreakdown", breakdown);
        
        // Time analysis
        Map<String, Object> timeAnalysis = new HashMap<>();
        timeAnalysis.put("totalTimeTaken", history.getTimeTaken());
        timeAnalysis.put("averageTimePerQuestion", 
                history.getTimeTaken() / (double) history.getNumberOfQuestions());
        analytics.put("timeAnalysis", timeAnalysis);
        
        // Topic and difficulty info
        analytics.put("topic", history.getTopic());
        analytics.put("difficulty", history.getDifficulty());
        analytics.put("questionType", history.getQuestionType());
        
        // Performance metrics
        Map<String, Double> metrics = new HashMap<>();
        metrics.put("accuracy", scoreCalculator.calculateAccuracy(
                history.getCorrectAnswers(),
                history.getCorrectAnswers() + history.getWrongAnswers()
        ));
        metrics.put("completionRate", scoreCalculator.calculateCompletionRate(
                history.getCorrectAnswers() + history.getWrongAnswers(),
                history.getNumberOfQuestions()
        ));
        analytics.put("metrics", metrics);
        
        return analytics;
    }

    public Map<String, String> getPerformanceRating(double percentage) {
        Map<String, String> rating = new HashMap<>();
        
        if (percentage >= 90) {
            rating.put("rating", "EXCELLENT");
            rating.put("description", "Outstanding performance! You have excellent knowledge of the subject.");
        } else if (percentage >= 75) {
            rating.put("rating", "GOOD");
            rating.put("description", "Good performance! You have a solid understanding of the subject.");
        } else if (percentage >= 60) {
            rating.put("rating", "AVERAGE");
            rating.put("description", "Average performance. Consider reviewing some topics.");
        } else {
            rating.put("rating", "NEEDS_IMPROVEMENT");
            rating.put("description", "Needs improvement. More practice is recommended.");
        }
        
        return rating;
    }

    public Map<String, Object> getResultSummary(String resultId, String userId) {
        ExamHistory history = historyRepository.findByIdAndUserId(resultId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));

        Map<String, Object> summary = new HashMap<>();
        summary.put("examId", resultId);
        summary.put("topic", history.getTopic());
        summary.put("difficulty", history.getDifficulty());
        summary.put("questionType", history.getQuestionType());
        summary.put("score", history.getScore());
        summary.put("percentage", history.getPercentage());
        summary.put("performanceRating", history.getPerformanceRating());
        summary.put("correctAnswers", history.getCorrectAnswers());
        summary.put("wrongAnswers", history.getWrongAnswers());
        summary.put("skippedAnswers", history.getSkippedAnswers());
        summary.put("timeTaken", history.getTimeTaken());
        summary.put("date", history.getCreatedAt());
        summary.put("status", history.getStatus());
        
        return summary;
    }

    public byte[] exportResultPDF(String resultId, String userId) {
        ExamHistory history = historyRepository.findByIdAndUserId(resultId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));

        return pdfExportService.generateExamReport(history);
    }

    private ResultResponse buildResultResponse(ExamHistory history) {
        List<Map<String, Object>> detailedResults = new ArrayList<>();
        if (history.getDetailedResultsJson() != null && !history.getDetailedResultsJson().trim().isEmpty()) {
            try {
                detailedResults = objectMapper.readValue(history.getDetailedResultsJson(), List.class);
            } catch (Exception e) {
                log.error("Failed to deserialize detailed results json", e);
            }
        }

        return ResultResponse.builder()
                .resultId(history.getId())
                .examId(history.getId())
                .totalQuestions(history.getNumberOfQuestions())
                .correctAnswers(history.getCorrectAnswers())
                .wrongAnswers(history.getWrongAnswers())
                .skippedAnswers(history.getSkippedAnswers())
                .score(history.getScore())
                .percentage(history.getPercentage())
                .timeTaken(history.getTimeTaken())
                .performanceRating(history.getPerformanceRating().name())
                .difficulty(history.getDifficulty().name())
                .questionType(history.getQuestionType().name())
                .topic(history.getTopic())
                .status(history.getStatus() != null ? history.getStatus().name() : "COMPLETED")
                .createdAt(history.getCreatedAt())
                .strengthAndWeakness(getStrengthAndWeakness(history))
                .aiFeedback(history.getAiFeedback())
                .accuracy(scoreCalculator.calculateAccuracy(
                        history.getCorrectAnswers(),
                        history.getCorrectAnswers() + history.getWrongAnswers()
                ))
                .analytics(getResultAnalytics(history.getId(), history.getUserId()))
                .detailedResults(detailedResults)
                .build();
    }

    private Map<String, Object> getStrengthAndWeakness(ExamHistory history) {
        Map<String, Object> analysis = new HashMap<>();
        
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        
        if (history.getPercentage() >= 70) {
            strengths.add("Strong understanding of core concepts");
        }
        if (history.getCorrectAnswers() > history.getWrongAnswers()) {
            strengths.add("Good accuracy in answering questions");
        }
        if (history.getWrongAnswers() > history.getCorrectAnswers()) {
            weaknesses.add("Need to review fundamental concepts");
        }
        if (history.getSkippedAnswers() > history.getNumberOfQuestions() * 0.2) {
            weaknesses.add("Time management needs improvement");
        }
        
        analysis.put("strengths", strengths);
        analysis.put("weaknesses", weaknesses);
        
        return analysis;
    }
}