package com.questpro.doctor_patient_system.config;

import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.repository.IHospitalRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class HospitalSeeder implements CommandLineRunner {
    @Autowired
    private IHospitalRepository hospitalRepository;


    @Override
    public void run(String... args) throws Exception {

        if(hospitalRepository.count()==0){
            log.warn("Saving Hospitals");
            hospitalRepository.save(new Hospital("Apollo Hospital", "Pune"));
            hospitalRepository.save(new Hospital("Fortis Hospital", "Delhi"));
            hospitalRepository.save(new Hospital("Manipal Hospital", "Bangalore"));
            hospitalRepository.save(new Hospital("Lilavati Hospital", "Mumbai"));
            hospitalRepository.save(new Hospital("Kokilaben Hospital", "Mumbai"));
            hospitalRepository.save(new Hospital("Max Healthcare", "Delhi"));
            hospitalRepository.save(new Hospital("Care Hospital", "Hyderabad"));
            hospitalRepository.save(new Hospital("Medanta", "Gurgaon"));
            hospitalRepository.save(new Hospital("Narayana Health", "Bangalore"));
            hospitalRepository.save(new Hospital("Aster Hospital", "Kochi"));
        }
        log.info("Hospitals Saved");

    }
}
