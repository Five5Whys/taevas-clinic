package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.DashboardStatsDto;
import com.taevas.clinic.model.AuditLog;
import com.taevas.clinic.model.enums.Role;
import com.taevas.clinic.repository.AuditLogRepository;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.CountryRepository;
import com.taevas.clinic.repository.UserRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final CountryRepository countryRepository;
    private final ClinicRepository clinicRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final AuditLogRepository auditLogRepository;

    public DashboardStatsDto getStats() {
        long totalCountries = countryRepository.count();
        long totalClinics = clinicRepository.count();
        long totalDoctors = userRoleRepository.countByRole(Role.DOCTOR);
        long totalPatients = userRoleRepository.countByRole(Role.PATIENT);

        return DashboardStatsDto.builder()
                .totalCountries(totalCountries)
                .totalClinics(totalClinics)
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .countryDelta(0.0)
                .clinicDelta(0.0)
                .doctorDelta(0.0)
                .patientDelta(0.0)
                .build();
    }

    public Page<AuditLog> getRecentActivity(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}
