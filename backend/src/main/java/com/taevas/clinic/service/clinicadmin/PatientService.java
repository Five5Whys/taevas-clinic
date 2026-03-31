package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.PatientDto;
import com.taevas.clinic.dto.clinicadmin.PatientRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicPatient;
import com.taevas.clinic.repository.ClinicPatientRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class PatientService {
    private final ClinicPatientRepository repo;

    public Page<PatientDto> getAll(UUID clinicId, String status, String search, Pageable pageable) {
        Specification<ClinicPatient> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(root.get("clinicId"), clinicId));
            if (status != null && !status.isBlank()) preds.add(cb.equal(root.get("status"), status));
            if (search != null && !search.isBlank()) {
                String p = "%" + search.toLowerCase() + "%";
                preds.add(cb.or(cb.like(cb.lower(root.get("firstName")), p), cb.like(cb.lower(root.get("lastName")), p), cb.like(cb.lower(root.get("phone")), p)));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };
        return repo.findAll(spec, pageable).map(this::toDto);
    }

    public PatientDto getById(UUID clinicId, UUID id) {
        return toDto(repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id)));
    }

    @Transactional public PatientDto create(UUID clinicId, PatientRequest r) {
        ClinicPatient p = ClinicPatient.builder().clinicId(clinicId).firstName(r.getFirstName())
            .lastName(r.getLastName()).phone(r.getPhone()).email(r.getEmail()).gender(r.getGender())
            .bloodGroup(r.getBloodGroup()).dateOfBirth(r.getDateOfBirth() != null ? LocalDate.parse(r.getDateOfBirth()) : null)
            .status("ACTIVE").build();
        return toDto(repo.save(p));
    }

    @Transactional public PatientDto update(UUID clinicId, UUID id, PatientRequest r) {
        ClinicPatient p = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        p.setFirstName(r.getFirstName()); p.setLastName(r.getLastName()); p.setPhone(r.getPhone());
        p.setEmail(r.getEmail()); p.setGender(r.getGender()); p.setBloodGroup(r.getBloodGroup());
        if (r.getDateOfBirth() != null) p.setDateOfBirth(LocalDate.parse(r.getDateOfBirth()));
        return toDto(repo.save(p));
    }

    private PatientDto toDto(ClinicPatient p) {
        return PatientDto.builder().id(p.getId().toString()).clinicId(p.getClinicId().toString())
            .userId(p.getUserId() != null ? p.getUserId().toString() : null)
            .firstName(p.getFirstName()).lastName(p.getLastName()).phone(p.getPhone()).email(p.getEmail())
            .gender(p.getGender()).bloodGroup(p.getBloodGroup())
            .dateOfBirth(p.getDateOfBirth() != null ? p.getDateOfBirth().toString() : null)
            .status(p.getStatus()).lastVisit(p.getLastVisit() != null ? p.getLastVisit().toString() : null)
            .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null).build();
    }
}
