package com.aiexam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    
    private Long totalUsers;
    private Long totalExams;
    private Long activeUsersToday;
    private Double globalAvgScore;
    private Map<String, Integer> popularTopics;
    private Map<String, Integer> popularDifficulties;
    private Map<String, Integer> popularQuestionTypes;
    private Map<String, Integer> dailyActiveUsers;
    private Map<String, Object> aiUsageStats;
}