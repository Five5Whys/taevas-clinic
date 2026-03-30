package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.IdFormatTemplateDto;
import com.taevas.clinic.dto.superadmin.IdFormatUpdateRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.IdFormatTemplate;
import com.taevas.clinic.repository.IdFormatTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IdFormatService {

    private final IdFormatTemplateRepository idFormatTemplateRepository;

    public List<IdFormatTemplateDto> getByCountry(UUID countryId) {
        return idFormatTemplateRepository.findByCountryId(countryId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public IdFormatTemplateDto update(UUID countryId, String entityType, IdFormatUpdateRequest request) {
        IdFormatTemplate template = idFormatTemplateRepository
                .findByCountryIdAndEntityType(countryId, entityType)
                .orElseThrow(() -> new ResourceNotFoundException("IdFormatTemplate", "countryId/entityType",
                        countryId + "/" + entityType));

        template.setPrefix(request.getPrefix());
        template.setEntityCode(request.getEntityCode());
        template.setSeparator(request.getSeparator());
        template.setPadding(request.getPadding());
        template.setStartsAt(request.getStartsAt());

        IdFormatTemplate saved = idFormatTemplateRepository.save(template);
        return toDto(saved);
    }

    @Transactional
    public IdFormatTemplateDto toggleLock(UUID countryId, String entityType) {
        IdFormatTemplate template = idFormatTemplateRepository
                .findByCountryIdAndEntityType(countryId, entityType)
                .orElseThrow(() -> new ResourceNotFoundException("IdFormatTemplate", "countryId/entityType",
                        countryId + "/" + entityType));

        template.setLocked(!template.isLocked());
        IdFormatTemplate saved = idFormatTemplateRepository.save(template);
        return toDto(saved);
    }

    private IdFormatTemplateDto toDto(IdFormatTemplate template) {
        return IdFormatTemplateDto.builder()
                .id(template.getId().toString())
                .countryId(template.getCountryId().toString())
                .entityType(template.getEntityType())
                .prefix(template.getPrefix())
                .entityCode(template.getEntityCode())
                .separator(template.getSeparator())
                .padding(template.getPadding())
                .startsAt(template.getStartsAt())
                .locked(template.isLocked())
                .preview(generatePreview(template))
                .build();
    }

    private String generatePreview(IdFormatTemplate t) {
        String sep = t.getSeparator() != null ? t.getSeparator() : "-";
        String prefix = t.getPrefix() != null ? t.getPrefix() : "";
        String entityCode = t.getEntityCode() != null ? t.getEntityCode() : "";
        String paddedNumber = String.format("%" + t.getPadding() + "d", t.getStartsAt())
                .replace(' ', '0');

        StringBuilder preview = new StringBuilder();
        if (!prefix.isEmpty()) {
            preview.append(prefix);
        }
        if (!entityCode.isEmpty()) {
            if (preview.length() > 0) {
                preview.append(sep);
            }
            preview.append(entityCode);
        }
        if (preview.length() > 0) {
            preview.append(sep);
        }
        preview.append(paddedNumber);

        return preview.toString();
    }
}
