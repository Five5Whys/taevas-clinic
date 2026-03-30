package com.taevas.clinic.repository;

import com.taevas.clinic.model.ComplianceModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ComplianceModuleRepository extends JpaRepository<ComplianceModule, UUID> {

    List<ComplianceModule> findByCountryIdAndEnabledTrue(UUID countryId);

    List<ComplianceModule> findByCountryId(UUID countryId);

    List<ComplianceModule> findByCountryIdOrderBySortOrder(UUID countryId);
}
