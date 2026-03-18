package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDoctorResponseDto {

    private long doctorId;
    private long userId;
    private String name;
    private String email;
    private String temporaryPassword;
    private String speciality;
    private String hospitalName;



}
