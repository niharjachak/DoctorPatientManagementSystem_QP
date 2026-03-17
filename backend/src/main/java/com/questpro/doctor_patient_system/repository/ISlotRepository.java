package com.questpro.doctor_patient_system.repository;

import com.questpro.doctor_patient_system.entities.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISlotRepository extends JpaRepository<Slot,Long> {
}
