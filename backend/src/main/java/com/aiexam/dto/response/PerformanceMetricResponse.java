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
public class PerformanceMetricResponse {
    
    private Map<String, Object> responseTimes;
    private Map<String, Object> resourceUsage;
    private Integer requestsPerSecond;
    private Integer peakRequestsPerSecond;
    private Map<String, Double> percentiles;
    private Map<String, Object> customMetrics;
}