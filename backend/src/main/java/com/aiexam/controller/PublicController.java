package com.aiexam.controller;

import com.aiexam.service.SystemSettingService;
import com.aiexam.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Publicly accessible endpoints (no auth required).
 * Used by the frontend to check platform status before the user even logs in.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final SystemSettingService systemSettingService;
    private final EmailService emailService;

    /**
     * Returns platform-wide status flags that the frontend needs
     * before authentication (maintenance mode, registration toggle).
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getPlatformStatus() {
        return ResponseEntity.ok(Map.of(
            "maintenanceMode",      systemSettingService.isMaintenanceMode(),
            "registrationEnabled",  systemSettingService.isRegistrationEnabled()
        ));
    }

    /**
     * Public contact/support message handler.
     */
    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> sendContactMessage(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String subject = request.get("subject");
        String message = request.get("message");

        if (name == null || email == null || subject == null || message == null ||
            name.isBlank() || email.isBlank() || subject.isBlank() || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required"));
        }

        emailService.sendContactMessage(name, email, subject, message);
        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }
}
