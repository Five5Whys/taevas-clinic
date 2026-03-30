package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.FieldDefinitionDto;
import com.taevas.clinic.dto.superadmin.FieldReorderRequest;
import com.taevas.clinic.dto.superadmin.FieldRequest;
import com.taevas.clinic.exception.BadRequestException;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.FieldDefinition;
import com.taevas.clinic.repository.FieldDefinitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FieldDefinitionService {

    private final FieldDefinitionRepository fieldDefinitionRepository;

    public List<FieldDefinitionDto> getFields(String section, UUID countryId) {
        List<FieldDefinition> globalFields = fieldDefinitionRepository
                .findBySectionAndCountryIdIsNullOrderBySortOrderAsc(section);

        if (countryId == null) {
            return globalFields.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
        }

        List<FieldDefinition> countryFields = fieldDefinitionRepository
                .findBySectionAndCountryIdOrderBySortOrderAsc(section, countryId);

        // Merge: use a map keyed by fieldKey; country-specific fields override global ones
        Map<String, FieldDefinition> merged = new LinkedHashMap<>();
        for (FieldDefinition field : globalFields) {
            merged.put(field.getFieldKey(), field);
        }
        for (FieldDefinition field : countryFields) {
            merged.put(field.getFieldKey(), field);
        }

        return merged.values().stream()
                .sorted(Comparator.comparingInt(FieldDefinition::getSortOrder))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FieldDefinitionDto addField(FieldRequest request) {
        FieldDefinition field = FieldDefinition.builder()
                .scope(request.getScope())
                .countryId(request.getCountryId() != null ? UUID.fromString(request.getCountryId()) : null)
                .section(request.getSection())
                .fieldKey(request.getFieldKey())
                .label(request.getLabel())
                .fieldType(request.getFieldType())
                .locked(request.isLocked())
                .required(request.isRequired())
                .removable(request.isRemovable())
                .sortOrder(0)
                .build();

        // Set sort order to be after the last field in the same section
        List<FieldDefinition> existing = fieldDefinitionRepository
                .findBySectionOrderBySortOrderAsc(request.getSection());
        if (!existing.isEmpty()) {
            field.setSortOrder(existing.get(existing.size() - 1).getSortOrder() + 1);
        }

        FieldDefinition saved = fieldDefinitionRepository.save(field);
        return toDto(saved);
    }

    @Transactional
    public FieldDefinitionDto updateField(UUID id, FieldRequest request) {
        FieldDefinition field = fieldDefinitionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FieldDefinition", "id", id));

        field.setScope(request.getScope());
        field.setCountryId(request.getCountryId() != null ? UUID.fromString(request.getCountryId()) : null);
        field.setSection(request.getSection());
        field.setFieldKey(request.getFieldKey());
        field.setLabel(request.getLabel());
        field.setFieldType(request.getFieldType());
        field.setLocked(request.isLocked());
        field.setRequired(request.isRequired());
        field.setRemovable(request.isRemovable());

        FieldDefinition saved = fieldDefinitionRepository.save(field);
        return toDto(saved);
    }

    @Transactional
    public void deleteField(UUID id) {
        FieldDefinition field = fieldDefinitionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FieldDefinition", "id", id));

        if (!field.isRemovable()) {
            throw new BadRequestException("This field is not removable");
        }

        fieldDefinitionRepository.delete(field);
    }

    @Transactional
    public void reorderFields(FieldReorderRequest request) {
        List<String> orderedIds = request.getOrderedIds();
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID fieldId = UUID.fromString(orderedIds.get(i));
            FieldDefinition field = fieldDefinitionRepository.findById(fieldId)
                    .orElseThrow(() -> new ResourceNotFoundException("FieldDefinition", "id", fieldId));
            field.setSortOrder(i);
            fieldDefinitionRepository.save(field);
        }
    }

    private FieldDefinitionDto toDto(FieldDefinition field) {
        return FieldDefinitionDto.builder()
                .id(field.getId().toString())
                .scope(field.getScope())
                .countryId(field.getCountryId() != null ? field.getCountryId().toString() : null)
                .section(field.getSection())
                .fieldKey(field.getFieldKey())
                .label(field.getLabel())
                .fieldType(field.getFieldType())
                .locked(field.isLocked())
                .required(field.isRequired())
                .removable(field.isRemovable())
                .sortOrder(field.getSortOrder())
                .build();
    }
}
