package com.taevas.clinic.repository;

import com.taevas.clinic.model.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, UUID> {
    List<EmergencyContact> findByPatientId(UUID patientId);
    void deleteByPatientId(UUID patientId);
}
