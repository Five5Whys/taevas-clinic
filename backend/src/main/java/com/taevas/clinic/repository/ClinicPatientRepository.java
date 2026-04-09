package com.taevas.clinic.repository;

import com.taevas.clinic.model.ClinicPatient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClinicPatientRepository extends JpaRepository<ClinicPatient, UUID>, JpaSpecificationExecutor<ClinicPatient> {

    Page<ClinicPatient> findByClinicId(UUID clinicId, Pageable pageable);
    long countByClinicId(UUID clinicId);
    List<ClinicPatient> findByClinicIdAndStatus(UUID clinicId, String status);
    boolean existsByPatientCode(String patientCode);
}
