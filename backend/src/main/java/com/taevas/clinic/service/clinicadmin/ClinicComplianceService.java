package com.taevas.clinic.service.clinicadmin;

import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.model.*;
import com.taevas.clinic.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class ClinicComplianceService {
    private final ClinicRepository clinicRepo;
    private final CountryRepository countryRepo;
    private final ComplianceModuleRepository complianceRepo;

    public ComplianceStatusDto getStatus(UUID clinicId) {
        Clinic clinic = clinicRepo.findById(clinicId).orElse(null);
        if (clinic == null || clinic.getCountryId() == null) {
            return ComplianceStatusDto.builder().countryName("Unknown").items(List.of()).build();
        }
        String countryName = countryRepo.findById(clinic.getCountryId()).map(Country::getName).orElse("Unknown");
        List<ComplianceItemDto> items = complianceRepo.findByCountryIdAndEnabledTrue(clinic.getCountryId()).stream()
            .map(m -> ComplianceItemDto.builder().moduleName(m.getModuleName()).description(m.getDescription()).enabled(m.isEnabled()).build())
            .collect(Collectors.toList());
        return ComplianceStatusDto.builder().countryName(countryName).items(items).build();
    }
}
