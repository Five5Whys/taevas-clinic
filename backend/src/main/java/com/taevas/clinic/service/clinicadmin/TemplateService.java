package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.TemplateSettingsDto;
import com.taevas.clinic.model.ClinicTemplate;
import com.taevas.clinic.repository.ClinicTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class TemplateService {
    private final ClinicTemplateRepository repo;

    public List<TemplateSettingsDto> getAll(UUID clinicId) {
        return repo.findByClinicId(clinicId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public TemplateSettingsDto getByType(UUID clinicId, String type) {
        return repo.findByClinicIdAndTemplateType(clinicId, type).map(this::toDto).orElse(null);
    }

    @Transactional public TemplateSettingsDto update(UUID clinicId, String type, TemplateSettingsDto dto) {
        ClinicTemplate t = repo.findByClinicIdAndTemplateType(clinicId, type)
            .orElse(ClinicTemplate.builder().clinicId(clinicId).templateType(type).build());
        t.setConfigJson(dto.getConfigJson()); t.setFilePath(dto.getFilePath());
        repo.save(t);
        return toDto(t);
    }

    private TemplateSettingsDto toDto(ClinicTemplate t) {
        return TemplateSettingsDto.builder().id(t.getId() != null ? t.getId().toString() : null)
            .clinicId(t.getClinicId().toString()).templateType(t.getTemplateType())
            .configJson(t.getConfigJson()).filePath(t.getFilePath()).build();
    }
}
