package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.ClinicDto;
import com.taevas.clinic.dto.superadmin.ClinicRequest;
import com.taevas.clinic.service.superadmin.ClinicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/clinics")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Clinics")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;

    @GetMapping
    @Operation(summary = "Get all clinics with optional filters")
    public ResponseEntity<ApiResponse<Page<ClinicDto>>> getAll(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ClinicDto> clinics = clinicService.getAll(country, status, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(clinics));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get clinic by ID")
    public ResponseEntity<ApiResponse<ClinicDto>> getById(@PathVariable UUID id) {
        ClinicDto clinic = clinicService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(clinic));
    }

    @PostMapping
    @Operation(summary = "Create a new clinic")
    public ResponseEntity<ApiResponse<ClinicDto>> create(@Valid @RequestBody ClinicRequest request) {
        ClinicDto clinic = clinicService.create(request);
        return ResponseEntity.ok(ApiResponse.success(clinic, "Clinic created"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a clinic")
    public ResponseEntity<ApiResponse<ClinicDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ClinicRequest request) {
        ClinicDto clinic = clinicService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(clinic, "Clinic updated"));
    }
}
