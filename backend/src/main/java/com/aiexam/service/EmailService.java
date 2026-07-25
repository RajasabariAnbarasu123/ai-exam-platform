package com.aiexam.service;

import com.aiexam.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final SystemSettingService systemSettingService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    @Async
    public void sendVerificationEmail(String to, String token) {
        try {
            String subject = "Verify Your Email - AI Exam Platform";
            String verificationUrl = appUrl + "/verify-email?token=" + token;
            
            Context context = new Context();
            context.setVariable("verificationUrl", verificationUrl);
            context.setVariable("appName", "AI Exam Platform");
            
            String htmlContent = templateEngine.process("email-verification", context);
            
            sendEmail(to, subject, htmlContent);
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
            
            sendEmail(to, subject, htmlContent);
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
            
            sendEmail(to, subject, htmlContent);
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

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setReplyTo(userEmail);
            helper.setTo("2k22cse123@kiot.ac.in");
            helper.setSubject(emailSubject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Contact form email sent from {} to 2k22cse123@kiot.ac.in", userEmail);
        } catch (Exception e) {
            log.error("Failed to send contact form email from {}: {}", userEmail, e.getMessage());
        }
    }

    private void sendEmail(String to, String subject, String htmlContent) throws jakarta.mail.MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
        log.debug("Email sent successfully to: {}", to);
    }
}