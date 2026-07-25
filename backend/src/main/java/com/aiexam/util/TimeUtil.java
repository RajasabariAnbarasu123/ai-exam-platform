package com.aiexam.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class TimeUtil {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(FORMATTER);
    }

    public static String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DATE_FORMATTER);
    }

    public static String formatTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(TIME_FORMATTER);
    }

    public static String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }

        LocalDateTime now = LocalDateTime.now();
        long seconds = ChronoUnit.SECONDS.between(dateTime, now);
        
        if (seconds < 60) {
            return seconds + " seconds ago";
        }
        
        long minutes = seconds / 60;
        if (minutes < 60) {
            return minutes + " minutes ago";
        }
        
        long hours = minutes / 60;
        if (hours < 24) {
            return hours + " hours ago";
        }
        
        long days = hours / 24;
        if (days < 30) {
            return days + " days ago";
        }
        
        long months = days / 30;
        if (months < 12) {
            return months + " months ago";
        }
        
        long years = months / 12;
        return years + " years ago";
    }

    public static boolean isExpired(LocalDateTime expiryTime) {
        return expiryTime != null && expiryTime.isBefore(LocalDateTime.now());
    }

    public static long getTimeDifferenceInSeconds(LocalDateTime start, LocalDateTime end) {
        return ChronoUnit.SECONDS.between(start, end);
    }

    public static long getTimeDifferenceInMinutes(LocalDateTime start, LocalDateTime end) {
        return ChronoUnit.MINUTES.between(start, end);
    }

    public static long getTimeDifferenceInHours(LocalDateTime start, LocalDateTime end) {
        return ChronoUnit.HOURS.between(start, end);
    }

    public static String formatDuration(int seconds) {
        int hours = seconds / 3600;
        int minutes = (seconds % 3600) / 60;
        int secs = seconds % 60;
        
        if (hours > 0) {
            return String.format("%d:%02d:%02d", hours, minutes, secs);
        } else {
            return String.format("%d:%02d", minutes, secs);
        }
    }

    public static LocalDateTime addMinutes(LocalDateTime dateTime, int minutes) {
        return dateTime.plusMinutes(minutes);
    }

    public static LocalDateTime addHours(LocalDateTime dateTime, int hours) {
        return dateTime.plusHours(hours);
    }

    public static LocalDateTime addDays(LocalDateTime dateTime, int days) {
        return dateTime.plusDays(days);
    }

    public static LocalDateTime getStartOfDay(LocalDateTime dateTime) {
        return dateTime.toLocalDate().atStartOfDay();
    }

    public static LocalDateTime getEndOfDay(LocalDateTime dateTime) {
        return dateTime.toLocalDate().atTime(23, 59, 59);
    }

    public static boolean isToday(LocalDateTime dateTime) {
        return dateTime != null && 
               dateTime.toLocalDate().equals(LocalDateTime.now().toLocalDate());
    }

    public static boolean isThisWeek(LocalDateTime dateTime) {
        if (dateTime == null) return false;
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        return dateTime.isAfter(weekStart);
    }
}