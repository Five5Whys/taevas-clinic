package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.ClinicDto;
import com.taevas.clinic.dto.superadmin.ClinicRequest;
import com.taevas.clinic.exception.ResourceNotFoundException;
import com.taevas.clinic.model.Clinic;
import com.taevas.clinic.model.ComplianceModule;
import com.taevas.clinic.model.Country;
import com.taevas.clinic.model.enums.ClinicStatus;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.ComplianceModuleRepository;
import com.taevas.clinic.repository.CountryRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClinicService {

    private final ClinicRepository clinicRepository;
    private final CountryRepository countryRepository;
    private final ComplianceModuleRepository complianceModuleRepository;

    public Page<ClinicDto> getAll(String countryId, String status, String search, Pageable pageable) {
        Specification<Clinic> spec = buildSpecification(countryId, status, search);
        return clinicRepository.findAll(spec, pageable).map(this::toDto);
    }

    public ClinicDto getById(UUID id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic", "id", id));
        return toDto(clinic);
    }

    @Transactional
    public ClinicDto create(ClinicRequest request) {
        UUID countryId = UUID.fromString(request.getCountryId());
        countryRepository.findById(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", countryId));

        Clinic clinic = Clinic.builder()
                .countryId(countryId)
                .name(request.getName())
                .city(request.getCity())
                .state(request.getState())
                .address(request.getAddress())
                .pincode(request.getPincode())
                .phone(request.getPhone())
                .email(request.getEmail())
                .registrationNumber(request.getRegistrationNumber())
                .licenseNumber(request.getLicenseNumber())
                .licenseValidUntil(request.getLicenseValidUntil() != null
                        ? LocalDate.parse(request.getLicenseValidUntil()) : null)
                .logoUrl(request.getLogoUrl())
                .patientCodePrefix(request.getPatientCodePrefix() != null ? request.getPatientCodePrefix() : "PT")
                .status(ClinicStatus.valueOf(request.getStatus()))
                .build();

        Clinic saved = clinicRepository.save(clinic);
        return toDto(saved);
    }

    @Transactional
    public ClinicDto update(UUID id, ClinicRequest request) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic", "id", id));

        UUID countryId = UUID.fromString(request.getCountryId());
        countryRepository.findById(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", countryId));

        clinic.setCountryId(countryId);
        clinic.setName(request.getName());
        clinic.setCity(request.getCity());
        clinic.setState(request.getState());
        clinic.setAddress(request.getAddress());
        clinic.setPincode(request.getPincode());
        clinic.setPhone(request.getPhone());
        clinic.setEmail(request.getEmail());
        clinic.setRegistrationNumber(request.getRegistrationNumber());
        clinic.setLicenseNumber(request.getLicenseNumber());
        clinic.setLicenseValidUntil(request.getLicenseValidUntil() != null
                ? LocalDate.parse(request.getLicenseValidUntil()) : null);
        clinic.setLogoUrl(request.getLogoUrl());
        if (request.getPatientCodePrefix() != null) {
            clinic.setPatientCodePrefix(request.getPatientCodePrefix());
        }
        clinic.setStatus(ClinicStatus.valueOf(request.getStatus()));

        Clinic saved = clinicRepository.save(clinic);
        return toDto(saved);
    }

    private ClinicDto toDto(Clinic clinic) {
        String countryName = null;
        String countryFlag = null;
        List<String> complianceTags = List.of();

        if (clinic.getCountryId() != null) {
            Country country = countryRepository.findById(clinic.getCountryId()).orElse(null);
            if (country != null) {
                countryName = country.getName();
                countryFlag = country.getFlagEmoji();
            }

            complianceTags = complianceModuleRepository
                    .findByCountryIdAndEnabledTrue(clinic.getCountryId())
                    .stream()
                    .map(ComplianceModule::getModuleName)
                    .collect(Collectors.toList());
        }

        return ClinicDto.builder()
                .id(clinic.getId().toString())
                .countryId(clinic.getCountryId() != null ? clinic.getCountryId().toString() : null)
                .tenantId(clinic.getTenantId() != null ? clinic.getTenantId().toString() : null)
                .name(clinic.getName())
                .city(clinic.getCity())
                .state(clinic.getState())
                .address(clinic.getAddress())
                .pincode(clinic.getPincode())
                .phone(clinic.getPhone())
                .email(clinic.getEmail())
                .registrationNumber(clinic.getRegistrationNumber())
                .licenseNumber(clinic.getLicenseNumber())
                .licenseValidUntil(clinic.getLicenseValidUntil() != null
                        ? clinic.getLicenseValidUntil().toString() : null)
                .logoUrl(clinic.getLogoUrl())
                .patientCodePrefix(clinic.getPatientCodePrefix())
                .status(clinic.getStatus().name())
                .createdAt(clinic.getCreatedAt() != null ? clinic.getCreatedAt().toString() : null)
                .updatedAt(clinic.getUpdatedAt() != null ? clinic.getUpdatedAt().toString() : null)
                .countryName(countryName)
                .countryFlag(countryFlag)
                .complianceTags(complianceTags)
                .build();
    }

    private Specification<Clinic> buildSpecification(String countryId, String status, String search) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (countryId != null && !countryId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("countryId"),
                        UUID.fromString(countryId)));
            }

            if (status != null && !status.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("status"),
                        ClinicStatus.valueOf(status)));
            }

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")), pattern);
                Predicate cityLike = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("city")), pattern);
                Predicate emailLike = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")), pattern);
                predicates.add(criteriaBuilder.or(nameLike, cityLike, emailLike));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
