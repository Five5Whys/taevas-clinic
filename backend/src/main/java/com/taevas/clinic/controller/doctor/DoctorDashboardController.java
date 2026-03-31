package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.ClinicDashboardDto;
import com.taevas.clinic.service.doctor.DoctorDashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/dashboard") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Dashboard") @RequiredArgsConstructor
public class DoctorDashboardController {
    private final DoctorDashboardService service;
    private UUID getClinicId() { return UUID.fromString("d0000000-0000-0000-0000-000000000001"); }
    private UUID getStaffId() { return UUID.fromString("a1000000-0000-0000-0000-000000000001"); }

    @GetMapping("/stats") public ResponseEntity<ApiResponse<ClinicDashboardDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(service.getDashboard(getClinicId(), getStaffId())));
    }
}
