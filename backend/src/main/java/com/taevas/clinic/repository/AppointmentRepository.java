package com.taevas.clinic.repository;

import com.taevas.clinic.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID>, JpaSpecificationExecutor<Appointment> {

    Page<Appointment> findByClinicId(UUID clinicId, Pageable pageable);
    List<Appointment> findByClinicIdAndDoctorId(UUID clinicId, UUID doctorId);
    List<Appointment> findByClinicIdAndPatientId(UUID clinicId, UUID patientId);
    List<Appointment> findByClinicIdAndAppointmentDate(UUID clinicId, java.time.LocalDate date);
    List<Appointment> findByClinicIdAndStatus(UUID clinicId, String status);
    long countByClinicId(UUID clinicId);
    long countByClinicIdAndStatus(UUID clinicId, String status);
    long countByClinicIdAndAppointmentDate(UUID clinicId, java.time.LocalDate date);
}
