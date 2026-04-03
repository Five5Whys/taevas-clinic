package com.taevas.clinic.controller.clinicadmin;

import com.taevas.clinic.controller.BaseController;
import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.clinicadmin.*;
import com.taevas.clinic.service.clinicadmin.CustomFieldService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/clinicadmin/custom-fields") @PreAuthorize("hasRole('CLINIC_ADMIN')")
@Tag(name = "Clinic Admin - Custom Fields") @RequiredArgsConstructor
public class CustomFieldController extends BaseController {
    private final CustomFieldService service;

    @GetMapping public ResponseEntity<ApiResponse<List<CustomFieldDto>>> getAll() { return ResponseEntity.ok(ApiResponse.success(service.getAll(getClinicId()))); }
    @PostMapping public ResponseEntity<ApiResponse<CustomFieldDto>> create(@Valid @RequestBody CustomFieldRequest r) { return ResponseEntity.ok(ApiResponse.success(service.create(getClinicId(), r))); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<CustomFieldDto>> update(@PathVariable UUID id, @Valid @RequestBody CustomFieldRequest r) { return ResponseEntity.ok(ApiResponse.success(service.update(getClinicId(), id, r))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) { service.delete(getClinicId(), id); return ResponseEntity.ok(ApiResponse.success(null)); }
}
