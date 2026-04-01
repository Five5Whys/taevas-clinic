package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.AppointmentDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DoctorAppointmentService {
    private final AppointmentRepository repo;
    private final ClinicPatientRepository patientRepo;
    private final ClinicStaffRepository staffRepo;

    public Page<AppointmentDto> getAppointments(UUID clinicId, UUID staffId, String date, String status, Pageable pageable) {
        Specification<Appointment> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(root.get("clinicId"), clinicId));
            preds.add(cb.equal(root.get("doctorId"), staffId));
            if (date != null && !date.isBlank()) preds.add(cb.equal(root.get("appointmentDate"), LocalDate.parse(date)));
            if (status != null && !status.isBlank()) preds.add(cb.equal(root.get("status"), status));
            return cb.and(preds.toArray(new Predicate[0]));
        };
        return repo.findAll(spec, pageable).map(this::toDto);
    }

    public AppointmentDto getById(UUID id) {
        return toDto(repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id)));
    }

    @Transactional public AppointmentDto create(UUID clinicId, UUID doctorId, com.taevas.clinic.dto.clinicadmin.AppointmentRequest req) {
        Appointment a = Appointment.builder()
            .clinicId(clinicId)
            .patientId(UUID.fromString(req.getPatientId()))
            .doctorId(req.getDoctorId() != null ? UUID.fromString(req.getDoctorId()) : doctorId)
            .appointmentDate(LocalDate.parse(req.getAppointmentDate()))
            .startTime(LocalTime.parse(req.getStartTime()))
            .endTime(req.getEndTime() != null ? LocalTime.parse(req.getEndTime()) : null)
            .type(req.getType() != null ? req.getType() : "WALK_IN")
            .status("SCHEDULED")
            .notes(req.getNotes())
            .build();
        return toDto(repo.save(a));
    }

    @Transactional public AppointmentDto updateStatus(UUID id, String status) {
        Appointment a = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        a.setStatus(status);
        return toDto(repo.save(a));
    }

    private AppointmentDto toDto(Appointment a) {
        String pName = patientRepo.findById(a.getPatientId()).map(p -> p.getFirstName() + " " + (p.getLastName() != null ? p.getLastName() : "")).orElse("Unknown");
        String dName = staffRepo.findById(a.getDoctorId()).map(ClinicStaff::getName).orElse("Unknown");
        return AppointmentDto.builder().id(a.getId().toString()).clinicId(a.getClinicId().toString())
            .patientId(a.getPatientId().toString()).patientName(pName)
            .doctorId(a.getDoctorId().toString()).doctorName(dName)
            .appointmentDate(a.getAppointmentDate().toString())
            .startTime(a.getStartTime().toString())
            .endTime(a.getEndTime() != null ? a.getEndTime().toString() : null)
            .type(a.getType()).status(a.getStatus()).notes(a.getNotes())
            .tokenNumber(a.getTokenNumber())
            .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null).build();
    }
}
