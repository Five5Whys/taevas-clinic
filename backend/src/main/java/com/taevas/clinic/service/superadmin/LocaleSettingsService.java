package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.LocaleSettingsDto;
import com.taevas.clinic.dto.superadmin.LocaleSettingsRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.LocaleSettings;
import com.taevas.clinic.repository.LocaleSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocaleSettingsService {

    private final LocaleSettingsRepository localeSettingsRepository;

    public LocaleSettingsDto getByCountry(UUID countryId) {
        LocaleSettings settings = localeSettingsRepository.findByCountryId(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("LocaleSettings", "countryId", countryId));
        return toDto(settings);
    }

    @Transactional
    public LocaleSettingsDto update(UUID countryId, LocaleSettingsRequest request) {
        LocaleSettings settings = localeSettingsRepository.findByCountryId(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("LocaleSettings", "countryId", countryId));

        settings.setPrimaryLanguage(request.getPrimaryLanguage());
        settings.setSecondaryLanguage(request.getSecondaryLanguage());
        settings.setDateFormat(request.getDateFormat());
        settings.setWeightUnit(request.getWeightUnit());
        settings.setHeightUnit(request.getHeightUnit());
        settings.setTimezone(request.getTimezone());

        localeSettingsRepository.save(settings);

        return toDto(settings);
    }

    private LocaleSettingsDto toDto(LocaleSettings entity) {
        return LocaleSettingsDto.builder()
                .id(entity.getId().toString())
                .countryId(entity.getCountryId().toString())
                .primaryLanguage(entity.getPrimaryLanguage())
                .secondaryLanguage(entity.getSecondaryLanguage())
                .dateFormat(entity.getDateFormat())
                .weightUnit(entity.getWeightUnit())
                .heightUnit(entity.getHeightUnit())
                .timezone(entity.getTimezone())
                .build();
    }
}
