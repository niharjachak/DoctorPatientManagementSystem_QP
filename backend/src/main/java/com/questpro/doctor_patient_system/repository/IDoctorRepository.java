package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.dtos.DoctorSearchResponseDto;
import com.questpro.doctor_patient_system.entities.Doctor;
import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IDoctorRepository  extends JpaRepository<Doctor, Long> , JpaSpecificationExecutor<Doctor> {

    Optional<Doctor> findByUsers(Users users);

    List<Doctor> findByHospital(Hospital hospital);

    long countByHospitalAndUsersIsActive(Hospital hospital , boolean isActive);

}
