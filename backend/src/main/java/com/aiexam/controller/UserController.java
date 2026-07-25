package com.aiexam.controller;

import com.aiexam.dto.request.ChangePasswordRequest;
import com.aiexam.dto.response.ApiResponse;
import com.aiexam.dto.response.UserProfileResponse;
import com.aiexam.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        String userId = authentication.getName();
        UserProfileResponse response = userService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody Map<String, Object> updates,
            Authentication authentication) {
        String userId = authentication.getName();
        UserProfileResponse response = userService.updateUserProfile(userId, updates);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        ApiResponse response = userService.changePassword(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<ApiResponse> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String userId = authentication.getName();
        ApiResponse response = userService.uploadProfilePicture(userId, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> stats = userService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/best-topic")
    public ResponseEntity<Map<String, Object>> getBestTopic(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> topic = userService.getBestTopic(userId);
        return ResponseEntity.ok(topic);
    }

    @GetMapping("/weak-topic")
    public ResponseEntity<Map<String, Object>> getWeakTopic(Authentication authentication) {
        String userId = authentication.getName();
        Map<String, Object> topic = userService.getWeakTopic(userId);
        return ResponseEntity.ok(topic);
    }

    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse> deleteAccount(Authentication authentication) {
        String userId = authentication.getName();
        ApiResponse response = userService.deleteAccount(userId);
        return ResponseEntity.ok(response);
    }
}