package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.StaffDto;
import com.taevas.clinic.dto.clinicadmin.StaffRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicStaff;
import com.taevas.clinic.repository.ClinicStaffRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class StaffService {
    private final ClinicStaffRepository repo;

    public Page<StaffDto> getAll(UUID clinicId, String role, String status, String search, Pageable pageable) {
        Specification<ClinicStaff> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(root.get("clinicId"), clinicId));
            if (role != null && !role.isBlank()) preds.add(cb.equal(root.get("role"), role));
            if (status != null && !status.isBlank()) preds.add(cb.equal(root.get("status"), status));
            if (search != null && !search.isBlank()) {
                String p = "%" + search.toLowerCase() + "%";
                preds.add(cb.or(cb.like(cb.lower(root.get("name")), p), cb.like(cb.lower(root.get("email")), p)));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };
        return repo.findAll(spec, pageable).map(this::toDto);
    }

    public StaffDto getById(UUID clinicId, UUID id) {
        ClinicStaff s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        return toDto(s);
    }

    @Transactional public StaffDto create(UUID clinicId, StaffRequest r) {
        ClinicStaff s = ClinicStaff.builder().clinicId(clinicId).name(r.getName()).role(r.getRole())
            .specialization(r.getSpecialization()).phone(r.getPhone()).email(r.getEmail())
            .registrationNo(r.getRegistrationNo()).status("ACTIVE").build();
        return toDto(repo.save(s));
    }

    @Transactional public StaffDto update(UUID clinicId, UUID id, StaffRequest r) {
        ClinicStaff s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        s.setName(r.getName()); s.setRole(r.getRole()); s.setSpecialization(r.getSpecialization());
        s.setPhone(r.getPhone()); s.setEmail(r.getEmail()); s.setRegistrationNo(r.getRegistrationNo());
        return toDto(repo.save(s));
    }

    @Transactional public void delete(UUID clinicId, UUID id) {
        ClinicStaff s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
        repo.delete(s);
    }

    private StaffDto toDto(ClinicStaff s) {
        return StaffDto.builder().id(s.getId().toString()).clinicId(s.getClinicId().toString())
            .userId(s.getUserId() != null ? s.getUserId().toString() : null)
            .name(s.getName()).role(s.getRole()).specialization(s.getSpecialization())
            .phone(s.getPhone()).email(s.getEmail()).registrationNo(s.getRegistrationNo())
            .status(s.getStatus()).createdAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null).build();
    }
}
