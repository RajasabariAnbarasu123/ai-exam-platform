package com.aiexam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    
    private Boolean success;
    private String message;
    private Object data;
    private String timestamp;
    private String path;
    private Integer statusCode;
}