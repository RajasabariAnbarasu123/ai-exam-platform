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
public class SystemHealthResponse {
    
    private String status;
    private LocalDateTime timestamp;
    private Map<String, String> components;
    private Map<String, Object> metrics;
    private String version;
    private String environment;
}