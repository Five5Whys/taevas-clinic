package com.taevas.clinic.repository;

import com.taevas.clinic.model.LocaleSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocaleSettingsRepository extends JpaRepository<LocaleSettings, UUID> {

    Optional<LocaleSettings> findByCountryId(UUID countryId);
}
