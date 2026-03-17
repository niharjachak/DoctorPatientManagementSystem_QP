package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPatientRepository extends JpaRepository<Patient,Long> {
}
