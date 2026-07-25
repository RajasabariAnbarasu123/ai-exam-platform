package com.aiexam.security;

import com.aiexam.exception.InvalidRequestException;
import com.aiexam.exception.TokenExpiredException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final Map<String, String> refreshTokens = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> tokenExpiry = new ConcurrentHashMap<>();
    private final JwtTokenProvider tokenProvider;

    public String generateRefreshToken(String userId) {
        String token = tokenProvider.generateRefreshToken(userId);
        refreshTokens.put(token, userId);
        tokenExpiry.put(token, LocalDateTime.now().plusDays(7));
        return token;
    }

    public void validateRefreshToken(String token) {
        if (!refreshTokens.containsKey(token)) {
            throw new InvalidRequestException("Invalid refresh token");
        }
        
        LocalDateTime expiry = tokenExpiry.get(token);
        if (expiry != null && expiry.isBefore(LocalDateTime.now())) {
            refreshTokens.remove(token);
            tokenExpiry.remove(token);
            throw new TokenExpiredException("Refresh token has expired");
        }
        
        if (!tokenProvider.validateToken(token)) {
            refreshTokens.remove(token);
            tokenExpiry.remove(token);
            throw new InvalidRequestException("Invalid refresh token");
        }
    }

    public String getUserIdFromRefreshToken(String token) {
        validateRefreshToken(token);
        return refreshTokens.get(token);
    }

    public void revokeRefreshToken(String token) {
        refreshTokens.remove(token);
        tokenExpiry.remove(token);
        log.debug("Refresh token revoked: {}", token);
    }

    public void revokeAllUserTokens(String userId) {
        refreshTokens.entrySet().removeIf(entry -> entry.getValue().equals(userId));
        tokenExpiry.entrySet().removeIf(entry -> entry.getValue() != null && 
                refreshTokens.get(entry.getKey()) != null && 
                refreshTokens.get(entry.getKey()).equals(userId));
        log.debug("All refresh tokens revoked for user: {}", userId);
    }

    public boolean isTokenActive(String token) {
        if (!refreshTokens.containsKey(token)) {
            return false;
        }
        
        LocalDateTime expiry = tokenExpiry.get(token);
        if (expiry != null && expiry.isBefore(LocalDateTime.now())) {
            return false;
        }
        
        return tokenProvider.validateToken(token);
    }

    public void cleanExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenExpiry.entrySet().removeIf(entry -> {
            if (entry.getValue().isBefore(now)) {
                refreshTokens.remove(entry.getKey());
                return true;
            }
            return false;
        });
        log.info("Cleaned expired refresh tokens");
    }
}