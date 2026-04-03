package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
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
public class ComplianceStatusController extends BaseController {
    private final ClinicComplianceService service;

    @GetMapping("/status") public ResponseEntity<ApiResponse<ComplianceStatusDto>> getStatus() {
        return ResponseEntity.ok(ApiResponse.success(service.getStatus(getClinicId())));
    }
}
