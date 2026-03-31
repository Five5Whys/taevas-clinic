package com.taevas.clinic.repository;

import com.taevas.clinic.model.Encounter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EncounterRepository extends JpaRepository<Encounter, UUID>, JpaSpecificationExecutor<Encounter> {

    Page<Encounter> findByClinicId(UUID clinicId, Pageable pageable);
    Optional<Encounter> findByAppointmentId(UUID appointmentId);
    Page<Encounter> findByDoctorId(UUID doctorId, Pageable pageable);
}
