package com.questpro.doctor_patient_system.scheduler;

import com.questpro.doctor_patient_system.repository.IBlacklistedTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Component
public class TokenCleanUpScheduler {
    @Autowired
    private IBlacklistedTokenRepository blacklistedTokenRepository;


    //RUN EVERY MIDNIGHT AT 12:00:00 to delete all expired tokens
    // cron expression specifies the time frame at which this scheduler will run
    //
    // 1-second
    // 2-minute
    // 3- hour
    // 4-day of month
    // 5-Month
    // 6 - day
    //                 1 2 3 4 5 6
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanExpiredTokens() {
        blacklistedTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("Expired blacklisted tokens cleaned up");
    }
}

