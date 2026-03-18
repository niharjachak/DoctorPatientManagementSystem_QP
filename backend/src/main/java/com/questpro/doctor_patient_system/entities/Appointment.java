package com.questpro.doctor_patient_system.entities;

import com.questpro.doctor_patient_system.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long appointmentId;

    @JoinColumn(name = "patient_id")
    @ManyToOne
    private Patient patient;

    @JoinColumn(name="doctor_id")
    @ManyToOne
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "slot_id" , unique = true)
    private Slot slot;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus appointmentStatus= AppointmentStatus.BOOKED;

    @Column(nullable = false)
    private LocalDateTime bookedAt;

    private LocalDateTime cancelledAt;


}
