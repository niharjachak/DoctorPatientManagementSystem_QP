package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.ApiResponse;
import com.questpro.doctor_patient_system.dtos.AppointmentRequestDto;
import com.questpro.doctor_patient_system.dtos.AppointmentResponseDto;
import com.questpro.doctor_patient_system.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {


        @Autowired
        private AppointmentService appointmentService;

        @PostMapping("/bookappointment")
        @PreAuthorize("hasRole('PATIENT')")
        public ResponseEntity<ApiResponse<AppointmentResponseDto>> bookAppointment(
                @RequestBody AppointmentRequestDto dto,
                Authentication authentication
        ) {
            AppointmentResponseDto response = appointmentService
                    .bookAppointment(dto, authentication.getName());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Appointment booked successfully", response));
        }

        @GetMapping("/getappointments")
        @PreAuthorize("hasRole('PATIENT')")
        public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getMyAppointments(
                Authentication authentication
        ) {
            List<AppointmentResponseDto> response = appointmentService.getMyAppointments(authentication.getName());
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointments fetched successfully", response));
        }

        @DeleteMapping("/deleteappointments/{appointmentId}")
        @PreAuthorize("hasRole('PATIENT')")
        public ResponseEntity<ApiResponse<String>> cancelAppointment(
                @PathVariable Long appointmentId,
                Authentication authentication
        ) {
            appointmentService.cancelAppointment(appointmentId, authentication.getName());
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment cancelled successfully", null));
        }

}
