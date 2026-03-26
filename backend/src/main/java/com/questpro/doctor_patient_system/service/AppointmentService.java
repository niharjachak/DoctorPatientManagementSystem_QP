package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.AppointmentRequestDto;
import com.questpro.doctor_patient_system.dtos.AppointmentResponseDto;
import com.questpro.doctor_patient_system.dtos.PatientRegisterResponseDto;
import com.questpro.doctor_patient_system.entities.*;
import com.questpro.doctor_patient_system.enums.AppointmentStatus;
import com.questpro.doctor_patient_system.enums.SlotStatus;
import com.questpro.doctor_patient_system.exceptions.*;
import com.questpro.doctor_patient_system.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Autowired
    private IDoctorRepository doctorRepository;

    @Autowired
    private ISlotRepository slotRepository;

    @Autowired
    private IUserRepository userRepository;



    @Transactional
    public AppointmentResponseDto bookAppointment(AppointmentRequestDto dto, String patientEmail){
        Patient patient = getPatientFromEmail(patientEmail);

        //1 Get the Doctor
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new UserNotFoundException("Doctor not found"));

        // Check if doctor is active or not
        if (!doctor.getUsers().isActive()) {
            throw new InactiveUserException("This doctor is no longer accepting appointments");
        }

        //2 As soon as you fetch the slot you lock it for this transaction
        // So that nobody will be able to book it simultaneously.
        // The slot cannot be booked by two patients simultaneously
        Slot slot= slotRepository.findByIdWithLock(dto.getSlotId())
                .orElseThrow(()-> new SlotNotFoundException("Slot Not Found"));
        
        //3 SLot must belong to this doctor 
        if(slot.getDoctor().getDoctorId()!= doctor.getDoctorId()){
            throw new InvalidSlotTimeException("The Slot Does Not Belong to this Doctor");
        }
        //4 SLot must be available
        if(slot.getSlotStatus()!= SlotStatus.AVAILABLE){
            throw new InvalidSlotTimeException("Slot is no longer Available");
        }
        if (appointmentRepository.existsBySlotAndAppointmentStatus(slot, AppointmentStatus.BOOKED)) {
            slot.setSlotStatus(SlotStatus.BOOKED);
            slotRepository.save(slot);
            throw new InvalidSlotTimeException("Slot is no longer Available");
        }

        
        //5. Mark slot as booked
        slot.setSlotStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);
        
        Appointment appointment= new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setSlot(slot);
        appointment.setHospital(doctor.getHospital());
        appointment.setAppointmentStatus(AppointmentStatus.BOOKED);
        appointment.setBookedAt(LocalDateTime.now());
        
        Appointment saved= appointmentRepository.save(appointment);
        return mapToDto(saved);

    }

    public List<AppointmentResponseDto> getMyAppointments(String patientEmail){

        Patient patient = getPatientFromEmail(patientEmail);

        // i am querying the database to get a list<appointments>
        // and then creating a stream<appointment> to map each appointment to appRespDto
        // and converting it to list
        return appointmentRepository.findByPatientOrderByBookedAtDesc(patient)
                .stream()
                .map(this::mapToDto)
                .toList();

    }


    @Transactional
    public void cancelAppointment(long appointmentId, String patientEmail){
        Patient patient = getPatientFromEmail(patientEmail);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow( ()-> new AppointmentNotFoundException("Appointment not found"));

        // 1 Appointment must belong to this Patient
        if(appointment.getPatient().getPatientId()!= patient.getPatientId()){
            throw new UnauthorizedException("You can only cancel your own appointments");
        }

        // 2 Check if already cancelled or not
        if (appointment.getAppointmentStatus()== AppointmentStatus.CANCELLED){
            throw new AppointmentAlreadyCancelledException("Appointment is already cancelled");
        }

        // 3 Cancellation Policy must be 2hrs away
        LocalDateTime slotStartTime = appointment.getSlot().getStartTime();
        long hrsUntilAppointment= ChronoUnit.HOURS.between(LocalDateTime.now(), slotStartTime);

        if(hrsUntilAppointment <=2){
            throw new UnauthorizedException("Cannot cancel — appointment is less than 2 hours away");
        }

        // 4. Cancel appointment
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledAt(LocalDateTime.now());
        appointmentRepository.save(appointment);

        // 5. Release slot back to available
        Slot slot = appointment.getSlot();
        slot.setSlotStatus(SlotStatus.AVAILABLE);
        slotRepository.save(slot);

    }

    private Patient getPatientFromEmail(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return patientRepository.findByUsers(user)
                .orElseThrow(() -> new UserNotFoundException("Patient profile not found"));
    }

    private AppointmentResponseDto mapToDto(Appointment appointment) {
        return AppointmentResponseDto.builder()
                .appointmentId(appointment.getAppointmentId())
                .doctorName(appointment.getDoctor().getUsers().getName())
                .hospitalName(appointment.getHospital().getName())
                .speciality(appointment.getDoctor().getSpeciality().name())
                .slotDate(appointment.getSlot().getSlotDate())
                .startTime(appointment.getSlot().getStartTime())
                .endTime(appointment.getSlot().getEndTime())
                .appointmentStatus(appointment.getAppointmentStatus().name())
                .bookedAt(appointment.getBookedAt())
                .cancelledAt(appointment.getCancelledAt())
                .build();
    }
}

