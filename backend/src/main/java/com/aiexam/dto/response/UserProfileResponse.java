package com.aiexam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    
    private String userId;
    private String fullName;
    private String email;
    private String profilePicture;
    private String bio;
    private LocalDateTime joinedDate;
    private Integer totalExams;
    private Double averageScore;
    private String bestTopic;
    private String weakTopic;
    private Boolean emailVerified;
    private String role;
    private Map<String, Object> stats;
}