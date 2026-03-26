package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Doctor;
import com.questpro.doctor_patient_system.entities.Slot;
import com.questpro.doctor_patient_system.enums.SlotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ISlotRepository extends JpaRepository<Slot,Long> {

    List<Slot> findByDoctor(Doctor doctor);

    // Query to check if there is any slot
    // where the doctor is same and slot is not cancelled
    // and the start time of one slot is not before the end time of another
    // if this is true then the count will not be zero
    // and hence return false;
    @Query("""
        SELECT COUNT(s) > 0 FROM Slot s
        WHERE s.doctor = :doctor
        AND s.slotStatus != 'CANCELLED'
        AND s.startTime < :endTime
        AND s.endTime > :startTime
    """)
    boolean existsOverlappingSlot(
            @Param("doctor") Doctor doctor,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    //the database row gets locked untill one transaction completes
    // so no two people can book same slot at one time
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.slotId = :slotId")
    Optional<Slot> findByIdWithLock(@Param("slotId") Long slotId);

    List<Slot> findByDoctorAndSlotStatus(Doctor doctor, SlotStatus slotStatus);

    @Query("""
        SELECT s FROM Slot s
        WHERE s.doctor = :doctor
        AND s.slotStatus = 'AVAILABLE'
        AND (
            s.slotDate > :today
            OR (s.slotDate = :today AND FUNCTION('TIME', s.startTime) > :now)
        )
        ORDER BY s.slotDate ASC, s.startTime ASC
    """)
    List<Slot> findAvailableFutureSlots(
            @Param("doctor") Doctor doctor,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now
    );



}
