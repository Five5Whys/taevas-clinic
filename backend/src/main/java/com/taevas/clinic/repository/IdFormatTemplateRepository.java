package com.taevas.clinic.repository;

import com.taevas.clinic.model.IdFormatTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IdFormatTemplateRepository extends JpaRepository<IdFormatTemplate, UUID> {

    List<IdFormatTemplate> findByCountryId(UUID countryId);

    Optional<IdFormatTemplate> findByCountryIdAndEntityType(UUID countryId, String entityType);
}
