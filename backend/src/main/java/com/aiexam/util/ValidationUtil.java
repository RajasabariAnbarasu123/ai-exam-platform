package com.aiexam.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = 
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    private static final Pattern PASSWORD_PATTERN = 
            Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$");
    
    private static final Pattern PHONE_PATTERN = 
            Pattern.compile("^\\+?[0-9]{10,15}$");
    
    private static final Pattern URL_PATTERN = 
            Pattern.compile("^(https?://)[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$");
    
    private static final Pattern ALPHANUMERIC_PATTERN = 
            Pattern.compile("^[a-zA-Z0-9\\s]+$");

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && 
               password.length() >= 8 && 
               PASSWORD_PATTERN.matcher(password).matches();
    }

    public static boolean isValidPhoneNumber(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }

    public static boolean isValidUrl(String url) {
        return url != null && URL_PATTERN.matcher(url).matches();
    }

    public static boolean isValidTopic(String topic) {
        return topic != null && !topic.trim().isEmpty() && topic.length() <= 100;
    }

    public static boolean isValidDifficulty(String difficulty) {
        return difficulty != null && 
               (difficulty.equalsIgnoreCase("EASY") || 
                difficulty.equalsIgnoreCase("MEDIUM") || 
                difficulty.equalsIgnoreCase("HARD"));
    }

    public static boolean isValidQuestionType(String questionType) {
        return questionType != null && 
               (questionType.equalsIgnoreCase("MCQ") || 
                questionType.equalsIgnoreCase("TRUE_FALSE") || 
                questionType.equalsIgnoreCase("FILL_IN_THE_BLANK") || 
                questionType.equalsIgnoreCase("SHORT_ANSWER") || 
                questionType.equalsIgnoreCase("CODING"));
    }

    public static boolean isValidQuestionCount(int count) {
        return count >= 5 && count <= 30;
    }

    public static boolean isValidPasswordConfirmation(String password, String confirmPassword) {
        return password != null && password.equals(confirmPassword);
    }

    public static String sanitizeInput(String input) {
        if (input == null) return null;
        return input.trim()
                   .replaceAll("<", "&lt;")
                   .replaceAll(">", "&gt;")
                   .replaceAll("\"", "&quot;")
                   .replaceAll("'", "&#x27;")
                   .replaceAll("/", "&#x2F;");
    }

    public static boolean isNumeric(String str) {
        return str != null && str.matches("-?\\d+(\\.\\d+)?");
    }

    public static boolean isAlpha(String str) {
        return str != null && str.matches("^[a-zA-Z\\s]+$");
    }

    public static boolean isAlphaNumeric(String str) {
        return str != null && ALPHANUMERIC_PATTERN.matcher(str).matches();
    }

    public static boolean isValidUUID(String uuid) {
        try {
            java.util.UUID.fromString(uuid);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static boolean isWithinRange(int value, int min, int max) {
        return value >= min && value <= max;
    }
}