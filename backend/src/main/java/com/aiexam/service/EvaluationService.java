package com.aiexam.service;

import com.aiexam.dto.request.AnswerSubmitDto;
import com.aiexam.dto.response.ResultResponse;
import com.aiexam.exception.InvalidRequestException;
import com.aiexam.model.ExamHistory;
import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.PerformanceRating;
import com.aiexam.model.enums.QuestionType;
import com.aiexam.model.enums.Status;
import com.aiexam.repository.ExamHistoryRepository;
import com.aiexam.util.ScoreCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final AiService aiService;
    private final ExamHistoryRepository historyRepository;
    private final ScoreCalculator scoreCalculator;
    private final FeedbackService feedbackService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initDatabase() {
        // Add detailed_results column
        try {
            log.info("Checking database schema for exam_history table...");
            jdbcTemplate.execute("ALTER TABLE exam_history ADD COLUMN IF NOT EXISTS detailed_results TEXT");
            log.info("detailed_results column ensured.");
        } catch (Exception e) {
            log.warn("Could not add detailed_results column (may already exist): {}", e.getMessage());
        }

        // Drop any check constraint on performance_rating column (regardless of auto-generated name)
        // Uses PL/pgSQL to dynamically find and drop it, so the constraint name doesn't matter.
        try {
            jdbcTemplate.execute(
                "DO $$ " +
                "DECLARE r RECORD; " +
                "BEGIN " +
                "  FOR r IN " +
                "    SELECT tc.constraint_name " +
                "    FROM information_schema.table_constraints tc " +
                "    JOIN information_schema.check_constraints cc " +
                "      ON tc.constraint_name = cc.constraint_name " +
                "    WHERE tc.table_name = 'exam_history' " +
                "      AND tc.constraint_type = 'CHECK' " +
                "      AND cc.check_clause LIKE '%performance_rating%' " +
                "  LOOP " +
                "    EXECUTE 'ALTER TABLE exam_history DROP CONSTRAINT IF EXISTS \"' || r.constraint_name || '\"'; " +
                "  END LOOP; " +
                "END $$;"
            );
            log.info("performance_rating check constraint removed (if it existed).");
        } catch (Exception e) {
            log.warn("Could not drop performance_rating check constraint: {}", e.getMessage());
        }
    }

    public ResultResponse evaluateExam(ExamService.ExamSession session) {
        log.info("Evaluating exam: {}", session.getExamId());

        List<Map<String, Object>> questions = session.getQuestions();
        Map<String, AnswerSubmitDto> answers = session.getAnswers();

        int correct = 0;
        int wrong = 0;
        int skipped = 0;
        int totalScore = 0;
        List<Map<String, Object>> detailedResults = new ArrayList<>();

        for (Map<String, Object> question : questions) {
            String questionId = (String) question.get("questionId");
            AnswerSubmitDto answer = answers.get(questionId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("questionId", questionId);
            result.put("question", question.get("question"));
            result.put("type", question.get("type"));
            result.put("options", question.get("options"));
            result.put("timeTaken", answer != null && answer.getTimeTaken() != null ? answer.getTimeTaken() : 0);
            
            if (answer == null || Boolean.TRUE.equals(answer.getIsSkipped())) {
                skipped++;
                result.put("status", "SKIPPED");
                result.put("correctAnswer", question.get("correctAnswer"));
                result.put("explanation", question.get("explanation"));
                result.put("userAnswer", null);
                detailedResults.add(result);
                continue;
            }

            // Evaluate answer based on question type safely
            QuestionType questionType = QuestionType.MCQ;
            try {
                if (session.getQuestionType() != null) {
                    questionType = QuestionType.valueOf(
                        session.getQuestionType().toUpperCase()
                            .trim()
                            .replace(" ", "_")
                            .replace("-", "_")
                            .replace("/", "_")
                    );
                }
            } catch (IllegalArgumentException e) {
                log.warn("Invalid question type: {}, defaulting to MCQ", session.getQuestionType());
            }
            boolean isCorrect = evaluateAnswer(question, answer, questionType);
            
            if (isCorrect) {
                correct++;
                result.put("status", "CORRECT");
                result.put("explanation", question.get("explanation"));
                result.put("userAnswer", answer.getAnswer());
                result.put("correctAnswer", question.get("correctAnswer"));
            } else {
                wrong++;
                result.put("status", "WRONG");
                result.put("correctAnswer", question.get("correctAnswer"));
                result.put("explanation", question.get("explanation"));
                result.put("userAnswer", answer.getAnswer());
            }
            
            detailedResults.add(result);
        }

        int totalQuestions = questions.size();
        // Each correct answer is worth (100.0 / totalQuestions) marks → max total = 100
        double marksPerQuestion = scoreCalculator.calculateScorePerQuestion(totalQuestions);

        // Calculate score and percentage using double precision to prevent truncation errors
        double calculatedScore = correct * marksPerQuestion;
        totalScore = (int) Math.round(calculatedScore);

        double percentage = totalQuestions > 0 ? (correct * 100.0) / totalQuestions : 0.0;
        // Clamp to 100 max
        if (percentage > 100.0) percentage = 100.0;
        if (totalScore > 100) totalScore = 100;

        // Compute accuracy: correct / (correct + wrong) * 100
        int answeredCount = correct + wrong;
        double accuracy = answeredCount > 0 ? (correct * 100.0) / answeredCount : 0;

        // Save to database
        ExamHistory history = new ExamHistory();
        history.setId(UUID.randomUUID().toString());
        history.setUserId(session.getUserId());
        history.setTopic(session.getTopic());
        
        // Safe Enum conversions
        Difficulty diffEnum = Difficulty.MEDIUM;
        try {
            if (session.getDifficulty() != null) {
                diffEnum = Difficulty.valueOf(session.getDifficulty().toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            log.warn("Invalid difficulty value: {}, defaulting to MEDIUM", session.getDifficulty());
        }
        history.setDifficulty(diffEnum);

        QuestionType typeEnum = QuestionType.MCQ;
        try {
            if (session.getQuestionType() != null) {
                typeEnum = QuestionType.valueOf(session.getQuestionType().toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            log.warn("Invalid question type value: {}, defaulting to MCQ", session.getQuestionType());
        }
        history.setQuestionType(typeEnum);

        history.setNumberOfQuestions(totalQuestions);
        history.setCorrectAnswers(correct);
        history.setWrongAnswers(wrong);
        history.setSkippedAnswers(skipped);
        history.setScore(totalScore);
        history.setPercentage(percentage);
        history.setTimeTaken((int) ChronoUnit.SECONDS.between(session.getStartedAt(), LocalDateTime.now()));
        history.setPerformanceRating(getPerformanceRating(percentage));
        history.setStatus(Status.COMPLETED);
        history.setCreatedAt(LocalDateTime.now());

        // Serialize detailedResults
        try {
            history.setDetailedResultsJson(objectMapper.writeValueAsString(detailedResults));
        } catch (Exception e) {
            log.error("Failed to serialize detailed results", e);
        }

        // Generate AI feedback
        String aiFeedback = feedbackService.generateFeedbackText(history);
        history.setAiFeedback(aiFeedback);

        // Save to database with fallback: if a check-constraint violation occurs
        // (e.g., legacy constraint still present), retry with performanceRating cleared.
        try {
            historyRepository.save(history);
        } catch (Exception e) {
            log.warn("Initial save failed ({}), retrying with performanceRating=null", e.getMessage());
            history.setPerformanceRating(null);
            try {
                historyRepository.save(history);
                log.info("Retry save succeeded.");
            } catch (Exception e2) {
                log.error("Retry save also failed: {}", e2.getMessage());
                // Still return the result even if DB save fails
            }
        }

        return ResultResponse.builder()
                .resultId(history.getId())
                .examId(session.getExamId())
                .totalQuestions(totalQuestions)
                .correctAnswers(correct)
                .wrongAnswers(wrong)
                .skippedAnswers(skipped)
                .score(totalScore)
                .percentage(percentage)
                .accuracy(accuracy)
                .timeTaken(history.getTimeTaken())
                .performanceRating(history.getPerformanceRating().name())
                .difficulty(session.getDifficulty())
                .questionType(session.getQuestionType())
                .topic(session.getTopic())
                .detailedResults(detailedResults)
                .aiFeedback(aiFeedback)
                .build();
    }

    private boolean evaluateAnswer(Map<String, Object> question, AnswerSubmitDto answer, QuestionType questionType) {
        Object correctObj = question.get("correctAnswer");
        String correctAnswer = correctObj != null ? correctObj.toString().trim() : "";
        String userAnswer = answer.getAnswer() != null ? answer.getAnswer().toString().trim() : "";

        if (correctAnswer.isEmpty()) return false;

        // FAST PATH: If userAnswer matches correctAnswer exactly (case-insensitive & trimmed), it is CORRECT.
        if (correctAnswer.equalsIgnoreCase(userAnswer)) {
            return true;
        }

        // True/False normalization fast path
        if (questionType == QuestionType.TRUE_FALSE) {
            String normCorrect = normalizeTrueFalse(correctAnswer);
            String normUser = normalizeTrueFalse(userAnswer);
            if (!normCorrect.isEmpty() && normCorrect.equalsIgnoreCase(normUser)) {
                return true;
            }
        }

        switch (questionType) {
            case MCQ:
            case TRUE_FALSE:
                return evaluateMCQ(question, answer);
            case FILL_IN_THE_BLANK:
                return evaluateFillBlank(question, answer);
            case SHORT_ANSWER:
                return evaluateShortAnswer(question, answer);
            case CODING:
                return evaluateCoding(question, answer);
            default:
                return false;
        }
    }

    private String normalizeTrueFalse(String val) {
        if (val == null) return "";
        String v = val.trim().toLowerCase();
        if (v.equals("true") || v.equals("t") || v.equals("yes") || v.equals("1")) {
            return "True";
        }
        if (v.equals("false") || v.equals("f") || v.equals("no") || v.equals("0")) {
            return "False";
        }
        return val;
    }

    @SuppressWarnings("unchecked")
    private List<String> getOptionsList(Object optionsObj) {
        if (optionsObj == null) {
            return Collections.emptyList();
        }
        if (optionsObj instanceof List) {
            List<String> list = new ArrayList<>();
            for (Object obj : (List<?>) optionsObj) {
                if (obj != null) {
                    list.add(obj.toString().trim());
                }
            }
            return list;
        }
        if (optionsObj instanceof String) {
            String optsStr = ((String) optionsObj).trim();
            // Try parsing JSON list array
            if (optsStr.startsWith("[") && optsStr.endsWith("]")) {
                try {
                    return objectMapper.readValue(optsStr, List.class);
                } catch (Exception e) {
                    log.warn("Failed to parse options JSON string: {}", optsStr);
                }
            }
            // Try parsing comma-separated lists
            if (optsStr.contains(",")) {
                String[] split = optsStr.split(",");
                List<String> list = new ArrayList<>();
                for (String s : split) {
                    list.add(s.trim());
                }
                return list;
            }
            // Try parsing newline-separated lists
            if (optsStr.contains("\n")) {
                String[] split = optsStr.split("\n");
                List<String> list = new ArrayList<>();
                for (String s : split) {
                    list.add(s.trim());
                }
                return list;
            }
            return List.of(optsStr);
        }
        return Collections.emptyList();
    }

    private boolean evaluateMCQ(Map<String, Object> question, AnswerSubmitDto answer) {
        Object correctObj = question.get("correctAnswer");
        String correctAnswer = correctObj != null ? correctObj.toString().trim() : "";
        String userAnswer = answer.getAnswer() != null ? answer.getAnswer().toString().trim() : "";
        
        if (correctAnswer.isEmpty()) return false;
        if (correctAnswer.equalsIgnoreCase(userAnswer)) return true;
        
        // Map option letters A, B, C, D to their text values or vice-versa
        List<String> optionsList = getOptionsList(question.get("options"));
        
        if (!optionsList.isEmpty()) {
            // Check if correctAnswer specifies a letter index (like "A", "Option A", "A.")
            String cleanCorrect = correctAnswer.replaceAll("(?i)^option\\s+", "").replaceAll("\\.$", "").trim();
            if (cleanCorrect.length() == 1) {
                char ch = cleanCorrect.toUpperCase().charAt(0);
                int index = ch - 'A';
                if (index >= 0 && index < optionsList.size()) {
                    String correctOptionText = optionsList.get(index).trim();
                    if (correctOptionText.equalsIgnoreCase(userAnswer)) {
                        return true;
                    }
                }
            }
            
            // Conversely, check if userAnswer specifies a letter index
            String cleanUser = userAnswer.replaceAll("(?i)^option\\s+", "").replaceAll("\\.$", "").trim();
            if (cleanUser.length() == 1) {
                char ch = cleanUser.toUpperCase().charAt(0);
                int index = ch - 'A';
                if (index >= 0 && index < optionsList.size()) {
                    String userOptionText = optionsList.get(index).trim();
                    if (userOptionText.equalsIgnoreCase(correctAnswer)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    private boolean isAiResponseIndicatingCorrect(String evaluation) {
        if (evaluation == null) return false;
        String lower = evaluation.toLowerCase().trim();
        
        // Remove markdown formatting
        lower = lower.replaceAll("```json", "").replaceAll("```", "").trim();
        
        // Check explicit structured status lines
        if (lower.contains("status: incorrect") || lower.contains("status: fail") || lower.contains("[incorrect]") || lower.contains("[fail]")) {
            return false;
        }
        if (lower.contains("status: correct") || lower.contains("status: pass") || lower.contains("[correct]") || lower.contains("[pass]")) {
            return true;
        }

        // Search the first 200 characters for positive/negative keywords
        String header = lower.substring(0, Math.min(lower.length(), 200));
        
        boolean hasPositive = header.contains("yes") || header.contains("correct") || header.contains("pass") || header.contains("success") || header.contains("excellent") || header.contains("good") || header.contains("perfect");
        boolean hasNegative = header.contains("no,") || header.contains("not correct") || header.contains("incorrect") || header.contains("wrong") || header.contains("fail") || header.contains("invalid") || header.contains("does not solve");
        
        if (hasNegative) {
            return false;
        }
        
        return hasPositive;
    }

    private boolean evaluateFillBlank(Map<String, Object> question, AnswerSubmitDto answer) {
        Object correctObj = question.get("correctAnswer");
        String correctAnswer = correctObj != null ? correctObj.toString().trim() : "";
        String userAnswer = answer.getAnswer() != null ? answer.getAnswer().toString().trim() : "";
        
        if (correctAnswer.equalsIgnoreCase(userAnswer)) return true;

        String evaluation = aiService.evaluateAnswer(
                (String) question.get("question"),
                userAnswer,
                correctAnswer,
                "FILL_IN_THE_BLANK"
        );
        
        return isAiResponseIndicatingCorrect(evaluation);
    }

    private boolean evaluateShortAnswer(Map<String, Object> question, AnswerSubmitDto answer) {
        String userAnswer = answer.getAnswer() != null ? answer.getAnswer().toString().trim() : "";
        Object correctObj = question.get("correctAnswer");
        String correctAnswer = correctObj != null ? correctObj.toString().trim() : "";

        if (userAnswer.isEmpty()) return false;
        if (correctAnswer.equalsIgnoreCase(userAnswer)) return true;

        // Content-based keyword matching (Fast keyword checks)
        String[] stopWords = {"a", "an", "the", "is", "it", "in", "on", "at", "of", "to", "and", "or", "be", "as", "by", "we", "you", "for", "that", "this", "with", "are", "was", "were", "has", "have"};
        java.util.Set<String> stopWordSet = new java.util.HashSet<>(java.util.Arrays.asList(stopWords));

        String[] correctWords = correctAnswer.toLowerCase().split("[\\s.,;:!?'\"()-]+");
        String userLower = userAnswer.toLowerCase();

        int matchCount = 0;
        int significantWords = 0;
        for (String word : correctWords) {
            if (word.length() < 3 || stopWordSet.contains(word)) continue;
            significantWords++;
            if (userLower.contains(word)) matchCount++;
        }

        // Award credit if user covers at least 35% of key content words
        if (significantWords == 0) return !userAnswer.isEmpty();
        double coverage = (double) matchCount / significantWords;
        if (coverage >= 0.35) return true;

        // Otherwise fallback to AI semantic evaluation
        try {
            String evaluation = aiService.evaluateAnswer(
                    (String) question.get("question"),
                    userAnswer,
                    correctAnswer,
                    "SHORT_ANSWER"
            );
            return isAiResponseIndicatingCorrect(evaluation);
        } catch (Exception e) {
            log.warn("AI evaluation for short answer failed, using keyword result: {}", e.getMessage());
        }

        return false;
    }

    private boolean evaluateCoding(Map<String, Object> question, AnswerSubmitDto answer) {
        String userCode = answer.getAnswer() != null ? answer.getAnswer().toString().trim() : "";
        Object correctObj = question.get("correctAnswer");
        String correctAnswer = correctObj != null ? correctObj.toString().trim() : "";

        if (userCode.isEmpty()) return false;
        if (userCode.equalsIgnoreCase(correctAnswer)) return true;

        Object testCasesObj = question.get("testCases");
        String testCasesStr = "";
        if (testCasesObj != null) {
            if (testCasesObj instanceof String) {
                testCasesStr = (String) testCasesObj;
            } else {
                try {
                    testCasesStr = objectMapper.writeValueAsString(testCasesObj);
                } catch (Exception e) {
                    testCasesStr = testCasesObj.toString();
                }
            }
        }

        String evaluation = aiService.evaluateCodingQuestion(
                (String) question.get("question"),
                userCode,
                testCasesStr
        );
        
        return isAiResponseIndicatingCorrect(evaluation);
    }

    private int getMaxScore(int totalQuestions, ExamService.ExamSession session) {
        // With the new 100/n formula, max possible score = 100
        return 100;
    }

    private PerformanceRating getPerformanceRating(double percentage) {
        if (percentage >= 90) return PerformanceRating.EXCELLENT;
        else if (percentage >= 75) return PerformanceRating.GOOD;
        else if (percentage >= 60) return PerformanceRating.AVERAGE;
        else return PerformanceRating.NEEDS_IMPROVEMENT;
    }
}