package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.AnalyticsResponseDto;
import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.enums.AppointmentStatus;
import com.questpro.doctor_patient_system.enums.Role;
import com.questpro.doctor_patient_system.repository.IAppointmentRepository;
import com.questpro.doctor_patient_system.repository.IDoctorRepository;
import com.questpro.doctor_patient_system.repository.IHospitalRepository;
import com.questpro.doctor_patient_system.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IDoctorRepository doctorRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IHospitalRepository hospitalRepository;

    @Autowired
    private DoctorService doctorService;

    public AnalyticsResponseDto getAnalytics(String adminEmail) {

        // 1. Get admin's hospital
        Hospital hospital = doctorService.getAndValidateAdminHospital(adminEmail);

        // 2. Summary metrics
        long totalPatients = userRepository.countByRole(Role.PATIENT);

        long activeDoctors = doctorRepository
                .countByHospitalAndUsersIsActive(hospital, true);

        long totalAppointments = appointmentRepository.countByHospital(hospital);

        long cancelledAppointments = appointmentRepository
                .countByHospitalAndAppointmentStatus(hospital, AppointmentStatus.CANCELLED);

        double cancellationRate = totalAppointments == 0 ? 0 :
                Math.round(((double) cancelledAppointments / totalAppointments) * 100.0 * 10) / 10.0;

        // 3. Most booked specialities
        List<AnalyticsResponseDto.SpecialityCountDto> mostBookedSpecialities =
                appointmentRepository.findMostBookedSpecialities(hospital)
                        .stream()
                        .map(row -> new AnalyticsResponseDto.SpecialityCountDto(
                                row[0].toString(),
                                (Long) row[1]
                        ))
                        .toList();

        // 4. Most booked doctors
        List<AnalyticsResponseDto.DoctorBookingCountDto> mostBookedDoctors =
                appointmentRepository.findMostBookedDoctors(hospital)
                        .stream()
                        .map(row -> new AnalyticsResponseDto.DoctorBookingCountDto(
                                row[0].toString(),
                                (Long) row[1]
                        ))
                        .toList();

        // 5. Appointments last 30 days
        LocalDateTime fromDate = LocalDateTime.now().minusDays(30);
        List<AnalyticsResponseDto.DailyAppointmentCountDto> dailyCounts =
                appointmentRepository.findDailyAppointmentsLast30Days(hospital, fromDate)
                        .stream()
                        .map(row -> new AnalyticsResponseDto.DailyAppointmentCountDto(
                                ((java.sql.Date) row[0]).toLocalDate(),
                                (Long) row[1]
                        ))
                        .toList();

        return AnalyticsResponseDto.builder()
                .totalPatients(totalPatients)
                .activeDoctors(activeDoctors)
                .totalAppointments(totalAppointments)
                .cancellationRate(cancellationRate)
                .mostBookedSpecialities(mostBookedSpecialities)
                .mostBookedDoctors(mostBookedDoctors)
                .appointmentsLast30Days(dailyCounts)
                .build();
    }

}
