package com.aiexam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
@EnableConfigurationProperties
public class AiExamPlatformApplication {
    // Trigger reload to pick up Gemini API configuration from .env
    public static void main(String[] args) {
        // Load environment variables from .env file into System properties
        try {
            java.io.File envFile = new java.io.File(".env");
            if (!envFile.exists()) {
                // Try parent directory in case of nested running environment
                envFile = new java.io.File("../.env");
            }
            if (envFile.exists()) {
                java.nio.file.Files.lines(envFile.toPath())
                    .map(String::trim)
                    .filter(line -> !line.isEmpty() && !line.startsWith("#"))
                    .forEach(line -> {
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if (value.startsWith("\"") && value.endsWith("\"")) {
                                value = value.substring(1, value.length() - 1);
                            } else if (value.startsWith("'") && value.endsWith("'")) {
                                value = value.substring(1, value.length() - 1);
                            }
                            System.setProperty(key, value);
                        }
                    });
            }
        } catch (Exception e) {
            System.err.println("Could not load .env file: " + e.getMessage());
        }

        SpringApplication.run(AiExamPlatformApplication.class, args);
    }
}