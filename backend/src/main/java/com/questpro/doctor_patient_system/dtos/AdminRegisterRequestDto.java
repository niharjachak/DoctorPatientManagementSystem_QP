package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRegisterRequestDto {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private long hospitalId;
}
