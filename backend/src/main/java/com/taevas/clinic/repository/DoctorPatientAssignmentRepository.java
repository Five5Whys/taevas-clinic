package com.taevas.clinic.repository;

import com.taevas.clinic.model.DoctorPatientAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorPatientAssignmentRepository extends JpaRepository<DoctorPatientAssignment, UUID> {

    List<DoctorPatientAssignment> findByDoctorId(UUID doctorId);

    List<DoctorPatientAssignment> findByPatientId(UUID patientId);

    boolean existsByDoctorIdAndPatientId(UUID doctorId, UUID patientId);

    void deleteByDoctorIdAndPatientId(UUID doctorId, UUID patientId);

    List<DoctorPatientAssignment> findByDoctorIdAndPatientIdIn(UUID doctorId, List<UUID> patientIds);

    List<DoctorPatientAssignment> findByPatientIdIn(List<UUID> patientIds);

    void deleteByPatientId(UUID patientId);
}
