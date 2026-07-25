package com.aiexam.security;

import com.aiexam.service.SystemSettingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

/**
 * When Maintenance Mode is enabled in Admin Settings, this filter rejects
 * ALL requests from regular users (non-admin endpoints) with HTTP 503.
 * Admin endpoints (/api/admin/**) and the auth/login endpoint (/api/auth/login,
 * /api/auth/refresh-token) are always allowed through so admins can still log in
 * and turn maintenance mode off again.
 * The public status endpoint (/api/public/status) is also exempt so the
 * frontend can detect maintenance mode and show a friendly page.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class MaintenanceModeFilter extends OncePerRequestFilter {

    private final SystemSettingService systemSettingService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Always allow: admin endpoints, login, token refresh, and public status
        if (isExempt(path)) {
            chain.doFilter(request, response);
            return;
        }

        if (systemSettingService.isMaintenanceMode()) {
            log.warn("Maintenance mode active — blocking request to: {}", path);
            response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                objectMapper.writeValueAsString(Map.of(
                    "success", false,
                    "message", "The platform is currently under maintenance. Please try again later.",
                    "statusCode", 503
                ))
            );
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean isExempt(String path) {
        return path.startsWith("/api/admin/")
            || path.equals("/api/auth/login")
            || path.equals("/api/auth/refresh-token")
            || path.equals("/api/auth/logout")
            || path.startsWith("/api/public/")
            || path.startsWith("/swagger-ui/")
            || path.startsWith("/v3/api-docs/");
    }
}
