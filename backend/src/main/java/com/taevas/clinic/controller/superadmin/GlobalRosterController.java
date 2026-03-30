package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.DoctorRosterDto;
import com.taevas.clinic.dto.superadmin.RoleUpdateRequest;
import com.taevas.clinic.service.superadmin.GlobalRosterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/doctors")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Global Roster")
@RequiredArgsConstructor
public class GlobalRosterController {

    private final GlobalRosterService globalRosterService;

    @GetMapping
    @Operation(summary = "Get all doctors with optional filters")
    public ResponseEntity<ApiResponse<Page<DoctorRosterDto>>> getAll(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<DoctorRosterDto> page = globalRosterService.getAll(country, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by ID")
    public ResponseEntity<ApiResponse<DoctorRosterDto>> getById(@PathVariable UUID id) {
        DoctorRosterDto dto = globalRosterService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/{id}/roles")
    @Operation(summary = "Update roles for a doctor")
    public ResponseEntity<ApiResponse<String>> updateRoles(
            @PathVariable UUID id,
            @Valid @RequestBody RoleUpdateRequest request) {
        globalRosterService.updateRoles(id, request);
        return ResponseEntity.ok(ApiResponse.success("Roles updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a doctor")
    public ResponseEntity<ApiResponse<String>> deactivate(@PathVariable UUID id) {
        globalRosterService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deactivated"));
    }
}
