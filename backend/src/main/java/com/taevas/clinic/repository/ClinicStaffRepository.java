package com.taevas.clinic.repository;

import com.taevas.clinic.model.ClinicStaff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClinicStaffRepository extends JpaRepository<ClinicStaff, UUID>, JpaSpecificationExecutor<ClinicStaff> {

    List<ClinicStaff> findByClinicId(UUID clinicId);
    List<ClinicStaff> findByClinicIdAndRole(UUID clinicId, String role);
    List<ClinicStaff> findByClinicIdAndStatus(UUID clinicId, String status);
    long countByClinicId(UUID clinicId);
}
