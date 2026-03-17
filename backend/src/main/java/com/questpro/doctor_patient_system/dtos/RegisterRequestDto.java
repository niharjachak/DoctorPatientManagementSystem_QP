package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private LocalDate dateOfBirth;


}
