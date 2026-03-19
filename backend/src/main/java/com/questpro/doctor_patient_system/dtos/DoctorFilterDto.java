package com.questpro.doctor_patient_system.dtos;

import com.questpro.doctor_patient_system.enums.Gender;
import com.questpro.doctor_patient_system.enums.Speciality;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorFilterDto {
    private String keyword; // searching by name
    private Speciality speciality;
    private Gender gender;
    private Double minFee;
    private Double maxFee;
    private String hospitalName;
    private LocalDate date;
}
