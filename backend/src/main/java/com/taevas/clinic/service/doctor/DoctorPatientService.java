package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.clinicadmin.PatientDto;
import com.taevas.clinic.dto.doctor.AssignPatientsRequest;
import com.taevas.clinic.dto.doctor.AssignPatientsResponse;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicPatient;
import com.taevas.clinic.model.DoctorPatientAssignment;
import com.taevas.clinic.repository.ClinicPatientRepository;
import com.taevas.clinic.repository.DoctorPatientAssignmentRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DoctorPatientService {

    private final DoctorPatientAssignmentRepository assignmentRepo;
    private final ClinicPatientRepository patientRepo;

    /**
     * Bulk assign patients to a doctor. Skips patients already assigned.
     */
    @Transactional
    public AssignPatientsResponse assignPatients(UUID doctorId, AssignPatientsRequest request) {
        List<UUID> requestedIds = request.getPatientIds();
        LocalDateTime now = LocalDateTime.now();

        // Find which patients are already assigned to this doctor
        List<DoctorPatientAssignment> existing = assignmentRepo
                .findByDoctorIdAndPatientIdIn(doctorId, requestedIds);
        Set<UUID> alreadyAssignedIds = existing.stream()
                .map(DoctorPatientAssignment::getPatientId)
                .collect(Collectors.toSet());

        // Only assign those not yet assigned
        List<UUID> toAssign = requestedIds.stream()
                .filter(id -> !alreadyAssignedIds.contains(id))
                .toList();

        List<DoctorPatientAssignment> newAssignments = toAssign.stream()
                .map(patientId -> DoctorPatientAssignment.builder()
                        .doctorId(doctorId)
                        .patientId(patientId)
                        .remarks(request.getRemarks())
                        .assignedAt(now)
                        .build())
                .toList();

        assignmentRepo.saveAll(newAssignments);

        return AssignPatientsResponse.builder()
                .doctorId(doctorId)
                .totalRequested(requestedIds.size())
                .successfullyAssigned(toAssign.size())
                .alreadyAssigned(alreadyAssignedIds.size())
                .assignedPatientIds(toAssign)
                .alreadyAssignedPatientIds(new ArrayList<>(alreadyAssignedIds))
                .assignmentTime(now)
                .build();
    }

    /**
     * Get patients assigned to a specific doctor, with optional search filter.
     */
    public Page<PatientDto> getMyPatients(UUID doctorId, String search, Pageable pageable) {
        // Get all patient IDs assigned to this doctor
        List<UUID> patientIds = assignmentRepo.findByDoctorId(doctorId).stream()
                .map(DoctorPatientAssignment::getPatientId)
                .toList();

        if (patientIds.isEmpty()) {
            return Page.empty(pageable);
        }

        Specification<ClinicPatient> spec = (root, q, cb) -> {
            List<Predicate> preds = new ArrayList<>();
            preds.add(root.get("id").in(patientIds));
            if (search != null && !search.isBlank()) {
                String p = "%" + search.toLowerCase() + "%";
                preds.add(cb.or(
                        cb.like(cb.lower(root.get("firstName")), p),
                        cb.like(cb.lower(root.get("lastName")), p),
                        cb.like(cb.lower(root.get("phone")), p),
                        cb.like(cb.lower(root.get("patientCode")), p)
                ));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };

        return patientRepo.findAll(spec, pageable).map(this::toDto);
    }

    /**
     * Unassign a patient from a doctor.
     */
    @Transactional
    public void unassignPatient(UUID doctorId, UUID patientId) {
        if (!assignmentRepo.existsByDoctorIdAndPatientId(doctorId, patientId)) {
            throw new ResourceNotFoundException("DoctorPatientAssignment", "doctorId+patientId",
                    doctorId + "/" + patientId);
        }
        assignmentRepo.deleteByDoctorIdAndPatientId(doctorId, patientId);
    }

    private PatientDto toDto(ClinicPatient p) {
        return PatientDto.builder()
                .id(p.getId().toString())
                .clinicId(p.getClinicId().toString())
                .userId(p.getUserId() != null ? p.getUserId().toString() : null)
                .patientCode(p.getPatientCode())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .phone(p.getPhone())
                .email(p.getEmail())
                .gender(p.getGender())
                .bloodGroup(p.getBloodGroup())
                .dateOfBirth(p.getDateOfBirth() != null ? p.getDateOfBirth().toString() : null)
                .status(p.getStatus())
                .lastVisit(p.getLastVisit() != null ? p.getLastVisit().toString() : null)
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null)
                .build();
    }
}
