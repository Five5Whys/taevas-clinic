package com.taevas.clinic.repository;

import com.taevas.clinic.model.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic, UUID>, JpaSpecificationExecutor<Clinic> {

    List<Clinic> findByCountryId(UUID countryId);

    long countByCountryId(UUID countryId);
}
