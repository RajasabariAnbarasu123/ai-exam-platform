package com.aiexam.service;

import com.aiexam.exception.InvalidRequestException;
import com.aiexam.exception.ResourceNotFoundException;
import com.aiexam.model.User;
import com.aiexam.repository.ExamHistoryRepository;
import com.aiexam.repository.UserRepository;
import com.aiexam.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final ExamHistoryRepository historyRepository;
    private final SystemSettingRepository settingRepository;

    private static final Map<String, String> DEFAULT_SETTINGS = Map.of(
        "siteName", "AI Exam Platform",
        "siteDescription", "AI-Powered Smart Exam Platform",
        "maintenanceMode", "false",
        "registrationEnabled", "true",
        "emailNotifications", "true",
        "maxExamAttempts", "3",
        "defaultDifficulty", "MEDIUM",
        "aiModel", "gemini-3.5-flash",
        "maxQuestions", "30",
        "minQuestions", "5"
    );

    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalExams = historyRepository.countAllExams();
        long activeUsersToday = userRepository.countActiveUsersSince(LocalDateTime.now().minusDays(1));
        double globalAvgScore = historyRepository.getGlobalAverageScore() != null ? 
                historyRepository.getGlobalAverageScore() : 0.0;
        
        dashboard.put("totalUsers", totalUsers);
        dashboard.put("totalExams", totalExams);
        dashboard.put("activeUsersToday", activeUsersToday);
        dashboard.put("globalAvgScore", globalAvgScore);
        
        dashboard.put("popularTopics", getPopularTopics());
        dashboard.put("popularDifficulties", getPopularDifficulties());
        dashboard.put("popularQuestionTypes", getPopularQuestionTypes());
        dashboard.put("dailyActiveUsers", getDailyActiveUsers());
        dashboard.put("aiUsageStats", getAIUsageStats());
        
        return dashboard;
    }

    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalExams = historyRepository.countAllExams();
        long admins = userRepository.countAdmins();
        
        long usersThisWeek = userRepository.countUsersCreatedSince(LocalDateTime.now().minusDays(7));
        long examsThisWeek = historyRepository.countExamsSince(LocalDateTime.now().minusDays(7));
        
        Double maxScore = historyRepository.getGlobalMaxScore();
        Double minScore = historyRepository.getGlobalMinScore();
        Double avgScore = historyRepository.getGlobalAverageScore();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalExams", totalExams);
        stats.put("admins", admins);
        stats.put("usersThisWeek", usersThisWeek);
        stats.put("examsThisWeek", examsThisWeek);
        stats.put("maxScore", maxScore != null ? maxScore : 0.0);
        stats.put("minScore", minScore != null ? minScore : 0.0);
        stats.put("avgScore", avgScore != null ? avgScore : 0.0);
        
        return stats;
    }

    public List<Map<String, Object>> getAllUsers(String filter, String search, int page, int size) {
        List<User> users = userRepository.findAll();

        if (filter != null && !filter.isEmpty() && !filter.equalsIgnoreCase("all")) {
            String f = filter.toLowerCase();
            users = users.stream().filter(u -> {
                if (f.equals("user")) {
                    return u.getRole() == com.aiexam.model.enums.UserRole.USER;
                } else if (f.equals("admin")) {
                    return u.getRole() == com.aiexam.model.enums.UserRole.ADMIN;
                } else if (f.equals("verified")) {
                    return Boolean.TRUE.equals(u.getIsVerified());
                } else if (f.equals("unverified")) {
                    return Boolean.FALSE.equals(u.getIsVerified());
                } else if (f.equals("new_7_days")) {
                    return u.getCreatedAt() != null && u.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7));
                }
                return true;
            }).toList();
        }

        if (search != null && !search.isEmpty()) {
            String lower = search.toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getEmail() != null && u.getEmail().toLowerCase().contains(lower)) ||
                                 (u.getFullName() != null && u.getFullName().toLowerCase().contains(lower)))
                    .toList();
        }

        int start = page * size;
        int end = Math.min(start + size, users.size());
        List<User> paginatedUsers = users.subList(start, end);

        List<Map<String, Object>> result = new ArrayList<>();
        for (User user : paginatedUsers) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("fullName", user.getFullName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("isVerified", user.getIsVerified());
            userData.put("isActive", user.getIsActive());
            userData.put("createdAt", user.getCreatedAt());
            
            long examCount = historyRepository.countExamsByUser(user.getId());
            Double avgScore = historyRepository.getAverageScore(user.getId());
            
            userData.put("examCount", examCount);
            userData.put("avgScore", avgScore != null ? avgScore : 0.0);
            
            result.add(userData);
        }
        
        return result;
    }

    public List<Map<String, Object>> getAllExams(String filter, String search, int page, int size) {
        List<Map<String, Object>> result = new ArrayList<>();
        String lowerSearch = (search != null && !search.trim().isEmpty()) ? search.trim().toLowerCase() : null;

        var allExams = historyRepository.findAll().stream()
                .filter(exam -> {
                    // filter by status or date/user creation
                    if (filter != null && !filter.equals("all") && !filter.isEmpty()) {
                        if (filter.equals("last_7_days")) {
                            if (exam.getCreatedAt() == null || exam.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7))) {
                                return false;
                            }
                        } else if (filter.equals("new_user_7_days")) {
                            User user = userRepository.findById(exam.getUserId()).orElse(null);
                            if (user == null || user.getCreatedAt() == null || user.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7))) {
                                return false;
                            }
                        } else if (filter.equals("passed")) {
                            // Passed = percentage >= 50
                            double pct = exam.getPercentage() != null ? exam.getPercentage() : 0.0;
                            if (pct < 50.0) return false;
                        } else if (filter.equals("failed")) {
                            // Failed = percentage < 50
                            double pct = exam.getPercentage() != null ? exam.getPercentage() : 0.0;
                            if (pct >= 50.0) return false;
                        } else {
                            String status = exam.getStatus() != null ? exam.getStatus().name().toLowerCase() : "";
                            if (!status.equals(filter.toLowerCase())) return false;
                        }
                    }
                    // case-insensitive search by topic, user email, or user full name
                    if (lowerSearch != null) {
                        String topic = exam.getTopic() != null ? exam.getTopic().toLowerCase() : "";
                        User user = userRepository.findById(exam.getUserId()).orElse(null);
                        String email = (user != null && user.getEmail() != null) ? user.getEmail().toLowerCase() : "";
                        String fullName = (user != null && user.getFullName() != null) ? user.getFullName().toLowerCase() : "";
                        String userId = exam.getUserId() != null ? exam.getUserId().toLowerCase() : "";

                        if (!topic.contains(lowerSearch) && !email.contains(lowerSearch) && !fullName.contains(lowerSearch) && !userId.contains(lowerSearch)) {
                            return false;
                        }
                    }
                    return true;
                })
                .toList();

        int start = page * size;
        int end = Math.min(start + size, allExams.size());
        List<?> paginatedExams = allExams.subList(start, end);

        for (var exam : paginatedExams) {
            var e = (com.aiexam.model.ExamHistory) exam;
            Map<String, Object> examData = new HashMap<>();
            examData.put("id", e.getId());
            examData.put("userId", e.getUserId());
            // try to resolve user email
            String userEmail = userRepository.findById(e.getUserId())
                    .map(User::getEmail).orElse(e.getUserId());
            examData.put("userEmail", userEmail);
            examData.put("topic", e.getTopic());
            examData.put("difficulty", e.getDifficulty());
            examData.put("questionType", e.getQuestionType());
            examData.put("score", e.getScore());
            examData.put("percentage", e.getPercentage());
            examData.put("performanceRating", e.getPerformanceRating());
            examData.put("status", e.getStatus());
            // Percentage-based pass/fail
            double pct = e.getPercentage() != null ? e.getPercentage() : 0.0;
            examData.put("passedFailed", pct >= 50.0 ? "PASSED" : "FAILED");
            examData.put("createdAt", e.getCreatedAt());
            result.add(examData);
        }

        return result;
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        
        analytics.put("totalUsers", userRepository.count());
        analytics.put("activeUsersLast7Days", 
                userRepository.countActiveUsersSince(now.minusDays(7)));
        
        analytics.put("totalExams", historyRepository.countAllExams());
        analytics.put("examsLast7Days", 
                historyRepository.countExamsSince(now.minusDays(7)));
        
        analytics.put("averageScore", historyRepository.getGlobalAverageScore() != null ? historyRepository.getGlobalAverageScore() : 0.0);
        analytics.put("highestScore", historyRepository.getGlobalMaxScore() != null ? historyRepository.getGlobalMaxScore() : 0.0);
        analytics.put("lowestScore", historyRepository.getGlobalMinScore() != null ? historyRepository.getGlobalMinScore() : 0.0);
        
        analytics.put("popularTopics", getPopularTopics());
        analytics.put("difficultyDistribution", getPopularDifficulties());

        // Prepare user growth over the last 7 days
        List<Map<String, Object>> userGrowth = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime start = now.minusDays(i).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime end = now.minusDays(i).withHour(23).withMinute(59).withSecond(59).withNano(999999999);
            long count = userRepository.findAll().stream()
                    .filter(u -> u.getCreatedAt() != null && !u.getCreatedAt().isBefore(start) && !u.getCreatedAt().isAfter(end))
                    .count();
            Map<String, Object> point = new HashMap<>();
            point.put("date", start.toString());
            point.put("count", count);
            userGrowth.add(point);
        }
        analytics.put("userGrowth", userGrowth);

        // Prepare exam trends over the last 7 days
        List<Map<String, Object>> examTrends = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime start = now.minusDays(i).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime end = now.minusDays(i).withHour(23).withMinute(59).withSecond(59).withNano(999999999);
            long count = historyRepository.findAll().stream()
                    .filter(e -> e.getCreatedAt() != null && !e.getCreatedAt().isBefore(start) && !e.getCreatedAt().isAfter(end))
                    .count();
            Map<String, Object> point = new HashMap<>();
            point.put("date", start.toString());
            point.put("count", count);
            examTrends.add(point);
        }
        analytics.put("examTrends", examTrends);
        
        return analytics;
    }

    public Map<String, Integer> getPopularTopics() {
        List<Object[]> topicData = historyRepository.getPopularTopics();
        Map<String, Integer> topics = new LinkedHashMap<>();
        
        for (Object[] data : topicData) {
            topics.put((String) data[0], ((Long) data[1]).intValue());
        }
        
        return topics;
    }

    public Map<String, Integer> getPopularDifficulties() {
        List<Object[]> difficultyData = historyRepository.getPopularDifficulties();
        Map<String, Integer> difficulties = new LinkedHashMap<>();
        
        for (Object[] data : difficultyData) {
            difficulties.put(data[0].toString(), ((Long) data[1]).intValue());
        }
        
        return difficulties;
    }

    public Map<String, Integer> getPopularQuestionTypes() {
        List<Object[]> typeData = historyRepository.getPopularQuestionTypes();
        Map<String, Integer> types = new LinkedHashMap<>();
        
        for (Object[] data : typeData) {
            types.put(data[0].toString(), ((Long) data[1]).intValue());
        }
        
        return types;
    }

    public Map<String, Object> getAIUsageStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAICalls", 0);
        stats.put("successfulCalls", 0);
        stats.put("failedCalls", 0);
        stats.put("averageTokensUsed", 0);
        stats.put("totalCost", 0.0);
        
        return stats;
    }

    public Map<String, Integer> getDailyActiveUsers() {
        Map<String, Integer> dailyUsers = new LinkedHashMap<>();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (int i = 6; i >= 0; i--) {
            String date = now.minusDays(i).format(formatter);
            long count = userRepository.countActiveUsersSince(now.minusDays(i));
            dailyUsers.put(date, (int) count);
        }
        
        return dailyUsers;
    }

    @Transactional
    public Map<String, Object> updateUserRole(String userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Prevent demoting an ADMIN to USER
        if (user.getRole() != null &&
                user.getRole().name().equalsIgnoreCase("ADMIN") &&
                role.equalsIgnoreCase("USER")) {
            throw new InvalidRequestException("Cannot change an admin user to a regular user role.");
        }
        
        try {
            user.setRole(com.aiexam.model.enums.UserRole.valueOf(role.toUpperCase()));
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User role updated successfully");
            response.put("userId", userId);
            response.put("newRole", role);
            
            return response;
        } catch (IllegalArgumentException e) {
            throw new InvalidRequestException("Invalid role: " + role);
        }
    }

    @Transactional
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(userId);
        log.info("User deleted by admin: {}", userId);
    }

    @Transactional
    public void deleteExam(String examId) {
        if (!historyRepository.existsById(examId)) {
            throw new ResourceNotFoundException("Exam not found");
        }
        historyRepository.deleteById(examId);
        log.info("Exam deleted by admin: {}", examId);
    }

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        
        Map<String, Object> components = new HashMap<>();
        components.put("database", "UP");
        components.put("aiService", "UP");
        components.put("emailService", "UP");
        
        health.put("components", components);
        return health;
    }

    public Map<String, Object> getPerformanceMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        Map<String, Object> responseTimes = new HashMap<>();
        responseTimes.put("apiResponseTime", 150);
        responseTimes.put("aiResponseTime", 2000);
        responseTimes.put("databaseResponseTime", 50);
        
        metrics.put("responseTimes", responseTimes);
        
        Map<String, Object> resourceUsage = new HashMap<>();
        resourceUsage.put("cpuUsage", 35);
        resourceUsage.put("memoryUsage", 55);
        resourceUsage.put("diskUsage", 40);
        
        metrics.put("resourceUsage", resourceUsage);
        
        metrics.put("requestsPerSecond", 10);
        metrics.put("peakRequestsPerSecond", 50);
        
        return metrics;
    }

    public Map<String, Object> getSettings() {
        Map<String, Object> result = new HashMap<>();
        List<com.aiexam.model.SystemSetting> settings = settingRepository.findAll();
        Map<String, String> dbSettings = new HashMap<>();
        for (com.aiexam.model.SystemSetting s : settings) {
            dbSettings.put(s.getSettingKey(), s.getSettingValue());
        }

        DEFAULT_SETTINGS.forEach((key, defaultValue) -> {
            String val = dbSettings.getOrDefault(key, defaultValue);
            if (key.equals("maintenanceMode") || key.equals("registrationEnabled") || key.equals("emailNotifications")) {
                result.put(key, Boolean.parseBoolean(val));
            } else if (key.equals("maxExamAttempts") || key.equals("maxQuestions") || key.equals("minQuestions")) {
                try {
                    result.put(key, Integer.parseInt(val));
                } catch (NumberFormatException e) {
                    result.put(key, Integer.parseInt(defaultValue));
                }
            } else {
                result.put(key, val);
            }
        });

        return result;
    }

    @Transactional
    public Map<String, Object> updateSettings(Map<String, Object> updates) {
        updates.forEach((key, value) -> {
            if (value != null) {
                com.aiexam.model.SystemSetting setting = com.aiexam.model.SystemSetting.builder()
                        .settingKey(key)
                        .settingValue(value.toString())
                        .build();
                settingRepository.save(setting);
            }
        });
        return getSettings();
    }
}