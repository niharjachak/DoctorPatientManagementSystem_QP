package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface IBlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {

    // returns if the token is blacklisted and present in the table
    boolean existsByToken(String token);

    // cleanup job — delete expired tokens
    void deleteByExpiresAtBefore(LocalDateTime now);
}