package com.aiexam.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class SecurityAuditFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long startTime = System.currentTimeMillis();
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            log.debug("Request: {} {} from {} took {}ms",
                    request.getMethod(),
                    request.getRequestURI(),
                    request.getRemoteAddr(),
                    duration);
            
            // Log security-related headers
            log.debug("User-Agent: {}", request.getHeader("User-Agent"));
            log.debug("Referer: {}", request.getHeader("Referer"));
        }
    }
}