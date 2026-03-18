package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.*;
import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.entities.Patient;
import com.questpro.doctor_patient_system.entities.Users;
import com.questpro.doctor_patient_system.enums.Role;
import com.questpro.doctor_patient_system.exceptions.HospitalNotFoundException;
import com.questpro.doctor_patient_system.exceptions.InvalidLoginCredentialsException;
import com.questpro.doctor_patient_system.exceptions.UserAlreadyExistsException;
import com.questpro.doctor_patient_system.exceptions.UserNotFoundException;
import com.questpro.doctor_patient_system.repository.IHospitalRepository;
import com.questpro.doctor_patient_system.repository.IPatientRepository;
import com.questpro.doctor_patient_system.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    IPatientRepository patientRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private IHospitalRepository hospitalRepository;


    public LoginResponseDto loginUser(LoginRequestDto loginRequestDto) {

        // 1.Authenticate whether the user is registered
        try{
            Authentication authentication= authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.getEmail(),
                            loginRequestDto.getPassword())
            );
        } catch (Exception e) {
            throw new InvalidLoginCredentialsException("Invalid Login Credentials ");
        }
        //2.Get the User Role
        Users users = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow( ()-> new UserNotFoundException("User Not Found! "));

        // Generate JWT for the user
        String token = jwtService.generateToken(users);


        return new LoginResponseDto(
                token,
                users.getRole().name()
        );

    }

    public RegisterResponseDto registerUser(RegisterRequestDto registerRequestDto){
        if(userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()){
            throw new UserAlreadyExistsException( "User with email already exists");
        }

        Users users = new Users();
        users.setName(registerRequestDto.getName());
        users.setEmail(registerRequestDto.getEmail());
        users.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        users.setPhoneNumber(registerRequestDto.getPhoneNumber());
        users.setRole(Role.PATIENT);
        users.setActive(true);
        users.setCreatedAt(LocalDateTime.now());

        Users savedUser = userRepository.save(users);

        Patient patient= new Patient();
        patient.setDateOfBirth(registerRequestDto.getDateOfBirth());
        patient.setUsers(savedUser);
        patientRepository.save(patient);

        return new RegisterResponseDto(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getRole().name()
        );

    }

    public RegisterResponseDto registerAdmin(AdminRegisterRequestDto dto) {
        // 1.Check if user already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User Already Exists");
        }
        //2 Fetch the hospital for Administration
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new HospitalNotFoundException("Hospital with id" + dto.getHospitalId() + " not found"));


        // 3 build the user entity
        Users users = new Users();
        users.setName(dto.getName());
        users.setEmail(dto.getEmail());
        users.setPassword(passwordEncoder.encode(dto.getPassword()));
        users.setPhoneNumber(dto.getPhoneNumber());
        users.setRole(Role.ADMIN);
        users.setHospital(hospital);
        users.setCreatedAt(LocalDateTime.now());
        users.setActive(true);
        users.setMustChangePassword(false);

        Users savedUser = userRepository.save(users);

        return new RegisterResponseDto(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getRole().name()
        );
    }
}
