package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Appointment;
import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.entities.Patient;
import com.questpro.doctor_patient_system.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment,Long> {

    // returns the appointments sorted from last to first
    List<Appointment> findByPatientOrderByBookedAtDesc(Patient patient);

    // total appointments for a hospital
    long countByHospital(Hospital hospital);

    // cancelled appointments for a hospital
    long countByHospitalAndAppointmentStatus(Hospital hospital, AppointmentStatus status);

    // most booked specialities for a hospital
    @Query("""
    SELECT d.speciality, COUNT(a) FROM Appointment a
    JOIN a.doctor d
    WHERE a.hospital = :hospital
    AND a.appointmentStatus != 'CANCELLED'
    GROUP BY d.speciality
    ORDER BY COUNT(a) DESC
""")
    List<Object[]> findMostBookedSpecialities(@Param("hospital") Hospital hospital);

    // most booked doctors for a hospital
    @Query("""
    SELECT u.name, COUNT(a) FROM Appointment a
    JOIN a.doctor d
    JOIN d.users u
    WHERE a.hospital = :hospital
    AND a.appointmentStatus != 'CANCELLED'
    GROUP BY d.doctorId, u.name
    ORDER BY COUNT(a) DESC
    LIMIT 5
""")
    List<Object[]> findMostBookedDoctors(@Param("hospital") Hospital hospital);

    // appointments per day for last 30 days
    @Query("""
    SELECT CAST(a.bookedAt AS date), COUNT(a) FROM Appointment a
    WHERE a.hospital = :hospital
    AND a.bookedAt >= :fromDate
    GROUP BY CAST(a.bookedAt AS date)
    ORDER BY CAST(a.bookedAt AS date) ASC
""")
    List<Object[]> findDailyAppointmentsLast30Days(
            @Param("hospital") Hospital hospital,
            @Param("fromDate") LocalDateTime fromDate
    );
}
