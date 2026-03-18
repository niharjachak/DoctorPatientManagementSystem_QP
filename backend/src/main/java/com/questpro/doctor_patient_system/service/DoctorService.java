package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.CreateDoctorRequestDto;
import com.questpro.doctor_patient_system.dtos.CreateDoctorResponseDto;
import com.questpro.doctor_patient_system.entities.Doctor;
import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.entities.Users;
import com.questpro.doctor_patient_system.enums.Role;
import com.questpro.doctor_patient_system.exceptions.HospitalNotFoundException;
import com.questpro.doctor_patient_system.exceptions.UnauthorizedException;
import com.questpro.doctor_patient_system.exceptions.UserAlreadyExistsException;
import com.questpro.doctor_patient_system.exceptions.UserNotFoundException;
import com.questpro.doctor_patient_system.repository.IDoctorRepository;
import com.questpro.doctor_patient_system.repository.IUserRepository;
import io.jsonwebtoken.security.Password;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.events.Event;

import javax.print.Doc;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@Transactional
public class DoctorService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IDoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public CreateDoctorResponseDto createDoctor(CreateDoctorRequestDto dto,String adminEmail){
        //check if admin exists and is associated with any hospital or not
        Hospital hospital = getAndValidateAdminHospital(adminEmail);

        //2 check for duplicate email
        if(userRepository.findByEmail(dto.getEmail()).isPresent()){
            throw new UserAlreadyExistsException("User already exists");
        }
        //3 Generating onetime password
        String tempPassword= generateTempPassword();

        // 4 Create a User Record
        Users doctorUsers = new Users();
        doctorUsers.setName(dto.getName());
        doctorUsers.setEmail(dto.getEmail());
        doctorUsers.setPassword(passwordEncoder.encode(tempPassword));
        doctorUsers.setPhoneNumber(dto.getPhoneNumber());
        doctorUsers.setRole(Role.DOCTOR);
        doctorUsers.setHospital(hospital);
        doctorUsers.setCreatedAt(LocalDateTime.now());
        doctorUsers.setActive(true);
        doctorUsers.setMustChangePassword(true);

        Users savedUser= userRepository.save(doctorUsers);

        // 5. Creating Doctor record
        Doctor doctor = new Doctor();
        doctor.setUsers(savedUser);
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setQualification(dto.getQualification());
        doctor.setYearsOfExperience(dto.getYearsOfExperience());
        doctor.setGender(dto.getGender());
        doctor.setFees(dto.getFees());
        doctor.setHospital(hospital);

        Doctor savedDoctor = doctorRepository.save(doctor);


        return new CreateDoctorResponseDto(
                savedDoctor.getDoctorId(),
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                tempPassword,
                savedDoctor.getSpeciality().name(),
                hospital.getName()
        );


    }

    // THis method generates a temporary 8 character password by randomly choosing
    // any character present at randomly generated index

    private String generateTempPassword() {
        String chars ="ABCDEFG232092+#(%U)HIJKLNOPQRSTUVWXYZabcde524859)*$#@1fghijklmnopqrstuvwxyz";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for(int i =0;i<8;i++){
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }


    private Hospital getAndValidateAdminHospital(String adminEmail){
        Users admin= userRepository.findByEmail(adminEmail)
                .orElseThrow(()-> new UserNotFoundException("Admin not Found"));

        Hospital hospital = admin.getHospital();
        if(hospital==null){
            throw  new HospitalNotFoundException("Admin not Associated with any hospital!");
        }
        return hospital;
    }

    private void validateDoctorBelongsToHospital(Doctor doctor , Hospital hospital){
        if (doctor.getHospital().getHospitalId()!=(hospital.getHospitalId())){
            throw new UnauthorizedException("Access Denied! Doctor does not belong to your Hosptial");
        }
    }


}
