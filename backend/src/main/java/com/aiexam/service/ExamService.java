package com.aiexam.service;

import com.aiexam.dto.request.AnswerSubmitDto;
import com.aiexam.dto.request.ExamRequestDto;
import com.aiexam.dto.response.ApiResponse;
import com.aiexam.dto.response.ExamResponse;
import com.aiexam.dto.response.ResultResponse;
import com.aiexam.exception.AiGenerationException;
import com.aiexam.exception.InvalidRequestException;
import com.aiexam.model.ExamHistory;
import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.PerformanceRating;
import com.aiexam.model.enums.QuestionType;
import com.aiexam.model.enums.Status;
import com.aiexam.repository.ExamHistoryRepository;
import com.aiexam.repository.SystemSettingRepository;
import com.aiexam.util.AiPromptBuilder;
import com.aiexam.util.ScoreCalculator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamService {

    private final AiService aiService;
    private final AiPromptBuilder promptBuilder;
    private final TimerService timerService;
    private final EvaluationService evaluationService;
    private final ExamHistoryRepository historyRepository;
    private final ScoreCalculator scoreCalculator;
    private final ObjectMapper objectMapper;
    private final SystemSettingRepository settingRepository;
    
    // In-memory storage for active exams (questions are not persisted)
    private final Map<String, ExamSession> activeExams = new ConcurrentHashMap<>();

    public ExamResponse generateExam(ExamRequestDto request, String userId) {
        log.info("Generating exam for user: {}, topic: {}, difficulty: {}, type: {}, count: {}",
                userId, request.getTopic(), request.getDifficulty(),
                request.getQuestionType(), request.getNumberOfQuestions());

        // Enforce admin-configured question count limits
        int minQ = getSettingInt("minQuestions", 5);
        int maxQ = getSettingInt("maxQuestions", 30);
        int requestedQ = request.getNumberOfQuestions();
        if (requestedQ < minQ || requestedQ > maxQ) {
            throw new InvalidRequestException(
                "Number of questions must be between " + minQ + " and " + maxQ);
        }

        try {
            // Build AI prompt
            String prompt = promptBuilder.buildExamPrompt(
                    request.getTopic(),
                    request.getDifficulty(),
                    request.getQuestionType(),
                    request.getNumberOfQuestions()
            );

            // Generate questions using AI
            List<Map<String, Object>> questions = aiService.generateQuestions(prompt);

            if (questions == null || questions.isEmpty()) {
                throw new AiGenerationException("Failed to generate questions. Please try again.");
            }

            // Validate and format questions
            questions = validateAndFormatQuestions(questions, request.getQuestionType());

            // Create exam session
            String examId = UUID.randomUUID().toString();
            ExamSession session = new ExamSession();
            session.setExamId(examId);
            session.setUserId(userId);
            session.setQuestions(questions);
            session.setTopic(request.getTopic());
            session.setDifficulty(request.getDifficulty());
            session.setQuestionType(request.getQuestionType());
            session.setStartedAt(LocalDateTime.now());
            session.setAnswers(new HashMap<>());
            session.setTimerSettings(timerService.getTimerSettings(
                    request.getDifficulty(), 
                    request.getQuestionType()
            ));
            session.setStatus("ACTIVE");

            activeExams.put(examId, session);

            // Get timer settings for each question
            Map<String, Integer> timerSettings = timerService.getTimerSettings(
                    request.getDifficulty(), 
                    request.getQuestionType()
            );

            log.info("Exam generated successfully: {}, questions: {}", examId, questions.size());

            return ExamResponse.builder()
                    .examId(examId)
                    .topic(request.getTopic())
                    .difficulty(request.getDifficulty())
                    .questionType(request.getQuestionType())
                    .numberOfQuestions(questions.size())
                    .questions(questions)
                    .timerSettings(timerSettings)
                    .generationTime(System.currentTimeMillis())
                    .status("ACTIVE")
                    .build();

        } catch (Exception e) {
            log.error("Error generating exam: {}", e.getMessage(), e);
            throw new AiGenerationException("Failed to generate exam: " + e.getMessage());
        }
    }

    private List<Map<String, Object>> validateAndFormatQuestions(List<Map<String, Object>> questions, String questionType) {
        List<Map<String, Object>> validQuestions = new ArrayList<>();
        
        for (Map<String, Object> q : questions) {
            // Ensure required fields exist
            if (!q.containsKey("question") || q.get("question") == null) {
                continue;
            }

            // Validate based on question type
            QuestionType type = QuestionType.valueOf(questionType.toUpperCase());
            switch (type) {
                case MCQ:
                    if (!q.containsKey("options") || !q.containsKey("correctAnswer")) {
                        continue;
                    }
                    break;
                case TRUE_FALSE:
                    if (!q.containsKey("correctAnswer")) {
                        continue;
                    }
                    break;
                case FILL_IN_THE_BLANK:
                    if (!q.containsKey("correctAnswer")) {
                        continue;
                    }
                    break;
                case SHORT_ANSWER:
                case CODING:
                    if (!q.containsKey("correctAnswer")) {
                        q.put("correctAnswer", "");
                    }
                    break;
            }

            // Add default fields if missing
            q.putIfAbsent("explanation", "No explanation provided");
            q.putIfAbsent("concept", "General");
            q.putIfAbsent("questionId", UUID.randomUUID().toString());
            // Always stamp the question type so the frontend renders the right widget
            q.put("type", questionType.toUpperCase());
            q.put("questionType", questionType.toUpperCase());
            
            validQuestions.add(q);
        }

        if (validQuestions.isEmpty()) {
            throw new AiGenerationException("No valid questions could be generated. Please try again.");
        }

        return validQuestions;
    }

    @Transactional
    public ApiResponse submitSingleAnswer(AnswerSubmitDto answer, String userId) {
        String examId = extractExamId(answer.getQuestionId());
        ExamSession session = activeExams.get(examId);
        
        if (session == null || !session.getUserId().equals(userId)) {
            throw new InvalidRequestException("Invalid exam session");
        }

        // Store answer
        session.getAnswers().put(answer.getQuestionId(), answer);
        
        return ApiResponse.builder()
                .success(true)
                .message("Answer submitted successfully")
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }

    private String extractExamId(String questionId) {
        // Assuming questionId format: examId_questionIndex
        return questionId.split("_")[0];
    }

    public Map<String, Integer> getTimerSettings(String difficulty, String questionType) {
        return timerService.getTimerSettings(difficulty, questionType);
    }

    public Map<String, Object> getExamStatus(String examId, String userId) {
        ExamSession session = activeExams.get(examId);
        
        if (session == null || !session.getUserId().equals(userId)) {
            throw new InvalidRequestException("Exam not found");
        }

        Map<String, Object> status = new HashMap<>();
        status.put("examId", examId);
        status.put("status", session.getStatus());
        status.put("totalQuestions", session.getQuestions().size());
        status.put("answeredQuestions", session.getAnswers().size());
        status.put("remainingQuestions", session.getQuestions().size() - session.getAnswers().size());
        status.put("timeElapsed", ChronoUnit.SECONDS.between(session.getStartedAt(), LocalDateTime.now()));
        
        return status;
    }

    public ExamResponse getExam(String examId, String userId) {
        ExamSession session = activeExams.get(examId);
        
        if (session == null || !session.getUserId().equals(userId)) {
            throw new InvalidRequestException("Exam not found");
        }

        return ExamResponse.builder()
                .examId(session.getExamId())
                .topic(session.getTopic())
                .difficulty(session.getDifficulty())
                .questionType(session.getQuestionType())
                .numberOfQuestions(session.getQuestions().size())
                .questions(session.getQuestions())
                .timerSettings(session.getTimerSettings())
                .status(session.getStatus())
                .build();
    }

    public ExamResponse retryGeneration(ExamRequestDto request, String userId) {
        return generateExam(request, userId);
    }

    public ResultResponse submitExam(String examId, List<AnswerSubmitDto> answers, String userId) {
        ExamSession session = getActiveExam(examId);
        if (session == null || !session.getUserId().equals(userId)) {
            throw new InvalidRequestException("Invalid or expired exam session");
        }

        java.util.Map<String, AnswerSubmitDto> answerMap = new java.util.HashMap<>();
        for (AnswerSubmitDto a : answers) {
            answerMap.put(a.getQuestionId(), a);
        }
        session.setAnswers(answerMap);

        ResultResponse response = evaluationService.evaluateExam(session);
        removeActiveExam(examId);
        return response;
    }

    public ResultResponse autoSubmitExam(String examId, String userId) {
        ExamSession session = activeExams.get(examId);
        
        if (session == null || !session.getUserId().equals(userId)) {
            throw new InvalidRequestException("Exam not found");
        }

        // Mark all unanswered questions as skipped
        List<Map<String, Object>> questions = session.getQuestions();
        for (Map<String, Object> question : questions) {
            String questionId = (String) question.get("questionId");
            if (!session.getAnswers().containsKey(questionId)) {
                AnswerSubmitDto skippedAnswer = new AnswerSubmitDto();
                skippedAnswer.setQuestionId(questionId);
                skippedAnswer.setIsSkipped(true);
                skippedAnswer.setAnswer(null);
                session.getAnswers().put(questionId, skippedAnswer);
            }
        }

        // Evaluate the exam
        ResultResponse response = evaluationService.evaluateExam(session);
        removeActiveExam(examId);
        return response;
    }

    public ExamSession getActiveExam(String examId) {
        return activeExams.get(examId);
    }

    public void removeActiveExam(String examId) {
        activeExams.remove(examId);
    }

    private int getSettingInt(String key, int defaultValue) {
        return settingRepository.findById(key)
                .map(s -> {
                    try { return Integer.parseInt(s.getSettingValue()); }
                    catch (NumberFormatException e) { return defaultValue; }
                })
                .orElse(defaultValue);
    }

    // Inner class for exam session
    public static class ExamSession {
        private String examId;
        private String userId;
        private List<Map<String, Object>> questions;
        private String topic;
        private String difficulty;
        private String questionType;
        private LocalDateTime startedAt;
        private Map<String, AnswerSubmitDto> answers;
        private Map<String, Integer> timerSettings;
        private String status;

        // Getters and setters
        public String getExamId() { return examId; }
        public void setExamId(String examId) { this.examId = examId; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public List<Map<String, Object>> getQuestions() { return questions; }
        public void setQuestions(List<Map<String, Object>> questions) { this.questions = questions; }
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        public String getQuestionType() { return questionType; }
        public void setQuestionType(String questionType) { this.questionType = questionType; }
        public LocalDateTime getStartedAt() { return startedAt; }
        public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
        public Map<String, AnswerSubmitDto> getAnswers() { return answers; }
        public void setAnswers(Map<String, AnswerSubmitDto> answers) { this.answers = answers; }
        public Map<String, Integer> getTimerSettings() { return timerSettings; }
        public void setTimerSettings(Map<String, Integer> timerSettings) { this.timerSettings = timerSettings; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}