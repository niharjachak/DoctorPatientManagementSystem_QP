package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.*;
import com.questpro.doctor_patient_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<RegisterResponseDto>> registerPatient(@RequestBody RegisterRequestDto registerRequestDto){
        RegisterResponseDto response=authService.registerUser(registerRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true,"Patient Registration Successful", response));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<RegisterResponseDto>> registerAdmin(@RequestBody AdminRegisterRequestDto registerRequestDto){
        RegisterResponseDto response=authService.registerAdmin(registerRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true,"Admin Registration Successful", response));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> loginUser(@RequestBody LoginRequestDto loginRequestDto){

        LoginResponseDto response = authService.loginUser(loginRequestDto);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login Succesfull",response)
        );

    }




}
