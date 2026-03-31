package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ComplianceStatusDto;
import com.taevas.clinic.service.clinicadmin.ClinicComplianceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/compliance") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Compliance") @RequiredArgsConstructor
public class ComplianceStatusController {
    private final ClinicComplianceService service;
    private UUID getClinicId() { return UUID.fromString("d0000000-0000-0000-0000-000000000001"); }

    @GetMapping("/status") public ResponseEntity<ApiResponse<ComplianceStatusDto>> getStatus() {
        return ResponseEntity.ok(ApiResponse.success(service.getStatus(getClinicId())));
    }
}
