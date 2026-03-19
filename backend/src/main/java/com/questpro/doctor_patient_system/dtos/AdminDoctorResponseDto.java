package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.aop.aspectj.annotation.NotAnAtAspectException;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDoctorResponseDto {

    private long doctorId;
    private Long userId;
    private String name;
    private String email;
    private String phoneNumber;
    private String speciality;
    private String qualification;
    private int yearsOfExperience;
    private double fees;
    private String gender;
    private String imageUrl;
    private boolean isActive;

}
