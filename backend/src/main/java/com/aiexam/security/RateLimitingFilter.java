package com.aiexam.security;

import com.aiexam.exception.RateLimitExceededException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    @Value("${rate.limit.requests-per-minute:100}")
    private int requestsPerMinute;

    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = getClientIp(request);
        RequestCounter counter = requestCounts.computeIfAbsent(clientIp, k -> new RequestCounter());

        synchronized (counter) {
            if (counter.isLimitExceeded(requestsPerMinute)) {
                log.warn("Rate limit exceeded for IP: {}", clientIp);
                throw new RateLimitExceededException("Too many requests. Please try again later.");
            }
            counter.increment();
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private static class RequestCounter {
        private long count = 0;
        private long lastReset = System.currentTimeMillis();

        public synchronized void increment() {
            long now = System.currentTimeMillis();
            if (now - lastReset > 60000) {
                count = 0;
                lastReset = now;
            }
            count++;
        }

        public synchronized boolean isLimitExceeded(int limit) {
            long now = System.currentTimeMillis();
            if (now - lastReset > 60000) {
                count = 0;
                lastReset = now;
                return false;
            }
            return count >= limit;
        }
    }
}