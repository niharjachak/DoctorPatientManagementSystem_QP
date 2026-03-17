package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.RegisterRequestDto;
import com.questpro.doctor_patient_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/patient")
    public String registerPatient(@RequestBody RegisterRequestDto registerRequestDto){
        return authService.registerUser(registerRequestDto);
    }




}
