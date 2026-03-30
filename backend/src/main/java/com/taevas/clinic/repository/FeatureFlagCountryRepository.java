package com.taevas.clinic.repository;

import com.taevas.clinic.model.FeatureFlagCountry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeatureFlagCountryRepository extends JpaRepository<FeatureFlagCountry, UUID> {

    List<FeatureFlagCountry> findByFeatureFlagId(UUID featureFlagId);

    Optional<FeatureFlagCountry> findByFeatureFlagIdAndCountryId(UUID featureFlagId, UUID countryId);

    List<FeatureFlagCountry> findByFeatureFlagIdAndEnabledTrue(UUID featureFlagId);
}
