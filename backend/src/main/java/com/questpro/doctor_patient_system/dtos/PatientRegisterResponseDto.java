package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class PatientRegisterResponseDto {


        private long userId;
        private long patientId;
        private String email;
        private String name;
        private String role;


}
