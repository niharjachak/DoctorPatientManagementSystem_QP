package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.*;
import com.questpro.doctor_patient_system.entities.Doctor;
import com.questpro.doctor_patient_system.enums.Gender;
import com.questpro.doctor_patient_system.enums.Speciality;
import com.questpro.doctor_patient_system.service.DoctorService;
import com.questpro.doctor_patient_system.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private DoctorService doctorService;


    @GetMapping("/getHospitals")
    public ResponseEntity<List<HospitalResponseDto>> getAllHospitals(){
        List<HospitalResponseDto> response = hospitalService.getAllHospitals();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/getDoctors")
    public ResponseEntity<ApiResponse<List<DoctorSearchResponseDto>>> searchDoctors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Speciality speciality,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) Double minFee,
            @RequestParam(required = false) Double maxFee,
            @RequestParam(required = false) String hospitalName,
            @RequestParam(required = false) LocalDate date
    ) {
        DoctorFilterDto filter = new DoctorFilterDto(
                keyword, speciality, gender, minFee, maxFee, hospitalName, date
        );

        List<DoctorSearchResponseDto> response = doctorService.searchDoctors(filter);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors fetched successfully", response));
    }

    @GetMapping("/getDoctorDetails/{doctorId}")
    public ResponseEntity<ApiResponse<DoctorDetailResponseDto>> getDoctorById(
            @PathVariable Long doctorId
    ) {
        DoctorDetailResponseDto response = doctorService.getDoctorById(doctorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor fetched successfully", response));
    }


    @GetMapping("/doctors/getImage/{doctorId}")
    public ResponseEntity<byte[]> getDoctorImage(@PathVariable Long doctorId) {
        byte[] image = doctorService.getDoctorImage(doctorId);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }
}
