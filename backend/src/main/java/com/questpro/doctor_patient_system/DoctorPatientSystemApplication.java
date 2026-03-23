package com.questpro.doctor_patient_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class DoctorPatientSystemApplication {
                            // this array stores the args that we pass from commandline
                            // if we run program from command line and have some extra
                            // arguments they will be stored in that array
	public static void main(String[] args) {
		SpringApplication.run(DoctorPatientSystemApplication.class, args);
	}

}
