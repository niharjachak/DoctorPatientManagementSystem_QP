package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalRespDto {
    private long id;
    private String name;
    private String city;

}
