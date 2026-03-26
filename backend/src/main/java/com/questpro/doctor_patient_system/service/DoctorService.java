package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.dtos.*;
import com.questpro.doctor_patient_system.entities.Doctor;
import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.entities.Users;
import com.questpro.doctor_patient_system.enums.Role;
import com.questpro.doctor_patient_system.enums.SlotStatus;
import com.questpro.doctor_patient_system.exceptions.*;
import com.questpro.doctor_patient_system.repository.IDoctorRepository;
import com.questpro.doctor_patient_system.repository.ISlotRepository;
import com.questpro.doctor_patient_system.repository.IUserRepository;
import com.questpro.doctor_patient_system.specification.DoctorSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
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

    @Autowired
    private ISlotRepository slotRepository;

    public CreateDoctorResponseDto createDoctor(CreateDoctorRequestDto dto, MultipartFile image,String adminEmail){
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

        // VALIDATE THE IMAGE IF IN JPG or png format and 5 mb size
        validateImage(image);

        if(image!=null && ! image.isEmpty()){
            try{
                doctor.setImage(image.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed To Process Image");
            }
        }

        Doctor savedDoctor = doctorRepository.save(doctor);


        return  CreateDoctorResponseDto.builder().
                doctorId(savedDoctor.getDoctorId())
                .userId(savedUser.getUserId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .temporaryPassword(tempPassword)
                .hospitalName(hospital.getName())
                .speciality(savedDoctor.getSpeciality().name())
                .build();

    }


    public List<DoctorSearchResponseDto> searchDoctors(DoctorFilterDto filter) {


        System.out.println("Gender filter: " + filter.getGender());
        System.out.println("Speciality filter: " + filter.getSpeciality());
        System.out.println("Keyword filter: " + filter.getKeyword());


        // min fee should not be more than maximum fee
        if (filter.getMinFee() != null && filter.getMaxFee() != null) {
            if (filter.getMinFee() > filter.getMaxFee()) {
                throw new RuntimeException("Minimum fee cannot be greater than maximum fee");
            }
        }

        // slot date should not be in the past
        if (filter.getDate() != null && filter.getDate().isBefore(LocalDate.now())) {
            throw new InvalidSlotTimeException("Date cannot be in the past");
        }

        if(filter.getHospitalName()!=null && filter.getHospitalName().length() >100){
            throw new InvalidNameException("HospitalName must not exceed 100 characters");

        }

        if(filter.getKeyword()!=null && filter.getKeyword().length() >100){
            throw new InvalidNameException(" DoctorName must not exceed 100 characters");

        }

        Specification<Doctor> spec = DoctorSpecification.withFilters(filter);
        List<Doctor> doctors = doctorRepository.findAll(spec);

        return doctors.stream()
                .map(this::mapToSearchDto)
                .toList();
    }

    public DoctorDetailResponseDto getDoctorById(Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new UserNotFoundException("Doctor not found"));

        if (!doctor.getUsers().isActive()) {
            throw new InactiveUserException("This doctor is no longer available");
        }

        // fetch only future available slots
        List<SlotResponseDto> availableSlots = slotRepository
                .findAvailableFutureSlots(doctor, LocalDate.now(), LocalTime.now())
                .stream()
                .map(slot -> SlotResponseDto.builder()
                        .slotId(slot.getSlotId())
                        .slotDate(slot.getSlotDate())
                        .startTime(slot.getStartTime())
                        .endTime(slot.getEndTime())
                        .slotStatus(slot.getSlotStatus().name())
                        .build())
                .toList();

        return DoctorDetailResponseDto.builder()
                .doctorId(doctor.getDoctorId())
                .name(doctor.getUsers().getName())
                .imageUrl("/public/doctors/getImage/"+ doctor.getDoctorId())
                .speciality(doctor.getSpeciality().name())
                .qualification(doctor.getQualification())
                .yearsOfExperience(doctor.getYearsOfExperience())
                .fees(doctor.getFees())
                .hospitalName(doctor.getHospital().getName())
                .gender(doctor.getGender().name())
                .availableSlots(availableSlots)
                .build();
    }

    public List<AdminDoctorResponseDto> getDoctorsByHospital(String adminEmail) {
        Hospital hospital = getAndValidateAdminHospital(adminEmail);

        // find the doctors associated to admins hospital
        return doctorRepository.findByHospital(hospital)
                .stream()
                .map(doctor -> AdminDoctorResponseDto.builder()
                        .doctorId(doctor.getDoctorId())
                        .userId(doctor.getUsers().getUserId())
                        .name(doctor.getUsers().getName())
                        .email(doctor.getUsers().getEmail())
                        .phoneNumber(doctor.getUsers().getPhoneNumber())
                        .speciality(doctor.getSpeciality().name())
                        .qualification(doctor.getQualification())
                        .yearsOfExperience(doctor.getYearsOfExperience())
                        .fees(doctor.getFees())
                        .gender(doctor.getGender().name())
                        .imageUrl("/public/doctors/getImage/" + doctor.getDoctorId())
                        .isActive(doctor.getUsers().isActive())
                        .build())
                .toList();
    }


    @Transactional(rollbackOn = Exception.class)
    public void updateDoctorStatus(Long doctorId, boolean isActive, String adminEmail) {

        //validate the hospital
        Hospital hospital = getAndValidateAdminHospital(adminEmail);

        // Get the doctor
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new UserNotFoundException("Doctor not found"));

        // ensure doctor belongs to admin's hospital
        validateDoctorBelongsToHospital(doctor, hospital);

        // activate or deactivate the doctor
        doctor.getUsers().setActive(isActive);
        userRepository.save(doctor.getUsers());
    }


    public  void changePassword(ChangePasswordRequestDto dto, String doctorEmail){
        Users doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(()-> new UserNotFoundException("Doctor Not Found!"));

        // 1 Verify if old password matches
            if(!passwordEncoder.matches(dto.getOldPassword(), doctor.getPassword())){
                throw new InvalidLoginCredentialsException("Incorrect Old Password");
            }
        //2 New Password should be different from the old password
            if (passwordEncoder.matches(dto.getNewPassword(),doctor.getPassword())){
                throw  new InvalidLoginCredentialsException("The new Password should be different from the old password");
            }

            doctor.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            doctor.setMustChangePassword(false);

            userRepository.save(doctor);

    }

    public byte[] getDoctorImage(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DoctorImageNotFoundException("Doctor not found"));

        if (doctor.getImage() == null) {
            throw new RuntimeException("No image found for this doctor");
        }

        return doctor.getImage();
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

    //This method checks if the admin is a valid user of the platform
    // and is associated to a hospital.
    //if not this method throws an exception
    public Hospital getAndValidateAdminHospital(String adminEmail){
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
            throw new UnauthorizedException("Access Denied! Doctor does not belong to your Hospital");
        }
    }

    private void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) return;

        String contentType = image.getContentType();
        if (contentType == null ||
                !contentType.equals("image/jpeg") &&
                        !contentType.equals("image/png")) {
            throw new RuntimeException("Only JPG and PNG images are allowed");
        }

        // Optional: limit file size to 5MB
        if (image.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("Image size must be less than 5MB");
        }
    }

    private DoctorSearchResponseDto mapToSearchDto(Doctor doctor) {
        return DoctorSearchResponseDto.builder()
                .doctorId(doctor.getDoctorId())
                .name(doctor.getUsers().getName())
                .imageUrl("/public/doctors/" + doctor.getDoctorId() +"/image")
                .speciality(doctor.getSpeciality().name())
                .qualification(doctor.getQualification())
                .yearsOfExperience(doctor.getYearsOfExperience())
                .fees(doctor.getFees())
                .hospitalName(doctor.getHospital().getName())
                .gender(doctor.getGender().name())
                .build();
    }
}
