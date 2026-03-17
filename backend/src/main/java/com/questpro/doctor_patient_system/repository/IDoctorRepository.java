package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IDoctorRepository  extends JpaRepository<Doctor, Long> {

}
