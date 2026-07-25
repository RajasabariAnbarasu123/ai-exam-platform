package com.aiexam.repository;

import com.aiexam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByEmailVerificationToken(String token);
    
    Optional<User> findByResetToken(String token);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.isVerified = true")
    List<User> findAllActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since")
    long countUsersCreatedSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLoginAt >= :since")
    long countActiveUsersSince(@Param("since") LocalDateTime since);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isVerified = true, u.emailVerificationToken = null WHERE u.id = :userId")
    void verifyUser(@Param("userId") String userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password, u.resetToken = null, u.resetTokenExpiry = null WHERE u.id = :userId")
    void updatePassword(@Param("userId") String userId, @Param("password") String password);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.resetToken = :token, u.resetTokenExpiry = :expiry WHERE u.email = :email")
    void setResetToken(@Param("email") String email, @Param("token") String token, @Param("expiry") LocalDateTime expiry);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLoginAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") String userId);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    List<User> findRecentUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'ADMIN'")
    long countAdmins();
}