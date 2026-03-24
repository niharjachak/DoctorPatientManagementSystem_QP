package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Users;
import com.questpro.doctor_patient_system.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface IUserRepository extends JpaRepository<Users, Long> {

     Optional<Users> findByEmail(String email);

     long countByRole(Role role);


    boolean existsByPhoneNumber(String phoneNumber);
}
