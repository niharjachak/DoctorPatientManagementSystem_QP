package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.ApiResponse;
import com.questpro.doctor_patient_system.dtos.CreateDoctorRequestDto;
import com.questpro.doctor_patient_system.dtos.CreateDoctorResponseDto;
import com.questpro.doctor_patient_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/createDoctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CreateDoctorResponseDto>> createDoctor(
            @RequestBody CreateDoctorRequestDto dto,
            Authentication authentication
            ){
            String adminEmail = authentication.getName();
            CreateDoctorResponseDto response= doctorService.createDoctor(dto,adminEmail);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true,"Doctor Created Successfully! ", response));
    }



}
