package com.taevas.clinic.controller.doctor;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.PatientDto;
import com.taevas.clinic.service.clinicadmin.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/doctor/patients") @PreAuthorize("hasAnyRole('DOCTOR','CLINIC_ADMIN')")
@Tag(name = "Doctor - Patients") @RequiredArgsConstructor
public class DoctorPatientController {
    private final PatientService service;
    private UUID getClinicId() { return UUID.fromString("d0000000-0000-0000-0000-000000000001"); }

    @GetMapping public ResponseEntity<ApiResponse<Page<PatientDto>>> getAll(
            @RequestParam(required = false) String search, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId(), null, search, PageRequest.of(page, size))));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<PatientDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), id)));
    }
}
