package com.questpro.doctor_patient_system.entities;

import com.questpro.doctor_patient_system.enums.Gender;
import com.questpro.doctor_patient_system.enums.Speciality;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="doctors")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long doctorId;

    @OneToOne
    @JoinColumn(name = "user_id",nullable = false,unique=true)
    private Users users;

    @Enumerated(EnumType.STRING)
    private Speciality speciality;

    @Column(nullable = false)
    private String qualification;

    @Column(nullable = false)
    private int yearsOfExperience;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    private double fees;

    @ManyToOne
    @JoinColumn(name="hospital_id" ,nullable = false)
    private Hospital hospital;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] image;

}
