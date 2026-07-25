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
public class EmailVerificationResponse {
    
    private Boolean success;
    private String message;
    private Boolean isVerified;
    private String email;
    private LocalDateTime verificationTime;
}