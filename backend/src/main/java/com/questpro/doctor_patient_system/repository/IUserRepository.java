package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {

     Optional<User> findByEmail(String email);
}
