package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.RegisterRequestDto;
import com.questpro.doctor_patient_system.entities.Patient;
import com.questpro.doctor_patient_system.entities.User;
import com.questpro.doctor_patient_system.enums.Role;
import com.questpro.doctor_patient_system.repository.IPatientRepository;
import com.questpro.doctor_patient_system.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    IPatientRepository patientRepository;


    public String registerUser(RegisterRequestDto registerRequestDto){
        if(userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()){
            throw new RuntimeException("User with email already exists");
        }

        User user = new User();
        user.setName(registerRequestDto.getName());
        user.setEmail(registerRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setPhoneNumber(registerRequestDto.getPhoneNumber());
        user.setRole(Role.PATIENT);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        Patient patient= new Patient();
        patient.setDateOfBirth(registerRequestDto.getDateOfBirth());
        patient.setUser(user);
        patientRepository.save(patient);

        return "Patient Saved Succesfully!";
    }

}
