package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.HospitalResponseDto;
import com.questpro.doctor_patient_system.repository.IHospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    @Autowired
    private IHospitalRepository hospitalRepository;


    public List<HospitalResponseDto> getAllHospitals(){

       return  hospitalRepository.findAll().stream()
                .map(h -> new HospitalResponseDto(h.getHospitalId(),
                        h.getName(),
                        h.getCity())).toList();

    }

}
