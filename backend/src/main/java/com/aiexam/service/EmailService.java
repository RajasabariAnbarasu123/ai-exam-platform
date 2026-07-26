package com.aiexam.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate;
    private final TemplateEngine templateEngine;
    private final SystemSettingService systemSettingService;

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String fromEmail;

    @Value("${brevo.sender.name:AI Exam Platform}")
    private String fromName;

    @Value("${app.url:https://ai-exam-platform-gl4d.onrender.com}")
    private String appUrl;

    public EmailService(TemplateEngine templateEngine, SystemSettingService systemSettingService) {
        this.restTemplate = new RestTemplate();
        this.templateEngine = templateEngine;
        this.systemSettingService = systemSettingService;
    }

    @Async
    public void sendVerificationEmail(String to, String token) {
        try {
            String subject = "Verify Your Email - AI Exam Platform";
            String verificationUrl = appUrl + "/verify-email?token=" + token;

            Context context = new Context();
            context.setVariable("verificationUrl", verificationUrl);
            context.setVariable("appName", "AI Exam Platform");

            String htmlContent = templateEngine.process("email-verification", context);

            sendEmail(to, subject, htmlContent, null);
            log.info("Verification email sent to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        if (!systemSettingService.isEmailNotificationsEnabled()) {
            log.info("Email notifications disabled — skipping password reset email to {}", to);
            return;
        }
        try {
            String subject = "Reset Your Password - AI Exam Platform";
            String resetUrl = appUrl + "/reset-password?token=" + token;

            Context context = new Context();
            context.setVariable("resetUrl", resetUrl);
            context.setVariable("appName", "AI Exam Platform");

            String htmlContent = templateEngine.process("forgot-password", context);

            sendEmail(to, subject, htmlContent, null);
            log.info("Password reset email sent to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendExamReportEmail(String to, String examId, String reportData) {
        if (!systemSettingService.isEmailNotificationsEnabled()) {
            log.info("Email notifications disabled — skipping exam report email to {}", to);
            return;
        }
        try {
            String subject = "Your Exam Report - AI Exam Platform";
            String reportUrl = appUrl + "/results/" + examId;

            Context context = new Context();
            context.setVariable("reportUrl", reportUrl);
            context.setVariable("appName", "AI Exam Platform");
            context.setVariable("reportData", reportData);

            String htmlContent = templateEngine.process("exam-report", context);

            sendEmail(to, subject, htmlContent, null);
            log.info("Exam report email sent to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send exam report email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendContactMessage(String name, String userEmail, String subject, String messageText) {
        try {
            String emailSubject = "Contact Form: " + subject;
            String body = "<h3>New Support/Contact Request</h3>" +
                          "<p><strong>Sender Name:</strong> " + name + "</p>" +
                          "<p><strong>Sender Email:</strong> " + userEmail + "</p>" +
                          "<p><strong>Subject:</strong> " + subject + "</p>" +
                          "<p><strong>Message:</strong></p>" +
                          "<div style=\"padding: 10px; border-left: 4px solid #4F46E5; background-color: #F8FAFC;\">" +
                          messageText.replace("\n", "<br/>") +
                          "</div>";

            sendEmail("2k22cse123@kiot.ac.in", emailSubject, body, userEmail);
            log.info("Contact form email sent from {} to 2k22cse123@kiot.ac.in", userEmail);
        } catch (Exception e) {
            log.error("Failed to send contact form email from {}: {}", userEmail, e.getMessage());
        }
    }

    /**
     * Sends an email via Brevo's transactional email HTTP API.
     * replyTo may be null if no reply-to override is needed.
     */
    private void sendEmail(String to, String subject, String htmlContent, String replyTo) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", brevoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> payload = new HashMap<>();

        Map<String, String> sender = new HashMap<>();
        sender.put("name", fromName);
        sender.put("email", fromEmail);
        payload.put("sender", sender);

        Map<String, String> recipient = new HashMap<>();
        recipient.put("email", to);
        payload.put("to", List.of(recipient));

        if (replyTo != null) {
            Map<String, String> replyToMap = new HashMap<>();
            replyToMap.put("email", replyTo);
            payload.put("replyTo", replyToMap);
        }

        payload.put("subject", subject);
        payload.put("htmlContent", htmlContent);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        restTemplate.postForEntity(BREVO_API_URL, request, String.class);
        log.debug("Email sent successfully via Brevo to: {}", to);
    }
}
