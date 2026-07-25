package com.aiexam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetResponse {
    
    private Boolean success;
    private String message;
    private String email;
    private LocalDateTime requestTime;
    private Integer expiryHours;
}