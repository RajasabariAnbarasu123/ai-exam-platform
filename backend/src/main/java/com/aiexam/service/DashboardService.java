package com.aiexam.service;

import com.aiexam.dto.response.DashboardResponse;
import com.aiexam.model.ExamHistory;
import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.QuestionType;
import com.aiexam.repository.ExamHistoryRepository;
import com.aiexam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final ExamHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboardData(String userId) {
        String userName = userRepository.findById(userId)
                .map(u -> u.getFullName())
                .orElse("User");

        // Get stats
        long totalExams = historyRepository.countExamsByUser(userId);
        Double avgScore = historyRepository.getAverageScore(userId);
        Integer bestScore = historyRepository.getMaxScore(userId);
        Integer totalQuestions = historyRepository.getTotalQuestionsAttempted(userId);
        Double accuracy = historyRepository.getOverallAccuracy(userId);

        // Get recent exams
        List<ExamHistory> recentExams = historyRepository.findRecentExams(userId, 10);

        // Calculate weekly performance and exams this week
        Map<String, Object> weeklyPerf = getWeeklyPerformance(userId);
        @SuppressWarnings("unchecked")
        List<Long> examCounts = (List<Long>) weeklyPerf.get("examCounts");
        int examsThisWeek = examCounts != null ? examCounts.stream().mapToInt(Long::intValue).sum() : 0;

        // Performance distribution
        List<Object[]> distribution = historyRepository.getPerformanceDistribution(userId);
        Map<String, Long> performanceDistribution = distribution.stream()
                .collect(Collectors.toMap(
                        obj -> obj[0] != null ? obj[0].toString() : "UNKNOWN",
                        obj -> (Long) obj[1]
                ));

        // Calculate Completed, Passed, and Failed status counts
        long completed = 0;
        long passed = 0;
        long failed = 0;
        
        List<ExamHistory> allExamsForUser = historyRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (ExamHistory exam : allExamsForUser) {
            if (exam.getStatus() == com.aiexam.model.enums.Status.COMPLETED) {
                completed++;
                if (exam.getPercentage() != null && exam.getPercentage() >= 50.0) {
                    passed++;
                } else {
                    failed++;
                }
            }
        }

        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("COMPLETED", completed);
        statusDistribution.put("PASSED", passed);
        statusDistribution.put("FAILED", failed);

        return DashboardResponse.builder()
                .userName(userName)
                .totalExamsTaken((int) totalExams)
                .averageScore(avgScore != null ? avgScore : 0.0)
                .bestScore(bestScore != null ? bestScore : 0)
                .totalQuestionsAttempted(totalQuestions != null ? totalQuestions : 0)
                .accuracyPercentage(accuracy != null ? accuracy : 0.0)
                .weeklyPerformance(weeklyPerf)
                .difficultyAnalysis(getDifficultyAnalysis(userId))
                .questionTypeAnalysis(getQuestionTypeAnalysis(userId))
                .recentExamHistory(convertRecentExams(recentExams))
                .overallStats(getOverallStats(userId))
                .examsThisWeek(examsThisWeek)
                .performanceDistribution(performanceDistribution)
                .statusDistribution(statusDistribution)
                .build();
    }

    public Map<String, Object> getWeeklyPerformance(String userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Object[]> performanceData = historyRepository.getWeeklyPerformance(userId, now.minusDays(7));

        Map<String, Object[]> dataMap = new HashMap<>();
        for (Object[] data : performanceData) {
            if (data[0] != null) {
                dataMap.put(data[0].toString(), data);
            }
        }

        List<String> dates = new ArrayList<>();
        List<Double> scores = new ArrayList<>();
        List<Long> examCounts = new ArrayList<>();

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = 6; i >= 0; i--) {
            String dateStr = now.minusDays(i).format(formatter);
            dates.add(dateStr);
            if (dataMap.containsKey(dateStr)) {
                Object[] data = dataMap.get(dateStr);
                scores.add(data[1] != null ? (Double) data[1] : 0.0);
                examCounts.add(data[2] != null ? (Long) data[2] : 0L);
            } else {
                scores.add(0.0);
                examCounts.add(0L);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("dates", dates);
        result.put("scores", scores);
        result.put("examCounts", examCounts);
        
        return result;
    }

    public Map<String, Object> getDifficultyAnalysis(String userId) {
        List<Object[]> analysis = historyRepository.getDifficultyAnalysis(userId);

        Map<String, Object> result = new HashMap<>();
        List<String> difficulties = new ArrayList<>();
        List<Long> counts = new ArrayList<>();
        List<Double> avgScores = new ArrayList<>();

        for (Object[] data : analysis) {
            difficulties.add(((Difficulty) data[0]).name());
            counts.add((Long) data[1]);
            avgScores.add((Double) data[2]);
        }

        result.put("difficulties", difficulties);
        result.put("counts", counts);
        result.put("avgScores", avgScores);
        
        return result;
    }

    public Map<String, Object> getQuestionTypeAnalysis(String userId) {
        List<Object[]> analysis = historyRepository.getQuestionTypeAnalysis(userId);

        Map<String, Object> result = new HashMap<>();
        List<String> types = new ArrayList<>();
        List<Long> counts = new ArrayList<>();
        List<Double> avgScores = new ArrayList<>();

        for (Object[] data : analysis) {
            types.add(((QuestionType) data[0]).name());
            counts.add((Long) data[1]);
            avgScores.add((Double) data[2]);
        }

        result.put("questionTypes", types);
        result.put("counts", counts);
        result.put("avgScores", avgScores);
        
        return result;
    }

    public Map<String, Object> getRecentExams(String userId) {
        List<ExamHistory> recentExams = historyRepository.findRecentExams(userId, 10);
        Map<String, Object> result = new HashMap<>();
        result.put("exams", convertRecentExams(recentExams));
        return result;
    }

    public Map<String, Object> getOverallStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalExams = historyRepository.countExamsByUser(userId);
        Double avgPercentage = historyRepository.getAveragePercentage(userId);
        Double accuracy = historyRepository.getOverallAccuracy(userId);
        
        // Get best and worst performing topics
        List<Object[]> bestTopicList = historyRepository.getBestTopic(userId);
        List<Object[]> weakTopicList = historyRepository.getWeakTopic(userId);
        
        stats.put("totalExams", totalExams);
        stats.put("avgPercentage", avgPercentage != null ? avgPercentage : 0.0);
        stats.put("accuracy", accuracy != null ? accuracy : 0.0);
        stats.put("bestTopic", (bestTopicList != null && !bestTopicList.isEmpty()) ? bestTopicList.get(0)[0] : "N/A");
        stats.put("weakTopic", (weakTopicList != null && !weakTopicList.isEmpty()) ? weakTopicList.get(0)[0] : "N/A");
        
        return stats;
    }

    public Map<String, Object> getStrengthWeakness(String userId) {
        List<Object[]> topicAnalysis = historyRepository.getTopicAnalysis(userId);
        
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        
        for (Object[] data : topicAnalysis) {
            String topic = (String) data[0];
            Double avgScore = (Double) data[2];
            
            if (avgScore >= 70) {
                strengths.add(topic);
            } else if (avgScore < 50) {
                weaknesses.add(topic);
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("strengths", strengths);
        result.put("weaknesses", weaknesses);
        return result;
    }

    public Map<String, Object> getSubjectWisePerformance(String userId) {
        List<Object[]> topicAnalysis = historyRepository.getTopicAnalysis(userId);
        
        Map<String, Object> performance = new HashMap<>();
        List<String> topics = new ArrayList<>();
        List<Double> scores = new ArrayList<>();
        List<Long> attempts = new ArrayList<>();
        
        for (Object[] data : topicAnalysis) {
            topics.add((String) data[0]);
            scores.add((Double) data[2]);
            attempts.add((Long) data[1]);
        }
        
        performance.put("topics", topics);
        performance.put("scores", scores);
        performance.put("attempts", attempts);
        
        return performance;
    }

    private List<Map<String, Object>> convertRecentExams(List<ExamHistory> exams) {
        List<Map<String, Object>> examList = new ArrayList<>();
        
        for (ExamHistory exam : exams) {
            Map<String, Object> examData = new HashMap<>();
            examData.put("id", exam.getId());
            examData.put("topic", exam.getTopic());
            examData.put("difficulty", exam.getDifficulty());
            examData.put("percentage", exam.getPercentage());
            examData.put("performanceRating", exam.getPerformanceRating());
            examData.put("date", exam.getCreatedAt().toString());
            examData.put("score", exam.getScore());
            examList.add(examData);
        }
        
        return examList;
    }
}