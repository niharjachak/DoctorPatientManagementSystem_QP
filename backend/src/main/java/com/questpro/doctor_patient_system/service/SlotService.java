package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.SlotRequestDto;
import com.questpro.doctor_patient_system.dtos.SlotResponseDto;
import com.questpro.doctor_patient_system.entities.Doctor;
import com.questpro.doctor_patient_system.entities.Slot;
import com.questpro.doctor_patient_system.entities.Users;
import com.questpro.doctor_patient_system.enums.SlotStatus;
import com.questpro.doctor_patient_system.exceptions.InvalidSlotTimeException;
import com.questpro.doctor_patient_system.exceptions.UnauthorizedException;
import com.questpro.doctor_patient_system.exceptions.UserNotFoundException;
import com.questpro.doctor_patient_system.repository.IDoctorRepository;
import com.questpro.doctor_patient_system.repository.ISlotRepository;
import com.questpro.doctor_patient_system.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlotService {
    @Autowired
    ISlotRepository slotRepository;

    @Autowired
    private IDoctorRepository doctorRepository;

    @Autowired
    private IUserRepository userRepository;



    @Transactional
    public SlotResponseDto addSlot(SlotRequestDto dto, String doctorEmail){

        Doctor doctor = getDoctorFromEmail(doctorEmail);

        //1 Validate if start time and endtime is correct
        if(dto.getStartTime().isAfter(dto.getEndTime())){
            throw new InvalidSlotTimeException("Start time Cannot be after end Time");
        }
        // 2 validate if doctor is booking post dated slot
        if(dto.getStartTime().isBefore(LocalDateTime.now())){
            throw new InvalidSlotTimeException("Slot time Cannot be In the Past");
        }

        //Checking if slots are not overlapping
        boolean hasOverLap= slotRepository.existsOverlappingSlot(
                doctor,
                dto.getStartTime(),
                dto.getEndTime()
        );

        if (hasOverLap){
            throw new InvalidSlotTimeException("THe Slot Overlaps with One of the existing Slots");
        }

        Slot slot = new Slot();
        slot.setDoctor(doctor);
        slot.setSlotDate(dto.getSlotDate());
        slot.setStartTime(dto.getStartTime());
        slot.setEndTime(dto.getEndTime());
        slot.setSlotStatus(SlotStatus.AVAILABLE);

        Slot savedSlot= slotRepository.save(slot);

        return mapToDto(savedSlot);

    }

    public List<SlotResponseDto> getMySlots(String doctorEmail) {
        Doctor doctor = getDoctorFromEmail(doctorEmail);

        // get a list of slots of a doctor and from the list map each slot
        // to the slot responsedto and the responsedtos in a list
        return slotRepository.findByDoctor(doctor)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    // ── DELETE /doctor/slots/{slotId} ──────────────────────────
    @Transactional
    public void deleteSlot(Long slotId, String doctorEmail) {
        Doctor doctor = getDoctorFromEmail(doctorEmail);

        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 1. Ensure slot belongs to this doctor
        if (slot.getDoctor().getDoctorId() != doctor.getDoctorId()) {
            throw new UnauthorizedException("You can only delete your own slots");
        }

        // 2. Cannot delete a booked slot
        if (slot.getSlotStatus() == SlotStatus.BOOKED) {
            throw new RuntimeException("Cannot delete a slot that is already booked");
        }

        slotRepository.delete(slot);
    }




    private Doctor getDoctorFromEmail(String doctorEmail) {

        Users users = userRepository.findByEmail(doctorEmail)
                .orElseThrow(()-> new UserNotFoundException("User Not Found"));

            return doctorRepository.findByUsers(users)
                    .orElseThrow(()-> new UserNotFoundException("Doctor Profile not found!"));
    }


    // mapper function to map slot to SlotResponseDto
    private SlotResponseDto mapToDto(Slot slot) {

        return SlotResponseDto.builder()
                .slotId(slot.getSlotId())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .slotStatus(slot.getSlotStatus().name())
                .build();
    }
}
