package com.questpro.doctor_patient_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponseDto {

    // summary metrics
    private long totalPatients;
    private long activeDoctors;
    private long totalAppointments;
    private double cancellationRate;

    // bar chart data
    private List<SpecialityCountDto> mostBookedSpecialities;
    private List<DoctorBookingCountDto> mostBookedDoctors;

    // line chart data
    private List<DailyAppointmentCountDto> appointmentsLast30Days;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpecialityCountDto {
        private String speciality;
        private long count;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorBookingCountDto {
        private String doctorName;
        private long count;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyAppointmentCountDto {
        private LocalDate date;
        private long count;
    }
}