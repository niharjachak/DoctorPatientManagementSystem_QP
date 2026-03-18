package com.questpro.doctor_patient_system.dtos;

import com.questpro.doctor_patient_system.enums.Gender;
import com.questpro.doctor_patient_system.enums.Speciality;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDoctorRequestDto {

    private String name;
    private String email;
    private String phoneNumber;
    private Speciality speciality;
    private String qualification;
    private int yearsOfExperience;
    private Gender gender;
    private double fees;

}
