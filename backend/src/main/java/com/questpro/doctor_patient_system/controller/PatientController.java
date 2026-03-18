package com.questpro.doctor_patient_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient")
public class PatientController {

    @GetMapping("/test")
    public String patientTest(){
        return "Patient Accessed";
    }

//    @GetMapping("/doctor/test")
//    public String doctorTest(){
//        return "Doctor Accessed";
//    }
//
//    @GetMapping("/admin/test")
//    public String adminTest(){
//        return "Admin Accessed";
//    }
}
