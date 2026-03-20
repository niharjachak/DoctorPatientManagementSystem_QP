package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.ApiResponse;
import com.questpro.doctor_patient_system.dtos.ChangePasswordRequestDto;
import com.questpro.doctor_patient_system.dtos.SlotRequestDto;
import com.questpro.doctor_patient_system.dtos.SlotResponseDto;
import com.questpro.doctor_patient_system.service.DoctorService;
import com.questpro.doctor_patient_system.service.SlotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    SlotService slotService;

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto dto,
            Authentication authentication
            ){
        String doctorEmail = authentication.getName();
        doctorService.changePassword(dto, doctorEmail);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password Changed Successfully. Please login again" ,null));

    }

    @PostMapping("/addslots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<SlotResponseDto>> addSlot(
            @Valid @RequestBody SlotRequestDto dto,
            Authentication authentication) {
        SlotResponseDto response = slotService.addSlot(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Slot added successfully", response));
    }

    @GetMapping("/getSlots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<SlotResponseDto>>> getMySlots(
            Authentication authentication) {
        List<SlotResponseDto> response = slotService.getMySlots(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Slots fetched successfully", response));
    }

    @DeleteMapping("/deleteslots/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<String>> deleteSlot(
            @PathVariable Long slotId,
            Authentication authentication) {
        slotService.deleteSlot(slotId, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Slot deleted successfully", null));
    }





}
