package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.clinicadmin.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/patients") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Patients") @RequiredArgsConstructor
public class ClinicAdminPatientController extends BaseController {
    private final PatientService service;

    @GetMapping public ResponseEntity<ApiResponse<Page<PatientDto>>> getAll(
            @RequestParam(required = false) String status, @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId(), status, search, PageRequest.of(page, size))));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), id)));
    }
    @PostMapping public ResponseEntity<ApiResponse<PatientDto>> create(@Valid @RequestBody PatientRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), r), "Patient created"));
    }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> update(@PathVariable UUID id, @Valid @RequestBody PatientRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), id, r), "Patient updated"));
    }
}
