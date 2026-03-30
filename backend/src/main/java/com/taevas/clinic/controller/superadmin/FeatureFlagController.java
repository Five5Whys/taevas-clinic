package com.taevas.clinic.controller.superadmin;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.superadmin.FeatureFlagDto;
import com.taevas.clinic.dto.superadmin.FeatureFlagUpdateRequest;
import com.taevas.clinic.service.superadmin.FeatureFlagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin/feature-flags")
@PreAuthorize("hasRole('SUPERADMIN')")
@Tag(name = "Super Admin - Feature Flags")
@RequiredArgsConstructor
public class FeatureFlagController {

    private final FeatureFlagService featureFlagService;

    @GetMapping
    @Operation(summary = "Get all feature flags")
    public ResponseEntity<ApiResponse<List<FeatureFlagDto>>> getAll() {
        List<FeatureFlagDto> flags = featureFlagService.getAll();
        return ResponseEntity.ok(ApiResponse.success(flags));
    }

    @PutMapping("/{id}/countries/{countryId}")
    @Operation(summary = "Toggle feature flag for a country")
    public ResponseEntity<ApiResponse<FeatureFlagDto>> toggleCountry(
            @PathVariable UUID id,
            @PathVariable UUID countryId,
            @RequestBody FeatureFlagUpdateRequest request) {
        FeatureFlagDto result = featureFlagService.toggleCountry(id, countryId, request.isEnabled());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/{id}/lock")
    @Operation(summary = "Toggle lock on a feature flag")
    public ResponseEntity<ApiResponse<String>> toggleLock(@PathVariable UUID id) {
        featureFlagService.toggleLock(id);
        return ResponseEntity.ok(ApiResponse.success("Lock toggled"));
    }

    @GetMapping("/{id}/impact")
    @Operation(summary = "Get impact analysis for a feature flag")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getImpact(@PathVariable UUID id) {
        Map<String, Object> impact = featureFlagService.getImpact(id);
        return ResponseEntity.ok(ApiResponse.success(impact));
    }
}
