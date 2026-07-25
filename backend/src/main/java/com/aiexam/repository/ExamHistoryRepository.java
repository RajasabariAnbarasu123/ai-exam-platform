package com.aiexam.repository;

import com.aiexam.model.ExamHistory;
import com.aiexam.model.enums.Difficulty;
import com.aiexam.model.enums.QuestionType;
import com.aiexam.model.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamHistoryRepository extends JpaRepository<ExamHistory, String> {
    
    // Basic queries
    Page<ExamHistory> findByUserId(String userId, Pageable pageable);
    
    List<ExamHistory> findByUserIdOrderByCreatedAtDesc(String userId);
    
    Optional<ExamHistory> findByIdAndUserId(String id, String userId);
    
    // Filter queries
    @Query("SELECT e FROM ExamHistory e WHERE e.userId = :userId " +
           "AND (cast(:topic as string) IS NULL OR LOWER(e.topic) LIKE LOWER(CONCAT('%', cast(:topic as string), '%'))) " +
           "AND (cast(:difficulty as string) IS NULL OR e.difficulty = :difficulty) " +
           "AND (cast(:questionType as string) IS NULL OR e.questionType = :questionType) " +
           "AND (cast(:status as string) IS NULL OR e.status = :status) " +
           "AND (:passed IS NULL OR (:passed = true AND e.percentage >= 50.0) OR (:passed = false AND e.percentage < 50.0)) " +
           "AND (cast(:search as string) IS NULL " +
           "OR LOWER(e.topic) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(CAST(e.difficulty AS string)) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(CAST(e.questionType AS string)) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(CAST(e.status AS string)) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))")
    Page<ExamHistory> findWithFiltersAndSearch(@Param("userId") String userId,
                                               @Param("topic") String topic,
                                               @Param("difficulty") Difficulty difficulty,
                                               @Param("questionType") QuestionType questionType,
                                               @Param("status") Status status,
                                               @Param("passed") Boolean passed,
                                               @Param("search") String search,
                                               Pageable pageable);
    
    // Search queries
    @Query("SELECT e FROM ExamHistory e WHERE e.userId = :userId " +
           "AND (LOWER(e.topic) LIKE LOWER(CONCAT('%', cast(:query as string), '%')) " +
           "OR LOWER(CAST(e.difficulty AS string)) LIKE LOWER(CONCAT('%', cast(:query as string), '%')) " +
           "OR LOWER(CAST(e.questionType AS string)) LIKE LOWER(CONCAT('%', cast(:query as string), '%')))")
    Page<ExamHistory> searchHistory(@Param("userId") String userId, 
                                    @Param("query") String query, 
                                    Pageable pageable);
    
    // Statistics queries
    @Query("SELECT COUNT(e) FROM ExamHistory e WHERE e.userId = :userId")
    long countExamsByUser(@Param("userId") String userId);
    
    @Query("SELECT AVG(e.score) FROM ExamHistory e WHERE e.userId = :userId")
    Double getAverageScore(@Param("userId") String userId);
    
    @Query("SELECT MAX(e.score) FROM ExamHistory e WHERE e.userId = :userId")
    Integer getMaxScore(@Param("userId") String userId);
    
    @Query("SELECT SUM(e.correctAnswers + e.wrongAnswers + e.skippedAnswers) FROM ExamHistory e WHERE e.userId = :userId")
    Integer getTotalQuestionsAttempted(@Param("userId") String userId);
    
    @Query("SELECT AVG(e.percentage) FROM ExamHistory e WHERE e.userId = :userId")
    Double getAveragePercentage(@Param("userId") String userId);
    
    @Query("SELECT SUM(e.correctAnswers) * 100.0 / SUM(e.correctAnswers + e.wrongAnswers + e.skippedAnswers) " +
           "FROM ExamHistory e WHERE e.userId = :userId")
    Double getOverallAccuracy(@Param("userId") String userId);
    
    // Weekly performance
    @Query("SELECT DATE(e.createdAt) as date, AVG(e.percentage) as avgPercentage, COUNT(e) as examCount " +
           "FROM ExamHistory e WHERE e.userId = :userId AND e.createdAt >= :startDate " +
           "GROUP BY DATE(e.createdAt) ORDER BY date ASC")
    List<Object[]> getWeeklyPerformance(@Param("userId") String userId, 
                                        @Param("startDate") LocalDateTime startDate);
    
    // Difficulty analysis
    @Query("SELECT e.difficulty, COUNT(e) as count, AVG(e.percentage) as avgScore " +
           "FROM ExamHistory e WHERE e.userId = :userId " +
           "GROUP BY e.difficulty")
    List<Object[]> getDifficultyAnalysis(@Param("userId") String userId);
    
    // Question type analysis
    @Query("SELECT e.questionType, COUNT(e) as count, AVG(e.percentage) as avgScore " +
           "FROM ExamHistory e WHERE e.userId = :userId " +
           "GROUP BY e.questionType")
    List<Object[]> getQuestionTypeAnalysis(@Param("userId") String userId);
    
    // Recent exams
    @Query("SELECT e FROM ExamHistory e WHERE e.userId = :userId ORDER BY e.createdAt DESC LIMIT :limit")
    List<ExamHistory> findRecentExams(@Param("userId") String userId, @Param("limit") int limit);
    
    // Topic analysis
    @Query("SELECT e.topic, COUNT(e) as count, AVG(e.percentage) as avgScore " +
           "FROM ExamHistory e WHERE e.userId = :userId " +
           "GROUP BY e.topic ORDER BY avgScore DESC")
    List<Object[]> getTopicAnalysis(@Param("userId") String userId);
    
    // Best and worst topics
    @Query("SELECT e.topic, AVG(e.percentage) as avgScore " +
           "FROM ExamHistory e WHERE e.userId = :userId " +
           "GROUP BY e.topic ORDER BY avgScore DESC LIMIT 1")
    List<Object[]> getBestTopic(@Param("userId") String userId);
    
    @Query("SELECT e.topic, AVG(e.percentage) as avgScore " +
           "FROM ExamHistory e WHERE e.userId = :userId " +
           "GROUP BY e.topic ORDER BY avgScore ASC LIMIT 1")
    List<Object[]> getWeakTopic(@Param("userId") String userId);
    
    // Performance distribution
    @Query("SELECT e.performanceRating, COUNT(e) as count " +
           "FROM ExamHistory e WHERE e.userId = :userId " +
           "GROUP BY e.performanceRating")
    List<Object[]> getPerformanceDistribution(@Param("userId") String userId);
    
    // Status counts
    @Query("SELECT e.status, COUNT(e) as count FROM ExamHistory e WHERE e.userId = :userId GROUP BY e.status")
    List<Object[]> getStatusCounts(@Param("userId") String userId);
    
    // Admin queries
    @Query("SELECT COUNT(e) FROM ExamHistory e")
    long countAllExams();
    
    @Query("SELECT COUNT(e) FROM ExamHistory e WHERE e.createdAt >= :since")
    long countExamsSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(e) FROM ExamHistory e WHERE e.userId = :userId AND e.createdAt >= :since")
    long countExamsByUserSince(@Param("userId") String userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT e.topic, COUNT(e) as count FROM ExamHistory e GROUP BY e.topic ORDER BY count DESC")
    List<Object[]> getPopularTopics();
    
    @Query("SELECT e.difficulty, COUNT(e) as count FROM ExamHistory e GROUP BY e.difficulty ORDER BY count DESC")
    List<Object[]> getPopularDifficulties();
    
    @Query("SELECT e.questionType, COUNT(e) as count FROM ExamHistory e GROUP BY e.questionType ORDER BY count DESC")
    List<Object[]> getPopularQuestionTypes();
    
    @Query("SELECT AVG(e.percentage) FROM ExamHistory e")
    Double getGlobalAverageScore();
    
    @Query("SELECT MAX(e.percentage) FROM ExamHistory e")
    Double getGlobalMaxScore();
    
    @Query("SELECT MIN(e.percentage) FROM ExamHistory e")
    Double getGlobalMinScore();
    
    // Date range queries
    @Query("SELECT e FROM ExamHistory e WHERE e.userId = :userId AND e.createdAt BETWEEN :startDate AND :endDate")
    List<ExamHistory> findBetweenDates(@Param("userId") String userId,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);
    
    // Update operations
    @Modifying
    @Transactional
    @Query("UPDATE ExamHistory e SET e.aiFeedback = :feedback WHERE e.id = :id")
    void updateAIFeedback(@Param("id") String id, @Param("feedback") String feedback);
    
    @Modifying
    @Transactional
    @Query("UPDATE ExamHistory e SET e.status = :status WHERE e.id = :id")
    void updateStatus(@Param("id") String id, @Param("status") Status status);
    
    // Distinct values for filters
    @Query("SELECT DISTINCT e.topic FROM ExamHistory e WHERE e.userId = :userId")
    List<String> findDistinctTopics(@Param("userId") String userId);
    
    @Query("SELECT DISTINCT e.difficulty FROM ExamHistory e WHERE e.userId = :userId")
    List<Difficulty> findDistinctDifficulties(@Param("userId") String userId);
    
    @Query("SELECT DISTINCT e.questionType FROM ExamHistory e WHERE e.userId = :userId")
    List<QuestionType> findDistinctQuestionTypes(@Param("userId") String userId);
    
    // Performance trends
    @Query("SELECT DATE(e.createdAt) as date, AVG(e.percentage) as avgScore " +
           "FROM ExamHistory e WHERE e.userId = :userId AND e.createdAt >= :startDate " +
           "GROUP BY DATE(e.createdAt) ORDER BY date ASC")
    List<Object[]> getPerformanceTrend(@Param("userId") String userId, 
                                       @Param("startDate") LocalDateTime startDate);
}