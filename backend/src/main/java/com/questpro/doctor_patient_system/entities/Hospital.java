package com.questpro.doctor_patient_system.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="hospitals")
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long hospitalId;

    @Column(nullable = false)
    private String name;

    private String address;

    private String city;

    private boolean isActive =true;


    public Hospital(String name, String city) {
        this.name= name;
        this.city= city;
    }
}
