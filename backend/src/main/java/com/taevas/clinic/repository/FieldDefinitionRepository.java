package com.taevas.clinic.repository;

import com.taevas.clinic.model.FieldDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FieldDefinitionRepository extends JpaRepository<FieldDefinition, UUID> {

    List<FieldDefinition> findBySectionAndCountryIdIsNullOrderBySortOrderAsc(String section);

    List<FieldDefinition> findBySectionAndCountryIdOrderBySortOrderAsc(String section, UUID countryId);

    List<FieldDefinition> findBySectionOrderBySortOrderAsc(String section);
}
