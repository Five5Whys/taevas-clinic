package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ClinicDashboardDto;
import com.taevas.clinic.service.clinicadmin.ClinicAdminDashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/dashboard") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Dashboard") @RequiredArgsConstructor
public class ClinicAdminDashboardController {
    private final ClinicAdminDashboardService service;
    private UUID getClinicId() { return UUID.fromString("d0000000-0000-0000-0000-000000000001"); }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ClinicDashboardDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(service.getDashboard(getClinicId())));
    }
}
