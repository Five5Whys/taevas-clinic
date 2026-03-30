package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.CountryConfigRequest;
import com.taevas.clinic.dto.superadmin.CountryDto;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.Country;
import com.taevas.clinic.model.enums.CountryStatus;
import com.taevas.clinic.model.enums.Role;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.CountryRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CountryService {

    private final CountryRepository countryRepository;
    private final ClinicRepository clinicRepository;
    private final UserRoleRepository userRoleRepository;

    public List<CountryDto> getAll() {
        return countryRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CountryDto getById(UUID id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));
        return toDto(country);
    }

    @Transactional
    public CountryDto create(CountryConfigRequest request) {
        Country country = Country.builder()
                .code(request.getCode())
                .name(request.getName())
                .flagEmoji(request.getFlagEmoji())
                .status(CountryStatus.valueOf(request.getStatus()))
                .currencyCode(request.getCurrencyCode())
                .currencySymbol(request.getCurrencySymbol())
                .taxType(request.getTaxType())
                .taxRate(request.getTaxRate())
                .dateFormat(request.getDateFormat())
                .primaryLanguage(request.getPrimaryLanguage())
                .secondaryLanguage(request.getSecondaryLanguage())
                .regulatoryBody(request.getRegulatoryBody())
                .build();

        Country saved = countryRepository.save(country);
        return toDto(saved);
    }

    @Transactional
    public CountryDto update(UUID id, CountryConfigRequest request) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));

        country.setCode(request.getCode());
        country.setName(request.getName());
        country.setFlagEmoji(request.getFlagEmoji());
        country.setStatus(CountryStatus.valueOf(request.getStatus()));
        country.setCurrencyCode(request.getCurrencyCode());
        country.setCurrencySymbol(request.getCurrencySymbol());
        country.setTaxType(request.getTaxType());
        country.setTaxRate(request.getTaxRate());
        country.setDateFormat(request.getDateFormat());
        country.setPrimaryLanguage(request.getPrimaryLanguage());
        country.setSecondaryLanguage(request.getSecondaryLanguage());
        country.setRegulatoryBody(request.getRegulatoryBody());

        Country saved = countryRepository.save(country);
        return toDto(saved);
    }

    private CountryDto toDto(Country country) {
        long clinicCount = clinicRepository.countByCountryId(country.getId());
        // Doctor count per country: count doctors in clinics belonging to this country
        // For now, we use a simplified approach; a more efficient query can be added later
        long doctorCount = 0;

        return CountryDto.builder()
                .id(country.getId().toString())
                .code(country.getCode())
                .name(country.getName())
                .flagEmoji(country.getFlagEmoji())
                .status(country.getStatus().name())
                .currencyCode(country.getCurrencyCode())
                .currencySymbol(country.getCurrencySymbol())
                .taxType(country.getTaxType())
                .taxRate(country.getTaxRate())
                .dateFormat(country.getDateFormat())
                .primaryLanguage(country.getPrimaryLanguage())
                .secondaryLanguage(country.getSecondaryLanguage())
                .regulatoryBody(country.getRegulatoryBody())
                .createdAt(country.getCreatedAt() != null ? country.getCreatedAt().toString() : null)
                .updatedAt(country.getUpdatedAt() != null ? country.getUpdatedAt().toString() : null)
                .clinicCount(clinicCount)
                .doctorCount(doctorCount)
                .build();
    }
}
