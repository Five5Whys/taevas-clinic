package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.clinicadmin.StaffService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/clinicadmin/staff") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Staff") @RequiredArgsConstructor
public class StaffController extends BaseController {
    private final StaffService service;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StaffDto>>> getAll(
            @RequestParam(required = false) String role, @RequestParam(required = false) String status,
            @RequestParam(required = false) String search, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId(), role, status, search, PageRequest.of(page, size))));
    }

    @GetMapping("/{id}") public ResponseEntity<ApiResponse<StaffDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(getClinicId(), id)));
    }

    @PostMapping public ResponseEntity<ApiResponse<StaffDto>> create(@Valid @RequestBody StaffRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), r), "Staff created"));
    }

    @PutMapping("/{id}") public ResponseEntity<ApiResponse<StaffDto>> update(@PathVariable UUID id, @Valid @RequestBody StaffRequest r) {
        return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), id, r), "Staff updated"));
    }

    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(getClinicId(), id); return ResponseEntity.ok(ApiResponse.success(null, "Staff deleted"));
    }
}
