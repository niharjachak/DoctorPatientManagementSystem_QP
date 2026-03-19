package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IHospitalRepository extends JpaRepository<Hospital,Long> {
}
