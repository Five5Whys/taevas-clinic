package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ClinicCustomField;
import com.taevas.clinic.repository.ClinicCustomFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class CustomFieldService {
    private final ClinicCustomFieldRepository repo;

    public List<CustomFieldDto> getAll(UUID clinicId) {
        return repo.findByClinicId(clinicId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional public CustomFieldDto create(UUID clinicId, CustomFieldRequest r) {
        ClinicCustomField f = ClinicCustomField.builder().clinicId(clinicId).section(r.getSection())
            .fieldKey(r.getFieldKey()).label(r.getLabel()).fieldType(r.getFieldType())
            .required(r.getRequired() != null ? r.getRequired() : false)
            .sortOrder(r.getSortOrder() != null ? r.getSortOrder() : 0).build();
        return toDto(repo.save(f));
    }

    @Transactional public CustomFieldDto update(UUID clinicId, UUID id, CustomFieldRequest r) {
        ClinicCustomField f = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("CustomField", "id", id));
        f.setLabel(r.getLabel()); f.setFieldType(r.getFieldType());
        if (r.getRequired() != null) f.setRequired(r.getRequired());
        if (r.getSortOrder() != null) f.setSortOrder(r.getSortOrder());
        return toDto(repo.save(f));
    }

    @Transactional public void delete(UUID clinicId, UUID id) {
        repo.deleteById(id);
    }

    private CustomFieldDto toDto(ClinicCustomField f) {
        return CustomFieldDto.builder().id(f.getId().toString()).clinicId(f.getClinicId().toString())
            .section(f.getSection()).fieldKey(f.getFieldKey()).label(f.getLabel())
            .fieldType(f.getFieldType()).required(f.getRequired()).sortOrder(f.getSortOrder()).build();
    }
}
