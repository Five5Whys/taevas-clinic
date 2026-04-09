package com.taevas.clinic.service.doctor;

import com.taevas.clinic.dto.doctor.EmergencyContactDto;
import com.taevas.clinic.dto.doctor.EmergencyContactRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.EmergencyContact;
import com.taevas.clinic.repository.EmergencyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class EmergencyContactService {
    private final EmergencyContactRepository repo;

    public List<EmergencyContactDto> list(UUID patientId) {
        return repo.findByPatientId(patientId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public EmergencyContactDto add(UUID patientId, EmergencyContactRequest req) {
        EmergencyContact c = EmergencyContact.builder()
                .patientId(patientId)
                .relationship(req.getRelationship())
                .fullName(req.getFullName())
                .contactNumber(req.getContactNumber())
                .build();
        return toDto(repo.save(c));
    }

    @Transactional
    public EmergencyContactDto update(UUID contactId, EmergencyContactRequest req) {
        EmergencyContact c = repo.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyContact", "id", contactId));
        c.setRelationship(req.getRelationship());
        c.setFullName(req.getFullName());
        c.setContactNumber(req.getContactNumber());
        return toDto(repo.save(c));
    }

    @Transactional
    public void delete(UUID contactId) {
        if (!repo.existsById(contactId)) throw new ResourceNotFoundException("EmergencyContact", "id", contactId);
        repo.deleteById(contactId);
    }

    private EmergencyContactDto toDto(EmergencyContact c) {
        return EmergencyContactDto.builder()
                .id(c.getId().toString())
                .patientId(c.getPatientId().toString())
                .relationship(c.getRelationship())
                .fullName(c.getFullName())
                .contactNumber(c.getContactNumber())
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null)
                .build();
    }
}
