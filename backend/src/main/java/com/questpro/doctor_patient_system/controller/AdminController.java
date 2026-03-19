package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.*;
import com.questpro.doctor_patient_system.service.AnalyticsService;
import com.questpro.doctor_patient_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AnalyticsService analyticsService;

    @PostMapping(value = "/createDoctor" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CreateDoctorResponseDto>> createDoctor(
            @RequestPart("data") CreateDoctorRequestDto dto,
            @RequestPart(value = "image", required = true) MultipartFile image,
            Authentication authentication
            ){
            String adminEmail = authentication.getName();
            CreateDoctorResponseDto response= doctorService.createDoctor(dto,image, adminEmail);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true,"Doctor Created Successfully! ", response));
    }

    @GetMapping("/getHospitalDoctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminDoctorResponseDto>>> getDoctors(
            Authentication authentication) {
        List<AdminDoctorResponseDto> response = doctorService
                .getDoctorsByHospital(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors fetched successfully", response));
    }

    @PutMapping("/updatedoctorstatus/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateDoctorStatus(
            @PathVariable Long doctorId,
            @RequestParam boolean isActive,
            Authentication authentication) {
        doctorService.updateDoctorStatus(doctorId, isActive, authentication.getName());
        String message = isActive ? "Doctor activated successfully" : "Doctor deactivated successfully";
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnalyticsResponseDto>> getAnalytics(
            Authentication authentication) {
        AnalyticsResponseDto response = analyticsService.getAnalytics(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Analytics fetched successfully", response));
    }


}
