package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.DeviceReportDto;
import com.taevas.clinic.service.doctor.DoctorDeviceReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/device-reports") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Device Reports") @RequiredArgsConstructor
public class DoctorDeviceReportController extends BaseController {
    private final DoctorDeviceReportService service;

    @GetMapping public ResponseEntity<ApiResponse<Page<DeviceReportDto>>> getAll(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getReports(getClinicId(), getStaffId(), PageRequest.of(page, size))));
    }
}
