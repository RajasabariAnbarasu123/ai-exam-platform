package com.aiexam.service;

import com.aiexam.dto.response.FeedbackResponse;
import com.aiexam.model.ExamHistory;
import com.aiexam.repository.ExamHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final AiService aiService;
    private final ExamHistoryRepository historyRepository;

    public FeedbackResponse generateFeedback(ExamHistory history) {
        Map<String, Object> examData = prepareExamData(history);
        String aiFeedback = aiService.generateFeedback(examData);
        
        return parseFeedbackResponse(aiFeedback, history);
    }

    public String generateFeedbackText(ExamHistory history) {
        Map<String, Object> examData = prepareExamData(history);
        return aiService.generateFeedback(examData);
    }

    private Map<String, Object> prepareExamData(ExamHistory history) {
        Map<String, Object> data = new HashMap<>();
        data.put("topic", history.getTopic());
        data.put("difficulty", history.getDifficulty());
        data.put("questionType", history.getQuestionType());
        data.put("score", history.getScore());
        data.put("percentage", history.getPercentage());
        data.put("correctAnswers", history.getCorrectAnswers());
        data.put("wrongAnswers", history.getWrongAnswers());
        data.put("skippedAnswers", history.getSkippedAnswers());
        data.put("totalQuestions", history.getNumberOfQuestions());
        data.put("timeTaken", history.getTimeTaken());
        data.put("performanceRating", history.getPerformanceRating());
        
        return data;
    }

    private FeedbackResponse parseFeedbackResponse(String aiFeedback, ExamHistory history) {
        // Parse AI feedback and structure it
        FeedbackResponse response = FeedbackResponse.builder()
                .overallFeedback(aiFeedback)
                .score(history.getPercentage())
                .performanceRating(history.getPerformanceRating().name())
                .strengths(extractStrengths(history))
                .weaknesses(extractWeaknesses(history))
                .topicAnalysis(generateTopicAnalysis(history))
                .studyRecommendation(generateStudyRecommendation(history))
                .improvementTip(generateImprovementTip(history))
                .build();
        
        return response;
    }

    private List<String> extractStrengths(ExamHistory history) {
        List<String> strengths = new ArrayList<>();
        
        if (history.getPercentage() >= 75) {
            strengths.add("Strong understanding of core concepts");
        }
        if (history.getCorrectAnswers() > history.getWrongAnswers() * 2) {
            strengths.add("Excellent accuracy in answering questions");
        }
        if (history.getSkippedAnswers() < history.getNumberOfQuestions() * 0.1) {
            strengths.add("Good time management");
        }
        
        return strengths;
    }

    private List<String> extractWeaknesses(ExamHistory history) {
        List<String> weaknesses = new ArrayList<>();
        
        if (history.getPercentage() < 60) {
            weaknesses.add("Need to review fundamental concepts");
        }
        if (history.getWrongAnswers() > history.getCorrectAnswers()) {
            weaknesses.add("Concept clarity needs improvement");
        }
        if (history.getSkippedAnswers() > history.getNumberOfQuestions() * 0.2) {
            weaknesses.add("Time management needs improvement");
        }
        
        return weaknesses;
    }

    private Map<String, String> generateTopicAnalysis(ExamHistory history) {
        Map<String, String> analysis = new HashMap<>();
        analysis.put("topic", history.getTopic());
        analysis.put("performance", history.getPerformanceRating().name());
        analysis.put("suggestion", getSuggestion(history.getPercentage()));
        return analysis;
    }

    private String getSuggestion(double percentage) {
        if (percentage >= 90) {
            return "Excellent! You can try more challenging topics.";
        } else if (percentage >= 75) {
            return "Good work! Focus on a few weak areas to improve further.";
        } else if (percentage >= 60) {
            return "Average performance. More practice recommended.";
        } else {
            return "Need significant improvement. Consider starting with easier topics.";
        }
    }

    private Map<String, Object> generateStudyRecommendation(ExamHistory history) {
        Map<String, Object> recommendation = new HashMap<>();
        
        int recommendedHours = history.getPercentage() < 60 ? 3 : 2;
        int codingQuestions = history.getQuestionType().name().equals("CODING") ? 15 : 10;
        int mcqs = history.getQuestionType().name().equals("MCQ") ? 20 : 15;
        
        recommendation.put("hoursPerWeek", recommendedHours);
        recommendation.put("codingQuestions", codingQuestions);
        recommendation.put("mcqs", mcqs);
        recommendation.put("topicsToReview", getTopicsToReview(history));
        
        return recommendation;
    }

    private List<String> getTopicsToReview(ExamHistory history) {
        List<String> topics = new ArrayList<>();
        topics.add(history.getTopic() + " fundamentals");
        
        if (history.getPercentage() < 60) {
            topics.add("Basic concepts in " + history.getTopic());
            topics.add("Problem-solving techniques");
        }
        
        return topics;
    }

    private String generateImprovementTip(ExamHistory history) {
        if (history.getPercentage() >= 90) {
            return "Keep up the great work! Challenge yourself with advanced topics.";
        } else if (history.getPercentage() >= 75) {
            return "Practice more questions on topics where you made mistakes.";
        } else if (history.getPercentage() >= 60) {
            return "Focus on understanding core concepts before attempting practice problems.";
        } else {
            return "Start with basic concepts and gradually increase difficulty. Consider reviewing study materials.";
        }
    }
}