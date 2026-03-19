package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotRequestDto {
    private LocalDate slotDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
