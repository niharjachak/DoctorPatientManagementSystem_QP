package com.questpro.doctor_patient_system.entities;

import com.questpro.doctor_patient_system.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true , nullable = false)
    private String email;

    private String password;

    @Column(unique = true ,nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime createdAt;

    private boolean isActive =true;
    private boolean mustChangePassword= false;


}
