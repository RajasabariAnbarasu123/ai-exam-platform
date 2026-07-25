package com.aiexam.service;

import com.aiexam.dto.request.ChangePasswordRequest;
import com.aiexam.dto.response.ApiResponse;
import com.aiexam.dto.response.UserProfileResponse;
import com.aiexam.exception.InvalidRequestException;
import com.aiexam.exception.ResourceNotFoundException;
import com.aiexam.model.User;
import com.aiexam.repository.ExamHistoryRepository;
import com.aiexam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ExamHistoryRepository historyRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalExams = historyRepository.countExamsByUser(userId);
        Double avgScore = historyRepository.getAverageScore(userId);
        
        List<Object[]> bestTopicList = historyRepository.getBestTopic(userId);
        List<Object[]> weakTopicList = historyRepository.getWeakTopic(userId);
        String bestTopic = (bestTopicList != null && !bestTopicList.isEmpty() && bestTopicList.get(0).length > 0)
                ? (String) bestTopicList.get(0)[0] : "N/A";
        String weakTopic = (weakTopicList != null && !weakTopicList.isEmpty() && weakTopicList.get(0).length > 0)
                ? (String) weakTopicList.get(0)[0] : "N/A";

        return UserProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .joinedDate(user.getCreatedAt())
                .totalExams((int) totalExams)
                .averageScore(avgScore != null ? avgScore : 0.0)
                .bestTopic(bestTopic)
                .weakTopic(weakTopic)
                .emailVerified(user.getIsVerified())
                .role(user.getRole().name())
                .stats(getUserStats(userId))
                .build();
    }

    @Transactional
    public UserProfileResponse updateUserProfile(String userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updates.containsKey("fullName")) {
            user.setFullName((String) updates.get("fullName"));
        }

        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new InvalidRequestException("Email already in use");
            }
            user.setEmail(newEmail);
        }

        if (updates.containsKey("bio")) {
            user.setBio((String) updates.get("bio"));
        }

        userRepository.save(user);
        log.info("User profile updated: {}", userId);

        return getUserProfile(userId);
    }

    @Transactional
    public ApiResponse changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new InvalidRequestException("New passwords do not match");
        }

        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        userRepository.updatePassword(userId, encodedPassword);

        log.info("Password changed for user: {}", userId);

        return ApiResponse.builder()
                .success(true)
                .message("Password changed successfully")
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }

    @Transactional
    public ApiResponse uploadProfilePicture(String userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (file.isEmpty()) {
            throw new InvalidRequestException("File is empty");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new InvalidRequestException("File size exceeds limit (5MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidRequestException("Only image files are allowed");
        }

        String profilePictureUrl = "https://ui-avatars.com/api/?name=" + 
                user.getFullName().replace(" ", "+") + 
                "&size=150";

        user.setProfilePicture(profilePictureUrl);
        userRepository.save(user);

        return ApiResponse.builder()
                .success(true)
                .message("Profile picture updated successfully")
                .data(profilePictureUrl)
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }

    public Map<String, Object> getUserStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalExams = historyRepository.countExamsByUser(userId);
        Double avgPercentage = historyRepository.getAveragePercentage(userId);
        Double accuracy = historyRepository.getOverallAccuracy(userId);
        Integer bestScore = historyRepository.getMaxScore(userId);
        Integer totalQuestionsAttempted = historyRepository.getTotalQuestionsAttempted(userId);
        
        List<Object[]> bestTopicList = historyRepository.getBestTopic(userId);
        List<Object[]> weakTopicList = historyRepository.getWeakTopic(userId);
        String bestTopic = (bestTopicList != null && !bestTopicList.isEmpty() && bestTopicList.get(0).length > 0)
                ? (String) bestTopicList.get(0)[0] : "N/A";
        String weakTopic = (weakTopicList != null && !weakTopicList.isEmpty() && weakTopicList.get(0).length > 0)
                ? (String) weakTopicList.get(0)[0] : "N/A";
        
        long examsThisMonth = historyRepository.countExamsByUserSince(userId,
                LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0));

        stats.put("totalExams", totalExams);
        stats.put("avgPercentage", avgPercentage != null ? avgPercentage : 0.0);
        stats.put("accuracy", accuracy != null ? accuracy : 0.0);
        stats.put("bestScore", bestScore != null ? bestScore : 0);
        stats.put("totalQuestionsAttempted", totalQuestionsAttempted != null ? totalQuestionsAttempted : 0);
        stats.put("bestTopic", bestTopic);
        stats.put("weakTopic", weakTopic);
        stats.put("examsThisMonth", examsThisMonth);
        
        return stats;
    }

    public Map<String, Object> getBestTopic(String userId) {
        List<Object[]> bestTopicList = historyRepository.getBestTopic(userId);
        if (bestTopicList == null || bestTopicList.isEmpty()) {
            return Map.of("topic", "N/A", "score", 0.0);
        }
        Object[] bestTopic = bestTopicList.get(0);
        Map<String, Object> result = new HashMap<>();
        result.put("topic", bestTopic[0]);
        result.put("score", bestTopic[1]);
        return result;
    }

    public Map<String, Object> getWeakTopic(String userId) {
        List<Object[]> weakTopicList = historyRepository.getWeakTopic(userId);
        if (weakTopicList == null || weakTopicList.isEmpty()) {
            return Map.of("topic", "N/A", "score", 0.0);
        }
        Object[] weakTopic = weakTopicList.get(0);
        Map<String, Object> result = new HashMap<>();
        result.put("topic", weakTopic[0]);
        result.put("score", weakTopic[1]);
        return result;
    }

    @Transactional
    public ApiResponse deleteAccount(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userRepository.delete(user);
        
        log.info("User account deleted: {}", userId);

        return ApiResponse.builder()
                .success(true)
                .message("Account deleted successfully")
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }
}