package com.questpro.doctor_patient_system.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequestDto {

    @NotNull(message = "Doctor ID is required")
    @Positive(message = "Doctor ID must be a positive number")
    private Long doctorId;

    @NotNull(message = "Slot ID is required")
    @Positive(message = "Slot ID must be a positive number")
    private Long slotId;
}
