package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.ComplianceModuleDto;
import com.taevas.clinic.service.superadmin.ComplianceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/compliance")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Compliance")
@RequiredArgsConstructor
public class ComplianceController {

    private final ComplianceService complianceService;

    @GetMapping("/{countryId}")
    @Operation(summary = "Get compliance modules by country")
    public ResponseEntity<ApiResponse<List<ComplianceModuleDto>>> getByCountry(
            @PathVariable UUID countryId) {
        List<ComplianceModuleDto> modules = complianceService.getByCountry(countryId);
        return ResponseEntity.ok(ApiResponse.success(modules));
    }

    @PutMapping("/{countryId}/{moduleId}")
    @Operation(summary = "Toggle a compliance module")
    public ResponseEntity<ApiResponse<String>> toggleModule(
            @PathVariable UUID countryId,
            @PathVariable UUID moduleId) {
        complianceService.toggleModule(countryId, moduleId);
        return ResponseEntity.ok(ApiResponse.success("Compliance module toggled"));
    }
}
