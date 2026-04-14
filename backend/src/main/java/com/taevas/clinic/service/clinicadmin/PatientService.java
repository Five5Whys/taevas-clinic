package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.PatientDto;
import com.taevas.clinic.dto.clinicadmin.PatientRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.exception.UnauthorizedException;
import com.taevas.clinic.model.Clinic;
import com.taevas.clinic.model.ClinicPatient;
import com.taevas.clinic.model.DoctorPatientAssignment;
import com.taevas.clinic.model.User;
import com.taevas.clinic.repository.ClinicPatientRepository;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.DoctorPatientAssignmentRepository;
import com.taevas.clinic.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class PatientService {
    private final ClinicPatientRepository repo;
    private final ClinicRepository clinicRepo;
    private final DoctorPatientAssignmentRepository assignmentRepo;
    private final UserRepository userRepo;

    public Page<PatientDto> getAll(UUID clinicId, String status, String search, Pageable pageable) {
        Specification<ClinicPatient> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(root.get("clinicId"), clinicId));
            if (status != null && !status.isBlank()) preds.add(cb.equal(root.get("status"), status));
            if (search != null && !search.isBlank()) {
                String p = "%" + search.toLowerCase() + "%";
                preds.add(cb.or(cb.like(cb.lower(root.get("firstName")), p), cb.like(cb.lower(root.get("lastName")), p), cb.like(cb.lower(root.get("phone")), p), cb.like(cb.lower(root.get("patientCode")), p)));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };
        Page<PatientDto> page = repo.findAll(spec, pageable).map(this::toDto);
        enrichWithAssignments(page.getContent());
        return page;
    }

    public PatientDto getById(UUID clinicId, UUID id) {
        ClinicPatient p = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        if (!p.getClinicId().equals(clinicId)) throw new UnauthorizedException("Access denied to this patient");
        PatientDto dto = toDto(p);
        enrichWithAssignments(List.of(dto));
        return dto;
    }

    @Transactional public PatientDto create(UUID clinicId, PatientRequest r) {
        String patientCode = generatePatientCode(clinicId);
        ClinicPatient p = ClinicPatient.builder().clinicId(clinicId).patientCode(patientCode)
            .firstName(r.getFirstName()).lastName(r.getLastName()).phone(r.getPhone()).email(r.getEmail())
            .gender(r.getGender()).bloodGroup(r.getBloodGroup())
            .dateOfBirth(r.getDateOfBirth() != null ? LocalDate.parse(r.getDateOfBirth()) : null)
            .completeAddress(r.getCompleteAddress()).postalCode(r.getPostalCode())
            .country(r.getCountry()).state(r.getState()).city(r.getCity())
            .smsNotifications(r.getSmsNotifications()).emailNotifications(r.getEmailNotifications()).remarks(r.getRemarks())
            .status("ACTIVE").build();
        return toDto(repo.save(p));
    }

    private String generatePatientCode(UUID clinicId) {
        Clinic clinic = clinicRepo.findById(clinicId)
            .orElseThrow(() -> new ResourceNotFoundException("Clinic", "id", clinicId));
        String prefix = clinic.getPatientCodePrefix() != null ? clinic.getPatientCodePrefix() : "PT";
        long count = repo.countByClinicId(clinicId);
        String code;
        do {
            count++;
            code = prefix + "-" + String.format("%04d", count);
        } while (repo.existsByPatientCode(code));
        return code;
    }

    @Transactional public PatientDto update(UUID clinicId, UUID id, PatientRequest r) {
        ClinicPatient p = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        if (!p.getClinicId().equals(clinicId)) throw new UnauthorizedException("Access denied to this patient");
        p.setFirstName(r.getFirstName()); p.setLastName(r.getLastName()); p.setPhone(r.getPhone());
        p.setEmail(r.getEmail()); p.setGender(r.getGender()); p.setBloodGroup(r.getBloodGroup());
        if (r.getDateOfBirth() != null) p.setDateOfBirth(LocalDate.parse(r.getDateOfBirth()));
        p.setCompleteAddress(r.getCompleteAddress()); p.setPostalCode(r.getPostalCode());
        p.setCountry(r.getCountry()); p.setState(r.getState()); p.setCity(r.getCity());
        p.setSmsNotifications(r.getSmsNotifications()); p.setRemarks(r.getRemarks());
        return toDto(repo.save(p));
    }

    @Transactional public void delete(UUID clinicId, UUID id) {
        ClinicPatient p = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        if (!p.getClinicId().equals(clinicId)) throw new UnauthorizedException("Access denied to this patient");
        p.setStatus("INACTIVE");
        repo.save(p);
    }

    /**
     * Batch-enrich a list of PatientDto with assignment info (doctor ID + name).
     * Uses two queries total regardless of list size (no N+1).
     */
    private void enrichWithAssignments(List<PatientDto> dtos) {
        if (dtos.isEmpty()) return;

        List<UUID> patientIds = dtos.stream()
                .map(d -> UUID.fromString(d.getId()))
                .toList();

        // Batch fetch assignments for all patients on this page
        List<DoctorPatientAssignment> assignments = assignmentRepo.findByPatientIdIn(patientIds);
        if (assignments.isEmpty()) return;

        // Build patientId -> doctorId map (first assignment wins if multiple exist)
        Map<UUID, UUID> patientDoctorMap = new LinkedHashMap<>();
        for (DoctorPatientAssignment a : assignments) {
            patientDoctorMap.putIfAbsent(a.getPatientId(), a.getDoctorId());
        }

        // Batch fetch all distinct doctor users
        Set<UUID> doctorIds = new HashSet<>(patientDoctorMap.values());
        Map<UUID, User> doctorMap = userRepo.findAllById(doctorIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // Enrich each DTO
        for (PatientDto dto : dtos) {
            UUID pid = UUID.fromString(dto.getId());
            UUID docId = patientDoctorMap.get(pid);
            if (docId != null) {
                dto.setAssignedDoctorId(docId.toString());
                User doctor = doctorMap.get(docId);
                if (doctor != null) {
                    String fn = doctor.getFirstName() != null ? doctor.getFirstName() : "";
                    String ln = doctor.getLastName() != null ? doctor.getLastName() : "";
                    String full = (fn + " " + ln).trim();
                    dto.setAssignedDoctorName(full.startsWith("Dr.") ? full : "Dr. " + full);
                }
            }
        }
    }

    public PatientDto getByCode(UUID clinicId, String code) {
        ClinicPatient p = repo.findByPatientCodeAndClinicId(code, clinicId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "code", code));
        PatientDto dto = toDto(p);
        enrichWithAssignments(List.of(dto));
        return dto;
    }

    private PatientDto toDto(ClinicPatient p) {
        return PatientDto.builder().id(p.getId().toString()).clinicId(p.getClinicId().toString())
            .userId(p.getUserId() != null ? p.getUserId().toString() : null)
            .patientCode(p.getPatientCode())
            .firstName(p.getFirstName()).lastName(p.getLastName()).phone(p.getPhone()).email(p.getEmail())
            .gender(p.getGender()).bloodGroup(p.getBloodGroup())
            .dateOfBirth(p.getDateOfBirth() != null ? p.getDateOfBirth().toString() : null)
            .status(p.getStatus()).lastVisit(p.getLastVisit() != null ? p.getLastVisit().toString() : null)
            .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null)
            .completeAddress(p.getCompleteAddress()).postalCode(p.getPostalCode())
            .country(p.getCountry()).state(p.getState()).city(p.getCity())
            .smsNotifications(p.getSmsNotifications()).emailNotifications(p.getEmailNotifications()).remarks(p.getRemarks()).build();
    }
}
