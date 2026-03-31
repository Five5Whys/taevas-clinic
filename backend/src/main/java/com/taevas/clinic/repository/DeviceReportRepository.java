package com.taevas.clinic.repository;

import com.taevas.clinic.model.DeviceReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceReportRepository extends JpaRepository<DeviceReport, UUID>, JpaSpecificationExecutor<DeviceReport> {

    Page<DeviceReport> findByClinicId(UUID clinicId, Pageable pageable);
    Page<DeviceReport> findByDoctorId(UUID doctorId, Pageable pageable);
    List<DeviceReport> findByPatientId(UUID patientId);
}
