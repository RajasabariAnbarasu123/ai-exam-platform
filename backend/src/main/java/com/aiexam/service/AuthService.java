package com.aiexam.service;

import com.aiexam.dto.request.LoginRequest;
import com.aiexam.dto.request.SignupRequest;
import com.aiexam.dto.response.ApiResponse;
import com.aiexam.dto.response.AuthResponse;
import com.aiexam.exception.InvalidRequestException;
import com.aiexam.exception.ResourceNotFoundException;
import com.aiexam.model.User;
import com.aiexam.model.enums.UserRole;
import com.aiexam.repository.UserRepository;
import com.aiexam.security.JwtTokenProvider;
import com.aiexam.security.RefreshTokenService;
import com.aiexam.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;
    private final SystemSettingService systemSettingService;

    @Transactional
    public ApiResponse registerUser(SignupRequest request) {
        // Check if registration is enabled
        if (!systemSettingService.isRegistrationEnabled()) {
            throw new InvalidRequestException(
                "User registration is currently disabled. Please contact the administrator.");
        }

        // Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new InvalidRequestException("Email is already registered");
        }

        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidRequestException("Passwords do not match");
        }

        // Create user
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setIsActive(true);
        user.setIsVerified(false); // Must verify email before login
        user.setCreatedAt(LocalDateTime.now());

        // Generate email verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);

        userRepository.save(user);

        // Send verification email only if email notifications are enabled
        if (systemSettingService.isEmailNotificationsEnabled()) {
            emailService.sendVerificationEmail(user.getEmail(), verificationToken);
        }

        return ApiResponse.builder()
                .success(true)
                .message("Registration successful. Please verify your email.")
                .data(user.getId())
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String userId = authentication.getName();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check email verification
        if (!user.getIsVerified()) {
            throw new InvalidRequestException("EMAIL_NOT_VERIFIED");
        }

        // Generate tokens using user ID as the subject
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = refreshTokenService.generateRefreshToken(userId);

        // Update last login
        userRepository.updateLastLogin(userId);

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .emailVerified(user.getIsVerified())
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        refreshTokenService.validateRefreshToken(refreshToken);
        String userId = refreshTokenService.getUserIdFromRefreshToken(refreshToken);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userId, null, null);
        
        String newAccessToken = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .userId(userId)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .emailVerified(user.getIsVerified())
                .build();
    }

    @Transactional
    public ApiResponse verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new InvalidRequestException("Invalid verification token"));

        if (user.getIsVerified()) {
            throw new InvalidRequestException("Email already verified");
        }

        userRepository.verifyUser(user.getId());

        log.info("Email verified for user: {}", user.getEmail());

        return ApiResponse.builder()
                .success(true)
                .message("Email verified successfully")
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }

    @Transactional
    public ApiResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(24);

        userRepository.setResetToken(email, resetToken, expiry);

        // Send reset password email
        emailService.sendPasswordResetEmail(email, resetToken);

        return ApiResponse.builder()
                .success(true)
                .message("Password reset instructions sent to your email")
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }

    @Transactional
    public ApiResponse resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new InvalidRequestException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidRequestException("Reset token has expired");
        }

        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(user.getId(), encodedPassword);

        log.info("Password reset successfully for user: {}", user.getEmail());

        return ApiResponse.builder()
                .success(true)
                .message("Password reset successfully")
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }

    @Transactional
    public ApiResponse logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String refreshToken = token.substring(7);
            refreshTokenService.revokeRefreshToken(refreshToken);
        }
        
        SecurityContextHolder.clearContext();

        return ApiResponse.builder()
                .success(true)
                .message("Logged out successfully")
                .timestamp(LocalDateTime.now().toString())
                .statusCode(200)
                .build();
    }
}