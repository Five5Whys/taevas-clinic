package com.taevas.clinic.repository;

import com.taevas.clinic.model.ClinicTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClinicTemplateRepository extends JpaRepository<ClinicTemplate, UUID>, JpaSpecificationExecutor<ClinicTemplate> {

    List<ClinicTemplate> findByClinicId(UUID clinicId);
    Optional<ClinicTemplate> findByClinicIdAndTemplateType(UUID clinicId, String templateType);
}
