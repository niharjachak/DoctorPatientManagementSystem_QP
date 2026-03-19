package com.questpro.doctor_patient_system.specification;

import com.questpro.doctor_patient_system.dtos.DoctorFilterDto;
import com.questpro.doctor_patient_system.dtos.HospitalResponseDto;
import com.questpro.doctor_patient_system.entities.Doctor;
import com.questpro.doctor_patient_system.entities.Hospital;
import com.questpro.doctor_patient_system.entities.Slot;
import com.questpro.doctor_patient_system.entities.Users;
import com.questpro.doctor_patient_system.enums.SlotStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class DoctorSpecification {
    public static Specification<Doctor> withFilters(DoctorFilterDto filterDto){


        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // 1.ALWAYS SHOW ACTIVE DOCTORS
            Join<Doctor, Users> userJoin = root.join("users");
            predicates.add(criteriaBuilder.isTrue(userJoin.get("isActive")));

            // 2. if the filter has keyword/docname specified add it in predicate
            if(filterDto.getKeyword() != null && !filterDto.getKeyword().isBlank()){
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(userJoin.get("name")),
                        "%" + filterDto.getKeyword().toLowerCase()+"%"
                ));
            }

            //3. Speciality filter
            if(filterDto.getSpeciality()!=null){
                predicates.add(criteriaBuilder.equal(root.get("speciality"), filterDto.getSpeciality()));
            }

            //4. Gender filter specified then add it in predicate
            if(filterDto.getGender()!=null){
                predicates.add(criteriaBuilder.equal(root.get("gender"), filterDto.getGender()));
            }

            //5. Fee range filter
            if(filterDto.getMinFee()!=null){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("fees"), filterDto.getMinFee()));

            }
            if(filterDto.getMaxFee()!=null){
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("fees"), filterDto.getMaxFee()));
            }

            // 6 Hospital Name filter
            if(filterDto.getHospitalName() != null && !filterDto.getHospitalName().isBlank()){
                Join<Doctor, Hospital> hospitalJoin= root.join("hospital");

                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(hospitalJoin.get("name")),
                        "%" + filterDto.getHospitalName().toLowerCase()+"%"
                ));
            }

            //7 Date filter - doctors with atleast one available slot on this date
            // this is creating a subquery that will be queried on the slot table to find if any slots
            // created by the doctor are available on the date mentioned in the filter

            if(filterDto.getDate()!=null) {
                Subquery<Long> slotSubQuery = query.subquery(Long.class);
                Root<Slot> slotRoot = slotSubQuery.from(Slot.class);

                slotSubQuery.select(slotRoot.get("doctor").get("doctorId"))
                        .where(
                                criteriaBuilder.equal(slotRoot.get("doctor"), root),
                                criteriaBuilder.equal(slotRoot.get("slotDate"), filterDto.getDate()),
                                criteriaBuilder.equal(slotRoot.get("slotStatus"), SlotStatus.AVAILABLE)
                        );

                predicates.add(criteriaBuilder.exists(slotSubQuery));
            }

            return criteriaBuilder.and(predicates.toArray( new Predicate[0]));

            };

    }


}
