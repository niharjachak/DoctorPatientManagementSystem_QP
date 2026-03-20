package com.questpro.doctor_patient_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DoctorPatientSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoctorPatientSystemApplication.class, args);
	}

}
