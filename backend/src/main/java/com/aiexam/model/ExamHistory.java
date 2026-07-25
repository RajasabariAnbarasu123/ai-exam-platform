package com.aiexam.model;

import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.QuestionType;
import com.aiexam.model.enums.PerformanceRating;
import com.aiexam.model.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamHistory {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(nullable = false, length = 100)
    private String topic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType;

    @Column(name = "number_of_questions", nullable = false)
    private Integer numberOfQuestions;

    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers;

    @Column(name = "wrong_answers", nullable = false)
    private Integer wrongAnswers;

    @Column(name = "skipped_answers", nullable = false)
    private Integer skippedAnswers;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Double percentage;

    @Column(name = "time_taken", nullable = false)
    private Integer timeTaken;

    @Enumerated(EnumType.STRING)
    @Column(name = "performance_rating")
    private PerformanceRating performanceRating;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "detailed_results", columnDefinition = "TEXT")
    private String detailedResultsJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}