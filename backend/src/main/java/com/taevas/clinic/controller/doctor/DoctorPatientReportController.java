package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.doctor.PatientReportDto;
import com.taevas.clinic.dto.doctor.PatientReportRequest;
import com.taevas.clinic.service.doctor.DoctorPatientReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/doctor/patient-reports")
@PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Patient Reports")
@RequiredArgsConstructor
public class DoctorPatientReportController extends BaseController {
    private final DoctorPatientReportService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PatientReportDto>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                service.list(getClinicId(), getStaffId(), PageRequest.of(page, size))));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ApiResponse<PatientReportDto>> getById(@PathVariable UUID reportId) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), reportId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PatientReportDto>> create(@Valid @RequestBody PatientReportRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                service.create(getClinicId(), getStaffId(), request), "Patient report created"));
    }
}
