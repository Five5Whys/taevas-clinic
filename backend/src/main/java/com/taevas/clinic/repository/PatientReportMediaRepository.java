package com.taevas.clinic.repository;

import com.taevas.clinic.model.PatientReportMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface PatientReportMediaRepository extends JpaRepository<PatientReportMedia, UUID> {
    List<PatientReportMedia> findByReportId(UUID reportId);
    void deleteByReportId(UUID reportId);
}
