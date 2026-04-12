package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.TechStackDto;
import com.taevas.clinic.dto.superadmin.TechStackRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.TechStack;
import com.taevas.clinic.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TechStackService {

    private final TechStackRepository techStackRepository;

    public List<TechStackDto> getAll() {
        return techStackRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TechStackDto getById(UUID id) {
        TechStack tech = techStackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechStack", "id", id));
        return toDto(tech);
    }

    @Transactional
    public TechStackDto create(TechStackRequest request) {
        TechStack tech = TechStack.builder()
                .name(request.getName())
                .category(request.getCategory())
                .version(request.getVersion())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .usageArea(request.getUsageArea())
                .build();

        TechStack saved = techStackRepository.save(tech);
        return toDto(saved);
    }

    @Transactional
    public TechStackDto update(UUID id, TechStackRequest request) {
        TechStack tech = techStackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechStack", "id", id));

        if (request.getName() != null) tech.setName(request.getName());
        if (request.getCategory() != null) tech.setCategory(request.getCategory());
        if (request.getVersion() != null) tech.setVersion(request.getVersion());
        if (request.getDescription() != null) tech.setDescription(request.getDescription());
        if (request.getStatus() != null) tech.setStatus(request.getStatus());
        if (request.getUsageArea() != null) tech.setUsageArea(request.getUsageArea());

        TechStack saved = techStackRepository.save(tech);
        return toDto(saved);
    }

    @Transactional
    public void delete(UUID id) {
        TechStack tech = techStackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechStack", "id", id));
        techStackRepository.delete(tech);
    }

    private TechStackDto toDto(TechStack tech) {
        return TechStackDto.builder()
                .id(tech.getId().toString())
                .name(tech.getName())
                .category(tech.getCategory())
                .version(tech.getVersion())
                .description(tech.getDescription())
                .status(tech.getStatus())
                .usageArea(tech.getUsageArea())
                .createdAt(tech.getCreatedAt() != null ? tech.getCreatedAt().toString() : null)
                .updatedAt(tech.getUpdatedAt() != null ? tech.getUpdatedAt().toString() : null)
                .build();
    }
}
