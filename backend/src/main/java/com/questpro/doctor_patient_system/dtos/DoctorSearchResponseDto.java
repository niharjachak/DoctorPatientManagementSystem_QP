package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSearchResponseDto {
    private Long doctorId;
    private String name;
    private String imageUrl;             // Base64 encoded
    private String speciality;
    private String qualification;
    private int yearsOfExperience;
    private double fees;
    private String hospitalName;
    private String gender;
}