package com.taevas.clinic.repository;

import com.taevas.clinic.model.ClinicCustomField;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClinicCustomFieldRepository extends JpaRepository<ClinicCustomField, UUID>, JpaSpecificationExecutor<ClinicCustomField> {

    List<ClinicCustomField> findByClinicId(UUID clinicId);
    List<ClinicCustomField> findByClinicIdAndSection(UUID clinicId, String section);
}
