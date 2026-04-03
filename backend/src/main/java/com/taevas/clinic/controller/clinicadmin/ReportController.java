package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ClinicReportDto;
import com.taevas.clinic.service.clinicadmin.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/reports") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Reports") @RequiredArgsConstructor
public class ReportController extends BaseController {
    private final ReportService service;

    @GetMapping public ResponseEntity<ApiResponse<ClinicReportDto>> getReport() {
        return ResponseEntity.ok(ApiResponse.success(service.getReport(getClinicId())));
    }
}
