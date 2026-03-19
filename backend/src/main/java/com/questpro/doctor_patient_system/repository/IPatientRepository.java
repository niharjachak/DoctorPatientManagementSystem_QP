package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Patient;
import com.questpro.doctor_patient_system.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface IPatientRepository extends JpaRepository<Patient,Long> {
    Optional<Patient> findByUsers(Users users);
}
