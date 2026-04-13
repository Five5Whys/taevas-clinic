package com.taevas.clinic.repository;

import com.taevas.clinic.model.PatientReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientReportRepository extends JpaRepository<PatientReport, UUID> {
    Page<PatientReport> findByClinicIdAndDoctorIdOrderByReportDateDesc(UUID clinicId, UUID doctorId, Pageable pageable);
    List<PatientReport> findByClinicIdAndPatientIdOrderByReportDateDesc(UUID clinicId, UUID patientId);
    Optional<PatientReport> findByIdAndClinicId(UUID id, UUID clinicId);
}
