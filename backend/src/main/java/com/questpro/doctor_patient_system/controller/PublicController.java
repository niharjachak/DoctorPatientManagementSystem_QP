package com.questpro.doctor_patient_system.controller;

import com.questpro.doctor_patient_system.dtos.HospitalRespDto;
import com.questpro.doctor_patient_system.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private HospitalService hospitalService;


    @GetMapping("/getHospitals")
    public ResponseEntity<List<HospitalRespDto>> getAllHospitals(){
        List<HospitalRespDto> response = hospitalService.getAllHospitals();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
