package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<Users, Long> {

     Optional<Users> findByEmail(String email);
}
