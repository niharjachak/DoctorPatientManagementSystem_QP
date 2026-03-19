package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDetailResponseDto {
    private Long doctorId;
    private String name;
    private String imageUrl;
    private String speciality;
    private String qualification;
    private int yearsOfExperience;
    private double fees;
    private String hospitalName;
    private String gender;
    private List<SlotResponseDto> availableSlots;  // reuse existing SlotResponseDto
}

