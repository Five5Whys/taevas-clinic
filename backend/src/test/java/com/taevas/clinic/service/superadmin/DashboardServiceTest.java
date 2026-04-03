package com.taevas.clinic.service.superadmin;

import com.taevas.clinic.dto.superadmin.DashboardStatsDto;
import com.taevas.clinic.model.AuditLog;
import com.taevas.clinic.model.enums.Role;
import com.taevas.clinic.repository.AuditLogRepository;
import com.taevas.clinic.repository.ClinicRepository;
import com.taevas.clinic.repository.CountryRepository;
import com.taevas.clinic.repository.UserRepository;
import com.taevas.clinic.repository.UserRoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private ClinicRepository clinicRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserRoleRepository userRoleRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getStats_returnsCorrectCounts() {
        when(countryRepository.count()).thenReturn(5L);
        when(clinicRepository.count()).thenReturn(12L);
        when(userRoleRepository.countByRole(Role.DOCTOR)).thenReturn(30L);
        when(userRoleRepository.countByRole(Role.PATIENT)).thenReturn(200L);

        DashboardStatsDto stats = dashboardService.getStats();

        assertEquals(5L, stats.getTotalCountries());
        assertEquals(12L, stats.getTotalClinics());
        assertEquals(30L, stats.getTotalDoctors());
        assertEquals(200L, stats.getTotalPatients());
        assertEquals(0.0, stats.getCountryDelta());
        assertEquals(0.0, stats.getClinicDelta());
        assertEquals(0.0, stats.getDoctorDelta());
        assertEquals(0.0, stats.getPatientDelta());
    }

    @Test
    void getStats_returnsZerosWhenEmpty() {
        when(countryRepository.count()).thenReturn(0L);
        when(clinicRepository.count()).thenReturn(0L);
        when(userRoleRepository.countByRole(Role.DOCTOR)).thenReturn(0L);
        when(userRoleRepository.countByRole(Role.PATIENT)).thenReturn(0L);

        DashboardStatsDto stats = dashboardService.getStats();

        assertEquals(0L, stats.getTotalCountries());
        assertEquals(0L, stats.getTotalClinics());
        assertEquals(0L, stats.getTotalDoctors());
        assertEquals(0L, stats.getTotalPatients());
    }

    @Test
    void getRecentActivity_returnsPaginatedResults() {
        Pageable pageable = PageRequest.of(0, 10);

        AuditLog log1 = AuditLog.builder()
                .id(UUID.randomUUID())
                .action("CREATE")
                .entityType("Country")
                .entityId("id-1")
                .createdAt(LocalDateTime.now())
                .build();

        AuditLog log2 = AuditLog.builder()
                .id(UUID.randomUUID())
                .action("UPDATE")
                .entityType("Clinic")
                .entityId("id-2")
                .createdAt(LocalDateTime.now().minusHours(1))
                .build();

        Page<AuditLog> mockPage = new PageImpl<>(List.of(log1, log2), pageable, 2);
        when(auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)).thenReturn(mockPage);

        Page<AuditLog> result = dashboardService.getRecentActivity(pageable);

        assertEquals(2, result.getContent().size());
        assertEquals(2, result.getTotalElements());
        assertEquals("CREATE", result.getContent().get(0).getAction());
        assertEquals("UPDATE", result.getContent().get(1).getAction());

        verify(auditLogRepository).findAllByOrderByCreatedAtDesc(pageable);
    }
}
