package com.questpro.doctor_patient_system.entities;

import com.questpro.doctor_patient_system.enums.SlotStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name ="slots",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"doctor_id","start_time"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long slotId;

    @JoinColumn(name = "doctor_id")
    @ManyToOne
    private Doctor doctor;

    private LocalDate slotDate;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private SlotStatus slotStatus = SlotStatus.AVAILABLE;

    @Version
    private int version;


}
