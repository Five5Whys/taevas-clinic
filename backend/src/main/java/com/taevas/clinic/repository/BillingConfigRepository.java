package com.taevas.clinic.repository;

import com.taevas.clinic.model.BillingConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BillingConfigRepository extends JpaRepository<BillingConfig, UUID> {

    Optional<BillingConfig> findByCountryId(UUID countryId);
}
