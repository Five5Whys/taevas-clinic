package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.FeatureFlagDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.Clinic;
import com.taevas.clinic.model.FeatureFlag;
import com.taevas.clinic.model.FeatureFlagCountry;
import com.taevas.clinic.model.enums.Role;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.CountryRepository;
import com.taevas.clinic.repository.FeatureFlagCountryRepository;
import com.taevas.clinic.repository.FeatureFlagRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeatureFlagService {

    private final FeatureFlagRepository featureFlagRepository;
    private final FeatureFlagCountryRepository featureFlagCountryRepository;
    private final CountryRepository countryRepository;
    private final ClinicRepository clinicRepository;
    private final UserRoleRepository userRoleRepository;

    public List<FeatureFlagDto> getAll() {
        return featureFlagRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeatureFlagDto toggleCountry(UUID flagId, UUID countryId, boolean enabled) {
        FeatureFlag flag = featureFlagRepository.findById(flagId)
                .orElseThrow(() -> new ResourceNotFoundException("FeatureFlag", "id", flagId));

        countryRepository.findById(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", countryId));

        FeatureFlagCountry ffc = featureFlagCountryRepository
                .findByFeatureFlagIdAndCountryId(flagId, countryId)
                .orElseGet(() -> FeatureFlagCountry.builder()
                        .featureFlagId(flagId)
                        .countryId(countryId)
                        .enabled(false)
                        .build());

        ffc.setEnabled(enabled);
        featureFlagCountryRepository.save(ffc);

        return toDto(flag);
    }

    @Transactional
    public FeatureFlagDto toggleLock(UUID flagId) {
        FeatureFlag flag = featureFlagRepository.findById(flagId)
                .orElseThrow(() -> new ResourceNotFoundException("FeatureFlag", "id", flagId));

        flag.setLocked(!flag.isLocked());
        featureFlagRepository.save(flag);

        return toDto(flag);
    }

    public Map<String, Object> getImpact(UUID flagId) {
        featureFlagRepository.findById(flagId)
                .orElseThrow(() -> new ResourceNotFoundException("FeatureFlag", "id", flagId));

        List<FeatureFlagCountry> enabledCountries = featureFlagCountryRepository
                .findByFeatureFlagIdAndEnabledTrue(flagId);

        Map<String, Object> impact = new HashMap<>();
        long totalClinics = 0;
        long totalDoctors = 0;
        Map<String, Map<String, Long>> perCountry = new HashMap<>();

        for (FeatureFlagCountry ffc : enabledCountries) {
            UUID countryId = ffc.getCountryId();
            long clinicCount = clinicRepository.countByCountryId(countryId);
            // Simplified doctor count per country
            List<Clinic> clinics = clinicRepository.findByCountryId(countryId);
            long doctorCount = 0; // Would need a tenant-aware query for precise count

            totalClinics += clinicCount;
            totalDoctors += doctorCount;

            Map<String, Long> countryImpact = new HashMap<>();
            countryImpact.put("clinics", clinicCount);
            countryImpact.put("doctors", doctorCount);
            perCountry.put(countryId.toString(), countryImpact);
        }

        impact.put("totalClinics", totalClinics);
        impact.put("totalDoctors", totalDoctors);
        impact.put("countries", perCountry);

        return impact;
    }

    private FeatureFlagDto toDto(FeatureFlag flag) {
        List<FeatureFlagCountry> countryFlags = featureFlagCountryRepository
                .findByFeatureFlagId(flag.getId());

        Map<String, Boolean> countries = countryFlags.stream()
                .collect(Collectors.toMap(
                        ffc -> ffc.getCountryId().toString(),
                        FeatureFlagCountry::isEnabled
                ));

        return FeatureFlagDto.builder()
                .id(flag.getId().toString())
                .key(flag.getKey())
                .name(flag.getName())
                .description(flag.getDescription())
                .locked(flag.isLocked())
                .countries(countries)
                .build();
    }
}
