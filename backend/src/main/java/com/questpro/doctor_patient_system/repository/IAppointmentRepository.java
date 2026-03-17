package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAppointmentRepository extends JpaRepository<Appointment,Long> {
}
