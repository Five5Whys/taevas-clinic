package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.ComplianceModuleDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.ComplianceModule;
import com.taevas.clinic.repository.ComplianceModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComplianceService {

    private final ComplianceModuleRepository complianceModuleRepository;

    public List<ComplianceModuleDto> getByCountry(UUID countryId) {
        return complianceModuleRepository.findByCountryIdOrderBySortOrder(countryId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplianceModuleDto toggleModule(UUID countryId, UUID moduleId) {
        ComplianceModule module = complianceModuleRepository.findById(moduleId)
                .filter(m -> m.getCountryId().equals(countryId))
                .orElseThrow(() -> new ResourceNotFoundException("ComplianceModule", "id", moduleId));

        module.setEnabled(!module.isEnabled());
        complianceModuleRepository.save(module);

        return toDto(module);
    }

    private ComplianceModuleDto toDto(ComplianceModule entity) {
        return ComplianceModuleDto.builder()
                .id(entity.getId().toString())
                .moduleKey(entity.getModuleKey())
                .moduleName(entity.getModuleName())
                .description(entity.getDescription())
                .enabled(entity.isEnabled())
                .sortOrder(entity.getSortOrder())
                .build();
    }
}
